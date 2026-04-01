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
        this.isRandomMode = false; // Random rhythm mode
        this.speed = 2000; // milliseconds per chord
        this.intervalId = null;
        this.randomTimeoutId = null;
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
                        <button class="piano-control-btn" id="piano-random-${this.container.id}">
                            🎲 Random Play
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
        // Render 3 octaves (octave 0, 1, 2) - highlight only in octave 1
        // Plus an extra C at the end (C from octave 3)
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const sharps = ['C#', 'D#', 'F#', 'G#', 'A#'];

        let html = '<div class="piano-octave">';

        // Render white keys for 3 octaves
        for (let octave = 0; octave < 3; octave++) {
            for (const note of notes) {
                html += `<div class="piano-key white" data-note="${note}${octave}">
                    <span class="piano-key-label">${note}</span>
                </div>`;
            }
        }

        // Add the final C from octave 3
        html += `<div class="piano-key white octave-end" data-note="C3">
            <span class="piano-key-label">C</span>
        </div>`;

        // Render black keys for 3 octaves
        for (let octave = 0; octave < 3; octave++) {
            for (const note of sharps) {
                html += `<div class="piano-key black" data-note="${note}${octave}">
                    <span class="piano-key-label">${note}</span>
                </div>`;
            }
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

        // Random mode button
        const randomBtn = document.getElementById(`piano-random-${this.container.id}`);
        randomBtn.addEventListener('click', () => this.toggleRandomMode());

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
                            return noteData === `${normalizedNote}1`;
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

        // Highlight only the 3 notes in the middle octave (octave 1)
        notes.forEach(note => {
            // Normalize the note (remove octave if present)
            const normalizedNote = note.replace(/[0-9]/g, '');

            // Find the key in octave 1 (middle octave)
            const key = this.container.querySelector(`.piano-key[data-note="${normalizedNote}1"]`);
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
        if (this.isRandomMode) {
            this.startRandomMode();
        } else {
            this.intervalId = setInterval(() => {
                this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
                this.updateDisplay();
            }, this.speed);
        }
    }

    stopAnimation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        if (this.randomTimeoutId) {
            clearTimeout(this.randomTimeoutId);
            this.randomTimeoutId = null;
        }
    }

    startRandomMode() {
        const playRandomChord = () => {
            // Pick a random chord
            this.currentChordIndex = Math.floor(Math.random() * this.chords.length);
            this.updateDisplay();

            // Random delay between 300ms and 2000ms
            const randomDelay = Math.floor(Math.random() * 1700) + 300;
            this.randomTimeoutId = setTimeout(playRandomChord, randomDelay);
        };

        playRandomChord();
    }

    toggleRandomMode() {
        const btn = document.getElementById(`piano-random-${this.container.id}`);

        this.isRandomMode = !this.isRandomMode;

        if (this.isRandomMode) {
            btn.textContent = '🎲 Stop Random';
            btn.style.background = 'var(--accent-energetic)';

            // Stop regular animation and start random mode
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.startRandomMode();

            // Update play/pause button
            const playPauseBtn = document.getElementById(`piano-play-pause-${this.container.id}`);
            playPauseBtn.textContent = '⏸ Pause';
            playPauseBtn.classList.remove('paused');
            this.isPlaying = true;
        } else {
            btn.textContent = '🎲 Random Play';
            btn.style.background = '';

            // Stop random mode
            if (this.randomTimeoutId) {
                clearTimeout(this.randomTimeoutId);
                this.randomTimeoutId = null;
            }

            // Resume regular animation if playing
            if (this.isPlaying) {
                this.startAnimation();
            }
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
