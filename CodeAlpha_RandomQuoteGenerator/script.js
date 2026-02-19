/**
 * InspoStream - Quote Dashboard Logic
 * Fully functional Single Page Application (SPA) logic handling all side menu options.
 */

// I. Data Source
// -------------------------------------------------------------
const QUOTE_COLLECTION = [
    // --- WORK & SUCCESS ---
    { id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Work" },
    { id: 2, text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
    { id: 3, text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Belief" },
    { id: 4, text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "Persistence" },
    { id: 5, text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
    { id: 6, text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Work" },
    { id: 7, text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison", category: "Persistence" },
    { id: 8, text: "Quality is not an act, it is a habit.", author: "Aristotle", category: "Work" },
    { id: 9, text: "Opportunities don't happen, you create them.", author: "Chris Grosser", category: "Success" },
    { id: 10, text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "Work" },
    { id: 11, text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs", category: "Work" },

    // --- MINDSET & WISDOM ---
    { id: 12, text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford", category: "Mindset" },
    { id: 13, text: "Act as if what you do makes a difference. It does.", author: "William James", category: "Impact" },
    { id: 14, text: "What we achieve inwardly will change outer reality.", author: "Plutarch", category: "Mindset" },
    { id: 15, text: "Limit your 'always' and your 'nevers'.", author: "Amy Poehler", category: "Wisdom" },
    { id: 16, text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "Happiness" },
    { id: 17, text: "Change your thoughts and you change your world.", author: "Norman Vincent Peale", category: "Mindset" },
    { id: 18, text: "It is never too late to be what you might have been.", author: "George Eliot", category: "Possibility" },
    { id: 19, text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Belief" },
    { id: 20, text: "Everything has beauty, but not everyone sees it.", author: "Confucius", category: "Wisdom" },
    { id: 21, text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "Wisdom" },

    // --- COURAGE & ACTION ---
    { id: 22, text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "Courage" },
    { id: 23, text: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats", category: "Action" },
    { id: 24, text: "Dream big and dare to fail.", author: "Norman Vaughan", category: "Ambition" },
    { id: 25, text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: "Action" },
    { id: 26, text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee", category: "Focus" },
    { id: 27, text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Courage" },
    { id: 28, text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Action" },

    // --- RUMI (Poetry/Soul) ---
    { id: 29, text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi", category: "Wisdom" },
    { id: 30, text: "Don’t be satisfied with stories, how things have gone with others. Unfold your own myth.", author: "Rumi", category: "Individuality" },
    { id: 31, text: "Everything that is made beautiful and fair and lovely is made for the eye of one who sees.", author: "Rumi", category: "Beauty" },
    { id: 32, text: "Raise your words, not voice. It is rain that grows flowers, not thunder.", author: "Rumi", category: "Wisdom" },

    // --- EINSTEIN (Intellect) ---
    { id: 33, text: "Imagination is more important than knowledge.", author: "Albert Einstein", category: "Creativity" },
    { id: 34, text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein", category: "Value" },
    { id: 35, text: "Life is like riding a bicycle. To keep your balance, you must keep moving.", author: "Albert Einstein", category: "Life" },

    // --- MODERN & POP CULTURE ---
    { id: 36, text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "Authenticity" },
    { id: 37, text: "So many books, so little time.", author: "Frank Zappa", category: "Life" },
    { id: 38, text: "If you tell the truth, you don't have to remember anything.", author: "Mark Twain", category: "Truth" },
    { id: 39, text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche", category: "Art" },
    { id: 40, text: "We accept the love we think we deserve.", author: "Stephen Chbosky", category: "Love" }
];

// II. State
// -------------------------------------------------------------
const state = {
    currentView: 'home',
    lastQuoteIndex: -1,
    history: [],
    favorites: [], // Stores IDs of favorite quotes
    currentQuote: null
};

// III. DOM Selection
// -------------------------------------------------------------
const getDOM = () => ({
    navItems: document.querySelectorAll('.nav-item'),
    sections: document.querySelectorAll('.view-section'),

    // Home View Elements
    quoteText: document.getElementById('quote-text'),
    quoteAuthor: document.getElementById('quote-author'),
    likeBtn: document.getElementById('hero-like-btn'),
    shareBtn: document.getElementById('hero-share-btn'),
    likeCount: document.getElementById('like-count'),
    newQuoteBtn: document.getElementById('sidebar-new-quote-btn'),
    heroSection: document.querySelector('.hero-section'),
    historyList: document.getElementById('history-list'),

    // Other View Containers
    favoritesList: document.getElementById('favorites-list'),
    discoverGrid: document.getElementById('discover-grid'),
    authorsGrid: document.getElementById('authors-grid'),
    collectionsGrid: document.getElementById('collections-grid'),

    // Filtered View Elements
    filteredSection: document.getElementById('view-filtered'),
    filteredTitle: document.getElementById('filtered-title'),
    filteredGrid: document.getElementById('filtered-grid'),
    backBtn: document.getElementById('back-btn'),

    // Sidebar Dynamic Elements
    trendingAuthorsList: document.getElementById('trending-authors-list'),
    suggestedQuoteText: document.getElementById('suggested-quote-text'),
    suggestedQuoteAuthor: document.getElementById('suggested-quote-author'),
    searchInput: document.getElementById('search-input'),

    // Share Modal Elements
    shareModal: document.getElementById('share-modal'),
    closeModalBtn: document.getElementById('close-modal'),
    sharePreview: document.getElementById('share-preview'),
    shareX: document.getElementById('share-x'),
    shareWhatsapp: document.getElementById('share-whatsapp'),
    shareCopy: document.getElementById('share-copy'),
    shareNative: document.getElementById('share-native'),

    // Settings Elements
    settingsBtn: document.getElementById('settings-btn'),
    settingsDropdown: document.getElementById('settings-dropdown'),
    themeToggle: document.getElementById('theme-toggle')
});

// IV. Core Logic
// -------------------------------------------------------------

/**
 * Switch Views logic
 */
function switchView(targetId) {
    const DOM = getDOM();

    // Update State
    state.currentView = targetId;

    // UI: Update Nav Active State
    DOM.navItems.forEach(item => {
        if (item.dataset.target === targetId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // UI: Toggle Sections
    DOM.sections.forEach(section => {
        if (section.id === `view-${targetId}`) {
            section.classList.remove('hidden');
            if (targetId === 'favorites') renderFavoritesView();
            if (targetId === 'discover') renderDiscoverView();
            if (targetId === 'authors') renderAuthorsView();
            if (targetId === 'collections') renderCollectionsView();
        } else {
            section.classList.add('hidden');
        }
    });

    // Special handling for filtered view
    if (targetId === 'filtered') {
        DOM.filteredSection.classList.remove('hidden');
    } else {
        DOM.filteredSection.classList.add('hidden');
    }
}

/**
 * Home View Logic
 */
function generateQuote() {
    const DOM = getDOM();
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * QUOTE_COLLECTION.length);
    } while (randomIndex === state.lastQuoteIndex && QUOTE_COLLECTION.length > 1);

    state.lastQuoteIndex = randomIndex;
    state.currentQuote = QUOTE_COLLECTION[randomIndex];

    DOM.quoteText.textContent = `"${state.currentQuote.text}"`;
    DOM.quoteAuthor.textContent = state.currentQuote.author;

    updateLikeButtonState();

    const hue1 = (state.currentQuote.id * 50) % 360;
    const hue2 = (hue1 + 40) % 360;
    DOM.heroSection.style.background = `linear-gradient(135deg, hsl(${hue1}, 70%, 50%) 0%, hsl(${hue2}, 80%, 60%) 100%)`;

    addToHistory(state.currentQuote);
}

function updateLikeButtonState() {
    const DOM = getDOM();
    const isFav = state.favorites.includes(state.currentQuote.id);
    const icon = DOM.likeBtn.querySelector('i');

    if (isFav) {
        icon.classList.remove('ph');
        icon.classList.add('ph-fill');
        icon.style.color = 'white';
        DOM.likeCount.textContent = "Saved";
    } else {
        icon.classList.remove('ph-fill');
        icon.classList.add('ph');
        icon.style.color = 'white';
        DOM.likeCount.textContent = "Save";
    }
}

function toggleLike() {
    if (!state.currentQuote) return;

    const id = state.currentQuote.id;
    if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(favId => favId !== id);
    } else {
        state.favorites.push(id);
    }
    updateLikeButtonState();

    if (state.currentView === 'favorites') renderFavoritesView();
}

function toggleShareModal(show) {
    const DOM = getDOM();
    if (show) {
        DOM.shareModal.classList.remove('hidden');
        prepareShareOptions();
    } else {
        DOM.shareModal.classList.add('hidden');
    }
}

function prepareShareOptions() {
    const DOM = getDOM();
    if (!state.currentQuote) return;

    const text = `"${state.currentQuote.text}" — ${state.currentQuote.author}`;
    const url = window.location.href; // Or your deployed URL

    // Update Preview
    DOM.sharePreview.textContent = text;

    // 1. X (Twitter)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    DOM.shareX.href = twitterUrl;

    // 2. WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    DOM.shareWhatsapp.href = whatsappUrl;

    // 3. Copy Text
    DOM.shareCopy.onclick = () => {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = DOM.shareCopy.innerHTML;
            DOM.shareCopy.innerHTML = `<i class="ph ph-check"></i> Copied!`;
            setTimeout(() => { DOM.shareCopy.innerHTML = originalHTML; }, 2000);
        });
    };

    // 4. Native Share (if supported)
    if (navigator.share) {
        DOM.shareNative.classList.remove('hidden');
        DOM.shareNative.onclick = () => {
            navigator.share({
                title: 'InspoStream Quote',
                text: text,
                url: url
            });
        };
    }
}

function shareQuote() {
    toggleShareModal(true);
}

function addToHistory(quote) {
    state.history.unshift(quote);
    if (state.history.length > 5) state.history.pop();
    renderHistoryList();
}

function renderHistoryList() {
    const DOM = getDOM();
    DOM.historyList.innerHTML = '';

    state.history.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'list-item';
        row.innerHTML = `
            <span class="col-1 index">${index + 1}</span>
            <div class="col-2 info">
                <span class="item-title">"${item.text.substring(0, 30)}..."</span>
            </div>
            <span class="col-3 item-sub">${item.author}</span>
            <span class="col-4 item-sub">${item.category}</span>
            <span class="col-5"></span>
        `;
        DOM.historyList.appendChild(row);
    });
}

function renderFavoritesView() {
    const DOM = getDOM();
    DOM.favoritesList.innerHTML = '';

    if (state.favorites.length === 0) {
        DOM.favoritesList.innerHTML = '<div style="padding:2rem; text-align:center; color:#666;">No favorites saved yet. Go back to Home and click the Heart icon!</div>';
        return;
    }

    const favQuotes = QUOTE_COLLECTION.filter(q => state.favorites.includes(q.id));

    favQuotes.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'list-item';
        row.innerHTML = `
            <span class="col-1 index">${index + 1}</span>
            <div class="col-2 info">
                <span class="item-title">"${item.text}"</span>
            </div>
            <span class="col-3 item-sub">${item.author}</span>
            <span class="col-4 item-sub">${item.category}</span>
            <span class="col-5 action"><i class="ph-fill ph-heart" style="color: #ff4b1f;"></i></span>
        `;
        DOM.favoritesList.appendChild(row);
    });
}

function renderDiscoverView() {
    const DOM = getDOM();
    DOM.discoverGrid.innerHTML = '';

    QUOTE_COLLECTION.forEach(item => {
        const card = document.createElement('div');
        card.className = 'grid-card';
        card.innerHTML = `
            <h3>${item.category}</h3>
            <p>"${item.text}"</p>
            <div style="margin-top:10px; font-size:0.8rem; color:#888;">- ${item.author}</div>
        `;
        DOM.discoverGrid.appendChild(card);
    });
}

function renderAuthorsView() {
    const DOM = getDOM();
    DOM.authorsGrid.innerHTML = '';

    // Sort authors alphabetically
    const authors = [...new Set(QUOTE_COLLECTION.map(q => q.author))].sort();

    authors.forEach(author => {
        const card = document.createElement('div');
        card.className = 'author-card';
        const color = `hsl(${Math.random() * 360}, 60%, 40%)`;
        card.innerHTML = `
            <div class="author-avatar" style="background:${color}; color:white;">
                ${author.charAt(0)}
            </div>
            <h3 style="color:white; font-size:1rem;">${author}</h3>
            <p style="color:#888; font-size:0.8rem;">Author</p>
        `;
        card.addEventListener('click', () => {
            showFilteredQuotes(`Quotes by ${author}`, (q) => q.author === author);
        });
        DOM.authorsGrid.appendChild(card);
    });
}

function renderCollectionsView() {
    const DOM = getDOM();
    DOM.collectionsGrid.innerHTML = '';

    const categories = [...new Set(QUOTE_COLLECTION.map(q => q.category))].sort();

    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        const angle = Math.floor(Math.random() * 360);
        const color1 = `hsl(${Math.random() * 360}, 60%, 50%)`;
        const color2 = `hsl(${Math.random() * 360}, 60%, 50%)`;
        card.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

        card.innerHTML = `<span>${cat}</span>`;
        card.addEventListener('click', () => {
            showFilteredQuotes(`${cat} Collection`, (q) => q.category === cat);
        });
        DOM.collectionsGrid.appendChild(card);
    });
}

function showFilteredQuotes(title, filterFn) {
    const DOM = getDOM();
    switchView('filtered');
    DOM.filteredTitle.textContent = title;

    const filteredQuotes = QUOTE_COLLECTION.filter(filterFn);

    DOM.filteredGrid.innerHTML = '';
    if (filteredQuotes.length === 0) {
        DOM.filteredGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:#666;">No quotes found.</div>';
        return;
    }

    filteredQuotes.forEach(item => {
        const card = document.createElement('div');
        card.className = 'grid-card';
        card.innerHTML = `
            <h3>${item.category}</h3>
            <p>"${item.text}"</p>
            <div style="margin-top:10px; font-size:0.8rem; color:#888;">- ${item.author}</div>
        `;
        DOM.filteredGrid.appendChild(card);
    });

    DOM.backBtn.onclick = () => {
        if (title.includes('Collection')) {
            switchView('collections');
        } else if (title.includes('Search')) {
            switchView('discover'); // Go back to discover or home
        } else {
            switchView('authors');
        }
    };
}

// V. NEW FUNCTIONALITY: Sidebar Logic & Search
// -------------------------------------------------------------

function renderTrendingAuthors() {
    const DOM = getDOM();
    DOM.trendingAuthorsList.innerHTML = '';

    // Count quotes per author
    const authorCounts = {};
    QUOTE_COLLECTION.forEach(q => {
        authorCounts[q.author] = (authorCounts[q.author] || 0) + 1;
    });

    // Sort by count desc and take top 3
    const topAuthors = Object.entries(authorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);

    topAuthors.forEach((author, index) => {
        const card = document.createElement('div');
        card.className = 'mini-card';
        card.innerHTML = `
            <div class="card-img gradient-${index + 1}" style="background: linear-gradient(45deg, hsl(${Math.random() * 360},70%,50%), hsl(${Math.random() * 360},70%,50%))"></div>
            <span>${author}</span>
        `;

        // Make clickable
        card.addEventListener('click', () => {
            showFilteredQuotes(`Trending: ${author}`, (q) => q.author === author);
        });

        DOM.trendingAuthorsList.appendChild(card);
    });
}

function renderSuggestedQuote() {
    const DOM = getDOM();
    // Pick a random quote distinct from current hero if possible
    let suggested;
    do {
        suggested = QUOTE_COLLECTION[Math.floor(Math.random() * QUOTE_COLLECTION.length)];
    } while (state.currentQuote && suggested.id === state.currentQuote.id);

    DOM.suggestedQuoteText.textContent = `"${suggested.text}"`;
    DOM.suggestedQuoteAuthor.textContent = `- ${suggested.author}`;
}

function handleSearch(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase().trim();
        if (!query) return;

        showFilteredQuotes(`Search: "${query}"`, (q) =>
            q.text.toLowerCase().includes(query) ||
            q.author.toLowerCase().includes(query) ||
            q.category.toLowerCase().includes(query)
        );

        e.target.value = ''; // Clear input
    }
}

// VI. SETTINGS & THEME LOGIC
// -------------------------------------------------------------
function toggleSettings() {
    const DOM = getDOM();
    DOM.settingsDropdown.classList.toggle('hidden');
}

function toggleTheme(e) {
    if (e.target.checked) {
        document.body.removeAttribute('data-theme'); // Dark Mode (Default)
    } else {
        document.body.setAttribute('data-theme', 'light'); // Light Mode
    }
}

// VII. Initialization
// -------------------------------------------------------------
function init() {
    const DOM = getDOM();

    DOM.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.dataset.target;
            if (target) switchView(target);
        });
    });

    DOM.newQuoteBtn.addEventListener('click', () => {
        switchView('home');
        generateQuote();
    });

    DOM.likeBtn.addEventListener('click', toggleLike);
    DOM.shareBtn.addEventListener('click', shareQuote);
    DOM.closeModalBtn.addEventListener('click', () => toggleShareModal(false));

    // Close modal on outside click
    DOM.shareModal.addEventListener('click', (e) => {
        if (e.target === DOM.shareModal) toggleShareModal(false);
    });

    // Settings Listeners
    DOM.settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSettings();
    });

    DOM.themeToggle.addEventListener('change', toggleTheme);

    // Close settings on outside click
    document.addEventListener('click', (e) => {
        if (DOM.settingsDropdown && !DOM.settingsDropdown.contains(e.target) && e.target !== DOM.settingsBtn) {
            DOM.settingsDropdown.classList.add('hidden');
        }
    });

    // Search Listener
    DOM.searchInput.addEventListener('keypress', handleSearch);

    // Initial Render
    generateQuote();
    renderTrendingAuthors();
    renderSuggestedQuote();
}

document.addEventListener('DOMContentLoaded', init);
