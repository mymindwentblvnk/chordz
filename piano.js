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
        this.isMuted = true; // Default to muted
        this.speed = 2000; // milliseconds per chord
        this.intervalId = null;
        this.synth = null;

        this.init();
    }

    init() {
        this.render();
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
                        <button class="piano-control-btn" id="piano-mute-${this.container.id}">
                            🔇 Muted
                        </button>
                        <label class="piano-speed-label">Speed:</label>
                        <select class="piano-speed-select" id="piano-speed-${this.container.id}">
                            <option value="3000">Slow</option>
                            <option value="2000" selected>Normal</option>
                            <option value="1000">Fast</option>
                        </select>
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
        // Render 2 octaves: C2-B2 (left) and C3-C4 (right, with ending C4)
        // Highlight only in right octave (C3-C4)
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const sharps = ['C#', 'D#', 'F#', 'G#', 'A#'];

        let html = '<div class="piano-octave">';

        // Render white keys for octave 2 (left octave)
        for (const note of notes) {
            html += `<div class="piano-key white octave-2" data-note="${note}2">
                <span class="piano-key-label">${note}</span>
            </div>`;
        }

        // Render white keys for octave 3 (right octave)
        for (const note of notes) {
            html += `<div class="piano-key white octave-3" data-note="${note}3">
                <span class="piano-key-label">${note}</span>
            </div>`;
        }

        // Add the final C4
        html += `<div class="piano-key white octave-end octave-4" data-note="C4">
            <span class="piano-key-label">C</span>
        </div>`;

        // Render black keys for octave 2 (left octave)
        for (const note of sharps) {
            html += `<div class="piano-key black octave-2" data-note="${note}2">
                <span class="piano-key-label">${note}</span>
            </div>`;
        }

        // Render black keys for octave 3 (right octave)
        for (const note of sharps) {
            html += `<div class="piano-key black octave-3" data-note="${note}3">
                <span class="piano-key-label">${note}</span>
            </div>`;
        }

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
                    // Play the note (using octave 4 for consistent sound)
                    this.playNote(noteName + '4');

                    // Visual feedback - briefly flash the key
                    key.classList.add('active');
                    setTimeout(() => {
                        // Only remove if it's not part of current chord
                        const currentNotes = getChordNotes(this.chords[this.currentChordIndex]);
                        const isInCurrentChord = currentNotes.some(note => {
                            const normalizedNote = note.replace(/[0-9]/g, '');
                            return noteData === `${normalizedNote}3`;
                        });
                        if (!isInCurrentChord) {
                            key.classList.remove('active');
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

    updateDisplay() {
        const chord = this.chords[this.currentChordIndex];
        const chordName = this.chordNames[this.currentChordIndex];
        const notes = getChordNotes(chord);

        // Update current chord display
        document.getElementById(`piano-current-chord-${this.container.id}`).textContent = chordName;

        // Update notes list
        document.getElementById(`piano-notes-${this.container.id}`).textContent = notes.join(' + ');

        // Clear all active keys
        const allKeys = this.container.querySelectorAll('.piano-key');
        allKeys.forEach(key => {
            key.classList.remove('active');
        });

        // Highlight only the 3 notes in the middle octave (octave 3)
        notes.forEach(note => {
            // Normalize the note (remove octave if present)
            const normalizedNote = note.replace(/[0-9]/g, '');

            // Find the key in octave 3 (middle octave)
            const key = this.container.querySelector(`.piano-key[data-note="${normalizedNote}3"]`);
            if (key) {
                key.classList.add('active');
            }
        });

        // Play the chord sound if not muted
        if (!this.isMuted && this.synth) {
            this.playChord(notes);
        }
    }

    playChord(notes) {
        if (!this.synth) return;

        // Add octave number to notes for Tone.js (using octave 4 for middle range)
        const notesWithOctave = notes.map(note => {
            const normalizedNote = note.replace(/[0-9]/g, '');
            return normalizedNote + '4';
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
