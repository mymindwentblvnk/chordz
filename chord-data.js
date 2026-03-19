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
        mood: ["dark", "epic"],
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
        mood: ["melancholic", "dark"],
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
        mood: ["dark", "tense"],
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
        mood: ["dark", "mysterious"],
        keyMode: "minor",
        description: "An ancient progression with roots in flamenco and baroque music. Creates a mysterious, exotic feel with strong Spanish and Mediterranean character."
    },
    {
        name: "Uplifting Major Anthem",
        progression: ["I", "V", "IV", "V"],
        mood: ["happy", "energetic"],
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
        mood: ["mysterious", "dark"],
        keyMode: "minor",
        description: "An enigmatic progression that avoids the V chord, creating an unresolved, floating quality. Perfect for mystery, suspense, and atmospheric music."
    },
    {
        name: "Energetic Drive",
        progression: ["I", "IV", "I", "V"],
        mood: ["energetic", "happy"],
        keyMode: "major",
        description: "A high-energy progression that alternates between the tonic and dominant areas. Creates driving momentum perfect for rock and upbeat pop."
    },
    {
        name: "Tense Suspense",
        progression: ["i", "ii", "V", "i"],
        mood: ["tense", "dark"],
        keyMode: "minor",
        description: "A progression that builds tension through the diminished ii chord and major V, creating suspense and drama before resolving back to i."
    },
    {
        name: "Royal Progression",
        progression: ["I", "IV", "V", "IV"],
        mood: ["uplifting", "energetic"],
        keyMode: "major",
        description: "A regal, triumphant progression that moves through the primary chords. Creates a sense of majesty and celebration, common in anthems and celebratory music."
    },
    {
        name: "Bittersweet Journey",
        progression: ["I", "vi", "ii", "V"],
        mood: ["dreamy", "melancholic"],
        keyMode: "major",
        description: "A progression that balances light and shadow, moving from major to minor territories. Creates a bittersweet, reflective mood with gentle sophistication."
    }
];
