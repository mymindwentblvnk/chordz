// Page Memory - Remember last visited page and restore on app launch

(function() {
    const LAST_PAGE_KEY = 'chordz-last-page';
    const REDIRECTED_KEY = 'chordz-redirected-this-session';

    // Get current page path
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Save current page as last visited (for all pages)
    try {
        localStorage.setItem(LAST_PAGE_KEY, currentPage);
    } catch (e) {
        console.error('Failed to save last page:', e);
    }

    // Only redirect from training.html (the main entry point)
    if (currentPage === 'training.html' || currentPage === '') {
        // Check if we've already redirected this session
        const hasRedirected = sessionStorage.getItem(REDIRECTED_KEY);

        // Check if this is a deeplink (has referrer) or fresh app launch (no referrer)
        // If there's a referrer, user clicked a link, so don't redirect
        const isDeeplink = document.referrer !== '';

        if (!hasRedirected && !isDeeplink) {
            try {
                const lastPage = localStorage.getItem(LAST_PAGE_KEY);

                // Only redirect if there's a saved page and it's different from current
                if (lastPage && lastPage !== 'training.html' && lastPage !== '') {
                    // Mark that we've redirected this session to prevent loops
                    sessionStorage.setItem(REDIRECTED_KEY, 'true');

                    // Redirect to last page
                    window.location.href = lastPage;
                }
            } catch (e) {
                console.error('Failed to restore last page:', e);
            }
        }
    }
})();
