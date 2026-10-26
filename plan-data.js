/**
 * Four-Week Plan Data
 * Goal: see a Roman numeral progression, work out the keys in any key,
 * and compose a melancholic Drum & Bass style idea at the piano.
 *
 * Every step has a duration in minutes; the steps of a day add up to the day's total
 * (checked by the tests). Links point to pages of this app.
 */

const PLAN_LINKS = {
    compose: { label: 'Compose', href: 'compose.html', icon: '🧭' },
    practice: { label: 'Compose Practice', href: 'compose-practice.html', icon: '🏋️' },
    findScale: { label: 'Find Scale', href: 'find-scale.html', icon: '🎼' },
    findNote: { label: 'Find Note', href: 'find-note.html', icon: '🎤' },
    calc: { label: 'Calculate Chords', href: 'calculate-chords.html', icon: '🎹' },
    progressions: { label: 'Chord Progressions', href: 'chord-progressions.html', icon: '📖' },
    metronome: { label: 'Metronome', href: 'metronome.html', icon: '⏱️' },
    speed: { label: 'Speed Training', href: 'training-speed.html', icon: '🎮' },
    inversions: { label: 'Chord Inversions training', href: 'training-chord-inversions.html', icon: '🔄' },
    findChords: { label: 'Find All Chords training', href: 'training-find-chords.html', icon: '🎯' },
    guide: { label: 'Guide: Roman numerals to keys', href: 'guide.html', icon: '🗺️' },
    wikiChromatic: { label: 'Wiki: Chromatic scale', href: 'wiki-chromatic-scale.html', icon: '📚' },
    wikiMaster: { label: 'Wiki: Master pattern', href: 'wiki-master-pattern.html', icon: '📚' },
    wikiBuildScales: { label: 'Wiki: Building scales', href: 'wiki-building-scales.html', icon: '📚' },
    wikiMinor: { label: 'Wiki: Minor scales', href: 'wiki-minor-scales.html', icon: '📚' },
    wikiBuildChords: { label: 'Wiki: Building chords', href: 'wiki-building-chords.html', icon: '📚' },
    wikiNatural: { label: 'Wiki: Natural chords', href: 'wiki-natural-chords.html', icon: '📚' },
    wikiRoman: { label: 'Wiki: Roman numerals', href: 'wiki-roman-numerals.html', icon: '📚' },
    wikiCircle: { label: 'Wiki: Circle of fifths', href: 'wiki-circle-of-fifths.html', icon: '📚' },
    wikiInversions: { label: 'Wiki: Chord inversions', href: 'wiki-chord-inversions.html', icon: '📚' },
    wikiBorrowed: { label: 'Wiki: Borrowed chords', href: 'wiki-borrowed-chords.html', icon: '📚' }
};

const PLAN_TYPES = {
    learn: { label: 'Learn', icon: '📘' },
    play: { label: 'Play day', icon: '🎹' },
    review: { label: 'Review', icon: '🔁' }
};

const PLAN_WEEKS = [
    { week: 1, title: 'Know the map', goal: 'Find your way around the keys and build the scales and chords of the easy keys.' },
    { week: 2, title: 'Roman numerals in more keys', goal: 'Turn Roman numerals into chords in the easy keys, major and minor.' },
    { week: 3, title: 'Mood, 7th chords and the Drum & Bass feel', goal: 'Go from a mood to a scale, 7th chords, a tempo feel and a first melody.' },
    { week: 4, title: 'Make it yours', goal: 'Work in all 12 keys and finish a short piece of your own.' }
];

