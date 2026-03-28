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
  // Preghiera (Chierico)
  _prayAnimFrameId:   null,
  _prayLastFrameTs:   0,
  _prayPhase:         'idle',
  _prayTime:          0,
  _prayTimeLeft:      18,
  _prayDevotion:      0,
  _praySphereX:       180,
  _praySphereY:       220,
  _prayParticles:     [],
  _prayTrail:         [],
  _prayGraceActive:   false,
  _prayGraceTimer:    0,
  _prayNextGrace:     3,
  _prayGraceCaught:   0,
  // Arena (Guerriero)
  _arenaRunning:        false,
  _arenaEnemies:        [],
  _arenaSwings:         [],
  _arenaParticles:      [],
  _arenaKillCount:      0,
  _arenaXpEarned:       0,
  _arenaGoldEarned:     0,
  _arenaTimeLeft:       30,
  _arenaSpawnTimer:     0,
  _arenaMouseX:         300,
  _arenaMouseY:         190,
  _arenaLastFrameTs:    0,
  _arenaAnimFrameId:    null,
  _arenaEnemyIdCtr:     0,
  _arenaOver:           false,
  _arenaDefeated:       false,
  _ARENA_ENEMY_TYPES: [
    { name: 'Goblin',  hp: 1,  color: '#9e9e9e', xpVal: 8,   goldVal: 3,  radius: 14, speed: 62 },
    { name: 'Orco',    hp: 3,  color: '#4caf50', xpVal: 22,  goldVal: 9,  radius: 18, speed: 50 },
    { name: 'Troll',   hp: 6,  color: '#2196f3', xpVal: 44,  goldVal: 20, radius: 22, speed: 38 },
    { name: 'Drago',   hp: 9,  color: '#9c27b0', xpVal: 88,  goldVal: 42, radius: 26, speed: 28 },
    { name: 'Lich',    hp: 12, color: '#ff9800', xpVal: 180, goldVal: 85, radius: 30, speed: 20 },
  ],
  // Gara di Bevute (Guerriero)
  _drinkAnimFrameId:    null,
  _drinkLastTime:       null,
  _drinkCurrentLevel:   0.5,
  _drinkingRoundsWon:   0,
  _drinkingRoundIdx:    0,
  _drinkRoundConfigs: [
    { speed: 1.2, targetSize: 0.28, label: 'Round 1 — Inizia la sfida!' },
    { speed: 1.8, targetSize: 0.20, label: 'Round 2 — Stai barcollando...' },
    { speed: 2.6, targetSize: 0.13, label: 'Finale! Concentrati!' },
  ],

  // Stalla (Paladino)
  _stable: null,
  _STABLE_LANES: [
    { icon: '🌾', color: '#c9a84c', name: 'Paglia'   },
    { icon: '🪮', color: '#52b788', name: 'Spazzola'  },
    { icon: '🐎', color: '#e67e22', name: 'Corsa'     },
    { icon: '🥕', color: '#e74c3c', name: 'Carote'    },
    { icon: '💧', color: '#3498db', name: 'Acqua'     },
  ],

  /* ─── Stat info modal builder ─────────────────────────── */
  _buildStatInfo(stat, cls) {
    const id = cls?.id || '';
    const clsName = cls?.name || 'il tuo personaggio';

    const row = (icon, label, text) =>
      `<div class="d-flex gap-2 mb-2"><span style="font-size:1.2rem;min-width:1.6rem">${icon}</span><div><strong>${label}</strong><div class="text-muted small">${text}</div></div></div>`;

    if (stat === 'xp') {
      const classRows = {
        ladro:    row('🎲', 'Ladro', 'Guadagni PE anche borseggiando, rubando al mercato e giocando ai dadi. Più rischi prendi, più cresci in fretta.'),
        mago:     row('✨', 'Mago', 'Ottieni PE craftando incantesimi, canalizzando magia senza componenti, studiando e consegnando commissioni.'),
        druido:   row('🌿', 'Druido', 'Ottieni PE preparando pozioni, studiando ricette naturali e completando missioni con la natura.'),
        guerriero:row('⚔️', 'Guerriero', 'Ottieni PE vincendo all\'arena, nelle gare di bevute e completando missioni di combattimento.'),
        paladino: row('🛡️', 'Paladino', 'Ottieni PE salvando prigionieri, addestrando il tuo destriero e completando missioni di protezione.'),
        chierico: row('🙏', 'Chierico', 'Ottieni PE pregando, convertendo fedeli e superando prove di devozione divina.'),
      };
      return {
        title: '⭐ Esperienza (PE)',
        body: `
          <p class="text-muted small">I Punti Esperienza (PE) misurano la tua crescita come avventuriero. Raggiungi la soglia del tuo livello attuale per <strong>salire di livello</strong> e migliorare le caratteristiche.</p>
          <p class="text-muted small">Guadagni PE completando <strong>missioni</strong>, usando le <strong>abilità di classe</strong> e svolgendo azioni quotidiane.</p>
          <hr class="border-secondary my-2">
          <div class="small text-gold mb-1">Fonti di PE per ${clsName}:</div>
          ${classRows[id] || ''}
          <div class="text-muted small mt-2">💡 Più sei attivo ogni giorno, più velocemente sali di livello.</div>`,
      };
    }

    if (stat === 'fame') {
      const classRows = {
        ladro:    row('⚠️', 'Attenzione', 'Troppa fama come Ladro aumenta anche la tua <strong>Taglia</strong>: più sei noto, più sei un bersaglio ambito.'),
        mago:     row('📜', 'Mago', 'Una fama alta attira clienti con commissioni di incantesimi più preziose e rare.'),
        druido:   row('🌱', 'Druido', 'La fama apre l\'accesso a richieste di pozioni rare e missioni con ricompense naturali esclusive.'),
        guerriero:row('🏆', 'Guerriero', 'La fama dell\'arena attira avversari più forti — e premi molto più ricchi.'),
        paladino: row('⚔️', 'Paladino', 'La fama da eroe sblocca missioni di protezione ad alto rischio con grandi ricompense in oro e PE.'),
        chierico: row('✝️', 'Chierico', 'Una fama elevata attira fedeli più devoti e aumenta il guadagno dalla conversione e dalle offerte.'),
      };
      return {
        title: '🌟 Fama',
        body: `
          <p class="text-muted small">La Fama è il tuo <strong>prestigio</strong> in città. Più è alta, più <strong>missioni esclusive</strong> diventano disponibili — alcune richiedono una soglia minima per essere accettate.</p>
          <p class="text-muted small">Aumenta completando missioni, azioni nobili e consegnando commissioni di qualità.</p>
          <hr class="border-secondary my-2">
          <div class="small text-gold mb-1">Effetti speciali per ${clsName}:</div>
          ${classRows[id] || ''}
          <div class="text-muted small mt-2">💡 Tieni la fama alta per accedere alle missioni più redditizie ogni giorno.</div>`,
      };
    }

    if (stat === 'wanted') {
      if (id === 'ladro') {
        return {
          title: '💀 Taglia',
          body: `
            <p class="text-muted small">Come Ladro, la <strong>Taglia</strong> è il prezzo sulla tua testa. Cresce quando vieni scoperto a rubare, fallisci un borseggio o completi azioni illecite.</p>
            <div class="mb-2">${row('🚨', 'Soglie critiche', 'Superata una certa soglia di taglia, <strong>un Cacciatore di Taglie</strong> ti blocca la strada. Devi affrontarlo (e batterlo) prima di poter avanzare al giorno successivo.')}</div>
            <div class="mb-2">${row('📉', 'Come ridurla', 'Affronta e sconfiggi il cacciatore di taglie oppure completa la missione taglia speciale.')}</div>
            <div class="text-warning small mt-2">⚠️ Ogni furto fallito al mercato aumenta taglia, riduce fama e ti vieta gli acquisti per quel giorno.</div>`,
        };
      }
      return {
        title: '👁️ Visibilità',
        body: `
          <p class="text-muted small">La <strong>Visibilità</strong> misura quanto ${clsName} è esposto agli sguardi delle fazioni cittadine, dei ladri e delle organizzazioni criminali. Cresce ogni giorno e con le missioni completate.</p>
          <div class="mb-2">${row('📈', 'Come cresce', '+4 al giorno (notorietà passiva) +3 su missione completata, +6 su parziale, +12/+20 su fallimento critico.')}</div>
          <div class="mb-2">${row('🗡️', 'Incontro obbligatorio', 'Sopra una certa soglia un <strong>ladro</strong> tenta di derubarti. Devi risolvere l\'incontro prima di avanzare al giorno successivo.')}</div>
          <div class="mb-2">${row('📉', 'Come diminuisce', 'Rispondere all\'attacco del ladro riduce la visibilità: −25 se derubato (stai più basso di profilo), −8/−15 se lo respingi.')}</div>
          <div class="text-muted small mt-2">💡 La visibilità crea un ciclo naturale: cresce con l\'attività, si riduce dopo ogni incontro. Gestiscila come parte del ritmo quotidiano.</div>`,
      };
    }

    if (stat === 'tax') {
      const tax = Game.guildTax ? Game.guildTax() : '?';
      const classRows = {
        ladro:    row('🎲', 'Suggerimento', 'Borseggia ogni giorno e vendi i bottini — bastano pochi colpi riusciti per coprire la tassa.'),
        mago:     row('✨', 'Suggerimento', 'Canalizza incantesimi al mattino e vendili subito. Consegna commissioni per un guadagno doppio.'),
        druido:   row('🌿', 'Suggerimento', 'Prepara pozioni ogni giorno e consegna le richieste attive per incassare oro rapidamente.'),
        guerriero:row('⚔️', 'Suggerimento', 'L\'arena è il modo più veloce per guadagnare. Due combattimenti al giorno coprono la tassa e avanzano.'),
        paladino: row('🛡️', 'Suggerimento', '"Salva i Prigionieri" garantisce buoni guadagni. Usa anche le missioni giornaliere per integrare.'),
        chierico: row('🙏', 'Suggerimento', 'Prega, converti fedeli e accetta offerte. Le missioni di guarigione sono spesso le più redditizie.'),
      };
      return {
        title: '🏦 Tassa Giornaliera Gilda',
        body: `
          <p class="text-muted small">Ogni giorno la <strong>Gilda degli Avventurieri</strong> riscuote una quota fissa di <strong>${tax} mo</strong> come contributo per l\'uso dei servizi (missioni, mercato, strutture).</p>
          <p class="text-muted small">Se al momento del passaggio al giorno successivo non hai abbastanza oro, subisci una <strong>penalità in Fama</strong>.</p>
          <hr class="border-secondary my-2">
          <div class="small text-gold mb-1">Come coprirla con ${clsName}:</div>
          ${classRows[id] || ''}
          <div class="text-muted small mt-2">💡 Le missioni giornaliere sono progettate per coprire almeno la tassa — completane una ogni giorno.</div>`,
      };
    }

    return { title: '', body: '' };
  },

  /* ─── Bootstrap ───────────────────────────────────────── */
  init() {
    // Tema (light/dark) — ripristina preferenza salvata
    const savedTheme = localStorage.getItem('badhero_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this._updateThemeToggleIcon(savedTheme);

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

  _updateThemeToggleIcon(theme) {
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = theme === 'light' ? '🌙' : '☀️';
  },

  /* ─── Binding eventi ──────────────────────────────────── */
  _bindEvents() {

    // Toggle tema chiaro / scuro
    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('badhero_theme', next);
      this._updateThemeToggleIcon(next);
    });

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

    // Creazione PG — assegna casualmente
    document.getElementById('btn-random-assign').addEventListener('click', () => {
      if (!this._rolledValues || !this._rolledValues.length) return;
      // Shuffle indices 0..5
      const indices = this._rolledValues.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const selects = document.querySelectorAll('.stat-assign');
      selects.forEach((sel, i) => { sel.value = String(indices[i]); });
      UI._updateRolledPills(this._rolledValues);
      UI._updateConfirmBtn();
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

    // Stat info trigger — etichette cliccabili
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.stat-info-trigger');
      if (!trigger || !Game.state) return;
      const stat  = trigger.dataset.statInfo;
      const cls   = Game.getClasse();
      const modal = document.getElementById('modal-stat-info');
      if (!modal) return;
      const { title, body } = this._buildStatInfo(stat, cls);
      document.getElementById('stat-info-title').innerHTML = title;
      document.getElementById('stat-info-body').innerHTML  = body;
      bootstrap.Modal.getOrCreateInstance(modal).show();
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

    // Gara di Bevute — apre minigioco
    document.getElementById('btn-drinking-game').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const result = Game.startDrinkingGame();
      if (!result.ok) { UI.toast(result.reason || 'Già sfidato oggi.'); return; }
      this._drinkingRoundsWon = 0;
      this._drinkingRoundIdx  = 0;
      UI.openDrinkingGame();
      setTimeout(() => this._startDrinkingRound(0), 300);
      UI.refresh();
    });

    // Bevi! — click durante il minigioco
    document.getElementById('btn-drink').addEventListener('click', () => {
      if (this._drinkAnimFrameId === null) return;
      cancelAnimationFrame(this._drinkAnimFrameId);
      this._drinkAnimFrameId = null;
      this._drinkLastTime    = null;

      const config     = this._drinkRoundConfigs[this._drinkingRoundIdx];
      const targetBot  = 0.5 - config.targetSize / 2;
      const targetTop  = 0.5 + config.targetSize / 2;
      const hit        = this._drinkCurrentLevel >= targetBot && this._drinkCurrentLevel <= targetTop;

      UI.updateDrinkingDot(this._drinkingRoundIdx, hit);
      if (hit) this._drinkingRoundsWon++;

      // Flash feedback sul boccale
      const mug = document.getElementById('drinking-mug');
      mug.style.borderColor = hit ? '#52b788' : '#e74c3c';
      setTimeout(() => { mug.style.borderColor = ''; }, 400);

      this._drinkingRoundIdx++;
      const roundsDone = this._drinkingRoundIdx;
      const won  = this._drinkingRoundsWon >= 2;
      const lost = (roundsDone - this._drinkingRoundsWon) >= 2;

      if (won || lost || roundsDone >= 3) {
        const result = Game.applyDrinkingResult(this._drinkingRoundsWon);
        UI.showDrinkingResult(result);
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
        // Prossimo round dopo breve pausa
        const drunkTexts = ['Sobrio', 'Alticcio', 'Ubriaco', 'Completamente sbronzo'];
        document.getElementById('drunk-bar-fill').style.width = `${this._drinkingRoundIdx * 33}%`;
        document.getElementById('drunk-level-text').textContent = drunkTexts[this._drinkingRoundIdx] || 'Ubriaco';
        setTimeout(() => this._startDrinkingRound(this._drinkingRoundIdx), 600);
      }
    });

    // Chiusura modal bevute — ferma animazione
    document.getElementById('modal-drinking').addEventListener('hidden.bs.modal', () => {
      cancelAnimationFrame(this._drinkAnimFrameId);
      this._drinkAnimFrameId = null;
      this._drinkLastTime    = null;
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

    // Incantesimi preparati: vendi
    document.getElementById('spell-inventory').addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-sell-spell');
      if (!btn || !Game.state) return;
      const spellId = btn.dataset.sellSpellId;
      const result  = Game.sellSpell(spellId);
      if (result.ok) {
        UI.toast(`💰 "${result.recipe.name}" venduto per ${result.sellPrice} mo.`);
        UI.renderIncantesimiTab();
        UI.renderCharacter();
      } else {
        UI.toast(result.reason);
      }
    });

    // Crea incantesimo senza componenti
    document.getElementById('btn-free-spell').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const result = Game.createSpellFree();
      if (!result.ok) { UI.toast(result.reason); return; }

      const signInt = result.intMod >= 0 ? '+' : '';
      const rollStr = `D20 (${result.roll}) ${signInt}${result.intMod} INT = <strong>${result.total}</strong> vs CD ${result.dc}`;
      const modalEl = document.getElementById('modal-spell-result');
      if (modalEl) {
        if (result.success) {
          const r = result.recipe;
          document.getElementById('spell-result-icon').textContent  = r.icon || '✨';
          document.getElementById('spell-result-title').textContent = 'Canalizzazione riuscita!';
          document.getElementById('spell-result-title').className   = 'fs-5 fw-bold mb-2 text-success';
          document.getElementById('spell-result-roll').innerHTML    = rollStr;
          document.getElementById('spell-result-detail').innerHTML  =
            `<div class="fw-semibold">${r.name}</div>` +
            `<div class="text-muted small">${r.desc || ''}</div>` +
            `<div class="text-success mt-1">+${result.xpGained} PE</div>`;
        } else {
          document.getElementById('spell-result-icon').textContent  = '😓';
          document.getElementById('spell-result-title').textContent = 'Canalizzazione fallita';
          document.getElementById('spell-result-title').className   = 'fs-5 fw-bold mb-2 text-danger';
          document.getElementById('spell-result-roll').innerHTML    = rollStr;
          document.getElementById('spell-result-detail').innerHTML  =
            `<div class="text-muted small">La magia ti ha sfuggito di mano… ma qualcosa hai imparato.</div>` +
            `<div class="text-warning mt-1">+8 PE per il tentativo</div>`;
        }
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
        clearTimeout(this._spellModalTimer);
        this._spellModalTimer = setTimeout(() => modal.hide(), 5000);
      }

      // Aggiorna immediatamente l'inventario incantesimi
      UI.renderIncantesimiTab();
      UI.renderCharacter();
      if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
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

    // Attacco Ladro — approcci con dado
    document.getElementById('thief-approaches').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-thief-stat]');
      if (!btn || btn.disabled) return;
      if (!Game.state || Game.state.gameOver) return;

      const stat = btn.dataset.thiefStat;
      const dc   = parseInt(btn.dataset.thiefDc);
      const result = Game.resolveThiefAttack(stat, dc);

      // Disabilita tutti i bottoni
      document.querySelectorAll('#thief-approaches button').forEach(b => b.disabled = true);

      // Mostra risultato in modal
      const statLabel = { str:'Forza', dex:'Destrezza', wis:'Saggezza', int:'Intelligenza', cha:'Carisma', con:'Costituzione' };
      const statAbr   = { str:'FOR', dex:'DES', wis:'SAG', int:'INT', cha:'CAR', con:'COS' };
      const isCrit    = result.check.result === 'nat20';
      const isCritFail= result.check.result === 'nat1';
      const rollLine  = `D20 (${result.check.roll}) ${result.check.bonus >= 0 ? '+' : ''}${result.check.bonus} ${statAbr[stat]} = <strong>${result.check.total}</strong> vs DC ${result.check.dc}`;

      const modalEl = document.getElementById('modal-thief-result');
      if (modalEl) {
        if (result.ok) {
          const partial = result.partial;
          document.getElementById('thief-result-modal-title').innerHTML     = partial ? '⚠️ Ladro in fuga' : '✅ Ladro sconfitto!';
          document.getElementById('thief-result-modal-title').className     = 'modal-title ' + (partial ? 'text-warning' : 'text-success');
          document.getElementById('thief-result-modal-icon').textContent    = isCrit ? '🎉' : partial ? '😤' : '💪';
          document.getElementById('thief-result-modal-outcome').textContent = isCrit
            ? 'Colpo critico! Il ladro non aveva scampo.'
            : partial ? 'Riesci a respingerlo, ma non senza fatica.'
            : `Hai usato ${statLabel[stat]} per sventare l'attacco.`;
          document.getElementById('thief-result-modal-outcome').className   = 'fs-5 fw-bold ' + (partial ? 'text-warning' : 'text-success');
          document.getElementById('thief-result-modal-roll').innerHTML      = rollLine;
          document.getElementById('thief-result-modal-rewards').innerHTML   =
            `<div class="d-flex flex-column gap-1">` +
            `<div class="text-success">+${result.xp} PE</div>` +
            `<div class="text-success">+${result.fame} fama</div>` +
            (result.goldGained ? `<div class="text-warning">+${result.goldGained} mo (presi al ladro)</div>` : '') +
            `<div class="text-info small">👁️ Visibilità −${result.visReduction}</div>` +
            `</div>`;
        } else {
          document.getElementById('thief-result-modal-title').innerHTML     = isCritFail ? '💀 Fallimento critico!' : '❌ Sei stato derubato';
          document.getElementById('thief-result-modal-title').className     = 'modal-title text-danger';
          document.getElementById('thief-result-modal-icon').textContent    = isCritFail ? '😱' : '😔';
          document.getElementById('thief-result-modal-outcome').textContent = isCritFail
            ? 'Il ladro ti ha colpito e ferito prima di fuggire.'
            : 'Il ladro è stato più veloce. La borsa è alleggerita.';
          document.getElementById('thief-result-modal-outcome').className   = 'fs-5 fw-bold text-danger';
          document.getElementById('thief-result-modal-roll').innerHTML      = rollLine;
          document.getElementById('thief-result-modal-rewards').innerHTML   =
            `<div class="d-flex flex-column gap-1">` +
            `<div class="text-danger">−${result.goldLost} mo</div>` +
            `<div class="text-info small">👁️ Visibilità −${result.visReduction} (stai più basso di profilo)</div>` +
            `</div>`;
        }
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }

      UI.refresh();
      if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
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

    // Prega — apri modal
    document.getElementById('btn-prayer').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const res = Game.startPray();
      if (!res.ok) { UI.toast(res.reason || 'Hai già pregato oggi.'); return; }
      UI.refresh();
      const modal = new bootstrap.Modal(document.getElementById('modal-prayer'));
      modal.show();
      setTimeout(() => this._startPrayerAnimation(), 300);
    });

    // Amen! — click durante la preghiera
    document.getElementById('btn-amen').addEventListener('click', () => {
      this._prayHandleAmen();
    });

    // Conversione — avvia gioco
    document.getElementById('btn-conv-start').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const res = Game.startConversion();
      if (!res.ok) { UI.toast(res.reason || 'Hai già evangelizzato oggi.'); return; }
      UI.refresh();
      this._startConversionGame();
    });

    // Conversione — chiudi risultato
    document.getElementById('btn-conv-close').addEventListener('click', () => {
      document.getElementById('conv-result').classList.add('d-none');
      document.getElementById('conv-lobby').classList.remove('d-none');
      UI.refresh();
    });

    // Salva i Prigionieri (Paladino) — tab
    document.getElementById('btn-rescue-start').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const res = Game.startRescue();
      if (!res.ok) { UI.toast(res.reason || 'Nessuna missione disponibile oggi.'); return; }
      UI.refresh();
      document.getElementById('rescue-lobby').classList.add('d-none');
      document.getElementById('rescue-result').classList.add('d-none');
      document.getElementById('rescue-game-area').classList.remove('d-none');
      this._startRescueGame();
    });

    document.getElementById('btn-rescue-again').addEventListener('click', () => {
      document.getElementById('rescue-result').classList.add('d-none');
      document.getElementById('rescue-lobby').classList.remove('d-none');
      UI.refresh();
    });

    document.getElementById('rescue-canvas').addEventListener('click', (e) => {
      const s = this._rescue;
      if (!s || !s.running) return;
      const canvas = e.currentTarget;
      const rect   = canvas.getBoundingClientRect();
      const sx     = canvas.width  / rect.width;
      const sy     = canvas.height / rect.height;
      const mx     = (e.clientX - rect.left) * sx;
      const my     = (e.clientY - rect.top)  * sy;
      this._rescueHandleClick(mx, my, canvas);
    });

    document.getElementById('rescue-canvas').addEventListener('mousemove', (e) => {
      const s = this._rescue;
      if (!s || !s.running) return;
      const canvas = e.currentTarget;
      const rect   = canvas.getBoundingClientRect();
      const sx     = canvas.width  / rect.width;
      const sy     = canvas.height / rect.height;
      const mx     = (e.clientX - rect.left) * sx;
      const my     = (e.clientY - rect.top)  * sy;
      // Check if hovering an attackable enemy for cursor change
      let onEnemy = false;
      for (const camp of s.camps) {
        for (const en of camp.enemies) {
          if (!en.alive) continue;
          const d = Math.hypot(mx - en.x, my - en.y);
          const pd = Math.hypot(s.paladin.x - en.x, s.paladin.y - en.y);
          if (d <= 14 && pd <= 80) { onEnemy = true; break; }
        }
        if (onEnemy) break;
      }
      canvas.style.cursor = onEnemy ? 'crosshair' : 'pointer';
    });

    // Stalla (Paladino) — apri modal
    document.getElementById('btn-stable').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      const res = Game.startStable();
      if (!res.ok) { UI.toast(res.reason || 'Hai già accudito il cavallo oggi.'); return; }
      UI.refresh();
      document.getElementById('stable-game').classList.remove('d-none');
      document.getElementById('stable-result').classList.add('d-none');
      new bootstrap.Modal(document.getElementById('modal-stable')).show();
      this._startStableGame();
    });

    // Stalla — chiudi modal: ferma animazione
    document.getElementById('modal-stable').addEventListener('hidden.bs.modal', () => {
      if (this._stable) { this._stable.running = false; cancelAnimationFrame(this._stable.rafId); }
      UI.refresh();
    });

    // Stalla — bottoni lane
    document.querySelectorAll('.btn-stable-lane').forEach(btn => {
      btn.addEventListener('click', () => {
        const lane = parseInt(btn.dataset.lane);
        this._stableHandleLaneClick(lane);
      });
    });

    // Conversione — mouse sul canvas
    document.getElementById('conv-canvas').addEventListener('mousemove', (e) => {
      if (!this._conv || !this._conv.running) return;
      const rect = e.target.getBoundingClientRect();
      const scaleX = e.target.width  / rect.width;
      const scaleY = e.target.height / rect.height;
      this._conv.clericX = (e.clientX - rect.left) * scaleX;
      this._conv.clericY = (e.clientY - rect.top)  * scaleY;
    });
    document.getElementById('conv-canvas').addEventListener('mouseleave', () => {
      if (this._conv) { this._conv.clericX = -300; this._conv.clericY = -300; }
    });

    // Scaccia! — click durante la preghiera
    document.getElementById('btn-scaccia').addEventListener('click', () => {
      this._prayHandleScaccia();
    });

    // Chiusura modal preghiera
    document.getElementById('modal-prayer').addEventListener('hidden.bs.modal', () => {
      if (this._prayAnimFrameId) {
        cancelAnimationFrame(this._prayAnimFrameId);
        this._prayAnimFrameId = null;
      }
      this._prayPhase = 'idle';
      document.getElementById('btn-scaccia').classList.add('d-none');
      document.getElementById('btn-scaccia').classList.remove('demon-active');
      UI.refresh();
    });

    // Arena — entra
    document.getElementById('btn-arena-start').addEventListener('click', () => {
      if (!Game.state || Game.state.gameOver) return;
      this._startArena();
    });

    // Arena — gioca ancora
    document.getElementById('btn-arena-again').addEventListener('click', () => {
      document.getElementById('arena-result').classList.add('d-none');
      document.getElementById('arena-lobby').classList.remove('d-none');
      UI.renderArenaLobby();
    });

    // Arena — mouse tracking sul canvas
    const arenaCanvas = document.getElementById('arena-canvas');
    arenaCanvas.addEventListener('mousemove', (e) => {
      const rect = arenaCanvas.getBoundingClientRect();
      const scaleX = arenaCanvas.width  / rect.width;
      const scaleY = arenaCanvas.height / rect.height;
      this._arenaMouseX = (e.clientX - rect.left) * scaleX;
      this._arenaMouseY = (e.clientY - rect.top)  * scaleY;
    });

    // Arena — click per colpire
    arenaCanvas.addEventListener('click', (e) => {
      if (!this._arenaRunning || this._arenaOver) return;
      const rect = arenaCanvas.getBoundingClientRect();
      const scaleX = arenaCanvas.width  / rect.width;
      const scaleY = arenaCanvas.height / rect.height;
      const cx = (e.clientX - rect.left) * scaleX;
      const cy = (e.clientY - rect.top)  * scaleY;
      this._arenaHandleClick(cx, cy);
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

  /* ─── Gara di Bevute ────────────────────────────────────── */
  _startDrinkingRound(roundIdx) {
    const config = this._drinkRoundConfigs[roundIdx];
    document.getElementById('drinking-instruction').textContent = config.label;

    // Imposta zona target (centrata al 50%, altezza = targetSize)
    const tz = document.getElementById('drinking-target-zone');
    tz.style.bottom = `${(0.5 - config.targetSize / 2) * 100}%`;
    tz.style.height = `${config.targetSize * 100}%`;

    // Ripristina colore boccale
    document.getElementById('drinking-mug').style.borderColor = '';

    const tick = (ts) => {
      if (!this._drinkLastTime) this._drinkLastTime = ts;
      const dt = (ts - this._drinkLastTime) / 1000;
      this._drinkLastTime = ts;
      this._drinkCurrentLevel = 0.5 + 0.45 * Math.sin(ts / 1000 * config.speed);
      document.getElementById('drinking-liquid').style.height = `${this._drinkCurrentLevel * 100}%`;
      document.getElementById('drinking-foam').style.bottom   = `${this._drinkCurrentLevel * 100}%`;
      this._drinkAnimFrameId = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(this._drinkAnimFrameId);
    this._drinkLastTime    = null;
    this._drinkAnimFrameId = requestAnimationFrame(tick);
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

  stealItem(itemId) {
    if (!Game.state) return;
    const result = Game.stealItem(itemId);
    if (!result.ok) { UI.toast(result.reason); return; }

    const signDex = result.dexMod >= 0 ? '+' : '';
    const rollStr = `D20 (${result.roll}) ${signDex}${result.dexMod} DES = <strong>${result.total}</strong> vs DC ${result.dc}`;
    const modalEl = document.getElementById('modal-steal-result');
    if (modalEl) {
      document.getElementById('steal-result-icon').textContent    = result.success ? '🗝️' : '🚨';
      document.getElementById('steal-result-title').textContent   = result.success ? 'Furto riuscito!' : 'Beccato!';
      document.getElementById('steal-result-title').className     = 'fs-5 fw-bold mb-2 ' + (result.success ? 'text-success' : 'text-danger');
      document.getElementById('steal-result-roll').innerHTML      = rollStr;
      if (result.success) {
        const item = DB.items.find(i => i.id === itemId);
        document.getElementById('steal-result-rewards').innerHTML =
          `<span class="text-success">+1 ${item ? item.name : 'oggetto'}</span> aggiunto all'inventario.`;
      } else {
        document.getElementById('steal-result-rewards').innerHTML =
          `<div class="text-danger">−${result.goldLost} <i class="bi bi-coin"></i> oro</div>` +
          `<div class="text-warning">−${result.fameLost} fama</div>` +
          `<div class="text-danger">+${result.wantedGain} taglia</div>` +
          `<div class="text-muted small mt-2">Il mercante ti ha riconosciuto — bandito per oggi.</div>`;
      }
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
      clearTimeout(this._stealModalTimer);
      this._stealModalTimer = setTimeout(() => modal.hide(), 5000);
    }
    UI.refresh();
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

  /* ─── Arena ─────────────────────────────────────────────── */
  _startArena() {
    const check = Game.startArena();
    if (!check.ok) { UI.toast(check.reason || "Arena non disponibile."); return; }
    const level = Game.state.character.level;
    this._arenaRunning    = true;
    this._arenaOver       = false;
    this._arenaDefeated   = false;
    this._arenaEnemies    = [];
    this._arenaSwings     = [];
    this._arenaParticles  = [];
    this._arenaKillCount  = 0;
    this._arenaXpEarned   = 0;
    this._arenaGoldEarned = 0;
    this._arenaTimeLeft   = 30 + level * 5;
    this._arenaSpawnTimer = 0;
    this._arenaEnemyIdCtr = 0;
    this._arenaLastFrameTs = 0;

    document.getElementById('arena-lobby').classList.add('d-none');
    document.getElementById('arena-result').classList.add('d-none');
    document.getElementById('arena-game-area').classList.remove('d-none');
    this._updateArenaHUD();

    if (this._arenaAnimFrameId) cancelAnimationFrame(this._arenaAnimFrameId);
    this._arenaAnimFrameId = requestAnimationFrame((ts) => this._arenaLoop(ts));
  },

  _arenaGetSpawnPool() {
    const k = this._arenaKillCount;
    const all = this._ARENA_ENEMY_TYPES;
    if (k < 5)  return all.slice(0, 1);
    if (k < 12) return all.slice(0, 2);
    if (k < 25) return all.slice(0, 3);
    if (k < 45) return all.slice(0, 4);
    return all;
  },

  _arenaSpawnEnemy() {
    const pool = this._arenaGetSpawnPool();
    const type = pool[Math.floor(Math.random() * pool.length)];
    const W = 600, H = 380;
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = Math.random() * W; y = -type.radius; }
    else if (side === 1) { x = W + type.radius; y = Math.random() * H; }
    else if (side === 2) { x = Math.random() * W; y = H + type.radius; }
    else { x = -type.radius; y = Math.random() * H; }
    this._arenaEnemies.push({
      id: this._arenaEnemyIdCtr++,
      type,
      x, y,
      hp: type.hp,
      maxHp: type.hp,
    });
  },

  _arenaLoop(ts) {
    if (!this._arenaRunning) return;
    const dt = this._arenaLastFrameTs ? Math.min((ts - this._arenaLastFrameTs) / 1000, 0.1) : 0.016;
    this._arenaLastFrameTs = ts;

    const W = 600, H = 380, cx = W / 2, cy = H / 2;

    // Timer
    this._arenaTimeLeft -= dt;
    if (this._arenaTimeLeft <= 0) {
      this._arenaTimeLeft = 0;
      this._arenaEndGame(false);
      return;
    }

    // Spawn — interval decreases with kills, multiple spawns at high counts
    const spawnInterval = Math.max(0.3, 1.4 - this._arenaKillCount * 0.02);
    this._arenaSpawnTimer += dt;
    if (this._arenaSpawnTimer >= spawnInterval) {
      this._arenaSpawnTimer = 0;
      this._arenaSpawnEnemy();
      // Extra spawn at higher kill counts
      if (this._arenaKillCount >= 20 && Math.random() < 0.45) this._arenaSpawnEnemy();
      if (this._arenaKillCount >= 40 && Math.random() < 0.35) this._arenaSpawnEnemy();
    }

    // Move enemies toward center
    for (const e of this._arenaEnemies) {
      const dx = cx - e.x, dy = cy - e.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      e.x += (dx / dist) * e.type.speed * dt;
      e.y += (dy / dist) * e.type.speed * dt;
      // Check if reached warrior
      if (dist < 28) {
        this._arenaEndGame(true);
        return;
      }
    }

    // Update particles
    for (const p of this._arenaParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    this._arenaParticles = this._arenaParticles.filter(p => p.life > 0);

    // Update swings
    for (const s of this._arenaSwings) s.life -= dt;
    this._arenaSwings = this._arenaSwings.filter(s => s.life > 0);

    this._arenaRender();
    this._updateArenaHUD();
    this._arenaAnimFrameId = requestAnimationFrame((ts2) => this._arenaLoop(ts2));
  },

  _arenaRender() {
    const canvas = document.getElementById('arena-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    // Background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, W, H);

    // Arena circle
    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 200);
    grad.addColorStop(0, 'rgba(139,69,19,0.18)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(201,168,76,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 160, 0, Math.PI * 2);
    ctx.stroke();

    // Particles
    for (const p of this._arenaParticles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Swings
    for (const s of this._arenaSwings) {
      const alpha = s.life / 0.25;
      ctx.strokeStyle = `rgba(255,220,100,${alpha * 0.7})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, s.startAngle, s.endAngle);
      ctx.stroke();
    }

    // Enemies
    for (const e of this._arenaEnemies) {
      // Outline
      ctx.strokeStyle = e.type.color;
      ctx.lineWidth = 3;
      ctx.shadowColor = e.type.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.type.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill
      ctx.fillStyle = e.type.color + '33';
      ctx.fill();

      // HP dots arranged in a circle around the enemy
      {
        const total    = e.maxHp;
        const dotR     = total > 6 ? 2.5 : 3;
        const orbitR   = e.type.radius + 9;
        const angleStep = (Math.PI * 2) / total;
        for (let i = 0; i < total; i++) {
          const angle = -Math.PI / 2 + i * angleStep;
          const dx = Math.cos(angle) * orbitR;
          const dy = Math.sin(angle) * orbitR;
          ctx.fillStyle = i < e.hp ? e.type.color : 'rgba(40,40,40,0.8)';
          ctx.strokeStyle = i < e.hp ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(e.x + dx, e.y + dy, dotR, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }

      // Emoji label
      ctx.font = `${e.type.radius}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      const icons = ['👺','👹','🧌','🐲','💀'];
      const idx = this._ARENA_ENEMY_TYPES.indexOf(e.type);
      ctx.fillText(icons[idx] || '👹', e.x, e.y);
    }

    // Warrior at center
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚔️', cx, cy);

    // Sword cursor
    ctx.font = '24px serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('🗡️', this._arenaMouseX - 4, this._arenaMouseY - 20);
  },

  _arenaHandleClick(cx, cy) {
    // Find closest enemy within hit range
    let closest = null, closestDist = Infinity;
    for (const e of this._arenaEnemies) {
      const dx = e.x - cx, dy = e.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < e.type.radius + 22 && dist < closestDist) {
        closest = e;
        closestDist = dist;
      }
    }

    // Swing animation
    const isDouble = Game.getEquipmentAbilities().arenaDoubleHit;
    this._arenaSwings.push({ x: cx, y: cy, radius: isDouble ? 48 : 36, startAngle: -0.8, endAngle: 0.8, life: 0.25, double: isDouble });

    if (closest) {
      const doubleHit = Game.getEquipmentAbilities().arenaDoubleHit;
      closest.hp -= doubleHit ? 2 : 1;
      if (closest.hp <= 0) {
        // Spawn particles
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const speed = 60 + Math.random() * 80;
          this._arenaParticles.push({
            x: closest.x, y: closest.y,
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            r: 3 + Math.random() * 3,
            color: closest.type.color,
            life: 0.5 + Math.random() * 0.3,
            maxLife: 0.8,
          });
        }
        this._arenaEnemies = this._arenaEnemies.filter(e => e.id !== closest.id);
        this._arenaKillCount++;
        this._arenaXpEarned   += closest.type.xpVal;
        this._arenaGoldEarned += closest.type.goldVal;
      }
    }
  },

  _arenaEndGame(defeated) {
    this._arenaRunning  = false;
    this._arenaOver     = true;
    this._arenaDefeated = defeated;
    if (this._arenaAnimFrameId) {
      cancelAnimationFrame(this._arenaAnimFrameId);
      this._arenaAnimFrameId = null;
    }
    // Final render
    this._arenaRender();

    const result = Game.applyArenaResult(
      this._arenaKillCount,
      this._arenaXpEarned,
      this._arenaGoldEarned,
      !defeated
    );

    document.getElementById('arena-game-area').classList.add('d-none');
    UI.showArenaResult(result);
    UI.refresh();
    if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
  },

  _updateArenaHUD() {
    const timerEl = document.getElementById('arena-hud-timer');
    const killsEl = document.getElementById('arena-hud-kills');
    const goldEl  = document.getElementById('arena-hud-gold');
    if (timerEl) timerEl.textContent = Math.ceil(this._arenaTimeLeft);
    if (killsEl) killsEl.textContent = this._arenaKillCount;
    if (goldEl)  goldEl.textContent  = this._arenaGoldEarned;
  },

  /* ─── Conversione (Chierico) ─────────────────────────────── */
  _startConversionGame() {
    const canvas = document.getElementById('conv-canvas');
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const N_FEDELI  = 26;
    const N_DIAVOLI = 2;

    // Spawn fedeli with min-distance check
    const fedeli = [];
    let attempts = 0;
    while (fedeli.length < N_FEDELI && attempts < 3000) {
      attempts++;
      const x = 30 + Math.random() * (W - 60);
      const y = 30 + Math.random() * (H - 60);
      const tooClose = fedeli.some(f => Math.hypot(f.x - x, f.y - y) < 26);
      if (!tooClose) fedeli.push({
        x, y, conv: 0, blessed: false, blessTimer: 0, pulseT: Math.random() * Math.PI * 2,
        superBlessed: false, fullConvTimer: 0,
        vx: 0, vy: 0,
      });
    }

    // Spawn diavoli at edges
    const diavoli = [];
    for (let i = 0; i < N_DIAVOLI; i++) {
      const side = Math.floor(Math.random() * 4);
      let dx, dy;
      if (side === 0) { dx = Math.random() * W; dy = 12; }
      else if (side === 1) { dx = W - 12; dy = Math.random() * H; }
      else if (side === 2) { dx = Math.random() * W; dy = H - 12; }
      else { dx = 12; dy = Math.random() * H; }
      const angle = Math.random() * Math.PI * 2;
      diavoli.push({ x: dx, y: dy, vx: Math.cos(angle) * 42, vy: Math.sin(angle) * 42,
                     targetTimer: 0, pulseT: Math.random() * Math.PI * 2,
                     convProgress: 0, convFullTimer: 0, dying: false, dyingTimer: 0 });
    }

    this._conv = {
      running: true, time: 0, timeLeft: 30, lastTs: 0, rafId: null,
      fedeli, diavoli, W, H,
      clericX: -300, clericY: -300,
      blessedCount: 0, blessCheckTimer: 0,
      nextSpawnTimer: 10, spawnCount: 0,
    };

    document.getElementById('conv-lobby').classList.add('d-none');
    document.getElementById('conv-result').classList.add('d-none');
    document.getElementById('conv-game').classList.remove('d-none');
    document.getElementById('conv-total').textContent = N_FEDELI;
    document.getElementById('conv-timer').textContent = '30';
    document.getElementById('conv-count').textContent = '0';
    document.getElementById('conv-blessed').textContent = '0';
    document.getElementById('conv-hint').textContent = 'Muovi il mouse sul canvas per guidare il Chierico';

    if (this._conv.rafId) cancelAnimationFrame(this._conv.rafId);
    this._conv.rafId = requestAnimationFrame((ts) => this._convLoop(ts));
  },

  _convLoop(ts) {
    const c = this._conv;
    if (!c || !c.running) return;
    const dt = c.lastTs ? Math.min((ts - c.lastTs) / 1000, 0.1) : 0.016;
    c.lastTs = ts;
    c.time     += dt;
    c.timeLeft -= dt;

    if (c.timeLeft <= 0) {
      c.timeLeft = 0;
      this._endConversionGame();
      return;
    }

    const { W, H, fedeli, diavoli, clericX, clericY } = c;
    const abilSpeed  = Game.getEquipmentAbilities().conversionSpeed || 0;
    const speedMult  = 1 + abilSpeed;
    const CONV_R       = 62;
    const CONV_RATE    = 0.52 * speedMult;
    const DECAY_RATE   = 0.12;
    const BLESS_R      = 46;
    const BLESS_RATE   = 0.20 * speedMult;
    const DEVIL_R      = 72;
    const DEVIL_DRAIN  = 0.38;
    const CLERIC_DEVIL_CONV_R    = 55;
    const CLERIC_DEVIL_CONV_RATE = 0.28 * speedMult;
    const DEVIL_CONV_DECAY       = 0.06;
    const SUPER_BLESS_SPEED      = 24; // px/s slow wander
    const FULL_CONV_THRESHOLD    = 2.0; // seconds at max before superBlessed

    // Periodic enemy spawning every 10s (up to 3 extra)
    if (c.spawnCount < 3) {
      c.nextSpawnTimer -= dt;
      if (c.nextSpawnTimer <= 0) {
        c.nextSpawnTimer = 10 + Math.random() * 3;
        c.spawnCount++;
        const side = Math.floor(Math.random() * 4);
        let dx, dy;
        if (side === 0) { dx = Math.random() * W; dy = 12; }
        else if (side === 1) { dx = W - 12; dy = Math.random() * H; }
        else if (side === 2) { dx = Math.random() * W; dy = H - 12; }
        else { dx = 12; dy = Math.random() * H; }
        const angle = Math.random() * Math.PI * 2;
        diavoli.push({ x: dx, y: dy, vx: Math.cos(angle) * 40, vy: Math.sin(angle) * 40,
                       targetTimer: 0, pulseT: Math.random() * Math.PI * 2,
                       convProgress: 0, convFullTimer: 0, dying: false, dyingTimer: 0 });
        document.getElementById('conv-hint').textContent = `😈 Un nuovo demone è entrato nella piazza! (${diavoli.length} totali)`;
        setTimeout(() => {
          if (c.running) document.getElementById('conv-hint').textContent = '';
        }, 1800);
      }
    }

    // Update diavoli
    for (let di = diavoli.length - 1; di >= 0; di--) {
      const d = diavoli[di];
      if (d.dying) {
        d.dyingTimer += dt;
        if (d.dyingTimer >= 0.6) { diavoli.splice(di, 1); continue; }
        continue;
      }
      d.targetTimer += dt;
      if (d.targetTimer > 2.0 + Math.random() * 1.5) {
        d.targetTimer = 0;
        const angle = Math.random() * Math.PI * 2;
        const speed = 35 + Math.random() * 22;
        d.vx = Math.cos(angle) * speed;
        d.vy = Math.sin(angle) * speed;
      }
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      if (d.x < 14)     { d.x = 14;     d.vx = Math.abs(d.vx); }
      if (d.x > W - 14) { d.x = W - 14; d.vx = -Math.abs(d.vx); }
      if (d.y < 14)     { d.y = 14;     d.vy = Math.abs(d.vy); }
      if (d.y > H - 14) { d.y = H - 14; d.vy = -Math.abs(d.vy); }
      d.pulseT += dt * 3.5;

      // Cleric can convert devil
      const distToCleric = Math.hypot(d.x - clericX, d.y - clericY);
      if (distToCleric <= CLERIC_DEVIL_CONV_R) {
        d.convProgress = Math.min(1, d.convProgress + CLERIC_DEVIL_CONV_RATE * dt);
      } else {
        d.convProgress = Math.max(0, d.convProgress - DEVIL_CONV_DECAY * dt);
        d.convFullTimer = 0;
      }

      if (d.convProgress >= 1) {
        d.convFullTimer += dt;
        if (d.convFullTimer >= 2.0) {
          // Devil is converted and disappears!
          d.dying = true;
          d.dyingTimer = 0;
          document.getElementById('conv-hint').textContent = '✝️ Demone sconfitto dalla fede!';
          setTimeout(() => { if (c.running) document.getElementById('conv-hint').textContent = ''; }, 1600);
        }
      } else {
        d.convFullTimer = 0;
      }
    }

    // Update fedeli
    let convertedCount = 0;
    for (const f of fedeli) {
      f.pulseT += dt * 2.2;

      // SuperBlessed movement (slow wander)
      if (f.superBlessed) {
        if (!f.vx && !f.vy) {
          const angle = Math.random() * Math.PI * 2;
          f.vx = Math.cos(angle) * SUPER_BLESS_SPEED;
          f.vy = Math.sin(angle) * SUPER_BLESS_SPEED;
        }
        f.x += f.vx * dt;
        f.y += f.vy * dt;
        if (f.x < 14)     { f.x = 14;     f.vx = Math.abs(f.vx); }
        if (f.x > W - 14) { f.x = W - 14; f.vx = -Math.abs(f.vx); }
        if (f.y < 14)     { f.y = 14;     f.vy = Math.abs(f.vy); }
        if (f.y > H - 14) { f.y = H - 14; f.vy = -Math.abs(f.vy); }
        // Occasionally change direction
        if (Math.random() < dt * 0.4) {
          const angle = Math.random() * Math.PI * 2;
          f.vx = Math.cos(angle) * SUPER_BLESS_SPEED;
          f.vy = Math.sin(angle) * SUPER_BLESS_SPEED;
        }
        // SuperBlessed: no decay, convert neighbors
        f.conv = 1.0;
        for (const other of fedeli) {
          if (other === f || other.superBlessed) continue;
          if (Math.hypot(other.x - f.x, other.y - f.y) <= BLESS_R) {
            other.conv = Math.min(1, other.conv + BLESS_RATE * 1.4 * dt);
          }
        }
      } else {
        const distCleric = Math.hypot(f.x - clericX, f.y - clericY);
        if (distCleric <= CONV_R) {
          f.conv = Math.min(1, f.conv + CONV_RATE * dt);
        } else if (!f.blessed) {
          f.conv = Math.max(0, f.conv - DECAY_RATE * dt);
          f.fullConvTimer = 0;
        }

        // Track time at full conversion (near cleric)
        if (f.conv >= 0.999 && distCleric <= CONV_R) {
          f.fullConvTimer = (f.fullConvTimer || 0) + dt;
          if (f.fullConvTimer >= FULL_CONV_THRESHOLD && !f.superBlessed) {
            f.superBlessed = true;
            f.conv = 1.0;
            f.blessed = false; f.blessTimer = 0;
            const angle = Math.random() * Math.PI * 2;
            f.vx = Math.cos(angle) * SUPER_BLESS_SPEED;
            f.vy = Math.sin(angle) * SUPER_BLESS_SPEED;
            c.blessedCount++;
            document.getElementById('conv-blessed').textContent = c.blessedCount;
            document.getElementById('conv-hint').textContent = '🌟 Un fedele è stato completamente illuminato!';
            setTimeout(() => { if (c.running) document.getElementById('conv-hint').textContent = ''; }, 1600);
          }
        } else if (f.conv < 0.999) {
          f.fullConvTimer = 0;
        }

        // Blessed fedeli convert neighbours
        if (f.blessed) {
          for (const other of fedeli) {
            if (other === f || other.superBlessed) continue;
            if (Math.hypot(other.x - f.x, other.y - f.y) <= BLESS_R) {
              other.conv = Math.min(1, other.conv + BLESS_RATE * dt);
            }
          }
          f.blessTimer -= dt;
          if (f.blessTimer <= 0) { f.blessed = false; f.blessTimer = 0; }
        }
      }

      // Devil drain (doesn't affect superBlessed)
      if (!f.superBlessed) {
        for (const d of diavoli) {
          if (d.dying) continue;
          const distDevil = Math.hypot(f.x - d.x, f.y - d.y);
          if (distDevil <= DEVIL_R) {
            f.conv = Math.max(0, f.conv - DEVIL_DRAIN * dt * (1 - distDevil / DEVIL_R));
            if (f.blessed) { f.blessed = false; f.blessTimer = 0; }
            f.fullConvTimer = 0;
          }
        }
      }

      if (f.conv >= 0.65 || f.superBlessed) convertedCount++;
    }

    // Old-style blessing check (for non-super)
    c.blessCheckTimer += dt;
    if (c.blessCheckTimer >= 2.0) {
      c.blessCheckTimer = 0;
      const wellConverted = fedeli.filter(f => f.conv >= 0.85 && !f.blessed && !f.superBlessed);
      const totalAbove    = fedeli.filter(f => f.conv >= 0.85).length;
      if (totalAbove >= 4 && wellConverted.length > 0 && Math.random() < 0.45) {
        const chosen = wellConverted[Math.floor(Math.random() * wellConverted.length)];
        chosen.blessed = true;
        chosen.blessTimer = 8;
      }
    }

    document.getElementById('conv-count').textContent  = convertedCount;
    document.getElementById('conv-timer').textContent  = Math.ceil(c.timeLeft);

    const canvas = document.getElementById('conv-canvas');
    this._drawConversion(canvas, c);
    c.rafId = requestAnimationFrame((ts2) => this._convLoop(ts2));
  },

  _drawConversion(canvas, c) {
    const ctx = canvas.getContext('2d');
    const { W, H, fedeli, diavoli, clericX, clericY, time } = c;

    ctx.fillStyle = '#080614';
    ctx.fillRect(0, 0, W, H);

    // Cobblestone grid
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < W; gx += 32) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
    for (let gy = 0; gy < H; gy += 32) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

    // Cleric aura
    if (clericX > 0 && clericY > 0) {
      const auraR = 62;
      const ag = ctx.createRadialGradient(clericX, clericY, 0, clericX, clericY, auraR);
      ag.addColorStop(0,   'rgba(201,168,76,0.14)');
      ag.addColorStop(0.5, 'rgba(201,168,76,0.06)');
      ag.addColorStop(1,   'rgba(201,168,76,0)');
      ctx.fillStyle = ag;
      ctx.beginPath(); ctx.arc(clericX, clericY, auraR, 0, Math.PI * 2); ctx.fill();
    }

    // Draw diavoli
    for (const d of diavoli) {
      const alpha = d.dying ? Math.max(0, 1 - d.dyingTimer / 0.6) : 1;
      ctx.globalAlpha = alpha;
      const pulse = 1 + 0.18 * Math.sin(d.pulseT);
      const dr = 28 * pulse;
      // Conversion progress tint (blue when being converted)
      const redAmt  = 1 - d.convProgress;
      const blueAmt = d.convProgress;
      const dg = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, dr);
      dg.addColorStop(0,   `rgba(${Math.round(180*redAmt+50*blueAmt)},${Math.round(20*redAmt+120*blueAmt)},${Math.round(20*redAmt+220*blueAmt)},0.38)`);
      dg.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = dg;
      ctx.beginPath(); ctx.arc(d.x, d.y, dr, 0, Math.PI * 2); ctx.fill();

      // Drain radius
      ctx.strokeStyle = `rgba(180,20,20,${0.10 + 0.07 * Math.sin(d.pulseT)})`;
      ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.arc(d.x, d.y, 72, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      // Conv progress ring on devil
      if (d.convProgress > 0.05) {
        ctx.strokeStyle = `rgba(150,100,255,${0.5 + d.convProgress * 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(d.x, d.y, 18, -Math.PI / 2, -Math.PI / 2 + d.convProgress * Math.PI * 2); ctx.stroke();
      }

      ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(d.dying ? '💥' : '😈', d.x, d.y);
      ctx.globalAlpha = 1;
    }

    // Draw fedeli
    for (const f of fedeli) {
      const c0 = f.conv;
      let r, g, b;
      if (f.superBlessed) {
        const bPulse = 0.5 + 0.5 * Math.sin(f.pulseT * 3);
        r = Math.round(255);
        g = Math.round(230 + 25 * bPulse);
        b = Math.round(150 + 105 * bPulse);
      } else if (f.blessed) {
        const bPulse = 0.7 + 0.3 * Math.sin(f.pulseT * 2.5);
        r = Math.round(220 + 35 * bPulse);
        g = Math.round(200 + 55 * bPulse);
        b = Math.round(100 + 155 * bPulse);
      } else {
        r = Math.round(80  + c0 * (201 - 80));
        g = Math.round(80  + c0 * (168 - 80));
        b = Math.round(90  + c0 * (76  - 90));
      }
      const col = `rgb(${r},${g},${b})`;
      const radius = 5.5 + c0 * 2.5;

      // Glow
      if (c0 > 0.2 || f.blessed || f.superBlessed) {
        const glowSize = f.superBlessed ? 28 + 8 * Math.sin(f.pulseT * 3)
                        : f.blessed ? 22 + 8 * Math.sin(f.pulseT * 2.5) : 14 * c0;
        const fg = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowSize);
        if (f.superBlessed) {
          fg.addColorStop(0,   'rgba(255,240,150,0.65)');
          fg.addColorStop(0.4, 'rgba(255,200,50,0.3)');
          fg.addColorStop(1,   'rgba(201,168,76,0)');
        } else if (f.blessed) {
          fg.addColorStop(0,   'rgba(255,240,180,0.45)');
          fg.addColorStop(0.5, 'rgba(201,168,76,0.2)');
          fg.addColorStop(1,   'rgba(201,168,76,0)');
        } else {
          fg.addColorStop(0,   `rgba(201,168,76,${c0 * 0.35})`);
          fg.addColorStop(1,   'rgba(201,168,76,0)');
        }
        ctx.fillStyle = fg;
        ctx.beginPath(); ctx.arc(f.x, f.y, glowSize, 0, Math.PI * 2); ctx.fill();
      }

      // SuperBlessed conversion aura ring
      if (f.superBlessed) {
        const bR = 46;
        ctx.strokeStyle = `rgba(255,220,80,${0.25 + 0.15 * Math.sin(f.pulseT * 2)})`;
        ctx.lineWidth = 2; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.arc(f.x, f.y, bR, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        // Star crown above
        ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
        ctx.fillText('⭐', f.x, f.y - radius - 2);
      } else if (f.blessed) {
        const bR = 46;
        ctx.strokeStyle = `rgba(255,240,180,${0.15 + 0.1 * Math.sin(f.pulseT)})`;
        ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.arc(f.x, f.y, bR, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Body
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(f.x, f.y, radius, 0, Math.PI * 2); ctx.fill();

      // Progress ring
      if (c0 > 0.05 && !f.blessed && !f.superBlessed) {
        ctx.strokeStyle = `rgba(201,168,76,${0.5 + c0 * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius + 3, -Math.PI / 2, -Math.PI / 2 + c0 * Math.PI * 2);
        ctx.stroke();
      }

      // fullConvTimer fill indicator (time bar)
      if (f.fullConvTimer > 0 && !f.superBlessed) {
        const frac = Math.min(1, f.fullConvTimer / 2.0);
        ctx.strokeStyle = `rgba(255,255,100,${0.7})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius + 6, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw cleric
    if (clericX > 0 && clericY > 0) {
      const pulse = 1 + 0.12 * Math.sin(time * 3.5);
      const cg = ctx.createRadialGradient(clericX, clericY, 0, clericX, clericY, 16 * pulse);
      cg.addColorStop(0,   'rgba(255,253,210,0.9)');
      cg.addColorStop(0.4, 'rgba(201,168,76,0.5)');
      cg.addColorStop(1,   'rgba(201,168,76,0)');
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(clericX, clericY, 16 * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fffde7';
      ctx.lineWidth = 2.5; ctx.lineCap = 'round';
      const arm = 10 * pulse;
      ctx.beginPath(); ctx.moveTo(clericX, clericY - arm); ctx.lineTo(clericX, clericY + arm); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(clericX - arm * 0.65, clericY - arm * 0.25); ctx.lineTo(clericX + arm * 0.65, clericY - arm * 0.25); ctx.stroke();
      ctx.lineCap = 'butt';
    }

    // Timer ring
    const remFrac = Math.max(0, c.timeLeft / 30);
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(W - 22, 22, 14, -Math.PI / 2, -Math.PI / 2 + remFrac * Math.PI * 2);
    ctx.stroke();
  },

  _endConversionGame() {
    const c = this._conv;
    if (!c) return;
    c.running = false;
    cancelAnimationFrame(c.rafId);

    // Compute score: weighted average conversion
    const score = c.fedeli.reduce((sum, f) => sum + f.conv, 0) / c.fedeli.length * 100;
    const result = Game.applyConversionResult(score, c.blessedCount);
    UI.showConversionResult(result);
    UI.refresh();
    if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
  },

  /* ─── Preghiera ─────────────────────────────────────────── */
  _startPrayerAnimation() {
    const canvas = document.getElementById('prayer-canvas');
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;

    this._prayTime       = 0;
    this._prayTimeLeft   = 18;
    this._prayDevotion   = 0;
    this._praySphereX    = W / 2;
    this._praySphereY    = H - 28;
    this._prayParticles  = [];
    this._prayTrail      = [];
    this._prayGraceActive = false;
    this._prayGraceTimer = 0;
    this._prayNextGrace  = 2.5 + Math.random() * 1.5;
    this._prayGraceCaught = 0;
    this._prayLastFrameTs = 0;
    this._prayPhase      = 'animating';
    // Demon state
    this._prayDemonActive  = false;
    this._prayDemonTimer   = 0;
    this._prayDemonLimit   = 2.4;
    this._prayNextDemon    = 4.5 + Math.random() * 3.5;
    this._prayDemonX       = 0;
    this._prayDemonY       = 0;
    this._prayDemonIcon    = '👿';
    this._prayDemonsScacciati = 0;

    document.getElementById('prayer-active-phase').classList.remove('d-none');
    document.getElementById('prayer-result-phase').classList.add('d-none');
    document.getElementById('btn-amen').disabled = false;
    document.getElementById('btn-amen').classList.remove('grace-active');
    document.getElementById('btn-scaccia').classList.remove('d-none');   // sempre visibile
    document.getElementById('btn-scaccia').classList.remove('demon-active');
    document.getElementById('prayer-hint').textContent = 'Prega con devozione… aspetta il momento di grazia';
    this._updatePrayDevoBar();

    if (this._prayAnimFrameId) cancelAnimationFrame(this._prayAnimFrameId);
    this._prayAnimFrameId = requestAnimationFrame((ts) => this._prayerLoop(ts));
  },

  _prayerLoop(ts) {
    if (this._prayPhase !== 'animating') return;
    const dt = this._prayLastFrameTs ? Math.min((ts - this._prayLastFrameTs) / 1000, 0.1) : 0.016;
    this._prayLastFrameTs = ts;
    this._prayTime     += dt;
    this._prayTimeLeft -= dt;

    if (this._prayTimeLeft <= 0) {
      this._endPrayer();
      return;
    }

    const canvas = document.getElementById('prayer-canvas');
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const t = this._prayTime;

    // Sphere position: rises from bottom to top with sinusoidal drift
    const progress = 1 - (this._prayTimeLeft / 18);
    this._praySphereX = W / 2 + 38 * Math.sin(t * 0.65);
    this._praySphereY = (H - 28) - progress * (H - 52) + 6 * Math.sin(t * 1.1 + 1);

    // Trail
    this._prayTrail.push({ x: this._praySphereX, y: this._praySphereY });
    if (this._prayTrail.length > 35) this._prayTrail.shift();

    // Emit particles
    const emitRate = this._prayGraceActive ? 0.8 : 0.35;
    if (Math.random() < emitRate) {
      this._prayParticles.push({
        x: this._praySphereX + (Math.random() - 0.5) * 10,
        y: this._praySphereY + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 14,
        vy: -(15 + Math.random() * 28),
        r:  1.2 + Math.random() * 2.2,
        maxLife: 1.0 + Math.random() * 0.8,
        life:    1.0 + Math.random() * 0.8,
      });
    }
    for (const p of this._prayParticles) {
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;
      p.vy *= 0.97;
      p.vx *= 0.98;
      p.life -= dt;
    }
    this._prayParticles = this._prayParticles.filter(p => p.life > 0);

    // Grace timing
    this._prayGraceTimer += dt;
    if (!this._prayGraceActive && !this._prayDemonActive && this._prayGraceTimer >= this._prayNextGrace) {
      this._prayGraceActive = true;
      this._prayGraceTimer  = 0;
      this._prayNextGrace   = 3 + Math.random() * 3;
      document.getElementById('prayer-hint').textContent = '✨ Momento di Grazia! Clicca Amen!';
      document.getElementById('btn-amen').classList.add('grace-active');
    }
    if (this._prayGraceActive && this._prayGraceTimer >= 1.3) {
      this._prayGraceActive = false;
      this._prayGraceTimer  = 0;
      document.getElementById('prayer-hint').textContent = 'Prega con devozione… aspetta il momento di grazia';
      document.getElementById('btn-amen').classList.remove('grace-active');
    }

    // Demon timing
    this._prayDemonTimer += dt;
    if (!this._prayDemonActive && !this._prayGraceActive && this._prayDemonTimer >= this._prayNextDemon) {
      this._prayDemonActive = true;
      this._prayDemonTimer  = 0;
      this._prayNextDemon   = 4.5 + Math.random() * 3.5;
      this._prayDemonIcon   = Math.random() < 0.5 ? '👿' : '💀';
      // Position away from sphere, within canvas margins
      const margin = 36;
      this._prayDemonX = margin + Math.random() * (W - margin * 2);
      this._prayDemonY = margin + Math.random() * (H - margin * 2);
      document.getElementById('btn-scaccia').classList.add('demon-active');
      document.getElementById('prayer-hint').textContent = this._prayDemonIcon === '💀' ? '💀 Non morto! Scaccialo!' : '👿 Demone! Scaccialo!';
    }
    if (this._prayDemonActive && this._prayDemonTimer >= this._prayDemonLimit) {
      // Demon escaped — penalize devotion
      this._prayDemonActive = false;
      this._prayDemonTimer  = 0;
      this._prayDevotion    = Math.max(0, this._prayDevotion - 20);
      this._updatePrayDevoBar();
      document.getElementById('btn-scaccia').classList.remove('demon-active');
      document.getElementById('prayer-hint').textContent = '💔 La preghiera si disperde…';
      setTimeout(() => {
        if (this._prayPhase === 'animating')
          document.getElementById('prayer-hint').textContent = 'Prega con devozione… aspetta il momento di grazia';
      }, 1200);
    }

    // Passive devotion
    this._prayDevotion = Math.min(100, this._prayDevotion + dt * 3.2);
    // Drain attivo durante grazia e demone — bisogna reagire in fretta
    if (this._prayGraceActive) this._prayDevotion = Math.max(0, this._prayDevotion - dt * 8);
    if (this._prayDemonActive) this._prayDevotion = Math.max(0, this._prayDevotion - dt * 10);
    this._updatePrayDevoBar();

    this._drawPrayer(canvas);
    this._prayAnimFrameId = requestAnimationFrame((ts2) => this._prayerLoop(ts2));
  },

  _drawPrayer(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const t  = this._prayTime;
    const sx = this._praySphereX;
    const sy = this._praySphereY;
    const grace = this._prayGraceActive;
    const pulse = 1 + 0.14 * Math.sin(t * 2.8);
    const gScale = grace ? 1.45 + 0.2 * Math.sin(t * 7) : 1;

    // Fade background (creates incense-smoke trail)
    ctx.fillStyle = 'rgba(4, 2, 14, 0.22)';
    ctx.fillRect(0, 0, W, H);

    // Trail
    for (let i = 0; i < this._prayTrail.length; i++) {
      const pt  = this._prayTrail[i];
      const prog = i / this._prayTrail.length;
      ctx.globalAlpha = prog * 0.18;
      const r = 3 + prog * 5;
      const tg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
      tg.addColorStop(0, '#fff8e1');
      tg.addColorStop(1, 'rgba(201,168,76,0)');
      ctx.fillStyle = tg;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Particles
    for (const p of this._prayParticles) {
      const a = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = a * 0.75;
      const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      pg.addColorStop(0, '#fffde7');
      pg.addColorStop(0.5, 'rgba(201,168,76,0.55)');
      pg.addColorStop(1, 'rgba(255,248,150,0)');
      ctx.fillStyle = pg;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Outer aura
    const auraR = (32 + 7 * Math.sin(t * 1.8)) * pulse * gScale;
    const ag = ctx.createRadialGradient(sx, sy, 0, sx, sy, auraR);
    ag.addColorStop(0, grace ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.09)');
    ag.addColorStop(0.45, `rgba(201,168,76,${grace ? 0.12 : 0.06})`);
    ag.addColorStop(1, 'rgba(255,248,150,0)');
    ctx.fillStyle = ag;
    ctx.beginPath(); ctx.arc(sx, sy, auraR, 0, Math.PI * 2); ctx.fill();

    // Mid glow
    const glowR = (16 + 3.5 * Math.sin(t * 2.2)) * pulse * gScale;
    const gg = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
    const ga = grace ? 0.62 : 0.28;
    gg.addColorStop(0, `rgba(255,253,210,${ga + 0.1})`);
    gg.addColorStop(0.5, `rgba(201,168,76,${ga * 0.5})`);
    gg.addColorStop(1, 'rgba(201,168,76,0)');
    ctx.fillStyle = gg;
    ctx.beginPath(); ctx.arc(sx, sy, glowR, 0, Math.PI * 2); ctx.fill();

    // Core
    const coreR = (6.5 + 1.8 * Math.sin(t * 2.8)) * pulse * gScale;
    const cg = ctx.createRadialGradient(sx - 1, sy - 1, 0, sx, sy, coreR);
    cg.addColorStop(0, '#ffffff');
    cg.addColorStop(0.35, '#fff9c4');
    cg.addColorStop(0.7, 'rgba(201,168,76,0.92)');
    cg.addColorStop(1, 'rgba(201,168,76,0)');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(sx, sy, coreR, 0, Math.PI * 2); ctx.fill();

    // Grace sparkles
    if (grace) {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * 1.8;
        const dist  = 20 + 4 * Math.sin(t * 4 + i);
        ctx.globalAlpha = 0.55 + 0.35 * Math.sin(t * 6 + i);
        ctx.fillStyle = '#fffde7';
        ctx.beginPath();
        ctx.arc(sx + Math.cos(angle) * dist, sy + Math.sin(angle) * dist, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 0.8;
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fffde7';
      ctx.fillText('✨ Grazia! ✨', sx, sy - 42);
      ctx.globalAlpha = 1;
    }

    // Timer ring (top-right corner)
    const rem = Math.max(0, this._prayTimeLeft / 18);
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(W - 22, 22, 13, -Math.PI / 2, -Math.PI / 2 + rem * Math.PI * 2);
    ctx.stroke();

    // Demon / undead entity
    if (this._prayDemonActive) {
      const dx = this._prayDemonX;
      const dy = this._prayDemonY;
      const dFract = Math.max(0, 1 - (this._prayDemonTimer / this._prayDemonLimit));

      // Pulsing dark aura
      const dAura = 26 + 7 * Math.sin(t * 9);
      const dg = ctx.createRadialGradient(dx, dy, 0, dx, dy, dAura);
      dg.addColorStop(0,   `rgba(180,20,20,${0.45 * dFract})`);
      dg.addColorStop(0.5, `rgba(120,0,60,${0.28 * dFract})`);
      dg.addColorStop(1,   'rgba(80,0,40,0)');
      ctx.fillStyle = dg;
      ctx.beginPath(); ctx.arc(dx, dy, dAura, 0, Math.PI * 2); ctx.fill();

      // Icon
      ctx.globalAlpha = 0.2 + 0.8 * dFract;
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this._prayDemonIcon, dx, dy);
      ctx.textBaseline = 'alphabetic';
      ctx.globalAlpha = 1;

      // Countdown ring (shrinking arc, clockwise from top)
      ctx.strokeStyle = `rgba(220,50,50,${0.35 + 0.55 * dFract})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(dx, dy, 20, -Math.PI / 2, -Math.PI / 2 + dFract * Math.PI * 2);
      ctx.stroke();
    }
  },

  _prayHandleScaccia() {
    if (this._prayPhase !== 'animating') return;
    if (this._prayDemonActive) {
      // Scacciato con successo
      this._prayDemonActive = false;
      this._prayDemonTimer  = 0;
      this._prayDemonsScacciati++;
      this._prayDevotion = Math.min(100, this._prayDevotion + 14);
      this._updatePrayDevoBar();
      document.getElementById('btn-scaccia').classList.remove('demon-active');
      document.getElementById('prayer-hint').textContent = '☩ Scacciato con fede!';
      setTimeout(() => {
        if (this._prayPhase === 'animating')
          document.getElementById('prayer-hint').textContent = 'Prega con devozione… aspetta il momento di grazia';
      }, 950);
    } else {
      // Falso allarme — grossa penalità per distrazione
      this._prayDevotion = Math.max(0, this._prayDevotion - 18);
      this._updatePrayDevoBar();
      document.getElementById('prayer-hint').textContent = '⚠️ Concentrati! Nessun demone presente!';
      setTimeout(() => {
        if (this._prayPhase === 'animating')
          document.getElementById('prayer-hint').textContent = 'Prega con devozione… aspetta il momento di grazia';
      }, 900);
    }
  },

  _prayHandleAmen() {
    if (this._prayPhase !== 'animating') return;
    if (this._prayGraceActive) {
      this._prayDevotion = Math.min(100, this._prayDevotion + 23);
      this._prayGraceActive = false;
      this._prayGraceTimer  = 0;
      this._prayGraceCaught++;
      document.getElementById('prayer-hint').textContent = '🙏 Grazia raccolta!';
      document.getElementById('btn-amen').classList.remove('grace-active');
      setTimeout(() => {
        if (this._prayPhase === 'animating')
          document.getElementById('prayer-hint').textContent = 'Prega con devozione… aspetta il momento di grazia';
      }, 900);
    } else {
      // Click a vuoto — grossa penalità
      this._prayDevotion = Math.max(0, this._prayDevotion - 18);
      document.getElementById('prayer-hint').textContent = '⚠️ Concentrati! Non è il momento!';
      setTimeout(() => {
        if (this._prayPhase === 'animating')
          document.getElementById('prayer-hint').textContent = 'Prega con devozione… aspetta il momento di grazia';
      }, 900);
    }
    this._updatePrayDevoBar();
  },

  _updatePrayDevoBar() {
    const fill = document.getElementById('prayer-devo-fill');
    const pct  = document.getElementById('prayer-devo-pct');
    if (fill) fill.style.width = `${this._prayDevotion}%`;
    if (pct)  pct.textContent  = `${Math.floor(this._prayDevotion)}%`;
  },

  /* ─── Stalla / Guitar Hero (Paladino) ──────────────────── */
  _startStableGame() {
    const canvas = document.getElementById('stable-canvas');
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const HITLINE_Y = H - 50;
    const N_LANES = 5;
    const LANE_W  = W / N_LANES;

    this._stable = {
      running: true, time: 0, timeLeft: 40, lastTs: 0, rafId: null,
      W, H, HITLINE_Y, N_LANES, LANE_W,
      notes: [],         // {id, lane, y, hit, missed}
      noteIdCtr: 0,
      spawnTimer: 0,
      spawnInterval: 1.1,
      noteSpeed: 140,    // px/s
      health:    0,
      happiness: 0,
      hits: 0,
      misses: 0,
      hitFlashes: [],    // {lane, t, success}
    };

    document.getElementById('stable-game').classList.remove('d-none');
    document.getElementById('stable-result').classList.add('d-none');
    document.getElementById('stable-health').textContent    = '0';
    document.getElementById('stable-happiness').textContent = '0';
    document.getElementById('stable-timer').textContent     = '40';
    document.getElementById('stable-hint').textContent      = 'Premi il bottone quando l\'icona raggiunge la riga!';

    if (this._stable.rafId) cancelAnimationFrame(this._stable.rafId);
    this._stable.rafId = requestAnimationFrame((ts) => this._stableLoop(ts));
  },

  _stableLoop(ts) {
    const s = this._stable;
    if (!s || !s.running) return;
    const dt = s.lastTs ? Math.min((ts - s.lastTs) / 1000, 0.1) : 0.016;
    s.lastTs = ts;
    s.time     += dt;
    s.timeLeft -= dt;

    if (s.timeLeft <= 0) {
      s.timeLeft = 0;
      this._endStableGame();
      return;
    }

    // Spawn notes
    s.spawnTimer += dt;
    if (s.spawnTimer >= s.spawnInterval) {
      s.spawnTimer = 0;
      s.spawnInterval = 0.9 + Math.random() * 0.5;
      const lane = Math.floor(Math.random() * s.N_LANES);
      s.notes.push({ id: s.noteIdCtr++, lane, y: 70, hit: false, missed: false });
    }

    // Move notes
    for (const n of s.notes) {
      n.y += s.noteSpeed * dt;
      if (!n.hit && !n.missed && n.y > s.HITLINE_Y + 40) {
        n.missed = true;
      }
    }

    // Remove old notes
    s.notes = s.notes.filter(n => n.y < s.H + 40);

    // Decay hit flashes
    s.hitFlashes = s.hitFlashes.filter(f => { f.t -= dt; return f.t > 0; });

    // Update UI
    document.getElementById('stable-health').textContent    = Math.floor(s.health);
    document.getElementById('stable-happiness').textContent = Math.floor(s.happiness);
    document.getElementById('stable-timer').textContent     = Math.ceil(s.timeLeft);

    const canvas = document.getElementById('stable-canvas');
    this._drawStable(canvas, s);
    s.rafId = requestAnimationFrame((ts2) => this._stableLoop(ts2));
  },

  _stableHandleLaneClick(lane) {
    const s = this._stable;
    if (!s || !s.running) return;
    const HIT_WINDOW = 38;

    // Find the closest note in this lane near hitline
    let bestNote = null;
    let bestDist = Infinity;
    for (const n of s.notes) {
      if (n.lane !== lane || n.hit || n.missed) continue;
      const dist = Math.abs(n.y - s.HITLINE_Y);
      if (dist < bestDist) { bestDist = dist; bestNote = n; }
    }

    if (bestNote && bestDist <= HIT_WINDOW) {
      // Hit!
      bestNote.hit = true;
      s.hits++;
      s.health    = Math.min(100, s.health    + 5);
      s.happiness = Math.min(100, s.happiness + 4);
      s.hitFlashes.push({ lane, t: 0.35, success: true });
      // Hint messages occasionally
      if (s.hits % 5 === 0) {
        const msgs = ['🐎 Il cavallo nitrisce di gioia!', '✨ Ottima cura!', '🌟 Il cavallo è felice!'];
        document.getElementById('stable-hint').textContent = msgs[Math.floor(Math.random() * msgs.length)];
        setTimeout(() => {
          if (s.running) document.getElementById('stable-hint').textContent = 'Premi il bottone quando l\'icona raggiunge la riga!';
        }, 1200);
      }
    } else {
      // Miss or wrong timing
      s.hitFlashes.push({ lane, t: 0.28, success: false });
    }
  },

  _drawStable(canvas, s) {
    const ctx = canvas.getContext('2d');
    const { W, H, HITLINE_Y, N_LANES, LANE_W, notes, hitFlashes, time } = s;
    const LANES = this._STABLE_LANES;
    const NOTE_R = 26;

    // Background
    ctx.fillStyle = '#0a0a18';
    ctx.fillRect(0, 0, W, H);

    // Horse area (top)
    // Health bar
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(10, 10, W - 20, 14);
    ctx.fillStyle = `hsl(${s.health}, 70%, 50%)`;
    ctx.fillRect(10, 10, (W - 20) * s.health / 100, 14);
    ctx.fillStyle = '#ffffff55';
    ctx.font = '10px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('❤️', 14, 17);

    // Happiness bar
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(10, 28, W - 20, 14);
    ctx.fillStyle = '#f9ca24';
    ctx.fillRect(10, 28, (W - 20) * s.happiness / 100, 14);
    ctx.fillText('😊', 14, 35);

    // Horse emoji (center top)
    ctx.font = '40px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const bounce = Math.sin(time * 3) * 2;
    ctx.fillText('🐴', W / 2, 54 + bounce);

    // Lane backgrounds
    for (let i = 0; i < N_LANES; i++) {
      const x = i * LANE_W;
      // Alternating subtle bg
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(x, 70, LANE_W, H - 70);

      // Lane separator
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, 70); ctx.lineTo(x, H); ctx.stroke();
    }

    // Hit-line glow
    ctx.strokeStyle = 'rgba(201,168,76,0.9)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#c9a84c';
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.moveTo(0, HITLINE_Y); ctx.lineTo(W, HITLINE_Y); ctx.stroke();
    ctx.shadowBlur = 0;

    // Lane icons (at hit line level, dimly)
    ctx.font = '18px sans-serif'; ctx.textBaseline = 'middle';
    for (let i = 0; i < N_LANES; i++) {
      ctx.globalAlpha = 0.3;
      ctx.textAlign = 'center';
      ctx.fillText(LANES[i].icon, i * LANE_W + LANE_W / 2, HITLINE_Y);
    }
    ctx.globalAlpha = 1;

    // Hit flashes
    for (const f of hitFlashes) {
      const alpha = f.t / 0.35;
      const x = f.lane * LANE_W;
      ctx.fillStyle = f.success ? `rgba(201,168,76,${alpha * 0.35})` : `rgba(231,76,60,${alpha * 0.25})`;
      ctx.fillRect(x, 70, LANE_W, H - 70);
    }

    // Draw notes
    for (const n of notes) {
      if (n.hit) continue;
      const cx = n.lane * LANE_W + LANE_W / 2;
      const lane = LANES[n.lane];
      const distFromHit = Math.abs(n.y - HITLINE_Y);
      const inWindow = distFromHit <= 38;

      // Glow when near hit line
      if (inWindow) {
        ctx.shadowColor = lane.color;
        ctx.shadowBlur  = 16;
      }

      // Circle
      ctx.beginPath();
      ctx.fillStyle = n.missed ? 'rgba(80,80,80,0.5)' : lane.color + (inWindow ? 'ff' : 'cc');
      ctx.arc(cx, n.y, NOTE_R, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = n.missed ? '#555' : '#ffffff55';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, n.y, NOTE_R, 0, Math.PI * 2); ctx.stroke();

      ctx.shadowBlur = 0;

      // Icon
      ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.globalAlpha = n.missed ? 0.3 : 1;
      ctx.fillText(lane.icon, cx, n.y);
      ctx.globalAlpha = 1;
    }

    // Timer arc (top-right)
    const remFrac = Math.max(0, s.timeLeft / 40);
    ctx.strokeStyle = 'rgba(201,168,76,0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(W - 22, 22, 14, -Math.PI / 2, -Math.PI / 2 + remFrac * Math.PI * 2);
    ctx.stroke();
  },

  _endStableGame() {
    const s = this._stable;
    if (!s) return;
    s.running = false;
    cancelAnimationFrame(s.rafId);

    const score = (s.health + s.happiness) / 2;
    const result = Game.applyStableResult(score);
    UI.showStableResult(result);
    UI.refresh();
    if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
  },

  _endPrayer() {
    this._prayPhase = 'result';
    cancelAnimationFrame(this._prayAnimFrameId);
    this._prayAnimFrameId = null;
    const result = Game.applyPrayResult(this._prayDevotion);
    UI.showPrayerResult(result);
    UI.refresh();
    if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
  },

  /* ─── Salva i Prigionieri (Paladino) ──────────────────────── */
  _rescue: null,

  _buildRescueCamp(config) {
    const { id, cx, cy, pCount, enemyHp, enemyCount, patrolR } = config;
    const enemies = [];
    for (let i = 0; i < enemyCount; i++) {
      const angle = (i / enemyCount) * Math.PI * 2 - Math.PI / 2;
      const pR = patrolR || 34;
      enemies.push({
        id: `e${id}_${i}`,
        x: cx + Math.cos(angle) * pR,
        y: cy + Math.sin(angle) * pR,
        hp: enemyHp, maxHp: enemyHp, alive: true, flashT: 0,
        patrolAngle: angle,
        patrolSpeed: 0.55 + Math.random() * 0.45,
        patrolR: pR,
        cx, cy,
      });
    }
    const prisoners = [];
    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2;
      prisoners.push({
        x: cx + Math.cos(angle) * 13,
        y: cy + Math.sin(angle) * 13,
        state: 'guarded',
      });
    }
    return { id, cx, cy, enemies, prisoners };
  },

  _startRescueGame() {
    const cls       = Game.getClasse();
    const abilities = Game.getEquipmentAbilities();
    const strBase   = (cls.rescueStrengthBase || 20) + (abilities.rescueStrengthBonus || 0);
    const canvas    = document.getElementById('rescue-canvas');
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;

    const numCamps = 5 + Math.floor(Math.random() * 6); // 5–10 camps
    // Build a 4×3 grid of candidate positions, shuffle, take numCamps
    const _margin = 90, _cols = 4, _rows = 3;
    const _cw = (W - _margin*2) / _cols, _ch = (H - _margin*2) / _rows;
    const _positions = [];
    for (let r = 0; r < _rows; r++) {
      for (let c = 0; c < _cols; c++) {
        const cx = Math.round(_margin + _cw*(c + 0.2 + Math.random()*0.6));
        const cy = Math.round(_margin + _ch*(r + 0.2 + Math.random()*0.6));
        if (Math.hypot(cx - W/2, cy - H/2) > 90) _positions.push({ cx, cy });
      }
    }
    _positions.sort(() => Math.random() - 0.5);
    const campConfigs = [];
    for (let i = 0; i < numCamps; i++) {
      const pos  = _positions[i % _positions.length];
      const tier = i < numCamps / 3 ? 0 : i < numCamps * 2 / 3 ? 1 : 2;
      const hpBase   = [8, 14, 20][tier];
      const hpExtra  = Math.floor(Math.random() * [5, 6, 8][tier]);
      const eCount   = tier === 0 ? 2 : (Math.random() < 0.5 ? 2 : 3);
      const pCount   = tier === 0 ? 2 : (Math.random() < 0.5 ? 2 : 3);
      campConfigs.push({ id: i, cx: pos.cx, cy: pos.cy, pCount, enemyHp: hpBase + hpExtra, enemyCount: eCount, patrolR: 18 + tier * 2 });
    }
    const totalPrisoners = campConfigs.reduce((s, c) => s + c.pCount, 0);

    this._rescue = {
      running: true,
      timer: 60,
      strengthBase: strBase,
      strength: strBase,
      savedCount: 0,
      totalPrisoners,
      died: false,
      bossKilled: false,
      bossSpawned: false,
      boss: null,
      paladin: { x: Math.round(W/2), y: Math.round(H/2), destX: Math.round(W/2), destY: Math.round(H/2), speed: 145 },
      camps: campConfigs.map(c => this._buildRescueCamp(c)),
      particles: [],
      hitCooldown: {},
      holyPowerTimer: 6,
      holyPowerActive: false,
      holyPowerDuration: 0,
      holyPowerDmgTimer: 0,
      holyTextT: 0,
      lastTs: null,
      rafId: null,
    };

    document.getElementById('rescue-hud-strength').textContent = strBase;
    document.getElementById('rescue-hud-timer').textContent    = '60';
    document.getElementById('rescue-hud-saved').textContent    = '0';
    document.getElementById('rescue-hud-total').textContent    = totalPrisoners;
    const lbl = document.getElementById('rescue-hud-holylabel');
    if (lbl) lbl.style.opacity = '0.4';

    this._rescue.rafId = requestAnimationFrame(ts => this._rescueLoop(ts));
  },

  _rescueLoop(ts) {
    const s = this._rescue;
    if (!s || !s.running) return;
    const dt = s.lastTs ? Math.min((ts - s.lastTs) / 1000, 0.1) : 0.016;
    s.lastTs = ts;

    s.timer = Math.max(0, s.timer - dt);
    document.getElementById('rescue-hud-timer').textContent    = Math.ceil(s.timer);
    document.getElementById('rescue-hud-strength').textContent = Math.ceil(s.strength);
    document.getElementById('rescue-hud-saved').textContent    = s.savedCount;

    // Move paladin
    const pal = s.paladin;
    const pdx = pal.destX - pal.x, pdy = pal.destY - pal.y;
    const pdist = Math.hypot(pdx, pdy);
    if (pdist > 2) { const spd = Math.min(pdist, pal.speed * dt); pal.x += (pdx/pdist)*spd; pal.y += (pdy/pdist)*spd; }

    // Enemy patrol
    for (const camp of s.camps) {
      for (const en of camp.enemies) {
        if (!en.alive) continue;
        en.patrolAngle += en.patrolSpeed * dt;
        en.x = en.cx + Math.cos(en.patrolAngle) * en.patrolR;
        en.y = en.cy + Math.sin(en.patrolAngle) * en.patrolR;
        if (en.flashT > 0) en.flashT = Math.max(0, en.flashT - dt);
      }
    }

    // Boss patrol
    if (s.boss && s.boss.alive) {
      s.boss.patrolAngle += s.boss.patrolSpeed * dt;
      s.boss.x = s.boss.cx + Math.cos(s.boss.patrolAngle) * s.boss.patrolR;
      s.boss.y = s.boss.cy + Math.sin(s.boss.patrolAngle) * s.boss.patrolR;
      if (s.boss.flashT > 0) s.boss.flashT = Math.max(0, s.boss.flashT - dt);
    }

    // Proximity drain
    let nearCount = 0;
    for (const camp of s.camps) {
      for (const en of camp.enemies) {
        if (!en.alive) continue;
        if (Math.hypot(pal.x - en.x, pal.y - en.y) < 48) nearCount++;
      }
    }
    if (s.boss && s.boss.alive && Math.hypot(pal.x - s.boss.x, pal.y - s.boss.y) < 75) nearCount += 2;
    if (nearCount > 0) {
      s.strength = Math.max(0, s.strength - 2.8 * nearCount * dt);
      if (s.strength <= 0) { s.died = true; this._endRescueGame(); return; }
    }

    for (const id in s.hitCooldown) s.hitCooldown[id] = Math.max(0, s.hitCooldown[id] - dt);
    s.particles = s.particles.filter(p => { p.t = Math.max(0, p.t - dt); return p.t > 0; });

    // Auto aura damage (every 0.5s, x2 during Giusto Potere)
    s.auraDmgTimer = Math.max(0, (s.auraDmgTimer || 0) - dt);
    if (s.auraDmgTimer <= 0) {
      s.auraDmgTimer = 0.5;
      const auraR = s.holyPowerActive ? 82 : 52;
      const baseDmg = Math.max(1, 1 + Math.floor(s.savedCount / 2));
      const dmg = s.holyPowerActive ? baseDmg * 2 : baseDmg;
      const pType = s.holyPowerActive ? 'holy_hit' : 'hit';
      for (const camp of s.camps) {
        for (const en of camp.enemies) {
          if (!en.alive) continue;
          if (Math.hypot(pal.x - en.x, pal.y - en.y) < auraR) {
            en.hp = Math.max(0, en.hp - dmg); en.flashT = 0.15;
            s.particles.push({ x: en.x, y: en.y - 14, t: 0.5, maxT: 0.5, type: pType, txt: '-' + dmg });
            if (en.hp <= 0) {
              en.alive = false;
              for (let i = 0; i < 6; i++) {
                const a = Math.random()*Math.PI*2, sp = 30+Math.random()*50;
                s.particles.push({ x: en.x, y: en.y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, t: 0.5, maxT: 0.5, type: 'spark' });
              }
            }
          }
        }
      }
      if (s.boss && s.boss.alive && Math.hypot(pal.x - s.boss.x, pal.y - s.boss.y) < auraR) {
        s.boss.hp = Math.max(0, s.boss.hp - dmg); s.boss.flashT = 0.15;
        s.particles.push({ x: s.boss.x, y: s.boss.y - 22, t: 0.5, maxT: 0.5, type: pType, txt: '-' + dmg });
        if (s.boss.hp <= 0) s.boss.alive = false;
      }
    }

    // Holy Power timer
    if (s.holyPowerActive) {
      s.holyPowerDuration = Math.max(0, s.holyPowerDuration - dt);
      if (s.holyPowerDuration <= 0) {
        s.holyPowerActive = false; s.holyPowerTimer = 6;
        const lbl = document.getElementById('rescue-hud-holylabel');
        if (lbl) lbl.style.opacity = '0.4';
      }
    } else {
      s.holyPowerTimer = Math.max(0, s.holyPowerTimer - dt);
      if (s.holyPowerTimer <= 0) {
        s.holyPowerActive = true; s.holyPowerDuration = 3; s.holyTextT = 2.8;
        const lbl = document.getElementById('rescue-hud-holylabel');
        if (lbl) lbl.style.opacity = '1';
        for (let i = 0; i < 12; i++) {
          const a = (i/12)*Math.PI*2;
          s.particles.push({ x: pal.x+Math.cos(a)*20, y: pal.y+Math.sin(a)*20, vx: Math.cos(a)*70, vy: Math.sin(a)*70, t: 0.7, maxT: 0.7, type: 'holy_burst' });
        }
      }
    }
    if (s.holyTextT > 0) s.holyTextT = Math.max(0, s.holyTextT - dt);

    // Free prisoners — move toward paladin; once close, orbit with him
    for (const camp of s.camps) {
      for (const pris of camp.prisoners) {
        if (pris.state === 'following') {
          // Orbit around paladin
          pris.orbitAngle = ((pris.orbitAngle || 0) + 1.1 * dt) % (Math.PI * 2);
          const orbitR = 30 + (pris.orbitIndex % 3) * 16;
          pris.x = pal.x + Math.cos(pris.orbitAngle) * orbitR;
          pris.y = pal.y + Math.sin(pris.orbitAngle) * orbitR;
        } else if (pris.state === 'freed') {
          const dx = pal.x - pris.x, dy = pal.y - pris.y, d = Math.hypot(dx, dy);
          if (d < 22) {
            pris.orbitIndex = s.savedCount;
            pris.orbitAngle = Math.atan2(pris.y - pal.y, pris.x - pal.x);
            pris.state = 'following';
            s.savedCount++;
            s.strength = Math.min(s.strength + 3, s.strengthBase + s.savedCount * 4);
            s.particles.push({ x: pal.x, y: pal.y - 22, t: 0.9, maxT: 0.9, type: 'join', txt: '+3\u26A1' });
            document.getElementById('rescue-hud-strength').textContent = Math.ceil(s.strength);
            document.getElementById('rescue-hud-saved').textContent    = s.savedCount;
          } else { const spd = Math.min(d, 160*dt); pris.x += (dx/d)*spd; pris.y += (dy/d)*spd; }
        }
      }
      if (camp.enemies.every(e => !e.alive)) {
        for (const pris of camp.prisoners) { if (pris.state === 'guarded') pris.state = 'freed'; }
      }
    }

    // Spawn boss
    const canvas = document.getElementById('rescue-canvas');
    const W = canvas ? canvas.width : 520, H = canvas ? canvas.height : 320;
    if (!s.bossSpawned && s.camps.every(c => c.enemies.every(e => !e.alive))) {
      s.bossSpawned = true;
      s.boss = { x: W/2, y: H/2, cx: W/2, cy: H/2, hp: 80, maxHp: 80, alive: true, flashT: 0, patrolAngle: 0, patrolSpeed: 0.38, patrolR: 38 };
      for (let i = 0; i < 18; i++) {
        const a = (i/18)*Math.PI*2;
        s.particles.push({ x: W/2, y: H/2, vx: Math.cos(a)*100, vy: Math.sin(a)*100, t: 1.0, maxT: 1.0, type: 'boss_spawn' });
      }
    }

    if (s.boss && !s.boss.alive) { s.bossKilled = true; this._endRescueGame(); return; }
    if (s.timer <= 0) { this._endRescueGame(); return; }

    if (canvas) this._drawRescue(canvas, s);
    s.rafId = requestAnimationFrame(ts2 => this._rescueLoop(ts2));
  },

  _rescueHandleClick(mx, my, canvas) {
    const s = this._rescue;
    if (!s || !s.running) return;
    const m = 22;
    s.paladin.destX = Math.max(m, Math.min(canvas.width  - m, mx));
    s.paladin.destY = Math.max(m, Math.min(canvas.height - m, my));
  },

  _drawRescue(canvas, s) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const now = Date.now();

    ctx.fillStyle = '#12121e'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Camp zones
    for (const camp of s.camps) {
      const cleared = camp.enemies.every(e => !e.alive);
      ctx.save();
      const g = ctx.createRadialGradient(camp.cx, camp.cy, 0, camp.cx, camp.cy, 32);
      g.addColorStop(0, cleared ? 'rgba(46,204,113,0.10)' : 'rgba(155,89,182,0.08)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(camp.cx, camp.cy, 32, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = cleared ? 'rgba(46,204,113,0.22)' : 'rgba(155,89,182,0.15)';
      ctx.lineWidth = 1; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.arc(camp.cx, camp.cy, 32, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
    }

    // Boss zone
    if (s.bossSpawned && s.boss && s.boss.alive) {
      const pulse = 0.5 + 0.5*Math.sin(now/250);
      ctx.save();
      const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 46);
      bg.addColorStop(0, 'rgba(180,0,200,' + (0.13*pulse) + ')'); bg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(W/2, H/2, 46, 0, Math.PI*2); ctx.fill(); ctx.restore();
    }

    // Particles
    for (const p of s.particles) {
      const alpha = p.t / p.maxT; ctx.save(); ctx.globalAlpha = alpha;
      if (p.type === 'hit') {
        ctx.fillStyle = '#e74c3c'; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(p.txt, p.x, p.y - (1-alpha)*18);
      } else if (p.type === 'holy_hit') {
        ctx.fillStyle = '#f0e030'; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(p.txt, p.x, p.y - (1-alpha)*20);
      } else if (p.type === 'join') {
        ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(p.txt, p.x, p.y - (1-alpha)*26);
      } else if (p.type === 'spark' || p.type === 'boss_spark') {
        const prog = 1-(p.t/p.maxT);
        ctx.fillStyle = p.type === 'boss_spark' ? 'hsl(' + (300+prog*60) + ',100%,65%)' : 'hsl(' + (280+prog*60) + ',90%,65%)';
        ctx.beginPath(); ctx.arc(p.x+p.vx*prog*(p.maxT*0.7), p.y+p.vy*prog*(p.maxT*0.7), 2.5*alpha, 0, Math.PI*2); ctx.fill();
      } else if (p.type === 'holy_burst') {
        const prog = 1-(p.t/p.maxT);
        ctx.fillStyle = 'rgba(240,220,60,' + alpha + ')';
        ctx.beginPath(); ctx.arc(p.x+p.vx*prog*(p.maxT*0.6), p.y+p.vy*prog*(p.maxT*0.6), 3*alpha, 0, Math.PI*2); ctx.fill();
      } else if (p.type === 'boss_spawn') {
        const prog = 1-(p.t/p.maxT);
        ctx.fillStyle = 'rgba(200,0,220,' + alpha + ')';
        ctx.beginPath(); ctx.arc(p.x+p.vx*prog*(p.maxT*0.8), p.y+p.vy*prog*(p.maxT*0.8), 4*alpha, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }

    // Prisoners (guarded, freed, following)
    for (const camp of s.camps) {
      for (const pris of camp.prisoners) {
        if (pris.state === 'rescued') continue; // legacy guard
        const { x, y } = pris;
        const isFollowing = pris.state === 'following';
        const isFree = pris.state === 'freed' || isFollowing;
        const pulse = 0.55 + 0.45*Math.sin(now/550+x);
        ctx.save();
        const glowColor = isFollowing ? ('rgba(82,183,136,' + (0.45*pulse) + ')') : isFree ? ('rgba(46,204,113,' + (0.38*pulse) + ')') : ('rgba(130,200,240,' + (0.35*pulse) + ')');
        const glow = ctx.createRadialGradient(x,y,0,x,y,12);
        glow.addColorStop(0, glowColor);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x,y,12,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = isFollowing ? '#52b788' : isFree ? '#2ecc71' : '#7ec8e3';
        ctx.strokeStyle = isFollowing ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill(); ctx.stroke();
        const bodyColor = isFollowing ? '#1d6e52' : isFree ? '#1a7a4a' : '#2c6a80';
        ctx.fillStyle = bodyColor;
        ctx.beginPath(); ctx.arc(x,y-2.3,1.8,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = bodyColor; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+3.5); ctx.stroke();
        if (pris.state==='guarded') { ctx.strokeStyle='rgba(200,200,200,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(x+3.5,y+1,1.6,0,Math.PI*2); ctx.stroke(); }
        ctx.restore();
      }
    }

    // Regular enemies
    for (const camp of s.camps) {
      for (const en of camp.enemies) {
        if (!en.alive) continue;
        const { x, y } = en;
        const isNear = Math.hypot(s.paladin.x-x, s.paladin.y-y) < 50;
        const pulse  = 0.5+0.5*Math.sin(now/220+x);
        ctx.save();
        const aura = ctx.createRadialGradient(x,y,0,x,y,14);
        aura.addColorStop(0, 'rgba(155,89,182,' + (isNear ? 0.28*pulse : 0.10) + ')');
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(x,y,14,0,Math.PI*2); ctx.fill();
        if (en.flashT > 0) { ctx.fillStyle='rgba(255,100,100,' + (en.flashT/0.18) + ')'; ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2); ctx.fill(); }
        ctx.fillStyle='#3d0a55'; ctx.strokeStyle='#9b59b6'; ctx.lineWidth=1;
        ctx.beginPath();
        for (let i=0; i<6; i++) { const a=(i/6)*Math.PI*2-Math.PI/6; i===0?ctx.moveTo(x+Math.cos(a)*9,y+Math.sin(a)*9):ctx.lineTo(x+Math.cos(a)*9,y+Math.sin(a)*9); }
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#6c2e88'; ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#e74c3c';
        ctx.beginPath(); ctx.arc(x-2.8,y-1.4,1.6,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(x+2.8,y-1.4,1.6,0,Math.PI*2); ctx.fill();
        const bw=18, bh=3, bx=x-bw/2, by=y-17;
        ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(bx-1,by-1,bw+2,bh+2,2); ctx.fill();
        const hp=en.hp/en.maxHp; ctx.fillStyle=hp>0.6?'#2ecc71':hp>0.3?'#f39c12':'#e74c3c';
        ctx.beginPath(); ctx.roundRect(bx,by,bw*hp,bh,2); ctx.fill();
        ctx.restore();
      }
    }

    // Boss
    if (s.boss && s.boss.alive) {
      const { x, y, hp, maxHp, flashT } = s.boss;
      const isNear = Math.hypot(s.paladin.x-x, s.paladin.y-y) < 65;
      const pulse  = 0.5+0.5*Math.sin(now/180);
      ctx.save();
      const aura = ctx.createRadialGradient(x,y,0,x,y,32);
      aura.addColorStop(0, 'rgba(200,0,220,' + (isNear ? 0.30*pulse : 0.16) + ')');
      aura.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle=aura; ctx.beginPath(); ctx.arc(x,y,32,0,Math.PI*2); ctx.fill();
      if (flashT>0) { ctx.fillStyle='rgba(255,120,120,' + (flashT/0.18) + ')'; ctx.beginPath(); ctx.arc(x,y,20,0,Math.PI*2); ctx.fill(); }
      ctx.fillStyle='#2d0040'; ctx.strokeStyle='#cc22cc'; ctx.lineWidth=1.5;
      ctx.beginPath();
      for (let i=0; i<8; i++) { const a=(i/8)*Math.PI*2-Math.PI/8; i===0?ctx.moveTo(x+Math.cos(a)*17,y+Math.sin(a)*17):ctx.lineTo(x+Math.cos(a)*17,y+Math.sin(a)*17); }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle='#880099'; ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#c9a84c';
      ctx.beginPath(); ctx.moveTo(x-6.3,y-12.6); ctx.lineTo(x-6.3,y-20.7); ctx.lineTo(x-2.9,y-17.3); ctx.lineTo(x,y-23); ctx.lineTo(x+2.9,y-17.3); ctx.lineTo(x+6.3,y-20.7); ctx.lineTo(x+6.3,y-12.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#ff0000';
      ctx.beginPath(); ctx.arc(x-4.6,y-1.4,2.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x+4.6,y-1.4,2.3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x,y-5.8,1.6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#ff6666';
      ctx.beginPath(); ctx.arc(x-4.6,y-2.3,0.9,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x+4.6,y-2.3,0.9,0,Math.PI*2); ctx.fill();
      const bw=35, bh=4, bx=x-bw/2, by=y-30;
      ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.beginPath(); ctx.roundRect(bx-1,by-1,bw+2,bh+2,3); ctx.fill();
      const hpPct=hp/maxHp; ctx.fillStyle=hpPct>0.6?'#aa00cc':hpPct>0.3?'#cc3300':'#ff0000';
      ctx.beginPath(); ctx.roundRect(bx,by,bw*hpPct,bh,3); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font='bold 8px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('\uD83D\uDC51 ' + hp + '/' + maxHp, x, by+bh/2);
      ctx.restore();
    }

    // Paladin combat aura (damage zone — radius expands during Giusto Potere)
    {
      const px = s.paladin.x, py = s.paladin.y;
      const auraR = s.holyPowerActive ? 82 : 52;
      const pulse = 0.5 + 0.5*Math.sin(now/400);
      ctx.save();
      if (s.holyPowerActive) {
        const g = ctx.createRadialGradient(px,py,0,px,py,auraR);
        g.addColorStop(0, 'rgba(255,230,30,' + (0.22+0.12*pulse) + ')');
        g.addColorStop(0.6, 'rgba(255,200,0,' + (0.10+0.06*pulse) + ')');
        g.addColorStop(1, 'rgba(255,200,0,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px,py,auraR,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,230,30,' + (0.65+0.25*pulse) + ')';
        ctx.lineWidth = 1.5;
      } else {
        const g = ctx.createRadialGradient(px,py,0,px,py,auraR);
        g.addColorStop(0, 'rgba(201,168,76,' + (0.12+0.06*pulse) + ')');
        g.addColorStop(0.6, 'rgba(201,168,76,' + (0.06+0.03*pulse) + ')');
        g.addColorStop(1, 'rgba(201,168,76,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px,py,auraR,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(201,168,76,' + (0.35+0.15*pulse) + ')';
        ctx.lineWidth = 1;
      }
      ctx.setLineDash([4,5]);
      ctx.beginPath(); ctx.arc(px,py,auraR,0,Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // Paladin
    this._drawRescuePaladin(ctx, s.paladin.x, s.paladin.y, s.strength, s.strengthBase, now);

    // Holy Power recharge arc (small indicator around paladin)
    if (!s.holyPowerActive) {
      const pct = 1 - s.holyPowerTimer / 6;
      ctx.save(); ctx.strokeStyle='rgba(240,220,60,0.55)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(s.paladin.x, s.paladin.y, 24, -Math.PI/2, -Math.PI/2+pct*Math.PI*2); ctx.stroke(); ctx.restore();
    } else {
      const pulse = 0.5+0.5*Math.sin(now/80);
      ctx.save(); ctx.strokeStyle='rgba(255,230,30,' + (0.5+0.4*pulse) + ')'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(s.paladin.x, s.paladin.y, 24, 0, Math.PI*2); ctx.stroke(); ctx.restore();
    }

    // Strength number — large, above paladin (unscaled)
    {
      const px = s.paladin.x, py = s.paladin.y;
      const strLow = s.strength < 5, strHigh = s.strength > s.strengthBase * 1.4;
      const col = strLow ? '#e74c3c' : strHigh ? '#2ecc71' : '#c9a84c';
      ctx.save();
      ctx.shadowColor = col; ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath(); ctx.roundRect(px-22, py-50, 44, 22, 5); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = col; ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('\u26A1 ' + Math.ceil(s.strength), px, py-39);
      ctx.restore();
    }

    // "Giusto Potere!" text overlay
    if (s.holyTextT > 0) {
      const alpha = Math.min(1, s.holyTextT);
      const pulseTxt = s.holyPowerActive ? (0.75+0.25*Math.sin(now/90)) : alpha;
      ctx.save(); ctx.globalAlpha=pulseTxt;
      ctx.shadowColor='#c9a84c'; ctx.shadowBlur=18;
      ctx.fillStyle='#f0e040'; ctx.font='bold 16px "Cinzel",serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('\u26A1 Giusto Potere! \u26A1', W/2, H-20);
      ctx.restore();
    }

    // Boss incoming warning
    if (s.camps.every(c=>c.enemies.every(e=>!e.alive)) && !s.bossSpawned) {
      ctx.save(); ctx.globalAlpha=0.5+0.4*Math.sin(now/200);
      ctx.fillStyle='#ff44ff'; ctx.font='bold 13px "Cinzel",serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('\uD83D\uDC51 IL BOSS SI AVVICINA...', W/2, H/2-22);
      ctx.restore();
    }

    // Strength bar
    const barW=90, barH=6, barX=W/2-barW/2, barY=H-11;
    const strPct=Math.max(0,Math.min(1,s.strength/Math.max(1,s.strengthBase+s.savedCount*4)));
    ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.roundRect(barX-1,barY-1,barW+2,barH+2,3); ctx.fill();
    ctx.fillStyle=strPct>0.5?'#c9a84c':strPct>0.25?'#f39c12':'#e74c3c';
    ctx.beginPath(); ctx.roundRect(barX,barY,barW*strPct,barH,3); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.font='8px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('FORZA', W/2, barY+barH/2);
  },

  _drawRescuePaladin(ctx, x, y, strength, strengthBase, now) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(0.55, 0.55); ctx.translate(-x, -y);

    const auraR = 26 + (strength/Math.max(strengthBase,1))*8;
    const auraA = 0.15 + 0.10*Math.sin(now/600);
    const aura  = ctx.createRadialGradient(x,y,0,x,y,auraR);
    aura.addColorStop(0, 'rgba(201,168,76,' + (auraA*2) + ')'); aura.addColorStop(1, 'rgba(201,168,76,0)');
    ctx.fillStyle=aura; ctx.beginPath(); ctx.arc(x,y,auraR,0,Math.PI*2); ctx.fill();

    // HORSE
    ctx.fillStyle='#7a4e2d'; ctx.beginPath(); ctx.ellipse(x+7,y+9,25,13,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#9b6840'; ctx.beginPath(); ctx.ellipse(x+6,y+11,18,8,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#6b3d20'; ctx.beginPath(); ctx.ellipse(x-14,y,9,15,-0.45,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#7a4e2d'; ctx.beginPath(); ctx.ellipse(x-24,y-11,10,7,-0.6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3d1a08'; ctx.beginPath(); ctx.ellipse(x-31,y-10,2,1.5,-0.3,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#6b3d20'; ctx.beginPath(); ctx.moveTo(x-29,y-17); ctx.lineTo(x-34,y-24); ctx.lineTo(x-25,y-20); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#2c1406'; ctx.beginPath(); ctx.ellipse(x-17,y-5,4,13,-0.45,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1a0a00'; ctx.beginPath(); ctx.arc(x-27,y-13,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff';    ctx.beginPath(); ctx.arc(x-26.5,y-13.5,0.8,0,Math.PI*2); ctx.fill();
    const legs=[{ox:-8,a:-0.3,len:14},{ox:2,a:0.2,len:13},{ox:12,a:-0.1,len:14},{ox:22,a:0.35,len:13}];
    for (const l of legs) {
      const bx=x+l.ox, by=y+19, ex=bx+Math.sin(l.a)*l.len, ey=by+Math.cos(l.a)*l.len;
      ctx.strokeStyle='#5a3015'; ctx.lineWidth=5; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(ex,ey); ctx.stroke();
      ctx.fillStyle='#1a0a00'; ctx.beginPath(); ctx.ellipse(ex,ey,4,2.5,l.a,0,Math.PI*2); ctx.fill();
    }
    ctx.strokeStyle='#2c1406'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x+30,y+6); ctx.quadraticCurveTo(x+42,y,x+36,y+22); ctx.stroke();

    // RIDER
    ctx.fillStyle='#8B0000';
    ctx.beginPath(); ctx.moveTo(x+9,y-22); ctx.quadraticCurveTo(x+24,y-6,x+18,y+10); ctx.lineTo(x+8,y-2); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#2a5f8a'; ctx.beginPath(); ctx.ellipse(x+1,y-14,12,14,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3a7ab0'; ctx.beginPath(); ctx.ellipse(x-1,y-16,8,9,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#c9a84c'; ctx.fillRect(x-1.5,y-26,3.5,14); ctx.fillRect(x-7,y-20,13,3.5);
    ctx.fillStyle='#6b3d20'; ctx.fillRect(x-10,y-4,22,3);
    ctx.fillStyle='#c9a84c'; ctx.beginPath(); ctx.arc(x+1,y-30,11,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#a88030'; ctx.beginPath(); ctx.ellipse(x+1,y-22,9,5,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1c2333'; ctx.beginPath(); ctx.roundRect(x-8,y-34,18,6,2); ctx.fill();
    ctx.strokeStyle='rgba(201,168,76,0.4)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x-6,y-31); ctx.lineTo(x+8,y-31); ctx.stroke();
    ctx.strokeStyle='#e74c3c'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x+1,y-41); ctx.quadraticCurveTo(x+5,y-50,x+3,y-56); ctx.stroke();
    ctx.strokeStyle='#c0392b'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x+3,y-42); ctx.quadraticCurveTo(x+7,y-51,x+5,y-57); ctx.stroke();
    ctx.fillStyle='#1a4b7a'; ctx.strokeStyle='#c9a84c'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x-12,y-28); ctx.lineTo(x-6,y-28); ctx.lineTo(x-6,y-12); ctx.lineTo(x-9,y-8); ctx.lineTo(x-12,y-12); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#c9a84c'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x-9,y-28); ctx.lineTo(x-9,y-10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-12,y-19); ctx.lineTo(x-6,y-19); ctx.stroke();
    ctx.strokeStyle='#d8d8d8'; ctx.lineWidth=2.5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x+14,y-10); ctx.lineTo(x+22,y-36); ctx.stroke();
    ctx.strokeStyle='#c9a84c'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(x+10,y-17); ctx.lineTo(x+18,y-17); ctx.stroke();
    ctx.fillStyle='#c9a84c'; ctx.beginPath(); ctx.arc(x+16,y-9,3,0,Math.PI*2); ctx.fill();

    ctx.restore();
  },

  _endRescueGame() {
    const s = this._rescue;
    if (!s) return;
    s.running = false;
    cancelAnimationFrame(s.rafId);
    const result = Game.applyRescueResult(s.savedCount, s.totalPrisoners, s.died, s.bossKilled);
    document.getElementById('rescue-game-area').classList.add('d-none');
    UI.showRescueResult(result);
    UI.refresh();
    if (result.levelUpResult) this._triggerLevelUp(result.levelUpResult);
  },


};

/* ─── Avvio ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => App.init());
