/**
 * Compose - guided decision tree
 * Mood -> Style -> Scale -> Chords -> Progression -> Melody
 *
 * Depends on: music-theory.js (CHROMATIC_SCALE), compose-data.js, Tone.js (optional, for sound)
 *
 * Everything musical (note spelling, chord qualities, Roman numerals) is calculated
 * from the chosen scale, so the suggested chords always fit together.
 */

const COMPOSE_STORAGE_KEY = 'chordz-compose-state';

const COMPOSE_STEPS = [
    { id: 'mood', title: 'Mood', icon: '🎭' },
    { id: 'style', title: 'Style', icon: '🥁' },
    { id: 'scale', title: 'Scale', icon: '🎼' },
    { id: 'chords', title: 'Chords', icon: '🎹' },
    { id: 'progression', title: 'Progression', icon: '🔁' },
    { id: 'melody', title: 'Melody', icon: '🎶' }
];

const COMPOSE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const COMPOSE_NATURAL_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const COMPOSE_FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const COMPOSE_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

// ---------------------------------------------------------------------------
// Music logic (pure functions)
// ---------------------------------------------------------------------------

/** Spell a scale with one letter per degree (A B C D E F G ...). */
function composeSpellScale(rootName, rootPc, intervals) {
    const startIndex = COMPOSE_LETTERS.indexOf(rootName[0]);
    return intervals.map((interval, i) => {
        const letter = COMPOSE_LETTERS[(startIndex + i) % 7];
        const targetPc = (rootPc + interval) % 12;
        let diff = (((targetPc - COMPOSE_NATURAL_PC[letter]) % 12) + 12) % 12;
        if (diff > 6) diff -= 12;
        return { letter, accidental: diff, pc: targetPc };
    });
}

function composeAccidentalSymbol(accidental) {
    return { '-2': 'bb', '-1': 'b', '0': '', '1': '#', '2': '##' }[String(accidental)];
}

/**
 * Pick the most readable spelling for a scale (e.g. F minor -> F G Ab Bb C Db Eb,
 * not F G G# A# C C# D#). Avoids double accidentals where possible.
 * @returns {string[]} Note names using "#" and "b" (ASCII)
 */
function composeChooseSpelling(rootPc, intervals) {
    const candidates = [CHROMATIC_SCALE[rootPc]];
    if (COMPOSE_FLAT_NAMES[rootPc] !== candidates[0]) candidates.push(COMPOSE_FLAT_NAMES[rootPc]);

    let best = null;
    candidates.forEach(rootName => {
        const spelled = composeSpellScale(rootName, rootPc, intervals);
        if (spelled.some(n => Math.abs(n.accidental) > 1)) return;
        const score = spelled.reduce((sum, n) => sum + Math.abs(n.accidental), 0);
        if (!best || score < best.score) {
            best = { score, names: spelled.map(n => n.letter + composeAccidentalSymbol(n.accidental)) };
        }
    });

    if (best) return best.names;
    // Fallback: plain sharp names
    return intervals.map(interval => CHROMATIC_SCALE[(rootPc + interval) % 12]);
}

/** True if the scale uses only white keys (no sharps or flats). */
function composeIsWhiteKeyScale(rootPc, intervals) {
    return composeChooseSpelling(rootPc, intervals).every(name => name.length === 1);
}

