// 1. Search Function
async function searchAnime() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('resultsArea');

    if (!query) return alert("Please enter a title");

    // Show loading spinner
    resultsDiv.innerHTML = '<div class="text-center mt-4"><div class="spinner-border text-primary"></div></div>';

    try {
        // MATCHES YOUR GATEWAY ROUTE: router.get('/search', ...)
        const res = await axios.get(`/api/search?title=${query}`);
        const animes = res.data;

        resultsDiv.innerHTML = ''; // Clear loading

        if (animes.length === 0) {
            resultsDiv.innerHTML = '<div class="alert alert-warning text-center">No results found.</div>';
            return;
        }

        // Render Cards
        animes.forEach(anime => {
            // Note: Java returns 'malId', 'title', 'imageUrl'
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm hover-card">
                        <img src="${anime.imageUrl}" class="card-img-top" style="height: 300px; object-fit: cover;" alt="poster">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${anime.title}</h5>
                            <p class="card-text text-muted small">${anime.genres || 'Genre N/A'}</p>
                            <div class="mt-auto">
                                <button class="btn btn-primary w-100" onclick="loadDetails(${anime.malId})">
                                    Analyze Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            resultsDiv.innerHTML += card;
        });

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = '<div class="alert alert-danger text-center">Search Failed (Is Java Backend Running?)</div>';
    }
}

// 2. Load Details Function
async function loadDetails(id) {
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');

    // Open Modal immediately showing loading state
    const myModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    myModal.show();

    modalBody.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div><p class="mt-2">Aggregating Data...</p></div>';

    try {
        // MATCHES YOUR GATEWAY ROUTE: router.get('/anime/:id', ...)
        const res = await axios.get(`/api/anime/${id}`);
        const data = res.data;

        // CRITICAL: Based on your JSON, the title is inside 'animeData'
        modalTitle.innerText = data.animeData.title;

        // Build HTML
        const html = `
            <div class="row">
                <div class="col-md-4">
                    <img src="${data.animeData.imageUrl}" class="img-fluid rounded mb-3 shadow">
                    
                    <div class="card bg-light mb-3">
                        <div class="card-header fw-bold">Global Statistics</div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item d-flex justify-content-between">
                                <span>Watching:</span> <strong>${data.stats.watching || 0}</strong>
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                <span>Completed:</span> <strong>${data.stats.completed || 0}</strong>
                            </li>
                            <li class="list-group-item d-flex justify-content-between">
                                <span>Total Users:</span> <strong>${data.stats.total || 0}</strong>
                            </li>
                             <li class="list-group-item d-flex justify-content-between">
                                <span>Dropped:</span> <strong class="text-danger">${data.stats.dropped || 0}</strong>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-8">
                    <h5>Synopsis</h5>
                    <p class="text-secondary">${data.animeData.synopsis || "No synopsis available."}</p>
                    <hr>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0">Recent Top Reviews</h5>
                        <span class="badge bg-primary">Avg Score: ${data.stats.score_10_percentage ? "High" : "N/A"}</span>
                    </div>

                    <div style="max-height: 400px; overflow-y: auto; border: 1px solid #eee; padding: 10px; border-radius: 5px;">
                        ${data.ratings && data.ratings.length > 0 ?
            data.ratings.map(r => `
                                <div class="card mb-2 border-0 border-bottom">
                                    <div class="card-body py-2">
                                        <div class="d-flex justify-content-between">
                                            <h6 class="card-title mb-0 fw-bold text-dark">${r.username}</h6>
                                            <span class="badge bg-${getScoreColor(r.score)}">Score: ${r.score}</span>
                                        </div>
                                        <small class="text-muted">Status: ${r.status}</small>
                                    </div>
                                </div>
                            `).join('')
            : '<p class="text-center text-muted mt-3">No reviews found.</p>'
        }
                    </div>
                </div>
            </div>
        `;

        modalBody.innerHTML = html;

    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<div class="alert alert-danger">Failed to load details. Check console for error.</div>';
    }
}

// Helper: Color code the scores
function getScoreColor(score) {
    if (score >= 8) return 'success'; // Green
    if (score >= 5) return 'warning'; // Yellow
    return 'danger'; // Red
}