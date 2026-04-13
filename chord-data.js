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
        description: "The most popular chord progression in modern pop music. Used in countless hits like 'Let It Be', 'Don't Stop Believin'', and 'Someone Like You'. Hip hop: 'See You Again' by Wiz Khalifa ft. Charlie Puth, 'Love the Way You Lie' by Eminem ft. Rihanna. Bright and memorable."
    },
    {
        name: "Emotional Ballad",
        progression: ["vi", "IV", "I", "V"],
        mood: ["sad", "melancholic"],
        keyMode: "major",
        description: "A touching progression that starts on the minor vi chord, creating an emotional and introspective feel. Featured in 'Grenade' by Bruno Mars and 'Africa' by Toto. Hip hop: 'Mockingbird' by Eminem. Perfect for heartfelt ballads and emotional storytelling."
    },
    {
        name: "Epic Minor Anthem",
        progression: ["i", "VI", "III", "VII"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        description: "A powerful minor key progression with dramatic movement. Used in 'Stairway to Heaven' by Led Zeppelin and 'Losing My Religion' by R.E.M. Hip hop: Common in trap production, featured in parts of 'Sicko Mode' by Travis Scott. Creates an epic, cinematic atmosphere often used in film scores and dramatic rock songs."
    },
    {
        name: "Classic '50s Progression",
        progression: ["I", "vi", "IV", "V"],
        mood: ["happy", "uplifting"],
        keyMode: "major",
        description: "The quintessential doo-wop and early rock 'n' roll progression. Cheerful and nostalgic, used in classics like 'Stand By Me' and 'Every Breath You Take'. Hip hop: Variations in 'Still D.R.E.' by Dr. Dre, many Kanye West productions."
    },
    {
        name: "Minor Blues Feel",
        progression: ["i", "iv", "VII", "VI"],
        mood: ["melancholic", "sad"],
        keyMode: "minor",
        description: "A bluesy minor progression with a walking bassline feel. Hip hop: Common in sample-based production, used by producers like The Alchemist and Madlib. Creates a somber, reflective mood with hints of blues and soul traditions."
    },
    {
        name: "Bright and Warm",
        progression: ["I", "IV", "vi", "V"],
        mood: ["happy", "uplifting"],
        keyMode: "major",
        description: "An optimistic progression with a warm, comfortable feel. Featured in 'I'm Yours' by Jason Mraz and 'She Will Be Loved' by Maroon 5. Hip hop: 'Hotline Bling' by Drake. The IV chord adds brightness while the vi creates gentle emotional depth."
    },
    {
        name: "Dreamy Flow",
        progression: ["I", "iii", "vi", "IV"],
        mood: ["dreamy", "uplifting"],
        keyMode: "major",
        description: "A smooth, flowing progression that glides through related chords. Hip hop: Used in chill lo-fi hip hop beats and melodic rap. Creates an ethereal, dreamlike atmosphere perfect for ambient and chill music."
    },
    {
        name: "Jazz Standard Cadence",
        progression: ["ii", "V", "I"],
        mood: ["uplifting"],
        keyMode: "major",
        description: "The fundamental jazz progression, also called the ii-V-I turnaround. Found in countless jazz standards like 'Autumn Leaves', 'Fly Me to the Moon', and 'Satin Doll'. Hip hop: Used extensively by J Dilla, A Tribe Called Quest, and in jazz rap/boom bap productions. Sophisticated and smooth, this is the backbone of jazz harmony and creates strong resolution."
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
        hasBorrowedChords: true,
        description: "An ancient progression with roots in flamenco and baroque music. Featured in 'Sultans of Swing' by Dire Straits and 'Hit the Road Jack' by Ray Charles. Hip hop: Used in 'Stan' by Eminem (sampled from Dido's 'Thank You'). Creates a mysterious, exotic feel with strong Spanish and Mediterranean character."
    },
    {
        name: "Uplifting Major Anthem",
        progression: ["I", "V", "IV", "V"],
        mood: ["happy", "uplifting"],
        keyMode: "major",
        description: "A driving, anthemic progression that builds energy and excitement. Used in 'You Give Love a Bad Name' by Bon Jovi and many rock anthems. The repeated V chord creates momentum and forward motion."
    },
    {
        name: "Melancholic Descent",
        progression: ["i", "VI", "iv", "V"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        hasBorrowedChords: true,
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
        description: "A high-energy progression that alternates between the tonic and dominant areas. Featured in 'Wild Thing' by The Troggs and 'Louie Louie' by The Kingsmen. Creates driving momentum perfect for rock and upbeat pop."
    },
    {
        name: "Tense Suspense",
        progression: ["i", "ii", "V", "i"],
        mood: ["unsettling"],
        keyMode: "minor",
        hasBorrowedChords: true,
        description: "A progression that builds tension through the diminished ii chord and major V, creating suspense and drama before resolving back to i."
    },
    {
        name: "Royal Progression",
        progression: ["I", "IV", "V", "IV"],
        mood: ["uplifting"],
        keyMode: "major",
        description: "A regal, triumphant progression that moves through the primary chords. Used in 'Twist and Shout' by The Beatles and 'La Bamba' by Ritchie Valens. Creates a sense of majesty and celebration, common in anthems and celebratory music."
    },
    {
        name: "Bittersweet Journey",
        progression: ["I", "vi", "ii", "V"],
        mood: ["dreamy", "melancholic"],
        keyMode: "major",
        description: "A progression that balances light and shadow, moving from major to minor territories. The classic 'Heart and Soul' progression, also used in 'Blue Moon' by The Marcels. Creates a bittersweet, reflective mood with gentle sophistication."
    },
    {
        name: "Chromatic Descent",
        progression: ["I", "VII", "VI", "V"],
        mood: ["unsettling"],
        keyMode: "major",
        hasBorrowedChords: true,
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
        hasBorrowedChords: true,
        description: "The II major chord (borrowed from modal mixture) creates a jarring tritone relationship. This oscillation between stable and unstable feels wrong and unsettling."
    },
    {
        name: "Chromatic Mediant Shift",
        progression: ["I", "III", "I", "III"],
        mood: ["unsettling"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "The major III chord (not iii) creates a chromatic mediant relationship - a dramatic, film-score-like shift that sounds alien and unexpected."
    },
    {
        name: "Parallel Minor Invasion",
        progression: ["I", "iv", "I", "iv"],
        mood: ["uncomfortable"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "The minor iv borrowed from parallel minor creates modal mixture. This major-minor oscillation feels unstable and psychologically unsettling."
    },
    {
        name: "Augmented Terror",
        progression: ["I", "III", "VI", "ii"],
        mood: ["uncomfortable"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "All major chords create augmented relationships (4 semitones apart). This symmetrical division sounds dreamlike yet disturbing, like a Salvador Dalí painting."
    },
    {
        name: "Whole Tone Wandering",
        progression: ["I", "II", "III", "IV"],
        mood: ["dreamy", "uncomfortable"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "All major chords moving in whole tones. Destroys the sense of key center - sounds floating, directionless, and surreal. Very experimental."
    },
    {
        name: "Phrygian Nightmare",
        progression: ["i", "II", "i", "II"],
        mood: ["unsettling"],
        keyMode: "minor",
        hasBorrowedChords: true,
        description: "The Phrygian II (major chord on the flattened second) creates an exotic, menacing quality. Used in 'Set the Controls for the Heart of the Sun' by Pink Floyd. Common in metal and horror soundtracks."
    },
    {
        name: "Deceptive Loop",
        progression: ["I", "vi", "VII", "III"],
        mood: ["uncomfortable"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "Expected resolutions are constantly denied. The VII and major III are borrowed chords that create a cycle that never truly resolves - musically frustrating."
    },
    {
        name: "Chromatic Nightmare",
        progression: ["i", "II", "III", "iv"],
        mood: ["uncomfortable"],
        keyMode: "minor",
        hasBorrowedChords: true,
        description: "Chromatic ascent mixing major and minor chords. Each chord contradicts the last, creating harmonic chaos and maximum instability."
    },
    {
        name: "Lydian Strangeness",
        progression: ["I", "II", "I", "vii°"],
        mood: ["uncomfortable"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "Uses the raised fourth (Lydian mode). The II major and vii° create floating, otherworldly quality. Sounds futuristic and alien."
    },
    {
        name: "Non-Functional Drift",
        progression: ["I", "VII", "IV", "III"],
        mood: ["unsettling"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "Completely abandons functional harmony. Chords don't follow any traditional pattern - they just drift. Sounds avant-garde and unpredictable."
    },
    {
        name: "Locrian Madness",
        progression: ["i°", "II", "III", "iv"],
        mood: ["uncomfortable"],
        keyMode: "minor",
        hasBorrowedChords: true,
        description: "Built on the unstable Locrian mode with a diminished tonic. Every chord feels wrong because there's no stable home. Pure harmonic anxiety."
    },
    {
        name: "Chromatic Parallelism",
        progression: ["I", "i", "VII", "vii°"],
        mood: ["unsettling"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "Parallel major/minor shifts combined with chromatic movement. Creates a shadowy, doppelgänger effect - familiar yet disturbing."
    },
    {
        name: "Borrowed Chord Assault",
        progression: ["I", "IV", "iv", "I"],
        mood: ["uncomfortable"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "The sudden shift from IV to iv (major to minor) creates harmonic whiplash. The brightness crashes into darkness abruptly."
    },
    {
        name: "Natural Minor Sorrow",
        progression: ["i", "iv", "i", "V"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        hasBorrowedChords: true,
        description: "The pure natural minor sound with major V creates classic gothic sadness. Used in 'Mad World' by Tears for Fears and 'Hurt' by Nine Inch Nails. Hip hop: Featured in emotional boom bap beats. The alternating i-iv creates a pendulum of sorrow, while the major V provides brief resolution before returning to darkness."
    },
    {
        name: "Hopeless Minor",
        progression: ["i", "iv", "v", "i"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        description: "Using minor v instead of major V removes all brightness and hope. Common in Radiohead's darker works like 'Exit Music (For a Film)' and doom metal. Hip hop: Used in experimental hip hop by Earl Sweatshirt and MIKE. Completely avoids major chords, creating pure, unresolved melancholy with no light at the end."
    },
    {
        name: "Waves of Sadness",
        progression: ["i", "VII", "III", "VI"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        description: "A rearrangement of the epic minor progression with a different emotional arc. The rising then falling motion creates waves of sadness. Popular in post-rock bands like Explosions in the Sky and dark ambient music. Creates a journey through different shades of melancholy with cinematic sweep."
    },
    {
        name: "Dark Wandering",
        progression: ["i", "v", "VI", "VII"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        description: "Minor v creates extra darkness compared to major V, intensifying the melancholic atmosphere. Used in doom metal by bands like Electric Wizard and My Dying Bride, and in dark ambient soundscapes. Hip hop: Dark trap productions. The unresolved, wandering quality suggests endless searching without finding peace."
    },
    {
        name: "Journey Through Darkness",
        progression: ["i", "VI", "VII", "III"],
        mood: ["sad", "melancholic"],
        keyMode: "minor",
        description: "A different path through minor territory, creating a narrative journey through darkness. Popular in emo and alternative rock by bands like Brand New and Taking Back Sunday. Hip hop: Used in introspective underground hip hop. The progression moves through connected minor chords, each step deepening the emotional weight."
    },
    {
        name: "Reflective Minor Emphasis",
        progression: ["I", "vi", "iii", "IV"],
        mood: ["melancholic", "dreamy"],
        keyMode: "major",
        description: "In a major key but emphasizes the minor chords (vi and iii), creating bittersweet reflection. Used in indie and alternative rock for contemplative moods. Hip hop: Featured in Mac Miller's introspective productions. The gentle sadness exists within an optimistic framework, like nostalgia or wistful remembrance."
    },
    {
        name: "Longing Resolution",
        progression: ["vi", "ii", "V", "I"],
        mood: ["melancholic", "uplifting"],
        keyMode: "major",
        description: "Starts on the minor vi, creating immediate longing that gradually resolves to I. Circle of fifths progression starting on the sad side. Common in jazz, R&B, and neo-soul by artists like D'Angelo and Erykah Badu. Hip hop: Used by The Roots and Questlove productions. Creates emotional depth through the journey from yearning to satisfaction."
    },
    {
        name: "Creep Progression",
        progression: ["I", "IV", "iv", "I"],
        mood: ["melancholic", "uncomfortable"],
        keyMode: "major",
        hasBorrowedChords: true,
        description: "Made famous by Radiohead's 'Creep', also used in David Bowie's 'Space Oddity' and 'True' by Spandau Ballet. The borrowed iv from parallel minor creates emotional whiplash - sudden darkness invading brightness. Hip hop: Variations in The Weeknd's production. Creates the feeling of hope being crushed, optimism turning to despair in an instant. The major-minor contrast is psychologically jarring."
    }
];