/** "Bb" -> "B♭", "F#" -> "F♯" */
function composePretty(name) {
    return name[0] + name.slice(1).replace(/#/g, '♯').replace(/b/g, '♭');
}

/**
 * Build the seven chords of a scale (triads or 7th chords).
 * Quality, symbol and Roman numeral are derived from the stacked intervals.
 */
function composeBuildChords(mode, rootPc, ext) {
    const intervals = mode.intervals;
    const names = composeChooseSpelling(rootPc, intervals);
    const triadSuffix = { major: '', minor: 'm', diminished: 'dim', augmented: 'aug', other: '?' };
    const seventhSuffix = {
        maj7: 'maj7', '7': '7', m7: 'm7', mMaj7: 'm(maj7)', m7b5: 'm7♭5',
        dim7: 'dim7', augMaj7: 'maj7♯5', aug7: '7♯5', other: '?'
    };
    const seventhRoman = { maj7: 'maj7', '7': '7', m7: '7', mMaj7: 'maj7', m7b5: 'ø7', dim7: '°7', augMaj7: 'maj7', aug7: '7', other: '' };

    const chords = [];
    for (let d = 0; d < 7; d++) {
        const indexes = [d, (d + 2) % 7, (d + 4) % 7, (d + 6) % 7];
        const pcs = indexes.map(i => (rootPc + intervals[i]) % 12);
        const spelled = indexes.map(i => names[i]);
        const third = (pcs[1] - pcs[0] + 12) % 12;
        const fifth = (pcs[2] - pcs[0] + 12) % 12;
        const seventh = (pcs[3] - pcs[0] + 12) % 12;

        let triad = 'other';
        if (third === 4 && fifth === 7) triad = 'major';
        else if (third === 3 && fifth === 7) triad = 'minor';
        else if (third === 3 && fifth === 6) triad = 'diminished';
        else if (third === 4 && fifth === 8) triad = 'augmented';

        let sev = 'other';
        if (triad === 'major' && seventh === 11) sev = 'maj7';
        else if (triad === 'major' && seventh === 10) sev = '7';
        else if (triad === 'minor' && seventh === 10) sev = 'm7';
        else if (triad === 'minor' && seventh === 11) sev = 'mMaj7';
        else if (triad === 'diminished' && seventh === 10) sev = 'm7b5';
        else if (triad === 'diminished' && seventh === 9) sev = 'dim7';
        else if (triad === 'augmented' && seventh === 11) sev = 'augMaj7';
        else if (triad === 'augmented' && seventh === 10) sev = 'aug7';

        const isMinorish = triad === 'minor' || triad === 'diminished';
        let roman = isMinorish ? COMPOSE_NUMERALS[d].toLowerCase() : COMPOSE_NUMERALS[d];
        if (ext === 'sevenths') {
            roman += seventhRoman[sev];
        } else if (triad === 'diminished') {
            roman += '°';
        } else if (triad === 'augmented') {
            roman += '+';
        }

        const useSeventh = ext === 'sevenths';
        const count = useSeventh ? 4 : 3;

        chords.push({
            degree: d + 1,
            roman,
            symbol: composePretty(spelled[0]) + (useSeventh ? seventhSuffix[sev] : triadSuffix[triad]),
            notes: spelled.slice(0, count).map(composePretty),
            pcs: pcs.slice(0, count),
            triad,
            seventh: sev,
            isHome: d === 0
        });
    }
    return chords;
}

/** Notes (as pitch-class numbers) that make up the scale. */
function composeScalePcs(mode, rootPc) {
    return mode.intervals.map(interval => (rootPc + interval) % 12);
}

/** Voice a chord upward from the root, e.g. [9,0,4] -> ['A3','C4','E4'] */
function composeVoice(pcs, baseOctave = 3) {
    let octave = baseOctave;
    let previous = -1;
    return pcs.map((pc, i) => {
        if (i > 0 && pc < previous) octave++;
        previous = pc;
        return CHROMATIC_SCALE[pc] + octave;
    });
}

/** Position in a two-octave melody range (0-13) -> note info */
function composeMelodyNote(position, mode, rootPc, spelledNames) {
    const degreeIndex = position % 7;
    const octaveShift = Math.floor(position / 7);
    // Keep the root between G3 and F#4 so the motif stays in a comfortable range
    const rootMidi = 60 + (rootPc >= 7 ? rootPc - 12 : rootPc);
    const absolute = rootMidi + mode.intervals[degreeIndex] + 12 * octaveShift;
    return {
        name: composePretty(spelledNames[degreeIndex]),
        degree: degreeIndex + 1,
        tone: CHROMATIC_SCALE[absolute % 12] + (Math.floor(absolute / 12) - 1)
    };
}

/**
 * Roll a short 4-note motif. It starts and ends on a chord tone of the first chord,
 * and moves mostly by step so it sounds singable.
 */
function composeRollMotif(firstChord, random = Math.random) {
    const MIN = 2;
    const MAX = 11;
    const d = firstChord.degree - 1;
    const toneIndexes = [d, (d + 2) % 7, (d + 4) % 7];
    const isChordTone = position => toneIndexes.includes(position % 7);
    const pick = list => list[Math.floor(random() * list.length)];

    const startCandidates = [];
    for (let p = 3; p <= 9; p++) if (isChordTone(p)) startCandidates.push(p);

    const motif = [pick(startCandidates)];
    const steps = [-2, -1, -1, 1, 1, 2];
    while (motif.length < 3) {
        const current = motif[motif.length - 1];
        const options = steps.map(s => current + s).filter(p => p >= MIN && p <= MAX);
        motif.push(pick(options));
    }

    // Resolve onto the nearest chord tone (different from the previous note if possible)
    const last = motif[motif.length - 1];
    const targets = [];
    for (let p = MIN; p <= MAX; p++) if (isChordTone(p)) targets.push(p);
    targets.sort((a, b) => Math.abs(a - last) - Math.abs(b - last));
    const resolve = targets.find(p => p !== last && Math.abs(p - last) <= 2) ?? targets[0];
    motif.push(resolve);

    return motif;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let composeState = {
    step: 0,
    mood: null,
    style: null,
    mode: null,
    root: null,
    rootTouched: false,
    ext: null,
    extTouched: false,
    prog: 0,
    selectedChord: 0,
    motif: null,
    motifRhythm: null
};

let composeLoopTimer = null;
let composeLoopIndex = -1;
let composeSynth = null;

function composeLoadState() {
    try {
        const stored = JSON.parse(localStorage.getItem(COMPOSE_STORAGE_KEY));
        if (!stored || typeof stored !== 'object') return;
        const valid = Object.assign({}, composeState);
        if (COMPOSE_MOODS.some(m => m.id === stored.mood)) valid.mood = stored.mood;
        if (COMPOSE_STYLES.some(s => s.id === stored.style)) valid.style = stored.style;
        if (COMPOSE_MODES[stored.mode]) valid.mode = stored.mode;
        if (Number.isInteger(stored.root) && stored.root >= 0 && stored.root < 12) valid.root = stored.root;
        if (stored.ext === 'triads' || stored.ext === 'sevenths') valid.ext = stored.ext;
        valid.rootTouched = !!stored.rootTouched;
        valid.extTouched = !!stored.extTouched;
        if (Number.isInteger(stored.prog) && stored.prog >= 0) valid.prog = stored.prog;
        if (Number.isInteger(stored.step) && stored.step >= 0 && stored.step < COMPOSE_STEPS.length) valid.step = stored.step;
        composeState = valid;
    } catch (e) {
        // Ignore broken storage
    }
    composeNormalizeState();
}

function composeSaveState() {
    try {
        localStorage.setItem(COMPOSE_STORAGE_KEY, JSON.stringify({
            step: composeState.step,
            mood: composeState.mood,
            style: composeState.style,
            mode: composeState.mode,
            root: composeState.root,
            rootTouched: composeState.rootTouched,
            ext: composeState.ext,
            extTouched: composeState.extTouched,
            prog: composeState.prog
        }));
    } catch (e) {
        console.error('Failed to save compose state:', e);
    }
}

/** Keep the state consistent (e.g. mode must belong to the mood). */
function composeNormalizeState() {
    const s = composeState;
    const mood = COMPOSE_MOODS.find(m => m.id === s.mood);
    if (mood && s.mode && !mood.modes.includes(s.mode)) s.mode = null;
    if (mood && !s.mode) s.mode = mood.modes[0];
    if (!mood) s.mode = null;
    if (s.mode && s.root === null) s.root = COMPOSE_MODES[s.mode].whiteKeyRoot;
    const style = COMPOSE_STYLES.find(x => x.id === s.style);
    if (style && !s.ext) s.ext = style.ext;
    if (s.mode) {
        const count = COMPOSE_PROGRESSIONS[s.mode].length;
        if (s.prog >= count) s.prog = 0;
    }
    // A step can only be open if every question before it is answered
    s.step = Math.min(s.step, composeMaxStep());
}

function composeCanProceed(step) {
    const s = composeState;
    if (step === 0) return !!s.mood;
    if (step === 1) return !!s.style;
    if (step === 2) return !!s.mode && s.root !== null;
    return true;
}

/** The furthest step the person may open: the first unanswered question, or the last step. */
function composeMaxStep() {
    for (let k = 0; k < COMPOSE_STEPS.length; k++) {
        if (!composeCanProceed(k)) return k;
    }
    return COMPOSE_STEPS.length - 1;
}

function composeGetContext() {
    const s = composeState;
    const mood = COMPOSE_MOODS.find(m => m.id === s.mood) || null;
    const style = COMPOSE_STYLES.find(x => x.id === s.style) || null;
    const mode = s.mode ? COMPOSE_MODES[s.mode] : null;
    const ready = !!(mood && style && mode && s.root !== null);
    const ctx = { mood, style, mode, ready };
    if (ready) {
        ctx.rootPc = s.root;
        ctx.spelled = composeChooseSpelling(s.root, mode.intervals);
        ctx.rootName = composePretty(ctx.spelled[0]);
        ctx.scalePcs = composeScalePcs(mode, s.root);
        ctx.chords = composeBuildChords(mode, s.root, s.ext || style.ext);
        ctx.progressions = COMPOSE_PROGRESSIONS[mode.id];
        ctx.progression = ctx.progressions[Math.min(s.prog, ctx.progressions.length - 1)];
        ctx.progressionChords = ctx.progression.degrees.map(deg => ctx.chords[deg - 1]);
    }
    return ctx;
}

// ---------------------------------------------------------------------------
// Sound (optional)
// ---------------------------------------------------------------------------

function composeEnsureSynth() {
    if (typeof Tone === 'undefined') return null;
    if (!composeSynth) {
        composeSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 1.2 }
        }).toDestination();
    }
    return composeSynth;
}

