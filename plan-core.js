/**
 * Plan Core
 * Progress storage and helpers shared by the plan pages and the practice page.
 *
 * Progress is kept in localStorage as a map of lesson number to how it was completed:
 *   { "5": { "how": "auto", "at": "2026-11-03T19:02:11.000Z" }, "6": { "how": "manual", "at": "..." } }
 * "manual" = the learner confirmed the lesson, "auto" = the app recognized a passed exercise.
 *
 * Depends on: plan-data.js
 */

const PLAN_PROGRESS_KEY = 'chordz-plan-progress';
const PLAN_EXERCISE_KEY = 'chordz-plan-exercise';
const PLAN_TOTAL_DAYS = 28;

function planPad(n, width = 2) {
    return String(n).padStart(width, '0');
}

function planDayFileName(day) {
    return `plan-day-${planPad(day)}.html`;
}

function planFindDay(dayNumber) {
    return PLAN_DAYS.find(d => d.day === dayNumber) || null;
}

// ---------------------------------------------------------------------------
// Progress (which lessons are completed)
// ---------------------------------------------------------------------------

/** @returns {Map<number, {how: string, at: string}>} */
function planLoadProgress() {
    const progress = new Map();
    try {
        const stored = JSON.parse(localStorage.getItem(PLAN_PROGRESS_KEY));
        if (Array.isArray(stored)) {
            // Older format: a plain list of completed days
            stored.forEach(n => {
                if (Number.isInteger(n) && n >= 1 && n <= PLAN_TOTAL_DAYS) progress.set(n, { how: 'manual', at: null });
            });
        } else if (stored && typeof stored === 'object') {
            Object.keys(stored).forEach(key => {
                const n = parseInt(key, 10);
                const entry = stored[key];
                if (String(n) === key && n >= 1 && n <= PLAN_TOTAL_DAYS && entry && typeof entry === 'object') {
                    progress.set(n, {
                        how: entry.how === 'auto' ? 'auto' : 'manual',
                        at: typeof entry.at === 'string' ? entry.at : null
                    });
                }
            });
        }
    } catch (e) {
        // Broken storage: start with an empty progress
    }
    return progress;
}

function planSaveProgress(progress) {
    const plain = {};
    Array.from(progress.keys()).sort((a, b) => a - b).forEach(n => { plain[n] = progress.get(n); });
    try {
        localStorage.setItem(PLAN_PROGRESS_KEY, JSON.stringify(plain));
    } catch (e) {
        console.error('Failed to save plan progress:', e);
    }
}

/** Mark a lesson as completed. An existing completion is kept as it is. Returns true if it was newly completed. */
function planMarkDone(dayNumber, how, now = new Date()) {
    if (!planFindDay(dayNumber)) return false;
    const progress = planLoadProgress();
    if (progress.has(dayNumber)) return false;
    progress.set(dayNumber, { how: how === 'auto' ? 'auto' : 'manual', at: now.toISOString() });
    planSaveProgress(progress);
    return true;
}

function planUnmarkDone(dayNumber) {
    const progress = planLoadProgress();
    if (progress.delete(dayNumber)) planSaveProgress(progress);
}

function planResetProgress() {
    planSaveProgress(new Map());
    try {
        localStorage.removeItem(PLAN_EXERCISE_KEY);
    } catch (e) {
        // ignore
    }
}

// ---------------------------------------------------------------------------
// Exercise round of a lesson (answers counted in the practice page)
// ---------------------------------------------------------------------------

/**
 * @returns {{day:number, answered:number, perfect:number, status:string}|null}
 *   status: 'running' | 'passed' | 'failed'
 */
function planLoadExercise(dayNumber) {
    try {
        const stored = JSON.parse(localStorage.getItem(PLAN_EXERCISE_KEY));
        if (stored && stored.day === dayNumber && Number.isInteger(stored.answered) && Number.isInteger(stored.perfect) &&
            ['running', 'passed', 'failed'].includes(stored.status) && stored.answered >= 0 && stored.perfect >= 0) {
            return { day: stored.day, answered: stored.answered, perfect: stored.perfect, status: stored.status };
        }
    } catch (e) {
        // ignore
    }
    return null;
}

function planSaveExercise(round) {
    try {
        localStorage.setItem(PLAN_EXERCISE_KEY, JSON.stringify(round));
    } catch (e) {
        console.error('Failed to save exercise round:', e);
    }
}

function planNewExercise(dayNumber) {
    return { day: dayNumber, answered: 0, perfect: 0, status: 'running' };
}

/** Count one finished question in a round and decide whether the exercise is passed. */
function planRecordAnswer(round, exercise, wasPerfect) {
    if (round.status !== 'running') return round;
    round.answered++;
    if (wasPerfect) round.perfect++;
    if (round.answered >= exercise.questions) {
        round.status = round.perfect >= exercise.perfect ? 'passed' : 'failed';
    }
    return round;
}
