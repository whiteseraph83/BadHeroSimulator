/* ============================================================
   game.js — Meccaniche di gioco v2: dadi, prove, XP, salvataggio
   ============================================================ */

const SAVE_KEY = 'badhero_save_v2';
const SAVE_VERSION = 2;


const Game = {

  /* ─── Stato corrente ───────────────────────────────────── */
  state: null,

  /* ─── Inizializzazione ─────────────────────────────────── */
  init() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.version === SAVE_VERSION) {
          this.state = parsed;
          // Migrazioni campi assenti
          if (!this.state.dailyChallenges)                   { this.generateDailyChallenges(); this.save(); }
          if (this.state.challengeRefreshUsed === undefined)   this.state.challengeRefreshUsed = 0;
          if (this.state.character.wanted === undefined)       this.state.character.wanted = 0;
          if (this.state.wantedMissionPending === undefined)   this.state.wantedMissionPending = false;
          if (this.state.wantedMissionCompleted === undefined) this.state.wantedMissionCompleted = false;
          if (!this.state.activeBoosts)                        this.state.activeBoosts = [];
          if (this.state.diceRerollsUsed === undefined)        this.state.diceRerollsUsed = 0;
          if (!this.state.character.classe)                    this.state.character.classe = 'ladro';
          if (this.state.studyUsed === undefined)              this.state.studyUsed = 0;
          if (this.state.natureUsed === undefined)             this.state.natureUsed = 0;
          if (this.state.freeSpellUsed === undefined)          this.state.freeSpellUsed = 0;
          if (!this.state.componentInventory)                 this.state.componentInventory = [];
          if (!this.state.spellInventory)                     this.state.spellInventory = [];
          if (!this.state.spellRequests)                      this.state.spellRequests = [];
          if (!this.state.knownSpells)                        this.state.knownSpells = [];
          if (this.state.thiefAttackPending === undefined)    this.state.thiefAttackPending = false;
          if (this.state.thiefAttackCompleted === undefined)  this.state.thiefAttackCompleted = false;
          if (this.state.drinkingGameUsed === undefined)      this.state.drinkingGameUsed = 0;
          if (this.state.prayUsed === undefined)               this.state.prayUsed = 0;
          if (this.state.conversionUsed === undefined)         this.state.conversionUsed = 0;
          if (this.state.arenaUsed === undefined)               this.state.arenaUsed = 0;
          if (this.state.arenaHighScore === undefined)         this.state.arenaHighScore = 0;
          if (this.state.stableUsed === undefined)  this.state.stableUsed = 0;
          if (this.state.rescueUsed === undefined)  this.state.rescueUsed = 0;
          if (this.state.combatUsed === undefined)  this.state.combatUsed = 0;
          if (this.state.goldXPOffer === undefined) { this.generateGoldXPOffer(); this.save(); }
          if (this.state.combat === undefined)      this.state.combat = null;
          if (this.state.marketStealBanned === undefined) this.state.marketStealBanned = false;
          if (this.state.character.equipment.shield === undefined) this.state.character.equipment.shield = null;
          return true;
        }
      } catch (e) {
        console.warn('Salvataggio corrotto, nuova partita.');
      }
    }
    return false;
  },

  newGame(stats, name, classeId) {
    const cls = CLASSES.find(c => c.id === classeId) || CLASSES[0];
    this.state = {
      version: SAVE_VERSION,
      character: {
        name: name || 'Eroe',
        classe: cls.id,
        level: 1,
        xp: 0,
        gold: cls.startingGold,
        fame: 10,
        wanted: 0,
        stats: { ...stats },
        proficiency: 2,
        equipment: {
          head: null, gloves: null, legs: null, torso: null,
          boots: null, ringRight: null, ringLeft: null, weapon: null, shield: null
        },
        inventory: [],
        day: 1,
        log: []
      },
      dailyMissions: [],
      completedToday: [],
      marketItems: [],
      dailyChallenges: [],
      challengeRefreshUsed: 0,
      pickpocketsUsed: 0,
      rerollsUsed: 0,
      marketStealBanned: false,
      wantedMissionPending: false,
      wantedMissionCompleted: false,
      thiefAttackPending: false,
      thiefAttackCompleted: false,
      activeBoosts: [],
      diceRerollsUsed: 0,
      componentInventory: [],
      spellInventory: [],
      spellRequests: [],
      knownSpells: [],
      studyUsed: 0,
      natureUsed: 0,
      drinkingGameUsed: 0,
      prayUsed: 0,
      conversionUsed: 0,
      arenaUsed: 0,
      arenaHighScore: 0,
      stableUsed: 0,
      rescueUsed: 0,
      combatUsed: 0,
      combat: null,
      goldXPOffer: undefined,
      gameOver: false
    };
    this.generateDailyMissions();
    this.generateMarketItems();
    this.generateDailyChallenges();
    if (cls.hasSpellTab)   this.generateSpellRequests();
    this.save();
  },

  save() {
    if (this.state) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    }
  },

  reset() {
    localStorage.removeItem(SAVE_KEY);
    this.state = null;
  },

  /* ─── Dadi ─────────────────────────────────────────────── */
  rollD20() { return Math.floor(Math.random() * 20) + 1; },
  rollD6()  { return Math.floor(Math.random() * 6) + 1; },
  rollD100(){ return Math.floor(Math.random() * 100) + 1; },

  roll4d6DropLowest() {
    const rolls = [this.rollD6(), this.rollD6(), this.rollD6(), this.rollD6()];
    rolls.sort((a, b) => a - b);
    return rolls.slice(1).reduce((a, b) => a + b, 0);
  },

  rollAllStats() {
    return Array.from({ length: 6 }, () => this.roll4d6DropLowest());
  },

  rollGold(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /* ─── Modificatori ─────────────────────────────────────── */
  modifier(val) { return Math.floor((val - 10) / 2); },

  getModForStat(statKey) {
    return this.modifier(this.state.character.stats[statKey]);
  },

  /* ─── Stat effettiva (base + equip) ─────────────────────── */
  effectiveStat(key) {
    const base = this.state.character.stats[key] || 0;
    let bonus = 0;
    for (const [slot, itemId] of Object.entries(this.state.character.equipment)) {
      if (!itemId) continue;
      const item = DB.items.find(i => i.id === itemId);
      if (!item || !item.stats) continue;
      bonus += item.stats[key] || 0;
    }
    return base + bonus;
  },

  /* ─── Bonus equipaggiamento su stat (solo per breakdown) ── */
  equipBonusForStat(statKey) {
    let bonus = 0;
    for (const itemId of Object.values(this.state.character.equipment)) {
      if (!itemId) continue;
      const item = DB.items.find(i => i.id === itemId);
      if (!item || !item.stats) continue;
      bonus += item.stats[statKey] || 0;
    }
    return bonus;
  },

  /* ─── Abilità aggregate equipaggiamento ─────────────────── */
  getEquipmentAbilities() {
    const result = { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0, missionBonus: 0, challengeBonus: 0, challengeRefresh: 0, diceRerollBonus: 0, studyBonus: 0, arenaBonus: 0, arenaDoubleHit: false, conversionBonus: 0, conversionSpeed: 0, stableBonus: 0, rescueBonus: 0, rescueStrengthBonus: 0 };
    for (const itemId of Object.values(this.state.character.equipment)) {
      if (!itemId) continue;
      const item = DB.items.find(i => i.id === itemId);
      if (!item || !item.abilities) continue;
      result.pickpocketBonus += item.abilities.pickpocketBonus || 0;
      result.rerollBonus     += item.abilities.rerollBonus     || 0;
      result.taxDiscount     += item.abilities.taxDiscount     || 0;
      result.goldBonus       += item.abilities.goldBonus       || 0;
      result.xpBonus         += item.abilities.xpBonus         || 0;
      result.missionBonus      += item.abilities.missionBonus    || 0;
      result.challengeBonus    += item.abilities.challengeBonus  || 0;
      result.challengeRefresh  += item.abilities.challengeRefresh || 0;
      result.diceRerollBonus   += item.abilities.diceRerollBonus  || 0;
      result.studyBonus        += item.abilities.studyBonus       || 0;
      result.arenaBonus    += item.abilities.arenaBonus    || 0;
      result.arenaDoubleHit = result.arenaDoubleHit || !!(item.abilities.arenaDoubleHit);
      result.conversionBonus += item.abilities.conversionBonus || 0;
      result.conversionSpeed += item.abilities.conversionSpeed || 0;
      result.stableBonus         += item.abilities.stableBonus         || 0;
      result.rescueBonus         += item.abilities.rescueBonus         || 0;
      result.rescueStrengthBonus += item.abilities.rescueStrengthBonus || 0;
    }
    return result;
  },

  /* ─── Boost attivi (consumabili) ───────────────────────── */
  getActiveBoostMultipliers() {
    return (this.state.activeBoosts || []).reduce(
      (acc, b) => ({ xp: acc.xp + (b.xpBoost||0), gold: acc.gold + (b.goldBoost||0), fame: acc.fame + (b.fameBoost||0) }),
      { xp: 0, gold: 0, fame: 0 }
    );
  },

  useConsumable(itemId) {
    const char = this.state.character;
    const item = DB.items.find(i => i.id === itemId);
    if (!item?.consumable) return { ok: false, reason: 'Non è un consumabile.' };
    const idx = char.inventory.indexOf(itemId);
    if (idx === -1) return { ok: false, reason: 'Oggetto non trovato.' };

    const e = item.effect;
    let result = {};
    if (e.type === 'instant') {
      char.xp   += e.xp   || 0;
      char.gold += e.gold || 0;
      char.fame += e.fame || 0;
      result = { xp: e.xp||0, gold: e.gold||0, fame: e.fame||0 };
    } else {
      // Blocca se c'è già un boost attivo dello stesso tipo (stesso itemId)
      if (!this.state.activeBoosts) this.state.activeBoosts = [];
      const alreadyActive = this.state.activeBoosts.some(b => b.itemId === itemId);
      if (alreadyActive) {
        return { ok: false, reason: `"${item.name}" è già attivo! Aspetta che scada prima di usarne un altro.` };
      }
      const boost = { id: `b_${Date.now()}`, itemId, name: item.name,
        xpBoost: e.xpBoost||0, goldBoost: e.goldBoost||0, fameBoost: e.fameBoost||0, daysLeft: e.duration };
      this.state.activeBoosts.push(boost);
      result = { boost };
    }
    char.inventory.splice(idx, 1);
    const logEntry = { day: char.day, text: `Usato: ${item.name}`, type: 'success' };
    char.log.unshift(logEntry); if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, result, completedChallenges, levelUpResult };
  },

  /* ─── Borseggio ─────────────────────────────────────────── */
  pickpocketsAvailable() {
    return 1 + this.getEquipmentAbilities().pickpocketBonus;
  },

  pickpocketsRemaining() {
    return Math.max(0, this.pickpocketsAvailable() - this.state.pickpocketsUsed);
  },

  /* ─── Rilanci ────────────────────────────────────────────── */
  rerollsAvailable() {
    return this.getEquipmentAbilities().rerollBonus;
  },

  rerollsRemaining() {
    return Math.max(0, this.rerollsAvailable() - this.state.rerollsUsed);
  },

  useReroll() {
    if (this.rerollsRemaining() <= 0) return false;
    this.state.rerollsUsed++;
    this.save();
    return true;
  },

  /* ─── Studio (solo Mago) ───────────────────────────── */
  studiesAvailable() {
    const cls = this.getClasse();
    return (cls.studyPerDay || 0) + (this.getEquipmentAbilities().studyBonus || 0);
  },

  studiesRemaining() {
    return Math.max(0, this.studiesAvailable() - (this.state.studyUsed || 0));
  },

  startStudy() {
    if (this.studiesRemaining() <= 0) return { ok: false, reason: 'Nessuno studio disponibile oggi.' };
    this.state.studyUsed = (this.state.studyUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  applyPairReward() {
    const char = this.state.character;
    const cls  = this.getClasse();
    const xp = 15;
    char.xp += xp;
    let ingredient = null;
    if (Math.random() < 0.35 && cls.hasSpellTab) {
      if (!this.state.componentInventory) this.state.componentInventory = [];
      const pool = SPELL_COMPONENTS.filter(c => c.quality === 1);
      if (pool.length) {
        const comp = pool[Math.floor(Math.random() * pool.length)];
        this.state.componentInventory.push(comp.id);
        ingredient = comp;
      }
    }
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { xp, ingredient, levelUpResult };
  },

  applyStudyReward(timeLeft, errors) {
    let xp, gold, itemCount, itemTierMax;
    // Soglie calibrate per timer 90s e 8 errori max
    if (timeLeft > 55 && errors <= 2)      { xp = 180; gold = 100; itemCount = 2; itemTierMax = 2; }
    else if (timeLeft > 25 && errors <= 5) { xp = 100; gold =  55; itemCount = 1; itemTierMax = 2; }
    else                                   { xp = 50;  gold =  25; itemCount = 1; itemTierMax = 1; }
    const char = this.state.character;
    const cls  = this.getClasse();
    char.xp   += xp;
    char.gold += gold;
    const awarded = [];
    const isMago = cls.hasSpellTab;

    if (isMago) {
      if (!this.state.componentInventory) this.state.componentInventory = [];
      for (let i = 0; i < itemCount; i++) {
        const pool = SPELL_COMPONENTS.filter(c => c.quality <= itemTierMax);
        const comp = pool[Math.floor(Math.random() * pool.length)];
        this.state.componentInventory.push(comp.id);
        awarded.push(comp);
      }
    }

    // 40% possibilità di sbloccare un incantesimo (solo Mago)
    let unlockedRecipe = null;
    if (isMago && Math.random() < 0.40) {
      if (!this.state.knownSpells) this.state.knownSpells = [];
      const unknown = SPELL_RECIPES.filter(r => !this.state.knownSpells.includes(r.id));
      if (unknown.length) {
        const weighted = unknown.flatMap(r => Array(Math.max(1, 6 - r.quality)).fill(r));
        const pick = weighted[Math.floor(Math.random() * weighted.length)];
        this.state.knownSpells.push(pick.id);
        unlockedRecipe = pick;
      }
    }

    const logEntry = { day: char.day, text: `Studio completato — +${xp} PE, +${gold} mo`, type: 'success' };
    char.log.unshift(logEntry); if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, xp, gold, ingredients: awarded, unlockedRecipe, completedChallenges, levelUpResult };
  },

  /* ─── Equilibrio della Natura (solo Druido) ─────────── */
  natureBalanceRemaining() {
    return Math.max(0, 2 - (this.state.natureUsed || 0));
  },

  startNatureBalance() {
    if (this.natureBalanceRemaining() <= 0)
      return { ok: false, reason: 'Hai già giocato 2 volte oggi. Riprova domani.' };
    this.state.natureUsed = (this.state.natureUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  applyNatureBalanceResult(win, movesLeft) {
    const char = this.state.character;
    let xp, gold;
    if (win) {
      xp   = 80 + movesLeft * 15;
      gold = 30 + movesLeft * 8;
    } else {
      xp   = 20;
      gold = 0;
    }
    char.xp   += xp;
    char.gold += gold;
    const logText = win
      ? `Equilibrio della Natura completato — +${xp} PE, +${gold} mo`
      : 'Equilibrio della Natura fallito — +20 PE';
    char.log.unshift({ day: char.day, text: logText, type: win ? 'success' : 'info' });
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, win, xp, gold, completedChallenges, levelUpResult };
  },

  /* ─── Studio la Foresta (solo Druido) ───────────────── */
  applyForestStudyReward(timeLeft, errors) {
    let xp, gold;
    if (timeLeft > 45 && errors === 0)     { xp = 180; gold = 100; }
    else if (timeLeft > 20 && errors <= 2) { xp = 100; gold =  55; }
    else                                   { xp =  50; gold =  25; }
    const char = this.state.character;
    char.xp   += xp;
    char.gold += gold;
    const logEntry = { day: char.day, text: `Studio della Foresta completato — +${xp} PE, +${gold} mo`, type: 'success' };
    char.log.unshift(logEntry); if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, xp, gold, completedChallenges, levelUpResult };
  },

  /* ─── Incantesimi (solo Mago) ──────────────────────────── */

  sellSpell(spellId) {
    if (!this.state.spellInventory) this.state.spellInventory = [];
    const idx = this.state.spellInventory.indexOf(spellId);
    if (idx === -1) return { ok: false, reason: 'Incantesimo non nell\'inventario.' };
    const recipe = SPELL_RECIPES.find(r => r.id === spellId);
    if (!recipe) return { ok: false, reason: 'Ricetta non trovata.' };
    const sellPrice = Math.round((recipe.clientGold || 40) / 2);
    this.state.spellInventory.splice(idx, 1);
    this.state.character.gold += sellPrice;
    const logText = `Venduto "${recipe.name}" per ${sellPrice} mo (metà prezzo).`;
    this.state.character.log.unshift({ day: this.state.character.day, text: logText, type: 'success' });
    this.save();
    return { ok: true, recipe, sellPrice };
  },

  createSpellFree() {
    const char = this.state.character;
    if (this.getClasse().id !== 'mago') return { ok: false, reason: 'Solo il Mago può canalizzare incantesimi.' };
    if ((this.state.freeSpellUsed || 0) >= 2) return { ok: false, reason: 'Hai già usato questa abilità 2 volte oggi. Riprova domani.' };

    const dc       = 12;
    const intMod   = this.modifier(char.stats.int || 10);
    const roll     = this.rollD20();
    const total    = roll + intMod;
    const success  = total >= dc;

    this.state.freeSpellUsed = (this.state.freeSpellUsed || 0) + 1;

    if (!success) {
      // Piccolo XP per il tentativo
      char.xp += 8;
      const logText = `Canalizzazione fallita (${roll}+${intMod}=${total} vs CD${dc}). +8 PE per il tentativo.`;
      char.log.unshift({ day: char.day, text: logText, type: 'warning' });
      const levelUpResult = this.checkLevelUp();
      this.save();
      return { ok: true, success: false, roll, intMod, total, dc, levelUpResult };
    }

    // Qualità massima in base al livello
    const level    = char.level || 1;
    const maxQ     = level <= 2 ? 1 : level <= 5 ? 2 : level <= 8 ? 3 : 4;
    const pool     = SPELL_RECIPES.filter(r => r.quality <= maxQ);
    const recipe   = pool[Math.floor(Math.random() * pool.length)];
    if (!recipe) { this.save(); return { ok: false, reason: 'Nessun incantesimo disponibile.' }; }

    if (!this.state.spellInventory) this.state.spellInventory = [];
    this.state.spellInventory.push(recipe.id);
    const xpGained = Math.round(recipe.reward.xp / 2);
    char.xp += xpGained;
    const logText = `Canalizzazione riuscita (${roll}+${intMod}=${total} vs CD${dc}): "${recipe.name}" creato. +${xpGained} PE.`;
    char.log.unshift({ day: char.day, text: logText, type: 'success' });
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, success: true, recipe, roll, intMod, total, dc, xpGained, levelUpResult };
  },

  craftSpell(selectedComponentIds) {
    if (!this.state.componentInventory) this.state.componentInventory = [];
    const inv = [...this.state.componentInventory];
    for (const id of selectedComponentIds) {
      const idx = inv.indexOf(id);
      if (idx === -1) return { ok: false, reason: 'Componente mancante.' };
      inv.splice(idx, 1);
    }
    const sorted = [...selectedComponentIds].sort((a, b) => a - b);
    const recipe = SPELL_RECIPES.find(r => {
      const rs = [...r.components].sort((a, b) => a - b);
      return rs.length === sorted.length && rs.every((v, i) => v === sorted[i]);
    });
    const char = this.state.character;
    if (recipe) {
      this.state.componentInventory = inv;
      if (!this.state.spellInventory) this.state.spellInventory = [];
      this.state.spellInventory.push(recipe.id);
      char.xp   += recipe.reward.xp;
      char.gold += recipe.reward.gold;
      // Sblocca la ricetta se non già conosciuta
      if (!this.state.knownSpells) this.state.knownSpells = [];
      if (!this.state.knownSpells.includes(recipe.id)) {
        this.state.knownSpells.push(recipe.id);
      }
      const logEntry = { day: char.day, text: `Incantesimo preparato: ${recipe.name} (+${recipe.reward.xp} PE)`, type: 'success' };
      char.log.unshift(logEntry); if (char.log.length > 500) char.log.pop();
      const completedChallenges = this.checkChallenges('passive');
      const levelUpResult = this.checkLevelUp();
      this.save();
      return { ok: true, recipe, completedChallenges, levelUpResult };
    } else {
      // Prova di Intelligenza DC 13: successo = componenti restituiti
      const check = this.resolveCheck('int', 13);
      const saved = check.result === 'nat20' || check.result === 'success';
      if (saved) {
        char.xp += 10;
        this.save();
        return { ok: false, saved: true, check, reason: `Prova INT ${check.result === 'nat20' ? 'critica' : 'superata'} (${check.roll}+${check.bonus}=${check.total} vs DC 13) — componenti recuperate. +10 PE.` };
      } else {
        this.state.componentInventory = inv;
        char.xp += 15;
        this.save();
        return { ok: false, saved: false, check, reason: `Prova INT fallita (${check.roll}+${check.bonus}=${check.total} vs DC 13) — componenti perdute. +15 PE per la sperimentazione.` };
      }
    }
  },

  generateSpellRequests() {
    const char = this.state.character;
    const count = 2 + Math.floor(char.level / 2);
    const CLIENT_NAMES = [
      'Capitano Drath', 'Inquisitore Kael', 'Nobile Vorn', 'Assassina Lyra',
      'Mercenario Brug', 'Strega Isolde', 'Alchimista Fenix', 'Lord Shadowmere',
      'Ladra Zara', 'Cultista Eryn'
    ];

    // Qualità massima tra incantesimi posseduti e ricette conosciute (min. 1)
    const spellInv    = this.state.spellInventory || [];
    const knownSpells = this.state.knownSpells    || [];
    const allKnown    = [...new Set([...spellInv, ...knownSpells])];
    let maxQ = 1;
    for (const id of allKnown) {
      const r = SPELL_RECIPES.find(x => x.id === id);
      if (r && r.quality > maxQ) maxQ = r.quality;
    }

    // Pool filtrato per qualità ≤ maxQ; peso inverso verso le qualità più alte
    // per non avere solo Q1 quando si ha anche Q2
    const pool = SPELL_RECIPES.filter(r => r.quality <= maxQ);
    const weighted = pool.flatMap(r => Array(r.quality).fill(r)); // Q1→×1, Q2→×2 …
    const shuffled = [...weighted].sort(() => Math.random() - 0.5);

    // Deduplica preservando l'ordine dopo lo shuffle
    const seen = new Set();
    const picked = [];
    for (const r of shuffled) {
      if (!seen.has(r.id)) { seen.add(r.id); picked.push(r); }
      if (picked.length >= count) break;
    }

    this.state.spellRequests = picked.map((r, i) => ({
      id: `sreq_${Date.now()}_${i}`,
      recipeId: r.id,
      clientName: CLIENT_NAMES[i % CLIENT_NAMES.length],
      reward: { gold: r.clientGold, fame: Math.ceil(r.quality * 2), xp: Math.ceil(r.reward.xp * 0.5) }
    }));
    this.save();
  },

  completeSpellRequest(requestId) {
    if (!this.state.spellRequests) return { ok: false, reason: 'Nessuna richiesta.' };
    const req = this.state.spellRequests.find(r => r.id === requestId);
    if (!req) return { ok: false, reason: 'Richiesta non trovata.' };
    if (!this.state.spellInventory) this.state.spellInventory = [];
    const idx = this.state.spellInventory.indexOf(req.recipeId);
    if (idx === -1) return { ok: false, reason: 'Incantesimo non nell\'inventario.' };
    this.state.spellInventory.splice(idx, 1);
    this.state.spellRequests = this.state.spellRequests.filter(r => r.id !== requestId);
    const char = this.state.character;
    char.gold += req.reward.gold;
    char.fame += req.reward.fame;
    char.xp   += req.reward.xp;
    const logEntry = { day: char.day, text: `Incantesimo consegnato: ${req.clientName} (+${req.reward.gold} mo)`, type: 'success' };
    char.log.unshift(logEntry); if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, reward: req.reward, completedChallenges, levelUpResult };
  },

  /* ─── Proficiency ───────────────────────────────────────── */
  getProfStats() {
    const cls = CLASSES.find(c => c.id === (this.state.character.classe || 'ladro'));
    return cls ? cls.proficiencies : ['dex', 'int', 'cha'];
  },

  getClasse() {
    return CLASSES.find(c => c.id === (this.state.character.classe || 'ladro')) || CLASSES[0];
  },

  hasProficiency(statKey) {
    return this.getProfStats().includes(statKey);
  },

  totalBonus(statKey) {
    const baseStat = this.state.character.stats[statKey] || 10;
    const mod  = this.modifier(baseStat);
    const prof = this.hasProficiency(statKey) ? this.state.character.proficiency : 0;
    const equip = this.equipBonusForStat(statKey);
    return mod + prof + equip;
  },

  /* ─── Prova abilità ────────────────────────────────────── */
  resolveCheck(statKey, dc) {
    const roll   = this.rollD20();
    const bonus  = this.totalBonus(statKey);
    const total  = roll + bonus;

    let result;
    if (roll === 20)          result = 'nat20';
    else if (roll === 1)      result = 'nat1';
    else if (total >= dc)     result = 'success';
    else if (total >= dc - 4) result = 'partial';
    else                      result = 'failure';

    return { roll, bonus, total, dc, statKey, result };
  },

  /* ─── Risoluzione missione ─────────────────────────────── */
  resolveMission(missionId, approachIndex) {
    const mission  = DB.missions.find(m => m.id === missionId);
    const approach = mission.approaches[approachIndex];
    const check    = this.resolveCheck(approach.stat, approach.dc);
    const abilities = this.getEquipmentAbilities();

    const isSuccess = check.result === 'nat20' || check.result === 'success';
    const isPartial = check.result === 'partial';

    let rewards = { xp: 0, gold: 0, fame: 0, item: null };
    let outcomeText = '';

    const XP_MULT = 1.4; // moltiplicatore globale XP
    const boost   = this.getActiveBoostMultipliers();

    if (isSuccess) {
      let baseXp   = Math.floor(mission.rewards.xp * XP_MULT);
      let baseGold = this.rollGold(mission.rewards.goldMin, mission.rewards.goldMax);
      if (check.result === 'nat20') baseXp = Math.floor(baseXp * 1.5);

      baseXp   = Math.floor(baseXp   * (1 + abilities.xpBonus   + boost.xp));
      baseGold = Math.floor(baseGold * (1 + abilities.goldBonus  + boost.gold));

      rewards.xp   = baseXp;
      rewards.gold = baseGold;
      rewards.fame = Math.floor(mission.rewards.fameXp * (1 + boost.fame));

      if (Math.random() < mission.rewards.itemChance) {
        rewards.item = this.rollItemByTier(mission.rewards.itemTier);
      }
      outcomeText = check.result === 'nat20'
        ? 'CRITICO! ' + approach.successText
        : approach.successText;

    } else if (isPartial) {
      let baseXp   = Math.floor(mission.rewards.xp * XP_MULT * 0.5);
      let baseGold = this.rollGold(
        Math.floor(mission.rewards.goldMin * 0.5),
        Math.floor(mission.rewards.goldMax * 0.5)
      );
      baseXp   = Math.floor(baseXp   * (1 + abilities.xpBonus   + boost.xp));
      baseGold = Math.floor(baseGold * (1 + abilities.goldBonus  + boost.gold));

      rewards.xp   = baseXp;
      rewards.gold = baseGold;
      rewards.fame = Math.floor(mission.rewards.fameXp * 0.4);
      outcomeText  = approach.partialText;

    } else {
      rewards.fame = check.result === 'nat1' ? -5 : 0;
      outcomeText  = check.result === 'nat1'
        ? 'FALLIMENTO CRITICO! ' + approach.failText
        : approach.failText;
    }

    // Applica ricompense
    const char = this.state.character;

    // Taglia / Visibilità — aumenta su fallimento, cresce lievemente su successo (notorietà)
    if (!isSuccess && !isPartial) {
      char.wanted = (char.wanted || 0) + (check.result === 'nat1' ? 20 : 12);
    } else if (this.getClasse().id !== 'ladro') {
      // Completare missioni attira attenzione anche in caso di successo
      char.wanted = (char.wanted || 0) + (isSuccess ? 3 : 6);
    }
    char.xp   += rewards.xp;
    char.gold += rewards.gold;
    char.fame  = Math.max(0, char.fame + rewards.fame);

    if (rewards.item) {
      char.inventory.push(rewards.item.id);
    }

    // Reward componente/ingrediente per Mago e Druido su successo
    if (isSuccess && mission.rewards.ingredientTierMax) {
      const tierMax = mission.rewards.ingredientTierMax || 1;
      if (char.classe === 'mago') {
        if (!this.state.componentInventory) this.state.componentInventory = [];
        const pool = SPELL_COMPONENTS.filter(c => c.quality <= tierMax);
        if (pool.length) {
          const comp = pool[Math.floor(Math.random() * pool.length)];
          this.state.componentInventory.push(comp.id);
          rewards.ingredient = comp;
        }
      }
    }

    // Game over se fama = 0 dopo nat1
    if (char.fame <= 0 && rewards.fame < 0) {
      this.state.gameOver = true;
    }

    // Segna come completata oggi
    this.state.completedToday.push(missionId);

    // Log
    const resultLabel = {
      nat20: 'Critico', success: 'Successo', partial: 'Parziale',
      nat1: 'Critico fallimento', failure: 'Fallimento'
    };
    const logType = (isSuccess ? 'success' : (isPartial ? 'partial' : 'fail'));
    const logEntry = {
      day: char.day,
      text: `${resultLabel[check.result]} — ${mission.name}`,
      type: logType
    };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();

    const levelUpResult = this.checkLevelUp();

    const completedChallenges = this.checkChallenges('mission_complete', {
      stat: approach.stat,
      tier: mission.tier,
      nat20: check.result === 'nat20'
    });

    this.save();
    return { check, approach, rewards, outcomeText, missionId, levelUpResult, completedChallenges };
  },

  /* ─── Oggetti ──────────────────────────────────────────── */
  rollItemByTier(tier) {
    // 50% chance di ottenere un consumabile del tier corrispondente
    if (Math.random() < 0.50) {
      const cPool = DB.items.filter(i => i.tier === tier && i.consumable);
      if (cPool.length) return cPool[Math.floor(Math.random() * cPool.length)];
    }
    const pool = DB.items.filter(i => i.tier === tier);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  rollItemWithQuality(maxQuality) {
    // Probabilità per qualità 1-5: [55,28,12,4,1]
    const weights = [55, 28, 12, 4, 1];
    const capped  = Math.min(maxQuality, 5);
    const sliced  = weights.slice(0, capped);
    const total   = sliced.reduce((a, b) => a + b, 0);
    const rand    = Math.random() * total;
    let cumulative = 0;
    let chosenQuality = 1;
    for (let q = 1; q <= capped; q++) {
      cumulative += sliced[q - 1];
      if (rand < cumulative) { chosenQuality = q; break; }
    }
    const pool = DB.items.filter(i => i.quality === chosenQuality);
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  equipItem(itemId) {
    const item = DB.items.find(i => i.id === itemId);
    if (!item) return { ok: false, reason: 'Oggetto non trovato.' };

    const char = this.state.character;

    // Check level req
    if (item.reqLevel && char.level < item.reqLevel) {
      return { ok: false, reason: `Livello ${item.reqLevel} richiesto.` };
    }

    // Check stat req (based on effective stat)
    if (item.reqStat) {
      const effVal = this.effectiveStat(item.reqStat.key);
      if (effVal < item.reqStat.val) {
        const label = { str:'FOR', dex:'DES', con:'COS', int:'INT', wis:'SAG', cha:'CAR' }[item.reqStat.key];
        return { ok: false, reason: `${label} ${item.reqStat.val} richiesta.` };
      }
    }

    // Check class restriction
    if (item.classRestrict && item.classRestrict.length > 0) {
      if (!item.classRestrict.includes(char.classe)) {
        return { ok: false, reason: 'Oggetto non utilizzabile da questa classe.' };
      }
    }

    // Check shield slot availability
    if (item.slot === 'shield') {
      const cls = this.getClasse();
      if (!cls.hasShieldSlot) {
        return { ok: false, reason: 'Questa classe non può usare uno scudo.' };
      }
    }

    // Rimuovi dall'inventario
    const idx = char.inventory.indexOf(itemId);
    if (idx === -1) return { ok: false, reason: 'Oggetto non in inventario.' };
    char.inventory.splice(idx, 1);

    // Slot target: per gli anelli usa il primo slot libero, altrimenti ringRight
    let targetSlot = item.slot;
    if (item.slot === 'ring') {
      if      (char.equipment.ringRight === null) targetSlot = 'ringRight';
      else if (char.equipment.ringLeft  === null) targetSlot = 'ringLeft';
      else                                        targetSlot = 'ringRight';
    }

    // Se slot occupato, rimetti il vecchio in inventario
    const prev = char.equipment[targetSlot];
    if (prev !== null) char.inventory.push(prev);

    char.equipment[targetSlot] = itemId;
    this.save();
    return { ok: true };
  },

  unequipItem(slot) {
    const char = this.state.character;
    const itemId = char.equipment[slot];
    if (!itemId) return false;
    char.inventory.push(itemId);
    char.equipment[slot] = null;
    this.save();
    return true;
  },

  sellItem(itemId, fromSlot = null) {
    const item = DB.items.find(i => i.id === itemId);
    if (!item) return false;
    const char = this.state.character;

    if (fromSlot !== null) {
      if (char.equipment[fromSlot] !== itemId) return false;
      char.equipment[fromSlot] = null;
    } else {
      const idx = char.inventory.indexOf(itemId);
      if (idx === -1) return false;
      char.inventory.splice(idx, 1);
    }

    char.gold += item.sellPrice;
    const completedChallenges = this.checkChallenges('sell_item', { quality: item.quality });
    this.save();
    return { ok: true, completedChallenges };
  },

  /* ─── Mercato Nero ──────────────────────────────────────── */
  rollItemWithQualityWeights(weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const rand  = Math.random() * total;
    let cumulative = 0;
    let chosenQuality = 1;
    for (let q = 1; q <= weights.length; q++) {
      cumulative += weights[q - 1];
      if (rand < cumulative) { chosenQuality = q; break; }
    }
    const classe = this.state?.character?.classe;
    // Escludi consumabili e oggetti non disponibili per la classe corrente
    const pool = DB.items.filter(i => {
      if (i.quality !== chosenQuality || i.consumable) return false;
      if (!i.classRestrict) return true;
      const r = i.classRestrict;
      return Array.isArray(r) ? r.includes(classe) : r === classe;
    });
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  generateMarketItems() {
    const char = this.state.character;
    const count = 6 + Math.floor(Math.random() * 3); // 6-8
    const maxQuality = Math.ceil(char.level / 2);

    // Pesi normali (proporzionali al livello)
    const normalWeights = [55, 28, 12, 4, 1].slice(0, Math.min(maxQuality, 5));
    // Pesi rari: favoriscono qualità media-alta indipendentemente dal livello
    const rareWeights   = [10, 20, 35, 25, 10];

    const generated = [];
    const usedIds   = new Set();

    const tryGetItem = (weights, attempts = 30, consumableOnly = false) => {
      for (let a = 0; a < attempts; a++) {
        const item = this.rollItemWithQualityWeights(weights, consumableOnly);
        if (item && !usedIds.has(item.id) && !item.marketExcluded) return item;
      }
      return null;
    };

    // 2 item "adatti al livello" con pesi normali
    for (let i = 0; i < 2; i++) {
      const item = tryGetItem(normalWeights);
      if (!item) continue;
      usedIds.add(item.id);
      const variance = 0.85 + Math.random() * 0.30;
      generated.push({ itemId: item.id, buyPrice: Math.round(item.buyPrice * variance) });
    }

    // Restanti item con pesi rari (spesso reqLevel superiore al livello attuale)
    for (let i = generated.length; i < count; i++) {
      const item = tryGetItem(rareWeights);
      if (!item) continue;
      usedIds.add(item.id);
      const variance = 0.85 + Math.random() * 0.30;
      generated.push({ itemId: item.id, buyPrice: Math.round(item.buyPrice * variance) });
    }

    // 3-5 consumabili (esclusi quelli con marketExcluded, filtrati per classe)
    const consumablePool = DB.items.filter(i => {
      if (!i.consumable || i.marketExcluded || usedIds.has(i.id)) return false;
      if ((i.tier || 1) > Math.ceil(char.level / 3) + 1) return false;
      if (!i.classRestrict) return true;
      const r = i.classRestrict;
      return Array.isArray(r) ? r.includes(char.classe) : r === char.classe;
    });
    const shuffledC = [...consumablePool].sort(() => Math.random() - 0.5);
    const cCount = 3 + Math.floor(Math.random() * 3); // 3, 4 or 5
    for (let i = 0; i < Math.min(cCount, shuffledC.length); i++) {
      const item = shuffledC[i];
      usedIds.add(item.id);
      const variance = 0.90 + Math.random() * 0.20;
      generated.push({ itemId: item.id, buyPrice: Math.round(item.buyPrice * variance) });
    }

    this.state.marketItems = generated;
    this.save();
  },

  buyItem(itemId) {
    const char = this.state.character;
    const marketEntry = this.state.marketItems.find(m => m.itemId === itemId);
    if (!marketEntry) return { ok: false, reason: 'Oggetto non disponibile.' };

    const item = DB.items.find(i => i.id === itemId);
    if (!item) return { ok: false, reason: 'Oggetto non trovato.' };

    if (char.gold < marketEntry.buyPrice) {
      return { ok: false, reason: 'Oro insufficiente.' };
    }

    char.gold -= marketEntry.buyPrice;
    char.inventory.push(itemId);
    this.state.marketItems = this.state.marketItems.filter(m => m.itemId !== itemId);

    const completedChallenges = this.checkChallenges('buy_item');
    this.save();
    return { ok: true, completedChallenges };
  },

  /* ─── Furto al mercato (solo Ladro) ────────────────────── */
  stealItem(itemId) {
    const char = this.state.character;
    if (this.getClasse().id !== 'ladro') return { ok: false, reason: 'Solo il Ladro può rubare.' };
    if (this.state.marketStealBanned) return { ok: false, reason: 'Il mercante ti ha riconosciuto — non puoi più comprare né rubare oggi.' };

    const marketEntry = this.state.marketItems.find(m => m.itemId === itemId);
    if (!marketEntry) return { ok: false, reason: 'Oggetto non disponibile.' };
    const item = DB.items.find(i => i.id === itemId);
    if (!item) return { ok: false, reason: 'Oggetto non trovato.' };

    // DC: base 16, +2 per ogni livello di qualità sopra 1
    const dc = 16 + (item.quality - 1) * 2;
    const dexMod = this.modifier(char.stats.dex || 10);
    const roll = this.rollD20();
    const total = roll + dexMod;
    const success = total >= dc;

    if (success) {
      char.inventory.push(itemId);
      this.state.marketItems = this.state.marketItems.filter(m => m.itemId !== itemId);
      const logText = `Rubato "${item.name}" dal mercato (${roll}+${dexMod}=${total} vs DC${dc}).`;
      char.log.unshift({ day: char.day, text: logText, type: 'success' });
      this.save();
      return { ok: true, success: true, roll, dexMod, total, dc, item };
    } else {
      // Penalità: perdi oro, fama, aumenta taglia, vietato dal mercato
      const goldLost  = Math.max(5, Math.round(marketEntry.buyPrice * 0.20));
      const fameLost  = 6 + item.quality * 2;
      const wantedGain = 12 + item.quality * 4;
      char.gold  = Math.max(0, char.gold - goldLost);
      char.fame  = Math.max(0, char.fame - fameLost);
      char.wanted = (char.wanted || 0) + wantedGain;
      this.state.marketStealBanned = true;
      const logText = `Furto fallito al mercato (${roll}+${dexMod}=${total} vs DC${dc}). -${goldLost} mo, -${fameLost} fama, +${wantedGain} taglia.`;
      char.log.unshift({ day: char.day, text: logText, type: 'danger' });
      this.save();
      return { ok: true, success: false, roll, dexMod, total, dc, goldLost, fameLost, wantedGain };
    }
  },

  /* ─── Borseggio (Pickpocket) ────────────────────────────── */
  startPickpocket() {
    if (this.pickpocketsRemaining() <= 0) {
      return { ok: false, reason: 'Nessun tentativo rimasto.' };
    }
    this.state.pickpocketsUsed++;
    this.save();
    const speed = 0.55 + Math.random() * 0.8;
    return { ok: true, speed };
  },

  applyPickpocketReward(speedMult) {
    const char      = this.state.character;
    const abilities = this.getEquipmentAbilities();
    const roll100   = this.rollD100();
    let reward = null;
    let outcomeText = '';

    if (roll100 <= 55) {
      // 55% — oro
      const baseGold = this.rollGold(30, 90 + char.level * 18);
      const gold = Math.floor(baseGold * (1 + abilities.goldBonus) * speedMult);
      char.gold += gold;
      reward = { type: 'gold', amount: gold };
      outcomeText = 'Mano veloce! Tasca alleggerita con successo.';
    } else if (roll100 <= 80) {
      // 25% — esperienza
      const baseXp = this.rollGold(30, 70 + char.level * 12);
      const xp = Math.floor(baseXp * (1 + abilities.xpBonus) * speedMult);
      char.xp += xp;
      reward = { type: 'xp', amount: xp };
      outcomeText = 'Lezione pratica acquisita mentre alleggerivi qualche borsellino.';
    } else {
      // 20% — oggetto (35% chance consumabile, 65% equipaggiamento)
      let item;
      if (Math.random() < 0.35) {
        const maxTier = Math.ceil(char.level / 3) + 1;
        const cPool = DB.items.filter(i => i.consumable && (i.tier || 1) <= maxTier);
        item = cPool.length ? cPool[Math.floor(Math.random() * cPool.length)] : null;
      }
      if (!item) {
        const maxQ = Math.ceil(char.level / 2);
        item = this.rollItemWithQuality(maxQ);
      }
      if (item) {
        char.inventory.push(item.id);
        reward = { type: 'item', item };
        outcomeText = item.consumable
          ? 'Tasca alleggerita e bottino insolito trovato!'
          : 'Colpo speciale! Hai trovato qualcosa di interessante.';
      } else {
        const gold = this.rollGold(40, 80 + char.level * 10);
        char.gold += gold;
        reward = { type: 'gold', amount: gold };
        outcomeText = 'Niente di speciale, ma qualche moneta in più non fa male.';
      }
    }

    if (speedMult >= 1.5) outcomeText = 'FULMINEO! ' + outcomeText;

    const logEntry = { day: char.day, text: 'Borseggio riuscito', type: 'success' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();

    const levelUpResult = this.checkLevelUp();
    const completedChallenges = this.checkChallenges('pickpocket_success');
    this.save();
    return { success: true, reward, outcomeText, levelUpResult, completedChallenges };
  },

  applyPickpocketFailure() {
    const char = this.state.character;
    char.wanted = (char.wanted || 0) + 18;
    const logEntry = { day: char.day, text: 'Borseggio fallito', type: 'fail' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    this.save();
    return { success: false, reward: null, outcomeText: 'Le dita non erano abbastanza veloci. Niente da fare.' };
  },

  /* ─── Gara di Bevute (Guerriero) ───────────────────────── */
  drinkingGameRemaining() {
    return this.state.drinkingGameUsed > 0 ? 0 : 1;
  },

  startDrinkingGame() {
    if (this.drinkingGameRemaining() <= 0) return { ok: false, reason: 'Già sfidato oggi.' };
    this.state.drinkingGameUsed = 1;
    this.save();
    return { ok: true };
  },

  applyDrinkingResult(roundsWon) {
    const char  = this.state.character;
    const check = this.resolveCheck('con', 12);
    const isNat20   = check.result === 'nat20';
    const isSuccess = isNat20 || check.result === 'success';
    const bet = 15 + char.level * 5;
    let xp = 0, gold = 0, fame = 0, logText = '', won = roundsWon >= 2;
    if (won) {
      if (isNat20) {
        xp = 150 + char.level * 20; gold = bet * 4; fame = 8 + char.level;
        logText = `🍺 Leggenda della taverna! CON critico! +${xp} PE, +${gold} mo, +${fame} fama`;
      } else if (isSuccess) {
        xp = 80 + char.level * 15; gold = bet * 2; fame = 4;
        logText = `🍺 Gara di bevute vinta! +${xp} PE, +${gold} mo, +${fame} fama`;
      } else {
        xp = 50 + char.level * 10; gold = bet; fame = 2;
        logText = `🍺 Vinto barcollando! +${xp} PE, +${gold} mo`;
      }
      char.xp   += xp;
      char.gold += gold;
      char.fame  = Math.max(0, char.fame + fame);
    } else {
      const goldLost = Math.min(bet, char.gold);
      char.gold = Math.max(0, char.gold - goldLost);
      gold = -goldLost;
      logText = `🍺 Gara di bevute persa! -${goldLost} mo`;
    }
    char.log.unshift({ day: char.day, text: logText, type: won ? 'success' : 'fail' });
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { won, roundsWon, check, xp, gold, fame, completedChallenges, levelUpResult };
  },

  /* ─── Tassa della Gilda ─────────────────────────────────── */
  guildTax() {
    const char = this.state.character;
    const fameLevel = this.getFameLevel();
    const fameTier  = Math.min(4, fameLevel.tier);
    const abilities = this.getEquipmentAbilities();
    const base = 25 + char.level * 18 + Math.floor(char.level * char.level * 1.5) + fameTier * 28;
    const discounted = Math.floor(base * (1 - abilities.taxDiscount));
    return Math.max(5, discounted);
  },

  payGuildTax() {
    const char = this.state.character;
    const tax  = this.guildTax();

    if (char.gold >= tax) {
      char.gold -= tax;
      const logEntry = { day: char.day, text: `Tassa della Gilda pagata: ${tax} mo`, type: 'text' };
      char.log.unshift(logEntry);
      if (char.log.length > 500) char.log.pop();
      return { paid: true, tax, fameLost: 0 };
    } else {
      // Non può pagare: perde fama
      const fameLost = 15 + char.level * 2;
      char.fame = Math.max(0, char.fame - fameLost);
      const logEntry = { day: char.day, text: `Impossibile pagare la tassa! -${fameLost} fama`, type: 'fail' };
      char.log.unshift(logEntry);
      if (char.log.length > 500) char.log.pop();

      if (char.fame <= 0) {
        this.state.gameOver = true;
      }
      return { paid: false, tax, fameLost };
    }
  },

  /* ─── Giorno successivo ─────────────────────────────────── */
  nextDay() {
    const taxResult = this.payGuildTax();

    if (this.state.gameOver) {
      this.save();
      return { taxResult, gameOver: true };
    }

    const char = this.state.character;
    char.day++;

    // Reset contatori giornalieri
    this.state.pickpocketsUsed        = 0;
    this.state.rerollsUsed            = 0;
    this.state.diceRerollsUsed        = 0;
    this.state.studyUsed              = 0;
    this.state.natureUsed             = 0;
    this.state.drinkingGameUsed       = 0;
    this.state.prayUsed               = 0;
    this.state.conversionUsed         = 0;
    this.state.arenaUsed              = 0;
    this.state.stableUsed             = 0;
    this.state.rescueUsed             = 0;
    this.state.combatUsed             = 0;
    this.state.combat                 = null;
    this.state.wantedMissionCompleted = false;
    this.state.thiefAttackCompleted   = false;
    this.state.marketStealBanned      = false;
    this.state.freeSpellUsed          = 0;

    // Decrementa boost attivi
    this.state.activeBoosts = (this.state.activeBoosts || [])
      .map(b => ({ ...b, daysLeft: b.daysLeft - 1 }))
      .filter(b => b.daysLeft > 0);

    this.generateDailyMissions();
    this.generateMarketItems();
    this.refreshDailyChallenges();
    if (this.getClasse().hasSpellTab)   this.generateSpellRequests();

    // Visibilità passiva giornaliera per classi non-Ladro
    // (essere attivi in città aumenta la notorietà ogni giorno)
    if (this.getClasse().id !== 'ladro') {
      char.wanted = (char.wanted || 0) + 4;
    }

    // Controlla se scatta missione taglia
    this.state.wantedMissionPending = this._checkWantedTrigger();

    // Controlla se scatta attacco ladro
    this.state.thiefAttackPending = this._checkThiefTrigger();

    this.save();
    return { taxResult, gameOver: false, wantedTriggered: this.state.wantedMissionPending, thiefTriggered: this.state.thiefAttackPending };
  },

  /* ─── Progressione ─────────────────────────────────────── */
  checkLevelUp() {
    const char = this.state.character;
    if (char.level >= 10) return null;
    const xpNeeded = DB.xpTable[char.level - 1];
    if (char.xp >= xpNeeded) return { newLevel: char.level + 1 };
    return null;
  },

  applyLevelUp(statChoices) {
    const char = this.state.character;
    char.level++;
    statChoices.forEach(s => { char.stats[s]++; });
    // Proficiency: lv1-4: +2, lv5-8: +3, lv9-10: +4
    if (char.level <= 4)      char.proficiency = 2;
    else if (char.level <= 8) char.proficiency = 3;
    else                      char.proficiency = 4;

    const logEntry = { day: char.day, text: `Livello ${char.level} raggiunto!`, type: 'levelup' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();

    this.save();
  },

  /* ─── Missioni giornaliere ─────────────────────────────── */
  generateDailyMissions() {
    const char       = this.state.character;
    const RARE_STATS = new Set(['str', 'con', 'wis', 'cha']);
    const RARE_W     = 3;   // peso 3× per le stat rare
    const count      = 4 + Math.floor(Math.random() * 2); // 4–5 missioni visibili

    const classMissions = DB.missions.filter(m => m.classMission === char.classe);
    const missionPool = classMissions.length > 0
      ? classMissions
      : DB.missions.filter(m => !m.classMission && (!m.classRestrict || m.classRestrict === char.classe));
    const fameOk = missionPool.filter(m => m.minFame <= char.fame);

    // Weighted sampling senza ripetizione
    const pool = fameOk.map(m => ({
      id:     m.id,
      weight: m.approaches.some(a => RARE_STATS.has(a.stat)) ? RARE_W : 1
    }));

    const selected = [];
    while (selected.length < count && pool.length > 0) {
      const totalW = pool.reduce((s, e) => s + e.weight, 0);
      let r = Math.random() * totalW;
      let idx = pool.length - 1;
      for (let i = 0; i < pool.length; i++) { r -= pool[i].weight; if (r <= 0) { idx = i; break; } }
      selected.push(pool[idx].id);
      pool.splice(idx, 1);
    }

    this.state.dailyMissions  = selected;
    this.state.completedToday = [];
    this.generateGoldXPOffer();
  },

  generateGoldXPOffer() {
    const gold = this.state.character.gold || 0;
    if (gold < 1) { this.state.goldXPOffer = null; return; }
    // 70% chance: 10–30% of gold; 30% chance: 30–50% of gold (rarer)
    const pctRoll = Math.random();
    const pct = pctRoll < 0.70
      ? 0.10 + Math.random() * 0.20   // 10%–30%
      : 0.30 + Math.random() * 0.20;  // 30%–50%
    const goldCost = Math.max(1, Math.round(gold * pct));
    // ×3 comune (55%), ×4 raro (30%), ×5 rarissimo (15%)
    const r = Math.random();
    const multiplier = r < 0.55 ? 3 : r < 0.85 ? 4 : 5;
    this.state.goldXPOffer = { goldCost, multiplier, xpGain: goldCost * multiplier, used: false };
  },

  acceptGoldXPOffer() {
    const char = this.state.character;
    // Se l'offerta manca ma il giocatore ha oro, rigenerala
    if (!this.state.goldXPOffer && (char.gold || 0) >= 1) this.generateGoldXPOffer();
    // Se l'offerta supera l'oro corrente, rigenerala su base attuale
    if (this.state.goldXPOffer && !this.state.goldXPOffer.used && char.gold < this.state.goldXPOffer.goldCost) {
      this.generateGoldXPOffer();
    }
    const offer = this.state.goldXPOffer;
    if (!offer || offer.used)       return { ok: false, reason: 'Offerta non disponibile.' };
    if (char.gold < offer.goldCost) return { ok: false, reason: 'Oro insufficiente.' };
    char.gold -= offer.goldCost;
    char.xp   += offer.xpGain;
    offer.used = true;
    const logEntry = { day: char.day, text: `Investimento: −${offer.goldCost} mo → +${offer.xpGain} PE (×${offer.multiplier}).`, type: 'gold' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    const levelUpResult = this.checkLevelUp();
    if (levelUpResult) this.state._lastLevelUp = levelUpResult;
    this.save();
    return { ok: true, goldCost: offer.goldCost, xpGain: offer.xpGain, multiplier: offer.multiplier, levelUpResult };
  },

  missionsCompletableToday() {
    return 2 + (this.getEquipmentAbilities().missionBonus || 0);
  },

  canCompleteMission() {
    return this.state.completedToday.length < this.missionsCompletableToday();
  },

  /* ─── Sistema Taglia / Visibilità ───────────────────────── */
  getWantedLevel() {
    const w = this.state.character.wanted || 0;
    const levels = this.getClasse().id === 'ladro' ? WANTED_LEVELS : VISIBILITY_LEVELS;
    let current = levels[0];
    for (const wl of levels) { if (w >= wl.min) current = wl; }
    return current;
  },

  _checkWantedTrigger() {
    // Cacciatore di Taglie: solo per il Ladro
    if (this.getClasse().id !== 'ladro') return false;
    const w = this.state.character.wanted || 0;
    if (w < 15) return false;
    const chance = Math.min(0.85, (w - 15) / 200);
    return Math.random() < chance;
  },

  canAdvanceDay() {
    const wantedOk = !this.state.wantedMissionPending || this.state.wantedMissionCompleted;
    const thiefOk  = !this.state.thiefAttackPending   || this.state.thiefAttackCompleted;
    return wantedOk && thiefOk;
  },

  getWantedNarrative() {
    return WANTED_NARRATIVES[Math.floor(Math.random() * WANTED_NARRATIVES.length)];
  },

  applyWantedWin() {
    const char = this.state.character;
    const xp   = 80 + char.level * 20;
    const fame = 80 + char.level * 12 + Math.floor((char.wanted || 0) / 3);
    char.xp   += xp;
    char.fame += fame;
    // Vittoria: taglia ridotta del 75% (rimane solo il 25%)
    const wantedBefore = char.wanted || 0;
    char.wanted = Math.floor(wantedBefore * 0.25);
    const wantedLost = wantedBefore - char.wanted;
    this.state.wantedMissionCompleted = true;
    const logEntry = { day: char.day, text: `Cacciatore di taglie sconfitto! Taglia −${wantedLost} (da ${wantedBefore} a ${char.wanted}).`, type: 'success' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    this.save();
    return { xp, fame, wantedAfter: char.wanted, wantedLost, completedChallenges };
  },

  applyWantedLoss() {
    const char = this.state.character;
    const goldLost = Math.floor(char.gold / 2);
    char.gold = char.gold - goldLost;
    // Sconfitta: taglia ridotta del 50% (il cacciatore ha comunque riscosso parte della taglia)
    const wantedBefore = char.wanted || 0;
    char.wanted = Math.floor(wantedBefore * 0.50);
    const wantedLost = wantedBefore - char.wanted;
    this.state.wantedMissionCompleted = true;
    const logEntry = { day: char.day, text: `Sconfitto dal cacciatore di taglie! −${goldLost} mo, taglia −${wantedLost} (da ${wantedBefore} a ${char.wanted}).`, type: 'fail' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    this.save();
    return { goldLost, wantedAfter: char.wanted, wantedLost };
  },

  /* ─── Arena limit (Guerriero) ───────────────────────────── */
  arenaRemaining() {
    if (!this.state) return 0;
    const cls = this.getClasse();
    if (!cls.arenaPerDay) return 0;
    const abilBonus = this.getEquipmentAbilities().arenaBonus;
    return Math.max(0, (cls.arenaPerDay || 0) + abilBonus - (this.state.arenaUsed || 0));
  },

  startArena() {
    if (this.arenaRemaining() <= 0) return { ok: false, reason: "Hai già combattuto nell'arena oggi." };
    this.state.arenaUsed = (this.state.arenaUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  /* ─── Arena (Guerriero) ─────────────────────────────────── */
  applyArenaResult(killCount, xpEarned, goldEarned, survived) {
    const char = this.state.character;
    let xp   = xpEarned;
    let gold = goldEarned;
    if (survived) {
      xp   = Math.floor(xp   * 1.25);
      gold = Math.floor(gold * 1.25);
    }
    char.xp   += xp;
    char.gold += gold;
    const isRecord = killCount > (this.state.arenaHighScore || 0);
    if (isRecord) this.state.arenaHighScore = killCount;
    const logText = survived
      ? `Arena: ${killCount} nemici abbattuti! Sopravvissuto! (+${xp} PE, +${gold} mo)`
      : `Arena: ${killCount} nemici abbattuti prima di cedere. (+${xp} PE, +${gold} mo)`;
    const logEntry = { day: char.day, text: logText, type: survived ? 'success' : 'partial' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { xp, gold, survived, killCount, isRecord, completedChallenges, levelUpResult };
  },

  /* ─── Preghiera (Chierico) ─────────────────────────────── */
  prayRemaining() {
    const cls = this.getClasse();
    return Math.max(0, (cls.prayPerDay || 0) - (this.state.prayUsed || 0));
  },

  startPray() {
    if (this.prayRemaining() <= 0) return { ok: false, reason: 'Hai già pregato oggi.' };
    this.state.prayUsed = (this.state.prayUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  applyPrayResult(devotion) {
    const char = this.state.character;
    let xp, gold, fameXp, tier;
    if (devotion >= 80) {
      const check = this.resolveCheck('wis', 14);
      if (check.result === 'nat20') {
        tier = 'benedizione'; xp = 220; gold = 70; fameXp = 14;
      } else {
        tier = 'alta'; xp = 150; gold = 45; fameXp = 9;
      }
    } else if (devotion >= 50) {
      tier = 'media'; xp = 90; gold = 25; fameXp = 5;
    } else {
      tier = 'bassa'; xp = 45; gold = 10; fameXp = 2;
    }
    xp   += char.level * 10;
    gold += char.level * 3;
    char.xp   += xp;
    char.gold += gold;
    char.fame += fameXp;
    const logText = tier === 'benedizione'
      ? `Preghiera: benedizione divina ricevuta! (+${xp} PE, +${gold} mo)`
      : `Preghiera completata — devozione ${Math.floor(devotion)}%. (+${xp} PE, +${gold} mo)`;
    const logEntry = { day: char.day, text: logText, type: tier === 'benedizione' ? 'success' : 'partial' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, xp, gold, fameXp, tier, devotion: Math.floor(devotion), completedChallenges, levelUpResult };
  },

  /* ─── Conversione (Chierico) ────────────────────────────── */
  convRemaining() {
    if (!this.state) return 0;
    const cls = this.getClasse();
    if (!cls.hasConversionTab) return 0;
    const abilBonus = this.getEquipmentAbilities().conversionBonus || 0;
    return Math.max(0, (cls.conversionPerDay || 1) + abilBonus - (this.state.conversionUsed || 0));
  },

  startConversion() {
    if (this.convRemaining() <= 0) return { ok: false, reason: 'Hai già evangelizzato oggi.' };
    this.state.conversionUsed = (this.state.conversionUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  applyConversionResult(score, blessedCount) {
    const char = this.state.character;
    let xp, gold, fameXp, tier;
    const finalScore = Math.min(100, score + blessedCount * 8);
    if (finalScore >= 82) {
      const check = this.resolveCheck('cha', 14);
      if (check.result === 'nat20') {
        tier = 'benedizione'; xp = 240; gold = 80; fameXp = 16;
      } else {
        tier = 'alta'; xp = 160; gold = 50; fameXp = 10;
      }
    } else if (finalScore >= 52) {
      tier = 'media'; xp = 95; gold = 28; fameXp = 6;
    } else {
      tier = 'bassa'; xp = 50; gold = 12; fameXp = 3;
    }
    xp   += char.level * 10;
    gold += char.level * 3;
    char.xp   += xp;
    char.gold += gold;
    char.fame += fameXp;
    const logText = tier === 'benedizione'
      ? `Missione di conversione: benedizione divina! (+${xp} PE, +${gold} mo)`
      : `Missione di conversione — ${Math.floor(score)}% fedeli convertiti. (+${xp} PE, +${gold} mo)`;
    const logEntry = { day: char.day, text: logText, type: tier === 'benedizione' ? 'success' : 'partial' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, xp, gold, fameXp, tier, score: Math.floor(finalScore), blessedCount, completedChallenges, levelUpResult };
  },

  /* ─── Stalla (Paladino) ─────────────────────────────────── */
  stableRemaining() {
    if (!this.state) return 0;
    const cls = this.getClasse();
    if (!cls.hasStableTab) return 0;
    const abilBonus = this.getEquipmentAbilities().stableBonus || 0;
    return Math.max(0, (cls.stablePerDay || 1) + abilBonus - (this.state.stableUsed || 0));
  },

  startStable() {
    if (this.stableRemaining() <= 0) return { ok: false, reason: 'Hai già accudito il cavallo oggi.' };
    this.state.stableUsed = (this.state.stableUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  applyStableResult(score) {
    const char = this.state.character;
    let xp = 0, gold = 0, fameXp = 0, tier;
    if (score >= 85) {
      tier = 'eccellente'; xp = 200; gold = 65; fameXp = 12;
    } else if (score >= 65) {
      tier = 'buona'; xp = 130; gold = 40; fameXp = 8;
    } else if (score >= 50) {
      tier = 'sufficiente'; xp = 80; gold = 22; fameXp = 4;
    } else {
      tier = 'fallimento';
    }
    if (tier !== 'fallimento') {
      xp   += char.level * 8;
      gold += char.level * 2;
      char.xp   += xp;
      char.gold += gold;
      char.fame += fameXp;
    }
    const logText = tier === 'eccellente'
      ? `Cavalcatura accudita magnificamente! (+${xp} PE, +${gold} mo)`
      : tier === 'fallimento'
      ? `Il cavallo era insoddisfatto. Nessuna ricompensa.`
      : `Cavalcatura accudita (${Math.floor(score)}%). (+${xp} PE, +${gold} mo)`;
    const logEntry = { day: char.day, text: logText, type: tier === 'fallimento' ? 'fail' : 'partial' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, xp, gold, fameXp, tier, score: Math.floor(score), completedChallenges, levelUpResult };
  },

  /* ─── Salva i Prigionieri (Paladino) ────────────────────── */
  rescueRemaining() {
    if (!this.state) return 0;
    const cls = this.getClasse();
    if (!cls.hasRescueTab) return 0;
    const abilBonus = this.getEquipmentAbilities().rescueBonus || 0;
    return Math.max(0, (cls.rescuePerDay || 2) + abilBonus - (this.state.rescueUsed || 0));
  },

  startRescue() {
    if (this.rescueRemaining() <= 0) return { ok: false, reason: 'Hai già compiuto tutte le missioni di salvataggio di oggi.' };
    this.state.rescueUsed = (this.state.rescueUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  applyRescueResult(saved, total, died, bossKilled) {
    const char = this.state.character;
    const pct  = total > 0 ? (saved / total) * 100 : 0;
    let xp = 0, gold = 0, fameXp = 0, tier;
    if (died && saved === 0) {
      tier = 'sconfitta';
    } else if (bossKilled) {
      tier = 'leggendario'; xp = 380; gold = 140; fameXp = 28;
    } else if (pct >= 80) {
      tier = 'glorioso'; xp = 250; gold = 90; fameXp = 18;
    } else if (pct >= 60) {
      tier = 'buono';    xp = 160; gold = 55; fameXp = 11;
    } else if (pct >= 40) {
      tier = 'parziale'; xp = 90;  gold = 28; fameXp = 5;
    } else {
      tier = 'fallimento';
    }
    if (tier !== 'sconfitta' && tier !== 'fallimento') {
      xp   += char.level * 10;
      gold += char.level * 3;
      char.xp   += xp;
      char.gold += gold;
      char.fame += fameXp;
    } else if (died) {
      if (saved > 0) {
        xp = saved * 15; gold = saved * 5;
        char.xp   += xp;
        char.gold += gold;
      }
    }
    const logText = tier === 'leggendario'
      ? `Il Boss è stato sconfitto! ${saved}/${total} prigionieri liberati! (+${xp} PE, +${gold} mo)`
      : tier === 'glorioso'
      ? `Missione gloriosa! ${saved}/${total} prigionieri liberati! (+${xp} PE, +${gold} mo)`
      : tier === 'sconfitta'
      ? `Il paladino è caduto senza salvare nessuno.`
      : tier === 'fallimento'
      ? `Solo ${saved}/${total} prigionieri liberati. Nessuna ricompensa.`
      : `${saved}/${total} prigionieri liberati. (+${xp} PE, +${gold} mo)`;
    const logType = (tier === 'leggendario' || tier === 'glorioso' || tier === 'buono') ? 'success' : tier === 'parziale' ? 'partial' : 'fail';
    char.log.unshift({ day: char.day, text: logText, type: logType });
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ok: true, xp, gold, fameXp, tier, saved, total, pct: Math.floor(pct), died, bossKilled, completedChallenges, levelUpResult };
  },

  /* ─── Attacco Ladro ─────────────────────────────────────── */
  _checkThiefTrigger() {
    // L'attacco ladro è guidato dalla Visibilità del personaggio (classi non-Ladro)
    if (this.getClasse().id === 'ladro') return false;
    const vis = this.state.character.wanted || 0;
    if (vis < 15) return false;
    // Scala più ripida: a vis=15 → 5%, vis=50 → 30%, vis=100 → 65%, vis=150+ → cap 85%
    const chance = Math.min(0.85, (vis - 15) / 160);
    return Math.random() < chance;
  },

  getThiefNarrative() {
    return THIEF_NARRATIVES[Math.floor(Math.random() * THIEF_NARRATIVES.length)];
  },

  resolveThiefAttack(approachStat, dc) {
    const char  = this.state.character;
    const check = this.resolveCheck(approachStat, dc);
    const isSuccess = check.result === 'nat20' || check.result === 'success';
    const isPartial = check.result === 'partial';

    let result;
    if (isSuccess || isPartial) {
      // Ladro sconfitto/in fuga — piccola riduzione visibilità (hai dimostrato di sapertela cavare)
      const xp   = 60 + char.level * 15;
      const fame = isSuccess ? 12 + char.level * 3 : 5;
      const goldGained = isSuccess ? 10 + Math.floor(Math.random() * 20 * char.level) : 0;
      const visReduction = isSuccess ? 15 : 8;
      char.xp   += xp;
      char.fame += fame;
      char.gold += goldGained;
      char.wanted = Math.max(0, (char.wanted || 0) - visReduction);
      const text = isSuccess
        ? `Attacco ladro respinto! ${check.result === 'nat20' ? 'CRITICO — ' : ''}+${xp} PE, +${fame} fama${goldGained ? `, +${goldGained} mo rubati al ladro` : ''}. Visibilità -${visReduction}`
        : `Attacco parzialmente respinto. +${xp} PE, +${fame} fama. Visibilità -${visReduction}`;
      char.log.unshift({ day: char.day, text, type: 'success' });
      result = { ok: true, partial: isPartial, xp, fame, goldGained, visReduction, check };
    } else {
      // Derubato — l'incidente ti insegna a stare più basso di profilo
      const goldLost = Math.max(10, Math.min(Math.floor(char.gold * 0.20), 200));
      const visReduction = 25;
      char.gold   = Math.max(0, char.gold - goldLost);
      char.wanted = Math.max(0, (char.wanted || 0) - visReduction);
      const text = check.result === 'nat1'
        ? `CRITICO! Il ladro ti deruba e ti ferisce. -${goldLost} mo. Visibilità -${visReduction}`
        : `Il ladro è riuscito a derubarti. -${goldLost} mo. Visibilità -${visReduction}`;
      char.log.unshift({ day: char.day, text, type: 'fail' });
      result = { ok: false, goldLost, visReduction, check };
    }

    if (char.log.length > 500) char.log.pop();
    this.state.thiefAttackCompleted = true;
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ...result, levelUpResult };
  },

  /* ─── Sfide giornaliere ─────────────────────────────────── */
  _challengeFilter(c) {
    const char = this.state.character;
    if (c.type === 'reach_fame'  && c.condition.fame  <= char.fame)  return false;
    if (c.type === 'reach_level' && c.condition.level <= char.level) return false;
    if (c.type === 'mission_tier' && c.condition.tier === 3 && char.fame < 150) return false;
    if (c.classRestrict && c.classRestrict !== char.classe) return false;
    return true;
  },

  generateDailyChallenges() {
    const count = 5 + (this.getEquipmentAbilities().challengeBonus || 0);
    const pool  = DB.challenges.filter(c => this._challengeFilter(c));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    this.state.dailyChallenges       = shuffled.slice(0, count).map(c => ({ challengeId: c.id, completed: false }));
    this.state.challengeRefreshUsed  = 0;
  },

  refreshDailyChallenges() {
    if (!this.state.dailyChallenges) { this.generateDailyChallenges(); return; }
    const count  = 5 + (this.getEquipmentAbilities().challengeBonus || 0);
    const kept   = this.state.dailyChallenges.filter(dc => !dc.completed);
    const usedIds = kept.map(dc => dc.challengeId);
    const pool   = DB.challenges.filter(c => !usedIds.includes(c.id) && this._challengeFilter(c));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const toAdd  = Math.max(0, count - kept.length);
    this.state.dailyChallenges      = [...kept, ...shuffled.slice(0, toAdd).map(c => ({ challengeId: c.id, completed: false }))];
    this.state.challengeRefreshUsed = 0;
  },

  challengeRefreshesRemaining() {
    const max = this.getEquipmentAbilities().challengeRefresh || 0;
    return Math.max(0, max - (this.state.challengeRefreshUsed || 0));
  },

  refreshChallenge(index) {
    if (this.challengeRefreshesRemaining() <= 0) return { ok: false, reason: 'Nessun refresh disponibile.' };
    const dc = this.state.dailyChallenges[index];
    if (!dc || dc.completed) return { ok: false, reason: 'Sfida non disponibile.' };
    const usedIds = this.state.dailyChallenges.map(c => c.challengeId);
    const pool = DB.challenges.filter(c => !usedIds.includes(c.id) && this._challengeFilter(c));
    if (!pool.length) return { ok: false, reason: 'Nessuna sfida alternativa disponibile.' };
    const newC = pool[Math.floor(Math.random() * pool.length)];
    this.state.dailyChallenges[index] = { challengeId: newC.id, completed: false };
    this.state.challengeRefreshUsed = (this.state.challengeRefreshUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  checkChallenges(eventType, eventData = {}) {
    if (!this.state.dailyChallenges) return [];
    const char = this.state.character;
    const newly = [];

    for (const dc of this.state.dailyChallenges) {
      if (dc.completed) continue;
      const tmpl = DB.challenges.find(c => c.id === dc.challengeId);
      if (!tmpl) continue;

      let ok = false;
      switch (tmpl.type) {
        case 'mission_stat':
          ok = eventType === 'mission_complete' && eventData.stat === tmpl.condition.stat; break;
        case 'mission_tier':
          ok = eventType === 'mission_complete' && eventData.tier >= tmpl.condition.tier; break;
        case 'mission_nat20':
          ok = eventType === 'mission_complete' && eventData.nat20 === true; break;
        case 'complete_missions':
          ok = this.state.completedToday.length >= tmpl.condition.count; break;
        case 'pickpocket_success':
          ok = eventType === 'pickpocket_success'; break;
        case 'buy_item':
          ok = eventType === 'buy_item'; break;
        case 'sell_item':
          ok = eventType === 'sell_item' && (eventData.quality || 0) >= tmpl.condition.quality; break;
        case 'wear_quality': {
          const count = Object.values(char.equipment)
            .filter(id => { if (!id) return false; const it = DB.items.find(i => i.id === id); return it && it.quality >= tmpl.condition.quality; })
            .length;
          ok = count >= tmpl.condition.count; break;
        }
        case 'reach_fame':  ok = char.fame  >= tmpl.condition.fame;  break;
        case 'gold_above':  ok = char.gold  >= tmpl.condition.gold;  break;
        case 'gold_below':  ok = char.gold  <= tmpl.condition.gold;  break;
        case 'reach_level': ok = char.level >= tmpl.condition.level; break;
      }

      if (ok) {
        dc.completed = true;
        char.xp   += tmpl.reward.xp   || 0;
        char.gold += tmpl.reward.gold || 0;
        char.fame += tmpl.reward.fame || 0;
        newly.push(tmpl);
      }
    }

    if (newly.length) this.save();
    return newly;
  },

  /* ─── Helpers ──────────────────────────────────────────── */
  getFameLevel() {
    const fame = this.state.character.fame;
    let current = DB.fameLevels[0];
    for (const fl of DB.fameLevels) {
      if (fame >= fl.min) current = fl;
    }
    return current;
  },

  getNextFameLevel() {
    const fame = this.state.character.fame;
    for (const fl of DB.fameLevels) {
      if (fl.min > fame) return fl;
    }
    return null;
  },

  famePercent() {
    const fame    = this.state.character.fame;
    const current = this.getFameLevel();
    const next    = this.getNextFameLevel();
    if (!next) return 100;
    const range = next.min - current.min;
    const prog  = fame - current.min;
    return Math.min(100, Math.round((prog / range) * 100));
  },

  xpPercent() {
    const char   = this.state.character;
    if (char.level >= 10) return 100;
    const xpPrev = char.level >= 2 ? DB.xpTable[char.level - 2] : 0;
    const xpNext = DB.xpTable[char.level - 1];
    const prog   = char.xp - xpPrev;
    const range  = xpNext - xpPrev;
    return Math.min(100, Math.round((prog / range) * 100));
  },

  xpForNextLevel() {
    const char = this.state.character;
    if (char.level >= 10) return '—';
    return DB.xpTable[char.level - 1];
  },

  /* ─── Gioco dei Dadi ────────────────────────────────────── */
  maxDiceBet() {
    const gold = this.state.character.gold;
    // Massimo = 10% dell'oro attuale, minimo 1
    return Math.max(1, Math.floor(gold * 0.10));
  },

  getDiceBetOptions() {
    const max   = this.maxDiceBet();
    const avail = this.state.character.gold;
    // Arrotonda alle 5 mo più vicine per valori più puliti
    const r5 = v => Math.max(1, Math.round(v / 5) * 5);
    return [
      Math.min(max,           avail),
      Math.min(r5(max * 2/3), avail),
      Math.min(r5(max / 3),   avail),
    ].map(v => Math.max(1, v));
  },

  /* Rapidità di Mano — reroll dadi */
  diceRerollsAvailable() {
    return 2 + (this.getEquipmentAbilities().diceRerollBonus || 0);
  },
  diceRerollsRemaining() {
    return Math.max(0, this.diceRerollsAvailable() - (this.state.diceRerollsUsed || 0));
  },
  useDiceReroll() {
    if (this.diceRerollsRemaining() <= 0) return false;
    this.state.diceRerollsUsed = (this.state.diceRerollsUsed || 0) + 1;
    this.save();
    return true;
  },

  /* Calcola il risultato senza applicarlo */
  rollDiceGame(bet) {
    if (bet <= 0 || this.state.character.gold < bet) return { ok: false, reason: 'Oro insufficiente.' };
    const char = this.state.character;

    const roll2d6 = () => {
      const total = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2;
      const d1min = Math.max(1, total - 6);
      const d1max = Math.min(6, total - 1);
      const d1 = d1min + Math.floor(Math.random() * (d1max - d1min + 1));
      return { d1, d2: total - d1, total };
    };

    const npcPool = [...DICE_NPC_NAMES].sort(() => Math.random() - 0.5);
    const playerDice = roll2d6();
    const players = [
      { name: char.name,  isPlayer: true,  ...playerDice },
      { name: npcPool[0], isPlayer: false, ...roll2d6()  },
      { name: npcPool[1], isPlayer: false, ...roll2d6()  },
      { name: npcPool[2], isPlayer: false, ...roll2d6()  },
    ];
    const ranked     = [...players].sort((a, b) =>
      b.total !== a.total ? b.total - a.total : (a.isPlayer ? -1 : 1));
    const playerRank = ranked.findIndex(p => p.isPlayer) + 1;

    let goldDelta, fameDelta = 0, xp = 0, outcome;
    if (playerRank === 1) {
      goldDelta = bet * 3;
      xp        = 100 + char.level * 24 + Math.floor(bet * 0.03);
      fameDelta = 3 + Math.floor(bet / 150);
      outcome   = 'win';
    } else if (playerRank === 4) {
      goldDelta = -bet;
      fameDelta = -(3 + Math.floor(char.level / 2));
      outcome   = 'last';
    } else {
      const pct = playerRank === 2 ? 0.4 : 0.15;
      goldDelta = Math.floor(bet * pct) - bet;
      xp        = playerRank === 2
        ? 50 + char.level * 12 + Math.floor(bet * 0.015)
        : 20 + char.level * 6  + Math.floor(bet * 0.008);
      fameDelta = playerRank === 2 ? 1 + Math.floor(bet / 300) : 0;
      outcome   = 'consolation';
    }
    return { ok: true, ranked, playerRank, bet, goldDelta, fameDelta, xp, outcome };
  },

  /* Applica il risultato finale allo stato */
  applyDiceGameResult(result) {
    const char = this.state.character;
    char.gold += result.goldDelta;
    char.fame  = Math.max(0, char.fame + result.fameDelta);
    char.xp   += result.xp;
    const logText = result.outcome === 'win'
      ? `Dadi: vittoria! +${result.goldDelta} mo`
      : result.outcome === 'last' ? `Dadi: ultimo posto, -${result.bet} mo`
      : `Dadi: ${result.playerRank}° posto (${result.goldDelta >= 0 ? '+' : ''}${result.goldDelta} mo)`;
    const logEntry = { day: char.day, text: logText,
      type: result.outcome === 'win' ? 'success' : result.outcome === 'last' ? 'fail' : 'neutral' };
    char.log.unshift(logEntry);
    if (char.log.length > 500) char.log.pop();
    const completedChallenges = this.checkChallenges('passive');
    const levelUpResult = this.checkLevelUp();
    this.save();
    return { ...result, completedChallenges, levelUpResult };
  },

  statLabel(statKey) {
    return { str: 'FOR', dex: 'DES', con: 'COS', int: 'INT', wis: 'SAG', cha: 'CAR' }[statKey] || statKey.toUpperCase();
  },

  isMissionCompleted(id) {
    return this.state.completedToday.includes(id);
  },

  getItemById(id) {
    return DB.items.find(i => i.id === id) || null;
  },

  canAffordTax() {
    return this.state.character.gold >= this.guildTax();
  },

  /* ─── COMBATTIMENTO A TURNI ────────────────────────────── */

  combatRemaining() {
    return Math.max(0, 1 - (this.state.combatUsed || 0));
  },

  calcPlayerHPMax() {
    const char = this.state.character;
    const cls = this.getClasse();
    const baseHP = { guerriero: 12, paladino: 10, chierico: 9, druido: 8, ladro: 8, mago: 6 }[cls.id] || 8;
    const conMod = this.modifier(this.effectiveStat('con'));
    return baseHP + baseHP * (char.level - 1) + conMod * char.level;
  },

  calcPlayerMPMax() {
    const char = this.state.character;
    const cls = this.getClasse();
    const baseMP = { mago: 10, chierico: 8, druido: 7, paladino: 4, ladro: 2, guerriero: 0 }[cls.id] || 0;
    const spellStatKey = { mago: 'int', chierico: 'wis', druido: 'wis', paladino: 'cha', ladro: 'int', guerriero: 'con' }[cls.id] || 'int';
    const spellMod = Math.max(0, this.modifier(this.effectiveStat(spellStatKey)));
    return baseMP + spellMod * char.level;
  },

  _rollEnemyCount(level) {
    // Pesi per [1,2,3,4,5] nemici in base al livello
    const tables = [
      [80, 20,  0,  0,  0],  // lv1
      [65, 30,  5,  0,  0],  // lv2
      [50, 35, 12,  3,  0],  // lv3
      [40, 30, 18,  9,  3],  // lv4
      [30, 28, 22, 14,  6],  // lv5
      [22, 25, 25, 18, 10],  // lv6
      [15, 20, 25, 25, 15],  // lv7
      [10, 18, 25, 28, 19],  // lv8
      [ 8, 14, 22, 30, 26],  // lv9
      [ 5, 10, 20, 30, 35],  // lv10
    ];
    const w = tables[Math.min(9, Math.max(0, level - 1))];
    const r = Math.random() * 100;
    let cum = 0;
    for (let i = 0; i < w.length; i++) { cum += w[i]; if (r < cum) return i + 1; }
    return 1;
  },

  _makeEnemy(template) {
    const level = (this.state.character || {}).level || 1;
    // Scale factor: ~0.70 at lv1, 1.0 at lv5, ~1.30 at lv10 (capped)
    const scale = Math.min(1.30, 0.70 + (level - 1) * 0.075);
    const scaledHP = Math.max(template.hp, Math.round(template.hp * scale));
    // Scale offensive stats (STR and INT) to adjust damage output per level
    const scaledStr = Math.round((template.stats.str || 10) * scale);
    const scaledInt = Math.round((template.stats.int || 10) * scale);
    const scaledStats = { ...template.stats, str: scaledStr, int: scaledInt };
    return { ...template, stats: scaledStats, hpMax: scaledHP, hp: scaledHP,
             mpMax: template.mp || 0, mp: template.mp || 0, statusEffects: [] };
  },

  startCombat() {
    if (this.combatRemaining() <= 0) return { ok: false, reason: 'Hai già combattuto oggi. Torna domani.' };
    const char  = this.state.character;
    const maxTier = Math.min(3, Math.ceil(char.level / 3));
    const pool  = ENEMIES.filter(e => e.tier <= maxTier);

    // Genera la coda nemici
    const count = this._rollEnemyCount(char.level);
    const templates = Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]);
    const [firstTemplate, ...restTemplates] = templates;
    const enemy = this._makeEnemy(firstTemplate);
    const enemyQueue = restTemplates.map(t => this._makeEnemy(t));

    const playerDexMod = this.modifier(this.effectiveStat('dex'));
    const playerRoll = rollDice('1d20') + playerDexMod;
    const enemyRoll  = rollDice('1d20') + this.modifier(firstTemplate.stats.dex);
    const playerGoesFirst = playerRoll >= enemyRoll;

    const hpMax = this.calcPlayerHPMax();
    const mpMax = this.calcPlayerMPMax();

    const countLabel = count > 1 ? ` (${count} nemici in arrivo!)` : '';
    this.state.combat = {
      active: true,
      phase: playerGoesFirst ? 'player_choice' : 'enemy_turn',
      turn: 1,
      playerGoesFirst,
      enemy,
      enemyQueue,
      totalEnemies: count,
      defeatedEnemies: [],
      accumulatedRewards: { xp: 0, gold: 0, fame: 0, topTier: 0 },
      playerHP: hpMax, playerHPMax: hpMax,
      playerMP: mpMax, playerMPMax: mpMax,
      playerStatusEffects: [],
      skillCooldowns: (() => {
        const cd = {};
        const clsId = this.getClasse().id;
        const charLevel = this.state.character.level;
        for (const s of COMBAT_SKILLS) {
          if (!s.cooldown) continue;
          const avail = s.availableFor === 'all' || (Array.isArray(s.availableFor) && s.availableFor.includes(clsId));
          if (avail && (s.unlockLevel || 1) <= charLevel) cd[s.id] = s.cooldown;
        }
        return cd;
      })(),
      log: [{ turn: 0, text: `Iniziativa: tu ${playerRoll} vs ${enemy.name} ${enemyRoll}. ${playerGoesFirst ? 'Vai per primo!' : 'Il nemico attacca per primo!'}${countLabel}`, type: 'info' }],
      outcome: null,
      rewards: null
    };

    this.state.combatUsed = (this.state.combatUsed || 0) + 1;
    this.save();
    return { ok: true };
  },

  _getWeaponDamage() {
    const eq = this.state.character.equipment;
    const weapon = eq.weapon ? DB.items.find(i => i.id === eq.weapon) : null;
    return weapon?.combatDamage || '1d4';
  },

  _combatRollToHit(hitStat, hitPenalty, targetEvasion, targetStats) {
    const roll = rollDice('1d20');
    const statMod = this.modifier(this.effectiveStat(hitStat));
    const profStats = this.getClasse().proficiencies || [];
    const prof = profStats.includes(hitStat) ? (this.state.character.proficiency || 2) : 0;
    const blindPenalty = this._playerHasStatus('blind') ? -4 : 0;
    const total = roll + statMod + prof + (hitPenalty || 0) + blindPenalty;
    const CA = 10 + this.modifier(targetStats.dex || 10) + (targetEvasion || 0);
    const hit = roll === 20 || (roll !== 1 && total >= CA);
    return { roll, statMod, prof, blindPenalty, hitPenalty: hitPenalty || 0, total, CA, hit, critical: roll === 20, hitStat };
  },

  /* Formatta la prova tiro in testo leggibile */
  _rollSummary(r) {
    const abbr = { str:'FOR', dex:'DES', con:'COS', int:'INT', wis:'SAG', cha:'CAR' };
    const s = r.hitStat ? (abbr[r.hitStat] || r.hitStat.toUpperCase()) : '';
    const fmt = n => n >= 0 ? `+${n}` : `${n}`;
    if (r.critical) return `🎲[20] ✨ CRITICO!`;
    if (r.roll === 1) return `🎲[1] 💨 Fumble!`;
    const parts = [`🎲[${r.roll}]`];
    if (r.statMod !== 0) parts.push(`${fmt(r.statMod)}${s}`);
    if (r.prof > 0)      parts.push(`+${r.prof}(Prof)`);
    if (r.hitPenalty !== 0) parts.push(fmt(r.hitPenalty));
    if (r.blindPenalty !== 0) parts.push(`${r.blindPenalty}(cieco)`);
    return `${parts.join(' ')} = ${r.total} vs CA ${r.CA}`;
  },

  /* Come _rollSummary ma per i tiri del nemico (nessun prof, no blind) */
  _enemyRollSummary(roll, mod, hitPenalty, total, playerCA) {
    const fmt = n => n >= 0 ? `+${n}` : `${n}`;
    if (roll === 20) return `🎲[20] ✨ CRITICO!`;
    if (roll === 1)  return `🎲[1] 💨 Fumble!`;
    const parts = [`🎲[${roll}]`];
    if (mod !== 0)        parts.push(fmt(mod));
    if (hitPenalty !== 0) parts.push(fmt(hitPenalty));
    return `${parts.join(' ')} = ${total} vs CA ${playerCA}`;
  },

  _combatCalcDamage(skill, isCritical) {
    const combat = this.state.combat;
    const weaponDice = this._getWeaponDamage();
    const dice = skill.damageDice === 'weapon' ? weaponDice : (skill.damageDice || '1d4');
    let base = rollDice(dice) + this.modifier(this.effectiveStat(skill.stat)) + (skill.damageBonus || 0);
    if (isCritical) base += rollDice(weaponDice);
    if (skill.divineDice) base += rollDice(skill.divineDice) + this.modifier(this.effectiveStat(skill.divineStat));
    const defense = skill.type === 'magical' ? (combat.enemy.magicResist || 0) : (combat.enemy.defense || 0);
    // Apply magic_shield if present on enemy (not typical but check anyway)
    return Math.max(1, base - defense);
  },

  _playerHasStatus(id) {
    return (this.state.combat?.playerStatusEffects || []).some(s => s.id === id && s.duration > 0);
  },

  _enemyHasStatus(id) {
    return (this.state.combat?.enemy?.statusEffects || []).some(s => s.id === id && s.duration > 0);
  },

  _applyStatusToPlayer(statusId, duration) {
    const c = this.state.combat;
    c.playerStatusEffects = c.playerStatusEffects.filter(s => s.id !== statusId);
    c.playerStatusEffects.push({ id: statusId, duration: duration || 2 });
  },

  _applyStatusToEnemy(statusId, duration) {
    const c = this.state.combat;
    c.enemy.statusEffects = c.enemy.statusEffects.filter(s => s.id !== statusId);
    c.enemy.statusEffects.push({ id: statusId, duration: duration || 2 });
  },

  _addLog(text, type) {
    const c = this.state.combat;
    c.log.unshift({ turn: c.turn, text, type: type || 'info' });
  },

  playerAction(skillId) {
    const c = this.state.combat;
    if (!c || c.phase !== 'player_choice' || c.outcome) return { ok: false };

    const skill = COMBAT_SKILLS.find(s => s.id === skillId);
    if (!skill) return { ok: false, reason: 'Azione sconosciuta.' };

    // Controlla livello sblocco
    const charLevel = this.state.character.level || 1;
    if ((skill.unlockLevel || 1) > charLevel) return { ok: false, reason: `Sblocchi questa abilità al livello ${skill.unlockLevel}.` };

    // Controlla cooldown
    if (!c.skillCooldowns) c.skillCooldowns = {};
    const cdRemaining = c.skillCooldowns[skill.id] || 0;
    if (cdRemaining > 0) return { ok: false, reason: `${skill.name} in recupero: ancora ${cdRemaining} turno/i.` };

    // Controlla MP
    if ((skill.mpCost || 0) > c.playerMP) return { ok: false, reason: 'MP insufficienti.' };

    c.playerMP -= (skill.mpCost || 0);

    // Imposta cooldown dell'abilità usata
    if ((skill.cooldown || 0) > 0) {
      c.skillCooldowns[skill.id] = skill.cooldown;
    }
    // Sinergia: se questa abilità è la synergySkill di un'altra, riduci il suo cooldown di 1
    const _clsId = this.getClasse().id;
    for (const s of COMBAT_SKILLS) {
      if (s.synergySkill === skill.id && (c.skillCooldowns[s.id] || 0) > 0) {
        const isAvail = s.availableFor === 'all' || (Array.isArray(s.availableFor) && s.availableFor.includes(_clsId));
        if (isAvail) c.skillCooldowns[s.id] = Math.max(0, c.skillCooldowns[s.id] - 1);
      }
    }

    let actionLog = '';

    if (skill.id === 'fuggi') {
      const dexMod  = this.modifier(this.effectiveStat('dex'));
      const baseRoll = rollDice('1d20');
      const total    = baseRoll + dexMod;
      const threshold = this.modifier(c.enemy.stats.dex) + 8;
      const fmtMod = dexMod >= 0 ? `+${dexMod}` : `${dexMod}`;
      const rollDesc = `🎲[${baseRoll}] ${fmtMod}DES = ${total} vs soglia ${threshold}`;
      if (total > threshold) {
        c.outcome = 'fled';
        c.phase = 'end';
        this._addLog(`Fuga: ${rollDesc} → Riuscita!`, 'info');
        this.save();
        return { ok: true, fled: true };
      } else {
        this._addLog(`Fuga: ${rollDesc} → Fallita! Il nemico attacca!`, 'miss');
        c.phase = 'enemy_turn';
        this.save();
        return { ok: true, fled: false, enemyTurnPending: true };
      }
    }

    if (skill.healSelf) {
      const abbr = { str:'FOR', dex:'DES', con:'COS', int:'INT', wis:'SAG', cha:'CAR' };
      const statKey  = skill.stat;
      const statMod  = this.modifier(this.effectiveStat(statKey));
      const diceRoll = rollDice(skill.damageDice);
      const healAmt  = Math.max(1, diceRoll + statMod);
      c.playerHP = Math.min(c.playerHPMax, c.playerHP + healAmt);
      const fmtMod = statMod >= 0 ? `+${statMod}` : `${statMod}`;
      this._addLog(`${skill.name}: ${skill.damageDice}[${diceRoll}] ${fmtMod}${abbr[statKey]||''} = +${healAmt} HP`, 'status');
      c.phase = 'enemy_turn';
      this.save();
      return { ok: true, healAmt, enemyTurnPending: true };
    }

    if (skill.type === 'utility' && skill.target === 'self') {
      if (skill.statusApply) {
        this._applyStatusToPlayer(skill.statusApply, 2);
        const effect = STATUS_EFFECTS[skill.statusApply];
        this._addLog(`${skill.name}: ottieni ${effect?.name || skill.statusApply}! (nessun tiro)`, 'status');
      }
      c.phase = 'enemy_turn';
      this.save();
      return { ok: true, enemyTurnPending: true };
    }

    if (skill.type === 'utility' && skill.target === 'enemy') {
      const rollR = this._combatRollToHit(skill.hitStat, skill.hitPenalty, c.enemy.evasion, c.enemy.stats);
      const rollDesc = this._rollSummary(rollR);
      if (rollR.hit) {
        if (skill.statusApply) {
          this._applyStatusToEnemy(skill.statusApply, 2);
          const effect = STATUS_EFFECTS[skill.statusApply];
          this._addLog(`${skill.name}: ${rollDesc} → ${effect?.name || skill.statusApply}!`, 'status');
        }
      } else {
        this._addLog(`${skill.name}: ${rollDesc} → Mancato!`, 'miss');
      }
      c.phase = 'enemy_turn';
      this.save();
      return { ok: true, hit: rollR.hit, enemyTurnPending: true };
    }

    // Attacco fisico/magico
    const rollR = this._combatRollToHit(skill.hitStat, skill.hitPenalty || 0, c.enemy.evasion, c.enemy.stats);
    const { hit, critical } = rollR;
    const rollDesc = this._rollSummary(rollR);
    if (hit) {
      let dmg = this._combatCalcDamage(skill, critical);
      const shieldIdx = c.enemy.statusEffects.findIndex(s => s.id === 'magic_shield' && s.duration > 0);
      if (shieldIdx >= 0) {
        dmg = Math.max(1, Math.floor(dmg * 0.5));
        c.enemy.statusEffects.splice(shieldIdx, 1);
        this._addLog(`Scudo arcano del nemico: danno dimezzato!`, 'status');
      }
      c.enemy.hp = Math.max(0, c.enemy.hp - dmg);
      this._addLog(`${skill.name}: ${rollDesc} → ${dmg} danni${critical ? ' 💥' : ''}`, critical ? 'crit' : 'hit');
      if (skill.statusApply) {
        this._applyStatusToEnemy(skill.statusApply, 2);
        const effect = STATUS_EFFECTS[skill.statusApply];
        this._addLog(`↳ ${c.enemy.name} subisce ${effect?.name || skill.statusApply}!`, 'status');
      }
      if (skill.drain) {
        const drainAmt = Math.floor(dmg / 2);
        c.playerHP = Math.min(c.playerHPMax, c.playerHP + drainAmt);
        this._addLog(`↳ Drenaggio: recuperi ${drainAmt} HP!`, 'status');
      }
    } else {
      this._addLog(`${skill.name}: ${rollDesc} → Mancato!`, 'miss');
    }

    const ended = this._checkCombatEnd();
    if (!ended) {
      c.phase = 'enemy_turn';
    }
    this.save();
    return { ok: true, hit, critical, enemyTurnPending: !ended && ended !== 'next', nextEnemy: ended === 'next' };
  },

  runEnemyTurn() {
    const c = this.state.combat;
    if (!c || c.phase !== 'enemy_turn' || c.outcome) return;

    // 1. Process enemy status at start of its turn
    this._processStatusEffects(false);
    if (c.outcome) { this.save(); return; }

    // 2. Check if stunned (skip turn)
    const enemyStunned = this._enemyHasStatus('stunned');
    if (enemyStunned) {
      // Decrement stunned
      const se = c.enemy.statusEffects.find(s => s.id === 'stunned');
      if (se) se.duration--;
      this._addLog(`${c.enemy.name} è stordito e salta il turno!`, 'status');
    } else {
      // 3. Run AI
      const action = this._runEnemyAI();

      if (action.action === 'attack' || (action.action === 'skill' && ENEMY_SKILLS[action.skill]?.type === 'offensive')) {
        const eSkill = action.action === 'skill' ? ENEMY_SKILLS[action.skill] : null;
        const hitStat = eSkill?.hitStat || 'str';
        const dice = eSkill?.damageDice || c.enemy.damageDice || '1d6';
        const dmgStat = eSkill?.stat || 'str';
        const hitPenalty = eSkill?.hitPenalty || 0;

        const roll = rollDice('1d20');
        const mod = this.modifier(c.enemy.stats[hitStat] || 10);
        const total = roll + mod + hitPenalty;
        const caBonus = c.playerStatusEffects
          .filter(s => s.duration > 0)
          .reduce((sum, s) => sum + (STATUS_EFFECTS[s.id]?.caBonus || 0), 0);
        const playerCA = 10 + this.modifier(this.effectiveStat('dex')) + caBonus;
        const hit = roll === 20 || (roll !== 1 && total >= playerCA);
        const critical = roll === 20;
        const label = eSkill ? eSkill.name : 'Attacco';
        const rollDesc = this._enemyRollSummary(roll, mod, hitPenalty, total, playerCA);

        if (hit) {
          let dmg = rollDice(dice) + this.modifier(c.enemy.stats[dmgStat] || 10);
          if (critical) dmg += rollDice('1d6');
          dmg = Math.max(1, dmg);

          const shieldIdx = c.playerStatusEffects.findIndex(s => s.id === 'magic_shield' && s.duration > 0);
          if (shieldIdx >= 0) {
            dmg = Math.max(1, Math.floor(dmg * 0.5));
            c.playerStatusEffects.splice(shieldIdx, 1);
            this._addLog(`Il tuo scudo arcano dimezza il danno!`, 'status');
          }

          c.playerHP = Math.max(0, c.playerHP - dmg);
          this._addLog(`${c.enemy.name} — ${label}: ${rollDesc} → ${dmg} danni${critical ? ' 💥' : ''}`, critical ? 'crit' : 'hit');

          if (eSkill?.statusApply) {
            this._applyStatusToPlayer(eSkill.statusApply, 2);
            const effect = STATUS_EFFECTS[eSkill.statusApply];
            this._addLog(`↳ Sei ${effect?.name || eSkill.statusApply}!`, 'status');
          }
          if (eSkill?.drain) {
            c.enemy.hp = Math.min(c.enemy.hpMax, c.enemy.hp + Math.floor(dmg / 2));
            this._addLog(`↳ ${c.enemy.name} drena ${Math.floor(dmg / 2)} HP!`, 'status');
          }
        } else {
          this._addLog(`${c.enemy.name} — ${label}: ${rollDesc} → Mancato!`, 'miss');
        }
      } else if (action.action === 'skill') {
        // utility skill
        const eSkill = ENEMY_SKILLS[action.skill];
        if (eSkill?.statusApply) {
          this._applyStatusToPlayer(eSkill.statusApply, 2);
          const effect = STATUS_EFFECTS[eSkill.statusApply];
          this._addLog(`${c.enemy.name} usa ${eSkill.name}: sei ${effect?.name || eSkill.statusApply}!`, 'status');
        }
      }
    }

    const ended = this._checkCombatEnd();
    if (!ended) {
      // 4. Process player status at end of enemy turn
      this._processStatusEffects(true);
      // 5. Decrement durations
      c.enemy.statusEffects = c.enemy.statusEffects.map(s => ({ ...s, duration: s.duration - 1 })).filter(s => s.duration > 0);
      c.playerStatusEffects = c.playerStatusEffects.map(s => ({ ...s, duration: s.duration - 1 })).filter(s => s.duration > 0);
      // Decrementa cooldown abilità giocatore
      if (c.skillCooldowns) {
        for (const id in c.skillCooldowns) {
          if (c.skillCooldowns[id] > 0) c.skillCooldowns[id]--;
        }
      }
      c.turn++;
      if (!this._checkCombatEnd()) {
        c.phase = 'player_choice';
      }
    }
    this.save();
  },

  _processStatusEffects(isPlayer) {
    const c = this.state.combat;
    const effects = isPlayer ? c.playerStatusEffects : c.enemy.statusEffects;
    for (const se of effects) {
      if (se.duration <= 0) continue;
      const def = STATUS_EFFECTS[se.id];
      if (!def) continue;
      if (def.trigger === 'end_of_turn' || def.trigger === 'start_of_turn') {
        if (def.damageDice) {
          // Damage tick (e.g. poison)
          const dmg = rollDice(def.damageDice);
          if (isPlayer) {
            c.playerHP = Math.max(0, c.playerHP - dmg);
            this._addLog(`${def.name}: subisci ${dmg} danno!`, 'status');
          } else {
            c.enemy.hp = Math.max(0, c.enemy.hp - dmg);
            this._addLog(`${c.enemy.name} subisce ${dmg} danno da ${def.name}!`, 'status');
          }
        }
        if (def.healDice && isPlayer) {
          // Heal tick (e.g. regeneration)
          const heal = rollDice(def.healDice) + Math.max(0, this.modifier(this.effectiveStat('wis')));
          c.playerHP = Math.min(c.playerHPMax, c.playerHP + heal);
          this._addLog(`Rigenerazione: recuperi ${heal} HP!`, 'status');
        }
      }
    }
    this._checkCombatEnd();
  },

  _runEnemyAI() {
    const c = this.state.combat;
    const ai = c.enemy.ai_type;
    const skills = c.enemy.skills || [];
    if (ai === 'aggressive') {
      const off = skills.filter(s => ENEMY_SKILLS[s]?.type === 'offensive');
      if (off.length && Math.random() < 0.4) return { action: 'skill', skill: off[Math.floor(Math.random() * off.length)] };
      return { action: 'attack' };
    }
    if (ai === 'defensive') {
      if (c.enemy.hp / c.enemy.hpMax < 0.3) {
        const def = skills.find(s => ENEMY_SKILLS[s]?.type !== 'offensive');
        if (def) return { action: 'skill', skill: def };
      }
      return { action: 'attack' };
    }
    // random
    const opts = [{ action: 'attack' }, ...skills.map(s => ({ action: 'skill', skill: s }))];
    return opts[Math.floor(Math.random() * opts.length)];
  },

  _accumulateEnemyRewards() {
    const c    = this.state.combat;
    const char = this.state.character;
    const enemy = c.enemy;
    const abilities = this.getEquipmentAbilities();
    const levelFactor = Math.max(0.2, 1 - (char.level - enemy.tier * 2) * 0.1);
    const xp  = Math.round(enemy.xpReward * levelFactor * (1 + (abilities.xpBonus || 0)));
    const goldMin = enemy.goldReward?.min || 5;
    const goldMax = enemy.goldReward?.max || 15;
    const gold = Math.round((goldMin + Math.floor(Math.random() * (goldMax - goldMin + 1))) * (1 + (abilities.goldBonus || 0)));
    const fame = enemy.fameReward || 0;
    if (!c.accumulatedRewards) c.accumulatedRewards = { xp: 0, gold: 0, fame: 0, topTier: 0 };
    c.accumulatedRewards.xp   += xp;
    c.accumulatedRewards.gold += gold;
    c.accumulatedRewards.fame += fame;
    c.accumulatedRewards.topTier = Math.max(c.accumulatedRewards.topTier, enemy.tier);
    this._addLog(`${enemy.name} sconfitto! +${xp} PE, +${gold} mo, +${fame} fama`, 'hit');
  },

  _checkCombatEnd() {
    const c = this.state.combat;
    if (!c || c.outcome) return true;

    if (c.enemy.hp <= 0) {
      // Accumula ricompense del nemico appena sconfitto
      this._accumulateEnemyRewards();
      if (!c.defeatedEnemies) c.defeatedEnemies = [];
      c.defeatedEnemies.push({ icon: c.enemy.icon, name: c.enemy.name });

      if (c.enemyQueue && c.enemyQueue.length > 0) {
        // Prossimo nemico in coda
        const next = c.enemyQueue.shift();
        this._addLog(`Avanza ${next.name}!`, 'info');
        c.enemy = next;
        c.phase = 'player_choice';
        return 'next'; // truthy ma non true — segnala "prossimo nemico caricato"
      }
      // Tutti i nemici sconfitti → vittoria
      c.outcome = 'victory';
      c.phase = 'end';
      this._applyCombatVictory();
      return true;
    }

    if (c.playerHP <= 0) {
      c.outcome = 'defeat';
      c.phase = 'end';
      this._applyCombatDefeat();
      return true;
    }
    return false;
  },

  _selectVictoryItem(enemyTier) {
    const char = this.state.character;
    const cls  = this.getClasse();
    const profs = cls.proficiencies || [];
    // Qualità coerente con il tier del nemico
    const maxQ = Math.min(5, enemyTier + 1);
    const eligible = (DB.items || []).filter(item => {
      if (!item.stats || !item.slot) return false;
      const hasProfStat = profs.some(p => (item.stats[p] || 0) > 0);
      if (!hasProfStat) return false;
      if (item.quality > maxQ) return false;
      if (item.classRestrict && !item.classRestrict.includes(cls.id)) return false;
      return true;
    });
    if (!eligible.length) return null;
    return eligible[Math.floor(Math.random() * eligible.length)];
  },

  _applyCombatVictory() {
    const c    = this.state.combat;
    const char = this.state.character;
    const acc  = c.accumulatedRewards || { xp: 0, gold: 0, fame: 0, topTier: 1 };
    char.xp   += acc.xp;
    char.gold += acc.gold;
    char.fame += acc.fame;
    // Oggetto garantito con stat delle competenze del personaggio (tier massimo incontrato)
    const droppedItem = this._selectVictoryItem(acc.topTier || 1);
    if (droppedItem) char.inventory.push(droppedItem.id);
    c.rewards = { xp: acc.xp, gold: acc.gold, fame: acc.fame, droppedItem };
    const completedChallenges = this.checkChallenges('combat_victory', { tier: acc.topTier || 1 });
    const levelUpResult = this.checkLevelUp();
    if (levelUpResult) this.state._lastLevelUp = levelUpResult;
    const itemNote = droppedItem ? `, ottieni ${droppedItem.name}` : '';
    const total = c.totalEnemies || 1;
    this._addLog(`Vittoria! Totale: +${acc.xp} PE, +${acc.gold} mo, +${acc.fame} fama${itemNote}.`, 'info');
    return { completedChallenges, levelUpResult };
  },

  _applyCombatDefeat() {
    const c = this.state.combat;
    const char = this.state.character;

    // Perdita oro: 10–20% casuale
    const lossPct     = 0.10 + Math.random() * 0.10;
    const goldLoss    = Math.floor(char.gold * lossPct);
    const goldLossPct = Math.round(lossPct * 100);
    char.gold = Math.max(0, char.gold - goldLoss);
    char.fame = Math.max(0, char.fame - 3);

    // Perdita oggetto: casuale tra inventario + oggetti equipaggiati
    let lostItem = null;
    let lostFrom = null;

    const invPool = char.inventory.map((id, idx) => ({ source: 'inventory', idx, id }));
    const eqSlots = ['weapon','torso','head','gloves','legs','boots','ringRight','ringLeft','shield'];
    const eqPool  = eqSlots
      .filter(slot => char.equipment[slot] != null)
      .map(slot => ({ source: 'equipment', slot, id: char.equipment[slot] }));

    const pool = [...invPool, ...eqPool];
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      lostItem = DB.items.find(i => i.id === pick.id) || { name: 'Oggetto sconosciuto' };
      lostFrom = pick.source;
      if (pick.source === 'inventory') {
        char.inventory.splice(pick.idx, 1);
      } else {
        char.equipment[pick.slot] = null;
      }
    }

    c.rewards = { goldLoss, goldLossPct, fameLoss: 3, lostItem, lostFrom };
    const itemNote = lostItem ? `, perdi ${lostItem.name}` : '';
    this._addLog(`Sconfitto! -${goldLoss} mo (-${goldLossPct}%), -3 fama${itemNote}.`, 'info');
  },
};

/* ─── Utility standalone ──────────────────────────────── */
function rollDice(str) {
  if (!str) return 0;
  const [n, s] = str.split('d').map(Number);
  if (!s) return n || 0;
  let t = 0;
  for (let i = 0; i < n; i++) t += Math.floor(Math.random() * s) + 1;
  return t;
}
