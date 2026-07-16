document.addEventListener('DOMContentLoaded', () => {
    initSettings();
    initAudioEngine();
    renderCurriculum();
    setupNavigation();
    setupProtection();
    initAttendance();
    loadSettings();
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
                    ${Array.isArray(unit.grammar) ? unit.grammar.map(g => `
                        <div style="margin-bottom: 25px; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 15px;">
                            <h3>${g.title}</h3>
                            <div class="grammar-box">
                                <p>${g.explanation}</p>
                                <p style="font-family:monospace; color:var(--accent-gold);">Ex: ${g.example}</p>
                            </div>
                            ${g.quizzes ? renderQuiz(g.quizzes, true) : ''}
                        </div>
                    `).join('') : `
                        <h3>${unit.grammar.title}</h3>
                        <div class="grammar-box">
                            <p>${unit.grammar.explanation}</p>
                            <p style="font-family:monospace; color:var(--accent-gold);">Ex: ${unit.grammar.example}</p>
                        </div>
                        ${unit.grammar.quizzes ? renderQuiz(unit.grammar.quizzes, true) : ''}
                    `}
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
                        <textarea class="writing-input" style="width: 100%; height: 150px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px; border-radius: 8px; font-family: inherit;" placeholder="Type your text here..."></textarea>
                        <button class="btn" style="margin-top: 15px; background: #25D366; color: white; border-color: #25D366;" onclick="sendWritingToTeacher(this, 'Unit ${unit.id}', \`${unit.title}\`)">
                            📱 Send to Teacher via WhatsApp
                        </button>
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
                            <button class="btn" style="margin-top: 10px; background: #25D366; color: white; border-color: #25D366;" onclick="sendSpeakingToTeacher('Unit ${unit.id}', \`${unit.title}\`, \`${unit.speaking.replace(/"/g, "'")}\`)">
                                📱 I'm ready to record via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>` : ''}

                <!-- 10. Progress Test -->
                ${unit.progress_test ? `
                <div class="section-block" style="border: 2px solid #00c8ff; background: rgba(0, 200, 255, 0.05);">
                    <span class="section-label" style="background: rgba(0, 200, 255, 0.2); color: #00c8ff;">Progress Test 📝</span>
                    <h3>${unit.progress_test.title}</h3>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #fff;">${unit.progress_test.description}</p>
                    </div>
                    ${renderQuiz(unit.progress_test.quizzes)}
                </div>` : ''}

                <!-- 11. Videos -->
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

// AUDIO ENGINE (Universal TTS)
let currentAudio = null;
let audioChunks = [];
let currentChunkIndex = 0;
let isPlaying = false;
let isPaused = false;
let voices = [];