async function composeStartAudio() {
    if (typeof Tone === 'undefined') return false;
    try {
        await Tone.start();
        composeEnsureSynth();
        return true;
    } catch (e) {
        console.error('Audio could not be started:', e);
        return false;
    }
}

function composePlayChord(chord, seconds = 1.6) {
    const synth = composeEnsureSynth();
    if (!synth) return;
    synth.triggerAttackRelease(composeVoice(chord.pcs), seconds);
}

function composePlayMotif(motif, ctx) {
    const synth = composeEnsureSynth();
    if (!synth || typeof Tone === 'undefined') return;
    const now = Tone.now();
    motif.forEach((position, i) => {
        const note = composeMelodyNote(position, ctx.mode, ctx.rootPc, ctx.spelled);
        synth.triggerAttackRelease(note.tone, 0.4, now + i * 0.5);
    });
}

function composeStopLoop() {
    if (composeLoopTimer) clearInterval(composeLoopTimer);
    composeLoopTimer = null;
    composeLoopIndex = -1;
}

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------

function composeKeyboardHTML(options) {
    const scale = new Set(options.scalePcs || []);
    const chord = new Set(options.chordPcs || []);
    const rootPc = options.rootPc;
    const labels = options.labels || {};
    const whitePcs = [0, 2, 4, 5, 7, 9, 11];
    const blackAfterWhite = [[0, 1], [1, 3], [3, 6], [4, 8], [5, 10]];
    const octaves = 2;
    const totalWhite = 7 * octaves;

    const keyClasses = pc => {
        const classes = [];
        if (scale.has(pc)) classes.push('is-scale');
        if (pc === rootPc) classes.push('is-root');
        if (chord.has(pc)) classes.push('is-chord');
        return classes.join(' ');
    };

    let whites = '';
    let blacks = '';
    for (let o = 0; o < octaves; o++) {
        whitePcs.forEach(pc => {
            const label = (scale.has(pc) || chord.has(pc)) && labels[pc] ? labels[pc] : '';
            whites += `<div class="kb-key kb-white ${keyClasses(pc)}"><span>${label}</span></div>`;
        });
        blackAfterWhite.forEach(([whiteIndex, pc]) => {
            const boundary = ((o * 7 + whiteIndex + 1) / totalWhite) * 100;
            const label = (scale.has(pc) || chord.has(pc)) && labels[pc] ? labels[pc] : '';
            blacks += `<div class="kb-key kb-black ${keyClasses(pc)}" style="left: calc(${boundary}% - 2.6%);"><span>${label}</span></div>`;
        });
    }

    return `<div class="kb" aria-hidden="true"><div class="kb-whites">${whites}</div>${blacks}</div>`;
}

