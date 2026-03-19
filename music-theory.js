/**
 * Music Theory Module
 * Handles note transposition and chord calculation
 */

// Chromatic scale using sharps
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Map flats to their sharp equivalents for normalization
const ENHARMONIC_MAP = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
};

// Major scale intervals (in semitones from root)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

// Natural minor scale intervals (in semitones from root)
const MINOR_SCALE_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

/**
 * Normalize a note name to use sharps
 * @param {string} note - Note name (e.g., "C", "Db", "F#")
 * @returns {string} Normalized note name
 */
function normalizeNote(note) {
    return ENHARMONIC_MAP[note] || note;
}

/**
 * Get a note at a specific interval from the root
 * @param {string} root - Root note
 * @param {number} semitones - Number of semitones from root
 * @returns {string} The resulting note
 */
function getNoteAtInterval(root, semitones) {
    const normalizedRoot = normalizeNote(root);
    const rootIndex = CHROMATIC_SCALE.indexOf(normalizedRoot);

    if (rootIndex === -1) {
        throw new Error(`Invalid note: ${root}`);
    }

    const targetIndex = (rootIndex + semitones) % 12;
    return CHROMATIC_SCALE[targetIndex];
}

/**
 * Parse a Roman numeral chord symbol
 * @param {string} romanNumeral - Roman numeral (e.g., "I", "iv", "V", "vii°")
 * @returns {object} Object with degree (0-6) and quality (major/minor/diminished)
 */
function parseRomanNumeral(romanNumeral) {
    const romanToNumber = {
        'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
        'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6
    };

    // Check for diminished chord (°)
    const isDiminished = romanNumeral.includes('°');
    const cleanNumeral = romanNumeral.replace('°', '');

    // Determine if it's major or minor based on case
    const isMajor = cleanNumeral === cleanNumeral.toUpperCase();
    const quality = isDiminished ? 'diminished' : (isMajor ? 'major' : 'minor');

    const degree = romanToNumber[cleanNumeral];

    if (degree === undefined) {
        throw new Error(`Invalid Roman numeral: ${romanNumeral}`);
    }

    return { degree, quality };
}

/**
 * Convert a Roman numeral to an actual chord name
 * @param {string} romanNumeral - Roman numeral chord symbol
 * @param {string} rootNote - Root note of the key
 * @param {string} keyMode - 'major' or 'minor'
 * @returns {string} Chord name (e.g., "C", "Am", "Bdim")
 */
function romanNumeralToChord(romanNumeral, rootNote, keyMode = 'major') {
    const { degree, quality } = parseRomanNumeral(romanNumeral);
    const scaleIntervals = keyMode === 'major' ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;

    // Get the root note of this chord
    const chordRoot = getNoteAtInterval(rootNote, scaleIntervals[degree]);

    // Add quality suffix
    if (quality === 'minor') {
        return chordRoot + 'm';
    } else if (quality === 'diminished') {
        return chordRoot + 'dim';
    } else {
        return chordRoot; // Major chords have no suffix
    }
}

/**
 * Transpose an entire chord progression to a specific key
 * @param {array} progression - Array of Roman numerals
 * @param {string} rootNote - Root note of the key
 * @param {string} keyMode - 'major' or 'minor' (auto-detected from first chord if not provided)
 * @returns {array} Array of actual chord names
 */
function transposeProgression(progression, rootNote, keyMode = null) {
    // Auto-detect key mode from first chord if not specified
    if (!keyMode) {
        const firstChord = progression[0];
        keyMode = firstChord === firstChord.toUpperCase() && !firstChord.includes('°') ? 'major' : 'minor';
    }

    return progression.map(romanNumeral =>
        romanNumeralToChord(romanNumeral, rootNote, keyMode)
    );
}

/**
 * Parse a chord name to extract root and quality
 * @param {string} chordName - Chord name (e.g., "C", "Am", "F#m", "Bdim")
 * @returns {object} Object with root and quality
 */
function parseChordName(chordName) {
    // Check for diminished
    if (chordName.endsWith('dim')) {
        return {
            root: chordName.slice(0, -3),
            quality: 'diminished'
        };
    }
    // Check for minor
    if (chordName.endsWith('m')) {
        return {
            root: chordName.slice(0, -1),
            quality: 'minor'
        };
    }
    // Otherwise it's major
    return {
        root: chordName,
        quality: 'major'
    };
}

/**
 * Get the individual notes that make up a chord
 * @param {string} chordName - Chord name (e.g., "C", "Am", "F#m", "Bdim")
 * @returns {array} Array of note names in the chord
 */
function getChordNotes(chordName) {
    const { root, quality } = parseChordName(chordName);

    // Define intervals for each chord type (in semitones)
    const intervals = {
        'major': [0, 4, 7],        // Root, major third, perfect fifth
        'minor': [0, 3, 7],        // Root, minor third, perfect fifth
        'diminished': [0, 3, 6]    // Root, minor third, diminished fifth
    };

    const chordIntervals = intervals[quality];

    // Calculate each note in the chord
    return chordIntervals.map(interval => getNoteAtInterval(root, interval));
}

/**
 * Get all available notes for the selector
 * @returns {array} Array of note objects with display names
 */
function getAllNotes() {
    return [
        { value: 'C', display: 'C' },
        { value: 'C#', display: 'C# / Db' },
        { value: 'D', display: 'D' },
        { value: 'D#', display: 'D# / Eb' },
        { value: 'E', display: 'E' },
        { value: 'F', display: 'F' },
        { value: 'F#', display: 'F# / Gb' },
        { value: 'G', display: 'G' },
        { value: 'G#', display: 'G# / Ab' },
        { value: 'A', display: 'A' },
        { value: 'A#', display: 'A# / Bb' },
        { value: 'B', display: 'B' }
    ];
}
