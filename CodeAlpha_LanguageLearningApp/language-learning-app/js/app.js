/**
 * --------------------------------------------------------------------------
 * LINGUAPRO CORE ENGINE
 * --------------------------------------------------------------------------
 */

// --- DATASET & CONFIG ---
const LANGUAGES = [
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt-PT', name: 'Portuguese', flag: '🇵🇹' }
];

const VOCAB_DATABASE = [
    // Greetings
    { id: 'g1', word: 'Hola', translation: 'Hello', example: 'Hola, ¿cómo estás?', category: 'Greetings', lang: 'es-ES' },
    { id: 'g2', word: 'Adiós', translation: 'Goodbye', example: 'Adiós, hasta mañana.', category: 'Greetings', lang: 'es-ES' },
    { id: 'g3', word: 'Por favor', translation: 'Please', example: 'Dos cafés, por favor.', category: 'Greetings', lang: 'es-ES' },
    { id: 'g4', word: 'Gracias', translation: 'Thank you', example: 'Muchas gracias por tu ayuda.', category: 'Greetings', lang: 'es-ES' },
    { id: 'g5', word: 'Lo siento', translation: 'Sorry', example: 'Lo siento, no entiendo.', category: 'Greetings', lang: 'es-ES' },
    { id: 'g6', word: 'Bonjour', translation: 'Hello', example: 'Bonjour, monsieur.', category: 'Greetings', lang: 'fr-FR' },
    { id: 'g7', word: 'Merci', translation: 'Thank you', example: 'Merci beaucoup.', category: 'Greetings', lang: 'fr-FR' },

    // Travel
    { id: 't1', word: 'Aeropuerto', translation: 'Airport', example: 'Vamos al aeropuerto en taxi.', category: 'Travel', lang: 'es-ES' },
    { id: 't2', word: 'El tren', translation: 'The train', example: 'El tren sale a las ocho.', category: 'Travel', lang: 'es-ES' },
    { id: 't3', word: 'Pasaporte', translation: 'Passport', example: 'Aquí está mi pasaporte.', category: 'Travel', lang: 'es-ES' },
    { id: 't4', word: 'La playa', translation: 'The beach', example: 'Me gusta caminar por la playa.', category: 'Travel', lang: 'es-ES' },
    { id: 't5', word: 'Hotel', translation: 'Hotel', example: 'El hotel está cerca del centro.', category: 'Travel', lang: 'es-ES' },

    // Food
    { id: 'f1', word: 'Agua', translation: 'Water', example: 'Quiero un vaso de agua.', category: 'Food', lang: 'es-ES' },
    { id: 'f2', word: 'Pan', translation: 'Bread', example: 'El pan está fresco.', category: 'Food', lang: 'es-ES' },
    { id: 'f3', word: 'Queso', translation: 'Cheese', example: 'Me gusta el queso manchego.', category: 'Food', lang: 'es-ES' },
    { id: 'f4', word: 'Cerveza', translation: 'Beer', example: 'Una cerveza fría, por favor.', category: 'Food', lang: 'es-ES' },
    { id: 'f5', word: 'Manzana', translation: 'Apple', example: 'La manzana es roja.', category: 'Food', lang: 'es-ES' },

    // Verbs
    { id: 'v1', word: 'Comer', translation: 'To eat', example: 'Vamos a comer ahora.', category: 'Verbs', lang: 'es-ES' },
    { id: 'v2', word: 'Dormir', translation: 'To sleep', example: 'Necesito dormir ocho horas.', category: 'Verbs', lang: 'es-ES' },
    { id: 'v3', word: 'Hablar', translation: 'To speak', example: 'Ellos hablan español.', category: 'Verbs', lang: 'es-ES' },

    // Placeholder mix for other langs to demo filtering
    { id: 'm1', word: 'Guten Tag', translation: 'Good day', example: 'Guten Tag, wie geht es Ihnen?', category: 'Greetings', lang: 'de-DE' },
    { id: 'm2', word: 'Grazie', translation: 'Thank you', example: 'Grazie mille.', category: 'Greetings', lang: 'it-IT' }
];

// --- STATE MANAGEMENT ---
class AppState {
    constructor() {
        this.load();
        if (!this.data.mastery) this.data.mastery = {};
    }

