/**
 * Plan overview page: progress and the 28 day cards.
 * Depends on: plan-data.js, plan-core.js
 */

function planEscape(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
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
    const percent = Math.round((done.size / PLAN_TOTAL_DAYS) * 100);
    const nextDay = PLAN_DAYS.find(d => !done.has(d.day));
    const totalMinutes = PLAN_DAYS.reduce((sum, d) => sum + d.minutes, 0);

    root.innerHTML = `
        <div class="plan-section">
            <p class="plan-intro">28 short lessons (about ${Math.round(totalMinutes / 60)} hours in total) that take you from scales and chords to working out any Roman numeral progression in any key, and to your first melancholic Drum &amp; Bass idea. Each lesson has a goal, timed steps, links to the right Chordz tools and a way to check yourself. Go at your own pace: Chordz remembers which lessons you have completed on this device.</p>

            <div class="plan-progress">
                <div class="plan-progress-top">
                    <span><strong>${done.size}</strong> of ${PLAN_TOTAL_DAYS} lessons done</span>
                    <span>${percent}%</span>
                </div>
                <div class="plan-bar"><div class="plan-bar-fill" style="width: ${percent}%;"></div></div>
                ${nextDay
                    ? `<a class="plan-btn primary plan-continue" href="${planDayFileName(nextDay.day)}">${done.size === 0 ? 'Start with' : 'Continue with'} Day ${nextDay.day}: ${planEscape(nextDay.title)}</a>`
                    : '<p class="plan-note">🎉 You finished the plan. Well done!</p>'}
            </div>

            ${planRenderCards(done)}

            <div class="plan-btn-row">
                <button class="plan-btn secondary" data-action="reset-progress">↺ Reset progress</button>
            </div>
        </div>`;
}

function planHandleAction(action) {
    if (action === 'reset-progress') {
        if (typeof confirm === 'function' && !confirm('Reset all progress? This cannot be undone.')) return;
        planResetProgress();
        planRenderOverview();
    }
}

function planInitOverview() {
    planRenderOverview();
    document.addEventListener('click', event => {
        const target = event.target.closest('[data-action]');
        if (target) planHandleAction(target.dataset.action);
    });
}

if (typeof document !== 'undefined' && document.getElementById('plan-root')) {
    planInitOverview();
}
