/**
 * Plan day page: one of the 28 pages of the four-week plan.
 * The page file (plan-day-NN.html) only says which day it is, everything else comes from plan-data.js.
 *
 * Depends on: plan-data.js, plan-core.js, plan.js (planEscape)
 */

function planDayRender(dayNumber) {
    const root = document.getElementById('day-root');
    const day = PLAN_DAYS.find(d => d.day === dayNumber);
    if (!day) {
        root.innerHTML = '<p class="plan-intro">This day does not exist. <a href="plan.html">Back to the plan</a></p>';
        return;
    }

    const week = PLAN_WEEKS.find(w => w.week === day.week);
    const type = PLAN_TYPES[day.type];
    const done = planLoadProgress().has(day.day);
    const prev = PLAN_DAYS.find(d => d.day === day.day - 1);
    const next = PLAN_DAYS.find(d => d.day === day.day + 1);

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
                ${done ? '<span class="plan-badge">✓ Done</span>' : ''}
            </div>
        </div>

        <div class="plan-section">
            <div class="plan-box goal"><div class="plan-box-label">Goal</div>${planEscape(day.goal)}</div>

            <h3>Today's steps</h3>
            <ol class="plan-steps">${steps}</ol>

            <h3>Open in Chordz</h3>
            <div class="plan-links">${links}</div>

            <div class="plan-box check"><div class="plan-box-label">Check yourself</div>${planEscape(day.check)}</div>
            <div class="plan-box tip"><div class="plan-box-label">Tip</div>${planEscape(day.tip)}</div>

            <div class="plan-btn-row">
                <button class="plan-btn ${done ? 'done' : 'primary'}" data-action="toggle-done">${done ? '✓ Done (tap to undo)' : 'Mark as done'}</button>
                <button class="plan-btn secondary" data-action="add-to-calendar">📅 Add this day to my calendar</button>
            </div>
            <div id="plan-message"></div>

            <div class="plan-pager">
                ${prev ? `<a class="plan-btn secondary" href="${planDayFileName(prev.day)}">← Day ${prev.day}</a>` : '<span></span>'}
                ${next ? `<a class="plan-btn primary" href="${planDayFileName(next.day)}">Day ${next.day} →</a>` : '<a class="plan-btn primary" href="plan.html">Back to the plan</a>'}
            </div>
        </div>`;
}

function planDayCurrent() {
    return parseInt(document.body.dataset.day, 10);
}

function planDayAddToCalendar(dayNumber) {
    const day = PLAN_DAYS.find(d => d.day === dayNumber);
    const settings = planLoadSettings(planToday());
    const ics = planBuildIcs({
        days: [day],
        startDate: settings.startDate,
        time: settings.time,
        alarmMinutes: planAlarmMinutes(settings.alarm),
        dayUrl: d => planMakeDayUrl(d, window.location.href)
    });
    planDownloadText(`chordz-plan-day-${planPad(day.day)}.ics`, ics, 'text/calendar;charset=utf-8');
    const date = planAddDays(planParseDate(settings.startDate), day.day - 1);
    planShowMessage('ok', `Calendar entry for ${planFormatPreviewDate(date)} at ${planEscape(settings.time)} created. Open the downloaded file to add it. You can change the start date and time on the plan page.`);
}

function planDayHandleAction(action) {
    const dayNumber = planDayCurrent();
    if (action === 'toggle-done') {
        const done = planLoadProgress();
        if (done.has(dayNumber)) done.delete(dayNumber);
        else done.add(dayNumber);
        planSaveProgress(done);
        planDayRender(dayNumber);
    } else if (action === 'add-to-calendar') {
        planDayAddToCalendar(dayNumber);
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
