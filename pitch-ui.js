/**
 * Pitch Detection UI Controller
 * Handles UI interactions for the pitch detector
 */

let pitchDetector = null;
let pitchButton = null;
let pitchDisplay = null;
let pitchError = null;
let noteName = null;
let frequencyDisplay = null;
let confidenceBar = null;

/**
 * Initialize pitch detection UI
 */
function initPitchUI() {
    // Get DOM elements
    pitchButton = document.getElementById('pitch-button');
    pitchDisplay = document.getElementById('pitch-display');
    pitchError = document.getElementById('pitch-error');
    noteName = document.getElementById('note-name');
    frequencyDisplay = document.getElementById('frequency-display');
    confidenceBar = document.getElementById('confidence-bar');

    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError('Your browser does not support microphone access. Please use a modern browser like Chrome, Firefox, or Edge.');
        pitchButton.disabled = true;
        return;
    }

    // Create pitch detector instance
    pitchDetector = new PitchDetector();

    // Set up pitch detection callback
    pitchDetector.onPitchDetected = handlePitchDetected;

    // Add button click handler
    pitchButton.addEventListener('click', handleButtonClick);
}

/**
 * Handle pitch button click
 */
async function handleButtonClick() {
    if (pitchDetector.isRunning) {
        // Stop detection
        stopListening();
    } else {
        // Start detection
        await startListening();
    }
}

/**
 * Start pitch detection
 */
async function startListening() {
    try {
        // Hide any previous errors
        hideError();

        // Update button state
        pitchButton.textContent = 'Starting...';
        pitchButton.disabled = true;

        // Start pitch detector
        await pitchDetector.start();

        // Update UI to listening state
        pitchButton.textContent = 'Stop Listening';
        pitchButton.classList.add('listening');
        pitchButton.disabled = false;

        // Show pitch display
        pitchDisplay.style.display = 'block';

        // Reset display
        noteName.textContent = '—';
        frequencyDisplay.textContent = '—';
        confidenceBar.style.width = '0%';

    } catch (error) {
        console.error('Error starting pitch detection:', error);

        // Reset button
        pitchButton.textContent = 'Start Listening';
        pitchButton.classList.remove('listening');
        pitchButton.disabled = false;

        // Show appropriate error message
        if (error.name === 'NotAllowedError') {
            showError('Microphone access was denied. Please allow microphone access and try again.');
        } else if (error.name === 'NotFoundError') {
            showError('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotSupportedError') {
            showError('Microphone access is not supported. Please use HTTPS or localhost.');
        } else {
            showError('Failed to start pitch detection. Please check your microphone and try again.');
        }
    }
}

/**
 * Stop pitch detection
 */
function stopListening() {
    // Stop detector
    pitchDetector.stop();

    // Update button state
    pitchButton.textContent = 'Start Listening';
    pitchButton.classList.remove('listening');

    // Hide pitch display
    pitchDisplay.style.display = 'none';

    // Hide any errors
    hideError();
}

/**
 * Handle detected pitch
 * @param {object} result - Pitch detection result
 */
function handlePitchDetected(result) {
    if (!result) {
        return;
    }

    const { frequency, note, confidence } = result;

    // Update note name with animation
    if (noteName.textContent !== note) {
        noteName.style.transform = 'scale(1.1)';
        noteName.textContent = note;
        setTimeout(() => {
            noteName.style.transform = 'scale(1)';
        }, 100);
    }

    // Update frequency
    frequencyDisplay.textContent = `${frequency} Hz`;

    // Update confidence bar
    const confidencePercent = Math.round(confidence * 100);
    confidenceBar.style.width = `${confidencePercent}%`;
    confidenceBar.setAttribute('data-confidence', confidencePercent);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    pitchError.textContent = message;
    pitchError.style.display = 'block';
}

/**
 * Hide error message
 */
function hideError() {
    pitchError.style.display = 'none';
    pitchError.textContent = '';
}