const PLAN_DAYS = [
    // ------------------------------------------------------------------ Week 1
    {
        day: 1, week: 1, type: 'learn', minutes: 20,
        title: 'Find your way around the keys',
        goal: 'Name every white and black key, and play the C major scale calmly.',
        steps: [
            { min: 3, text: 'Find every C on your piano. C is the white key just to the left of each group of two black keys. Play them from low to high.' },
            { min: 5, text: 'Name the white keys in each octave: C D E F G A B. Say each name out loud as you play it.' },
            { min: 5, text: 'Learn the black keys. Each one has two names: a sharp (♯, one step higher than the note below) and a flat (♭, one step lower than the note above). Find C♯/D♭ and then all five black keys in one octave.' },
            { min: 7, text: 'Play the C major scale (white keys only) up and down, first with the right hand, then with the left. Slow and even beats fast and messy.' }
        ],
        links: ['wikiChromatic', 'speed'],
        check: 'You can point to any key by name without counting up from C.',
        tip: 'Fingering can wait. For now accuracy and a relaxed hand matter more than speed.'
    },
    {
        day: 2, week: 1, type: 'learn', minutes: 20,
        title: 'The major scale pattern',
        goal: 'Build a major scale from any starting note with whole and half steps.',
        steps: [
            { min: 3, text: 'A half step is the very next key, black or white. A whole step is two half steps. Notice that E to F and B to C are half steps, even though both are white keys.' },
            { min: 5, text: 'Say and play the major pattern on C: whole, whole, half, whole, whole, whole, half (W W H W W W H). Listen to how it sounds finished at the top.' },
            { min: 7, text: 'Use the same pattern from G to build G major. You will need one black key: G A B C D E F♯. Then build F major from F. This time you need B♭: F G A B♭ C D E.' },
            { min: 5, text: 'Check your work in Find Scale: tap the notes you played and see which scales match.' }
        ],
        links: ['wikiMaster', 'wikiBuildScales', 'findScale'],
        check: 'Say "G major is G A B C D E F♯" and "F major is F G A B♭ C D E" without looking.',
        tip: 'If a scale sounds wrong, the mistake is almost always a half step you missed, often at E to F or B to C.'
    },
    {
        day: 3, week: 1, type: 'learn', minutes: 20,
        title: 'Natural minor',
        goal: 'Build natural minor scales and hear A minor as the darker partner of C major.',
        steps: [
            { min: 3, text: 'Play A natural minor: A B C D E F G A, white keys only. Notice it uses the same notes as C major but feels like it is about A.' },
            { min: 5, text: 'Learn the minor pattern: whole, half, whole, whole, half, whole, whole (W H W W H W W). Check that it fits A minor.' },
            { min: 8, text: 'Build D minor (D E F G A B♭ C) and E minor (E F♯ G A B C D) with the pattern.' },
            { min: 4, text: 'Play each scale up and down. Stop on the first note and listen for how it feels like home.' }
        ],
        links: ['wikiMinor', 'findScale'],
        check: 'Say the notes of D minor and E minor one by one without looking.',
        tip: 'Every major scale has a relative minor with the same notes, starting on its 6th note. C major and A minor are such a pair.'
    },
    {
        day: 4, week: 1, type: 'learn', minutes: 20,
        title: 'Chords from a scale',
        goal: 'Build the seven chords of C major and A minor with skip, pick, skip, pick.',
        steps: [
            { min: 4, text: 'Read the building chords page. The method: start on a note, skip one scale note, pick the next, skip one, pick the next.' },
            { min: 8, text: 'In C major build a chord on every note: C E G, D F A, E G B, F A C, G B D, A C E, B D F. Say the notes out loud before you play them.' },
            { min: 5, text: 'Do the same in A minor: Am (A C E), B° (B D F), C, Dm, Em, F, G.' },
            { min: 3, text: 'Check your chords in Calculate Chords.' }
        ],
        links: ['wikiBuildChords', 'calc', 'findChords'],
        check: 'Name the notes of F major (F A C) and D minor (D F A) instantly.',
        tip: 'Chords are made of the same notes as the scale, just stacked. That is why chords from one scale always fit together.'
    },
    {
        day: 5, week: 1, type: 'learn', minutes: 20,
        title: 'Which chords are major, minor, diminished',
        goal: 'Memorize the chord types for major and minor keys.',
        steps: [
            { min: 5, text: 'Learn two lines. Major key: I ii iii IV V vi vii°. Minor key: i ii° III iv v VI VII. Uppercase means major, lowercase means minor, ° means diminished.' },
            { min: 5, text: 'Play the seven chords of C major in order. Hear which are bright (major), which are darker (minor) and which one is tense (the diminished vii°).' },
            { min: 10, text: 'Open Compose Practice, set Scale to Major and Level 1, and answer 10 questions. Use the hints when you are stuck.' }
        ],
        links: ['practice', 'wikiRoman', 'wikiNatural'],
        check: 'At least 5 of your 10 questions are perfect.',
        tip: 'If you know the pattern of types, you do not have to memorize chords for 24 different keys.'
    },
    {
        day: 6, week: 1, type: 'play', minutes: 25,
        title: 'Play day: your first loop',
        goal: 'Play a chord loop and improvise over it.',
        steps: [
            { min: 5, text: 'Play Am – F – C – G (i – VI – III – VII in A minor) as a loop: root note in the left hand, full chord in the right hand.' },
            { min: 10, text: 'With the right hand play only notes of A natural minor (white keys) over the loop. Try long notes and repeat one short idea.' },
            { min: 5, text: 'Switch to Am – Dm – G – C and do the same.' },
            { min: 5, text: 'Record one minute on your phone. Do not judge it, just keep it for Day 28.' }
        ],
        links: ['compose', 'progressions'],
        check: 'You can keep the loop going for a full minute without stopping.',
        tip: 'Every note sounds fine because all notes and chords come from the same scale.'
    },
    {
        day: 7, week: 1, type: 'review', minutes: 15,
        title: 'Review week 1 and listen',
        goal: 'Make the week stick.',
        steps: [
            { min: 5, text: 'Say out loud, without looking: the major pattern, the minor pattern, and the chord types in a major and in a minor key.' },
            { min: 5, text: 'Play C major, G major, F major, A minor, D minor and E minor once each, slowly.' },
            { min: 5, text: 'Put on a track you like, find one bass note on the piano with Find Note, and check which scale could contain it.' }
        ],
        links: ['findNote', 'findScale'],
        check: 'You can name all six scales note by note.',
        tip: 'Short reviews beat long sessions. Come back to anything that felt shaky.'
    },

    // ------------------------------------------------------------------ Week 2
    {
        day: 8, week: 2, type: 'learn', minutes: 20,
        title: 'One progression, many keys',
        goal: 'See that I – V – vi – IV is the same pattern in every key.',
        steps: [
            { min: 4, text: 'In C major, I – V – vi – IV means the chords on scale notes 1, 5, 6 and 4: C – G – Am – F.' },
            { min: 6, text: 'Spell G major (G A B C D E F♯) and take notes 1, 5, 6, 4: G – D – Em – C. Play it.' },
            { min: 6, text: 'Spell F major (F G A B♭ C D E) and do the same: F – C – Dm – B♭. Play it.' },
            { min: 4, text: 'Check all three in Calculate Chords.' }
        ],
        links: ['wikiRoman', 'calc', 'guide'],
        check: 'Say I – V – vi – IV in G major (G D Em C) without looking.',
        tip: 'Roman numerals are just scale degrees. If you can spell the scale, you can play any progression in it.'
    },
    {
        day: 9, week: 2, type: 'learn', minutes: 20,
        title: 'Chords of minor keys',
        goal: 'Work out the chords of A minor, D minor and E minor.',
        steps: [
            { min: 6, text: 'A minor: Am, B°, C, Dm, Em, F, G. D minor: Dm, E°, F, Gm, Am, B♭, C. E minor: Em, F♯°, G, Am, Bm, C, D. Work each one out from its scale before you check.' },
            { min: 4, text: 'Say the pattern: i ii° III iv v VI VII. Notice that it is the same in every minor key.' },
            { min: 10, text: 'Open Compose Practice, set Scale to Minor and Level 1, and answer 10 questions.' }
        ],
        links: ['practice', 'wikiMinor'],
        check: 'At least 6 of your 10 questions are perfect.',
        tip: 'The diminished chord (ii°) rarely needs to be memorized as a name. Just build it from the scale like the others.'
    },
    {
        day: 10, week: 2, type: 'learn', minutes: 20,
        title: 'Four minor progressions',
        goal: 'Play four classic minor progressions in A minor.',
        steps: [
            { min: 12, text: 'Play each for about 3 minutes: i – VI – III – VII (Am F C G), i – iv – VII – III (Am Dm G C), i – VII – VI – VII (Am G F G) and i – VII – VI – v (Am G F Em).' },
            { min: 4, text: 'Decide which one sounds the saddest and which one sounds the most epic. There is no wrong answer.' },
            { min: 4, text: 'Play your favourite twice: once with only root notes, once with full chords.' }
        ],
        links: ['compose', 'progressions'],
        check: 'You can play all four from memory.',
        tip: 'Notice that each progression starts and ends on the i chord. That is what makes it loop well.'
    },
    {
        day: 11, week: 2, type: 'learn', minutes: 20,
        title: 'Sharps, flats and the circle of fifths',
        goal: 'Know which keys have which sharps and flats, and how keys relate.',
        steps: [
            { min: 5, text: 'Read the circle of fifths page. Going up a fifth from C adds one sharp each time: G (1 ♯), D (2 ♯), A (3 ♯). Going down a fifth adds flats: F (1 ♭), B♭ (2 ♭), E♭ (3 ♭).' },
            { min: 7, text: 'Build D major (D E F♯ G A B C♯), A major (A B C♯ D E F♯ G♯) and B♭ major (B♭ C D E♭ F G A) with the major pattern.' },
            { min: 8, text: 'Open Compose Practice, set Level 2 and answer 8 questions.' }
        ],
        links: ['wikiCircle', 'practice', 'findScale'],
        check: 'You can say how many sharps or flats D major, A major and B♭ major have.',
        tip: 'You do not need to memorize all keys at once. Learn the pattern and add one key per day.'
    },
    {
        day: 12, week: 2, type: 'learn', minutes: 20,
        title: 'Smooth chord changes',
        goal: 'Move between chords with small hand movements.',
        steps: [
            { min: 5, text: 'Read about chord inversions. Play C major as root position (C E G), first inversion (E G C) and second inversion (G C E).' },
            { min: 10, text: 'Do a few rounds of the Chord Inversions training.' },
            { min: 5, text: 'Play Am – F – C – G and pick the inversion that keeps your hand closest each time, so your hand barely moves.' }
        ],
        links: ['wikiInversions', 'inversions'],
        check: 'You can play the four chords of the loop without jumping around the keyboard.',
        tip: 'Smooth voicing makes simple chords sound professional.'
    },
    {
        day: 13, week: 2, type: 'play', minutes: 25,
        title: 'Play day: three keys',
        goal: 'Play the same progression in three different keys.',
        steps: [
            { min: 5, text: 'Play i – VI – III – VII in A minor: Am – F – C – G.' },
            { min: 8, text: 'Work it out in D minor (Dm – B♭ – F – C) and E minor (Em – C – G – D) and play both. Try to calculate the chords before you check.' },
            { min: 8, text: 'Pick the key you like the most and improvise over the loop with notes of that scale.' },
            { min: 4, text: 'Record a minute of it.' }
        ],
        links: ['compose', 'calc'],
        check: 'You played the progression in three keys without stopping to look up chords.',
        tip: 'Notice how the same Roman numerals sound similar in every key, just higher or lower.'
    },
    {
        day: 14, week: 2, type: 'review', minutes: 20,
        title: 'Checkpoint',
        goal: 'Find out what is solid and what needs more work.',
        steps: [
            { min: 10, text: 'Open Compose Practice, set Level 2, Scale Both, and answer 8 questions. Aim for 6 perfect.' },
            { min: 5, text: 'Write down the keys that were hardest. You will use them in the next days.' },
            { min: 5, text: 'Pick a song you like. Find its key with Find Note by playing the bass note and trying the matching scale.' }
        ],
        links: ['practice', 'findNote'],
        check: '6 of 8 questions are perfect, and you have a short list of keys to work on.',
        tip: 'Mistakes are information. A hard key just needs a few more repeats.'
    },

    // ------------------------------------------------------------------ Week 3
    {
        day: 15, week: 3, type: 'learn', minutes: 20,
        title: 'From mood to scale',
        goal: 'Hear the difference between natural minor and Dorian.',
        steps: [
            { min: 5, text: 'Play A natural minor: A B C D E F G A.' },
            { min: 5, text: 'Play A Dorian: A B C D E F♯ G A. Only one note changed (F became F♯), but it sounds brighter and more hopeful.' },
            { min: 5, text: 'Hold the low A with your left hand as a drone and improvise with the right hand, first in natural minor, then in Dorian.' },
            { min: 5, text: 'Open Compose, choose Melancholic and read how it explains both scales.' }
        ],
        links: ['compose', 'wikiMinor'],
        check: 'You can say which of the two sounds more hopeful (Dorian).',
        tip: 'Natural minor is the saddest choice. Dorian is bittersweet. Both are melancholic in their own way.'
    },
    {
        day: 16, week: 3, type: 'learn', minutes: 20,
        title: '7th chords',
        goal: 'Build the 7th chords of A minor.',
        steps: [
            { min: 4, text: 'A 7th chord adds one more skip and pick on top: Am7 = A C E G.' },
            { min: 8, text: 'Build all seven in A minor and play them: Am7, Bm7♭5, Cmaj7, Dm7, Em7, Fmaj7, G7.' },
            { min: 8, text: 'Open Compose Practice, switch Chords to 7th chords, set Scale to Minor and Level 1, and answer 6 questions.' }
        ],
        links: ['compose', 'practice'],
        check: 'You can say Fmaj7 = F A C E and G7 = G B D F without looking.',
        tip: 'Listen to the difference between Am and Am7. The 7th adds a soft, smooth color.'
    },
    {
        day: 17, week: 3, type: 'learn', minutes: 20,
        title: 'Left hand and right hand',
        goal: 'Play a progression with a bass note in the left hand and 7th chords in the right hand.',
        steps: [
            { min: 5, text: 'Left hand: play only the root of each chord in the low register (A, F, C, G).' },
            { min: 10, text: 'Right hand: play Am7 – Fmaj7 – Cmaj7 – G7. Pick inversions so your hand stays close together.' },
            { min: 5, text: 'Try a lighter voicing: leave out the 5th and play only the 3rd and 7th above the bass. For Am7 that is C and G.' }
        ],
        links: ['inversions', 'compose'],
        check: 'You can play the loop with both hands for two minutes without stopping.',
        tip: 'The bass defines the harmony. Lighter chords on top leave room for the melody.'
    },
    {
        day: 18, week: 3, type: 'learn', minutes: 20,
        title: 'Rhythm for Drum & Bass',
        goal: 'Feel one chord per bar at Drum & Bass tempo.',
        steps: [
            { min: 5, text: 'Set the metronome to 87 BPM. Drum & Bass usually runs at about 170 to 175 BPM, and 87 is half of 174. Two clicks at 87 BPM last as long as one bar at 174 BPM.' },
            { min: 8, text: 'Play one chord every two clicks: Am7 – Fmaj7 – Cmaj7 – G7. Keep it steady and let each chord ring.' },
            { min: 4, text: 'When it feels easy, raise the tempo to 100 BPM and try again.' },
            { min: 3, text: 'Listen to a Drum & Bass track. Count when the chords change. It is usually less often than you expect.' }
        ],
        links: ['metronome'],
        check: 'You can change chords exactly on the click for two minutes at 87 BPM.',
        tip: 'Drum & Bass is busy and fast, so spacious chords and long notes work well on top.'
    },
    {
        day: 19, week: 3, type: 'learn', minutes: 20,
        title: 'Melody basics',
        goal: 'Create a four-note motif that fits a chord.',
        steps: [
            { min: 5, text: 'Loop Am – F – C – G (or the 7th chord version) with your left hand.' },
            { min: 5, text: 'Learn the chord tones of Am: A, C and E. A melody that starts and ends on chord tones always sounds like it belongs.' },
            { min: 5, text: 'Open Compose, go to the Melody step, roll a motif and play it over the first chord.' },
            { min: 5, text: 'Play it again but change just one note. Compare both versions.' }
        ],
        links: ['compose'],
        check: 'You have a four-note motif you like and a variation of it.',
        tip: 'A repeated motif with one small change is the secret of many memorable melodies.'
    },
    {
        day: 20, week: 3, type: 'play', minutes: 25,
        title: 'Play day: a melancholic Drum & Bass idea',
        goal: 'Go from a feeling to a finished idea with Compose.',
        steps: [
            { min: 5, text: 'In Compose choose Melancholic, Drum & Bass, a scale and a key, and pick a progression you like.' },
            { min: 10, text: 'Loop the progression slowly (about 87 BPM with the metronome) and improvise a melody over it.' },
            { min: 5, text: 'Keep your favourite 8 bars. Write down the notes or the scale degrees.' },
            { min: 5, text: 'Record it on your phone.' }
        ],
        links: ['compose', 'metronome'],
        check: 'You have a recording of your first melancholic idea.',
        tip: 'Do not try to be perfect. A rough recording is a great starting point.'
    },
    {
        day: 21, week: 3, type: 'review', minutes: 20,
        title: 'Review week 3 and listen',
        goal: 'Hear the ideas of the week in real music.',
        steps: [
            { min: 7, text: 'Pick two Drum & Bass tracks you like. Find the key with Find Note by playing the bass notes and testing which scale contains them.' },
            { min: 6, text: 'Try to find the bass notes of the first four bars and turn them into scale degrees (1 to 7).' },
            { min: 7, text: 'Open Compose Practice, set Level 2 and 7th chords, and answer 6 questions.' }
        ],
        links: ['findNote', 'practice'],
        check: 'You found the key of at least one track.',
        tip: 'Hearing the bass notes is a big step toward writing your own.'
    },

    // ------------------------------------------------------------------ Week 4
    {
        day: 22, week: 4, type: 'learn', minutes: 20,
        title: 'All 12 keys',
        goal: 'Be comfortable with the keys that have many sharps and flats.',
        steps: [
            { min: 5, text: 'Continue the circle of fifths: E (4 ♯), B (5 ♯), F♯ (6 ♯) and A♭ (4 ♭), D♭ (5 ♭).' },
            { min: 5, text: 'Spell E major: E F♯ G♯ A B C♯ D♯. Spell A♭ major: A♭ B♭ C D♭ E♭ F G.' },
            { min: 10, text: 'Open Compose Practice, set Level 3 and answer 8 questions.' }
        ],
        links: ['wikiCircle', 'practice'],
        check: 'At least 5 of 8 questions are perfect.',
        tip: 'In keys with many accidentals the black keys are no harder than white keys. The pattern of the scale is the same.'
    },
    {
        day: 23, week: 4, type: 'learn', minutes: 20,
        title: 'Move your progression through keys',
        goal: 'Play the same minor progression in four new keys.',
        steps: [
            { min: 5, text: 'Take i – VI – III – VII, the progression you know best.' },
            { min: 10, text: 'Work it out and play it in B minor (Bm G D A), F♯ minor (F♯m D A E), G minor (Gm E♭ B♭ F) and C minor (Cm A♭ E♭ B♭). Calculate first, then check.' },
            { min: 5, text: 'Play each of them once with the metronome at 87 BPM, one chord every two clicks.' }
        ],
        links: ['practice', 'calc'],
        check: 'You calculated at least three of the four keys correctly before checking.',
        tip: 'The faster you can spell a scale, the faster you can play in any key.'
    },
    {
        day: 24, week: 4, type: 'learn', minutes: 20,
        title: 'Developing a melody',
        goal: 'Turn a motif into a longer melody.',
        steps: [
            { min: 5, text: 'Learn four tools: repeat the motif, change one note, shift the motif to start on the next scale note (a sequence), and rest.' },
            { min: 10, text: 'Take your motif from Day 19 or 20. Over four bars play it, repeat it, change it and rest. Then answer it with a second phrase that ends on a chord tone of the last chord.' },
            { min: 5, text: 'Play the whole thing over the loop at about 87 BPM.' }
        ],
        links: ['compose'],
        check: 'You have an 8-bar melody made of two short phrases.',
        tip: 'Think question and answer. The first phrase asks, the second phrase answers.'
    },
    {
        day: 25, week: 4, type: 'learn', minutes: 25,
        title: 'Bass and arrangement',
        goal: 'Layer a bass line, chords and melody.',
        steps: [
            { min: 5, text: 'Play a simple bass line: the root note of every chord, long and low.' },
            { min: 10, text: 'Open GarageBand or your own music software. Set the tempo to 174 BPM, add a Drum & Bass drum loop and record your chords on a keyboard instrument. Each chord lasts one bar.' },
            { min: 5, text: 'Record the bass notes and then the melody on separate tracks.' },
            { min: 5, text: 'Listen back and ask: is there enough space between the notes?' }
        ],
        links: ['metronome', 'compose'],
        check: 'You have a recording with drums, chords and melody.',
        tip: 'Start with fewer notes. If something sounds crowded, remove a part before you change a note.'
    },
    {
        day: 26, week: 4, type: 'learn', minutes: 20,
        title: 'A little spice: the major V chord',
        goal: 'Add tension with one chord from outside the scale.',
        steps: [
            { min: 5, text: 'In A minor the v chord is Em (E G B). Change its third from G to G♯ and you get E major (E G♯ B). The G♯ is a note outside the natural minor scale and pulls strongly to A.' },
            { min: 8, text: 'Play Am – F – C – E and Dm – E – Am. Compare with the same progressions using Em instead of E.' },
            { min: 7, text: 'Try the major V as the last chord of your own progression and listen how it pulls back to the first chord.' }
        ],
        links: ['wikiBorrowed', 'progressions'],
        check: 'You can hear the stronger pull of E major compared to Em.',
        tip: 'Use spice sparingly. One different chord in a loop is enough.'
    },
    {
        day: 27, week: 4, type: 'play', minutes: 30,
        title: 'Play day: finish a piece',
        goal: 'Play a 16-bar piece from start to end.',
        steps: [
            { min: 10, text: 'Play 8 bars: your progression with your melody.' },
            { min: 10, text: 'Make the second 8 bars a variation. Change one chord, change the melody, or play higher or lower.' },
            { min: 10, text: 'Record the whole 16 bars from start to end, with drums if you like.' }
        ],
        links: ['compose', 'metronome'],
        check: 'You have a recording of a piece that you wrote.',
        tip: 'Finishing something small teaches more than starting something big.'
    },
    {
        day: 28, week: 4, type: 'review', minutes: 30,
        title: 'Showtime and what comes next',
        goal: 'Test yourself, listen back and plan the next steps.',
        steps: [
            { min: 10, text: 'Open Compose Practice, set Level 3, Scale Both, and answer 10 questions. Aim for 7 perfect.' },
            { min: 10, text: 'Listen to the recording from Day 6 and to your 16-bar piece from Day 27. Notice what changed.' },
            { min: 10, text: 'Choose two things for the next four weeks: Dorian and Phrygian progressions, 9th chords, more inversions, or working out songs by ear.' }
        ],
        links: ['practice', 'compose'],
        check: '7 of 10 questions are perfect, and you have written down your next two goals.',
        tip: 'Congratulations! You can now take any Roman numeral progression and play it in any key.'
    }
];
