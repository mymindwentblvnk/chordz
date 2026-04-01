/**
 * Animated Piano Component
 * Displays a piano keyboard and animates through chord progressions
 */

class AnimatedPiano {
    constructor(containerId, chords, chordNames) {
        this.container = document.getElementById(containerId);
        this.chords = chords; // Array of chord names like ['C', 'G', 'Am', 'F']
        this.chordNames = chordNames; // Array of chord names to display
        this.currentChordIndex = 0;
        this.isPlaying = true;

        // Load mute preference from localStorage, default to unmuted
        const savedMuteState = localStorage.getItem('piano-muted');
        this.isMuted = savedMuteState === null ? false : savedMuteState === 'true';

        this.speed = 2000; // milliseconds per chord
        this.intervalId = null;
        this.synth = null;
        this.octaveOffset = 0; // Offset from base octaves (3 and 4)

        this.init();
    }

    init() {
        this.render();
        this.updateOctaveDisplay();
        this.updateDisplay();
        this.startAnimation();
    }

    render() {
        const html = `
            <div class="piano-container">
                <div class="piano-header">
                    <div>
                        <div class="piano-title">🎹 Piano Visualization</div>
                        <div class="piano-current-chord" id="piano-current-chord-${this.container.id}">
                            ${this.chordNames[0]}
                        </div>
                    </div>
                    <div class="piano-controls">
                        <button class="piano-control-btn" id="piano-play-pause-${this.container.id}">
                            ⏸ Pause
                        </button>
                        <button class="piano-control-btn ${this.isMuted ? 'paused' : ''}" id="piano-mute-${this.container.id}">
                            ${this.isMuted ? '🔇 Muted' : '🔊 Sound On'}
                        </button>
                        <label class="piano-speed-label">Speed:</label>
                        <select class="piano-speed-select" id="piano-speed-${this.container.id}">
                            <option value="3000">Slow</option>
                            <option value="2000" selected>Normal</option>
                            <option value="1000">Fast</option>
                        </select>
                        <div class="piano-octave-controls">
                            <button class="piano-octave-btn" id="piano-octave-down-${this.container.id}" title="Lower octave">−</button>
                            <span class="piano-octave-label" id="piano-octave-label-${this.container.id}">C3-C5</span>
                            <button class="piano-octave-btn" id="piano-octave-up-${this.container.id}" title="Raise octave">+</button>
                        </div>
                    </div>
                </div>

                <div class="piano-keyboard" id="piano-keyboard-${this.container.id}">
                    ${this.renderOctaves()}
                </div>

                <div class="piano-notes-display">
                    <div class="piano-notes-label">Press these keys:</div>
                    <div class="piano-notes-list" id="piano-notes-${this.container.id}"></div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.attachEventListeners();
    }

    renderOctaves() {
        // Render 2 octaves based on octaveOffset
        // Base octaves are 3 and 4, offset shifts both up or down
        const leftOctave = 3 + this.octaveOffset;
        const rightOctave = 4 + this.octaveOffset;
        const endOctave = 5 + this.octaveOffset;

        // Highlight only in right octave
        // Keys are rendered in chromatic order so black keys can be positioned relative to white keys

        let html = '<div class="piano-octave">';

        // Helper function to render a key group (white key + optional black key after it)
        const renderKeyGroup = (noteName, hasSharp, octave, index) => {
            const isLeftOctave = octave === leftOctave;
            const isRightOctave = octave === rightOctave;
            const isEndNote = octave === endOctave;

            // Render white key
            const octaveClass = isEndNote ? `octave-end octave-${endOctave}` : (isLeftOctave ? `octave-${leftOctave}` : `octave-${rightOctave}`);
            const classes = `piano-key white ${octaveClass}`;
            html += `<div class="${classes}" data-note="${noteName}${octave}" data-key-index="${index}">
                <span class="piano-key-label">${noteName}</span>
            </div>`;

            // Render black key after this white key (if it has one)
            if (hasSharp && !isEndNote) {
                html += `<div class="piano-key black octave-${octave}" data-note="${noteName}#${octave}" data-key-index="${index}">
                    <span class="piano-key-label">${noteName}#</span>
                </div>`;
            }
        };

        // Render left octave
        let keyIndex = 0;
        renderKeyGroup('C', true, leftOctave, keyIndex++);
        renderKeyGroup('D', true, leftOctave, keyIndex++);
        renderKeyGroup('E', false, leftOctave, keyIndex++);
        renderKeyGroup('F', true, leftOctave, keyIndex++);
        renderKeyGroup('G', true, leftOctave, keyIndex++);
        renderKeyGroup('A', true, leftOctave, keyIndex++);
        renderKeyGroup('B', false, leftOctave, keyIndex++);

        // Render right octave
        renderKeyGroup('C', true, rightOctave, keyIndex++);
        renderKeyGroup('D', true, rightOctave, keyIndex++);
        renderKeyGroup('E', false, rightOctave, keyIndex++);
        renderKeyGroup('F', true, rightOctave, keyIndex++);
        renderKeyGroup('G', true, rightOctave, keyIndex++);
        renderKeyGroup('A', true, rightOctave, keyIndex++);
        renderKeyGroup('B', false, rightOctave, keyIndex++);

        // Add final C note
        renderKeyGroup('C', false, endOctave, keyIndex);

        html += '</div>';
        return html;
    }

    attachEventListeners() {
        // Initialize Tone.js synth
        if (typeof Tone !== 'undefined') {
            this.synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: 'sine'
                },
                envelope: {
                    attack: 0.005,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 1
                }
            }).toDestination();

            // Start audio context if not muted
            if (!this.isMuted) {
                Tone.start().catch(() => {
                    // If autoplay is blocked, mute by default and update UI
                    this.isMuted = true;
                    localStorage.setItem('piano-muted', 'true');
                    const muteBtn = document.getElementById(`piano-mute-${this.container.id}`);
                    if (muteBtn) {
                        muteBtn.textContent = '🔇 Muted';
                        muteBtn.classList.add('paused');
                    }
                });
            }
        }

        // Play/Pause button
        const playPauseBtn = document.getElementById(`piano-play-pause-${this.container.id}`);
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        // Mute button
        const muteBtn = document.getElementById(`piano-mute-${this.container.id}`);
        muteBtn.addEventListener('click', () => this.toggleMute());

        // Speed selector
        const speedSelect = document.getElementById(`piano-speed-${this.container.id}`);
        speedSelect.addEventListener('change', (e) => {
            this.speed = parseInt(e.target.value);
            if (this.isPlaying) {
                this.stopAnimation();
                this.startAnimation();
            }
        });

        // Octave shift buttons
        const octaveDownBtn = document.getElementById(`piano-octave-down-${this.container.id}`);
        const octaveUpBtn = document.getElementById(`piano-octave-up-${this.container.id}`);

        octaveDownBtn.addEventListener('click', () => {
            if (this.octaveOffset > -2) { // Limit to reasonable range (C1-C3 minimum)
                this.octaveOffset--;
                const wasPlaying = this.isPlaying;
                const wasMuted = this.isMuted;
                const currentSpeed = this.speed;

                if (wasPlaying) {
                    this.stopAnimation();
                }

                this.render();
                this.isPlaying = wasPlaying;
                this.isMuted = wasMuted;
                this.speed = currentSpeed;
                this.updateOctaveDisplay();
                this.updateDisplay();

                // Update button states
                this.updateButtonStates();

                if (wasPlaying) {
                    this.startAnimation();
                }
            }
        });

        octaveUpBtn.addEventListener('click', () => {
            if (this.octaveOffset < 3) { // Limit to reasonable range (C6-C8 maximum)
                this.octaveOffset++;
                const wasPlaying = this.isPlaying;
                const wasMuted = this.isMuted;
                const currentSpeed = this.speed;

                if (wasPlaying) {
                    this.stopAnimation();
                }

                this.render();
                this.isPlaying = wasPlaying;
                this.isMuted = wasMuted;
                this.speed = currentSpeed;
                this.updateOctaveDisplay();
                this.updateDisplay();

                // Update button states
                this.updateButtonStates();

                if (wasPlaying) {
                    this.startAnimation();
                }
            }
        });

        // Add click handlers to all piano keys
        const allKeys = this.container.querySelectorAll('.piano-key');
        allKeys.forEach(key => {
            key.addEventListener('click', () => {
                const noteData = key.getAttribute('data-note');
                // Extract note name and octave
                const match = noteData.match(/^([A-G]#?)(\d+)$/);
                if (match && this.synth) {
                    const noteName = match[1];
                    const octave = match[2];
                    // Play the note with its actual octave
                    this.playNote(noteName + octave);

                    // Visual feedback - briefly flash the key
                    key.classList.add('active');

                    // Also highlight the corresponding note in the notes list
                    const noteItem = this.container.querySelector(`.piano-note-item[data-note="${noteName}"]`);
                    if (noteItem) {
                        noteItem.classList.add('clicked');
                    }

                    setTimeout(() => {
                        // Only remove if it's not part of current chord
                        const currentNotes = getChordNotes(this.chords[this.currentChordIndex]);
                        const rightOctave = 4 + this.octaveOffset;
                        const isInCurrentChord = currentNotes.some(note => {
                            const normalizedNote = note.replace(/[0-9]/g, '');
                            return noteData === `${normalizedNote}${rightOctave}`;
                        });
                        if (!isInCurrentChord) {
                            key.classList.remove('active');
                        }

                        // Remove clicked highlight from note item
                        if (noteItem) {
                            noteItem.classList.remove('clicked');
                        }
                    }, 300);
                }
            });
        });
    }

    playNote(note) {
        if (!this.synth) return;
        this.synth.triggerAttackRelease(note, '0.3');
    }

    updateOctaveDisplay() {
        const leftOctave = 3 + this.octaveOffset;
        const endOctave = 5 + this.octaveOffset;
        const label = document.getElementById(`piano-octave-label-${this.container.id}`);
        if (label) {
            label.textContent = `C${leftOctave}-C${endOctave}`;
        }
    }

    updateButtonStates() {
        const playPauseBtn = document.getElementById(`piano-play-pause-${this.container.id}`);
        const muteBtn = document.getElementById(`piano-mute-${this.container.id}`);
        const speedSelect = document.getElementById(`piano-speed-${this.container.id}`);

        if (playPauseBtn) {
            if (this.isPlaying) {
                playPauseBtn.textContent = '⏸ Pause';
                playPauseBtn.classList.remove('paused');
            } else {
                playPauseBtn.textContent = '▶ Play';
                playPauseBtn.classList.add('paused');
            }
        }

        if (muteBtn) {
            if (this.isMuted) {
                muteBtn.textContent = '🔇 Muted';
                muteBtn.classList.add('paused');
            } else {
                muteBtn.textContent = '🔊 Sound On';
                muteBtn.classList.remove('paused');
            }
        }

        if (speedSelect) {
            speedSelect.value = this.speed.toString();
        }
    }

    updateDisplay() {
        const chord = this.chords[this.currentChordIndex];
        const chordName = this.chordNames[this.currentChordIndex];
        const notes = getChordNotes(chord);

        // Update current chord display
        document.getElementById(`piano-current-chord-${this.container.id}`).textContent = chordName;

        // Update notes list with individual spans for each note
        const notesList = document.getElementById(`piano-notes-${this.container.id}`);
        notesList.innerHTML = notes.map((note, index) => {
            const normalizedNote = note.replace(/[0-9]/g, '');
            return `<span class="piano-note-item" data-note="${normalizedNote}">${note}</span>`;
        }).join('<span class="piano-note-separator"> + </span>');

        // Clear all active keys
        const allKeys = this.container.querySelectorAll('.piano-key');
        allKeys.forEach(key => {
            key.classList.remove('active');
        });

        // Clear all active note items
        const allNoteItems = this.container.querySelectorAll('.piano-note-item');
        allNoteItems.forEach(item => {
            item.classList.remove('active');
        });

        // Highlight chord breakdown items (in the "Notes to Play" section)
        const allChordItems = document.querySelectorAll('.chord-item');
        allChordItems.forEach(item => {
            item.classList.remove('active-chord');
        });
        const currentChordItem = document.querySelector(`.chord-item[data-chord-index="${this.currentChordIndex}"]`);
        if (currentChordItem) {
            currentChordItem.classList.add('active-chord');
        }

        // Highlight only the 3 notes in the right octave (base octave 4 + offset)
        const rightOctave = 4 + this.octaveOffset;
        notes.forEach(note => {
            // Normalize the note (remove octave if present)
            const normalizedNote = note.replace(/[0-9]/g, '');

            // Find the key in right octave
            const key = this.container.querySelector(`.piano-key[data-note="${normalizedNote}${rightOctave}"]`);
            if (key) {
                key.classList.add('active');
            }

            // Highlight the note item
            const noteItem = this.container.querySelector(`.piano-note-item[data-note="${normalizedNote}"]`);
            if (noteItem) {
                noteItem.classList.add('active');
            }
        });

        // Play the chord sound if not muted
        if (!this.isMuted && this.synth) {
            this.playChord(notes);
        }
    }

    playChord(notes) {
        if (!this.synth) return;

        // Add octave number to notes for Tone.js (using right octave)
        const rightOctave = 4 + this.octaveOffset;
        const notesWithOctave = notes.map(note => {
            const normalizedNote = note.replace(/[0-9]/g, '');
            return normalizedNote + rightOctave;
        });

        // Play the chord
        this.synth.triggerAttackRelease(notesWithOctave, '0.5');
    }

    startAnimation() {
        this.intervalId = setInterval(() => {
            this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
            this.updateDisplay();
        }, this.speed);
    }

    stopAnimation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    togglePlayPause() {
        const btn = document.getElementById(`piano-play-pause-${this.container.id}`);

        if (this.isPlaying) {
            this.stopAnimation();
            btn.textContent = '▶ Play';
            btn.classList.add('paused');
        } else {
            this.startAnimation();
            btn.textContent = '⏸ Pause';
            btn.classList.remove('paused');
        }

        this.isPlaying = !this.isPlaying;
    }

    toggleMute() {
        const btn = document.getElementById(`piano-mute-${this.container.id}`);

        this.isMuted = !this.isMuted;

        // Save mute preference to localStorage
        localStorage.setItem('piano-muted', this.isMuted.toString());

        if (this.isMuted) {
            btn.textContent = '🔇 Muted';
            btn.classList.add('paused');
        } else {
            btn.textContent = '🔊 Sound On';
            btn.classList.remove('paused');
            // Start Tone.js audio context if needed
            if (this.synth && Tone.context.state !== 'running') {
                Tone.start();
            }
        }
    }

    updateChords(chords, chordNames) {
        this.chords = chords;
        this.chordNames = chordNames;
        this.currentChordIndex = 0;
        this.updateDisplay();
    }

    destroy() {
        this.stopAnimation();
        if (this.synth) {
            this.synth.dispose();
        }
    }
}
