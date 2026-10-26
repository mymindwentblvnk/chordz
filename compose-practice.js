/**
 * Compose Practice
 * Drill: you see a Roman numeral progression and a key, and press the keys of every chord.
 *
 * Depends on: music-theory.js, compose-data.js, compose.js (scale spelling, chord building, sound)
 * Optional: plan-data.js, plan-core.js (lesson mode, opened as compose-practice.html?lesson=N from the 4-week plan)
 */

const PRACTICE_STORAGE_KEY = 'chordz-compose-practice';

const PRACTICE_ALL_ROOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// Which keys are used per level (pitch class 0 = C ... 11 = B)
const PRACTICE_LEVELS = {
    1: { name: 'Level 1', desc: 'Easy keys: at most one ♯ or ♭', major: [0, 7, 5], minor: [9, 4, 2] },
    2: { name: 'Level 2', desc: 'Up to three ♯ or ♭', major: [0, 7, 5, 2, 10, 9, 3], minor: [9, 4, 2, 11, 7, 0, 6] },
    3: { name: 'Level 3', desc: 'All 12 keys', major: PRACTICE_ALL_ROOTS, minor: PRACTICE_ALL_ROOTS }
};

// Extra progressions (scale degrees) on top of the ones from compose-data.js
const PRACTICE_EXTRA_PROGRESSIONS = {
    ionian: [[1, 4, 5, 1], [2, 5, 1], [1, 4, 6, 5]],
    aeolian: [[1, 4, 5, 1], [1, 6, 7, 1]]
};

const PRACTICE_TYPES = { major: 'ionian', minor: 'aeolian' };

const PRACTICE_KEY_LABELS = ['C', 'C♯ D♭', 'D', 'D♯ E♭', 'E', 'F', 'F♯ G♭', 'G', 'G♯ A♭', 'A', 'A♯ B♭', 'B'];

// ---------------------------------------------------------------------------
// Pure logic
// ---------------------------------------------------------------------------

function practiceSameSet(a, b) {
    return a.length === b.length && a.every(x => b.includes(x));
}

