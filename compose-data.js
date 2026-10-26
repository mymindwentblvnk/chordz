/**
 * Compose Data
 * Static content for the "Compose" decision tree:
 * moods, styles, modes (scales) and chord progressions (as scale degrees).
 *
 * Chord names, qualities and notes are NOT stored here - they are calculated
 * from the chosen scale in compose.js, so every chord is guaranteed to fit.
 */

// Modes (scales). Intervals are semitones above the root.
// "compare" tells the learner how to remember the mode relative to major/minor.
const COMPOSE_MODES = {
    ionian: {
        id: 'ionian',
        name: 'Major',
        alias: 'Ionian',
        intervals: [0, 2, 4, 5, 7, 9, 11],
        whiteKeyRoot: 0, // C
        compare: 'The standard major scale (W-W-H-W-W-W-H).',
        colorDegree: 3,
        colorLabel: 'the major 3rd',
        colorHint: 'The major 3rd is what makes the scale sound bright and happy.'
    },
    dorian: {
        id: 'dorian',
        name: 'Dorian',
        alias: 'Dorian',
        intervals: [0, 2, 3, 5, 7, 9, 10],
        whiteKeyRoot: 2, // D
        compare: 'Natural minor, but with a raised 6th.',
        colorDegree: 6,
        colorLabel: 'the raised 6th',
        colorHint: 'Lean on the raised 6th to get the bittersweet, hopeful Dorian color.'
    },
    phrygian: {
        id: 'phrygian',
        name: 'Phrygian',
        alias: 'Phrygian',
        intervals: [0, 1, 3, 5, 7, 8, 10],
        whiteKeyRoot: 4, // E
        compare: 'Natural minor, but with a lowered 2nd.',
        colorDegree: 2,
        colorLabel: 'the lowered 2nd',
        colorHint: 'The lowered 2nd (a half step above the root) is the dark, tense signature.'
    },
    lydian: {
        id: 'lydian',
        name: 'Lydian',
        alias: 'Lydian',
        intervals: [0, 2, 4, 6, 7, 9, 11],
        whiteKeyRoot: 5, // F
        compare: 'Major, but with a raised 4th.',
        colorDegree: 4,
        colorLabel: 'the raised 4th',
        colorHint: 'The raised 4th makes the major scale feel like it is floating.'
    },
    mixolydian: {
        id: 'mixolydian',
        name: 'Mixolydian',
        alias: 'Mixolydian',
        intervals: [0, 2, 4, 5, 7, 9, 10],
        whiteKeyRoot: 7, // G
        compare: 'Major, but with a lowered 7th.',
        colorDegree: 7,
        colorLabel: 'the lowered 7th',
        colorHint: 'The lowered 7th gives major a relaxed, groovy, slightly bluesy feel.'
    },
    aeolian: {
        id: 'aeolian',
        name: 'Natural Minor',
        alias: 'Aeolian',
        intervals: [0, 2, 3, 5, 7, 8, 10],
        whiteKeyRoot: 9, // A
        compare: 'The natural minor scale (W-H-W-W-H-W-W).',
        colorDegree: 6,
        colorLabel: 'the lowered 6th',
        colorHint: 'The lowered 6th (together with the minor 3rd) gives natural minor its sad, wistful sound.'
    }
};

// Step 1: moods and which scales express them.
// "modeNotes" explains why each mode fits that mood.
const COMPOSE_MOODS = [
    {
        id: 'melancholic',
        icon: '🌧️',
        name: 'Melancholic',
        blurb: 'Wistful, sad, reflective',
        modes: ['aeolian', 'dorian'],
        modeNotes: {
            aeolian: 'The classic sad sound. The safest start for melancholy.',
            dorian: 'Minor, but with a brighter 6th: bittersweet and hopeful. Popular in soul, funk and jazz.'
        },
        melodyTips: [
            'Move mostly by step (neighbouring scale notes) and let phrases fall.',
            'Stay in the lower to middle register and use longer notes.',
            'Land on the 3rd of the chord for the saddest color.'
        ]
    },
    {
        id: 'happy',
        icon: '☀️',
        name: 'Happy',
        blurb: 'Bright, cheerful, uplifting',
        modes: ['ionian', 'lydian', 'mixolydian'],
        modeNotes: {
            ionian: 'The standard major scale. Bright and familiar, the safest start for happy.',
            lydian: 'Major with a floating, wondrous shimmer.',
            mixolydian: 'Major with a relaxed, groovy edge.'
        },
        melodyTips: [
            'Use jumps (skip a scale note) and rising lines.',
            'Go higher and use shorter, bouncier notes.',
            'Land on the root or 5th of the chord for a confident, resolved feel.'
        ]
    },
    {
        id: 'dreamy',
        icon: '🌙',
        name: 'Dreamy',
        blurb: 'Floating, soft, atmospheric',
        modes: ['lydian', 'dorian', 'ionian'],
        modeNotes: {
            lydian: 'The floating major scale. The most dreamy of the three.',
            dorian: 'A soft minor with a gentle lift. Great with 7th chords.',
            ionian: 'Plain major, made dreamy by soft 7th chords and slow changes.'
        },
        melodyTips: [
            'Use long notes with lots of space between phrases.',
            'Hold a note over the chord change so it gets a new color.',
            'Aim for the 7th or 9th of the chord (the notes that are not in the basic triad).'
        ]
    },
    {
        id: 'dark',
        icon: '🌑',
        name: 'Dark & tense',
        blurb: 'Brooding, mysterious, uneasy',
        modes: ['phrygian', 'aeolian'],
        modeNotes: {
            phrygian: 'Minor with a lowered 2nd. Very dark and tense.',
            aeolian: 'Natural minor. Dark, but less extreme than Phrygian.'
        },
        melodyTips: [
            'Circle around the root and the lowered 2nd or 6th.',
            'Repeat a short, narrow motif again and again.',
            'Use low notes and leave long silences.'
        ]
    }
];

