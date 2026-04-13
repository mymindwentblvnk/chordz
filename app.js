/**
 * Application Logic
 * Handles UI interactions, filtering, and rendering
 */

// State
let currentNote = 'all';
let activeFilters = {
    scale: 'all', // all, major, minor
    moods: ['all'], // all, happy, sad, etc.
    borrowedChords: false, // true to show only borrowed chord progressions
    starred: false // true to show only starred progressions
};

// Starred progressions management
const STARRED_KEY = 'chordz-starred-progressions';

function getStarredProgressions() {
    try {
        const starred = localStorage.getItem(STARRED_KEY);
        return starred ? JSON.parse(starred) : [];
    } catch (e) {
        console.error('Failed to load starred progressions:', e);
        return [];
    }
}

function isProgressionStarred(chordParam) {
    const starred = getStarredProgressions();
    return starred.includes(chordParam);
}

function toggleStar(chordParam) {
    const starred = getStarredProgressions();
    const index = starred.indexOf(chordParam);

    if (index > -1) {
        // Remove star
        starred.splice(index, 1);
    } else {
        // Add star
        starred.push(chordParam);
    }

    try {
        localStorage.setItem(STARRED_KEY, JSON.stringify(starred));
    } catch (e) {
        console.error('Failed to save starred progressions:', e);
    }

    return index === -1; // Return new starred state
}

// DOM Elements
const noteSelector = document.getElementById('note-selector');
const filterButtons = document.querySelectorAll('.mood-filter');
const resultsContainer = document.getElementById('results');

/**
 * Initialize the application
 */
