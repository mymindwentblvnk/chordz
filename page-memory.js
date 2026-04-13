// Page Memory - Remember last visited page

(function() {
    const LAST_PAGE_KEY = 'chordz-last-page';

    // Get current page path
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Save current page as last visited (for all pages except index.html)
    if (currentPage !== 'index.html') {
        try {
            localStorage.setItem(LAST_PAGE_KEY, currentPage);
        } catch (e) {
            console.error('Failed to save last page:', e);
        }
    }
})();
