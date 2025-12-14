// =========================================================
// 1. GLOBAL FUNCTIONS (Accessible by HTML onclick/onchange)
// =========================================================

// --- MODAL LOGIC (User) ---
function populateModal(element) {
    const data = element.dataset;
    const ids = ['modalUsername', 'modalUsernameDisplay', 'modalLocation', 'modalGender',
        'modalJoined', 'modalWatching', 'modalCompleted', 'modalOnHold',
        'modalDropped', 'modalPlans'];

    document.getElementById('modalUsername').innerText = data.username || 'User';
    document.getElementById('modalUsernameDisplay').innerText = data.username || 'User';
    document.getElementById('modalLocation').innerHTML = `<i class="bi bi-geo-alt"></i> ${data.location || 'Unknown'}`;
    document.getElementById('modalGender').innerHTML = `<i class="bi bi-gender-ambiguous"></i> ${data.gender || '?'}`;
    document.getElementById('modalJoined').innerHTML = `<i class="bi bi-calendar"></i> Joined: ${data.joined || '?'}`;

    document.getElementById('modalWatching').innerText = data.watching || '0';
    document.getElementById('modalCompleted').innerText = data.completed || '0';
    document.getElementById('modalOnHold').innerText = data.onhold || '0';
    document.getElementById('modalDropped').innerText = data.dropped || '0';
    document.getElementById('modalPlans').innerText = data.plans || '0';
}

// --- MODAL LOGIC (Staff) ---
function populateStaffModal(element) {
    const data = element.dataset;
    const imgEl = document.getElementById('staffModalImg');
    if(imgEl) imgEl.src = (data.image && data.image !== "") ? data.image : 'https://via.placeholder.com/150';

    const nameEl = document.getElementById('staffModalName');
    if(nameEl) nameEl.innerText = data.name || 'Unknown';

    // Ensure this ID exists in your HTML
    const jobEl = document.getElementById('staffModalJob');
    if(jobEl) jobEl.innerText = data.job || 'Staff';

    const locEl = document.getElementById('staffModalLoc');
    if(locEl) locEl.innerText = (data.location && data.location !== 'null') ? data.location : 'Unknown Location';

    let bday = data.birthday || 'Unknown';
    if (bday !== 'Unknown' && bday.length >= 10) bday = bday.substring(0, 10);
    document.getElementById('staffModalBday').innerText = bday;
    document.getElementById('staffModalFavs').innerText = data.favorites || '0';

    const linkEl = document.getElementById('staffModalLink');
    if(linkEl) {
        if (data.website && data.website !== 'null') {
            linkEl.href = data.website;
            linkEl.style.display = 'inline-block';
        } else {
            linkEl.style.display = 'none';
        }
    }
}

// --- MODAL LOGIC (Voice Actor) ---
function populateVoiceModal(element) {
    const data = element.dataset;
    const imgEl = document.getElementById('voiceModalImg');
    if(imgEl) imgEl.src = data.image || 'https://via.placeholder.com/150';

    document.getElementById('voiceModalName').innerText = data.name || 'Unknown';
    document.getElementById('voiceModalChar').innerText = data.character || 'Unknown';

    const locEl = document.getElementById('voiceModalLoc');
    if(locEl) locEl.innerText = data.location && data.location !== 'null' ? data.location : 'Unknown Location';

    let bday = data.birthday || 'Unknown';
    if (bday !== 'Unknown' && bday.length >= 10) bday = bday.substring(0, 10);
    document.getElementById('voiceModalBday').innerText = bday;
    document.getElementById('voiceModalFavs').innerText = data.favorites || '0';

    const linkEl = document.getElementById('voiceModalLink');
    if(linkEl) {
        if (data.website && data.website !== 'null') {
            linkEl.href = data.website;
            linkEl.style.display = 'inline-block';
        } else {
            linkEl.style.display = 'none';
        }
    }
}

// --- CLIENT-SIDE SEARCH LOGIC (No Reload) ---
async function searchAnimes(page = 1) {
    if (!page || page < 1) page = 1;

    // 1. Get Values
    const query = document.getElementById('searchInput').value;
    const genre = document.getElementById('genreSelect').value;
    const rating = document.getElementById('ratingSelect').value;
    const minScore = document.getElementById('minScoreSelect').value;

    const grid = document.getElementById('animeGrid');
    const pagContainer = document.getElementById('paginationContainer');

    // 2. Loading State
    grid.style.minHeight = "400px";
    grid.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div></div>';

    try {
        // 3. Update URL (Cosmetic)
        const urlParams = new URLSearchParams();
        if(query) urlParams.set('q', query);
        if(genre) urlParams.set('genre', genre);
        if(rating) urlParams.set('rating', rating);
        if(minScore) urlParams.set('min_score', minScore);
        urlParams.set('page', page);
        window.history.pushState({}, '', '?' + urlParams.toString());

        // 4. Fetch
        const response = await axios.get('/api/search', {
            params: { q: query, title: query, genre, rating, minScore, page }
        });

        const animes = response.data;
        grid.innerHTML = '';

        // 5. Render
        if (animes && animes.length > 0) {
            if(document.getElementById('resultCount'))
                document.getElementById('resultCount').innerText = `${animes.length} Results on this page`;

            animes.forEach(anime => {
                const card = `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0 hover-card">
                        <div style="height: 320px; overflow: hidden; position: relative;">
                            <img src="${anime.imageUrl}" class="card-img-top h-100 w-100" style="object-fit: cover;" alt="${anime.title}">
                            ${anime.score ? `<div class="position-absolute top-0 end-0 m-2"><span class="badge bg-warning text-dark shadow-sm"><i class="bi bi-star-fill"></i> ${anime.score}</span></div>` : ''}
                        </div>
                        <div class="card-body d-flex flex-column pt-3">
                            <h6 class="card-title text-truncate fw-bold" title="${anime.title}">${anime.title}</h6>
                            <p class="card-text text-muted small mb-3 text-truncate">${anime.genres || 'Unknown Genre'}</p>
                            <a href="/anime/${anime.malId}" class="btn btn-primary btn-sm w-100 mt-auto stretched-link">Details</a>
                        </div>
                    </div>
                </div>`;
                grid.insertAdjacentHTML('beforeend', card);
            });

            // 6. Re-render Pagination
            const hasNext = animes.length >= 12; // Or your page size limit
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = hasNext ? page + 1 : null;

            if(pagContainer) {
                pagContainer.innerHTML = `
                    <li class="page-item ${!prevPage ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="searchAnimes(${prevPage}); return false;"><i class="bi bi-chevron-left"></i> Previous</a>
                    </li>
                    <li class="page-item disabled"><span class="page-link text-muted">Page ${page}</span></li>
                    <li class="page-item ${!nextPage ? 'disabled' : ''}">
                        <a class="page-link" href="#" onclick="searchAnimes(${nextPage}); return false;">Next <i class="bi bi-chevron-right"></i></a>
                    </li>`;
            }
        } else {
            grid.innerHTML = '<div class="col-12 text-center text-muted py-5"><h4>No results found</h4></div>';
            if(pagContainer) pagContainer.innerHTML = '';
        }
    } catch (error) {
        console.error("Search failed:", error);
        grid.innerHTML = '<div class="col-12 text-center text-danger py-5">Error loading results.</div>';
    }
}