function composeLabelsFromContext(ctx, chord) {
    const labels = {};
    ctx.spelled.forEach((name, i) => { labels[ctx.scalePcs[i]] = composePretty(name); });
    if (chord) chord.pcs.forEach((pc, i) => { labels[pc] = chord.notes[i]; });
    return labels;
}

function composeLegend(showChord) {
    return `<div class="kb-legend">
        <span><i class="kb-dot is-scale"></i> in the scale</span>
        <span><i class="kb-dot is-root"></i> root</span>
        ${showChord ? '<span><i class="kb-dot is-chord"></i> chord notes</span>' : ''}
    </div>`;
}

function composeTryIt(text) {
    return `<div class="try-it"><strong>🎯 Try it:</strong> ${text}</div>`;
}

function composeLearnMore(links) {
    return `<div class="learn-more">📚 Learn more: ${links.map(l => `<a href="${l.href}">${l.label}</a>`).join(' · ')}</div>`;
}

function composeNavButtons() {
    const s = composeState;
    const last = s.step === COMPOSE_STEPS.length - 1;
    const canNext = composeCanProceed(s.step);
    return `<div class="step-nav">
        <button class="nav-btn secondary" data-action="back" ${s.step === 0 ? 'disabled' : ''}>← Back</button>
        ${last
            ? '<button class="nav-btn secondary" data-action="reset">↺ Start over</button>'
            : `<button class="nav-btn primary" data-action="next" ${canNext ? '' : 'disabled'}>Next →</button>`}
    </div>`;
}

// ---------------------------------------------------------------------------
// Step renderers
// ---------------------------------------------------------------------------

function composeRenderMood() {
    const cards = COMPOSE_MOODS.map(m => `
        <button class="choice-card ${composeState.mood === m.id ? 'selected' : ''}" data-action="pick-mood" data-id="${m.id}">
            <div class="choice-icon">${m.icon}</div>
            <div class="choice-title">${m.name}</div>
            <div class="choice-sub">${m.blurb}</div>
        </button>`).join('');

    return `
        <h2>How should it feel?</h2>
        <p class="step-intro">The mood decides which family of scales you work in. Minor-sounding scales feel sad or dark, major-sounding scales feel bright.</p>
        <div class="choice-grid">${cards}</div>
        ${composeLearnMore([{ href: 'wiki-scales.html', label: 'Scales' }, { href: 'wiki-minor-scales.html', label: 'Minor scales' }])}
    `;
}

