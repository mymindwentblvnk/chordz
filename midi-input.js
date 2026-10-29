// Shared MIDI input for the trainings.
// Lets a connected MIDI keyboard replace the microphone as the note source.
// Uses the Web MIDI API (Chrome, Edge, Opera, Firefox; not Safari).
const INPUT_MODE_KEY = 'chordz-input-mode'; // 'mic' | 'midi'
const MIDI_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function midiNoteToName(midiNumber) {
    return MIDI_NOTE_NAMES[midiNumber % 12];
}

function loadInputMode() {
    if (!MidiInput.isSupported()) return 'mic';
    try {
        return localStorage.getItem(INPUT_MODE_KEY) === 'midi' ? 'midi' : 'mic';
    } catch (e) {
        return 'mic';
    }
}

function saveInputMode(mode) {
    try {
        localStorage.setItem(INPUT_MODE_KEY, mode);
    } catch (e) {
        console.error('Failed to save input mode:', e);
    }
}

function renderInputModeToggle(btn, hintEl, mode) {
    if (!MidiInput.isSupported()) {
        btn.textContent = 'Mic';
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.style.background = '#6b7280';
        if (hintEl) hintEl.textContent = 'MIDI is not supported in this browser (try Chrome, Edge or Firefox)';
        return;
    }
    btn.textContent = mode === 'midi' ? 'MIDI' : 'Mic';
    btn.style.background = mode === 'midi' ? 'var(--primary-color)' : '#6b7280';
    if (hintEl) hintEl.textContent = mode === 'midi'
        ? 'notes come from your MIDI keyboard'
        : 'notes are detected via the microphone';
}

class MidiInput {
    static isSupported() {
        return typeof navigator !== 'undefined' && typeof navigator.requestMIDIAccess === 'function';
    }

    constructor() {
        this.access = null;
        this.onNote = null;
        this.onDevices = null;
        this.synth = null;
        this._messageHandler = (event) => this._handleMessage(event);
    }

    // onNote(noteName, midiNumber) is called for every key press (note-on).
    // onDevices(names[]) is called whenever the list of connected inputs changes.
    async start(onNote, onDevices) {
        this.onNote = onNote;
        this.onDevices = onDevices || null;
        if (!this.access) {
            this.access = await navigator.requestMIDIAccess();
        }
        await this._startSynth();
        this.access.onstatechange = () => this._attach();
        this._attach();
    }

    // Play the pressed keys through the Tone.js synth so you can hear what you play.
    async _startSynth() {
        if (typeof Tone === 'undefined' || this.synth) return;
        try {
            await Tone.start();
            // Keep the delay between key press and sound as short as possible
            if (Tone.context && 'lookAhead' in Tone.context) Tone.context.lookAhead = 0.02;
            this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        } catch (e) {
            console.error('Could not start MIDI synth:', e);
            this.synth = null;
        }
    }

    _playNote(midiNumber, velocity) {
        if (!this.synth) return;
        try {
            this.synth.triggerAttack(Tone.Frequency(midiNumber, 'midi').toNote(), Tone.now(), Math.max(0.1, velocity / 127));
        } catch (e) {
            console.error('Synth attack failed:', e);
        }
    }

    _releaseNote(midiNumber) {
        if (!this.synth) return;
        try {
            this.synth.triggerRelease(Tone.Frequency(midiNumber, 'midi').toNote(), Tone.now());
        } catch (e) {
            console.error('Synth release failed:', e);
        }
    }

    _attach() {
        if (!this.access) return;
        const names = [];
        for (const input of this.access.inputs.values()) {
            input.onmidimessage = this._messageHandler;
            names.push(input.name || 'MIDI device');
        }
        if (this.onDevices) this.onDevices(names);
    }

    _handleMessage(event) {
        const [status, note, velocity] = event.data;
        const type = status & 0xF0;
        const isDrumChannel = (status & 0x0F) === 9; // channel 10 = drum pads
        if (isDrumChannel) return;

        const isNoteOn = type === 0x90 && velocity > 0;
        const isNoteOff = type === 0x80 || (type === 0x90 && velocity === 0);

        if (isNoteOn) {
            this._playNote(note, velocity);
            if (this.onNote) this.onNote(midiNoteToName(note), note);
        } else if (isNoteOff) {
            this._releaseNote(note);
        }
    }

    stop() {
        if (this.access) {
            for (const input of this.access.inputs.values()) {
                input.onmidimessage = null;
            }
            this.access.onstatechange = null;
        }
        if (this.synth) {
            try {
                this.synth.releaseAll();
                this.synth.dispose();
            } catch (e) {
                console.error('Failed to dispose MIDI synth:', e);
            }
            this.synth = null;
        }
        this.onNote = null;
        this.onDevices = null;
    }
}