/** All progressions (as scale degree lists) that can be asked for a mode. */
function practiceProgressionPool(modeId) {
    const base = (COMPOSE_PROGRESSIONS[modeId] || []).map(p => p.degrees.slice());
    const extra = (PRACTICE_EXTRA_PROGRESSIONS[modeId] || []).map(d => d.slice());
    const seen = new Set();
    return base.concat(extra).filter(degrees => {
        const key = degrees.join('-');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/**
 * Create a new question.
 * @param {{level:number,type:string,ext:string}} settings
 * @param {Function} random - returns a number in [0,1)
 * @param {object|null} previous - previous question, to avoid asking the same one twice
 */
function practiceNewQuestion(settings, random = Math.random, previous = null) {
    const level = PRACTICE_LEVELS[settings.level] || PRACTICE_LEVELS[1];
    const pick = list => list[Math.floor(random() * list.length)];

    let question = null;
    for (let attempt = 0; attempt < 8; attempt++) {
        const type = settings.type === 'both' ? pick(['major', 'minor']) : settings.type;
        const modeId = PRACTICE_TYPES[type];
        const mode = COMPOSE_MODES[modeId];
        const rootPc = pick(level[type]);
        const degrees = pick(practiceProgressionPool(modeId));

        const allChords = composeBuildChords(mode, rootPc, settings.ext);
        const spelled = composeChooseSpelling(rootPc, mode.intervals);
        question = {
            type, modeId, rootPc, degrees, ext: settings.ext,
            rootName: composePretty(spelled[0]),
            spelled,
            chords: degrees.map(d => allChords[d - 1]),
            answers: degrees.map(() => []),
            slot: 0,
            hintLevel: 0,
            attempts: 0,
            results: null,
            solved: false,
            revealed: false,
            finalized: false
        };
        const same = previous && previous.modeId === modeId && previous.rootPc === rootPc &&
            previous.degrees.join('-') === degrees.join('-');
        if (!same) break;
    }
    return question;
}

function practiceNeededNotes(question) {
    return question.ext === 'sevenths' ? 4 : 3;
}

function practiceToggleKey(question, pc) {
    if (question.solved || question.revealed) return;
    const notes = question.answers[question.slot];
    const index = notes.indexOf(pc);
    if (index >= 0) notes.splice(index, 1);
    else notes.push(pc);
    question.results = null; // answer changed, old feedback is outdated
}

/** Check all slots. Returns per-slot booleans. */
function practiceCheck(question) {
    question.attempts++;
    question.results = question.chords.map((chord, i) => practiceSameSet(question.answers[i], chord.pcs));
    if (question.results.every(Boolean)) question.solved = true;
    return question.results;
}

/** Update the statistics once per question. */
function practiceFinalize(question, stats) {
    if (question.finalized) return;
    question.finalized = true;
    stats.answered++;
    const clean = question.solved && question.attempts === 1 && question.hintLevel === 0;
    if (clean) {
        stats.clean++;
        stats.streak++;
        stats.best = Math.max(stats.best, stats.streak);
    } else {
        stats.streak = 0;
    }
}

function practiceQualityWord(chord) {
    return { major: 'a major chord', minor: 'a minor chord', diminished: 'a diminished chord', augmented: 'an augmented chord' }[chord.triad] || 'a chord';
}

/** Step-by-step explanation of how to work out the answer. */
function practiceExplain(question) {
    const mode = COMPOSE_MODES[question.modeId];
    const scale = question.spelled.map(composePretty);
    const steps = [];
    steps.push(`Spell the scale of ${question.rootName} ${question.type}: ${scale.join(' ')}`);
    question.chords.forEach(chord => {
        const idx = chord.degree - 1;
        const third = scale[(idx + 2) % 7];
        const skipped = scale[(idx + 1) % 7];
        const fifth = scale[(idx + 4) % 7];
        const rule = chord.triad === 'diminished' ? 'The ° (or ø) marks'
            : (chord.triad === 'minor' ? 'A lowercase numeral means' : 'An uppercase numeral means');
        let line = `${chord.roman}: scale note ${chord.degree} is ${scale[idx]}. ` +
            `${rule} ${practiceQualityWord(chord)}. ` +
            `Skip ${skipped}, pick ${third}, skip ${scale[(idx + 3) % 7]}, pick ${fifth}`;
        if (question.ext === 'sevenths') line += `, skip ${scale[(idx + 5) % 7]}, pick ${scale[(idx + 6) % 7]}`;
        line += ` → ${chord.symbol} = ${chord.notes.join(' ')}`;
        steps.push(line);
    });
    return { patternHint: mode.compare, steps };
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let practiceSettings = { level: 1, type: 'both', ext: 'triads' };
let practiceStats = { answered: 0, clean: 0, streak: 0, best: 0 };
let practiceQuestion = null;

// Lesson mode: { day, title, exercise, round } when opened from a plan lesson, otherwise null
let practiceLesson = null;
let practiceStoredSettings = null; // the learner's own settings, kept while a lesson overrides them

/** Read ?lesson=N. Returns the lesson day with an exercise, or null. */
function practiceLessonFromSearch(search) {
    if (typeof planFindDay !== 'function') return null;
    const match = /(?:^|[?&])lesson=(\d+)(?:&|$)/.exec(search || '');
    if (!match) return null;
    const day = planFindDay(parseInt(match[1], 10));
    return day && day.exercise ? day : null;
}

function practiceStartLesson(day) {
    practiceStoredSettings = Object.assign({}, practiceSettings);
    const ex = day.exercise;
    practiceSettings = { level: ex.level, type: ex.type, ext: ex.ext };
    let round = planLoadExercise(day.day);
    if (!round || round.status !== 'running') {
        round = planNewExercise(day.day);
        planSaveExercise(round);
    }
    practiceLesson = { day: day.day, title: day.title, exercise: ex, round };
}

function practiceLessonRestart() {
    practiceLesson.round = planNewExercise(practiceLesson.day);
    planSaveExercise(practiceLesson.round);
}

/** Count a finished question in the lesson round; marks the lesson done when the exercise is passed. */
function practiceLessonRecord(question) {
    const clean = question.solved && question.attempts === 1 && question.hintLevel === 0;
    const round = practiceLesson.round;
    planRecordAnswer(round, practiceLesson.exercise, clean);
    planSaveExercise(round);
    if (round.status === 'passed') planMarkDone(practiceLesson.day, 'auto');
}

/** Update statistics (once per question) and the lesson round. */
function practiceFinalizeQuestion(question) {
    if (question.finalized) return;
    practiceFinalize(question, practiceStats);
    if (practiceLesson) practiceLessonRecord(question);
}

function practiceLoad() {
    try {
        const stored = JSON.parse(localStorage.getItem(PRACTICE_STORAGE_KEY));
        if (!stored) return;
        if (stored.settings) {
            if ([1, 2, 3].includes(stored.settings.level)) practiceSettings.level = stored.settings.level;
            if (['major', 'minor', 'both'].includes(stored.settings.type)) practiceSettings.type = stored.settings.type;
            if (['triads', 'sevenths'].includes(stored.settings.ext)) practiceSettings.ext = stored.settings.ext;
        }
        if (stored.stats) {
            ['answered', 'clean', 'streak', 'best'].forEach(k => {
                if (Number.isInteger(stored.stats[k]) && stored.stats[k] >= 0) practiceStats[k] = stored.stats[k];
            });
        }
    } catch (e) {
        // Ignore broken storage
    }
}

function practiceSave() {
    try {
        localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({ settings: practiceStoredSettings || practiceSettings, stats: practiceStats }));
    } catch (e) {
        console.error('Failed to save practice state:', e);
    }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function practiceKeyboardHTML(question) {
    const selected = question.answers[question.slot] || [];
    const locked = question.solved || question.revealed;
    const whitePcs = [0, 2, 4, 5, 7, 9, 11];
    const whiteNames = { 0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B' };
    const blacks = [[0, 1], [1, 3], [3, 6], [4, 8], [5, 10]];

    const whites = whitePcs.map(pc => `
        <button class="pk-key pk-white ${selected.includes(pc) ? 'sel' : ''}" data-action="toggle-key" data-pc="${pc}" ${locked ? 'disabled' : ''} aria-label="${PRACTICE_KEY_LABELS[pc]}">
            <span>${whiteNames[pc]}</span>
        </button>`).join('');
    const blackKeys = blacks.map(([whiteIndex, pc]) => {
        const boundary = ((whiteIndex + 1) / 7) * 100;
        const [sharp, flat] = PRACTICE_KEY_LABELS[pc].split(' ');
        return `<button class="pk-key pk-black ${selected.includes(pc) ? 'sel' : ''}" data-action="toggle-key" data-pc="${pc}" style="left: calc(${boundary}% - 5.5%);" ${locked ? 'disabled' : ''} aria-label="${PRACTICE_KEY_LABELS[pc]}">
            <span>${sharp}<br>${flat}</span>
        </button>`;
    }).join('');

    return `<div class="pk"><div class="pk-whites">${whites}</div>${blackKeys}</div>`;
}

function practiceNoteList(pcs) {
    if (!pcs.length) return '–';
    return pcs.slice().sort((a, b) => a - b).map(pc => composePretty(CHROMATIC_SCALE[pc])).join(' ');
}

function practiceLessonBannerHtml() {
    const l = practiceLesson;
    const r = l.round;
    const progress = r.status === 'running'
        ? `Question ${Math.min(r.answered + 1, l.exercise.questions)} of ${l.exercise.questions}`
        : `${r.answered} of ${l.exercise.questions} answered`;
    return `
        <div class="lesson-banner">
            <div class="lesson-banner-title">📘 Lesson exercise · Day ${l.day}: ${l.title}</div>
            <div class="lesson-banner-line">${progress} · <strong>${r.perfect}</strong> perfect · you need at least <strong>${l.exercise.perfect}</strong> perfect out of ${l.exercise.questions}</div>
            <a class="back-link" href="${typeof planDayFileName === 'function' ? planDayFileName(l.day) : 'plan.html'}">← Back to the lesson</a>
        </div>`;
}

function practiceLessonNextButtons() {
    return practiceLesson.round.status === 'running'
        ? '<button class="nav-btn primary" data-action="next-question">Next question →</button>'
        : '';
}

function practiceLessonResultHtml() {
    const l = practiceLesson;
    const r = l.round;
    if (r.status === 'running') return '';
    const back = `<a class="nav-btn secondary" href="${planDayFileName(l.day)}">← Back to the lesson</a>`;
    if (r.status === 'passed') {
        return `
        <div class="feedback ok lesson-result">🎉 Exercise passed: ${r.perfect} of ${l.exercise.questions} perfect. Lesson ${l.day} is marked as done.</div>
        <div class="button-row">${back}<button class="nav-btn secondary" data-action="lesson-retry">Practice again</button></div>`;
    }
    return `
        <div class="feedback bad lesson-result">Not yet: ${r.perfect} of ${l.exercise.questions} perfect, you need ${l.exercise.perfect}. Try another round, the keys will be different.</div>
        <div class="button-row"><button class="nav-btn primary" data-action="lesson-retry">Try again</button>${back}</div>`;
}

function practiceRender() {
    const root = document.getElementById('practice-root');
    const q = practiceQuestion;
    const s = practiceSettings;
    const needed = practiceNeededNotes(q);

    const levelButtons = [1, 2, 3].map(n => `
        <button class="${s.level === n ? 'selected' : ''}" data-action="set-level" data-level="${n}">${PRACTICE_LEVELS[n].name}</button>`).join('');
    const typeButtons = [['major', 'Major'], ['minor', 'Minor'], ['both', 'Both']].map(([id, label]) => `
        <button class="${s.type === id ? 'selected' : ''}" data-action="set-type" data-type="${id}">${label}</button>`).join('');
    const extButtons = [['triads', 'Triads'], ['sevenths', '7th chords']].map(([id, label]) => `
        <button class="${s.ext === id ? 'selected' : ''}" data-action="set-ext" data-ext="${id}">${label}</button>`).join('');

    const slots = q.chords.map((chord, i) => {
        const status = q.results ? (q.results[i] ? 'ok' : 'bad') : (q.solved || q.revealed ? 'ok' : '');
        const icon = q.results ? (q.results[i] ? '✓' : '✗') : '';
        const shown = q.solved || q.revealed ? chord.notes.join(' ') : practiceNoteList(q.answers[i]);
        return `
        <button class="slot ${i === q.slot ? 'active' : ''} ${status}" data-action="pick-slot" data-idx="${i}">
            <div class="slot-roman">${chord.roman} ${icon}</div>
            <div class="slot-notes">${shown}</div>
            <div class="slot-count">${q.answers[i].length}/${needed}</div>
        </button>`;
    }).join('');

    let hints = '';
    if (q.hintLevel >= 1) {
        hints += `<div class="hint-box">💡 Scale: <strong>${q.spelled.map(composePretty).join(' ')}</strong> (${COMPOSE_MODES[q.modeId].compare})</div>`;
    }
    if (q.hintLevel >= 2) {
        hints += `<div class="hint-box">💡 Chord types: ${q.chords.map(c => `<strong>${c.roman}</strong> = ${c.triad}`).join(', ')}</div>`;
    }

    let feedback = '';
    if (q.results && !q.solved) {
        const wrong = q.results.filter(r => !r).length;
        feedback = `<div class="feedback bad">${wrong === 1 ? '1 chord is not right yet' : `${wrong} chords are not right yet`}. Tap the ✗ chord and try again, or ask for a hint.</div>`;
    }

    let solution = '';
    if (q.solved || q.revealed) {
        const explanation = practiceExplain(q);
        const answerLine = q.chords.map(c => `<span class="answer-chord"><strong>${c.symbol}</strong> ${c.notes.join(' ')}</span>`).join('');
        solution = `
        <div class="feedback ${q.solved ? 'ok' : 'info'}">${q.solved
            ? (q.attempts === 1 && q.hintLevel === 0 ? '🎉 Correct on the first try!' : '✓ Correct!')
            : 'Here is the answer:'}</div>
        <div class="answer-row">${answerLine}</div>
        <h3>How to work it out</h3>
        <ol class="explain-list">${explanation.steps.map(t => `<li>${t}</li>`).join('')}</ol>
        <div class="button-row">
            <button class="nav-btn secondary" data-action="hear-answer">▶ Hear it</button>
            ${practiceLesson ? practiceLessonNextButtons() : '<button class="nav-btn primary" data-action="next-question">Next question →</button>'}
        </div>
        ${practiceLesson ? practiceLessonResultHtml() : ''}`;
    }

    const actions = (q.solved || q.revealed) ? '' : `
        <div class="button-row">
            <button class="nav-btn primary" data-action="check">✔ Check</button>
            <button class="nav-btn secondary" data-action="clear-slot">Clear chord</button>
            <button class="nav-btn secondary" data-action="hint" ${q.hintLevel >= 2 ? 'disabled' : ''}>${q.hintLevel === 0 ? '💡 Hint: show scale' : (q.hintLevel === 1 ? '💡 Hint: show chord types' : '💡 No more hints')}</button>
            <button class="nav-btn secondary" data-action="reveal">Show answer</button>
        </div>`;

    root.innerHTML = `
        <div class="stats-row">
            <span class="stat"><strong>${practiceStats.answered}</strong> answered</span>
            <span class="stat"><strong>${practiceStats.clean}</strong> perfect</span>
            <span class="stat">🔥 <strong>${practiceStats.streak}</strong> streak</span>
            <span class="stat">🏆 best <strong>${practiceStats.best}</strong></span>
        </div>

        ${practiceLesson ? practiceLessonBannerHtml() : ''}

        ${practiceLesson ? '' : `<details class="settings">
            <summary>⚙️ Settings: ${PRACTICE_LEVELS[s.level].name}, ${s.type}, ${s.ext === 'sevenths' ? '7th chords' : 'triads'}</summary>
            <div class="setting-label">Keys <span class="alias">${PRACTICE_LEVELS[s.level].desc}</span></div>
            <div class="segmented">${levelButtons}</div>
            <div class="setting-label">Scale</div>
            <div class="segmented">${typeButtons}</div>
            <div class="setting-label">Chords</div>
            <div class="segmented">${extButtons}</div>
        </details>`}

        <div class="question-card">
            <div class="q-label">Key</div>
            <div class="q-key">${q.rootName} ${q.type}</div>
            <div class="q-label">Progression</div>
            <div class="q-romans">${q.chords.map(c => c.roman).join(' – ')}</div>
            <p class="note-line">Which keys do you press for each chord? Select a chord below, then tap its ${needed} keys.</p>
        </div>

        <div class="slots">${slots}</div>
        ${practiceKeyboardHTML(q)}
        ${hints}
        ${feedback}
        ${actions}
        ${solution}
    `;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

function practiceAskNew() {
    practiceQuestion = practiceNewQuestion(practiceSettings, Math.random, practiceQuestion);
}

async function practiceHandleAction(action, target) {
    const q = practiceQuestion;
    const data = target.dataset;

    switch (action) {
        case 'set-level':
            if (practiceLesson) return;
            practiceSettings.level = parseInt(data.level, 10);
            practiceFinalizeIfStarted();
            practiceAskNew();
            break;
        case 'set-type':
            if (practiceLesson) return;
            practiceSettings.type = data.type;
            practiceFinalizeIfStarted();
            practiceAskNew();
            break;
        case 'set-ext':
            if (practiceLesson) return;
            practiceSettings.ext = data.ext;
            practiceFinalizeIfStarted();
            practiceAskNew();
            break;
        case 'pick-slot':
            q.slot = parseInt(data.idx, 10);
            break;
        case 'toggle-key': {
            const pc = parseInt(data.pc, 10);
            practiceToggleKey(q, pc);
            // Auto-advance when a chord is complete
            if (q.answers[q.slot].length === practiceNeededNotes(q) && q.slot < q.chords.length - 1) q.slot++;
            practiceRender();
            if (await composeStartAudio()) {
                const synth = composeEnsureSynth();
                if (synth) synth.triggerAttackRelease(CHROMATIC_SCALE[pc] + '4', 0.35);
            }
            return;
        }
        case 'clear-slot':
            if (!q.solved && !q.revealed) {
                q.answers[q.slot] = [];
                q.results = null;
            }
            break;
        case 'check':
            if (!q.solved && !q.revealed) {
                practiceCheck(q);
                if (q.solved) {
                    practiceFinalizeQuestion(q);
                    practiceSave();
                }
            }
            break;
        case 'hint':
            if (!q.solved && !q.revealed && q.hintLevel < 2) q.hintLevel++;
            break;
        case 'reveal':
            if (!q.solved && !q.revealed) {
                q.revealed = true;
                q.results = null;
                practiceFinalizeQuestion(q);
                practiceSave();
            }
            break;
        case 'hear-answer':
            practiceRender();
            if (await composeStartAudio()) {
                q.chords.forEach((chord, i) => setTimeout(() => composePlayChord(chord, 1.2), i * 1300));
            }
            return;
        case 'next-question':
            if (practiceLesson && practiceLesson.round.status !== 'running') return;
            practiceFinalizeIfStarted();
            practiceAskNew();
            break;
        case 'lesson-retry':
            if (!practiceLesson) return;
            practiceLessonRestart();
            practiceAskNew();
            break;
        default:
            return;
    }

    practiceSave();
    practiceRender();
}

/** Switching settings or skipping counts the unfinished question as answered, without credit. */
function practiceFinalizeIfStarted() {
    const q = practiceQuestion;
    if (!q || q.finalized) return;
    const touched = q.answers.some(a => a.length) || q.attempts > 0 || q.hintLevel > 0;
    if (touched) practiceFinalizeQuestion(q);
}

function practiceInit() {
    practiceLoad();
    const lessonDay = practiceLessonFromSearch(typeof location !== 'undefined' ? location.search : '');
    if (lessonDay) practiceStartLesson(lessonDay);
    practiceAskNew();
    document.addEventListener('click', event => {
        const target = event.target.closest('[data-action]');
        if (!target || target.disabled) return;
        practiceHandleAction(target.dataset.action, target);
    });
    practiceRender();
}

if (typeof document !== 'undefined' && document.getElementById('practice-root')) {
    practiceInit();
}