    load() {
        const stored = localStorage.getItem('LinguaProState');
        this.data = stored ? JSON.parse(stored) : {
            streak: 1,
            lastLogin: new Date().toDateString(),
            xp: 0,
            mastery: {} // wordId -> level (0-100)
        };

        // Streak Logic
        const today = new Date().toDateString();
        if (this.data.lastLogin !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (this.data.lastLogin === yesterday.toDateString()) {
                this.data.streak++;
            } else {
                // Reset if missed a day (simplified)
                // this.data.streak = 1; 
                // Keeping streak for demo purposes mainly
            }
            this.data.lastLogin = today;
            this.save();
        }
    }

    save() {
        localStorage.setItem('LinguaProState', JSON.stringify(this.data));
        this.updateUI();
    }

    addXP(amount) {
        this.data.xp += amount;
        this.save();
        this.triggerXPAnim();
    }

    updateMastery(wordId, delta) {
        const current = this.data.mastery[wordId] || 0;
        let next = current + delta;
        if (next > 100) next = 100;
        if (next < 0) next = 0;
        this.data.mastery[wordId] = next;
        this.save();
        return next;
    }

    updateUI() {
        document.getElementById('streak-counter').innerText = this.data.streak;
        document.getElementById('xp-counter').innerText = this.data.xp;

        // Guard against initialization race condition
        if (typeof window.app === 'undefined') return;

        // Calculate total mastery average
        const totalWords = VOCAB_DATABASE.filter(w => w.lang === window.app.currentLang).length;
        if (totalWords === 0) return;

        let totalScore = 0;
        let count = 0;
        VOCAB_DATABASE.forEach(w => {
            if (w.lang === window.app.currentLang) {
                totalScore += (this.data.mastery[w.id] || 0);
                count++;
            }
        });
        const avg = count ? Math.round(totalScore / count) : 0;
        document.getElementById('mastery-total-bar').style.width = `${avg}%`;
    }

    triggerXPAnim() {
        const el = document.getElementById('xp-counter');
        el.style.transform = 'scale(1.5)';
        el.style.color = '#fff';
        setTimeout(() => {
            el.style.transform = 'scale(1)';
            el.style.color = '';
        }, 300);
    }
}

// --- APP CONTROLLER ---
class LinguaApp {
    constructor() {
        this.state = new AppState();
        this.currentLang = 'es-ES';
        this.availableWords = []; // Filtered by language
        this.queue = []; // SRS Queue
        this.mode = 'flashcard'; // flashcard | quiz | pronounce
        this.currentIndex = 0;
        this.isFlipped = false;

        this.renderSidebar();
        this.filterContent();
        this.setMode('flashcard');

        // Bindings
        this.handleKeydown = this.handleKeydown.bind(this);
        document.addEventListener('keydown', this.handleKeydown);

        // Initial UI Update
        setTimeout(() => this.state.updateUI(), 0);
    }

    renderSidebar() {
        const list = document.getElementById('lang-list');
        list.innerHTML = LANGUAGES.map(l => `
            <div class="nav-item ${l.code === this.currentLang ? 'active' : ''}" 
                 onclick="app.switchLang('${l.code}')">
                <div style="display:flex; align-items:center; gap:0.5rem">
                    <span style="font-size:1.2rem">${l.flag}</span>
                    <span>${l.name}</span>
                </div>
            </div>
        `).join('');
        this.state.updateUI();
    }

    switchLang(code) {
        this.currentLang = code;
        this.filterContent();
        this.renderSidebar();
        this.setMode('flashcard');
    }

    filterContent() {
        // Get words for this lang
        this.availableWords = VOCAB_DATABASE.filter(w => w.lang === this.currentLang);

        // SRS SORTING: Put lowest mastery first (Simplified SRS)
        this.availableWords.sort((a, b) => {
            const mA = this.state.data.mastery[a.id] || 0;
            const mB = this.state.data.mastery[b.id] || 0;
            return mA - mB;
        });

        this.queue = [...this.availableWords];
        this.currentIndex = 0;
    }

    setMode(mode) {
        this.mode = mode;
        this.isFlipped = false;

        // Update tabs
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        // Find button by text mostly or onclick... simple fix:
        const map = { 'flashcard': 0, 'quiz': 1, 'pronounce': 2 };
        document.querySelectorAll('.tab-btn')[map[mode]].classList.add('active');

        this.renderStage();
    }

