document.addEventListener('DOMContentLoaded', () => {
    initAudioEngine();
    renderCurriculum();
    setupNavigation();
    setupProtection();
    initAttendance();
});

// Content Protection
function setupProtection() {
    const overlay = document.getElementById('protection-overlay');
    document.addEventListener('contextmenu', e => { e.preventDefault(); showProtectionMessage(); });
    document.addEventListener('copy', e => { e.preventDefault(); showProtectionMessage(); });
    document.addEventListener('cut', e => { e.preventDefault(); showProtectionMessage(); });
    if (overlay) overlay.addEventListener('click', () => overlay.style.display = 'none');
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && ['c','p','s','u'].includes(e.key) || e.key === 'F12') {
            e.preventDefault(); showProtectionMessage();
        }
    });
}
function showProtectionMessage() {
    const overlay = document.getElementById('protection-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.style.display = 'none', 3000);
    }
}

let currentUnitIndex = 0;
function setupNavigation() {
    document.querySelectorAll('.unit-block').forEach((block, index) => {
        block.addEventListener('toggle', () => { if (block.open) currentUnitIndex = index; });
    });
}

window.navigateUnit = function (direction) {
    const unitBlocks = document.querySelectorAll('.unit-block');
    const totalUnits = unitBlocks.length;
    if (unitBlocks[currentUnitIndex]) unitBlocks[currentUnitIndex].open = false;
    currentUnitIndex = (currentUnitIndex + direction + totalUnits) % totalUnits;
    if (unitBlocks[currentUnitIndex]) {
        unitBlocks[currentUnitIndex].open = true;
        unitBlocks[currentUnitIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

let currentLevel = 'A1';
window.switchLevel = function (level) {
    currentLevel = level;
    ['A1', 'A2'].forEach(l => {
        const tab = document.getElementById('tab-' + l.toLowerCase());
        if (tab) {
            tab.classList.toggle('active', l === level);
            tab.setAttribute('aria-selected', l === level ? 'true' : 'false');
        }
    });
    window.stopAudio();
    renderCurriculum();
};

function renderCurriculum() {
    const container = document.getElementById('curriculum-container');
    if (!container) return;
    container.innerHTML = '';
    
    let allUnits = [];
    if (typeof dataPart1 !== 'undefined') allUnits = allUnits.concat(dataPart1.units);
    if (typeof dataPart2 !== 'undefined') allUnits = allUnits.concat(dataPart2.units);
    if (typeof dataPart3 !== 'undefined') allUnits = allUnits.concat(dataPart3.units);
    if (typeof dataPart4 !== 'undefined') allUnits = allUnits.concat(dataPart4.units);

    const filteredUnits = allUnits.filter(u => u.level === currentLevel);

    filteredUnits.forEach(unit => {
        const unitBlock = document.createElement('details');
        unitBlock.className = 'unit-block';
        unitBlock.innerHTML = `
            <summary class="unit-header">
                <div>
                    <span class="unit-subtitle">Unit ${unit.id}</span>
                    <span class="unit-title">${unit.title}</span>
                </div>
            </summary>
            <div class="unit-body">
                <p style="opacity: 0.7; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">Topic: ${unit.topic}</p>
                
                <!-- 1. Vocabulary -->
                ${unit.vocabulary ? `
                <div class="section-block">
                    <span class="section-label" style="background: rgba(255,255,255,0.1); color: #fff;">Vocabulary</span>
                    <h3>Key Terms</h3>
                    <div class="vocab-grid">
                        ${unit.vocabulary.map(v => `
                            <div class="vocab-card">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <button class="play-btn" style="width: 32px; height: 32px; font-size: 0.9rem;" onclick="playAudio('${v.word.replace(/'/g, "\\'")}')">🔊</button>
                                    <strong style="font-size: 1.1rem;">${v.word}</strong>
                                </div>
                                ${v.ipa ? `<p style="font-family: monospace; color: var(--accent-gold); font-size: 0.95rem;">/${v.ipa}/</p>` : ''}
                                <p style="opacity: 0.8;">${v.def}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}

                <!-- 2. Listening -->
                ${unit.listening ? `
                <div class="section-block">
                    <span class="section-label listening">Listening</span>
                    <h3>${unit.listening.title}</h3>
                    <div class="player-controls">
                        <button class="play-btn" onclick="playAudio('${unit.listening.transcript.replace(/'/g, "\\'")}')">▶</button>
                    </div>
                    <button class="btn" onclick="toggleTranscript(this)">Show Transcript</button>
                    <div class="transcript-box" style="display:none; margin-top:10px;">${unit.listening.transcript}</div>
                    ${renderQuiz(unit.listening.questions)}
                </div>` : ''}

                <!-- 3. Reading -->
                ${unit.reading ? `
                <div class="section-block">
                    <span class="section-label reading">Reading</span>
                    <h3>${unit.reading.title}</h3>
                    <div class="reading-text">${unit.reading.text}</div>
                    ${renderQuiz(unit.reading.questions)}
                </div>` : ''}

                <!-- 4. Grammar -->
                ${unit.grammar ? `
                <div class="section-block">
                    <span class="section-label grammar">Grammar</span>
                    <h3>${unit.grammar.title}</h3>
                    <div class="grammar-box">
                        <p>${unit.grammar.explanation}</p>
                        <p style="font-family:monospace; color:var(--accent-gold);">Ex: ${unit.grammar.example}</p>
                    </div>
                    ${unit.grammar.quizzes ? renderQuiz(unit.grammar.quizzes, true) : ''}
                </div>` : ''}

                <!-- 5. Verb Patterns -->
                ${unit.verb_patterns ? `
                <div class="section-block">
                    <span class="section-label" style="background: rgba(167, 139, 250, 0.2); color: #a78bfa;">Verb Patterns</span>
                    <h3>Verbs + Gerund / Infinitive</h3>
                    <div class="theory-box">
                        <h4>📚 Verb Patterns Theory</h4>
                        <p>In English, some verbs are followed by <strong>gerunds (-ing)</strong>, some by <strong>infinitives (to + verb)</strong>, and some can take <strong>both</strong>.</p>
                    </div>
                    ${renderQuiz(unit.verb_patterns.exercises, true)}
                </div>` : ''}

                <!-- 6. Pronunciation -->
                ${unit.pronunciation ? `
                <div class="section-block">
                    <span class="section-label pronunciation">Pronunciation</span>
                    <h3>Word & Sentence Stress</h3>
                    
                    ${unit.pronunciation.word_stress ? `
                    <h4 style="margin: 20px 0 15px; color: var(--accent-gold);">Word Stress</h4>
                    ${unit.pronunciation.word_stress.map((item, idx) => {
                        const cleanWord = item.word.replace(/-/g, '').toLowerCase().replace(/[A-Z]/g, c => c.toLowerCase());
                        return `
                        <div style="margin-bottom: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                                <button class="play-btn" style="width: 40px; height: 40px; font-size: 1rem;" onclick="playAudio('${cleanWord}')">🔊</button>
                                <p style="font-weight: 600; margin: 0;">${idx + 1}. ${item.word}</p>
                            </div>
                            <div class="options-grid">
                                ${item.syllables.map((syl, i) => `
                                    <button class="btn" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.3); text-transform: uppercase;" 
                                    onclick="checkAnswer(this, ${i === item.correct})">${syl}</button>
                                `).join('')}
                            </div>
                        </div>`
                    }).join('')}` : ''}
                    
                    ${unit.pronunciation.sentence_stress ? `
                    <h4 style="margin: 30px 0 15px; color: var(--accent-gold);">Sentence Stress</h4>
                    ${unit.pronunciation.sentence_stress.map((item, idx) => `
                        <div style="margin-bottom: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px;">
                            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                                <button class="play-btn" style="width: 40px; height: 40px; font-size: 1rem;" onclick="playAudio('${item.sentence.replace(/'/g, "\\'")}')">🔊</button>
                                <p style="font-size: 1.2rem; font-style: italic; margin: 0;">"${item.sentence}"</p>
                            </div>
                            <p style="font-size: 0.9rem; color: var(--accent-gold);"><strong>Stressed words:</strong> ${item.stressed.join(', ')}</p>
                        </div>
                    `).join('')}` : ''}
                </div>` : ''}

                <!-- 7. Collocations -->
                ${unit.collocations ? `
                <div class="section-block">
                    <span class="section-label collocation">Collocations</span>
                    <div style="display: grid; gap: 20px;">
                    ${unit.collocations.map(col => `
                        <div class="collo-box">
                            <div class="word-slot" style="font-size: 1.5rem;">
                                ${col.pair[0]} <span class="blank">______</span>
                            </div>
                            <p style="margin-bottom: 10px; opacity: 0.6;">"${col.context.replace(col.pair[1], '______')}"</p>
                            <div class="options-grid" style="justify-content: center;">
                                ${(() => {
                                    const opts = [col.pair[1], ...col.distractors].sort(() => Math.random() - 0.5);
                                    return opts.map(opt => `
                                        <button class="btn" style="background:rgba(255,255,255,0.1);" 
                                        onclick="checkCollocation(this, '${opt}', '${col.pair[1]}')">${opt}</button>
                                    `).join('');
                                })()}
                            </div>
                        </div>
                    `).join('')}
                    </div>
                </div>` : ''}

                <!-- 8. Writing -->
                ${unit.writing ? `
                <div class="section-block">
                    <span class="section-label" style="background: rgba(255, 100, 100, 0.2); color: #ffadad;">Writing Task</span>
                    <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px;">
                        <p style="font-style: italic; margin-bottom: 15px;">Target: 100 words</p>
                        <h4 style="margin-bottom: 10px;">${unit.writing}</h4>
                        <textarea style="width: 100%; height: 150px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px; border-radius: 8px; font-family: inherit;" placeholder="Type your text here..."></textarea>
                    </div>
                </div>` : ''}

                <!-- 9. Speaking -->
                ${unit.speaking ? `
                <div class="section-block">
                    <span class="section-label" style="background: rgba(255, 200, 50, 0.2); color: #ffe066;">Speaking</span>
                    <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px; display: flex; align-items: center; gap: 20px;">
                        <span style="font-size: 2rem;">🎙️</span>
                        <div>
                            <h4>Discussion Prompt</h4>
                            <p>${unit.speaking}</p>
                        </div>
                    </div>
                </div>` : ''}

                <!-- 10. Videos -->
                ${unit.videos && unit.videos.length > 0 ? `
                <div class="section-block">
                    <span class="section-label" style="background: rgba(255, 0, 0, 0.2); color: #ff6b6b;">📺 Videos</span>
                    <h3>Recommended Videos</h3>
                    <div style="display: grid; gap: 15px;">
                        ${unit.videos.map(video => `
                            <a href="${video.url}" target="_blank" rel="noopener noreferrer" 
                               style="display: flex; align-items: center; gap: 15px; background: rgba(0,0,0,0.2); padding: 15px 20px; border-radius: 12px; text-decoration: none; color: #fff; border: 1px solid rgba(255,255,255,0.1);">
                                <span style="font-size: 2rem;">▶️</span>
                                <div>
                                    <h4 style="margin: 0 0 5px 0; color: var(--accent-gold);">${video.title}</h4>
                                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.7;">${video.channel} • ${video.duration}</p>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>` : ''}

            </div>
        `;
        container.appendChild(unitBlock);
    });
    setupNavigation();
}

function renderQuiz(questions, isGrammar = false) {
    if (!questions) return '';
    return `<div style="margin-top: 20px;">
        ${questions.map((q, i) => `
            <div style="margin-bottom: 15px;">
                <p style="font-weight: 500;">${isGrammar ? (i+1)+'.' : 'Q:'} ${q.question || q.q || q.sentence}</p>
                <div class="options-grid">
                    ${q.options.map((opt, oIdx) => `
                        <button class="btn" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);" 
                        onclick="checkAnswer(this, ${oIdx === q.correct})">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </div>`;
}

window.toggleTranscript = btn => {
    const box = btn.nextElementSibling;
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
    btn.textContent = box.style.display === 'none' ? 'Show Transcript' : 'Hide Transcript';
};

window.checkAnswer = (btn, isCorrect) => {
    Array.from(btn.parentElement.children).forEach(b => { b.style.background = 'rgba(255,255,255,0.05)'; b.style.borderColor = 'rgba(255,255,255,0.1)'; b.style.color = 'inherit'; });
    if (isCorrect) { btn.style.background = 'rgba(16, 185, 129, 0.2)'; btn.style.borderColor = '#10b981'; btn.style.color = '#fff'; }
    else { btn.style.background = 'rgba(239, 68, 68, 0.2)'; btn.style.borderColor = '#ef4444'; }
};

window.checkCollocation = (btn, selected, correct) => {
    const parent = btn.closest('.collo-box');
    const blank = parent.querySelector('.blank');
    const buttons = parent.querySelectorAll('button');
    if (selected === correct) {
        blank.textContent = correct; blank.style.color = '#34d399'; blank.style.borderBottom = 'none';
        btn.style.background = '#34d399'; btn.style.color = '#fff';
        buttons.forEach(b => b.disabled = true);
    } else {
        btn.style.background = '#ef4444';
        setTimeout(() => { btn.style.background = 'rgba(255,255,255,0.1)'; }, 500);
    }
};

// AUDIO ENGINE (SpeechSynthesis)
let audioQueue = [], isPlaying = false, isPaused = false, voices = [];

function initAudioEngine() {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => { voices = window.speechSynthesis.getVoices(); };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

window.playAudio = function (text) {
    if (!text || !('speechSynthesis' in window)) return;
    window.stopAudio();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; 
    utterance.pitch = 1.0;
    
    // Choose best US voice
    const usVoices = voices.filter(v => v.lang.toLowerCase().includes('en-us'));
    if (usVoices.length > 0) utterance.voice = usVoices.find(v => v.name.includes('Google')) || usVoices[0];
    
    window.speechSynthesis.speak(utterance);
    isPlaying = true;
};

window.stopAudio = function () {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isPlaying = isPaused = false;
};

window.togglePauseAudio = function () {
    if (!('speechSynthesis' in window)) return;
    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        document.getElementById('pause-audio-btn').innerHTML = '⏸️ Pause';
    } else if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        document.getElementById('pause-audio-btn').innerHTML = '▶️ Resume';
    }
};

// Attendance
function initAttendance() {
    const d = document.getElementById('att-date');
    if (d) d.value = new Date().toISOString().substr(0,10);
}
window.saveAttendance = function () {
    alert("Attendance saved!");
};
