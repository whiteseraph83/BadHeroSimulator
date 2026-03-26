/* ============================================================
   app.js — Entry point: init, eventi, coordinamento v2
   ============================================================ */

const App = {

  _currentMissionId:    null,
  _currentApproachIdx:  null,
  _createModal:         null,
  _rolledValues:        [],
  _selectedClasseId:    'ladro',
  _ppAnimFrameId:       null,
  _ppClickHandler:      null,
  _wantedAnimFrameId:   null,
  _wantedClickHandler:  null,
  _wantedRoundsWon:     0,
  _dicePhase:           'bet',   // 'bet' | 'rolling' | 'result'
  _diceBet:             0,
  _diceResult:          null,
  _diceAnimInterval:    null,
  // Memory game
  _memoryCards:         [],
  _memoryFlipped:       [],
  _memoryErrors:        0,
  _memoryPairs:         0,
  _memoryTimerInterval: null,
  _memoryTimeLeft:      60,
  _memoryLockBoard:     false,
  _memoryMaxErrors:     8,
  // Crafting pozioni (Druido)
  _craftSelected:       [],
  // Crafting incantesimi (Mago)
  _spellCraftSelected:  [],
  // Recipe modal
  _modalRecipeId:       null,
  _modalRecipeType:     null,

  /* ─── Bootstrap ───────────────────────────────────────── */
  init() {
    const hasGame = Game.init();
    if (hasGame) {
      if (Game.state.gameOver) {
        UI.refresh();
        setTimeout(() => UI.showGameOverModal(), 300);
      } else {
        UI.refresh();
        // Recupero level up persi (es. da consumabili con XP%)
        const pendingLvl = Game.checkLevelUp();
        if (pendingLvl) {
          setTimeout(() => {
            UI.showLevelUpModal(pendingLvl.newLevel, (choices) => {
              Game.applyLevelUp(choices);
              UI.refresh();
              UI.toast(`Livello ${Game.state.character.level} raggiunto!`);
            });
          }, 500);
        }
      }
    } else {
      this._showPlaceholder();
      this._createModal = UI.showCreateModal();
      UI.showClassStep();
    }
    this._bindEvents();
  },

  _showPlaceholder() {
    document.getElementById('char-name').textContent  = '—';
    document.getElementById('char-level').textContent = 'Lv.?';
    document.getElementById('missions-container').innerHTML =
      '<div class="col-12 text-center text-muted py-4"><i class="bi bi-lock fs-3"></i><p class="mt-2">Crea il tuo personaggio per iniziare.</p></div>';
  },

  /* ─── Binding eventi ──────────────────────────────────── */
  _bindEvents() {

    // Creazione PG — step 0: selezione classe
    document.getElementById('class-selection-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.class-card');
      if (!card) return;
      const cls = CLASSES.find(c => c.id === card.dataset.classId);
      if (!cls) return;
      this._selectedClasseId = cls.id;
      UI.showIntroStep(cls);
    });

    // Creazione PG — torna alla scelta classe
    document.getElementById('btn-back-to-class').addEventListener('click', () => {
      UI.showClassStep();
    });

    // Creazione PG — step 1: valida nome e lancia dadi
    document.getElementById('btn-roll-intro').addEventListener('click', () => {
      const nameVal = document.getElementById('char-name-input').value.trim();
      const errEl   = document.getElementById('name-error');
      if (!nameVal) {
        errEl.classList.remove('d-none');
        return;
      }
      errEl.classList.add('d-none');
      this._rolledValues = Game.rollAllStats();
      UI.showRollStep(this._rolledValues);
    });

    // Creazione PG — rilancia
    document.getElementById('btn-reroll').addEventListener('click', () => {
      this._rolledValues = Game.rollAllStats();
      UI.showRollStep(this._rolledValues);
    });

    // Creazione PG — conferma
    document.getElementById('btn-confirm-create').addEventListener('click', () => {
      const stats   = UI.getStatAssignments(this._rolledValues);
      const name    = document.getElementById('char-name-input').value.trim() || 'Eroe';
      const classeId = this._selectedClasseId;
      Game.newGame(stats, name, classeId);
      bootstrap.Modal.getInstance(document.getElementById('modal-create')).hide();
      UI.refresh();
      UI.toast(`Benvenuto, ${name}! La tua avventura da ${Game.getClasse().name} ha inizio.`);
    });

    // Passa al giorno successivo
    document.getElementById('btn-nextday').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      if (!Game.canAdvanceDay()) {
        UI.toast('⚠️ Devi prima affrontare il Cacciatore di Taglie!', 3000);
        return;
      }
      const result = Game.nextDay();

      if (result.gameOver) {
        UI.refresh();
        UI.showGameOverModal();
        return;
      }

      UI.refresh();

      const taxResult = result.taxResult;
      if (!taxResult.paid) {
        UI.toast(`Impossibile pagare la tassa! -${taxResult.fameLost} fama. Giorno ${Game.state.character.day}.`, 4000);
      } else {
        UI.toast(`Tassa pagata (${taxResult.tax} mo). Giorno ${Game.state.character.day} — nuove missioni.`);
      }
      if (result.wantedTriggered) {
        UI.toast('🎯 Un Cacciatore di Taglie ti sta cercando! Affrontalo nel tab Missioni.', 5000);
      }
    });

    // Missione Taglia
    document.getElementById('btn-wanted-mission').addEventListener('click', () => {
      if (!Game.state) return;
      this._wantedRoundsWon = 0;
      UI.openWantedModal();
      setTimeout(() => this._startWantedGame(), 400);
    });

    // Salva manuale
    document.getElementById('btn-save').addEventListener('click', () => {
      if (!Game.state) return;
      Game.save();
      UI.toast('Partita salvata!');
    });

    // Nuova partita — apre conferma
    document.getElementById('btn-newgame').addEventListener('click', () => {
      new bootstrap.Modal(document.getElementById('modal-confirm-newgame')).show();
    });

    document.getElementById('btn-confirm-newgame').addEventListener('click', () => {
      bootstrap.Modal.getInstance(document.getElementById('modal-confirm-newgame')).hide();
      Game.reset();
      location.reload();
    });

    // Game Over — nuova partita
    document.getElementById('btn-gameover-newgame').addEventListener('click', () => {
      Game.reset();
      location.reload();
    });

    // Pickpocket — avvia mini-gioco
    document.getElementById('btn-pickpocket').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const start = Game.startPickpocket();
      if (!start.ok) {
        UI.toast(start.reason || 'Nessun tentativo rimasto.');
        return;
      }
      UI.openPickpocketGame();
      this._startPickpocketGame(start.speed);
    });

    // Studia — apre memory game
    document.getElementById('btn-study').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const result = Game.startStudy();
      if (!result.ok) { UI.toast(result.reason || 'Nessuno studio disponibile oggi.'); return; }
      UI.refresh();
      UI.openStudyModal();
      this._startMemoryGame();
    });

    // Chiusura modal studia — ferma timer
    document.getElementById('modal-studia').addEventListener('hidden.bs.modal', () => {
      if (this._memoryTimerInterval) {
        clearInterval(this._memoryTimerInterval);
        this._memoryTimerInterval = null;
      }
      UI.refresh();
    });

    // Pulsante chiudi memory result
    document.getElementById('btn-close-memory').addEventListener('click', () => {
      // Modal si chiude da data-bs-dismiss
    });

    // Crafting: mescola
    document.getElementById('btn-craft-potion').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const result = Game.craftPotion(this._craftSelected);
      if (result.ok) {
        UI.toast(`✅ ${result.recipe.name} creata! +${result.recipe.reward.xp} PE`, 3000);
      } else if (result.saved) {
        UI.toast(`🧠 ${result.reason}`, 4000);
        // Ingredienti salvati: non svuotiamo la selezione
        UI.refresh();
        return;
      } else {
        UI.toast(`💥 ${result.reason}`, 4000);
      }
      this._craftSelected = [];
      UI.refresh();
      if (result.ok && result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
    });

    // Crafting: svuota slot
    document.getElementById('btn-clear-craft').addEventListener('click', () => {
      this._craftSelected = [];
      UI.renderCraftSlots();
      UI.renderPozioniTab();
    });

    // Crafting: click su slot rimuove ingrediente
    document.getElementById('craft-ingredient-slots').addEventListener('click', (e) => {
      const slot = e.target.closest('.craft-slot.filled');
      if (!slot) return;
      const idx = parseInt(slot.dataset.slotIndex);
      if (!isNaN(idx)) {
        this._craftSelected.splice(idx, 1);
        UI.renderCraftSlots();
        UI.renderPozioniTab();
      }
    });

    // Ingredienti: click aggiunge al craft
    document.getElementById('ingredient-inventory').addEventListener('click', (e) => {
      const card = e.target.closest('.ingredient-card');
      if (!card) return;
      const id = parseInt(card.dataset.ingId);
      if (isNaN(id)) return;
      if (this._craftSelected.length >= 3) { UI.toast('Slot pieno. Rimuovi un ingrediente prima.'); return; }
      // Controlla che non sia già selezionato più volte di quante ne abbia
      const ingInv = Game.state.ingredientInventory || [];
      const countInInv  = ingInv.filter(x => x === id).length;
      const countSelected = this._craftSelected.filter(x => x === id).length;
      if (countSelected >= countInInv) { UI.toast('Non hai altri di questo ingrediente.'); return; }
      this._craftSelected.push(id);
      UI.renderCraftSlots();
      UI.renderPozioniTab();
    });

    // Richieste pozioni: consegna
    document.getElementById('potion-requests').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-request-id]');
      if (!btn) return;
      const reqId = btn.dataset.requestId;
      const result = Game.completePotionRequest(reqId);
      if (result.ok) {
        UI.toast(`✅ Consegnata! +${result.reward.gold} mo, +${result.reward.fame} fama`);
        UI.refresh();
        if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
      } else {
        UI.toast(result.reason);
      }
    });

    // ── Incantesimi (Mago) ──────────────────────────────────

    // Craft incantesimo: incanta
    document.getElementById('btn-craft-spell').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const result = Game.craftSpell(this._spellCraftSelected);
      if (result.ok) {
        UI.toast(`✨ ${result.recipe.name} preparato! +${result.recipe.reward.xp} PE`, 3000);
      } else if (result.saved) {
        UI.toast(`🧠 ${result.reason}`, 4000);
        UI.refresh();
        return;
      } else {
        UI.toast(`💥 ${result.reason}`, 4000);
      }
      this._spellCraftSelected = [];
      UI.refresh();
      if (result.ok && result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
    });

    // Craft incantesimo: svuota slot
    document.getElementById('btn-clear-spell').addEventListener('click', () => {
      this._spellCraftSelected = [];
      UI.renderSpellCraftSlots();
      UI.renderIncantesimiTab();
    });

    // Craft incantesimo: click slot rimuove componente
    document.getElementById('craft-spell-slots').addEventListener('click', (e) => {
      const slot = e.target.closest('.craft-slot.filled');
      if (!slot) return;
      const idx = parseInt(slot.dataset.spellSlotIndex);
      if (!isNaN(idx)) {
        this._spellCraftSelected.splice(idx, 1);
        UI.renderSpellCraftSlots();
        UI.renderIncantesimiTab();
      }
    });

    // Componenti: click aggiunge al craft
    document.getElementById('component-inventory').addEventListener('click', (e) => {
      const card = e.target.closest('.ingredient-card');
      if (!card) return;
      const id = parseInt(card.dataset.compId);
      if (isNaN(id)) return;
      if (this._spellCraftSelected.length >= 3) { UI.toast('Slot pieno. Rimuovi una componente prima.'); return; }
      const compInv = Game.state.componentInventory || [];
      const countInInv   = compInv.filter(x => x === id).length;
      const countSelected = this._spellCraftSelected.filter(x => x === id).length;
      if (countSelected >= countInInv) { UI.toast('Non hai altre di questa componente.'); return; }
      this._spellCraftSelected.push(id);
      UI.renderSpellCraftSlots();
      UI.renderIncantesimiTab();
    });

    // Richieste incantesimi: consegna
    document.getElementById('spell-requests').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-spell-request-id]');
      if (!btn) return;
      const reqId = btn.dataset.spellRequestId;
      const result = Game.completeSpellRequest(reqId);
      if (result.ok) {
        UI.toast(`✅ Consegnato! +${result.reward.gold} mo, +${result.reward.fame} fama`);
        UI.refresh();
        if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
      } else {
        UI.toast(result.reason);
      }
    });

    // Grimorio / Ricettario: click su ricetta apre modale dettaglio
    document.getElementById('known-spells-list').addEventListener('click', (e) => {
      const card = e.target.closest('.recipe-card');
      if (!card) return;
      UI.openRecipeModal(card.dataset.recipeId, card.dataset.recipeType || 'spell');
    });

    document.getElementById('known-recipes-list').addEventListener('click', (e) => {
      const card = e.target.closest('.recipe-card');
      if (!card) return;
      UI.openRecipeModal(card.dataset.recipeId, card.dataset.recipeType || 'potion');
    });

    // Modale ricetta: bottone Prepara
    document.getElementById('btn-recipe-prepare').addEventListener('click', () => {
      const recipeId = document.getElementById('btn-recipe-prepare').dataset.recipeId;
      const type     = document.getElementById('btn-recipe-prepare').dataset.recipeType;
      if (type === 'spell') {
        const recipe = SPELL_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;
        this._spellCraftSelected = [];
        const compInv = [...(Game.state.componentInventory || [])];
        for (const compId of recipe.components) {
          const idx = compInv.indexOf(compId);
          if (idx !== -1) {
            this._spellCraftSelected.push(compId);
            compInv.splice(idx, 1);
          }
        }
        bootstrap.Modal.getInstance(document.getElementById('modal-recipe'))?.hide();
        // Naviga al tab incantesimi
        const tab = document.querySelector('[data-bs-target="#tab-incantesimi"]');
        if (tab) new bootstrap.Tab(tab).show();
        UI.renderSpellCraftSlots();
        UI.renderIncantesimiTab();
      } else {
        const recipe = POTION_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;
        this._craftSelected = [];
        const ingInv = [...(Game.state.ingredientInventory || [])];
        for (const ingId of recipe.ingredients) {
          const idx = ingInv.indexOf(ingId);
          if (idx !== -1) {
            this._craftSelected.push(ingId);
            ingInv.splice(idx, 1);
          }
        }
        bootstrap.Modal.getInstance(document.getElementById('modal-recipe'))?.hide();
        const tab = document.querySelector('[data-bs-target="#tab-pozioni"]');
        if (tab) new bootstrap.Tab(tab).show();
        UI.renderCraftSlots();
        UI.renderPozioniTab();
      }
    });

    // Rilancio borseggio
    document.getElementById('btn-pickpocket-reroll').addEventListener('click', () => {
      if (!Game.useReroll()) { UI.toast('Nessun rilancio disponibile.'); return; }
      const newSpeed = 0.55 + Math.random() * 0.8;
      UI.openPickpocketGame();
      this._startPickpocketGame(newSpeed);
    });

    // Chiusura modal missione — refresh
    document.getElementById('modal-mission').addEventListener('hidden.bs.modal', () => {
      UI.refresh();
      this._currentMissionId   = null;
      this._currentApproachIdx = null;
    });

    // Chiusura modal pickpocket — ferma animazione + refresh
    document.getElementById('modal-pickpocket').addEventListener('hidden.bs.modal', () => {
      this._cancelPickpocketGame();
      UI.refresh();
    });

    // Chiusura modal taglia — ferma animazione + refresh
    document.getElementById('modal-wanted').addEventListener('hidden.bs.modal', () => {
      this._cancelWantedGame();
      UI.refresh();
    });

    // Gioca a Dadi — scommessa (delegated)
    document.getElementById('dice-bet-options').addEventListener('click', e => {
      const btn = e.target.closest('.dice-bet-btn');
      if (!btn || btn.classList.contains('disabled') || !Game.state) return;
      const bet = parseInt(btn.dataset.bet, 10);
      if (isNaN(bet) || bet <= 0) return;
      this._diceBet   = bet;
      this._dicePhase = 'rolling';
      this._diceResult = null;
      this._showDicePhase();
      // Pre-render rolling phase (all "?")
      const players = [
        { name: Game.state.character.name, isPlayer: true },
        { name: '???', isPlayer: false }, { name: '???', isPlayer: false }, { name: '???', isPlayer: false },
      ];
      UI.renderDiceRollingPhase(bet, players);
    });

    // Tira i dadi
    document.getElementById('btn-dice-roll').addEventListener('click', () => {
      if (!Game.state || this._dicePhase !== 'rolling') return;
      const result = Game.rollDiceGame(this._diceBet);
      if (!result.ok) { UI.toast(result.reason); return; }
      this._diceResult = result;
      document.getElementById('dice-rerolls-remaining').textContent = Game.diceRerollsRemaining();
      UI.renderDiceRollingPhase(this._diceBet, [...result.ranked].sort(() => Math.random() - 0.5));
      this._startDiceAnimation(result);
    });

    // Rapidità di Mano — ritira i dadi
    document.getElementById('btn-dice-use-reroll').addEventListener('click', () => {
      if (!Game.useDiceReroll()) return;
      document.getElementById('dice-reroll-offer').classList.add('d-none');
      document.getElementById('dice-roll-btn-area').classList.remove('d-none');
      const result = Game.rollDiceGame(this._diceBet);
      if (!result.ok) { UI.toast(result.reason); return; }
      this._diceResult = result;
      document.getElementById('dice-rerolls-remaining').textContent = Game.diceRerollsRemaining();
      UI.renderDiceRollingPhase(this._diceBet, [...result.ranked].sort(() => Math.random() - 0.5));
      this._startDiceAnimation(result);
    });

    // Accetta sconfitta senza ritirare
    document.getElementById('btn-dice-accept-loss').addEventListener('click', () => {
      document.getElementById('dice-reroll-offer').classList.add('d-none');
      this._applyAndShowDiceResult(this._diceResult);
    });

    // Gioca ancora
    document.getElementById('btn-dice-again').addEventListener('click', () => {
      this._dicePhase  = 'bet';
      this._diceBet    = 0;
      this._diceResult = null;
      document.getElementById('btn-dice-roll').disabled = false;
      document.getElementById('dice-roll-btn-area').classList.remove('d-none');
      document.getElementById('dice-reroll-offer').classList.add('d-none');
      this._showDicePhase();
      UI.renderDiceBetPhase();
    });

    // Tab dice — render bet phase when entering
    document.querySelector('[data-bs-target="#tab-dice"]')?.addEventListener('shown.bs.tab', () => {
      if (this._dicePhase === 'bet') UI.renderDiceBetPhase();
    });
  },

  /* ─── Apertura modal missione ─────────────────────────── */
  openMissionModal(missionId) {
    if (!Game.state || Game.state.gameOver) return;
    if (Game.isMissionCompleted(missionId)) return;

    this._currentMissionId = missionId;
    const mission = DB.missions.find(m => m.id === missionId);
    if (!mission) return;

    UI.openMissionModal(mission);

    if (mission.approaches.length === 1) {
      document.getElementById('btn-roll-single').onclick = () => this._executeMission(missionId, 0);
    } else {
      document.getElementById('btn-approach-1').onclick = () => this._executeMission(missionId, 0);
      document.getElementById('btn-approach-2').onclick = () => this._executeMission(missionId, 1);
    }
  },

  /* ─── Esegui missione ─────────────────────────────────── */
  _executeMission(missionId, approachIndex) {
    this._currentApproachIdx = approachIndex;
    const resolution = Game.resolveMission(missionId, approachIndex);
    UI.showMissionResult(resolution, false);

    // Bind reroll button
    const rerollBtn = document.getElementById('btn-mission-reroll');
    rerollBtn.onclick = () => this._rerollMission(missionId, approachIndex);

    this._handleChallenges(resolution.completedChallenges);

    // Level up check
    if (resolution.levelUpResult) {
      setTimeout(() => {
        UI.showLevelUpModal(resolution.levelUpResult.newLevel, (statChoices) => {
          Game.applyLevelUp(statChoices);
          UI.refresh();
          UI.toast(`Livello ${Game.state.character.level} raggiunto!`);
        });
      }, 1800);
    }

    // Game over check
    if (Game.state.gameOver) {
      setTimeout(() => {
        bootstrap.Modal.getInstance(document.getElementById('modal-mission'))?.hide();
        UI.showGameOverModal();
      }, 2500);
    }
  },

  /* ─── Rilancio missione ───────────────────────────────── */
  _rerollMission(missionId, approachIndex) {
    const used = Game.useReroll();
    if (!used) {
      UI.toast('Nessun rilancio disponibile.');
      return;
    }

    // Re-run the check only (not resolveMission which would add to completedToday again)
    const mission  = DB.missions.find(m => m.id === missionId);
    const approach = mission.approaches[approachIndex];

    // Remove mission from completedToday so we can re-resolve
    const idx = Game.state.completedToday.indexOf(missionId);
    if (idx !== -1) Game.state.completedToday.splice(idx, 1);

    // Remove xp/gold/fame that were applied from the previous resolution
    // We can't easily undo them so we re-resolve fully
    const resolution = Game.resolveMission(missionId, approachIndex);
    UI.showMissionResult(resolution, true);

    document.getElementById('mission-reroll-area').classList.add('d-none');

    if (resolution.levelUpResult) {
      setTimeout(() => {
        UI.showLevelUpModal(resolution.levelUpResult.newLevel, (statChoices) => {
          Game.applyLevelUp(statChoices);
          UI.refresh();
          UI.toast(`Livello ${Game.state.character.level} raggiunto!`);
        });
      }, 1800);
    }

    if (Game.state.gameOver) {
      setTimeout(() => {
        bootstrap.Modal.getInstance(document.getElementById('modal-mission'))?.hide();
        UI.showGameOverModal();
      }, 2500);
    }
  },

  /* ─── Sfide completate (toast) ───────────────────────── */
  _handleChallenges(completed) {
    if (!completed || !completed.length) return;
    completed.forEach(tmpl => {
      UI.toast(`🏆 Sfida completata: "${tmpl.desc}" — +${tmpl.reward.xp} PE, +${tmpl.reward.gold} mo`, 4000);
    });
    UI.renderChallenges();
  },

  /* ─── Mini-gioco borseggio ───────────────────────────── */
  _startPickpocketGame(speed) {
    const bar    = document.getElementById('pp-bar');
    const cursor = document.getElementById('pp-cursor');
    const hint   = document.getElementById('pp-speed-hint');

    // Hint velocità (range 0.55–1.35)
    const pct = (speed - 0.55) / 0.8;
    if (pct < 0.33)      hint.textContent = 'Velocità: Media 🦊';
    else if (pct < 0.66) hint.textContent = 'Velocità: Veloce ⚡ (ricompensa bonus)';
    else                 hint.textContent = 'Velocità: Fulminea 🔥 (ricompensa massima!)';

    let pos = 0;
    let dir = 1;
    let lastTime = null;

    const tick = (ts) => {
      if (!lastTime) lastTime = ts;
      const dt = (ts - lastTime) / 1000;
      lastTime = ts;

      pos += dir * speed * dt;
      if (pos >= 1) { pos = 1; dir = -1; }
      if (pos <= 0) { pos = 0; dir =  1; }

      const cursorHalfW = cursor.offsetWidth / 2;
      cursor.style.left = `calc(${pos * 100}% - ${cursorHalfW}px)`;
      this._ppAnimFrameId = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(this._ppAnimFrameId);
    if (this._ppClickHandler) bar.removeEventListener('click', this._ppClickHandler);

    this._ppAnimFrameId = requestAnimationFrame(tick);

    this._ppClickHandler = () => {
      bar.removeEventListener('click', this._ppClickHandler);
      this._ppClickHandler = null;
      cancelAnimationFrame(this._ppAnimFrameId);
      this._ppAnimFrameId = null;

      // Controlla overlap: centro cursore vs zona successo
      const zone       = document.getElementById('pp-success-zone');
      const zoneRect   = zone.getBoundingClientRect();
      const cursorRect = cursor.getBoundingClientRect();
      const cursorCenter = cursorRect.left + cursorRect.width / 2;
      const hit = cursorCenter >= zoneRect.left && cursorCenter <= zoneRect.right;

      if (hit) {
        const speedMult = 1 + (speed - 0.3) * 0.8;
        const result = Game.applyPickpocketReward(speedMult);
        UI.showPickpocketResult(result);
        UI.refresh();
        this._handleChallenges(result.completedChallenges);
        if (result.levelUpResult) {
          setTimeout(() => {
            UI.showLevelUpModal(result.levelUpResult.newLevel, (choices) => {
              Game.applyLevelUp(choices);
              UI.refresh();
              UI.toast(`Livello ${Game.state.character.level} raggiunto!`);
            });
          }, 1800);
        }
      } else {
        const result = Game.applyPickpocketFailure();
        UI.showPickpocketResult(result);
        UI.refresh();
      }
    };

    bar.addEventListener('click', this._ppClickHandler);
  },

  /* ─── Mini-gioco Taglia ──────────────────────────────── */
  _startWantedGame() {
    const bar    = document.getElementById('wanted-game-bar');
    const player = document.getElementById('wanted-cursor-player');
    const enemy  = document.getElementById('wanted-cursor-enemy');

    const speed1 = 0.25 + Math.random() * 0.35;  // giocatore
    const speed2 = 0.20 + Math.random() * 0.40;  // nemico (diversa)
    const TOUCH  = 0.10;  // 10% della barra = "si toccano"

    let pos1 = 0.02, dir1 = 1;   // giocatore: parte da sinistra
    let pos2 = 0.98, dir2 = -1;  // nemico: parte da destra
    let lastTime = null;

    const tick = (ts) => {
      if (!lastTime) lastTime = ts;
      const dt = (ts - lastTime) / 1000;
      lastTime = ts;

      pos1 += dir1 * speed1 * dt;
      pos2 += dir2 * speed2 * dt;
      if (pos1 >= 1) { pos1 = 1; dir1 = -1; }
      if (pos1 <= 0) { pos1 = 0; dir1 =  1; }
      if (pos2 >= 1) { pos2 = 1; dir2 = -1; }
      if (pos2 <= 0) { pos2 = 0; dir2 =  1; }

      player.style.left = `calc(${pos1 * 100}% - ${player.offsetWidth / 2}px)`;
      enemy.style.left  = `calc(${pos2 * 100}% - ${enemy.offsetWidth  / 2}px)`;

      const dist = Math.abs(pos1 - pos2);
      bar.classList.toggle('touching', dist < TOUCH);

      this._wantedAnimFrameId = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(this._wantedAnimFrameId);
    if (this._wantedClickHandler) bar.removeEventListener('click', this._wantedClickHandler);
    this._wantedAnimFrameId = requestAnimationFrame(tick);

    this._wantedClickHandler = () => {
      bar.removeEventListener('click', this._wantedClickHandler);
      this._wantedClickHandler = null;
      cancelAnimationFrame(this._wantedAnimFrameId);
      this._wantedAnimFrameId = null;
      bar.classList.remove('touching');

      const hit = Math.abs(pos1 - pos2) < TOUCH;
      this._handleWantedRound(hit);
    };

    bar.addEventListener('click', this._wantedClickHandler);
  },

  _handleWantedRound(won) {
    UI.updateWantedRoundDot(this._wantedRoundsWon, won);

    if (!won) {
      // Sconfitta — oro dimezzato
      const result = Game.applyWantedLoss();
      UI.showWantedResult(result, false);
      UI.refresh();
      return;
    }

    this._wantedRoundsWon++;
    if (this._wantedRoundsWon >= 2) {
      // Vittoria completa!
      const result = Game.applyWantedWin();
      UI.showWantedResult(result, true);
      this._handleChallenges(result.completedChallenges);
      UI.refresh();
    } else {
      // Prova 1 superata — mostra feedback e riparte
      UI.showWantedRoundFeedback(true, () => this._startWantedGame());
    }
  },

  _applyAndShowDiceResult(result) {
    const applied = Game.applyDiceGameResult(result);
    this._dicePhase = 'result';
    this._showDicePhase();
    UI.renderDiceResultPhase(applied);
    if (applied.completedChallenges?.length) this._handleChallenges(applied.completedChallenges);
    UI.refresh();
    if (applied.levelUpResult) {
      setTimeout(() => {
        UI.showLevelUpModal(applied.levelUpResult.newLevel, (choices) => {
          Game.applyLevelUp(choices);
          UI.refresh();
          UI.toast(`Livello ${Game.state.character.level} raggiunto!`);
        });
      }, 800);
    }
  },

  /* ─── Gioco dei Dadi ────────────────────────────────────── */
  _showDicePhase() {
    document.getElementById('dice-phase-bet').classList.toggle('d-none',     this._dicePhase !== 'bet');
    document.getElementById('dice-phase-rolling').classList.toggle('d-none', this._dicePhase !== 'rolling');
    document.getElementById('dice-phase-result').classList.toggle('d-none',  this._dicePhase !== 'result');
  },

  _startDiceAnimation(result) {
    document.getElementById('btn-dice-roll').disabled = true;
    const DURATION = 1600;
    const INTERVAL = 60;
    let elapsed = 0;

    const faceId = (name, n) => `dface-${name.replace(/\s/g,'_')}-${n}`;

    this._diceAnimInterval = setInterval(() => {
      elapsed += INTERVAL;
      for (const p of result.ranked) {
        const el1 = document.getElementById(faceId(p.name, 1));
        const el2 = document.getElementById(faceId(p.name, 2));
        if (el1) el1.textContent = Math.ceil(Math.random() * 6);
        if (el2) el2.textContent = Math.ceil(Math.random() * 6);
      }

      if (elapsed >= DURATION) {
        clearInterval(this._diceAnimInterval);
        this._diceAnimInterval = null;

        const container = document.getElementById('dice-players-container');
        const player    = result.ranked.find(p => p.isPlayer);

        /* Ridisegna la classifica live; il giocatore appena entrato
           riceve la classe .dice-row-new per l'animazione di ingresso */
        const renderLive = (players, newName) => {
          container.innerHTML = players.map(p => `
            <div class="dice-player-row ${p.isPlayer ? 'dice-player-hero' : ''} ${p.name === newName ? 'dice-row-new' : ''}">
              <div class="dice-player-name">${p.isPlayer ? '⚔️ ' : ''}${p.name}</div>
              <div class="dice-faces">
                <div class="dice-face">${p.d1}</div>
                <div class="dice-face">${p.d2}</div>
              </div>
              <div class="dice-total">${p.total}</div>
            </div>`).join('');
        };

        // Il giocatore appare subito al 1° posto
        let shown = [player];
        renderLive(shown, null);

        // Gli NPC entrano uno alla volta (dal migliore al peggiore):
        // se un NPC supera il giocatore lo spinge verso il basso
        const npcs = result.ranked.filter(p => !p.isPlayer);
        let idx = 0;
        const revealNext = () => {
          if (idx >= npcs.length) {
            setTimeout(() => {
              if (result.playerRank !== 1 && Game.diceRerollsRemaining() > 0) {
                document.getElementById('dice-roll-btn-area').classList.add('d-none');
                document.getElementById('dice-offer-rerolls').textContent = Game.diceRerollsRemaining();
                document.getElementById('dice-reroll-offer').classList.remove('d-none');
              } else {
                this._applyAndShowDiceResult(result);
              }
            }, 350);
            return;
          }
          const npc = npcs[idx++];
          shown.push(npc);
          // Riordina: totale più alto prima; a parità vince il giocatore (come in game.js)
          shown.sort((a, b) => b.total !== a.total ? b.total - a.total : (a.isPlayer ? -1 : 1));
          renderLive(shown, npc.name);
          setTimeout(revealNext, 500);
        };
        setTimeout(revealNext, 500);
      }
    }, INTERVAL);
  },

  _cancelWantedGame() {
    cancelAnimationFrame(this._wantedAnimFrameId);
    this._wantedAnimFrameId = null;
    const bar = document.getElementById('wanted-game-bar');
    if (bar && this._wantedClickHandler) {
      bar.removeEventListener('click', this._wantedClickHandler);
      this._wantedClickHandler = null;
    }
  },

  _cancelPickpocketGame() {
    cancelAnimationFrame(this._ppAnimFrameId);
    this._ppAnimFrameId = null;
    const bar = document.getElementById('pp-bar');
    if (bar && this._ppClickHandler) {
      bar.removeEventListener('click', this._ppClickHandler);
      this._ppClickHandler = null;
    }
  },

  /* ─── Mercato Nero ────────────────────────────────────── */
  buyItem(itemId) {
    if (!Game.state) return;
    const result = Game.buyItem(itemId);
    if (result.ok) {
      const item = DB.items.find(i => i.id === itemId);
      UI.toast(`Acquistato: ${item ? item.name : 'oggetto'}!`);
      this._handleChallenges(result.completedChallenges);
      UI.refresh();
    } else {
      UI.toast(result.reason || 'Acquisto non riuscito.');
    }
  },

  buyItemFromModal() {
    const itemId      = parseInt(document.getElementById('item-modal-itemid').value);
    const marketPrice = parseInt(document.getElementById('item-modal-marketprice').value);
    bootstrap.Modal.getInstance(document.getElementById('modal-item'))?.hide();
    this.buyItem(itemId);
  },

  /* ─── Oggetti (inventario) ────────────────────────────── */
  equipItemFromModal() {
    const itemId = parseInt(document.getElementById('item-modal-itemid').value);
    bootstrap.Modal.getInstance(document.getElementById('modal-item'))?.hide();
    const result = Game.equipItem(itemId);
    if (result.ok) {
      const item = DB.items.find(i => i.id === itemId);
      UI.toast(`${item ? item.name : 'Oggetto'} equipaggiato!`);
      this._handleChallenges(Game.checkChallenges('passive'));
    } else {
      UI.toast(result.reason || 'Impossibile equipaggiare.');
    }
    UI.refresh();
  },

  unequipItemFromModal() {
    const slot = document.getElementById('item-modal-slot').value;
    bootstrap.Modal.getInstance(document.getElementById('modal-item'))?.hide();
    Game.unequipItem(slot);
    UI.toast('Oggetto rimosso.');
    UI.refresh();
  },

  useConsumableFromModal() {
    const itemId = parseInt(document.getElementById('item-modal-itemid').value, 10);
    const result = Game.useConsumable(itemId);
    if (!result.ok) { UI.toast(result.reason); return; }

    bootstrap.Modal.getInstance(document.getElementById('modal-item'))?.hide();

    const r = result.result;
    if (r.boost) {
      const parts = [];
      if (r.boost.xpBoost)   parts.push(`+${Math.round(r.boost.xpBoost*100)}% PE`);
      if (r.boost.goldBoost)  parts.push(`+${Math.round(r.boost.goldBoost*100)}% oro`);
      if (r.boost.fameBoost) parts.push(`+${Math.round(r.boost.fameBoost*100)}% fama`);
      UI.toast(`✨ ${r.boost.name}: ${parts.join(', ')} per ${r.boost.daysLeft} giorni`, 4000);
    } else {
      const parts = [];
      if (r.xp)   parts.push(`+${r.xp} PE`);
      if (r.gold)  parts.push(`+${r.gold} mo`);
      if (r.fame)  parts.push(`+${r.fame} fama`);
      UI.toast(`✨ ${parts.join(', ')}`, 3000);
    }
    if (result.completedChallenges?.length) this._handleChallenges(result.completedChallenges);
    UI.refresh();
    if (result.levelUpResult) {
      setTimeout(() => {
        UI.showLevelUpModal(result.levelUpResult.newLevel, (choices) => {
          Game.applyLevelUp(choices);
          UI.refresh();
          UI.toast(`Livello ${Game.state.character.level} raggiunto!`);
        });
      }, 600);
    }
  },

  sellItemFromModal() {
    const itemId  = parseInt(document.getElementById('item-modal-itemid').value);
    const context = document.getElementById('item-modal-context').value;
    const slot    = document.getElementById('item-modal-slot').value || null;
    bootstrap.Modal.getInstance(document.getElementById('modal-item'))?.hide();

    const item     = DB.items.find(i => i.id === itemId);
    const fromSlot = context === 'equipment' ? slot : null;
    const result = Game.sellItem(itemId, fromSlot);

    if (result && result.ok) {
      UI.toast(`Venduto per ${item ? item.sellPrice : '?'} mo.`);
      this._handleChallenges(result.completedChallenges);
    } else {
      UI.toast('Impossibile vendere.');
    }
    UI.refresh();
  },

  /* ─── Helper level up ─────────────────────────────────── */
  _triggerLevelUp(levelUpResult) {
    if (!levelUpResult) return;
    setTimeout(() => {
      UI.showLevelUpModal(levelUpResult.newLevel, (choices) => {
        Game.applyLevelUp(choices);
        UI.refresh();
      });
    }, 400);
  },

  /* ─── Memory Game ─────────────────────────────────────── */
  _startMemoryGame() {
    const SYMBOLS = ['Ψ','Ω','Φ','Δ','Λ','Θ','Ξ','Π','∞','⊕','☿','♄'];
    // 6 coppie = 12 carte (griglia 4×3) — difficoltà ridotta
    const shuffledSymbols = [...SYMBOLS].sort(() => Math.random() - 0.5).slice(0, 6);
    const cards = [...shuffledSymbols, ...shuffledSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }));

    this._memoryCards     = cards;
    this._memoryFlipped   = [];
    this._memoryErrors    = 0;
    this._memoryPairs     = 0;
    this._memoryTimeLeft  = 90;   // 90 secondi
    this._memoryMaxErrors = 8;    // 8 errori massimi
    this._memoryLockBoard = false;

    this._renderMemoryGrid();

    // Avvia timer
    if (this._memoryTimerInterval) clearInterval(this._memoryTimerInterval);
    this._memoryTimerInterval = setInterval(() => {
      this._memoryTimeLeft--;
      const timerEl = document.getElementById('memory-timer');
      if (timerEl) timerEl.textContent = this._memoryTimeLeft;
      if (this._memoryTimeLeft <= 0) {
        clearInterval(this._memoryTimerInterval);
        this._memoryTimerInterval = null;
        this._memoryLockBoard = true;
        UI.showMemoryResult(false, 0, this._memoryErrors, []);
      }
    }, 1000);
  },

  _renderMemoryGrid() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;
    grid.innerHTML = this._memoryCards.map(card => `
      <div class="memory-card ${card.matched ? 'matched' : (card.flipped ? 'flipped' : '')}"
           data-card-id="${card.id}">
        <span class="card-back">✦</span>
        <span class="card-front">${card.symbol}</span>
      </div>
    `).join('');

    grid.querySelectorAll('.memory-card').forEach(el => {
      el.addEventListener('click', () => this._onMemoryCardClick(parseInt(el.dataset.cardId)));
    });
  },

  _onMemoryCardClick(cardId) {
    if (this._memoryLockBoard) return;
    const card = this._memoryCards[cardId];
    if (!card || card.matched || card.flipped) return;
    if (this._memoryFlipped.includes(cardId)) return;

    card.flipped = true;
    this._memoryFlipped.push(cardId);
    this._renderMemoryGrid();

    if (this._memoryFlipped.length === 2) {
      this._memoryLockBoard = true;
      const [id1, id2] = this._memoryFlipped;
      const c1 = this._memoryCards[id1];
      const c2 = this._memoryCards[id2];

      if (c1.symbol === c2.symbol) {
        // Match
        c1.matched = c2.matched = true;
        this._memoryFlipped = [];
        this._memoryPairs++;
        this._memoryLockBoard = false;
        const pairsEl = document.getElementById('memory-pairs');
        if (pairsEl) pairsEl.textContent = this._memoryPairs;
        this._renderMemoryGrid();

        // Reward per coppia trovata
        const pairReward = Game.applyPairReward();
        if (pairReward.ingredient) {
          UI.toast(`✨ +${pairReward.xp} PE  ${pairReward.ingredient.icon} ${pairReward.ingredient.name}`, 2000);
        } else {
          UI.toast(`✨ +${pairReward.xp} PE`, 1500);
        }
        if (pairReward.levelUpResult) this._triggerLevelUp(pairReward.levelUpResult);

        if (this._memoryPairs === 6) {
          // Vince!
          clearInterval(this._memoryTimerInterval);
          this._memoryTimerInterval = null;
          UI.showMemoryResult(true, this._memoryTimeLeft, this._memoryErrors, []);
        }
      } else {
        // Mismatch
        this._memoryErrors++;
        const errEl = document.getElementById('memory-errors');
        if (errEl) errEl.textContent = this._memoryErrors;

        setTimeout(() => {
          c1.flipped = c2.flipped = false;
          this._memoryFlipped = [];
          this._memoryLockBoard = false;
          this._renderMemoryGrid();

          if (this._memoryErrors >= this._memoryMaxErrors) {
            clearInterval(this._memoryTimerInterval);
            this._memoryTimerInterval = null;
            this._memoryLockBoard = true;
            UI.showMemoryResult(false, this._memoryTimeLeft, this._memoryErrors, []);
          }
        }, 800);
      }
    }
  },

};

/* ─── Avvio ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => App.init());
