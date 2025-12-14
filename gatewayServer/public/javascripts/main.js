// =========================================================
// 1. GLOBAL FUNCTIONS (Accessible by HTML onclick)
// =========================================================

// --- MODAL LOGIC (User) ---
function populateModal(element) {
    const data = element.dataset;
    //document.getElementById('modalUsername').innerText = data.username;
    document.getElementById('modalUsernameDisplay').innerText = data.username;
    document.getElementById('modalLocation').innerHTML = `<i class="bi bi-geo-alt"></i> ${data.location}`;
    document.getElementById('modalGender').innerHTML = `<i class="bi bi-gender-ambiguous"></i> ${data.gender}`;
    document.getElementById('modalJoined').innerHTML = `<i class="bi bi-calendar"></i> Joined: ${data.joined}`;
    document.getElementById('modalBirthday').innerHTML = `<i class="bi bi-gift"></i> ${data.birthday}`;

    document.getElementById('modalWatching').innerText = data.watching;
    document.getElementById('modalCompleted').innerText = data.completed;
    document.getElementById('modalOnHold').innerText = data.onhold;
    document.getElementById('modalDropped').innerText = data.dropped;
    document.getElementById('modalPlans').innerText = data.plans;
}

// --- MODAL LOGIC (Staff) ---
function populateStaffModal(element) {
    const data = element.dataset;
    const imgEl = document.getElementById('staffModalImg');

    // FIX: Check for "null" string or empty
    if(imgEl) {
        const hasImage = data.image && data.image !== "null" && data.image !== "";
        imgEl.src = hasImage ? data.image : 'https://via.placeholder.com/150';
    }

    document.getElementById('staffModalName').innerText = data.name || 'Unknown';

    const jobEl = document.getElementById('staffModalJob'); // Ensure this ID exists in your HTML Modal
    if(jobEl) jobEl.innerText = data.job || 'Staff';

    const locEl = document.getElementById('staffModalLoc');
    if(locEl) locEl.innerText = (data.location && data.location !== 'null') ? data.location : 'Unknown Location';

    let bday = data.birthday || 'Unknown';
    if (bday !== 'Unknown' && bday.length >= 10) bday = bday.substring(0, 10);
    document.getElementById('staffModalBday').innerText = bday;
    document.getElementById('staffModalFavs').innerText = data.favorites || '0';

    const linkEl = document.getElementById('staffModalLink');
    if(linkEl) {
        if (data.website && data.website !== 'null' && data.website !== "") {
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

    // FIX: Check for "null" string
    if(imgEl) {
        const hasImage = data.image && data.image !== "null" && data.image !== "";
        imgEl.src = hasImage ? data.image : 'https://via.placeholder.com/150';
    }

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

// --- CLIENT-SIDE SEARCH (For Main Grid) ---
async function searchAnimes(page = 1) {
    if (!page || page < 1) page = 1;

    const query = document.getElementById('searchInput').value;
    const genre = document.getElementById('genreSelect').value;
    const rating = document.getElementById('ratingSelect').value;
    const minScore = document.getElementById('minScoreSelect').value;

    const grid = document.getElementById('animeGrid');
    const pagContainer = document.getElementById('paginationContainer');

    grid.style.minHeight = "400px";
    grid.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div></div>';

    try {
        const urlParams = new URLSearchParams();
        if(query) urlParams.set('q', query);
        if(genre) urlParams.set('genre', genre);
        if(rating) urlParams.set('rating', rating);
        if(minScore) urlParams.set('min_score', minScore);
        urlParams.set('page', page);
        window.history.pushState({}, '', '?' + urlParams.toString());

        const response = await axios.get('/api/search', {
            params: { q: query, title: query, genre, rating, minScore, page }
        });

        const animes = response.data;
        grid.innerHTML = '';

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

            // Re-render Pagination
            const hasNext = animes.length >= 12;
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

// --- REVIEW FILTER (Client-Side) ---
async function filterReviews(score, page = 1) {
    const pathParts = window.location.pathname.split('/').filter(p => p !== '');
    const animeId = pathParts[pathParts.length - 1];

    const container = document.getElementById('reviewsContainer');
    const pagContainer = document.getElementById('reviewsPagination');

    if(!container) return;

    container.style.opacity = '0.5';

    try {
        const res = await axios.get(`/api/reviews/${animeId}`, {
            params: { score: score, page: page }
        });

        const reviews = res.data;
        container.innerHTML = '';
        if(pagContainer) pagContainer.innerHTML = '';

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
                                   data-username="${username || 'User'}"
                                   data-gender="${user.gender || 'Unknown gender'}"
                                   data-birthday="${user.birthday || 'Unknown birthday'}"
                                   data-location="${user.location || 'Unknown location'}"
                                   data-joined="${user.joined || 'Unknown join date'}"
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

        // Review Pagination Buttons
        if (pagContainer) {
            const limit = 6;
            const hasNext = reviews.length === limit;
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = hasNext ? page + 1 : null;
            const safeScore = score ? `'${score}'` : "''";

            let buttonsHTML = `
                <li class="page-item ${!prevPage ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="filterReviews(${safeScore}, ${prevPage}); return false;">Previous</a>
                </li>
                <li class="page-item disabled">
                    <span class="page-link text-muted">Page ${page}</span>
                </li>
                <li class="page-item ${!nextPage ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="filterReviews(${safeScore}, ${nextPage}); return false;">Next</a>
                </li>`;
            pagContainer.innerHTML = buttonsHTML;
        }

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="col-12 text-center text-danger">Error loading reviews.</div>';
    } finally {
        container.style.opacity = '1';
    }
}


// =========================================================
// 2. DOM CONTENT LOADED
// =========================================================
document.addEventListener("DOMContentLoaded", function() {

    // --- A. Restore Search Values ---
    const params = new URLSearchParams(window.location.search);
    if(document.getElementById('searchInput')) document.getElementById('searchInput').value = params.get('q') || '';
    if(document.getElementById('genreSelect')) document.getElementById('genreSelect').value = params.get('genre') || '';
    if(document.getElementById('ratingSelect')) document.getElementById('ratingSelect').value = params.get('rating') || '';
    if(document.getElementById('minScoreSelect')) document.getElementById('minScoreSelect').value = params.get('min_score') || '';

    // --- B. Auto-Load Reviews ---
    if (document.getElementById('reviewsContainer')) {
        filterReviews('');
    }

    // ============================================
    // UNIVERSAL CLIENT-SIDE PAGINATION (Voice, Staff, Chars)
    // ============================================

    function setupClientPagination(cardClass, paginationId, inputId = null, itemsPerPage = 10) {
        const pagContainer = document.getElementById(paginationId);
        if (!pagContainer) return;

        // Grab all cards
        const allCards = Array.from(document.querySelectorAll(`.${cardClass}`));
        let currentPage = 1;
        let currentFilter = "";

        function render() {
            // Filter
            const matchingCards = allCards.filter(card => {
                // If filter input provided (like Voice search)
                if (inputId) {
                    const rawVal = card.getAttribute('data-language') || "";
                    return currentFilter === "" || rawVal.toLowerCase().includes(currentFilter);
                }
                return true; // No filter for Staff/Chars
            });

            // Pagination
            const totalPages = Math.ceil(matchingCards.length / itemsPerPage);
            if (currentPage > totalPages) currentPage = 1;
            if (currentPage < 1) currentPage = 1;

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const cardsToShow = matchingCards.slice(startIndex, endIndex);

            // Toggle Visibility
            allCards.forEach(card => {
                if (cardsToShow.includes(card)) {
                    card.style.display = ''; // RESET to default (fixes layout break)
                } else {
                    card.style.display = 'none';
                }
            });

            // Render Buttons
            let buttonsHTML = '';
            if (totalPages > 1) {
                // Prev
                buttonsHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <button class="page-link" data-page="${currentPage - 1}">Prev</button></li>`;

                // Pages
                for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                        buttonsHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                            <button class="page-link" data-page="${i}">${i}</button></li>`;
                    } else if (i === currentPage - 2 || i === currentPage + 2) {
                        buttonsHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                    }
                }

                // Next
                buttonsHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <button class="page-link" data-page="${currentPage + 1}">Next</button></li>`;
            }
            pagContainer.innerHTML = buttonsHTML;
        }

        // Event Delegation for Pagination Clicks
        pagContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.preventDefault();
                const newPage = parseInt(e.target.getAttribute('data-page'));
                if (!isNaN(newPage)) {
                    currentPage = newPage;
                    render();
                }
            }
        });

        // Event Listener for Search Input (Voice only)
        if (inputId) {
            const inputEl = document.getElementById(inputId);
            if (inputEl) {
                inputEl.addEventListener('input', (e) => {
                    currentFilter = e.target.value.toLowerCase().trim();
                    currentPage = 1;
                    render();
                });
            }
        }

        render(); // Initial Run
    }

    // Initialize logic for all 3 sections
    setupClientPagination('voice-card', 'voicePagination', 'voiceLangInput');
    setupClientPagination('staff-card', 'staffPagination');
    setupClientPagination('char-card', 'charPagination');
});