function init() {
    // Set up event listeners
    noteSelector.addEventListener('change', handleNoteChange);

    filterButtons.forEach(filter => {
        filter.addEventListener('click', handleFilterClick);
    });

    // Random chord button
    const randomBtn = document.getElementById('random-chord-btn');
    if (randomBtn) {
        randomBtn.addEventListener('click', handleRandomChord);
    }

    // Event delegation for progression cards
    resultsContainer.addEventListener('click', (e) => {
        // Check if star button was clicked
        const starBtn = e.target.closest('.star-btn');
        if (starBtn) {
            e.stopPropagation();
            e.preventDefault();
            const chordParam = starBtn.dataset.chordParam;
            if (chordParam) {
                toggleStarAndRefresh(chordParam);
            }
            return;
        }

        // Check if a link was clicked (don't trigger card navigation)
        if (e.target.closest('a')) {
            return;
        }

        // Check if progression card was clicked
        const card = e.target.closest('.progression-card');
        if (card) {
            const detailUrl = card.dataset.detailUrl;
            if (detailUrl) {
                window.location.href = detailUrl;
            }
        }
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
 * Handle random chord button click
 */
function handleRandomChord() {
    // Get filtered progressions based on current filters
    const filteredProgressions = getFilteredProgressions();

    if (filteredProgressions.length === 0) {
        alert('No progressions match your current filters. Try changing your filters.');
        return;
    }

    // Pick a random progression from filtered list
    const randomProgression = filteredProgressions[Math.floor(Math.random() * filteredProgressions.length)];

    const keyToPass = currentNote !== 'all' ? currentNote : (localStorage.getItem('rootNote') || 'C');
    const key = keyToPass !== 'all' ? keyToPass : 'C';
    const chordParam = randomProgression.progression.join('-');
    window.location.href = `chord-detail.html?chord=${chordParam}&key=${key}`;
}

/**
 * Handle filter button click (scale type and moods)
 * @param {Event} event - Click event
 */
function handleFilterClick(event) {
    const button = event.target;
    const filter = button.dataset.filter;
    const type = button.dataset.type; // 'scale', 'mood', or undefined for 'all'

    // Handle "All" button
    if (filter === 'all') {
        // Deactivate all other filters
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        activeFilters.scale = 'all';
        activeFilters.moods = ['all'];
        activeFilters.borrowedChords = false;
        activeFilters.starred = false;
    } else if (type === 'starred') {
        // Handle starred filter
        const allButton = document.querySelector('[data-filter="all"]');
        allButton.classList.remove('active');

        // Toggle starred filter
        button.classList.toggle('active');
        activeFilters.starred = button.classList.contains('active');

        // If no filters active, activate "All"
        const anyFilterActive =
            document.querySelector('[data-type="scale"].active') ||
            document.querySelector('[data-type="borrowed"].active') ||
            document.querySelector('[data-type="starred"].active') ||
            document.querySelector('[data-type="mood"].active');

        if (!anyFilterActive) {
            allButton.classList.add('active');
            activeFilters.scale = 'all';
            activeFilters.moods = ['all'];
            activeFilters.borrowedChords = false;
            activeFilters.starred = false;
        }
    } else if (type === 'borrowed') {
        // Handle borrowed chords filter
        const allButton = document.querySelector('[data-filter="all"]');
        allButton.classList.remove('active');

        // Toggle borrowed chords filter
        button.classList.toggle('active');
        activeFilters.borrowedChords = button.classList.contains('active');

        // If no filters active, activate "All"
        const anyFilterActive =
            document.querySelector('[data-type="scale"].active') ||
            document.querySelector('[data-type="borrowed"].active') ||
            document.querySelector('[data-type="starred"].active') ||
            document.querySelector('[data-type="mood"].active');

        if (!anyFilterActive) {
            allButton.classList.add('active');
            activeFilters.scale = 'all';
            activeFilters.moods = ['all'];
            activeFilters.borrowedChords = false;
            activeFilters.starred = false;
        }
    } else if (type === 'scale') {
        // Handle scale type filter (major/minor)
        const allButton = document.querySelector('[data-filter="all"]');
        allButton.classList.remove('active');

        // Deactivate other scale buttons
        document.querySelectorAll('[data-type="scale"]').forEach(btn => {
            btn.classList.remove('active');
        });

        // Activate this scale button
        button.classList.add('active');
        activeFilters.scale = filter;

        // If no mood filters are active, set moods to all
        if (activeFilters.moods.includes('all')) {
            activeFilters.moods = ['all'];
        }
    } else if (type === 'mood') {
        // Handle mood filter
        const allButton = document.querySelector('[data-filter="all"]');
        allButton.classList.remove('active');

        // Toggle this mood filter
        button.classList.toggle('active');

        // Update active moods array
        const activeMoodButtons = Array.from(document.querySelectorAll('[data-type="mood"].active'));

        if (activeMoodButtons.length === 0) {
            // No moods selected, check if scale is selected
            const activeScaleButtons = Array.from(document.querySelectorAll('[data-type="scale"].active'));
            if (activeScaleButtons.length === 0) {
                // No filters active, activate "All"
                allButton.classList.add('active');
                activeFilters.scale = 'all';
                activeFilters.moods = ['all'];
            } else {
                // Scale is active but no moods
                activeFilters.moods = ['all'];
            }
        } else {
            activeFilters.moods = activeMoodButtons.map(btn => btn.dataset.filter);
        }
    }

    renderProgressions();
}

/**
 * Filter progressions based on active filters (scale type, moods, and borrowed chords)
 * @returns {array} Filtered chord progressions
 */
function getFilteredProgressions() {
    let filtered = CHORD_PROGRESSIONS;

    // Filter by scale type
    if (activeFilters.scale !== 'all') {
        filtered = filtered.filter(progression => progression.keyMode === activeFilters.scale);
    }

    // Filter by mood
    if (!activeFilters.moods.includes('all')) {
        filtered = filtered.filter(progression => {
            // Check if progression has any of the active moods
            return progression.mood.some(mood => activeFilters.moods.includes(mood));
        });
    }

    // Filter by borrowed chords
    if (activeFilters.borrowedChords) {
        filtered = filtered.filter(progression => progression.hasBorrowedChords === true);
    }

    // Filter by starred
    if (activeFilters.starred) {
        const starredProgressions = getStarredProgressions();
        filtered = filtered.filter(progression => {
            const chordParam = progression.progression.join('-');
            return starredProgressions.includes(chordParam);
        });
    }

    return filtered;
}

/**
 * Create HTML for a chord progression card
 * @param {object} progression - Chord progression object
 * @param {number} index - Index in CHORD_PROGRESSIONS array
 * @returns {string} HTML string
 */
function createProgressionCard(progression, index) {
    // Create scale type tag
    const scaleTypeTag = `<span class="mood-tag mood-${progression.keyMode === 'major' ? 'happy' : 'sad'}" style="font-weight: 700;">${progression.keyMode === 'major' ? 'Major' : 'Minor'}</span>`;

    const moodTags = progression.mood.map(mood =>
        `<span class="mood-tag mood-${mood}">${mood}</span>`
    ).join('');

    // Combine scale type tag with mood tags
    const allTags = scaleTypeTag + moodTags;

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
        ? `calculate-chords.html?note=${encodeURIComponent(currentNote)}&progression=${encodeURIComponent(progression.progression.join('-'))}`
        : `calculate-chords.html?progression=${encodeURIComponent(progression.progression.join('-'))}`;

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

    // Create detail view link - pass current note or saved note from localStorage
    const keyToPass = isSpecificKey ? currentNote : (localStorage.getItem('rootNote') || 'C');
    const chordParam = progression.progression.join('-');
    const detailUrl = `chord-detail.html?chord=${chordParam}&key=${keyToPass !== 'all' ? keyToPass : 'C'}`;

    // Star button
    const isStarred = isProgressionStarred(chordParam);
    const starButton = `
        <button
            class="star-btn ${isStarred ? 'starred' : ''}"
            data-chord-param="${chordParam.replace(/"/g, '&quot;')}"
            title="${isStarred ? 'Remove from favorites' : 'Add to favorites'}"
        >
            ${isStarred ? '⭐' : '☆'}
        </button>
    `;

    return `
        <div class="progression-card" style="cursor: pointer; position: relative;" data-detail-url="${detailUrl}">
            ${starButton}
            <h3 class="progression-name">${progression.name}</h3>
            <div class="mood-tags">${allTags}</div>
            <div class="chords">${chordsDisplay}</div>
            ${chordNotesSection}
            <p class="progression-description">${progression.description}</p>
            ${isSpecificKey ? `<div class="roman-numerals">${progression.progression.join(' - ')}</div>` : ''}
            ${builderLink}
        </div>
    `;
}

/**
 * Toggle star and refresh the view
 */
function toggleStarAndRefresh(chordParam) {
    toggleStar(chordParam);
    renderProgressions();
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
        .map(progression => {
            const index = CHORD_PROGRESSIONS.indexOf(progression);
            return createProgressionCard(progression, index);
        })
        .join('');

    resultsContainer.innerHTML = html;
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