// Step 2: musical context. Drives the default chord type and practical tips.
const COMPOSE_STYLES = [
    {
        id: 'dnb',
        icon: '🥁',
        name: 'Drum & Bass',
        blurb: 'Fast drums, spacious harmony',
        ext: 'sevenths',
        tempo: 'about 170-175 BPM',
        tips: [
            'The drums bring the energy, so keep the harmony spacious: one chord per bar, or even one chord every two bars.',
            '7th chords (Am7 instead of Am) give a smooth, modern sound that sits well with the busy drums.',
            'In D&B the bassline defines the harmony: let the bass play the root of each chord.',
            'Keep the melody sparse and simple above the chords. Rests are your friend.'
        ]
    },
    {
        id: 'pop',
        icon: '🎤',
        name: 'Pop / Song',
        blurb: 'Clear chords, singable melody',
        ext: 'triads',
        tempo: 'about 90-130 BPM',
        tips: [
            'Simple triads are perfectly fine. Add 7ths later for color.',
            'Change chords once per bar or twice per bar.',
            'Give the melody a short, repeating hook.'
        ]
    },
    {
        id: 'lofi',
        icon: '☕',
        name: 'Lo-fi / Chill',
        blurb: 'Warm, relaxed, jazzy',
        ext: 'sevenths',
        tempo: 'about 70-90 BPM',
        tips: [
            '7th chords are the signature sound. Use them everywhere.',
            'Play the chords softly and slightly late for a relaxed feel.',
            'Let one chord ring for a whole bar.'
        ]
    },
    {
        id: 'cinematic',
        icon: '🎬',
        name: 'Cinematic',
        blurb: 'Slow, big, emotional',
        ext: 'triads',
        tempo: 'slow, about 60-80 BPM',
        tips: [
            'Play long, sustained chords and let them breathe.',
            'Put a single low root note in the left hand and the chord above it.',
            'Build tension by repeating the progression and adding more notes each round.'
        ]
    },
    {
        id: 'free',
        icon: '🎹',
        name: 'Just noodling',
        blurb: 'No genre, just exploring',
        ext: 'triads',
        tempo: 'any tempo you like',
        tips: [
            'Start with triads, then add 7ths when you feel ready.',
            'Loop the progression and improvise over it for a few minutes.',
            'Record yourself on your phone and keep the best idea.'
        ]
    }
];

// Step 5: chord progressions as scale degrees (1 = root ... 7 = seventh scale degree).
// Chord quality (major/minor/diminished) is calculated from the scale.
const COMPOSE_PROGRESSIONS = {
    aeolian: [
        { name: 'Epic anthem', degrees: [1, 6, 3, 7], note: 'Big and emotional, rises and falls. A great first choice.' },
        { name: 'Wistful loop', degrees: [1, 4, 7, 3], note: 'Gentle and reflective. Works well as a long loop.' },
        { name: 'Calm rocking', degrees: [1, 7, 6, 7], note: 'Moves back and forth between neighbouring chords. Very calm.' },
        { name: 'Slow descent', degrees: [1, 7, 6, 5], note: 'The chords step down one by one, like a sigh.' }
    ],
    dorian: [
        { name: 'Dorian vamp', degrees: [1, 4], note: 'Two chords only. The major IV chord is the Dorian signature.' },
        { name: 'Soft step', degrees: [1, 7], note: 'Two chords. Stable, groovy and very loopable.' },
        { name: 'Bright minor', degrees: [1, 3, 4, 7], note: 'Minor home with a bright, hopeful lift.' }
    ],
    phrygian: [
        { name: 'Dark step', degrees: [1, 2], note: 'The major chord a half step above the root is the dark signature.' },
        { name: 'Brooding loop', degrees: [1, 2, 1, 7], note: 'Returns home between the dark chords.' }
    ],
    ionian: [
        { name: 'Classic pop', degrees: [1, 5, 6, 4], note: 'The most used progression in pop music. Bright and familiar.' },
        { name: 'Bittersweet', degrees: [6, 4, 1, 5], note: 'Starts on the minor vi chord, so it feels wistful even in a major key.' },
        { name: "'50s progression", degrees: [1, 6, 4, 5], note: 'Warm and nostalgic.' },
        { name: 'Dreamy flow', degrees: [1, 3, 6, 4], note: 'Glides smoothly between related chords.' }
    ],
    lydian: [
        { name: 'Floating', degrees: [1, 2], note: 'Two chords. The major II chord contains the raised 4th, the Lydian signature.' },
        { name: 'Wonder', degrees: [1, 2, 6, 5], note: 'Starts floating, then resolves downwards.' }
    ],
    mixolydian: [
        { name: 'Rock groove', degrees: [1, 7], note: 'Two chords. The major chord a whole step below the root is the Mixolydian signature.' },
        { name: 'Open road', degrees: [1, 7, 4, 1], note: 'Relaxed and driving. Returns home at the end.' }
    ]
};

// Rhythm ideas for the motif generator (plain text so it is easy to read on any device).
const COMPOSE_RHYTHMS = [
    'long - short - short - long',
    'short - short - long - long',
    'long - long - short - short',
    'short - long - short - long'
];

// Keys shown as buttons (pitch class index 0-11).
const COMPOSE_ROOT_LABELS = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
