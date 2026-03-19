/**
 * Application Logic
 * Handles UI interactions, filtering, and rendering
 */

// State
let currentNote = 'all';
let activeMoods = ['all'];

// DOM Elements
const noteSelector = document.getElementById('note-selector');
const moodFilters = document.querySelectorAll('.mood-filter');
const resultsContainer = document.getElementById('results');

/**
 * Initialize the application
 */
function init() {
    // Set up event listeners
    noteSelector.addEventListener('change', handleNoteChange);

    moodFilters.forEach(filter => {
        filter.addEventListener('click', handleMoodFilterClick);
    });

    // Initial render
    renderProgressions();
}

/**
 * Handle note selection change
 * @param {Event} event - Change event
 */
function handleNoteChange(event) {
    currentNote = event.target.value;
    renderProgressions();
}

/**
 * Handle mood filter button click
 * @param {Event} event - Click event
 */
function handleMoodFilterClick(event) {
    const button = event.target;
    const mood = button.dataset.mood;

    // Handle "All" button
    if (mood === 'all') {
        // Deactivate all other filters
        moodFilters.forEach(filter => filter.classList.remove('active'));
        button.classList.add('active');
        activeMoods = ['all'];
    } else {
        // Remove "All" filter if active
        const allButton = document.querySelector('[data-mood="all"]');
        allButton.classList.remove('active');

        // Toggle this filter
        button.classList.toggle('active');

        // Update active moods array
        activeMoods = Array.from(document.querySelectorAll('.mood-filter.active'))
            .map(filter => filter.dataset.mood)
            .filter(m => m !== 'all');

        // If no filters active, activate "All"
        if (activeMoods.length === 0) {
            allButton.classList.add('active');
            activeMoods = ['all'];
        }
    }

    renderProgressions();
}

/**
 * Filter progressions based on active moods
 * @returns {array} Filtered chord progressions
 */
function getFilteredProgressions() {
    if (activeMoods.includes('all')) {
        return CHORD_PROGRESSIONS;
    }

    return CHORD_PROGRESSIONS.filter(progression => {
        // Check if progression has any of the active moods
        return progression.mood.some(mood => activeMoods.includes(mood));
    });
}

/**
 * Create HTML for a chord progression card
 * @param {object} progression - Chord progression object
 * @returns {string} HTML string
 */
function createProgressionCard(progression) {
    const moodTags = progression.mood.map(mood =>
        `<span class="mood-tag mood-${mood}">${mood}</span>`
    ).join('');

    // Check if a specific key is selected
    const isSpecificKey = currentNote !== 'all';

    let chordsDisplay, chordNotesSection;

    if (isSpecificKey) {
        // Transpose to specific key and show chord names with notes
        const chords = transposeProgression(progression.progression, currentNote, progression.keyMode);
        chordsDisplay = chords.join(' - ');

        // Generate chord notes breakdown
        const chordNotesHTML = chords.map(chord => {
            const notes = getChordNotes(chord);
            return `
                <div class="chord-breakdown">
                    <span class="chord-name-small">${chord}</span>
                    <span class="chord-notes">${notes.join(' + ')}</span>
                </div>
            `;
        }).join('');

        chordNotesSection = `
            <div class="chord-notes-section">
                <div class="notes-label">Notes to play:</div>
                <div class="chord-breakdowns">
                    ${chordNotesHTML}
                </div>
            </div>
        `;
    } else {
        // Show Roman numerals when no specific key is selected
        chordsDisplay = progression.progression.join(' - ');
        chordNotesSection = `
            <div class="key-hint">
                Select a root note above to see chord names and notes to play
            </div>
        `;
    }

    return `
        <div class="progression-card">
            <h3 class="progression-name">${progression.name}</h3>
            <div class="mood-tags">${moodTags}</div>
            <div class="chords">${chordsDisplay}</div>
            ${chordNotesSection}
            <p class="progression-description">${progression.description}</p>
            ${isSpecificKey ? `<div class="roman-numerals">${progression.progression.join(' - ')}</div>` : ''}
        </div>
    `;
}

/**
 * Render all filtered progressions
 */
function renderProgressions() {
    const filteredProgressions = getFilteredProgressions();

    if (filteredProgressions.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No progressions found for the selected mood(s).</p>
                <p>Try selecting different moods or use "All" to see everything.</p>
            </div>
        `;
        return;
    }

    const html = filteredProgressions
        .map(progression => createProgressionCard(progression))
        .join('');

    resultsContainer.innerHTML = html;
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