function initAudioEngine() {
    if ('speechSynthesis' in window) {
        const loadVoices = () => { voices = window.speechSynthesis.getVoices(); };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
}

window.playAudio = function (text) {
    if (!text) return;
    window.stopAudio();
    
    // Split text into chunks because Google TTS has a ~200 character limit
    // Split by sentence delimiters like . ! ?
    audioChunks = text.match(/[^.!?]+[.!?]*/g) || [text];
    currentChunkIndex = 0;
    
    playNextAudioChunk();
};

function playNextAudioChunk() {
    if (currentChunkIndex >= audioChunks.length) {
        isPlaying = false;
        return;
    }
    
    let chunk = audioChunks[currentChunkIndex].trim();
    if (!chunk) {
        currentChunkIndex++;
        playNextAudioChunk();
        return;
    }
    
    isPlaying = true;
    isPaused = false;
    
    // Use Google Translate TTS for high-quality, universal American pronunciation
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en-US&q=${encodeURIComponent(chunk)}`;
    currentAudio = new Audio(url);
    
    currentAudio.onended = () => {
        currentChunkIndex++;
        playNextAudioChunk();
    };
    
    currentAudio.onerror = (e) => {
        console.warn("Google TTS failed, falling back to Web Speech API", e);
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            const usVoices = voices.filter(v => v.lang.toLowerCase().includes('en-us'));
            if (usVoices.length > 0) utterance.voice = usVoices.find(v => v.name.includes('Google')) || usVoices[0];
            
            utterance.onend = () => {
                currentChunkIndex++;
                playNextAudioChunk();
            };
            window.speechSynthesis.speak(utterance);
        } else {
            currentChunkIndex++;
            playNextAudioChunk();
        }
    };
    
    currentAudio.play().catch(e => currentAudio.onerror(e));
}

window.stopAudio = function () {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    isPlaying = isPaused = false;
    audioChunks = [];
};

window.togglePauseAudio = function () {
    const btn = document.getElementById('pause-audio-btn');
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play();
            btn.innerHTML = '⏸️ Pause';
        } else {
            currentAudio.pause();
            btn.innerHTML = '▶️ Resume';
        }
    } else if ('speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            btn.innerHTML = '⏸️ Pause';
        } else if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            btn.innerHTML = '▶️ Resume';
        }
    }
};

// Settings & WhatsApp
function initSettings() {
    const savedWa = localStorage.getItem('teacherWhatsapp');
    if (savedWa) {
        const el = document.getElementById('teacher-whatsapp');
        if (el) el.value = savedWa;
    }
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
        const el = document.getElementById('student-name-input');
        if (el) el.value = savedName;
    }
    
    const nameInput = document.getElementById('student-name-input');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            localStorage.setItem('studentName', e.target.value);
        });
    }
}

window.saveSettings = function() {
    const wa = document.getElementById('teacher-whatsapp').value;
    localStorage.setItem('teacherWhatsapp', wa);
    alert('Settings saved!');
};

function getStudentName() {
    return document.getElementById('student-name-input')?.value.trim() || 'A Student';
}

function getTeacherNumber() {
    const num = localStorage.getItem('teacherWhatsapp');
    if (!num) {
        alert("Please set the Teacher's WhatsApp number in the Settings first.");
        return null;
    }
    return num.replace(/\D/g, ''); // Remove non-digits
}

window.sendWritingToTeacher = function(btn, unitId, unitTitle) {
    const teacherNum = getTeacherNumber();
    if (!teacherNum) return;
    
    const textarea = btn.previousElementSibling;
    const writingText = textarea.value.trim();
    
    if (!writingText) {
        alert("Please write something before sending.");
        return;
    }
    
    const studentName = getStudentName();
    const message = `Hello Teacher!\nI'm *${studentName}*.\n\nHere is my writing for *${unitId}: ${unitTitle}*:\n\n"${writingText}"`;
    
    const waUrl = `https://wa.me/${teacherNum}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
};

window.sendSpeakingToTeacher = function(unitId, unitTitle, prompt) {
    const teacherNum = getTeacherNumber();
    if (!teacherNum) return;
    
    const studentName = getStudentName();
    const message = `Hello Teacher!\nI'm *${studentName}*.\n\nI am ready to send my Speaking audio for *${unitId}: ${unitTitle}*.\n\nPrompt: "${prompt}"\n\n(I will send the voice note next!)`;
    
    const waUrl = `https://wa.me/${teacherNum}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
};

// Attendance
function initAttendance() {
    const d = document.getElementById('att-date');
    if (d) d.value = new Date().toISOString().substr(0,10);
}
window.saveAttendance = function () {
    alert("Attendance saved!");
};

// Settings (Teacher WhatsApp)
window.saveSettings = function () {
    const waInput = document.getElementById('teacher-whatsapp');
    if (waInput) {
        localStorage.setItem('teacherWhatsApp', waInput.value.trim());
        alert("Settings saved successfully!");
    }
};

function loadSettings() {
    const waInput = document.getElementById('teacher-whatsapp');
    const savedWa = localStorage.getItem('teacherWhatsApp');
    if (waInput && savedWa) {
        waInput.value = savedWa;
    }
}

// WhatsApp Submission Logic
window.sendToWhatsApp = function (btn, unitTitle) {
    const studentName = document.getElementById('student-name-input')?.value.trim();
    if (!studentName) {
        alert("Please enter your Student Name at the top of the page before sending exercises.");
        document.getElementById('student-name-input').focus();
        return;
    }

    const teacherPhone = localStorage.getItem('teacherWhatsApp');
    if (!teacherPhone) {
        alert("Teacher WhatsApp number is not set. Please set it in the Settings (Admin Controls).");
        return;
    }

    const unitBlock = btn.closest('.unit-block');
    let message = `*Homework Submission*%0A`;
    message += `🧑‍🎓 *Student:* ${studentName}%0A`;
    message += `📚 *Unit:* ${currentLevel} - ${unitTitle}%0A%0A`;

    // Gather Writing Tasks
    const textareas = unitBlock.querySelectorAll('textarea');
    let writingCount = 1;
    textareas.forEach(ta => {
        if (ta.value.trim() !== '') {
            message += `*Writing Task ${writingCount}:*%0A${ta.value.trim()}%0A%0A`;
            writingCount++;
        }
    });

    // Gather Quizzes
    // Quizzes in this app are visually indicated by button background color.
    // Green = #10b981 / rgba(16, 185, 129, 0.2)
    // Red = #ef4444 / rgba(239, 68, 68, 0.2)
    const optionGrids = unitBlock.querySelectorAll('.options-grid');
    let correctTotal = 0;
    let questionsTotal = 0;
    
    optionGrids.forEach(grid => {
        const buttons = grid.querySelectorAll('button');
        let answeredCorrectly = false;
        let answeredWrong = false;
        
        buttons.forEach(b => {
            const bg = b.style.backgroundColor || b.style.background;
            if (bg.includes('10b981') || bg.includes('16, 185, 129') || bg.includes('52, 211, 153')) {
                answeredCorrectly = true;
            } else if (bg.includes('ef4444') || bg.includes('239, 68, 68')) {
                answeredWrong = true;
            }
        });

        // Some option grids are just syllables, some are collocations, some are quizzes.
        // We will just count any grid where a correct/incorrect attempt was made.
        if (answeredCorrectly || answeredWrong) {
            questionsTotal++;
            if (answeredCorrectly && !answeredWrong) {
                // If they only have green, it's correct. Wait, they might click multiple.
                // We'll just count how many green buttons there are total vs red total for simplicity.
            }
        }
    });

    // An easier way: just count all green buttons vs total clicked grids
    const allButtons = unitBlock.querySelectorAll('button');
    let greens = 0;
    let reds = 0;
    allButtons.forEach(b => {
        const bg = b.style.backgroundColor || b.style.background;
        if (bg.includes('10b981') || bg.includes('16, 185, 129') || bg.includes('52, 211, 153')) {
            greens++;
        } else if (bg.includes('ef4444') || bg.includes('239, 68, 68')) {
            reds++;
        }
    });

    if (greens > 0 || reds > 0) {
        message += `*Quiz Scores*%0A`;
        message += `✅ Correct Answers: ${greens}%0A`;
        message += `❌ Incorrect Attempts: ${reds}%0A`;
    }

    if (writingCount === 1 && greens === 0 && reds === 0) {
        alert("You haven't completed any exercises in this unit yet!");
        return;
    }

    const whatsappUrl = `https://wa.me/${teacherPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
};