function composeRenderStyle() {
    const cards = COMPOSE_STYLES.map(x => `
        <button class="choice-card ${composeState.style === x.id ? 'selected' : ''}" data-action="pick-style" data-id="${x.id}">
            <div class="choice-icon">${x.icon}</div>
            <div class="choice-title">${x.name}</div>
            <div class="choice-sub">${x.blurb}</div>
        </button>`).join('');

    return `
        <h2>What is it for?</h2>
        <p class="step-intro">The style does not change which notes fit, but it changes how many chords you use, how fast they change and whether you add 7ths.</p>
        <div class="choice-grid">${cards}</div>
        ${composeTryIt('Listen to one track in this style and count how many different chords you hear in 16 bars. It is usually fewer than you expect.')}
    `;
}

function composeRenderScale(ctx) {
    const s = composeState;
    const mood = ctx.mood;

    const modeCards = mood.modes.map(id => {
        const mode = COMPOSE_MODES[id];
        return `
        <button class="choice-card wide ${s.mode === id ? 'selected' : ''}" data-action="pick-mode" data-id="${id}">
            <div class="choice-title">${mode.name}${mode.alias !== mode.name ? ` <span class="alias">(${mode.alias})</span>` : ''}</div>
            <div class="choice-sub">${mood.modeNotes[id]}</div>
            <div class="choice-formula">${mode.compare}</div>
        </button>`;
    }).join('');

    const rootButtons = COMPOSE_ROOT_LABELS.map((label, pc) => {
        const mode = COMPOSE_MODES[s.mode];
        const white = composeIsWhiteKeyScale(pc, mode.intervals);
        return `<button class="root-btn ${s.root === pc ? 'selected' : ''}" data-action="pick-root" data-pc="${pc}" title="${white ? 'Only white keys' : ''}">${label}${white ? ' ⭐' : ''}</button>`;
    }).join('');

    let result = '';
    if (ctx.ready) {
        const mode = ctx.mode;
        const colorNote = composePretty(ctx.spelled[mode.colorDegree - 1]);
        const white = composeIsWhiteKeyScale(ctx.rootPc, mode.intervals);
        result = `
        <div class="result-box">
            <div class="result-title">${ctx.rootName} ${mode.name}</div>
            <div class="scale-line">${ctx.spelled.map(composePretty).join(' – ')} – ${composePretty(ctx.spelled[0])}</div>
            ${composeKeyboardHTML({ scalePcs: ctx.scalePcs, rootPc: ctx.rootPc, labels: composeLabelsFromContext(ctx) })}
            ${composeLegend(false)}
            <p class="note-line">${white ? '⭐ This scale uses only white keys, which makes it the easiest place to start. ' : ''}Every note you play from the highlighted keys fits together.</p>
            <p class="note-line"><strong>Color note:</strong> ${colorNote} (${mode.colorLabel}). ${mode.colorHint}</p>
        </div>`;
    }

    return `
        <h2>Choose your scale</h2>
        <p class="step-intro">For <strong>${mood.name.toLowerCase()}</strong> these scales work well:</p>
        <div class="choice-grid single">${modeCards}</div>

        <h3>Choose your key</h3>
        <p class="step-intro">⭐ marks keys that use only white keys. Start there and transpose later.</p>
        <div class="root-grid">${rootButtons}</div>

        ${result}
        ${composeTryIt('Play the highlighted keys up and down. Then hold the root note with your left hand and improvise with your right hand, using only highlighted keys, for one minute.')}
        ${composeLearnMore([{ href: 'wiki-master-pattern.html', label: 'Master pattern' }, { href: 'wiki-building-scales.html', label: 'Building scales' }, { href: 'find-scale.html', label: 'Find Scale' }])}
    `;
}

