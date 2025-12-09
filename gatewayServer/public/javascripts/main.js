// =========================================================
// 1. GLOBAL FUNCTIONS
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

// =========================================================
// STAFF MODAL LOGIC
// =========================================================
function populateStaffModal(element) {
    const data = element.dataset;

    // 1. Image
    const imgEl = document.getElementById('staffModalImg');
    // Check if data.image exists and is not empty, otherwise use placeholder
    if(imgEl) {
        imgEl.src = (data.image && data.image !== "") ? data.image : 'https://via.placeholder.com/150';
    }

    // 2. Name
    const nameEl = document.getElementById('staffModalName');
    if(nameEl) nameEl.innerText = data.name || 'Unknown';


    // 3. Location
    const locEl = document.getElementById('staffModalLoc');
    if(locEl) {
        // If location is missing or literal string "null", show Unknown
        const loc = (data.location && data.location !== 'null') ? data.location : 'Unknown Location';
        locEl.innerText = loc;
    }

    // 4. Stats
    let bday = data.birthday || 'Unknown';
    // Fix Java Timestamp format if needed (YYYY-MM-DD...)
    if (bday !== 'Unknown' && bday.length >= 10) bday = bday.substring(0, 10);

    document.getElementById('staffModalBday').innerText = bday;
    document.getElementById('staffModalFavs').innerText = data.favorites || '0';

    // 5. Website Link
    const linkEl = document.getElementById('staffModalLink');
    if(linkEl) {
        if (data.website && data.website !== 'null' && data.website !== "") {
            linkEl.href = data.website;
            linkEl.style.display = 'inline-block';
            linkEl.innerText = 'Visit Website';
        } else {
            // If no link, hide the button so user doesn't click a dead link
            linkEl.style.display = 'none';
        }
    }
}

// =========================================================
// NEW: VOICE ACTOR MODAL LOGIC
// =========================================================
function populateVoiceModal(element) {
    const data = element.dataset;

    // 1. Basic Info
    const imgEl = document.getElementById('voiceModalImg');
    if(imgEl) imgEl.src = data.image || 'https://via.placeholder.com/150';

    const nameEl = document.getElementById('voiceModalName');
    if(nameEl) nameEl.innerText = data.name || 'Unknown';

    const charEl = document.getElementById('voiceModalChar');
    if(charEl) charEl.innerText = data.character || 'Unknown';

    // 2. NEW: Location
    const locEl = document.getElementById('voiceModalLoc');
    if(locEl) {
        // If data is missing or empty string, show 'Unknown'
        locEl.innerText = data.location && data.location !== 'null' ? data.location : 'Unknown Location';
    }

    // 3. Stats
    let bday = data.birthday || 'Unknown';
    if (bday !== 'Unknown' && bday.length >= 10) {
        bday = bday.substring(0, 10);
    }
    document.getElementById('voiceModalBday').innerText = bday;
    document.getElementById('voiceModalFavs').innerText = data.favorites || '0';

    // 4. Website
    const linkEl = document.getElementById('voiceModalLink');
    if(linkEl) {
        if (data.website && data.website !== 'null') {
            linkEl.href = data.website;
            linkEl.style.display = 'inline-block';
            linkEl.innerText = 'Visit Website';
        } else {
            linkEl.style.display = 'none';
        }
    }
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
