/**
 * Plan overview page: progress, calendar export and the 28 day cards.
 * Depends on: plan-data.js, plan-core.js
 */

function planEscape(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function planFormatPreviewDate(date) {
    const d = new Date(Date.UTC(date.y, date.m - 1, date.d));
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function planRangePreview(startDate) {
    const start = planParseDate(startDate);
    if (!start) return 'Please choose a valid start date.';
    const end = planAddDays(start, PLAN_TOTAL_DAYS - 1);
    return `Day 1: ${planFormatPreviewDate(start)} · Day ${PLAN_TOTAL_DAYS}: ${planFormatPreviewDate(end)}`;
}

function planRenderCards(done) {
    return PLAN_WEEKS.map(week => {
        const cards = PLAN_DAYS.filter(d => d.week === week.week).map(day => {
            const isDone = done.has(day.day);
            const type = PLAN_TYPES[day.type];
            return `
            <a class="plan-card${isDone ? ' done' : ''}" href="${planDayFileName(day.day)}">
                ${isDone ? '<span class="plan-card-check">✓</span>' : ''}
                <div class="plan-card-top"><span class="plan-card-day">Day ${day.day}</span><span>${type.icon} ${type.label} · ${day.minutes} min</span></div>
                <div class="plan-card-title">${planEscape(day.title)}</div>
            </a>`;
        }).join('');
        return `
        <div class="plan-week">
            <div class="plan-week-header">
                <div class="plan-week-title">Week ${week.week}: ${planEscape(week.title)}</div>
                <div class="plan-week-goal">${planEscape(week.goal)}</div>
            </div>
            <div class="plan-days">${cards}</div>
        </div>`;
    }).join('');
}

function planRenderOverview() {
    const root = document.getElementById('plan-root');
    const done = planLoadProgress();
    const settings = planLoadSettings(planToday());
    const percent = Math.round((done.size / PLAN_TOTAL_DAYS) * 100);
    const nextDay = PLAN_DAYS.find(d => !done.has(d.day));
    const totalMinutes = PLAN_DAYS.reduce((sum, d) => sum + d.minutes, 0);

    const alarmOptions = [['none', 'No reminder'], ['0', 'At start time'], ['5', '5 minutes before'], ['10', '10 minutes before'], ['15', '15 minutes before'], ['30', '30 minutes before'], ['60', '1 hour before']]
        .map(([value, label]) => `<option value="${value}" ${settings.alarm === value ? 'selected' : ''}>${label}</option>`).join('');

    root.innerHTML = `
        <div class="plan-section">
            <p class="plan-intro">28 short sessions (about ${Math.round(totalMinutes / 60)} hours in total) that take you from scales and chords to working out any Roman numeral progression in any key, and to your first melancholic Drum &amp; Bass idea. Each day has a goal, timed steps, links to the right Chordz tools and a way to check yourself.</p>

            <div class="plan-progress">
                <div class="plan-progress-top">
                    <span><strong>${done.size}</strong> of ${PLAN_TOTAL_DAYS} days done</span>
                    <span>${percent}%</span>
                </div>
                <div class="plan-bar"><div class="plan-bar-fill" style="width: ${percent}%;"></div></div>
                ${nextDay
                    ? `<a class="plan-btn primary plan-continue" href="${planDayFileName(nextDay.day)}">${done.size === 0 ? 'Start with' : 'Continue with'} Day ${nextDay.day}: ${planEscape(nextDay.title)}</a>`
                    : '<p class="plan-note">🎉 You finished the plan. Well done!</p>'}
            </div>

            <div class="plan-export">
                <h2>📅 Add the plan to your calendar</h2>
                <p class="plan-note">Creates one calendar entry per day. Each entry has the goal, the steps and a link to that day's page. Importing it again later updates the entries instead of adding duplicates.</p>
                <div class="plan-fields">
                    <div class="plan-field"><label for="plan-start">Day 1 is on</label><input type="date" id="plan-start" value="${planEscape(settings.startDate)}"></div>
                    <div class="plan-field"><label for="plan-time">Start time</label><input type="time" id="plan-time" value="${planEscape(settings.time)}"></div>
                    <div class="plan-field"><label for="plan-alarm">Reminder</label><select id="plan-alarm">${alarmOptions}</select></div>
                </div>
                <div class="plan-preview" id="plan-preview">${planRangePreview(settings.startDate)}</div>
                <p class="plan-note">Tip: start on a Monday so the weekly rhythm fits. Calendar entries use your local time. Each entry is as long as that day's session (15 to 30 minutes).</p>
                <div class="plan-btn-row">
                    <button class="plan-btn primary" data-action="export">📅 Download calendar file (.ics)</button>
                </div>
                <div id="plan-message"></div>
            </div>

            ${planRenderCards(done)}

            <div class="plan-btn-row">
                <button class="plan-btn secondary" data-action="reset-progress">↺ Reset progress</button>
            </div>
        </div>`;
}

function planShowMessage(kind, html) {
    const box = document.getElementById('plan-message');
    if (box) box.innerHTML = `<div class="plan-message ${kind}">${html}</div>`;
}

/** Read the export fields. Returns the settings or null (and shows an error) when something is invalid. */
function planReadExportFields() {
    const startDate = document.getElementById('plan-start').value;
    const time = document.getElementById('plan-time').value;
    const alarm = document.getElementById('plan-alarm').value;
    if (!planParseDate(startDate)) {
        planShowMessage('error', 'Please choose a valid start date.');
        return null;
    }
    if (planParseTime(time) === null) {
        planShowMessage('error', 'Please choose a valid start time.');
        return null;
    }
    const settings = { startDate, time, alarm };
    planSaveSettings(settings);
    return settings;
}

function planExportCalendar() {
    const settings = planReadExportFields();
    if (!settings) return;
    const ics = planBuildIcs({
        days: PLAN_DAYS,
        startDate: settings.startDate,
        time: settings.time,
        alarmMinutes: planAlarmMinutes(settings.alarm),
        dayUrl: day => planMakeDayUrl(day, window.location.href)
    });
    planDownloadText('chordz-4-week-plan.ics', ics, 'text/calendar;charset=utf-8');
    planShowMessage('ok', `Calendar file created with ${PLAN_DAYS.length} entries. Open the downloaded file and choose <strong>Add All</strong> (iPhone and iPad), or import it in Google Calendar under Settings → Import &amp; export.`);
}

function planHandleAction(action) {
    if (action === 'export') {
        planExportCalendar();
    } else if (action === 'reset-progress') {
        if (typeof confirm === 'function' && !confirm('Reset all progress? This cannot be undone.')) return;
        planSaveProgress(new Set());
        planRenderOverview();
    }
}

function planUpdatePreview() {
    const preview = document.getElementById('plan-preview');
    const start = document.getElementById('plan-start');
    if (preview && start) preview.textContent = planRangePreview(start.value);
}

function planInitOverview() {
    planRenderOverview();
    document.addEventListener('click', event => {
        const target = event.target.closest('[data-action]');
        if (target) planHandleAction(target.dataset.action);
    });
    document.addEventListener('change', event => {
        if (['plan-start', 'plan-time', 'plan-alarm'].includes(event.target.id)) {
            planUpdatePreview();
            const startDate = document.getElementById('plan-start').value;
            const time = document.getElementById('plan-time').value;
            const alarm = document.getElementById('plan-alarm').value;
            if (planParseDate(startDate) && planParseTime(time) !== null) planSaveSettings({ startDate, time, alarm });
        }
    });
}

if (typeof document !== 'undefined' && document.getElementById('plan-root')) {
    planInitOverview();
}
