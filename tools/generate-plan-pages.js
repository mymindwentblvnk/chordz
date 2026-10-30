/**
 * Generates the 28 day pages of the four-week plan (plan-day-01.html ... plan-day-28.html).
 *
 * Every page is a small shell that only says which day it is. The content comes from
 * plan-data.js in the browser, so you normally edit plan-data.js and do not need to
 * run this script again. Run it only if you change the page template below or the
 * number of days:
 *
 *     node tools/generate-plan-pages.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'plan-data.js'), 'utf8') + '\nthis.PLAN_DAYS = PLAN_DAYS;', context);
const days = context.PLAN_DAYS;

const escapeHtml = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function template(day) {
    const nn = String(day.day).padStart(2, '0');
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0f172a">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Chordz">
    <title>Day ${day.day}: ${escapeHtml(day.title)} - Chordz</title>
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="guide-styles.css">
    <link rel="stylesheet" href="plan.css">
    <script src="page-memory.js"></script>
    <script src="keep-awake.js" defer></script>
</head>
<body data-day="${day.day}">
    <nav class="main-nav">
        <a href="training.html" class="nav-link">🎮 Training</a>
        <a href="chord-progressions.html" class="nav-link">📖 Chord Progressions</a>
        <a href="compose.html" class="nav-link">🧭 Compose</a>
        <a href="plan.html" class="nav-link active">🗓️ Plan</a>
        <a href="metronome.html" class="nav-link">⏱️ Metronome</a>
        <a href="find-note.html" class="nav-link">🎤 Find Note</a>
        <a href="find-scale.html" class="nav-link">🎼 Find Scale</a>
        <a href="wiki.html" class="nav-link">📚 Wiki</a>
    </nav>

    <div class="guide-container">
        <div id="day-root">
            <noscript>This page needs JavaScript. <a href="plan.html">Back to the plan</a></noscript>
        </div>
    </div>

    <script src="plan-data.js"></script>
    <script src="plan-core.js"></script>
    <script src="plan.js"></script>
    <script src="plan-day.js"></script>
</body>
</html>
`;
}

days.forEach(day => {
    const file = path.join(root, `plan-day-${String(day.day).padStart(2, '0')}.html`);
    fs.writeFileSync(file, template(day));
});
console.log(`Wrote ${days.length} day pages.`);