// --- REVIEW FILTER LOGIC (Client-Side) ---
async function filterReviews(score) {
    // Robust ID extraction
    const pathParts = window.location.pathname.split('/').filter(p => p !== '');
    const animeId = pathParts[pathParts.length - 1];

    const container = document.getElementById('reviewsContainer');
    if(!container) return;

    container.style.opacity = '0.5';

    try {
        const res = await axios.get(`/api/reviews/${animeId}`, {
            params: { score: score }
        });

        const reviews = res.data;
        container.innerHTML = '';

        if (reviews.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-4">No reviews found.</div>';
        }

        reviews.forEach(review => {
            const user = review.userProfile || {};
            const username = review.username || 'User';

            const html = `
                <div class="col-md-6 mb-3">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body py-2">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <a href="#" class="text-decoration-none fw-bold text-primary"
                                   data-bs-toggle="modal" data-bs-target="#userProfileModal"
                                   data-username="${username}"
                                   data-gender="${user.gender || '?'}"
                                   data-location="${user.location || 'Unknown'}"
                                   data-joined="${user.joined || '?'}"
                                   data-watching="${user.watching || 0}"
                                   data-completed="${user.completed || 0}"
                                   data-onhold="${user.on_hold || 0}"
                                   data-dropped="${user.dropped || 0}"
                                   data-plans="${user.plan_to_watch || 0}"
                                   onclick="populateModal(this)">
                                    @${username}
                                </a>
                                <span class="badge bg-secondary">${review.score} / 10</span>
                            </div>
                            <div class="small text-muted d-flex gap-3">
                                <span><i class="bi bi-play-circle"></i> ${review.status || '?'}</span>
                                <span><i class="bi bi-collection"></i> ${review.num_watched_episodes || '?'} eps</span>
                            </div>
                            <div class="mt-2 small text-muted text-truncate">
                                ${review.text ? review.text.substring(0, 150) + '...' : ''}
                            </div>
                        </div>
                    </div>
                </div>`;
            container.insertAdjacentHTML('beforeend', html);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="col-12 text-center text-danger">Error loading reviews.</div>';
    } finally {
        container.style.opacity = '1';
    }
}


// =========================================================
// 2. DOM CONTENT LOADED (Internal Logic)
// =========================================================
document.addEventListener("DOMContentLoaded", function() {

    // --- A. Restore Search Form Values from URL ---
    const params = new URLSearchParams(window.location.search);
    function setFieldValue(name) {
        if (params.has(name)) {
            const element = document.querySelector(`[id$="${name}Select"]`) || document.getElementById('searchInput');
            if (element) element.value = params.get(name);
        }
    }
    // Simple restoration
    if(document.getElementById('searchInput')) document.getElementById('searchInput').value = params.get('q') || '';
    if(document.getElementById('genreSelect')) document.getElementById('genreSelect').value = params.get('genre') || '';
    if(document.getElementById('ratingSelect')) document.getElementById('ratingSelect').value = params.get('rating') || '';
    if(document.getElementById('minScoreSelect')) document.getElementById('minScoreSelect').value = params.get('min_score') || '';


    // --- B. Auto-Load Reviews on Details Page ---
    // This is crucial for the details page to show reviews on load
    if (document.getElementById('reviewsContainer')) {
        filterReviews('');
    }


    // --- C. Voice Actor Filter Logic ---
    const voiceInput = document.getElementById('voiceLangInput');
    if (voiceInput) {
        function filterVoices() {
            const searchText = voiceInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.voice-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const rawLang = card.getAttribute('data-language') || "";
                if (searchText === "" || rawLang.toLowerCase().includes(searchText)) {
                    card.style.display = "block";
                    visibleCount++;
                } else {
                    card.style.display = "none";
                }
            });
            const noMsg = document.getElementById('noVoicesMsg');
            if (noMsg) noMsg.style.display = (visibleCount === 0) ? "block" : "none";
        }
        voiceInput.addEventListener('input', filterVoices);
        filterVoices(); // Run once
    }
});