function composeRenderChords(ctx) {
    const s = composeState;
    const ext = s.ext || ctx.style.ext;
    const selected = ctx.chords[s.selectedChord] || ctx.chords[0];

    const cards = ctx.chords.map((chord, i) => `
        <button class="chord-card ${i === s.selectedChord ? 'selected' : ''} ${chord.isHome ? 'home' : ''}" data-action="pick-chord" data-idx="${i}">
            ${chord.isHome ? '<span class="home-badge">home</span>' : ''}
            <div class="chord-roman">${chord.roman}</div>
            <div class="chord-symbol">${chord.symbol}</div>
            <div class="chord-notes">${chord.notes.join(' ')}</div>
        </button>`).join('');

    return `
        <h2>Your chords</h2>
        <p class="step-intro">Stack every other note of the scale (skip - pick - skip - pick) and you get the chords of <strong>${ctx.rootName} ${ctx.mode.name}</strong>. Any mix of these chords sounds harmonious, because they all come from the same seven notes.</p>

        <div class="segmented">
            <button class="${ext === 'triads' ? 'selected' : ''}" data-action="set-ext" data-ext="triads">Triads</button>
            <button class="${ext === 'sevenths' ? 'selected' : ''}" data-action="set-ext" data-ext="sevenths">7th chords</button>
        </div>
        <p class="note-line">${ext === 'sevenths'
            ? '7th chords add one more note on top. They sound smoother and more modern.'
            : 'Triads have three notes. They are the simplest and clearest sound.'}
            ${ctx.style.ext === ext ? '' : ` (${ctx.style.name} usually uses ${ctx.style.ext === 'sevenths' ? '7th chords' : 'triads'}.)`}</p>

        <div class="chord-grid">${cards}</div>

        <div class="result-box">
            <div class="result-title">${selected.symbol} <span class="alias">(${selected.roman})</span></div>
            ${composeKeyboardHTML({ scalePcs: ctx.scalePcs, rootPc: ctx.rootPc, chordPcs: selected.pcs, labels: composeLabelsFromContext(ctx, selected) })}
            ${composeLegend(true)}
        </div>

        ${composeTryIt('Tap each chord and play it on your piano. Find the two that feel most like "home" and the one that feels furthest away.')}
        ${composeLearnMore([{ href: 'wiki-building-chords.html', label: 'Building chords' }, { href: 'wiki-natural-chords.html', label: 'Natural chords' }])}
    `;
}

function composeRenderProgression(ctx) {
    const s = composeState;
    const isLooping = composeLoopTimer !== null;
    const active = isLooping && composeLoopIndex >= 0 ? composeLoopIndex : -1;
    const shownChord = active >= 0 ? ctx.progressionChords[active] : ctx.progressionChords[0];

    const options = ctx.progressions.map((p, i) => {
        const chords = p.degrees.map(deg => ctx.chords[deg - 1]);
        return `
        <button class="choice-card wide ${i === Math.min(s.prog, ctx.progressions.length - 1) ? 'selected' : ''}" data-action="pick-prog" data-idx="${i}">
            <div class="choice-title">${p.name}</div>
            <div class="prog-romans">${chords.map(c => c.roman).join(' – ')}</div>
            <div class="prog-chords">${chords.map(c => c.symbol).join(' – ')}</div>
            <div class="choice-sub">${p.note}</div>
        </button>`;
    }).join('');

    const strip = ctx.progressionChords.map((chord, i) => `
        <div class="strip-chord ${i === active ? 'active' : ''}">
            <div class="chord-symbol">${chord.symbol}</div>
            <div class="chord-notes">${chord.notes.join(' ')}</div>
        </div>`).join('');

    const tips = ctx.style.tips.map(t => `<li>${t}</li>`).join('');

    return `
        <h2>Pick a progression</h2>
        <p class="step-intro">A progression is a short loop of chords. These are built from the chords of <strong>${ctx.rootName} ${ctx.mode.name}</strong>, written as Roman numerals (so you can move them to any key).</p>
        <div class="choice-grid single">${options}</div>

        <div class="result-box">
            <div class="result-title">${ctx.progressionChords.map(c => c.symbol).join(' – ')}</div>
            <div class="chord-strip">${strip}</div>
            <button class="nav-btn primary loop-btn" data-action="toggle-loop">${isLooping ? '⏹ Stop' : '▶ Hear it'}</button>
            ${composeKeyboardHTML({ scalePcs: ctx.scalePcs, rootPc: ctx.rootPc, chordPcs: shownChord.pcs, labels: composeLabelsFromContext(ctx, shownChord) })}
            ${composeLegend(true)}
        </div>

        <h3>${ctx.style.icon} Playing it in ${ctx.style.name}</h3>
        <p class="note-line">Tempo: ${ctx.style.tempo}.</p>
        <ul class="tip-list">${tips}</ul>

        ${composeTryIt('Loop the progression. Play the root note of each chord with your left hand and the full chord with your right hand. Then try playing only the root with the left hand and the top notes of the chord with the right hand.')}
        ${composeLearnMore([{ href: 'wiki-roman-numerals.html', label: 'Roman numerals' }, { href: 'chord-progressions.html', label: 'More progressions' }, { href: 'calculate-chords.html', label: 'Calculate Chords' }])}
    `;
}

