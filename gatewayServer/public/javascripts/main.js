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
            <img src="${anime.imageUrl}" class="card-img-top" style="height: 300px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${anime.title}</h5>
                <p class="card-text text-muted small">${anime.genres || 'Genre N/A'}</p>
                <div class="mt-auto">
                    <a href="/anime/${anime.malId}" class="btn btn-primary w-100">
                        See more
                    </a>
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
    const myModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    myModal.show();
    modalBody.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>';

    try {
        const res = await axios.get(`/api/anime/${id}`);
        const data = res.data;
        modalTitle.innerText = data.animeData.title;

        // Helper to render Cast/Staff lists
        const renderList = (items, type) => {
            if (!items || items.length === 0) return '<p class="text-muted">No data available.</p>';
            return items.map(item => `
                <div class="d-flex align-items-center mb-2 border-bottom pb-2">
                    <img src="${item.imageUrl || 'https://via.placeholder.com/50'}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;" class="me-3">
                    <div>
                        <strong class="d-block">${item.name}</strong>
                        <small class="text-muted">${type === 'char' ? item.role : item.job}</small>
                    </div>
                </div>
            `).join('');
        };

        // Helper to render Score Bars (10 to 1)
        // We map an array [10, 9, ... 1] to HTML progress bars
        const renderScoreDistribution = () => {
            const scores = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

            return scores.map(score => {
                // Access dynamic properties: stats.score_10_votes, etc.
                const votes = data.stats[`score_${score}_votes`] || 0;
                const pct = data.stats[`score_${score}_percentage`] || 0;

                // Color coding: High=Green, Mid=Yellow, Low=Red
                let color = 'danger';
                if (score >= 8) color = 'success';
                else if (score >= 5) color = 'warning';

                return `
                    <div class="d-flex align-items-center mb-1" style="font-size: 0.9rem;">
                        <span class="fw-bold me-2" style="width: 20px;">${score}</span>
                        <div class="progress flex-grow-1" style="height: 10px;">
                            <div class="progress-bar bg-${color}" style="width: ${pct}%"></div>
                        </div>
                        <span class="ms-2 text-muted small" style="width: 80px; text-align: right;">
                            ${pct}% 
                        </span>
                    </div>
                `;
            }).join('');
        };

        const html = `
            <ul class="nav nav-tabs mb-3" id="myTab" role="tablist">
                <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#overview" type="button">Overview</button></li>
                <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#cast" type="button">Characters (${data.characters.length})</button></li>
                <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#staff" type="button">Staff (${data.staff.length})</button></li>
            </ul>

            <div class="tab-content">
                
                <div class="tab-pane fade show active" id="overview">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${data.animeData.imageUrl}" class="img-fluid rounded mb-3 shadow">
                            <div class="card bg-light">
                                <div class="card-header fw-bold">User Status</div>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex justify-content-between"><span>Watching:</span> <strong>${data.stats.watching || 0}</strong></li>
                                    <li class="list-group-item d-flex justify-content-between"><span>Completed:</span> <strong>${data.stats.completed || 0}</strong></li>
                                    <li class="list-group-item d-flex justify-content-between"><span>On Hold:</span> <strong>${data.stats.on_hold || 0}</strong></li>
                                    <li class="list-group-item d-flex justify-content-between"><span>Dropped:</span> <strong class="text-danger">${data.stats.dropped || 0}</strong></li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-md-8">
                            <h5>Synopsis</h5>
                            <p class="text-secondary small">${data.animeData.synopsis || "No synopsis available."}</p>
                            <hr>
                            
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="mb-0">Score Stats</h5>
                                <span class="badge bg-primary">Total Votes: ${data.stats.total || 0}</span>
                            </div>
                            
                            <div class="p-3 border rounded bg-light">
                                ${renderScoreDistribution()}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-pane fade" id="cast">
                    <div class="row"><div class="col-12" style="max-height: 500px; overflow-y: auto;">${renderList(data.characters, 'char')}</div></div>
                </div>

                <div class="tab-pane fade" id="staff">
                    <div class="row"><div class="col-12" style="max-height: 500px; overflow-y: auto;">${renderList(data.staff, 'staff')}</div></div>
                </div>

            </div>
        `;
        modalBody.innerHTML = html;

    } catch (err) {
        console.error(err);
        modalBody.innerHTML = '<div class="alert alert-danger">Error loading details.</div>';
    }
}

// Helper: Color code the scores
function getScoreColor(score) {
    if (score >= 8) return 'success'; // Green
    if (score >= 5) return 'warning'; // Yellow
    return 'danger'; // Red
}