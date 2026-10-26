/**
 * Plan Core
 * Date helpers, calendar (.ics) export and progress storage for the four-week plan.
 *
 * Depends on: plan-data.js
 */

const PLAN_PROGRESS_KEY = 'chordz-plan-progress';
const PLAN_SETTINGS_KEY = 'chordz-plan-settings';
const PLAN_TOTAL_DAYS = 28;

// ---------------------------------------------------------------------------
// Dates and times (pure, no time zone math: calendar entries use "floating" local time)
// ---------------------------------------------------------------------------

function planPad(n, width = 2) {
    return String(n).padStart(width, '0');
}

/** Parse "YYYY-MM-DD" into {y, m, d}. Returns null for invalid dates. */
function planParseDate(text) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text || ''));
    if (!match) return null;
    const y = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const d = parseInt(match[3], 10);
    const check = new Date(Date.UTC(y, m - 1, d));
    if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null;
    return { y, m, d };
}

function planFormatDateInput(date) {
    return `${planPad(date.y, 4)}-${planPad(date.m)}-${planPad(date.d)}`;
}

function planAddDays(date, days) {
    const result = new Date(Date.UTC(date.y, date.m - 1, date.d + days));
    return { y: result.getUTCFullYear(), m: result.getUTCMonth() + 1, d: result.getUTCDate() };
}

/** Parse "HH:MM" into minutes since midnight. Returns null for invalid times. */
function planParseTime(text) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(text || ''));
    if (!match) return null;
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h > 23 || m > 59) return null;
    return h * 60 + m;
}

/** The next Monday strictly after the given date (so Day 1 starts a fresh week). */
function planNextMonday(date) {
    const dow = new Date(Date.UTC(date.y, date.m - 1, date.d)).getUTCDay(); // 0 = Sunday
    const daysUntil = ((8 - dow) % 7) || 7;
    return planAddDays(date, daysUntil);
}

/** Local date/time as iCalendar "floating" value: 20261102T200000 */
function planFloatingStamp(date, minutesSinceMidnight) {
    const base = Date.UTC(date.y, date.m - 1, date.d) + minutesSinceMidnight * 60000;
    const t = new Date(base);
    return `${planPad(t.getUTCFullYear(), 4)}${planPad(t.getUTCMonth() + 1)}${planPad(t.getUTCDate())}` +
        `T${planPad(t.getUTCHours())}${planPad(t.getUTCMinutes())}00`;
}

function planUtcStamp(now) {
    return `${planPad(now.getUTCFullYear(), 4)}${planPad(now.getUTCMonth() + 1)}${planPad(now.getUTCDate())}` +
        `T${planPad(now.getUTCHours())}${planPad(now.getUTCMinutes())}${planPad(now.getUTCSeconds())}Z`;
}

// ---------------------------------------------------------------------------
// iCalendar (RFC 5545)
// ---------------------------------------------------------------------------

function planIcsEscape(text) {
    return String(text)
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\r\n|\r|\n/g, '\\n');
}

function planUtf8Length(codePoint) {
    if (codePoint < 0x80) return 1;
    if (codePoint < 0x800) return 2;
    if (codePoint < 0x10000) return 3;
    return 4;
}

/** Fold a content line at 75 octets without splitting a character. Continuation lines start with a space. */
function planFoldLine(line) {
    const pieces = [];
    let current = '';
    let bytes = 0;
    let limit = 75;
    for (const char of line) {
        const size = planUtf8Length(char.codePointAt(0));
        if (bytes + size > limit) {
            pieces.push(current);
            current = ' ';
            bytes = 1;
            limit = 75;
        }
        current += char;
        bytes += size;
    }
    pieces.push(current);
    return pieces.join('\r\n');
}

function planDayFileName(day) {
    return `plan-day-${planPad(day)}.html`;
}

/** Text for the description of a calendar event. */
function planEventDescription(day, url) {
    const lines = [];
    lines.push(`Goal: ${day.goal}`);
    lines.push('');
    lines.push(`Today (${day.minutes} min):`);
    day.steps.forEach((step, i) => lines.push(`${i + 1}. (${step.min} min) ${step.text}`));
    lines.push('');
    lines.push(`Check yourself: ${day.check}`);
    lines.push('');
    lines.push(`Open the full page with links: ${url}`);
    return lines.join('\n');
}

