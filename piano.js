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
        this.speed = 2000; // milliseconds per chord
        this.intervalId = null;

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
        // Render 1 octave (C to B)
        const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const sharps = ['C#', 'D#', 'F#', 'G#', 'A#'];

        let html = '<div class="piano-octave">';

        // Render white keys for 1 octave
        for (const note of notes) {
            html += `<div class="piano-key white" data-note="${note}0">
                <span class="piano-key-label">${note}</span>
            </div>`;
        }

        // Render black keys for 1 octave
        for (const note of sharps) {
            html += `<div class="piano-key black" data-note="${note}0">
                <span class="piano-key-label">${note}</span>
            </div>`;
        }

        html += '</div>';
        return html;
    }

    attachEventListeners() {
        // Play/Pause button
        const playPauseBtn = document.getElementById(`piano-play-pause-${this.container.id}`);
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());

        // Speed selector
        const speedSelect = document.getElementById(`piano-speed-${this.container.id}`);
        speedSelect.addEventListener('change', (e) => {
            this.speed = parseInt(e.target.value);
            if (this.isPlaying) {
                this.stopAnimation();
                this.startAnimation();
            }
        });
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

        // Highlight only the 3 notes in the single octave
        notes.forEach(note => {
            // Normalize the note (remove octave if present)
            const normalizedNote = note.replace(/[0-9]/g, '');

            // Find the key in octave 0
            const key = this.container.querySelector(`.piano-key[data-note="${normalizedNote}0"]`);
            if (key) {
                key.classList.add('active');
            }
        });
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

    updateChords(chords, chordNames) {
        this.chords = chords;
        this.chordNames = chordNames;
        this.currentChordIndex = 0;
        this.updateDisplay();
    }

    destroy() {
        this.stopAnimation();
    }
}
