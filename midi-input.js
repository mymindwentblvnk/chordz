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
        this.access.onstatechange = () => this._attach();
        this._attach();
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
        const isNoteOn = (status & 0xF0) === 0x90 && velocity > 0;
        const isDrumChannel = (status & 0x0F) === 9; // channel 10 = drum pads
        if (isNoteOn && !isDrumChannel && this.onNote) {
            this.onNote(midiNoteToName(note), note);
        }
    }

    stop() {
        if (this.access) {
            for (const input of this.access.inputs.values()) {
                input.onmidimessage = null;
            }
            this.access.onstatechange = null;
        }
        this.onNote = null;
        this.onDevices = null;
    }
}