function composeRenderMelody(ctx) {
    const s = composeState;
    const mode = ctx.mode;
    const first = ctx.progressionChords[0];
    const colorNote = composePretty(ctx.spelled[mode.colorDegree - 1]);

    const chordToneRows = ctx.progressionChords.map(chord => {
        const tones = chord.notes.slice(0, 3).join(' ');
        return `<tr><td>${chord.symbol}</td><td>${tones}</td></tr>`;
    }).join('');

    let motifHTML = '<p class="note-line">Press the button to get a starting idea for your melody.</p>';
    if (s.motif) {
        const notes = s.motif.map(position => composeMelodyNote(position, mode, ctx.rootPc, ctx.spelled));
        motifHTML = `
            <div class="motif-notes">${notes.map(n => `<span class="motif-note">${n.name}</span>`).join('<span class="motif-arrow">→</span>')}</div>
            <p class="note-line">Scale degrees: ${notes.map(n => n.degree).join(' – ')}<br>Rhythm idea: ${s.motifRhythm}</p>`;
    }

    const generalTips = [
        'Use only notes from the scale.',
        'Start and end phrases on a chord tone of the chord that is playing.',
        'Put chord tones on strong beats and let other scale notes connect them.',
        'Repeat a short motif and change just one note each time.',
        'Leave gaps. Rests make a melody breathe.'
    ].map(t => `<li>${t}</li>`).join('');
    const moodTips = ctx.mood.melodyTips.map(t => `<li>${t}</li>`).join('');

    return `
        <h2>Find your melody</h2>
        <div class="recipe-card">
            <div><strong>${ctx.mood.icon} ${ctx.mood.name}</strong> in <strong>${ctx.style.name}</strong></div>
            <div>Scale: <strong>${ctx.rootName} ${mode.name}</strong> (${ctx.spelled.map(composePretty).join(' ')})</div>
            <div>Chords: <strong>${ctx.progressionChords.map(c => c.symbol).join(' – ')}</strong> (${ctx.progressionChords.map(c => c.roman).join(' – ')})</div>
            <div>Color note: <strong>${colorNote}</strong> (${mode.colorLabel})</div>
        </div>

        <h3>Chord tones to aim for</h3>
        <table class="tone-table"><thead><tr><th>Chord</th><th>Good target notes</th></tr></thead><tbody>${chordToneRows}</tbody></table>

        <h3>${ctx.mood.name} melody tips</h3>
        <ul class="tip-list">${moodTips}</ul>
        <h3>Always true</h3>
        <ul class="tip-list">${generalTips}</ul>

        <h3>Need a starting idea?</h3>
        <p class="note-line">This rolls four notes that start and end on a chord tone of ${first.symbol}.</p>
        <div class="result-box">
            ${motifHTML}
            <div class="button-row">
                <button class="nav-btn primary" data-action="roll-motif">🎲 Roll a motif</button>
                ${s.motif ? '<button class="nav-btn secondary" data-action="play-motif">▶ Hear motif</button>' : ''}
                <button class="nav-btn secondary loop-btn-inline" data-action="toggle-loop">${composeLoopTimer ? '⏹ Stop chords' : '▶ Loop chords'}</button>
            </div>
        </div>

        ${composeTryIt('Loop the chords, roll a motif and play it over the first chord. Then play it again over the next chord and change one note. Keep what sounds good.')}
    `;
}

// ---------------------------------------------------------------------------
// Main render
// ---------------------------------------------------------------------------

function composeRenderRecipe(ctx) {
    const chips = [];
    if (ctx.mood) chips.push({ step: 0, text: `${ctx.mood.icon} ${ctx.mood.name}` });
    if (ctx.style) chips.push({ step: 1, text: `${ctx.style.icon} ${ctx.style.name}` });
    if (ctx.ready) {
        chips.push({ step: 2, text: `🎼 ${ctx.rootName} ${ctx.mode.name}` });
        if (composeState.step >= 4) {
            chips.push({ step: 4, text: `🔁 ${ctx.progressionChords.map(c => c.roman).join(' – ')}` });
        }
    }
    if (!chips.length) return '';
    return chips.map(c => `<button class="chip" data-action="go" data-step="${c.step}">${c.text}</button>`).join('');
}

