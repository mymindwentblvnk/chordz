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

    // Check for URL parameter to pre-select note (takes priority over localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const noteParam = urlParams.get('note');
    if (noteParam) {
        // Try to find and select the note
        const option = Array.from(noteSelector.options).find(
            opt => opt.value === noteParam
        );
        if (option) {
            noteSelector.value = noteParam;
            currentNote = noteParam;
            // Save to localStorage for persistence
            localStorage.setItem('rootNote', noteParam);
        }
    } else {
        // Load from localStorage if no URL parameter
        const savedNote = localStorage.getItem('rootNote');
        if (savedNote) {
            const option = Array.from(noteSelector.options).find(
                opt => opt.value === savedNote
            );
            if (option) {
                noteSelector.value = savedNote;
                currentNote = savedNote;
            }
        }
    }

    // Initial render
    renderProgressions();
}

/**
 * Handle note selection change
 * @param {Event} event - Change event
 */
function handleNoteChange(event) {
    currentNote = event.target.value;
    // Save to localStorage for persistence
    localStorage.setItem('rootNote', currentNote);
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

    // Create chord builder link - always show, but only pass note if specific key is selected
    const builderUrl = isSpecificKey
        ? `chord-builder.html?note=${encodeURIComponent(currentNote)}&progression=${encodeURIComponent(progression.progression.join('-'))}`
        : `chord-builder.html?progression=${encodeURIComponent(progression.progression.join('-'))}`;

    const progressionValue = progression.progression.join('-');

    const builderLink = `
        <a href="${builderUrl}"
           class="builder-link"
           onclick="localStorage.setItem('selectedProgression', '${progressionValue}')"
           style="display: inline-block; margin-top: 12px; padding: 8px 16px; background: var(--primary-color); color: white; text-decoration: none; border-radius: 6px; font-size: 0.9rem; transition: all 0.2s ease;"
           onmouseover="this.style.background='var(--secondary-color)'; this.style.transform='translateY(-2px)'"
           onmouseout="this.style.background='var(--primary-color)'; this.style.transform='translateY(0)'">
            📖 Learn to Play This
        </a>
    `;

    return `
        <div class="progression-card">
            <h3 class="progression-name">${progression.name}</h3>
            <div class="mood-tags">${moodTags}</div>
            <div class="chords">${chordsDisplay}</div>
            ${chordNotesSection}
            <p class="progression-description">${progression.description}</p>
            ${isSpecificKey ? `<div class="roman-numerals">${progression.progression.join(' - ')}</div>` : ''}
            ${builderLink}
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
