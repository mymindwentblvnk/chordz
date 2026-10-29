// Shared "time pressure" setting for all timed trainings.
// On (default): the training runs with its timer and results count for the top list.
// Off: practice mode - no time limit / timer, results are NOT saved to the top list.
const TIME_PRESSURE_KEY = 'chordz-time-pressure';
const LEGACY_TIME_PRESSURE_KEY = 'chordz-speed-time-pressure';

function loadTimePressure() {
    try {
        const value = localStorage.getItem(TIME_PRESSURE_KEY) || localStorage.getItem(LEGACY_TIME_PRESSURE_KEY);
        return value !== 'off';
    } catch (e) {
        return true;
    }
}

function saveTimePressure(enabled) {
    try {
        localStorage.setItem(TIME_PRESSURE_KEY, enabled ? 'on' : 'off');
    } catch (e) {
        console.error('Failed to save time pressure setting:', e);
    }
}

function renderTimePressureToggle(btn, hintEl, enabled, hintOn, hintOff) {
    btn.textContent = enabled ? 'On' : 'Off';
    btn.style.background = enabled ? 'var(--primary-color)' : '#6b7280';
    if (hintEl) hintEl.textContent = enabled ? hintOn : hintOff;
}
