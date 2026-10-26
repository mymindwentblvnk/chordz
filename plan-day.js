/**
 * Plan day page: one of the 28 pages of the four-week plan.
 * The page file (plan-day-NN.html) only says which day it is, everything else comes from plan-data.js.
 *
 * Depends on: plan-data.js, plan-core.js, plan.js (planEscape)
 */

function planDayRender(dayNumber) {
    const root = document.getElementById('day-root');
    const day = planFindDay(dayNumber);
    if (!day) {
        root.innerHTML = '<p class="plan-intro">This lesson does not exist. <a href="plan.html">Back to the plan</a></p>';
        return;
    }

    const week = PLAN_WEEKS.find(w => w.week === day.week);
    const type = PLAN_TYPES[day.type];
    const entry = planLoadProgress().get(day.day) || null;
    const prev = planFindDay(day.day - 1);
    const next = planFindDay(day.day + 1);

    document.title = `Day ${day.day}: ${day.title} - Chordz`;

    const steps = day.steps.map(step => `
        <li><span class="plan-step-min">${step.min} min</span>${planEscape(step.text)}</li>`).join('');
    const links = day.links.map(key => {
        const link = PLAN_LINKS[key];
        return `<a class="plan-link" href="${link.href}">${link.icon} ${planEscape(link.label)}</a>`;
    }).join('');

    root.innerHTML = `
        <div class="back-nav"><a href="plan.html" class="back-link">← Back to the plan</a></div>

        <div class="plan-day-head">
            <div class="plan-day-kicker">Day ${day.day} of ${PLAN_TOTAL_DAYS} · Week ${week.week}: ${planEscape(week.title)}</div>
            <h1 class="plan-day-title">${planEscape(day.title)}</h1>
            <div class="plan-badges">
                <span class="plan-badge">${type.icon} ${type.label}</span>
                <span class="plan-badge">⏱️ ${day.minutes} min</span>
                ${entry ? `<span class="plan-badge done">✓ Done${entry.how === 'auto' ? ' (exercise passed)' : ''}</span>` : ''}
            </div>
        </div>

        <div class="plan-section">
            <div class="plan-box goal"><div class="plan-box-label">Goal</div>${planEscape(day.goal)}</div>

            <h3>The steps</h3>
            <ol class="plan-steps">${steps}</ol>

            ${day.exercise ? planDayExerciseHtml(day) : ''}

            <h3>Open in Chordz</h3>
            <div class="plan-links">${links}</div>

            <div class="plan-box check"><div class="plan-box-label">Check yourself</div>${planEscape(day.check)}</div>
            <div class="plan-box tip"><div class="plan-box-label">Tip</div>${planEscape(day.tip)}</div>

            ${planDayConfirmHtml(day, entry)}

            <div class="plan-pager">
                ${prev ? `<a class="plan-btn secondary" href="${planDayFileName(prev.day)}">← Day ${prev.day}</a>` : '<span></span>'}
                ${next ? `<a class="plan-btn primary" href="${planDayFileName(next.day)}">Day ${next.day} →</a>` : '<a class="plan-btn primary" href="plan.html">Back to the plan</a>'}
            </div>
        </div>`;
}

function planExerciseDescription(exercise) {
    const scale = { major: 'major keys', minor: 'minor keys', both: 'major and minor keys' }[exercise.type];
    const keys = { 1: 'Level 1', 2: 'Level 2', 3: 'Level 3 (all 12 keys)' }[exercise.level];
    return `${scale}, ${keys}, ${exercise.ext === 'sevenths' ? '7th chords' : 'triads'}`;
}

function planExerciseUrl(day) {
    return `compose-practice.html?lesson=${day.day}`;
}

function planDayExerciseHtml(day) {
    const ex = day.exercise;
    const round = planLoadExercise(day.day);
    const done = planLoadProgress().has(day.day);
    let status;
    if (done) {
        status = '<p class="plan-note">✓ This lesson is done. You can run the exercise again whenever you like.</p>';
    } else if (round && round.status === 'running') {
        status = `<p class="plan-note">In progress: ${round.answered} of ${ex.questions} questions answered, ${round.perfect} perfect.</p>`;
    } else if (round && round.status === 'failed') {
        status = `<p class="plan-note">Last round: ${round.perfect} of ${ex.questions} perfect, but ${ex.perfect} are needed. Try again, or confirm the lesson yourself below.</p>`;
    } else {
        status = '<p class="plan-note">The exercise is checked automatically. When you reach the goal, this lesson is marked as done.</p>';
    }
    const label = round && round.status === 'running' && !done ? 'Continue the exercise' : (round || done ? 'Start the exercise again' : 'Start the exercise');
    return `
            <div class="plan-box exercise">
                <div class="plan-box-label">Exercise</div>
                <strong>Answer ${ex.questions} questions, at least ${ex.perfect} perfect.</strong>
                <div class="plan-note">${planEscape(planExerciseDescription(ex))}. "Perfect" means correct on the first try without a hint.</div>
                ${status}
                <div class="plan-btn-row"><a class="plan-btn primary" href="${planExerciseUrl(day)}" data-start-exercise="${day.day}">🏋️ ${label}</a></div>
            </div>`;
}

function planDayConfirmHtml(day, entry) {
    if (entry) {
        return `
            <div class="plan-btn-row">
                <button class="plan-btn done" data-action="undo-done">✓ Done · tap to undo</button>
            </div>`;
    }
    const text = day.exercise
        ? 'Passing the exercise marks this lesson as done automatically. If you did the other steps and want to finish now, confirm here.'
        : 'Did you finish the steps and the check above? Then confirm it, and Chordz will remember it.';
    return `
            <div class="plan-box confirm">
                <div class="plan-box-label">Finished?</div>
                <p class="plan-note">${text}</p>
                <div class="plan-btn-row">
                    <button class="plan-btn primary" data-action="confirm-done">✔ I finished this lesson</button>
                </div>
            </div>`;
}

function planDayCurrent() {
    return parseInt(document.body.dataset.day, 10);
}

function planDayHandleAction(action) {
    const dayNumber = planDayCurrent();
    if (action === 'confirm-done') {
        planMarkDone(dayNumber, 'manual');
        planDayRender(dayNumber);
    } else if (action === 'undo-done') {
        planUnmarkDone(dayNumber);
        planDayRender(dayNumber);
    }
}

function planDayInit() {
    planDayRender(planDayCurrent());
    document.addEventListener('click', event => {
        const target = event.target.closest('[data-action]');
        if (target) planDayHandleAction(target.dataset.action);
    });
}

if (typeof document !== 'undefined' && document.getElementById('day-root')) {
    planDayInit();
}
