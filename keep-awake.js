// Keep Awake - a small floating button on every page that keeps the screen on.
//
// Uses the Screen Wake Lock API (Chrome/Edge on macOS, Safari on macOS and iOS 16.4+).
// Fallback for older iOS and home-screen apps without Wake Lock: a tiny muted
// video that loops inline, which also stops the display from sleeping.
// The choice is remembered, so the screen stays on on every page you open.

(function () {
    const STORAGE_KEY = 'chordz-keep-awake';
    const supportsWakeLock = 'wakeLock' in navigator;

    let enabled = false;
    let sentinel = null;
    let video = null;
    let button = null;

    function loadPreference() {
        try { return localStorage.getItem(STORAGE_KEY) === 'on'; } catch (e) { return false; }
    }

    function savePreference(on) {
        try { localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
    }

    async function requestWakeLock() {
        if (!supportsWakeLock) return false;
        try {
            sentinel = await navigator.wakeLock.request('screen');
            sentinel.addEventListener('release', () => { sentinel = null; });
            return true;
        } catch (e) {
            console.warn('Keep awake: wake lock request failed', e);
            return false;
        }
    }

    async function startVideoFallback() {
        if (!video) {
            video = document.createElement('video');
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            video.muted = true;
            video.loop = true;
            video.src = 'media/keep-awake.mp4';
            video.style.cssText = 'position: fixed; width: 1px; height: 1px; opacity: 0.01; pointer-events: none; left: 0; bottom: 0;';
            document.body.appendChild(video);
        }
        try {
            await video.play();
            return true;
        } catch (e) {
            console.warn('Keep awake: video fallback failed', e);
            return false;
        }
    }

    async function acquire() {
        if (await requestWakeLock()) return true;
        return startVideoFallback();
    }

    async function release() {
        if (sentinel) {
            try { await sentinel.release(); } catch (e) { /* ignore */ }
            sentinel = null;
        }
        if (video) video.pause();
    }

    function render(active) {
        if (!button) return;
        button.textContent = active ? '☀️ Screen stays on' : '🌙 Keep screen on';
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        button.style.background = active ? 'var(--accent-happy, #10b981)' : 'var(--surface, #1e293b)';
        button.style.color = active ? 'white' : 'var(--text-secondary, #94a3b8)';
    }

    async function setEnabled(on) {
        enabled = on;
        savePreference(on);
        if (on) {
            const ok = await acquire();
            render(ok);
            if (!ok) {
                enabled = false;
                savePreference(false);
            }
        } else {
            await release();
            render(false);
        }
    }

    function createButton() {
        button = document.createElement('button');
        button.type = 'button';
        button.title = 'Keep the display from going to sleep';
        button.style.cssText = [
            'position: fixed',
            'right: max(12px, env(safe-area-inset-right))',
            'bottom: max(12px, env(safe-area-inset-bottom))',
            'z-index: 9999',
            'padding: 8px 12px',
            'font-size: 0.8rem',
            'font-weight: 600',
            'font-family: inherit',
            'border: 1px solid rgba(148, 163, 184, 0.3)',
            'border-radius: 999px',
            'cursor: pointer',
            'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35)',
            'transition: background 0.2s ease'
        ].join(';');
        button.addEventListener('click', () => setEnabled(!enabled));
        document.body.appendChild(button);
        // Leave room at the end of the page so the button never hides the last content
        const padding = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
        if (padding < 64) document.body.style.paddingBottom = '64px';
        render(false);
    }

    // The browser drops the wake lock when the tab is hidden: take it again when you come back
    document.addEventListener('visibilitychange', async () => {
        if (enabled && document.visibilityState === 'visible' && !sentinel) {
            render(await acquire());
        }
    });

    function init() {
        createButton();
        if (!loadPreference()) return;
        enabled = true;
        // Chrome grants the lock right away. Safari may need a tap first:
        // then the first tap anywhere on the page turns it on.
        acquire().then(ok => {
            render(ok);
            if (ok) return;
            const retry = async (event) => {
                if (event.target === button) return; // the button handles itself
                document.removeEventListener('pointerdown', retry, true);
                if (enabled) render(await acquire());
            };
            document.addEventListener('pointerdown', retry, true);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
