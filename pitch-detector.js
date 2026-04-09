// Shared Pitch Detection Algorithm
// Uses autocorrelation-based pitch detection with temporal smoothing and harmonic rejection

class PitchDetector {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.mediaStream = null;
        this.animationFrameId = null;
        this.isRunning = false;
        this.bufferSize = 4096; // Increased for better low-frequency resolution
        this.sampleRate = null;
        this.minFrequency = 80;
        this.maxFrequency = 1200;
        this.minConfidence = 0.90; // Increased threshold for better accuracy
        this.onPitchDetected = null;
        this.lastFrequency = null;
        this.stableCount = 0;

        console.log('PitchDetector initialized');
    }

    async start() {
        console.log('Starting pitch detector...');
        if (this.isRunning) {
            console.log('Already running');
            return;
        }

        try {
            console.log('Requesting microphone access...');
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                    latency: 0
                }
            });
            console.log('Microphone access granted');

            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.sampleRate = this.audioContext.sampleRate;
            console.log('Audio context created, sample rate:', this.sampleRate);

            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 8192; // Larger FFT for better resolution
            this.analyser.smoothingTimeConstant = 0.3; // Light smoothing to reduce noise

            this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.microphone.connect(this.analyser);
            console.log('Audio pipeline connected');

            this.isRunning = true;
            this.detect();
        } catch (error) {
            console.error('Error starting pitch detector:', error);
            this.cleanup();
            throw error;
        }
    }

    stop() {
        console.log('Stopping pitch detector...');
        this.cleanup();
    }

    cleanup() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.microphone) {
            this.microphone.disconnect();
            this.microphone = null;
        }
        if (this.analyser) {
            this.analyser = null;
        }
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => {
                track.stop();
                console.log('Stopped media track');
            });
            this.mediaStream = null;
        }
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        console.log('Cleanup complete');
    }

    detect() {
        if (!this.isRunning) return;

        const buffer = new Float32Array(this.bufferSize);
        this.analyser.getFloatTimeDomainData(buffer);

        const result = this.detectPitch(buffer);

        if (this.onPitchDetected) {
            this.onPitchDetected(result, buffer);
        }

        this.animationFrameId = requestAnimationFrame(() => this.detect());
    }

    detectPitch(buffer) {
        const rms = this.calculateRMS(buffer);
        // Adaptive threshold based on signal strength
        if (rms < 0.01) {
            return null;
        }

        const autocorrelation = this.autoCorrelate(buffer);
        if (!autocorrelation) {
            return null;
        }

        let { frequency, confidence } = autocorrelation;

        if (frequency < this.minFrequency ||
            frequency > this.maxFrequency ||
            confidence < this.minConfidence) {
            return null;
        }

        // Temporal smoothing - only accept stable frequencies
        if (this.lastFrequency) {
            const freqDiff = Math.abs(frequency - this.lastFrequency);
            const tolerance = this.lastFrequency * 0.02; // 2% tolerance

            if (freqDiff < tolerance) {
                this.stableCount++;
                // Average with last frequency for smoother output
                frequency = (frequency + this.lastFrequency) / 2;
            } else {
                this.stableCount = 0;
            }
        }

        this.lastFrequency = frequency;

        // Only return if frequency has been stable for at least 2 frames
        if (this.stableCount < 2) {
            return null;
        }

        const note = this.frequencyToNote(frequency);
        const octave = this.getOctave(frequency);

        return {
            frequency: Math.round(frequency * 10) / 10,
            note: note,
            octave: octave,
            confidence: Math.round(confidence * 100) / 100,
            rms: rms
        };
    }

    calculateRMS(buffer) {
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
            sum += buffer[i] * buffer[i];
        }
        return Math.sqrt(sum / buffer.length);
    }

    autoCorrelate(buffer) {
        const size = buffer.length;
        const maxSamples = Math.floor(size / 2);
        const correlations = new Array(maxSamples);

        // Calculate autocorrelation
        for (let lag = 0; lag < maxSamples; lag++) {
            let sum = 0;
            for (let i = 0; i < maxSamples; i++) {
                sum += buffer[i] * buffer[i + lag];
            }
            correlations[lag] = sum;
        }

        // Normalize
        const normalization = correlations[0];
        if (normalization === 0) return null;

        for (let i = 0; i < correlations.length; i++) {
            correlations[i] /= normalization;
        }

        const minLag = Math.floor(this.sampleRate / this.maxFrequency);
        const maxLag = Math.floor(this.sampleRate / this.minFrequency);

        // Find all peaks above threshold
        const peaks = [];
        for (let i = minLag + 1; i < maxLag - 1; i++) {
            // Check if this is a local maximum
            if (correlations[i] > 0.5 &&
                correlations[i] > correlations[i - 1] &&
                correlations[i] >= correlations[i + 1]) {
                peaks.push({ lag: i, value: correlations[i] });
            }
        }

        if (peaks.length === 0) return null;

        // Sort peaks by correlation value (highest first)
        peaks.sort((a, b) => b.value - a.value);

        // Use the highest peak as fundamental
        let peakLag = peaks[0].lag;
        let peakValue = peaks[0].value;

        // Check if this might be a harmonic (octave error)
        // Look for a peak at roughly half the lag (double the frequency)
        for (let i = 1; i < Math.min(peaks.length, 5); i++) {
            const ratio = peakLag / peaks[i].lag;
            // If we find a peak at roughly 2x frequency with good correlation
            if (ratio > 1.8 && ratio < 2.2 && peaks[i].value > 0.7) {
                // This might be the fundamental, use it instead
                peakLag = peaks[i].lag;
                peakValue = peaks[i].value;
                break;
            }
        }

        // Parabolic interpolation for sub-sample accuracy
        let refinedLag = peakLag;
        if (peakLag > 0 && peakLag < correlations.length - 1) {
            const alpha = correlations[peakLag - 1];
            const beta = correlations[peakLag];
            const gamma = correlations[peakLag + 1];
            const divisor = 2 * (2 * beta - gamma - alpha);
            if (divisor !== 0) {
                refinedLag = peakLag + (alpha - gamma) / divisor;
            }
        }

        const frequency = this.sampleRate / refinedLag;
        const clampedConfidence = Math.min(1.0, Math.max(0.0, peakValue));
        return { frequency, confidence: clampedConfidence };
    }

    frequencyToNote(frequency) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const A4 = 440;
        const A4_INDEX = 9;
        const semitones = 12 * Math.log2(frequency / A4);
        const roundedSemitones = Math.round(semitones);
        const noteIndex = (A4_INDEX + roundedSemitones) % 12;
        const positiveIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;
        return noteNames[positiveIndex];
    }

    getOctave(frequency) {
        const A4 = 440;
        const semitones = 12 * Math.log2(frequency / A4);
        const octave = 4 + Math.floor((semitones + 9) / 12);
        return octave;
    }

    // Static utility methods for use without instantiation
    static calculateRMS(buffer) {
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
            sum += buffer[i] * buffer[i];
        }
        return Math.sqrt(sum / buffer.length);
    }

    static autoCorrelate(buffer, sampleRate, minFreq = 80, maxFreq = 1200) {
        const size = buffer.length;
        const maxSamples = Math.floor(size / 2);
        const correlations = new Array(maxSamples);

        // Calculate autocorrelation
        for (let lag = 0; lag < maxSamples; lag++) {
            let sum = 0;
            for (let i = 0; i < maxSamples; i++) {
                sum += buffer[i] * buffer[i + lag];
            }
            correlations[lag] = sum;
        }

        // Normalize
        const normalization = correlations[0];
        if (normalization === 0) return null;

        for (let i = 0; i < correlations.length; i++) {
            correlations[i] /= normalization;
        }

        const minLag = Math.floor(sampleRate / maxFreq);
        const maxLag = Math.floor(sampleRate / minFreq);

        // Find all peaks above threshold
        const peaks = [];
        for (let i = minLag + 1; i < maxLag - 1; i++) {
            // Check if this is a local maximum
            if (correlations[i] > 0.5 &&
                correlations[i] > correlations[i - 1] &&
                correlations[i] >= correlations[i + 1]) {
                peaks.push({ lag: i, value: correlations[i] });
            }
        }

        if (peaks.length === 0) return null;

        // Sort peaks by correlation value (highest first)
        peaks.sort((a, b) => b.value - a.value);

        // Use the highest peak as fundamental
        let peakLag = peaks[0].lag;
        let peakValue = peaks[0].value;

        // Check if this might be a harmonic (octave error)
        // Look for a peak at roughly half the lag (double the frequency)
        for (let i = 1; i < Math.min(peaks.length, 5); i++) {
            const ratio = peakLag / peaks[i].lag;
            // If we find a peak at roughly 2x frequency with good correlation
            if (ratio > 1.8 && ratio < 2.2 && peaks[i].value > 0.7) {
                // This might be the fundamental, use it instead
                peakLag = peaks[i].lag;
                peakValue = peaks[i].value;
                break;
            }
        }

        // Parabolic interpolation for sub-sample accuracy
        let refinedLag = peakLag;
        if (peakLag > 0 && peakLag < correlations.length - 1) {
            const alpha = correlations[peakLag - 1];
            const beta = correlations[peakLag];
            const gamma = correlations[peakLag + 1];
            const divisor = 2 * (2 * beta - gamma - alpha);
            if (divisor !== 0) {
                refinedLag = peakLag + (alpha - gamma) / divisor;
            }
        }

        const frequency = sampleRate / refinedLag;
        const clampedConfidence = Math.min(1.0, Math.max(0.0, peakValue));
        return { frequency, confidence: clampedConfidence };
    }

    static frequencyToNote(frequency) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const A4 = 440;
        const A4_INDEX = 9;
        const semitones = 12 * Math.log2(frequency / A4);
        const roundedSemitones = Math.round(semitones);
        const noteIndex = (A4_INDEX + roundedSemitones) % 12;
        const positiveIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;
        return noteNames[positiveIndex];
    }
}