/**
 * Build an iCalendar file for (a subset of) the plan.
 * @param {object} options
 * @param {object[]} options.days - plan days to include
 * @param {string} options.startDate - "YYYY-MM-DD", the date of Day 1
 * @param {string} options.time - "HH:MM", local start time
 * @param {number|null} options.alarmMinutes - reminder minutes before start, or null for none
 * @param {function(object):string} options.dayUrl - returns the absolute URL of a day page
 * @param {Date} [options.now] - for DTSTAMP (injectable for tests)
 * @returns {string} calendar text with CRLF line endings
 */
function planBuildIcs(options) {
    const start = planParseDate(options.startDate);
    const startMinutes = planParseTime(options.time);
    if (!start) throw new Error('Invalid start date');
    if (startMinutes === null) throw new Error('Invalid start time');

    const now = options.now || new Date();
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Chordz//Four-Week Plan//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Chordz 4-week plan'
    ];

    options.days.forEach(day => {
        const date = planAddDays(start, day.day - 1);
        const url = options.dayUrl(day);
        lines.push('BEGIN:VEVENT');
        lines.push(`UID:chordz-plan-day-${planPad(day.day)}@mymindwentblvnk.github.io`);
        lines.push(`DTSTAMP:${planUtcStamp(now)}`);
        lines.push(`DTSTART:${planFloatingStamp(date, startMinutes)}`);
        lines.push(`DTEND:${planFloatingStamp(date, startMinutes + day.minutes)}`);
        lines.push(`SUMMARY:${planIcsEscape(`Chordz day ${day.day}/${PLAN_TOTAL_DAYS}: ${day.title}`)}`);
        lines.push(`DESCRIPTION:${planIcsEscape(planEventDescription(day, url))}`);
        lines.push(`URL:${url}`);
        lines.push('CATEGORIES:Chordz');
        lines.push('TRANSP:OPAQUE');
        if (options.alarmMinutes !== null && options.alarmMinutes !== undefined) {
            lines.push('BEGIN:VALARM');
            lines.push('ACTION:DISPLAY');
            lines.push(`DESCRIPTION:${planIcsEscape(`Chordz day ${day.day}: ${day.title}`)}`);
            lines.push(`TRIGGER:-PT${Math.max(0, Math.round(options.alarmMinutes))}M`);
            lines.push('END:VALARM');
        }
        lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    return lines.map(planFoldLine).join('\r\n') + '\r\n';
}

// ---------------------------------------------------------------------------
// Progress and settings (localStorage)
// ---------------------------------------------------------------------------

function planLoadProgress() {
    try {
        const stored = JSON.parse(localStorage.getItem(PLAN_PROGRESS_KEY));
        if (!Array.isArray(stored)) return new Set();
        return new Set(stored.filter(n => Number.isInteger(n) && n >= 1 && n <= PLAN_TOTAL_DAYS));
    } catch (e) {
        return new Set();
    }
}

function planSaveProgress(done) {
    try {
        localStorage.setItem(PLAN_PROGRESS_KEY, JSON.stringify(Array.from(done).sort((a, b) => a - b)));
    } catch (e) {
        console.error('Failed to save plan progress:', e);
    }
}

function planDefaultSettings(today) {
    return {
        startDate: planFormatDateInput(planNextMonday(today)),
        time: '20:00',
        alarm: '15'
    };
}

function planLoadSettings(today) {
    const settings = planDefaultSettings(today);
    try {
        const stored = JSON.parse(localStorage.getItem(PLAN_SETTINGS_KEY));
        if (stored) {
            if (planParseDate(stored.startDate)) settings.startDate = stored.startDate;
            if (planParseTime(stored.time) !== null) settings.time = stored.time;
            if (['none', '0', '5', '10', '15', '30', '60'].includes(stored.alarm)) settings.alarm = stored.alarm;
        }
    } catch (e) {
        // use defaults
    }
    return settings;
}

function planSaveSettings(settings) {
    try {
        localStorage.setItem(PLAN_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save plan settings:', e);
    }
}

function planAlarmMinutes(alarm) {
    return alarm === 'none' ? null : parseInt(alarm, 10);
}

/** Absolute URL for a day page, relative to the page that is currently open. */
function planMakeDayUrl(day, pageUrl) {
    return new URL(planDayFileName(day.day), pageUrl).href;
}

/** Offer a text file as a download (works in Safari on iPad and desktop browsers). */
function planDownloadText(fileName, text, mimeType) {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function planToday() {
    const now = new Date();
    return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}
