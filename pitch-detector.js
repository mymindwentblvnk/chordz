/**
 * Pitch Detector Module
 * Uses Web Audio API and autocorrelation algorithm for real-time pitch detection
 */

class PitchDetector {
    /**
     * Create a new pitch detector
     */
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.mediaStream = null;
        this.animationFrameId = null;
        this.isRunning = false;

        // Audio processing settings
        this.bufferSize = 2048;
        this.sampleRate = null;

        // Detection parameters
        this.minFrequency = 80;    // E2
        this.maxFrequency = 1200;  // D6
        this.minConfidence = 0.9;  // High threshold to avoid false detections

        // Callback for pitch updates
        this.onPitchDetected = null;
    }

    /**
     * Initialize audio context and request microphone access
     * @returns {Promise<void>}
     */
    async start() {
        if (this.isRunning) {
            return;
        }

        try {
            // Request microphone access
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                }
            });

            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.sampleRate = this.audioContext.sampleRate;

            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.bufferSize * 2;

            // Connect microphone to analyser
            this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.microphone.connect(this.analyser);

            this.isRunning = true;

            // Start detection loop
            this.detect();

        } catch (error) {
            this.cleanup();
            throw error;
        }
    }

    /**
     * Stop pitch detection and cleanup resources
     */
    stop() {
        if (!this.isRunning) {
            return;
        }

        this.cleanup();
    }

    /**
     * Cleanup audio resources
     */
    cleanup() {
        this.isRunning = false;

        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Disconnect audio nodes
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }

        if (this.analyser) {
            this.analyser = null;
        }

        // Stop all media tracks
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        // Close audio context
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }

    /**
     * Main detection loop
     */
    detect() {
        if (!this.isRunning) {
            return;
        }

        // Get audio data
        const buffer = new Float32Array(this.bufferSize);
        this.analyser.getFloatTimeDomainData(buffer);

        // Detect pitch using autocorrelation
        const result = this.detectPitch(buffer);

        // Call callback if pitch detected
        if (result && this.onPitchDetected) {
            this.onPitchDetected(result);
        }

        // Schedule next detection
        this.animationFrameId = requestAnimationFrame(() => this.detect());
    }

    /**
     * Detect pitch using autocorrelation algorithm
     * @param {Float32Array} buffer - Audio buffer
     * @returns {object|null} Pitch detection result with frequency, note, and confidence
     */
    detectPitch(buffer) {
        // Calculate RMS to check if there's enough signal
        const rms = this.calculateRMS(buffer);
        if (rms < 0.01) {
            return null; // Signal too weak
        }

        // Perform autocorrelation
        const autocorrelation = this.autoCorrelate(buffer);

        if (!autocorrelation) {
            return null;
        }

        const { frequency, confidence } = autocorrelation;

        // Filter by frequency range and confidence
        if (frequency < this.minFrequency ||
            frequency > this.maxFrequency ||
            confidence < this.minConfidence) {
            return null;
        }

        // Convert frequency to note
        const note = this.frequencyToNote(frequency);

        return {
            frequency: Math.round(frequency * 10) / 10,
            note: note,
            confidence: Math.round(confidence * 100) / 100
        };
    }

    /**
     * Calculate root mean square of buffer
     * @param {Float32Array} buffer - Audio buffer
     * @returns {number} RMS value
     */
    calculateRMS(buffer) {
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
            sum += buffer[i] * buffer[i];
        }
        return Math.sqrt(sum / buffer.length);
    }

    /**
     * Autocorrelation algorithm to find fundamental frequency
     * @param {Float32Array} buffer - Audio buffer
     * @returns {object|null} Object with frequency and confidence, or null if no pitch found
     */
    autoCorrelate(buffer) {
        const size = buffer.length;
        const maxSamples = Math.floor(size / 2);

        // Calculate autocorrelation for different lags
        const correlations = new Array(maxSamples);

        for (let lag = 0; lag < maxSamples; lag++) {
            let sum = 0;
            for (let i = 0; i < maxSamples; i++) {
                sum += buffer[i] * buffer[i + lag];
            }
            correlations[lag] = sum;
        }

        // Normalize correlations
        const normalization = correlations[0];
        if (normalization === 0) {
            return null;
        }

        for (let i = 0; i < correlations.length; i++) {
            correlations[i] /= normalization;
        }

        // Find first peak after zero crossing
        // Start search after minimum period (corresponds to max frequency)
        const minLag = Math.floor(this.sampleRate / this.maxFrequency);
        const maxLag = Math.floor(this.sampleRate / this.minFrequency);

        let peakLag = -1;
        let peakValue = -1;

        // Find first point where correlation drops below 0.5
        let i = minLag;
        while (i < maxLag && correlations[i] > 0.5) {
            i++;
        }

        // Then find the next peak
        while (i < maxLag && correlations[i] <= 0.5) {
            i++;
        }

        // Now find the maximum in the region
        for (; i < maxLag; i++) {
            if (correlations[i] > peakValue) {
                peakValue = correlations[i];
                peakLag = i;
            }
        }

        if (peakLag === -1 || peakValue < 0.5) {
            return null;
        }

        // Parabolic interpolation for sub-sample accuracy
        let refinedLag = peakLag;
        if (peakLag > 0 && peakLag < correlations.length - 1) {
            const alpha = correlations[peakLag - 1];
            const beta = correlations[peakLag];
            const gamma = correlations[peakLag + 1];
            refinedLag = peakLag + (alpha - gamma) / (2 * (2 * beta - gamma - alpha));
        }

        const frequency = this.sampleRate / refinedLag;
        const confidence = peakValue;

        return { frequency, confidence };
    }

    /**
     * Convert frequency to note name
     * @param {number} frequency - Frequency in Hz
     * @returns {string} Note name (e.g., "C", "G#")
     */
    frequencyToNote(frequency) {
        // A4 = 440 Hz is the reference
        const A4 = 440;
        const A4_INDEX = 9; // A is at index 9 in chromatic scale starting from C

        // Calculate semitones from A4
        const semitones = 12 * Math.log2(frequency / A4);
        const roundedSemitones = Math.round(semitones);

        // Calculate note index in chromatic scale
        const noteIndex = (A4_INDEX + roundedSemitones) % 12;
        const positiveIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;

        return CHROMATIC_SCALE[positiveIndex];
    }
}
