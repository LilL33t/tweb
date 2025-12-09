document.addEventListener("DOMContentLoaded", function() {
    // 1. Get the parameters from the URL (e.g., ?genre=Adventure&year=2022)
    const params = new URLSearchParams(window.location.search);

    // 2. Define a helper to set values if they exist
    function setFieldValue(name) {
        if (params.has(name)) {
            const element = document.querySelector(`[name="${name}"]`);
            if (element) {
                element.value = params.get(name);
            }
        }
    }

    // 3. Restore the values for each dropdown/input
    setFieldValue('genre');
    setFieldValue('rating');
    setFieldValue('min_score');
    // Title 'q' is already handled by value="{{searchParams.q}}" in the HBS, but this doesn't hurt.
    setFieldValue('q');

    setFieldValue('score');

    // 1. Get the current URL path (e.g., "/anime/5114")
    const path = window.location.pathname;
    const parts = path.split('/');

    // 2. Check if we are on an "anime" details page
    // parts[0] is empty, parts[1] is 'anime', parts[2] is the ID
    if (parts[1] === 'anime' && parts[2]) {
        const animeId = parts[2];
        console.log("Auto-loading reviews for:", animeId); // Debug line

        // Call the function immediately!
        loadReviews(animeId, null);
    }

    const ratingFilter = document.getElementById('ratingFilter');

    if (ratingFilter) {
        ratingFilter.addEventListener('change', function() {
            // Get Anime ID from URL (e.g. /anime/5114)
            const path = window.location.pathname.split('/');
            const animeId = path[path.length - 1]; // Last part is ID

            const selectedScore = this.value; // "10", "9", or ""

            // Call the existing function
            loadReviews(animeId, selectedScore);
        });
    }

    // ============================================
    // 3. PAGINATION LOGIC
    // ============================================
    const pageLinks = document.querySelectorAll('.pagination-link');

    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Stop the link from jumping to top

            // 1. Get the page number we want to go to
            const targetPage = this.getAttribute('data-page');

            // 2. Get the current URL parameters (e.g. ?genre=Action&q=Naruto)
            const params = new URLSearchParams(window.location.search);

            // 3. Update ONLY the 'page' parameter
            params.set('page', targetPage);

            // 4. Reload the page with the new parameters
            window.location.search = params.toString();
        });
    });
});
