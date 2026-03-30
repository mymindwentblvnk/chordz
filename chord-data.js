/**
 * Chord Progression Database
 * Contains pre-defined chord progressions with moods and descriptions
 */

const CHORD_PROGRESSIONS = [
    {
        name: "Classic Pop Progression",
        progression: ["I", "V", "vi", "IV"],
        mood: ["happy", "uplifting"],
        keyMode: "major",
        description: "The most popular chord progression in modern pop music. Used in countless hits like 'Let It Be', 'Don't Stop Believin'', and 'Someone Like You'. Bright and memorable."
    },
    {
        name: "Emotional Ballad",
        progression: ["vi", "IV", "I", "V"],
        mood: ["sad", "melancholic"],
        keyMode: "major",
        description: "A touching progression that starts on the minor vi chord, creating an emotional and introspective feel. Perfect for heartfelt ballads and emotional storytelling."
    },
    {
        name: "Epic Minor Anthem",
        progression: ["i", "VI", "III", "VII"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        description: "A powerful minor key progression with dramatic movement. Creates an epic, cinematic atmosphere often used in film scores and dramatic rock songs."
    },
    {
        name: "Classic '50s Progression",
        progression: ["I", "vi", "IV", "V"],
        mood: ["happy", "uplifting"],
        keyMode: "major",
        description: "The quintessential doo-wop and early rock 'n' roll progression. Cheerful and nostalgic, used in classics like 'Stand By Me' and 'Every Breath You Take'."
    },
    {
        name: "Minor Blues Feel",
        progression: ["i", "iv", "VII", "VI"],
        mood: ["melancholic", "sad"],
        keyMode: "minor",
        description: "A bluesy minor progression with a walking bassline feel. Creates a somber, reflective mood with hints of blues and soul traditions."
    },
    {
        name: "Bright and Warm",
        progression: ["I", "IV", "vi", "V"],
        mood: ["happy", "uplifting"],
        keyMode: "major",
        description: "An optimistic progression with a warm, comfortable feel. The IV chord adds brightness while the vi creates gentle emotional depth."
    },
    {
        name: "Dark Tension",
        progression: ["i", "VII", "VI", "V"],
        mood: ["unsettling"],
        keyMode: "minor",
        description: "A minor progression with building tension through the descending chords. The major V at the end creates unresolved energy and drama."
    },
    {
        name: "Dreamy Flow",
        progression: ["I", "iii", "vi", "IV"],
        mood: ["dreamy", "uplifting"],
        keyMode: "major",
        description: "A smooth, flowing progression that glides through related chords. Creates an ethereal, dreamlike atmosphere perfect for ambient and chill music."
    },
    {
        name: "Jazz Standard Cadence",
        progression: ["ii", "V", "I"],
        mood: ["uplifting"],
        keyMode: "major",
        description: "The fundamental jazz progression, also called the ii-V-I turnaround. Sophisticated and smooth, this is the backbone of jazz harmony and creates strong resolution."
    },
    {
        name: "Cinematic Minor",
        progression: ["i", "III", "VII", "iv"],
        mood: ["melancholic", "epic"],
        keyMode: "minor",
        description: "A dramatic minor progression with cinematic qualities. The movement from III to VII creates sweeping emotional gestures perfect for film and storytelling."
    },
    {
        name: "Andalusian Cadence",
        progression: ["i", "VII", "VI", "V"],
        mood: ["unsettling"],
        keyMode: "minor",
        description: "An ancient progression with roots in flamenco and baroque music. Creates a mysterious, exotic feel with strong Spanish and Mediterranean character."
    },
    {
        name: "Uplifting Major Anthem",
        progression: ["I", "V", "IV", "V"],
        mood: ["happy", "uplifting"],
        keyMode: "major",
        description: "A driving, anthemic progression that builds energy and excitement. The repeated V chord creates momentum and forward motion."
    },
    {
        name: "Melancholic Descent",
        progression: ["i", "VI", "iv", "V"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        description: "A descending progression in minor that creates a gentle, falling sensation. Deeply emotional and introspective with classical influences."
    },
    {
        name: "Mysterious Atmosphere",
        progression: ["i", "III", "VI", "VII"],
        mood: ["unsettling"],
        keyMode: "minor",
        description: "An enigmatic progression that avoids the V chord, creating an unresolved, floating quality. Perfect for mystery, suspense, and atmospheric music."
    },
    {
        name: "Energetic Drive",
        progression: ["I", "IV", "I", "V"],
        mood: ["happy", "uplifting"],
        keyMode: "major",
        description: "A high-energy progression that alternates between the tonic and dominant areas. Creates driving momentum perfect for rock and upbeat pop."
    },
    {
        name: "Tense Suspense",
        progression: ["i", "ii", "V", "i"],
        mood: ["unsettling"],
        keyMode: "minor",
        description: "A progression that builds tension through the diminished ii chord and major V, creating suspense and drama before resolving back to i."
    },
    {
        name: "Royal Progression",
        progression: ["I", "IV", "V", "IV"],
        mood: ["uplifting"],
        keyMode: "major",
        description: "A regal, triumphant progression that moves through the primary chords. Creates a sense of majesty and celebration, common in anthems and celebratory music."
    },
    {
        name: "Bittersweet Journey",
        progression: ["I", "vi", "ii", "V"],
        mood: ["dreamy", "melancholic"],
        keyMode: "major",
        description: "A progression that balances light and shadow, moving from major to minor territories. Creates a bittersweet, reflective mood with gentle sophistication."
    },
    {
        name: "Chromatic Descent",
        progression: ["I", "VII", "VI", "V"],
        mood: ["unsettling"],
        keyMode: "major",
        description: "A chromatic walkdown from the tonic. The VII (major) is borrowed from the parallel minor, creating an uneasy, descending feeling that defies expectations."
    },
    {
        name: "Diminished Chaos",
        progression: ["i", "vii°", "VI", "vii°"],
        mood: ["uncomfortable"],
        keyMode: "minor",
        description: "Heavy use of the unstable diminished chord creates tension and unease. The lack of resolution and repeated dissonance creates an anxious, uncomfortable atmosphere."
    },
    {
        name: "Tritone Substitution",
        progression: ["I", "II", "I", "II"],
        mood: ["uncomfortable"],
        keyMode: "major",
        description: "The II major chord (borrowed from modal mixture) creates a jarring tritone relationship. This oscillation between stable and unstable feels wrong and unsettling."
    },
    {
        name: "Chromatic Mediant Shift",
        progression: ["I", "III", "I", "III"],
        mood: ["unsettling"],
        keyMode: "major",
        description: "The major III chord (not iii) creates a chromatic mediant relationship - a dramatic, film-score-like shift that sounds alien and unexpected."
    },
    {
        name: "Parallel Minor Invasion",
        progression: ["I", "iv", "I", "iv"],
        mood: ["uncomfortable"],
        keyMode: "major",
        description: "The minor iv borrowed from parallel minor creates modal mixture. This major-minor oscillation feels unstable and psychologically unsettling."
    },
    {
        name: "Augmented Terror",
        progression: ["I", "III", "VI", "ii"],
        mood: ["uncomfortable"],
        keyMode: "major",
        description: "All major chords create augmented relationships (4 semitones apart). This symmetrical division sounds dreamlike yet disturbing, like a Salvador Dalí painting."
    },
    {
        name: "Whole Tone Wandering",
        progression: ["I", "II", "III", "IV"],
        mood: ["dreamy", "uncomfortable"],
        keyMode: "major",
        description: "All major chords moving in whole tones. Destroys the sense of key center - sounds floating, directionless, and surreal. Very experimental."
    },
    {
        name: "Phrygian Nightmare",
        progression: ["i", "II", "i", "II"],
        mood: ["unsettling"],
        keyMode: "minor",
        description: "The Phrygian II (major chord on the flattened second) creates an exotic, menacing quality. Common in metal and horror soundtracks."
    },
    {
        name: "Deceptive Loop",
        progression: ["I", "vi", "VII", "III"],
        mood: ["uncomfortable"],
        keyMode: "major",
        description: "Expected resolutions are constantly denied. The VII and major III are borrowed chords that create a cycle that never truly resolves - musically frustrating."
    },
    {
        name: "Chromatic Nightmare",
        progression: ["i", "II", "III", "iv"],
        mood: ["uncomfortable"],
        keyMode: "minor",
        description: "Chromatic ascent mixing major and minor chords. Each chord contradicts the last, creating harmonic chaos and maximum instability."
    },
    {
        name: "Lydian Strangeness",
        progression: ["I", "II", "I", "vii°"],
        mood: ["uncomfortable"],
        keyMode: "major",
        description: "Uses the raised fourth (Lydian mode). The II major and vii° create floating, otherworldly quality. Sounds futuristic and alien."
    },
    {
        name: "Non-Functional Drift",
        progression: ["I", "VII", "IV", "III"],
        mood: ["unsettling"],
        keyMode: "major",
        description: "Completely abandons functional harmony. Chords don't follow any traditional pattern - they just drift. Sounds avant-garde and unpredictable."
    },
    {
        name: "Locrian Madness",
        progression: ["i°", "II", "III", "iv"],
        mood: ["uncomfortable"],
        keyMode: "minor",
        description: "Built on the unstable Locrian mode with a diminished tonic. Every chord feels wrong because there's no stable home. Pure harmonic anxiety."
    },
    {
        name: "Chromatic Parallelism",
        progression: ["I", "i", "VII", "vii°"],
        mood: ["unsettling"],
        keyMode: "major",
        description: "Parallel major/minor shifts combined with chromatic movement. Creates a shadowy, doppelgänger effect - familiar yet disturbing."
    },
    {
        name: "Borrowed Chord Assault",
        progression: ["I", "IV", "iv", "I"],
        mood: ["uncomfortable"],
        keyMode: "major",
        description: "The sudden shift from IV to iv (major to minor) creates harmonic whiplash. The brightness crashes into darkness abruptly."
    }
];