    renderStage() {
        try {
            const stage = document.getElementById('stage-content');
            if (this.queue.length === 0) {
                stage.innerHTML = `<div class="start-screen"><h3>No words available for this language yet!</h3></div>`;
                return;
            }

            const item = this.queue[this.currentIndex];
            if (!item) {
                stage.innerHTML = `<div class="start-screen"><h3>Error: Item not found at index ${this.currentIndex}</h3></div>`;
                return;
            }

            const mastery = this.state.data.mastery[item.id] || 0;

            if (this.mode === 'flashcard') {
                stage.innerHTML = `
                    <div class="card-scene">
                        <div class="card ${this.isFlipped ? 'flipped' : ''}" onclick="window.app.flipCard()">
                            <div class="card-face front">
                                <div class="card-category">${item.category}</div>
                                <div class="card-level">
                                    <div class="level-fill" style="width: ${mastery}%"></div>
                                </div>
                                <div class="word-display">${item.word}</div>
                                <div style="font-size: 3rem; opacity: 0.1">🇪🇸</div>
                                <div style="margin-top:2rem; font-size:0.9rem; color:var(--text-muted)">Tap or Space to Flip</div>
                            </div>
                            <div class="card-face back">
                                <div class="card-category" style="background:var(--primary); color:white">Translation</div>
                                <div class="word-display" style="font-size:2.5rem">${item.translation}</div>
                                <p class="example-sentence">"${item.example}"</p>
                                <button class="btn-audio" onclick="window.app.speak(event)">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="srs-controls">
                            <button class="srs-btn srs-hard" onclick="window.app.rateCard('hard')">Hard</button>
                            <button class="srs-btn srs-easy" onclick="window.app.rateCard('easy')">Easy</button>
                        </div>
                    </div>
                `;
            }
            else if (this.mode === 'quiz') {
                // Generate options
                let options = [item];

                // Try to get distractors from same language
                let pool = this.availableWords.filter(w => w.id !== item.id);

                // If not enough words in current lang, mix in words from other languages
                if (pool.length < 3) {
                    const others = VOCAB_DATABASE.filter(w => w.lang !== this.currentLang);
                    pool = [...pool, ...others];
                }

                // Shuffle pool and take 3
                const distractors = pool.sort(() => 0.5 - Math.random()).slice(0, 3);

                options = [...options, ...distractors].sort(() => 0.5 - Math.random());

                stage.innerHTML = `
                    <div class="quiz-container animate-pop">
                        <div class="quiz-question">how do you say <span style="color:var(--primary)">"${item.translation}"</span>?</div>
                        <div class="quiz-grid">
                            ${options.map(opt => `
                                <button class="quiz-btn" onclick="window.app.handleQuiz('${opt.id}', '${item.id}', this)">
                                    ${opt.word}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            else if (this.mode === 'pronounce') {
                stage.innerHTML = `
                    <div class="mic-container animate-pop" style="text-align:center">
                        <div style="font-size:1.5rem; color:var(--text-muted); margin-bottom:1rem">Say this word:</div>
                        <div class="word-display">${item.word}</div>
                        
                        <button class="mic-btn" id="mic-trigger" onclick="window.app.toggleListening('${item.word}')">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </button>
                        <div id="mic-status" style="height: 1.5rem; color: var(--text-muted)">Click to speak...</div>
                    </div>
                `;
            }
        } catch (e) {
            console.error(e);
            document.getElementById('stage-content').innerHTML = `<div class="start-screen" style="color:var(--error)"><h3>Application Error: ${e.message}</h3><pre>${e.stack}</pre></div>`;
        }
    }

    // --- ACTIONS ---
    flipCard() {
        this.isFlipped = !this.isFlipped;
        const card = document.querySelector('.card');
        if (card) {
            if (this.isFlipped) card.classList.add('flipped');
            else card.classList.remove('flipped');

            if (this.isFlipped) {
                // Auto speak on flip? Maybe annoying. Best manual.
            }
        }
    }

    speak(e) {
        if (e) e.stopPropagation();
        const item = this.queue[this.currentIndex];
        const u = new SpeechSynthesisUtterance(item.word);
        u.lang = item.lang;
        u.rate = 0.8;
        window.speechSynthesis.speak(u);
    }

    rateCard(rating) {
        const item = this.queue[this.currentIndex];
        if (rating === 'easy') {
            this.state.updateMastery(item.id, 20); // +20%
            this.state.addXP(10);
            triggerConfetti();
            // Move to next
            this.nextCard();
        } else {
            this.state.updateMastery(item.id, -10); // -10%
            // Keep card in queue or show feedback?
            // Simple SRS: Re-insert in queue 3 spots away
            const current = this.queue.splice(this.currentIndex, 1)[0];
            let newIdx = Math.min(this.currentIndex + 3, this.queue.length);
            this.queue.splice(newIdx, 0, current);

            // Reset view but stay on current index (which is now a new card)
            // Wait, if I splice, the current index now points to the next card essentially.
            this.isFlipped = false;
            this.renderStage();
        }
    }

    nextCard() {
        this.isFlipped = false;
        if (this.currentIndex < this.queue.length - 1) {
            this.currentIndex++;
        } else {
            // Start over or shuffle
            this.currentIndex = 0;
            // Optional: Reshuffle
        }
        this.renderStage();
    }

    handleQuiz(selectedId, correctId, btnElement) {
        if (btnElement.disabled) return;

        const buttons = document.querySelectorAll('.quiz-btn');
        buttons.forEach(b => b.disabled = true);

        if (selectedId === correctId) {
            btnElement.classList.add('correct');
            this.state.addXP(15);
            this.state.updateMastery(correctId, 10);
            triggerConfetti();
            setTimeout(() => this.nextCard(), 1500);
        } else {
            btnElement.classList.add('incorrect');
            btnElement.classList.add('animate-shake');
            // Show correct
            buttons.forEach(b => {
                if (b.innerText.trim() === VOCAB_DATABASE.find(v => v.id === correctId).word) {
                    b.classList.add('correct');
                }
            });
            setTimeout(() => this.nextCard(), 2000);
        }
    }

    // --- SPEECH RECOGNITION ---
    toggleListening(targetWord) {
        const Status = document.getElementById('mic-status');
        const Btn = document.getElementById('mic-trigger');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            Status.innerText = "Browser does not support Speech API.";
            Status.style.color = "var(--error)";
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = this.currentLang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();
        Btn.classList.add('listening');
        Status.innerText = "Listening...";

        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript.toLowerCase();
            const cleanTarget = targetWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            const cleanSpeech = speechResult.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

            if (cleanSpeech.includes(cleanTarget) || cleanTarget.includes(cleanSpeech)) {
                Status.innerText = `Perfect! You said: "${speechResult}"`;
                Status.style.color = "var(--success)";
                this.state.addXP(20);
                this.state.updateMastery(this.queue[this.currentIndex].id, 30);
                triggerConfetti();
                setTimeout(() => this.nextCard(), 2000);
            } else {
                Status.innerText = `Heard: "${speechResult}". Try again!`;
                Status.style.color = "var(--warning)";
            }
            Btn.classList.remove('listening');
        };

        recognition.onspeechend = () => {
            recognition.stop();
            Btn.classList.remove('listening');
        };

        recognition.onerror = (event) => {
            Status.innerText = "Error occurred in recognition: " + event.error;
            Btn.classList.remove('listening');
        };
    }

    handleKeydown(e) {
        if (e.code === 'Space') {
            if (this.mode === 'flashcard') this.flipCard();
        } else if (e.code === 'ArrowRight') {
            this.nextCard();
        } else if (e.code === 'KeyR') {
            if (this.mode === 'flashcard' && this.isFlipped) this.speak();
        }
    }
}

// --- CONFETTI ENGINE (Micro Lib) ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particles = [];

function triggerConfetti() {
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            life: 100,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }
}

function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vy += 0.5; // gravity
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    particles = particles.filter(p => p.life > 0);
    requestAnimationFrame(updateParticles);
}
updateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- INIT ---
// --- INIT ---
try {
    window.app = new LinguaApp();
} catch (e) {
    document.body.innerHTML = `<h1 style="color:red; padding:2rem">Startup Error: ${e.message}</h1><pre style="padding:2rem">${e.stack}</pre>`;
}
