// =========================================================
// 1. GLOBAL FUNCTION
// =========================================================
// This enables onclick="populateModal(this)" to find it.
function populateModal(element) {
    console.log("Click detected! Data:", element.dataset); // <--- Check console for this

    const data = element.dataset;

    // Basic Info
    const usernameEl = document.getElementById('modalUsername');
    if (usernameEl) usernameEl.innerText = data.username || 'User';

    const displayEl = document.getElementById('modalUsernameDisplay');
    if (displayEl) displayEl.innerText = data.username || 'User';

    // HTML Content (Icons)
    const locEl = document.getElementById('modalLocation');
    if (locEl) locEl.innerHTML = `<i class="bi bi-geo-alt"></i> ${data.location || 'Unknown'}`;

    const genderEl = document.getElementById('modalGender');
    if (genderEl) genderEl.innerHTML = `<i class="bi bi-gender-ambiguous"></i> ${data.gender || '?'}`;

    const joinedEl = document.getElementById('modalJoined');
    if (joinedEl) joinedEl.innerHTML = `<i class="bi bi-calendar"></i> Joined: ${data.joined || '?'}`;

    // Stats (Ensure IDs match your HTML exactly)
    const watchEl = document.getElementById('modalWatching');
    if (watchEl) watchEl.innerText = data.watching || '0';

    const compEl = document.getElementById('modalCompleted');
    if (compEl) compEl.innerText = data.completed || '0';

    const holdEl = document.getElementById('modalOnHold'); // Ensure data-onhold matches this
    if (holdEl) holdEl.innerText = data.onhold || '0';

    const dropEl = document.getElementById('modalDropped');
    if (dropEl) dropEl.innerText = data.dropped || '0';

    const planEl = document.getElementById('modalPlans'); // Ensure data-plans matches this
    if (planEl) planEl.innerText = data.plans || '0';
}


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

    // ============================================
    // VOICE ACTOR FILTER LOGIC (Real-time Search)
    // ============================================
    const voiceInput = document.getElementById('voiceLangInput'); // Changed ID

    if (voiceInput) {

        function filterVoices() {
            // 1. Get what the user typed (Lowercase & Trimmed)
            const searchText = voiceInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.voice-card');

            // console.log("Searching for:", searchText);

            let visibleCount = 0;

            cards.forEach(card => {
                // 2. Get the card's language (Lowercase)
                const rawLang = card.getAttribute('data-language') || "";
                const cardLang = rawLang.toLowerCase();

                // 3. Logic:
                // If search is empty ("") -> SHOW ALL
                // If card language includes search text (e.g. "japanese" includes "jap") -> SHOW
                if (searchText === "" || cardLang.includes(searchText)) {
                    card.style.display = "block";
                    visibleCount++;
                } else {
                    card.style.display = "none";
                }
            });

            // 4. Toggle "No Results" message
            const noMsg = document.getElementById('noVoicesMsg');
            if (noMsg) {
                noMsg.style.display = (visibleCount === 0) ? "block" : "none";
            }
        }

        // 5. Run every time the user types a key
        voiceInput.addEventListener('input', filterVoices);

        // Run once on load (shows all by default since input is empty)
        filterVoices();
    }

});