function composeRender() {
    composeNormalizeState();
    const s = composeState;
    const ctx = composeGetContext();

    // Stepper
    const stepper = COMPOSE_STEPS.map((step, i) => {
        const reachable = i <= composeMaxStep();
        const classes = ['stepper-btn'];
        if (i === s.step) classes.push('active');
        if (i < s.step) classes.push('done');
        return `<button class="${classes.join(' ')}" data-action="go" data-step="${i}" ${reachable ? '' : 'disabled'}>
            <span class="stepper-icon">${step.icon}</span><span class="stepper-label">${step.title}</span>
        </button>`;
    }).join('');
    document.getElementById('stepper').innerHTML = stepper;
    document.getElementById('recipe').innerHTML = composeRenderRecipe(ctx);

    // Step content
    let html = '';
    switch (COMPOSE_STEPS[s.step].id) {
        case 'mood': html = composeRenderMood(); break;
        case 'style': html = composeRenderStyle(); break;
        case 'scale': html = ctx.mood ? composeRenderScale(ctx) : ''; break;
        case 'chords': html = ctx.ready ? composeRenderChords(ctx) : ''; break;
        case 'progression': html = ctx.ready ? composeRenderProgression(ctx) : ''; break;
        case 'melody': html = ctx.ready ? composeRenderMelody(ctx) : ''; break;
    }
    document.getElementById('step-content').innerHTML = html + composeNavButtons();
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function composeGoTo(step) {
    if (step < 0 || step >= COMPOSE_STEPS.length || step > composeMaxStep()) return;
    if (step !== composeState.step) composeStopLoop();
    composeState.step = step;
    composeSaveState();
    composeRender();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function composeHandleAction(action, target) {
    const s = composeState;
    const data = target.dataset;

    switch (action) {
        case 'pick-mood':
            s.mood = data.id;
            s.mode = null;
            s.prog = 0;
            s.motif = null;
            composeNormalizeState();
            if (!s.rootTouched) s.root = COMPOSE_MODES[s.mode].whiteKeyRoot;
            break;
        case 'pick-style': {
            s.style = data.id;
            if (!s.extTouched) s.ext = COMPOSE_STYLES.find(x => x.id === data.id).ext;
            break;
        }
        case 'pick-mode':
            s.mode = data.id;
            s.prog = 0;
            s.motif = null;
            if (!s.rootTouched) s.root = COMPOSE_MODES[s.mode].whiteKeyRoot;
            break;
        case 'pick-root':
            s.root = parseInt(data.pc, 10);
            s.rootTouched = true;
            s.motif = null;
            break;
        case 'set-ext':
            s.ext = data.ext;
            s.extTouched = true;
            break;
        case 'pick-chord': {
            s.selectedChord = parseInt(data.idx, 10);
            composeSaveState();
            composeRender();
            if (await composeStartAudio()) {
                composePlayChord(composeGetContext().chords[s.selectedChord]);
            }
            return;
        }
        case 'pick-prog':
            composeStopLoop();
            s.prog = parseInt(data.idx, 10);
            s.motif = null;
            break;
        case 'toggle-loop': {
            if (composeLoopTimer) {
                composeStopLoop();
                composeRender();
                return;
            }
            const ctx = composeGetContext();
            if (!ctx.ready) return;
            const hasAudio = await composeStartAudio();
            const step = () => {
                composeLoopIndex = (composeLoopIndex + 1) % ctx.progressionChords.length;
                if (hasAudio) composePlayChord(ctx.progressionChords[composeLoopIndex]);
                composeRender();
            };
            // Set the timer first so the very first render already shows "Stop" and the active chord
            composeLoopTimer = setInterval(step, 1800);
            step();
            return;
        }
        case 'roll-motif': {
            const ctx = composeGetContext();
            if (!ctx.ready) return;
            s.motif = composeRollMotif(ctx.progressionChords[0]);
            s.motifRhythm = COMPOSE_RHYTHMS[Math.floor(Math.random() * COMPOSE_RHYTHMS.length)];
            composeRender();
            if (await composeStartAudio()) composePlayMotif(s.motif, ctx);
            return;
        }
        case 'play-motif': {
            const ctx = composeGetContext();
            if (ctx.ready && s.motif && await composeStartAudio()) composePlayMotif(s.motif, ctx);
            return;
        }
        case 'go':
            composeGoTo(parseInt(data.step, 10));
            return;
        case 'next':
            if (composeCanProceed(s.step)) composeGoTo(s.step + 1);
            return;
        case 'back':
            composeGoTo(s.step - 1);
            return;
        case 'reset':
            composeStopLoop();
            composeState = Object.assign({}, composeState, {
                step: 0, mood: null, style: null, mode: null, root: null, rootTouched: false,
                ext: null, extTouched: false, prog: 0, selectedChord: 0, motif: null, motifRhythm: null
            });
            composeSaveState();
            composeRender();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        default:
            return;
    }

    composeNormalizeState();
    composeSaveState();
    composeRender();
}

function composeInit() {
    composeLoadState();
    document.addEventListener('click', event => {
        const target = event.target.closest('[data-action]');
        if (!target || target.disabled) return;
        composeHandleAction(target.dataset.action, target);
    });
    composeRender();
}

if (typeof document !== 'undefined' && document.getElementById('step-content')) {
    composeInit();
}
