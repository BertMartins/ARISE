    // ========== AUDIO SYSTEM ==========
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx = null;
        let soundEnabled = true;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new AudioContext();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }

        function playSound(type) {
            if (!soundEnabled) return;
            initAudio();

            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            const now = audioCtx.currentTime;

            switch(type) {
                case 'complete':
                    oscillator.frequency.setValueAtTime(523.25, now); // C5
                    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
                    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
                    gainNode.gain.setValueAtTime(0.3, now);
                    gainNode.gain.exponentialDecayTo = 0.01;
                    gainNode.gain.setValueAtTime(0.01, now + 0.4);
                    oscillator.type = 'sine';
                    oscillator.start(now);
                    oscillator.stop(now + 0.4);
                    break;

                case 'levelup':
                    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
                    notes.forEach((freq, i) => {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.frequency.setValueAtTime(freq, now + i * 0.12);
                        gain.gain.setValueAtTime(0.3, now + i * 0.12);
                        gain.gain.setValueAtTime(0.01, now + i * 0.12 + 0.3);
                        osc.type = 'triangle';
                        osc.start(now + i * 0.12);
                        osc.stop(now + i * 0.12 + 0.3);
                    });
                    break;

                case 'click':
                    oscillator.frequency.setValueAtTime(800, now);
                    gainNode.gain.setValueAtTime(0.1, now);
                    gainNode.gain.setValueAtTime(0.01, now + 0.05);
                    oscillator.type = 'sine';
                    oscillator.start(now);
                    oscillator.stop(now + 0.05);
                    break;

                case 'error':
                    oscillator.frequency.setValueAtTime(200, now);
                    oscillator.frequency.setValueAtTime(150, now + 0.1);
                    gainNode.gain.setValueAtTime(0.2, now);
                    gainNode.gain.setValueAtTime(0.01, now + 0.2);
                    oscillator.type = 'sawtooth';
                    oscillator.start(now);
                    oscillator.stop(now + 0.2);
                    break;

                case 'achievement':
                    const achNotes = [659.25, 783.99, 987.77, 1174.66];
                    achNotes.forEach((freq, i) => {
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.frequency.setValueAtTime(freq, now + i * 0.08);
                        gain.gain.setValueAtTime(0.25, now + i * 0.08);
                        gain.gain.setValueAtTime(0.01, now + i * 0.08 + 0.25);
                        osc.type = 'square';
                        osc.start(now + i * 0.08);
                        osc.stop(now + i * 0.08 + 0.25);
                    });
                    break;
            }
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            const btn = document.getElementById('soundBtn');
            btn.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
            if (soundEnabled) {
                playSound('click');
            }
            showToast(soundEnabled ? 'Som ativado' : 'Som desativado', '', 'info');
        }

        // ========== DATA MANAGEMENT ==========
        const defaultData = {
            player: {
                name: 'Caçador',
                level: 1,
                xp: 0,
                stats: {
                    strength: 0,
                    discipline: 0,
                    vitality: 0,
                    resistance: 0,
                    knowledge: 0
                },
                streak: 0,
                lastActiveDate: null,
                totalXPEarned: 0,
                age: null,
                height: null,
                weight: null,
                country: 'America/Sao_Paulo'
            },
            quests: [
                { id: 1, title: 'Beber 2L de água', xp: 20, stat: 'vitality', type: 'daily', completed: false },
                { id: 2, title: 'Treinar por 30 minutos', xp: 50, stat: 'strength', type: 'daily', completed: false },
                { id: 3, title: 'Estudar por 1 hora', xp: 40, stat: 'knowledge', type: 'daily', completed: false },
                { id: 4, title: 'Dormir 7+ horas', xp: 30, stat: 'vitality', type: 'daily', completed: false },
                { id: 5, title: 'Meditar por 10 minutos', xp: 25, stat: 'discipline', type: 'daily', completed: false }
            ],
            achievements: [
                { id: 'first_quest', name: 'Primeiro Passo', desc: 'Complete sua primeira missão', icon: '🏃', unlocked: false },
                { id: 'streak_7', name: 'Consistente', desc: '7 dias consecutivos', icon: '🔥', unlocked: false },
                { id: 'streak_30', name: 'Imparável', desc: '30 dias consecutivos', icon: '💪', unlocked: false },
                { id: 'level_10', name: 'Guerreiro', desc: 'Alcance o nível 10', icon: '⚔️', unlocked: false },
                { id: 'level_25', name: 'Veterano', desc: 'Alcance o nível 25', icon: '🛡️', unlocked: false },
                { id: 'level_50', name: 'Lenda', desc: 'Alcance o nível 50', icon: '👑', unlocked: false },
                { id: 'rank_s', name: 'Rank S', desc: 'Alcance o Rank S', icon: '⭐', unlocked: false },
                { id: 'xp_1000', name: 'Iniciante', desc: 'Ganhe 1.000 XP total', icon: '✨', unlocked: false },
                { id: 'xp_10000', name: 'Experiente', desc: 'Ganhe 10.000 XP total', icon: '💫', unlocked: false },
                { id: 'xp_100000', name: 'Mestre', desc: 'Ganhe 100.000 XP total', icon: '🌟', unlocked: false },
                { id: 'all_stats_10', name: 'Equilibrado', desc: 'Todos status acima de 10', icon: '⚖️', unlocked: false },
                { id: 'quests_100', name: 'Workaholic', desc: 'Complete 100 missões', icon: '📋', unlocked: false }
            ],
            history: [],
            questsCompleted: 0,
            nextQuestId: 6,
            weeklyChallenge: {
                weekNumber: 0,
                type: null,
                progress: 0,
                target: 10,
                reward: 500,
                completed: false
            },
            consecutiveFailures: 0,
            isLazyStatus: false,
            weeklyQuestsCompleted: 0
        };

        let gameData = JSON.parse(JSON.stringify(defaultData));

        function loadData() {
            try {
                const saved = localStorage.getItem('arise_gameData');

                if (saved) {
                    const parsed = JSON.parse(saved);

                    gameData = {
                        ...defaultData,
                        ...parsed,
                        player: {
                            ...defaultData.player,
                            ...parsed.player,
                            stats: {
                                ...defaultData.player.stats,
                                ...parsed.player?.stats
                            }
                        }
                    };
                }
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
            }

            checkStreak();
            updateUI();
        }


        function loadFromJSON(parsed) {
            gameData = { ...defaultData, ...parsed };
            // Merge nested objects
            gameData.player = { ...defaultData.player, ...parsed.player };
            gameData.player.stats = { ...defaultData.player.stats, ...parsed.player?.stats };
            // Ensure achievements exist
            if (!parsed.achievements || parsed.achievements.length < defaultData.achievements.length) {
                gameData.achievements = defaultData.achievements.map(defAch => {
                    const savedAch = parsed.achievements?.find(a => a.id === defAch.id);
                    return savedAch || defAch;
                });
            }
        }

        function saveData() {
            try {
                localStorage.setItem('arise_gameData', JSON.stringify(gameData));
            } catch (e) {
                console.error('Erro ao salvar dados:', e);
            }
        }

        // ========== GAME LOGIC ==========
        function calculateRequiredXP(level) {
            return level * level * 100;
        }

        function getRank(level) {
            if (level >= 150) return { name: 'NATIONAL', class: 'rank-NATIONAL' };
            if (level >= 100) return { name: 'SSS', class: 'rank-SSS' };
            if (level >= 75) return { name: 'SS', class: 'rank-SS' };
            if (level >= 50) return { name: 'S', class: 'rank-S' };
            if (level >= 35) return { name: 'A', class: 'rank-A' };
            if (level >= 20) return { name: 'B', class: 'rank-B' };
            if (level >= 10) return { name: 'C', class: 'rank-C' };
            if (level >= 5) return { name: 'D', class: 'rank-D' };
            return { name: 'E', class: 'rank-E' };
        }

        function getStreakBonus() {
            const streak = gameData.player.streak;
            if (streak >= 30) return 0.30;
            if (streak >= 14) return 0.20;
            if (streak >= 7) return 0.10;
            return 0;
        }

        function checkStreak() {
            const today = new Date().toDateString();
            const lastActive = gameData.player.lastActiveDate;

            if (!lastActive) return;

            const lastDate = new Date(lastActive);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                // Streak broken
                if (gameData.player.streak > 0) {
                    showToast('Streak Perdido!', `Você perdeu seu streak de ${gameData.player.streak} dias`, 'warning');
                }
                gameData.player.streak = 0;
                saveData();
            }
        }

        function updateStreak() {
            const today = new Date().toDateString();
            const lastActive = gameData.player.lastActiveDate;

            if (lastActive !== today) {
                if (lastActive) {
                    const lastDate = new Date(lastActive);
                    const todayDate = new Date(today);
                    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        gameData.player.streak++;
                    } else if (diffDays > 1) {
                        gameData.player.streak = 1;
                    }
                } else {
                    gameData.player.streak = 1;
                }
                gameData.player.lastActiveDate = today;
                saveData();
            }
        }

        function addXP(amount, source) {
            const bonus = getStreakBonus();
            const totalXP = Math.round(amount * (1 + bonus));

            gameData.player.xp += totalXP;
            gameData.player.totalXPEarned += totalXP;

            const requiredXP = calculateRequiredXP(gameData.player.level);

            if (gameData.player.xp >= requiredXP) {
                levelUp();
            }

            if (bonus > 0) {
                showToast(`+${totalXP} XP`, `Bônus de streak: +${Math.round(bonus * 100)}%`, 'success');
            }

            checkAchievements();
            saveData();
            updateUI();
        }

        function levelUp() {
            const requiredXP = calculateRequiredXP(gameData.player.level);
            gameData.player.xp -= requiredXP;
            gameData.player.level++;

            const oldRank = getRank(gameData.player.level - 1);
            const newRank = getRank(gameData.player.level);

            addHistory('levelup', `Alcançou o nível ${gameData.player.level}!`);

            if (oldRank.name !== newRank.name) {
                addHistory('rank', `Novo rank: ${newRank.name}!`);
                playSound('achievement');
            }

            showLevelUp();
            playSound('levelup');

            // Check for more level ups
            if (gameData.player.xp >= calculateRequiredXP(gameData.player.level)) {
                setTimeout(() => levelUp(), 2000);
            }
        }

        function completeQuest(questId) {
            initAudio();
            const quest = gameData.quests.find(q => q.id === questId);
            if (!quest || quest.completed) return;

            quest.completed = true;
            gameData.questsCompleted++;

            // Add XP
            addXP(quest.xp, quest.title);

            // Add stat
            gameData.player.stats[quest.stat] += Math.ceil(quest.xp / 10);

            // Update streak
            updateStreak();

            // Add history
            addHistory('quest', quest.title, quest.xp);

            // Update weekly challenge progress
            incrementWeeklyProgress(quest.stat);

            // Check if this was a recovery mission (clears lazy status)
            if (quest.isRecovery && gameData.isLazyStatus) {
                deactivateLazyStatus();
            }

            // Reset consecutive failures on success
            gameData.consecutiveFailures = 0;

            // Random chance to show motivational notification
            if (Math.random() < 0.15) {
                setTimeout(() => showRandomNotification('success'), 500);
            }

            playSound('complete');
            checkAchievements();
            saveData();
            updateUI();
        }

        // Anti-cheat tracking
        const toggleTracker = {};

        function uncompleteQuest(questId) {
            const quest = gameData.quests.find(q => q.id === questId);
            if (!quest || !quest.completed) return;

            // Check if quest is locked due to abuse
            if (quest.isLocked) {
                showToast('🔒 Missão Bloqueada', 'Esta missão foi bloqueada por comportamento suspeito!', 'error');
                playSound('error');
                return;
            }

            // Anti-cheat: Track toggle frequency
            const now = Date.now();
            if (!toggleTracker[questId]) {
                toggleTracker[questId] = { count: 0, firstToggle: now, lastToggle: now };
            }
            const tracker = toggleTracker[questId];
            tracker.count++;
            tracker.lastToggle = now;

            // Check for abuse: More than 3 toggles in 60 seconds
            const timeWindow = 60000; // 1 minute
            if (tracker.count >= 3 && (now - tracker.firstToggle) < timeWindow) {
                // ABUSE DETECTED!
                quest.isLocked = true;
                quest.completed = false;

                // Apply -100 XP penalty
                gameData.player.xp -= 100;
                gameData.player.totalXPEarned -= 100;

                // Handle level down if needed
                while (gameData.player.xp < 0 && gameData.player.level > 1) {
                    gameData.player.level--;
                    const prevLevelXP = calculateRequiredXP(gameData.player.level);
                    gameData.player.xp += prevLevelXP;
                    addHistory('leveldown', `Desceu para o nível ${gameData.player.level}!`);
                }
                if (gameData.player.xp < 0) gameData.player.xp = 0;
                if (gameData.player.totalXPEarned < 0) gameData.player.totalXPEarned = 0;

                addHistory('penalty', `Missão "${quest.title}" bloqueada por comportamento suspeito! -100 XP`);

                showAntiCheatModal(quest.title);
                playSound('error');
                saveData();
                updateUI();

                // Reset tracker
                delete toggleTracker[questId];
                return;
            }

            // Reset tracker if outside time window
            if ((now - tracker.firstToggle) > timeWindow) {
                toggleTracker[questId] = { count: 1, firstToggle: now, lastToggle: now };
            }

            // Reverse XP gain
            const bonus = getStreakBonus();
            const totalXP = Math.round(quest.xp * (1 + bonus));
            gameData.player.xp -= totalXP;
            gameData.player.totalXPEarned -= totalXP;

            // Handle level down if XP goes negative
            while (gameData.player.xp < 0 && gameData.player.level > 1) {
                gameData.player.level--;
                const prevLevelXP = calculateRequiredXP(gameData.player.level);
                gameData.player.xp += prevLevelXP;
                addHistory('leveldown', `Desceu para o nível ${gameData.player.level}!`);
                showToast('⬇️ Level Down!', `Você voltou para o nível ${gameData.player.level}`, 'warning');
            }

            // Ensure XP doesn't go below 0 at level 1
            if (gameData.player.xp < 0) gameData.player.xp = 0;
            if (gameData.player.totalXPEarned < 0) gameData.player.totalXPEarned = 0;

            // Reverse stat gain
            const statLoss = Math.ceil(quest.xp / 10);
            gameData.player.stats[quest.stat] -= statLoss;
            if (gameData.player.stats[quest.stat] < 0) gameData.player.stats[quest.stat] = 0;

            // Remove from history (find and remove the most recent matching entry)
            const historyIndex = gameData.history.findIndex(h => h.type === 'quest' && h.title === quest.title);
            if (historyIndex !== -1) {
                gameData.history.splice(historyIndex, 1);
            }

            // Also remove any levelup entries if we leveled down
            const levelUpIndex = gameData.history.findIndex(h => h.type === 'levelup');
            if (levelUpIndex !== -1 && gameData.player.level < parseInt(gameData.history[levelUpIndex].title.match(/\d+/)?.[0] || 0)) {
                gameData.history.splice(levelUpIndex, 1);
            }

            // Decrement quests completed
            gameData.questsCompleted--;
            if (gameData.questsCompleted < 0) gameData.questsCompleted = 0;

            quest.completed = false;

            showToast('Missão Desmarcada', `-${totalXP} XP removido`, 'warning');
            playSound('error');
            saveData();
            updateUI();
        }

        function showAntiCheatModal(questTitle) {
            const modal = document.createElement('div');
            modal.className = 'modal-overlay active';
            modal.id = 'antiCheatModal';
            modal.innerHTML = `
                <div class="modal anti-cheat-modal">
                    <div class="modal-header" style="background: linear-gradient(135deg, var(--danger), #ff6600); border-radius: 16px 16px 0 0;">
                        <h2 class="modal-title" style="color: #fff;"><i class="fas fa-skull-crossbones"></i> TRAPAÇA DETECTADA!</h2>
                    </div>
                    <div class="modal-body" style="text-align: center;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🚫</div>
                        <p style="font-size: 1.1rem; margin-bottom: 1rem;">
                            <strong>Comportamento suspeito detectado!</strong>
                        </p>
                        <p style="color: var(--text-dim); margin-bottom: 1rem;">
                            Você foi pego marcando e desmarcando a missão "<strong>${questTitle}</strong>" repetidamente.
                        </p>
                        <div style="background: rgba(255, 68, 68, 0.1); border: 1px solid var(--danger); border-radius: 8px; padding: 1rem; margin: 1rem 0;">
                            <p style="color: var(--danger); font-weight: 700; font-size: 1.2rem;">
                                <i class="fas fa-gavel"></i> PENALIDADES APLICADAS:
                            </p>
                            <ul style="text-align: left; margin-top: 0.5rem; color: var(--text);">
                                <li>🔒 Missão BLOQUEADA permanentemente</li>
                                <li>💀 -100 XP de penalidade</li>
                                <li>📉 Possível perda de nível</li>
                            </ul>
                        </div>
                        <p style="font-size: 0.9rem; color: var(--text-dim);">
                            O Sistema não tolera trapaças. Jogue limpo, Caçador.
                        </p>
                    </div>
                    <div class="modal-footer" style="justify-content: center;">
                        <button class="btn btn-danger" onclick="document.getElementById('antiCheatModal').remove()">
                            <i class="fas fa-check"></i> Entendi
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function checkAchievements() {
            const p = gameData.player;
            const checks = [
                { id: 'first_quest', condition: gameData.questsCompleted >= 1 },
                { id: 'streak_7', condition: p.streak >= 7 },
                { id: 'streak_30', condition: p.streak >= 30 },
                { id: 'level_10', condition: p.level >= 10 },
                { id: 'level_25', condition: p.level >= 25 },
                { id: 'level_50', condition: p.level >= 50 },
                { id: 'rank_s', condition: p.level >= 50 },
                { id: 'xp_1000', condition: p.totalXPEarned >= 1000 },
                { id: 'xp_10000', condition: p.totalXPEarned >= 10000 },
                { id: 'xp_100000', condition: p.totalXPEarned >= 100000 },
                { id: 'all_stats_10', condition: Object.values(p.stats).every(s => s >= 10) },
                { id: 'quests_100', condition: gameData.questsCompleted >= 100 }
            ];

            checks.forEach(check => {
                const ach = gameData.achievements.find(a => a.id === check.id);
                if (ach && !ach.unlocked && check.condition) {
                    ach.unlocked = true;
                    ach.unlockedAt = new Date().toISOString();
                    addHistory('achievement', ach.name);
                    showToast('🏆 Conquista Desbloqueada!', ach.name, 'success');
                    playSound('achievement');
                }
            });

            saveData();
        }

        function addHistory(type, title, xp = 0) {
            gameData.history.unshift({
                type,
                title,
                xp,
                date: new Date().toISOString()
            });

            // Keep only last 100 entries
            if (gameData.history.length > 100) {
                gameData.history = gameData.history.slice(0, 100);
            }

            saveData();
        }

        // ========== UI UPDATES ==========
        function updateUI() {
            const p = gameData.player;
            const requiredXP = calculateRequiredXP(p.level);
            const rank = getRank(p.level);
            const xpPercent = Math.min(100, (p.xp / requiredXP) * 100);

            document.getElementById('playerName').textContent = p.name;
            document.getElementById('playerLevel').textContent = p.level;
            document.getElementById('currentXP').textContent = p.xp.toLocaleString();
            document.getElementById('requiredXP').textContent = requiredXP.toLocaleString();
            document.getElementById('xpPercent').textContent = Math.round(xpPercent) + '%';
            document.getElementById('xpFill').style.width = xpPercent + '%';
            document.getElementById('streakCount').textContent = p.streak;

            const rankEl = document.getElementById('playerRank');
            rankEl.className = 'player-rank ' + rank.class;
            rankEl.innerHTML = `<i class="fas fa-crown"></i><span>RANK ${rank.name}</span>`;

            // Update avatar with rank evolution
            const avatarEl = document.querySelector('.player-avatar');
            avatarEl.className = 'player-avatar rank-' + rank.name;
            if (gameData.isLazyStatus) {
                avatarEl.classList.add('status-lazy');
            }

            // Update avatar icon based on rank
            const avatarIcons = {
                'E': '👤', 'D': '🥷', 'C': '⚔️', 'B': '🛡️',
                'A': '🗡️', 'S': '👑', 'SS': '💀', 'SSS': '🐉', 'NATIONAL': '⚡'
            };
            avatarEl.innerHTML = `<span style="position:relative;z-index:1">${avatarIcons[rank.name] || '👤'}</span>`;

            // Update stats
            document.getElementById('statStrength').textContent = p.stats.strength;
            document.getElementById('statDiscipline').textContent = p.stats.discipline;
            document.getElementById('statVitality').textContent = p.stats.vitality;
            document.getElementById('statResistance').textContent = p.stats.resistance;
            document.getElementById('statKnowledge').textContent = p.stats.knowledge;

            renderQuests();
            renderAchievements();
            renderHistory();
            updateWeeklyChallenge();
        }

        function renderQuests() {
            const container = document.getElementById('questList');
            const quests = gameData.quests;

            // Calculate pending warnings
            const incompleteDaily = getPenaltyWarning();
            let warningHTML = '';

            if (incompleteDaily > 0) {
                warningHTML = `
                    <div class="penalty-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>
                            <strong>ATENÇÃO!</strong> Você tem ${incompleteDaily} missão(ões) diária(s) não concluída(s).
                            <br><span>Se não completar até amanhã, você receberá PENALIDADES aleatórias!</span>
                        </div>
                    </div>
                `;
            }

            if (quests.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-scroll"></i>
                        <p>Nenhuma missão criada ainda.<br>Adicione sua primeira missão!</p>
                    </div>
                `;
                return;
            }

            const typeIcons = { daily: '✅', weekly: '🟡', challenge: '🔥' };
            const statIcons = {
                strength: '<i class="fas fa-dumbbell stat-strength"></i>',
                discipline: '<i class="fas fa-brain stat-discipline"></i>',
                vitality: '<i class="fas fa-heart stat-vitality"></i>',
                resistance: '<i class="fas fa-running stat-resistance"></i>',
                knowledge: '<i class="fas fa-book stat-knowledge"></i>'
            };

            const questsHTML = quests.map(q => {
                const isPenalty = q.isPenalty === true;
                const isLocked = q.isLocked === true;
                const penaltyClass = isPenalty ? 'penalty-quest' : (isLocked ? 'locked-quest' : '');
                const lockedIcon = (isPenalty || isLocked) ? '<i class="fas fa-lock"></i>' : '';
                const isBlocked = isPenalty || isLocked;

                return `
                <div class="quest-item ${q.completed ? 'completed' : ''} ${penaltyClass}" onclick="toggleQuest(${q.id})">
                    <div class="quest-checkbox">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="quest-content">
                        <div class="quest-title">${lockedIcon} ${q.title}</div>
                        <div class="quest-meta">
                            <span class="quest-xp">+${q.xp} XP</span>
                            <span class="quest-stat">${statIcons[q.stat]}</span>
                            <span>${isPenalty ? '⚠️' : (isLocked ? '🔒' : typeIcons[q.type])}</span>
                        </div>
                    </div>
                    ${isBlocked ? '' : `
                    <div class="quest-actions">
                        <button class="quest-action-btn" onclick="event.stopPropagation(); editQuest(${q.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="quest-action-btn delete" onclick="event.stopPropagation(); deleteQuest(${q.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    `}
                </div>
            `}).join('');

            container.innerHTML = warningHTML + questsHTML;
        }

        function renderAchievements() {
            const container = document.getElementById('achievementsList');

            container.innerHTML = gameData.achievements.map(a => `
                <div class="achievement-card ${a.unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${a.icon}</div>
                    <div class="achievement-name">${a.name}</div>
                    <div class="achievement-desc">${a.desc}</div>
                </div>
            `).join('');
        }

        function renderHistory() {
            const container = document.getElementById('historyList');

            if (gameData.history.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-history"></i>
                        <p>Nenhum histórico ainda.<br>Complete missões para ver aqui!</p>
                    </div>
                `;
                return;
            }

            const iconMap = {
                quest: { class: 'quest', icon: 'fa-check' },
                levelup: { class: 'levelup', icon: 'fa-arrow-up' },
                leveldown: { class: 'leveldown', icon: 'fa-arrow-down' },
                achievement: { class: 'achievement', icon: 'fa-trophy' },
                rank: { class: 'rank', icon: 'fa-crown' },
                penalty: { class: 'penalty', icon: 'fa-exclamation-triangle' }
            };

            container.innerHTML = gameData.history.slice(0, 50).map(h => {
                const info = iconMap[h.type] || iconMap.quest;
                const date = new Date(h.date);
                const timeStr = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                return `
                    <div class="history-item">
                        <div class="history-icon ${info.class}">
                            <i class="fas ${info.icon}"></i>
                        </div>
                        <div class="history-content">
                            <div class="history-title">${h.title}</div>
                            <div class="history-time">${timeStr}</div>
                        </div>
                        ${h.xp > 0 ? `<div class="history-xp">+${h.xp} XP</div>` : ''}
                    </div>
                `;
            }).join('');
        }

        // ========== INTERACTIONS ==========
        function toggleQuest(questId) {
            const quest = gameData.quests.find(q => q.id === questId);
            if (!quest) return;

            if (quest.completed) {
                uncompleteQuest(questId);
            } else {
                completeQuest(questId);
            }
        }

        function showTab(tabName) {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');

            document.getElementById('questsTab').style.display = tabName === 'quests' ? 'block' : 'none';
            document.getElementById('achievementsTab').style.display = tabName === 'achievements' ? 'block' : 'none';
            document.getElementById('historyTab').style.display = tabName === 'history' ? 'block' : 'none';

            playSound('click');
        }

        // ========== MODALS ==========
        function showModal(id) {
            document.getElementById(id).classList.add('active');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
        }

        function showHelpModal() {
            showModal('helpModal');
            playSound('click');
        }

        function showDataModal() {
            showModal('dataModal');
            playSound('click');
        }

        function showNameModal() {
            document.getElementById('nameInput').value = gameData.player.name;
            showModal('nameModal');
            playSound('click');
        }

        function saveName() {
            const name = document.getElementById('nameInput').value.trim();
            if (name) {
                gameData.player.name = name;
                saveData();
                updateUI();
                closeModal('nameModal');
                showToast('Nome Atualizado', `Bem-vindo, ${name}!`, 'success');
                playSound('complete');
            }
        }

        function showQuestModal(questId = null) {
            document.getElementById('questModalTitle').textContent = questId ? 'Editar Missão' : 'Nova Missão';
            document.getElementById('editQuestId').value = questId || '';

            if (questId) {
                const quest = gameData.quests.find(q => q.id === questId);
                if (quest) {
                    document.getElementById('questTitle').value = quest.title;
                    document.getElementById('questXP').value = quest.xp;
                    document.getElementById('questStat').value = quest.stat;
                    document.getElementById('questType').value = quest.type;
                }
            } else {
                document.getElementById('questTitle').value = '';
                document.getElementById('questXP').value = '50';
                document.getElementById('questStat').value = 'discipline';
                document.getElementById('questType').value = 'daily';
            }

            showModal('questModal');
            playSound('click');
        }

        function saveQuest() {
            const title = document.getElementById('questTitle').value.trim();
            const xp = parseInt(document.getElementById('questXP').value);
            const stat = document.getElementById('questStat').value;
            const type = document.getElementById('questType').value;
            const editId = document.getElementById('editQuestId').value;

            if (!title) {
                showToast('Erro', 'Digite um título para a missão', 'error');
                playSound('error');
                return;
            }

            if (editId) {
                const quest = gameData.quests.find(q => q.id === parseInt(editId));
                if (quest) {
                    quest.title = title;
                    quest.xp = xp;
                    quest.stat = stat;
                    quest.type = type;
                    showToast('Missão Atualizada', title, 'success');
                }
            } else {
                gameData.quests.push({
                    id: gameData.nextQuestId++,
                    title,
                    xp,
                    stat,
                    type,
                    completed: false
                });
                showToast('Nova Missão', title, 'success');
            }

            saveData();
            updateUI();
            closeModal('questModal');
            playSound('complete');
        }

        function editQuest(questId) {
            showQuestModal(questId);
        }

        function deleteQuest(questId) {
            showConfirm('Tem certeza que deseja excluir esta missão?', () => {
                gameData.quests = gameData.quests.filter(q => q.id !== questId);
                saveData();
                updateUI();
                showToast('Missão Excluída', '', 'info');
                playSound('click');
            });
        }

        function showConfirm(message, onConfirm) {
            document.getElementById('confirmMessage').textContent = message;
            document.getElementById('confirmBtn').onclick = () => {
                closeModal('confirmModal');
                onConfirm();
            };
            showModal('confirmModal');
            playSound('click');
        }

        function confirmReset() {
            showConfirm('Tem certeza que deseja resetar TODO o seu progresso? Esta ação não pode ser desfeita!', () => {
                gameData = JSON.parse(JSON.stringify(defaultData));
                saveData();
                updateUI();
                closeModal('dataModal');
                showToast('Progresso Resetado', 'Começando do zero!', 'warning');
                playSound('error');
            });
        }

        // ========== LEVEL UP OVERLAY ==========
        function showLevelUp() {
            const rank = getRank(gameData.player.level);
            document.getElementById('levelUpLevel').textContent = gameData.player.level;
            document.getElementById('levelUpSubtitle').textContent = `Rank: ${rank.name}`;
            document.getElementById('levelUpOverlay').classList.add('active');
        }

        function closeLevelUp() {
            document.getElementById('levelUpOverlay').classList.remove('active');
            playSound('click');
        }

        function shareLevelUp() {
            const p = gameData.player;
            const rank = getRank(p.level);
            const shareText = `🎮 ARISE - Sistema de Evolução\n\n⚔️ ${p.name}\n📊 Level ${p.level} | Rank ${rank.name}\n🔥 Streak: ${p.streak} dias\n\n💪 Força: ${p.stats.strength}\n🧠 Disciplina: ${p.stats.discipline}\n💧 Vitalidade: ${p.stats.vitality}\n🏃 Resistência: ${p.stats.resistance}\n📘 Conhecimento: ${p.stats.knowledge}\n\n#ARISE #SoloLeveling #Gamificação`;

            if (navigator.share) {
                navigator.share({
                    title: 'ARISE - Level Up!',
                    text: shareText
                }).catch(() => {
                    copyToClipboard(shareText);
                });
            } else {
                copyToClipboard(shareText);
            }

            closeLevelUp();
        }

        function copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showToast('Copiado!', 'Texto copiado para a área de transferência', 'success');
                }).catch(() => {
                    showToast('Erro', 'Não foi possível copiar', 'error');
                });
            }
        }

        // ========== EXPORT/IMPORT ==========
        function exportData() {
            const dataStr = JSON.stringify(gameData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `arise_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('Exportado!', 'Backup salvo com sucesso', 'success');
            playSound('complete');
        }

        function importData(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (imported.player && imported.quests) {
                        loadFromJSON(imported);
                        checkDailyReset();
                        checkPenalty();
                        updateUI();
                        closeModal('dataModal');
                        showToast('Importado!', 'Dados restaurados com sucesso', 'success');
                        playSound('complete');
                    } else {
                        throw new Error('Invalid format');
                    }
                } catch {
                    showToast('Erro', 'Arquivo inválido', 'error');
                    playSound('error');
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }

        // ========== TOASTS ==========
        function showToast(title, message, type = 'info') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;

            const icons = {
                success: 'fa-check-circle',
                error: 'fa-times-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };

            toast.innerHTML = `
                <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    ${message ? `<div class="toast-message">${message}</div>` : ''}
                </div>
            `;

            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // ========== PARTICLES ==========
        function createParticles() {
            const container = document.getElementById('particles');
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (10 + Math.random() * 10) + 's';
                container.appendChild(particle);
            }
        }

        // ========== DARK MODE ==========
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });

        // ========== RESET DAILY QUESTS ==========
        function checkDailyReset() {
            const today = new Date().toDateString();
            const lastReset = gameData.lastResetDate;

            if (lastReset !== today) {
                // Check if there were incomplete daily quests yesterday (apply penalty)
                if (lastReset) {
                    const incompleteDailyQuests = gameData.quests.filter(q =>
                        q.type === 'daily' && !q.completed && !q.isPenalty
                    );

                    if (incompleteDailyQuests.length > 0) {
                        gameData.pendingPenalty = true;
                        gameData.missedQuestsCount = incompleteDailyQuests.length;
                    }
                }

                // Reset daily quests
                gameData.quests.forEach(q => {
                    if (q.type === 'daily' && !q.isPenalty) {
                        q.completed = false;
                    }
                });

                // Remove old penalty quests from previous days
                gameData.quests = gameData.quests.filter(q => !q.isPenalty);

                gameData.lastResetDate = today;
                saveData();
            }
        }

        // ========== PENALTY SYSTEM ==========
        const penaltyTemplates = [
            { title: '⚠️ PENALIDADE: Beber 3L de água', xp: 30, stat: 'vitality' },
            { title: '⚠️ PENALIDADE: 50 flexões', xp: 40, stat: 'strength' },
            { title: '⚠️ PENALIDADE: 100 abdominais', xp: 45, stat: 'strength' },
            { title: '⚠️ PENALIDADE: Correr 3km', xp: 50, stat: 'resistance' },
            { title: '⚠️ PENALIDADE: Estudar 2 horas seguidas', xp: 60, stat: 'knowledge' },
            { title: '⚠️ PENALIDADE: Meditar 30 minutos', xp: 35, stat: 'discipline' },
            { title: '⚠️ PENALIDADE: Sem redes sociais hoje', xp: 40, stat: 'discipline' },
            { title: '⚠️ PENALIDADE: Acordar às 5h amanhã', xp: 50, stat: 'vitality' },
            { title: '⚠️ PENALIDADE: 200 polichinelos', xp: 35, stat: 'resistance' },
            { title: '⚠️ PENALIDADE: Plank por 3 minutos', xp: 40, stat: 'strength' },
            { title: '⚠️ PENALIDADE: Ler 50 páginas', xp: 45, stat: 'knowledge' },
            { title: '⚠️ PENALIDADE: Jejum de 16 horas', xp: 55, stat: 'vitality' }
        ];

        function checkPenalty() {
            if (gameData.pendingPenalty) {
                applyPenalty();
                gameData.pendingPenalty = false;
                saveData();
            }
        }

        function applyPenalty() {
            const missedCount = gameData.missedQuestsCount || 1;
            const penaltyCount = Math.min(missedCount, 3); // Max 3 penalties

            for (let i = 0; i < penaltyCount; i++) {
                const randomPenalty = penaltyTemplates[Math.floor(Math.random() * penaltyTemplates.length)];

                // Avoid duplicate penalties
                const alreadyHas = gameData.quests.some(q => q.title === randomPenalty.title && q.isPenalty);
                if (alreadyHas) continue;

                const penaltyQuest = {
                    id: gameData.nextQuestId++,
                    title: randomPenalty.title,
                    xp: randomPenalty.xp,
                    stat: randomPenalty.stat,
                    type: 'daily',
                    completed: false,
                    isPenalty: true,
                    penaltyDate: new Date().toDateString()
                };

                gameData.quests.unshift(penaltyQuest); // Add to beginning
            }

            addHistory('penalty', `${penaltyCount} penalidade(s) aplicada(s) por missões não completadas!`);

            setTimeout(() => {
                showToast('⚠️ PENALIDADE!', `Você não completou todas as missões ontem! ${penaltyCount} penalidade(s) adicionada(s).`, 'error');
                playSound('error');
            }, 500);

            saveData();
        }

        function getPenaltyWarning() {
            const dailyQuests = gameData.quests.filter(q => q.type === 'daily' && !q.isPenalty);
            const incompleteDailyQuests = dailyQuests.filter(q => !q.completed);
            return incompleteDailyQuests.length;
        }

        // ========== WEEKLY CHALLENGE SYSTEM ==========
        const weeklyChallenges = [
            { type: 'discipline', name: '🧠 Semana da Disciplina', target: 10, reward: 500, stat: 'discipline', desc: 'Complete 10 missões' },
            { type: 'body', name: '💪 Semana do Corpo', target: 7, reward: 600, stat: 'strength', desc: 'Complete 7 treinos' },
            { type: 'focus', name: '🎯 Semana do Foco', target: 5, reward: 400, stat: 'knowledge', desc: 'Estude por 5 dias' },
            { type: 'vitality', name: '💧 Semana da Vitalidade', target: 14, reward: 550, stat: 'vitality', desc: 'Complete 14 missões de saúde' },
            { type: 'resistance', name: '🏃 Semana da Resistência', target: 8, reward: 650, stat: 'resistance', desc: 'Complete 8 cardios' },
            { type: 'all', name: '⚔️ Semana do Guerreiro', target: 15, reward: 800, stat: null, desc: 'Complete 15 missões totais' }
        ];

        function getWeekNumber() {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const diff = now - start;
            const oneWeek = 1000 * 60 * 60 * 24 * 7;
            return Math.floor(diff / oneWeek);
        }

        function initWeeklyChallenge() {
            const currentWeek = getWeekNumber();

            if (
                gameData.weeklyChallenge &&
                gameData.weeklyChallenge.weekNumber === currentWeek
            ) {
                return;
            }

            const randomChallenge = weeklyChallenges[
                Math.floor(Math.random() * weeklyChallenges.length)
            ];

            gameData.weeklyChallenge = {
                weekNumber: currentWeek,
                type: randomChallenge.type,
                name: randomChallenge.name,
                target: randomChallenge.target,
                reward: randomChallenge.reward,
                stat: randomChallenge.stat,
                desc: randomChallenge.desc,
                progress: 0,
                completed: false
            };

            saveData();

            setTimeout(() => {
                showSystemNotification(
                    '🏆',
                    `Novo desafio semanal: ${randomChallenge.name}!`
                );
            }, 1000);
        }

        function updateWeeklyChallenge() {
            const wc = gameData.weeklyChallenge;
            if (!wc || !wc.name) return;

            const progress = Math.min(wc.progress, wc.target);
            const percent = (progress / wc.target) * 100;

            document.getElementById('weeklyChallengeTitle').textContent = wc.name;
            document.getElementById('weeklyChallengeReward').textContent = `+${wc.reward} XP`;
            document.getElementById('weeklyChallengeProgress').textContent =
                `${progress} / ${wc.target}`;

            document.getElementById('weeklyChallengeFill').style.width = percent + '%';

            const now = new Date();
            const day = now.getDay();
            const daysLeft = 7 - day;

            const endOfWeek = new Date(now);
            endOfWeek.setDate(now.getDate() + daysLeft);
            endOfWeek.setHours(23, 59, 59, 999);

            const diff = endOfWeek - now;
            const daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

            document.getElementById('weeklyChallengeTime').textContent =
                wc.completed
                    ? '✅ Completo!'
                    : `Termina em: ${daysRemaining} dia${daysRemaining !== 1 ? 's' : ''}`;
        }

       function incrementWeeklyProgress(questStat) {
            const wc = gameData.weeklyChallenge;
            if (!wc || wc.completed) return;

            let count = false;

            // desafio genérico
            if (!wc.stat) count = true;

            // desafio por atributo
            if (wc.stat && wc.stat === questStat) count = true;

            if (!count) return;

            wc.progress++;

            if (wc.progress >= wc.target) {
                wc.completed = true;

                gameData.player.xp += wc.reward;
                gameData.player.totalXPEarned += wc.reward;

                addHistory('achievement', `Desafio semanal concluído`);

                showSystemNotification(
                    '🏆',
                    `Desafio semanal concluído! +${wc.reward} XP`
                );

                playSound('achievement');
            }

            saveData();
        }

        // ========== FAILURE SYSTEM (Humiliating but Funny) ==========
        const lazyRecoveryMissions = [
            { title: '😅 Arrumar o quarto', xp: 15, stat: 'discipline' },
            { title: '😅 Beber um copo de água AGORA', xp: 10, stat: 'vitality' },
            { title: '😅 Caminhar 10 minutos', xp: 20, stat: 'resistance' },
            { title: '😅 Fazer 10 polichinelos', xp: 15, stat: 'strength' },
            { title: '😅 Ler 5 páginas de um livro', xp: 15, stat: 'knowledge' },
            { title: '😅 Alongar por 5 minutos', xp: 10, stat: 'vitality' },
            { title: '😅 Organizar a mesa', xp: 15, stat: 'discipline' },
            { title: '😅 Lavar a louça', xp: 20, stat: 'discipline' }
        ];

        function checkFailureStatus() {
            // Check if user has too many consecutive failures
            if (gameData.consecutiveFailures >= 3 && !gameData.isLazyStatus) {
                activateLazyStatus();
            }
        }

        function activateLazyStatus() {
            gameData.isLazyStatus = true;

            // Add recovery mission
            const recovery = lazyRecoveryMissions[Math.floor(Math.random() * lazyRecoveryMissions.length)];
            gameData.quests.unshift({
                id: gameData.nextQuestId++,
                title: recovery.title,
                xp: recovery.xp,
                stat: recovery.stat,
                type: 'daily',
                completed: false,
                isRecovery: true
            });

            addHistory('penalty', 'Status: Desleixado ativado!');
            saveData();

            showSystemNotification('💀', 'Status: DESLEIXADO\n\nO Sistema detectou falta de disciplina.\nComplete a missão de recuperação.');
        }

        function deactivateLazyStatus() {
            gameData.isLazyStatus = false;
            gameData.consecutiveFailures = 0;
            saveData();
            showToast('Status Recuperado!', 'Você voltou ao normal', 'success');
        }

        // ========== SOLO LEVELING NOTIFICATIONS ==========
        const soulHittingMessages = {
            welcome: [
                { icon: '⚔️', msg: 'Bem-vindo de volta, Caçador.' },
                { icon: '👁️', msg: 'O Sistema está observando.' },
                { icon: '🌑', msg: 'Mais um dia para evoluir.' },
                { icon: '💀', msg: 'A fraqueza não é uma opção.' }
            ],
            motivation: [
                { icon: '🔥', msg: 'Hoje é dia de evoluir.' },
                { icon: '⚡', msg: 'Cada missão te torna mais forte.' },
                { icon: '🗡️', msg: 'Lute como se sua vida dependesse disso.' },
                { icon: '🛡️', msg: 'A disciplina é sua armadura.' }
            ],
            warning: [
                { icon: '⚠️', msg: 'Você está ficando para trás…' },
                { icon: '💀', msg: 'Um caçador fraco não sobrevive.' },
                { icon: '👁️', msg: 'O Sistema não tolera preguiça.' },
                { icon: '⏰', msg: 'O tempo não espera ninguém.' }
            ],
            failure: [
                { icon: '💔', msg: 'Você falhou. Mas pode tentar novamente.' },
                { icon: '🌧️', msg: 'A derrota de hoje forja a vitória de amanhã.' },
                { icon: '💀', msg: 'Fraqueza detectada. Hora de melhorar.' }
            ],
            success: [
                { icon: '✨', msg: 'Missão concluída. Continue assim.' },
                { icon: '⚔️', msg: 'Você está evoluindo.' },
                { icon: '🔥', msg: 'O fogo da disciplina queima forte.' }
            ],
            streak: [
                { icon: '🔥', msg: 'Seu streak está em chamas!' },
                { icon: '💪', msg: 'Consistência é a chave do poder.' },
                { icon: '⚡', msg: 'Você é imparável.' }
            ]
        };

        function showSystemNotification(icon, message) {
            const notification = document.getElementById('systemNotification');
            document.getElementById('systemNotificationIcon').textContent = icon;
            document.getElementById('systemNotificationMessage').textContent = message;
            notification.classList.add('active');
            playSound('achievement');
        }

        function closeSystemNotification() {
            document.getElementById('systemNotification').classList.remove('active');
            playSound('click');
        }

        function showRandomNotification(type) {
            const messages = soulHittingMessages[type];
            if (!messages || messages.length === 0) return;

            const random = messages[Math.floor(Math.random() * messages.length)];
            showSystemNotification(random.icon, random.msg);
        }

        function showWelcomeNotification() {
            const hour = new Date().getHours();
            let type = 'welcome';

            if (hour < 6) {
                showSystemNotification('🌙', 'Madrugada? Um verdadeiro caçador não descansa.');
            } else if (hour < 12) {
                showSystemNotification('☀️', 'Bom dia, Caçador. Hora de evoluir.');
            } else if (hour < 18) {
                showRandomNotification('motivation');
            } else {
                showSystemNotification('🌅', 'Anoiteceu. Ainda dá tempo de completar suas missões.');
            }
        }

        // ========== CLOCK SYSTEM ==========
        const countryNames = {
            'America/Sao_Paulo': '🇧🇷 Brasil',
            'America/New_York': '🇺🇸 EUA',
            'America/Los_Angeles': '🇺🇸 EUA',
            'Europe/London': '🇬🇧 Reino Unido',
            'Europe/Paris': '🇫🇷 França',
            'Europe/Berlin': '🇩🇪 Alemanha',
            'Europe/Madrid': '🇪🇸 Espanha',
            'Europe/Lisbon': '🇵🇹 Portugal',
            'Asia/Tokyo': '🇯🇵 Japão',
            'Asia/Seoul': '🇰🇷 Coreia',
            'Asia/Shanghai': '🇨🇳 China',
            'Australia/Sydney': '🇦🇺 Austrália',
            'America/Argentina/Buenos_Aires': '🇦🇷 Argentina',
            'America/Mexico_City': '🇲🇽 México',
            'America/Bogota': '🇨🇴 Colômbia'
        };

        function updateClock() {
            const timezone = gameData.player.country || 'America/Sao_Paulo';
            const now = new Date();

            try {
                const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: timezone };
                const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: timezone };

                const timeStr = now.toLocaleTimeString('pt-BR', timeOptions);
                const dateStr = now.toLocaleDateString('pt-BR', dateOptions);

                document.getElementById('clockTime').textContent = timeStr;
                document.getElementById('clockDate').textContent = dateStr;
                document.getElementById('clockLocation').textContent = countryNames[timezone] || '🌍 ---';
            } catch {
                document.getElementById('clockTime').textContent = now.toLocaleTimeString('pt-BR');
                document.getElementById('clockDate').textContent = now.toLocaleDateString('pt-BR');
            }
        }

        // ========== PROFILE SYSTEM ==========
        function showProfileModal() {
            const p = gameData.player;
            document.getElementById('profileName').value = p.name || '';
            document.getElementById('profileAge').value = p.age || '';
            document.getElementById('profileCountry').value = p.country || 'America/Sao_Paulo';
            document.getElementById('profileHeight').value = p.height || '';
            document.getElementById('profileWeight').value = p.weight || '';
            updateBMIDisplay();
            showModal('profileModal');
            playSound('click');
        }

        function saveProfile() {
            const name = document.getElementById('profileName').value.trim();
            const age = parseInt(document.getElementById('profileAge').value) || null;
            const country = document.getElementById('profileCountry').value;
            const height = parseInt(document.getElementById('profileHeight').value) || null;
            const weight = parseFloat(document.getElementById('profileWeight').value) || null;

            if (name) gameData.player.name = name;
            gameData.player.age = age;
            gameData.player.country = country;
            gameData.player.height = height;
            gameData.player.weight = weight;

            saveData();
            updateUI();
            updateClock();
            closeModal('profileModal');
            showToast('Perfil Atualizado!', 'Suas informações foram salvas', 'success');
            playSound('complete');
        }

        function calculateBMI(height, weight) {
            if (!height || !weight || height <= 0 || weight <= 0) return null;
            const heightM = height / 100;
            return weight / (heightM * heightM);
        }

        function getBMICategory(bmi) {
            if (bmi < 18.5) return { text: 'Abaixo do peso', class: 'underweight' };
            if (bmi < 25) return { text: 'Peso normal', class: 'normal' };
            if (bmi < 30) return { text: 'Sobrepeso', class: 'overweight' };
            return { text: 'Obesidade', class: 'obese' };
        }

        function updateBMIDisplay() {
            const height = parseInt(document.getElementById('profileHeight').value) || 0;
            const weight = parseFloat(document.getElementById('profileWeight').value) || 0;
            const bmi = calculateBMI(height, weight);

            const bmiValue = document.getElementById('bmiValue');
            const bmiCategory = document.getElementById('bmiCategory');
            const bmiIndicator = document.getElementById('bmiIndicator');

            if (bmi) {
                bmiValue.textContent = bmi.toFixed(1);
                const category = getBMICategory(bmi);
                bmiCategory.textContent = category.text;
                bmiCategory.className = 'bmi-category ' + category.class;

                // Position indicator (BMI scale: 15 to 40)
                const minBMI = 15;
                const maxBMI = 40;
                const clampedBMI = Math.max(minBMI, Math.min(maxBMI, bmi));
                const percent = ((clampedBMI - minBMI) / (maxBMI - minBMI)) * 100;
                bmiIndicator.style.left = percent + '%';
            } else {
                bmiValue.textContent = '--';
                bmiCategory.textContent = 'Preencha altura e peso';
                bmiCategory.className = 'bmi-category';
                bmiIndicator.style.left = '0%';
            }
        }

        // ========== INIT ==========
        document.addEventListener('DOMContentLoaded', () => {

            // =========================
            // INICIALIZAÇÃO GERAL
            // =========================
            createParticles();

            loadData();             
            initWeeklyChallenge();   
            checkDailyReset();
            checkPenalty();
            checkFailureStatus();

            updateWeeklyChallenge();
            updateUI();

            // =========================
            // RELÓGIO
            // =========================
            updateClock();
            setInterval(updateClock, 1000);

            // Atualiza o desafio semanal a cada minuto
            setInterval(updateWeeklyChallenge, 60000);

            // =========================
            // NOTIFICAÇÃO INICIAL
            // =========================
            setTimeout(() => {
                showWelcomeNotification();
            }, 1500);

            // =========================
            // FECHAR MODAIS
            // =========================
            document.querySelectorAll('.modal-overlay').forEach(overlay => {
                overlay.addEventListener('click', e => {
                    if (e.target === overlay) {
                        overlay.classList.remove('active');
                    }
                });
            });

            // =========================
            // FECHAR NOTIFICAÇÃO DO SISTEMA
            // =========================
            document.getElementById('systemNotification')
                ?.addEventListener('click', e => {
                    if (e.target.id === 'systemNotification') {
                        closeSystemNotification();
                    }
                });

            // =========================
            // INPUTS
            // =========================
            document.getElementById('nameInput')
                ?.addEventListener('keypress', e => {
                    if (e.key === 'Enter') saveName();
                });

            document.getElementById('questTitle')
                ?.addEventListener('keypress', e => {
                    if (e.key === 'Enter') saveQuest();
                });

            document.getElementById('profileHeight')
                ?.addEventListener('input', updateBMIDisplay);

            document.getElementById('profileWeight')
                ?.addEventListener('input', updateBMIDisplay);
        });
