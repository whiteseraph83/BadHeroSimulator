# 🛠️ Documentazione Tecnica — BadHeroSimulator

## Indice

1. [Architettura generale](#architettura-generale)
2. [Struttura file](#struttura-file)
3. [data.js — Database di gioco](#datajs--database-di-gioco)
4. [game.js — Logica di gioco](#gamejs--logica-di-gioco)
5. [ui.js — Rendering interfaccia](#uijs--rendering-interfaccia)
6. [app.js — Entry point e minigiochi](#appjs--entry-point-e-minigiochi)
7. [Stato di gioco (state)](#stato-di-gioco-state)
8. [Sistema di salvataggio](#sistema-di-salvataggio)
9. [Sistema di prove (D20)](#sistema-di-prove-d20)
10. [Sistema di combattimento a turni](#sistema-di-combattimento-a-turni)
11. [Minigiochi canvas](#minigiochi-canvas)
12. [Sistema equipaggiamento e abilità](#sistema-equipaggiamento-e-abilità)
13. [Aggiungere nuove classi o meccaniche](#aggiungere-nuove-classi-o-meccaniche)

---

## Architettura generale

Il progetto è **vanilla JavaScript** senza framework o bundler. I 4 moduli JS sono caricati come script classici in `index.html` nell'ordine:

```
data.js → game.js → ui.js → app.js
```

Ogni modulo è un oggetto globale (`const DB`, `const Game`, `const UI`, `const App`). La comunicazione avviene tramite questi riferimenti diretti.

```
┌─────────────┐     legge      ┌─────────┐
│   data.js   │ ◄──────────── │ game.js │
│  (DB, etc.) │               │ (Game)  │
└─────────────┘               └────┬────┘
                                   │ chiama
                              ┌────▼────┐     aggiorna DOM
                              │  ui.js  │ ──────────────────► HTML
                              │  (UI)   │
                              └────▲────┘
                                   │ chiama
                              ┌────┴────┐
                              │  app.js │ ◄── eventi utente
                              │  (App)  │
                              └─────────┘
```

---

## Struttura file

```
BadHeroSimulator/
├── index.html              # Struttura UI, modali, tab, canvas
├── css/
│   └── style.css           # ~1800 righe — tema dark/light, qualità, classi
├── js/
│   ├── data.js             # ~3500 righe — database statico
│   ├── game.js             # ~1750 righe — logica e stato
│   ├── ui.js               # ~1900 righe — rendering DOM
│   └── app.js              # ~2750 righe — eventi e minigiochi
└── assets/
    └── *.svg               # Avatar classi (ladro, guerriero, mago, ecc.)
```

---

## data.js — Database di gioco

File di sola lettura. Contiene tutte le costanti di gioco.

### Costanti esportate

| Costante | Descrizione |
|----------|-------------|
| `QUALITY` | Mappa qualità (1–5) → `{ name, color, cls }` |
| `SLOT_META` | Mappa slot → `{ icon, label, bi }` |
| `DICE_NPC_NAMES` | Array nomi NPC per gioco dadi |
| `WANTED_LEVELS` | Soglie taglia (Ladro) |
| `VISIBILITY_LEVELS` | Soglie visibilità (altre classi) |
| `THIEF_NARRATIVES` | Testi narrativi per attacco ladro |
| `WANTED_NARRATIVES` | Testi narrativi per cacciatore di taglie |
| `CHALLENGE_POOL` | 30 sfide possibili |
| `CLASSES` | Array 6 classi personaggio |
| `INGREDIENTS` | 50 ingredienti per pozioni (IDs 1001–1050) |
| `POTION_RECIPES` | 25 ricette pozioni (IDs p001–p025) |
| `SPELL_COMPONENTS` | 50 componenti per incantesimi (IDs 2001–2050) |
| `SPELL_RECIPES` | 25 ricette incantesimi (IDs s001–s025) |
| `DB` | Oggetto principale con `missions`, `items`, `xpTable`, `fameLevels`, ecc. |
| `ENEMIES` | Array 8 nemici (3 tier) con stats, skills, rewards |
| `ENEMY_SKILLS` | Oggetto abilità nemici (`morso_velenoso`, `palla_fuoco_debole`, ecc.) |
| `COMBAT_SKILLS` | Array 50 abilità giocatore (2 universali + 8 per classe × 6 classi) |
| `STATUS_EFFECTS` | Oggetto 6 effetti di stato (`poison`, `stunned`, `blind`, ecc.) |

### Struttura CLASSES

```javascript
{
  id: 'ladro',               // ID univoco
  name: 'Ladro',             // Nome visualizzato
  desc: '...',               // Descrizione
  proficiencies: ['dex', 'int', 'cha'],  // Stat con bonus competenza
  avatar: 'ladro.svg',       // File avatar
  startingGold: 30,          // Oro iniziale

  // Flag meccaniche esclusive (tutti opzionali, default: false/undefined)
  hasPickpocket: true,
  hasDiceGame: true,
  hasDrinkingGame: true,     // Guerriero
  hasArena: true,            // Guerriero
  arenaPerDay: 2,
  hasStudy: true,            // Mago, Druido
  studyPerDay: 2,
  hasPotioniTab: true,       // Druido
  hasSpellTab: true,         // Mago
  hasPrayer: true,           // Chierico
  prayPerDay: 2,
  hasConversionTab: true,    // Chierico
  conversionPerDay: 2,
  hasStableTab: true,        // Paladino
  stablePerDay: 2,
  hasRescueTab: true,        // Paladino
  rescuePerDay: 2,
  rescueStrengthBase: 10,    // Forza iniziale del minigioco salvataggio
  hasCombat: true,           // Tutte le 6 classi — abilita la tab Combatti
}
```

### Struttura DB.items

```javascript
{
  id: 101,                         // ID numerico univoco
  name: 'Nome Oggetto',
  slot: 'torso',                   // head|gloves|legs|torso|boots|ring|ringRight|ringLeft|weapon|consumable
  quality: 3,                      // 1–5
  tier: 2,                         // 1–3 (influenza drop da missioni)
  reqLevel: 4,                     // Livello minimo per equipaggiare
  reqStat: { key: 'str', val: 12 }, // Stat minima (o null)
  desc: '...',
  stats: { str: 2, con: 1 },       // Bonus stat quando equipaggiato
  abilities: {                     // Abilità speciali (tutti opzionali)
    pickpocketBonus: 0,
    rerollBonus: 1,
    taxDiscount: 0.10,
    goldBonus: 0.15,
    xpBonus: 0,
    missionBonus: 1,
    challengeBonus: 0,
    challengeRefresh: 0,
    diceRerollBonus: 0,
    studyBonus: 0,
    arenaBonus: 0,
    arenaDoubleHit: false,
    conversionBonus: 0,
    conversionSpeed: 0,
    stableBonus: 0,
    rescueBonus: 0,          // +N sessioni salvataggio/giorno (Paladino)
    rescueStrengthBonus: 0,  // +N forza iniziale (Paladino)
  },
  buyPrice: 400,
  sellPrice: 160,                  // Tipicamente ~40% buyPrice
}
```

### Struttura DB.missions

```javascript
{
  id: 1,
  tier: 1,                         // 1|2|3
  minFame: 0,                      // Fama minima per vederla
  classRestrict: 'ladro',          // Opzionale: solo questa classe
  classMission: 'mago',            // Opzionale: missione esclusiva classe
  name: 'Borseggio al Mercato',
  desc: '...',
  type: 'furto',
  approaches: [
    {
      label: 'Mano lesta',
      stat: 'dex',
      dc: 11,
      successText: '...',
      partialText: '...',
      failText: '...',
    }
  ],
  rewards: {
    xp: 60, goldMin: 8, goldMax: 20, fameXp: 5,
    itemChance: 0.10, itemTier: 1,
    ingredientChance: 0.40,        // Solo missioni classe con crafting
    ingredientTierMax: 2,
  }
}
```

### Struttura COMBAT_SKILLS

```javascript
{
  id: 'palla_fuoco',          // ID univoco
  name: 'Palla di Fuoco',     // Nome visualizzato
  icon: '🔥',
  type: 'magical',            // 'physical' | 'magical' | 'utility'
  stat: 'int',                // Stat usata per danno / cura
  hitStat: 'int',             // Stat usata per il tiro per colpire
  damageDice: '2d6',          // Dadi danno (o dadi cura se healSelf: true), null se utility
  damageBonus: 3,             // Bonus fisso al danno
  mpCost: 4,                  // Costo in MP (0 = gratuito)
  target: 'enemy',            // 'enemy' | 'self'
  availableFor: ['mago'],     // Array ID classi, oppure 'all'
  hitPenalty: 0,              // Malus al tiro per colpire (es. −2 per attacchi pesanti)
  unlockLevel: 3,             // Livello personaggio richiesto per usare l'abilità
  statusApply: 'stunned',     // (opz.) Effetto di stato applicato al bersaglio se colpisce
  healSelf: true,             // (opz.) Se true, damageDice cura invece di fare danno
  drain: true,                // (opz.) Mago: drena HP dal nemico
  divineDice: '1d6',          // (opz.) Paladino: dadi danno bonus divino
  divineStat: 'cha',          // (opz.) Stat usata per il bonus divino
}
```

**Distribuzione abilità per classe (unlockLevel 3–10):**

| Classe | Tema | Stat primaria |
|--------|------|---------------|
| Ladro | Veleni, esecuzioni, ombre | DES |
| Guerriero | Fendenti, difesa, resistenza | FOR/COS |
| Mago | Magie elementali, scudi, drain | INT |
| Paladino | Colpi sacri, cure, ira divina | FOR/SAG/CAR |
| Druido | Nature, rigenerazione, cataclismi | SAG/COS |
| Chierico | Martelli, cure, miracoli | SAG/CAR |

### Struttura ENEMIES

```javascript
{
  id: 'goblin_ladro',
  name: 'Goblin Ladro',
  icon: '👺',
  tier: 1,                    // 1–3 (abbinato al livello del personaggio)
  hpMax: 18,
  stats: { str, dex, con, int, wis, cha },
  evasion: 13,                // CA del nemico
  proficiency: 2,
  skills: ['colpo_poderoso'], // IDs in ENEMY_SKILLS
  rewards: { xp, goldMin, goldMax, fameXp },
}
```

### Struttura STATUS_EFFECTS

```javascript
{
  poison: { trigger: 'end_of_turn',   damageDice: '1d4' },
  stunned: { trigger: 'start_of_turn', skipTurn: true },
  blind:   { trigger: 'passive',       hitPenalty: -4 },
  regeneration: { trigger: 'start_of_turn', healDice: '1d6' },
  defense_up:   { trigger: 'passive',  defenseBonus: 3 },
  magic_shield: { trigger: 'on_hit',   damageReduction: 0.5, consumeOnHit: true },
}
```

---

## game.js — Logica di gioco

Oggetto globale `Game`. Tutti i metodi che modificano lo stato chiamano `this.save()` alla fine.

### Metodi principali

#### Inizializzazione
```javascript
Game.init()          // Carica da localStorage, applica migrazioni, ritorna bool
Game.newGame(stats, name, classeId)  // Crea nuovo stato e salva
Game.save()          // Serializza state in localStorage
Game.reset()         // Cancella salvataggio
```

#### Dadi
```javascript
Game.rollD20()       // → 1–20
Game.rollD6()        // → 1–6
Game.rollD100()      // → 1–100
Game.roll4d6DropLowest()  // → somma 3 migliori su 4d6
Game.rollGold(min, max)   // → intero casuale in range
```

#### Statistiche
```javascript
Game.modifier(val)         // → floor((val - 10) / 2)
Game.effectiveStat(key)    // Base stat + bonus da tutti gli item equipaggiati
Game.hasProficiency(key)   // → bool, competente in quella stat?
Game.getEquipmentAbilities() // → oggetto con tutti i bonus aggregati dall'equip
```

#### Prove e missioni
```javascript
Game.resolveCheck(statKey, dc)      // → { roll, total, result: 'nat20'|'success'|'partial'|'fail' }
Game.resolveMission(missionId, approachIdx)  // Esegue la missione e ritorna result
Game.generateDailyMissions()        // Popola state.dailyMissions
Game.rerollMission(missionId)       // Sostituisce missione (usa rerollsUsed)
```

#### XP e leveling
```javascript
Game.checkLevelUp()  // → null | { oldLevel, newLevel, statsToAssign: 2 }
Game.applyLevelUp(stat1, stat2)  // Assegna +1 a due stat scelte
Game.xpForNextLevel()  // → XP target per prossimo livello
Game.xpPercent()       // → percentuale 0–100
```

#### Mercato
```javascript
Game.generateMarketItems()   // Popola state.marketItems
Game.buyItem(itemId)         // Acquista item, detrae gold
Game.sellItem(itemId)        // Vende item dall'inventario
Game.equipItem(itemId, slot) // Equipaggia item nello slot
Game.unequipItem(slot)       // Rimuove item dallo slot → va in inventario
```

#### Daily reset
```javascript
Game.nextDay()  // Avanza giorno: tassa, reset contatori, nuovi contenuti, eventi
```

#### Combattimento a turni
```javascript
// Avvio e gestione
Game.startCombat()              // Inizializza state.combat con nemico, HP/MP, initiative
Game.playerAction(skillId)      // Esegue azione giocatore → { ok, hit, critical, enemyTurnPending, fled }
Game.runEnemyTurn()             // Esegue turno nemico (AI), aggiorna log, controlla fine
Game._checkCombatEnd()          // → bool; imposta combat.outcome ('victory'|'defeat')

// Ricompense e penalità
Game._applyVictoryRewards()     // Applica XP/oro/item vittoria a state
Game._applyCombatDefeat()       // Detrae oro (10–20%), rimuove item casuale, −3 fama
Game._selectVictoryItem(tier)   // Trova item con bonus stat compatibili con le proficienze della classe

// Helpers interni
Game._combatRollToHit(hitStat, hitPenalty, enemyEvasion, enemyStats)
  // → { roll, statMod, prof, blindPenalty, hitPenalty, total, CA, hit, critical }
Game._combatCalcDamage(skill, critical)   // Calcola danno finale (con critico, stat, bonus)
Game._rollSummary(r)                      // → stringa log "🎲[14] +3FOR +2(Prof) = 19 vs CA 15"
Game._enemyRollSummary(roll, mod, pen, total, playerCA) // Identico per nemici
Game._applyStatusToPlayer(id, duration)  // Aggiunge/rinnova effetto su giocatore
Game._applyStatusToEnemy(id, duration)   // Aggiunge/rinnova effetto su nemico
Game._processStatusEffects(isPlayerTurn) // Applica trigger (veleno, regen, ecc.)
Game._runEnemyAI()                        // → { action: 'attack'|'skill', skill? }
Game._enemyHasStatus(id)                 // → bool
Game._addLog(text, type)                 // Aggiunge riga al log di combattimento

// Funzione standalone (fuori dall'oggetto Game)
rollDice('2d6')                          // → somma N dadi a S facce
```

#### Sistemi per classe
```javascript
// Ladro
Game.pickpocketsRemaining()
Game.startPickpocket()
Game.applyPickpocketResult(success)

// Guerriero
Game.arenaRemaining()
Game.startArena()
Game.applyArenaResult(killCount)

Game.drinkingGameUsed  // (state field, gestito in app.js)

// Mago / Druido
Game.studiesRemaining()
Game.startStudy()
Game.applyStudyReward(timeLeft, errors)
Game.craftPotion(selectedIngredientIds)
Game.generatePotionRequests()
Game.completePotionRequest(requestId)
// (Mago: analoghe per spell/incantesimi)

// Chierico
Game.prayRemaining()
Game.startPray()
Game.applyPrayResult(devotion)
Game.convRemaining()
Game.startConversion()
Game.applyConversionResult(score, blessedCount)

// Paladino — Cavalcatura
Game.stableRemaining()
Game.startStable()
Game.applyStableResult(score)

// Paladino — Salva i Prigionieri
Game.rescueRemaining()
Game.startRescue()
Game.applyRescueResult(saved, total, died)
```

### Migrazioni state

In `Game.init()` dopo il parsing del salvataggio, ogni campo introdotto in versioni successive viene aggiunto se assente:

```javascript
if (this.state.stableUsed === undefined)  this.state.stableUsed = 0;
if (this.state.rescueUsed === undefined)  this.state.rescueUsed = 0;
// ecc.
```

Questo permette di caricare salvataggi vecchi senza perdita di dati.

---

## ui.js — Rendering interfaccia

Oggetto globale `UI`. **Non modifica mai `Game.state`** direttamente; legge solo.

### Metodi principali

```javascript
UI.refresh()                  // Aggiorna l'intera interfaccia (chiamato dopo ogni azione)
UI.renderCharacter()          // Scheda personaggio: stats, XP, fama, oro
UI.renderMissions()           // Lista missioni giornaliere
UI.renderMarket()             // Tab mercato
UI.renderInventory()          // Inventario e equipaggiamento
UI.renderChallenges()         // Sfide giornaliere
UI.renderLog()                // Diario/storico azioni
UI.updateClassConditionalUI() // Mostra/nasconde elementi specifici per classe

// Combattimento
UI.renderCombatLobby()        // Pannello pre-combattimento: HP/MP, puntate, abilità proficiency
UI.renderCombatScreen(combat) // Battlefield JRPG: sprite, HUD HP/MP, log, griglia 5×2 abilità
UI.renderCombatLog(entries)   // Aggiorna il log visivo (ultimi 20 eventi)
UI.showCombatResult(outcome, rewards)  // Mostra modal risultato con tema vittoria/sconfitta/fuga
UI._renderStatusPills(effects) // → HTML badge colorati per effetti di stato attivi
```

### updateClassConditionalUI()

Metodo fondamentale chiamato in `refresh()`. Mostra o nasconde tutti gli elementi condizionali alle classi usando `classList.toggle('d-none', condition)`:

```javascript
// Esempio pattern
document.getElementById('study-wrapper').classList.toggle('d-none', !cls.hasStudy);
document.getElementById('tab-pozioni-nav').classList.toggle('d-none', !cls.hasPotioniTab);
document.getElementById('stable-wrapper').classList.toggle('d-none', !cls.hasStableTab);
// ecc.
```

### Rendering per classe

```javascript
UI.renderPickpocketBtn()       // Badge borseggi rimanenti
UI.renderStudyBtn()            // Badge studi rimanenti
UI.renderPrayBtn()             // Badge preghiere rimanenti
UI.renderConversionLobby()     // Badge conversioni rimanenti
UI.renderArenaLobby()          // Riepilo arena (record, timer, sessioni)
UI.renderStableLobby()         // Badge cavalcatura rimanenti
UI.renderRescueLobby()         // Forza iniziale + sessioni salvataggio rimanenti
UI.renderDrinkingBtn()         // Badge bevute rimanenti
UI.renderPozioniTab()          // Tab pozioni completo (Druido)
UI.renderIncantesimiTab()      // Tab incantesimi completo (Mago)
```

### Toast e feedback
```javascript
UI.toast(message, type)        // Notifica temporanea (success|danger|warning)
UI.showMissionResult(result)   // Modal con esito missione
UI.showPrayerResult(result)    // Sezione risultato preghiera
UI.showConversionResult(result)// Sezione risultato conversione
UI.showStableResult(result)    // Sezione risultato cavalcatura
UI.showRescueResult(result)    // Sezione risultato salvataggio prigionieri
```

---

## app.js — Entry point e minigiochi

Oggetto globale `App`. Gestisce:
- Inizializzazione dell'applicazione
- Tutti gli event listener
- I loop dei minigiochi (`requestAnimationFrame`)
- Coordinamento tra `Game` e `UI`

### Struttura init()

```javascript
App.init() {
  // 1. Ripristina tema (dark/light)
  // 2. Carica salvataggio (Game.init())
  // 3. Se partita esistente → UI.refresh()
  // 4. Se no → mostra modal creazione personaggio
  // 5. Registra TUTTI gli event listener
}
```

### Pattern minigiochi

Tutti i minigiochi canvas seguono lo stesso pattern:

```javascript
// 1. Stato del minigioco come proprietà dell'oggetto App
_stable: null,

// 2. Avvio: inizializza stato, mostra canvas/modal, avvia RAF
_startStableGame() {
  this._stable = { running: true, ... };
  this._stable.rafId = requestAnimationFrame(ts => this._stableLoop(ts));
},

// 3. Loop: calcola dt, aggiorna logica, disegna, schedula prossimo frame
_stableLoop(ts) {
  const s = this._stable;
  if (!s || !s.running) return;
  const dt = s.lastTs ? Math.min((ts - s.lastTs) / 1000, 0.1) : 0.016;
  s.lastTs = ts;
  // ... logica di gioco ...
  this._drawStable(canvas, s);
  s.rafId = requestAnimationFrame(ts2 => this._stableLoop(ts2));
},

// 4. Draw: renderizza il frame corrente sul canvas 2D
_drawStable(canvas, s) {
  const ctx = canvas.getContext('2d');
  // ... ctx.fillRect, ctx.arc, ctx.fillText, ecc. ...
},

// 5. Fine: ferma RAF, calcola risultato, chiama Game + UI
_endStableGame() {
  this._stable.running = false;
  cancelAnimationFrame(this._stable.rafId);
  const result = Game.applyStableResult(score);
  UI.showStableResult(result);
  UI.refresh();
},
```

### Minigiochi presenti

| Minigioco | Classe | Metodi principali |
|-----------|--------|-------------------|
| Borseggio | Ladro | `_startPickpocket`, `_ppLoop`, `_drawPickpocket` |
| Taglia (wanted) | Ladro | `_startWantedGame`, `_wantedLoop`, `_drawWanted` |
| Arena | Guerriero | `_startArena`, `_arenaLoop`, `_drawArena`, `_arenaHandleClick` |
| Gara di Bevute | Guerriero | `_startDrinkRound`, `_drinkLoop`, `_drawDrink` |
| Memory (Studio) | Mago/Druido | `_startMemoryGame`, logica flip, timer |
| Preghiera | Chierico | `_startPrayerAnimation`, `_prayerLoop`, `_drawPrayer` |
| Conversione | Chierico | `_startConversionGame`, `_convLoop`, `_drawConversion` |
| Cavalcatura | Paladino | `_startStableGame`, `_stableLoop`, `_drawStable`, `_stableHandleLaneClick` |
| Salva i Prigionieri | Paladino | `_startRescueGame`, `_rescueLoop`, `_drawRescue`, `_drawRescuePaladin`, `_rescueHandleClick`, `_endRescueGame` |

---

## Stato di gioco (state)

L'intero stato è un oggetto serializzabile JSON:

```javascript
Game.state = {
  version: 2,
  character: {
    name: 'Eroe',
    classe: 'ladro',          // ID classe
    level: 1,
    xp: 0,
    gold: 30,
    fame: 10,
    wanted: 0,
    stats: { str, dex, con, int, wis, cha },
    proficiency: 2,
    equipment: {              // slot → itemId | null
      head, gloves, legs, torso, boots,
      ringRight, ringLeft, weapon
    },
    inventory: [],            // Array di itemId
    day: 1,
    log: []                   // Array di { day, text, type }
  },

  // Contenuti giornalieri
  dailyMissions: [],          // Missioni del giorno
  completedToday: [],         // ID missioni completate oggi
  marketItems: [],            // Oggetti in vendita oggi
  dailyChallenges: [],        // Sfide attive

  // Contatori giornalieri (azzerati da nextDay)
  pickpocketsUsed: 0,
  rerollsUsed: 0,
  diceRerollsUsed: 0,
  studyUsed: 0,
  drinkingGameUsed: 0,
  prayUsed: 0,
  conversionUsed: 0,
  arenaUsed: 0,
  stableUsed: 0,
  rescueUsed: 0,
  challengeRefreshUsed: 0,

  // Persistenti
  arenaHighScore: 0,
  activeBoosts: [],           // Boost temporanei attivi

  // Inventari crafting
  ingredientInventory: [],    // Array di ingredientId (ripetizioni = quantità)
  potionInventory: [],        // Array di recipeId
  potionRequests: [],         // Richieste clienti pozioni
  componentInventory: [],
  spellInventory: [],
  spellRequests: [],
  knownRecipes: [],
  knownSpells: [],

  // Combattimento (azzerato da nextDay)
  combatUsed: 0,
  combat: null,               // null fuori dal combattimento, oppure:
  // {
  //   enemy: { id, name, icon, tier, hp, hpMax, stats, evasion, proficiency, skills, statusEffects },
  //   playerHP: N, playerHPMax: N,
  //   playerMP: N, playerMPMax: N,
  //   playerStatusEffects: [],
  //   turn: 1,
  //   phase: 'player_choice' | 'enemy_turn' | 'end',
  //   outcome: null | 'victory' | 'defeat' | 'fled',
  //   log: [{ turn, text, type }],
  //   rewards: { xp, gold, fameXp, item? } | null,
  // }

  // Flag eventi
  wantedMissionPending: false,
  wantedMissionCompleted: false,
  thiefAttackPending: false,
  thiefAttackCompleted: false,

  gameOver: false
}
```

---

## Sistema di salvataggio

```javascript
const SAVE_KEY     = 'badhero_save_v2';
const SAVE_VERSION = 2;
```

**Salvataggio**: `localStorage.setItem(SAVE_KEY, JSON.stringify(state))`
**Caricamento**: parse + check versione + migrazioni campi assenti

Le **migrazioni** in `Game.init()` garantiscono compatibilità con salvataggi di versioni precedenti aggiungendo i campi mancanti con valori di default.

> ⚠️ Il SAVE_VERSION deve essere incrementato solo in caso di rottura della struttura, non per nuovi campi (le migrazioni gestiscono l'aggiunta di nuovi campi).

---

## Sistema di prove (D20)

```javascript
Game.resolveCheck(statKey, dc) {
  const roll  = Game.rollD20();
  const mod   = Game.getModForStat(statKey);
  const prof  = Game.hasProficiency(statKey) ? Game.state.character.proficiency : 0;
  const total = roll + mod + prof;

  let result;
  if      (roll === 20)        result = 'nat20';
  else if (total >= dc)        result = 'success';
  else if (total >= dc - 5)    result = 'partial';
  else                         result = 'fail';

  return { roll, mod, prof, total, dc, result };
}
```

La differenza tra successo pieno e parziale è sempre **5 punti**.
I successi parziali danno il **50% delle ricompense** (oro, XP ridotti).

---

## Sistema di combattimento a turni

### Flusso di una sessione

```
startCombat()
  └─ Sceglie nemico (tier = ceil(charLevel/3.5))
  └─ Calcola playerHP/MP da stats
  └─ Tira initiative: 1d20+DEX (giocatore) vs 1d20+DEX (nemico)
  └─ phase = 'player_choice'

playerAction(skillId)
  ├─ Controlla: skill.unlockLevel <= charLevel
  ├─ Controlla: skill.mpCost <= playerMP
  ├─ 'fuggi' → tiro DES vs soglia nemico
  ├─ skill.healSelf → cura HP (damageDice + statMod)
  ├─ utility+self → applica status al giocatore
  ├─ utility+enemy → tiro per colpire → applica status al nemico
  └─ fisico/magico → tiro per colpire → danno → (statusApply) → _checkCombatEnd()

runEnemyTurn()
  ├─ _processStatusEffects(false): veleno, regen, stun
  ├─ Se stunned → salta turno
  └─ _runEnemyAI() → sceglie attacco o abilità speciale
       └─ tiro per colpire → danno / status al giocatore → _checkCombatEnd()
```

### Calcolo danni

```javascript
// Tiro per colpire
total = rollDice('1d20') + modifier(stat) + (hasProficiency ? proficiency : 0) + hitPenalty + blindPenalty
hit = (roll === 20) || (roll !== 1 && total >= CA)
critical = roll === 20

// Danno fisico/magico
baseDmg = rollDice(skill.damageDice) + skill.damageBonus + modifier(skill.stat)
if (critical) baseDmg *= 2
if (skill.divineDice) baseDmg += rollDice(skill.divineDice) + modifier(skill.divineStat)
if (magic_shield attivo) baseDmg = floor(baseDmg * 0.5)   // shield si consuma
```

### UI combattimento

- **Battlefield** (`.combat-battlefield`): sfondo dungeon scuro con scanlines, animazione `combatBob` su sprite giocatore e nemico
- **Sprite giocatore**: SVG dalla `cls.avatar` (lato sinistro)
- **Sprite nemico**: emoji grande (lato destro) — es. `👺`, `💀`, `🧙`
- **HUD**: barra HP (rossa con warning gialla) + barra MP (viola), badge status pill colorati
- **Griglia abilità**: `grid-template-columns: repeat(5, 1fr)` → 2 righe da 5 pulsanti
  - Abilità bloccate (`unlockLevel > charLevel`): classe CSS `.locked`, grigie, 🔒 + "Lv.X"
  - Abilità senza MP: `disabled` ma non `.locked`
- **Log**: ultimi 20 eventi, colorati per tipo (`hit`=giallo, `crit`=oro lampeggiante, `miss`=grigio, `status`=azzurro)
- **Modal risultato** (`#modal-combat-result`): tema CSS variabile per vittoria (oro), sconfitta (rosso), fuga (grigio)

### Aggiungere una nuova abilità di combattimento

1. **`data.js`** → Aggiungi oggetto in `COMBAT_SKILLS` con tutti i campi (incluso `unlockLevel` e `availableFor`)
2. Se l'abilità cura: aggiungi `healSelf: true` e `damageDice` con i dadi di cura
3. Se applica status: aggiungi `statusApply: 'id_effetto'`
4. Se nuovo tipo di effetto: aggiungi in `STATUS_EFFECTS` e gestisci in `_processStatusEffects()`
5. `game.js` — `playerAction()` già gestisce tutti i casi generici; aggiungi un branch solo per logiche speciali

---

## Minigiochi canvas

### Convezioni comuni

- **Delta time (dt)**: `Math.min((ts - lastTs) / 1000, 0.1)` — cappato a 100ms per evitare salti durante tab switch
- **requestAnimationFrame**: sempre salvato in `rafId` per poter essere cancellato
- **Scala canvas**: i canvas sono CSS-responsive (`width: 100%`) ma le coordinate interne sono fisse (es. 490×340). Si usa `getBoundingClientRect()` + ratio per mouse/touch
- **Particelle e trail**: array di oggetti con `t` (tempo vita) decrementato ogni frame, filtrati con `filter(p => p.t > 0)`

### Stabile (Guitar Hero) — dettagli implementativi

```javascript
// Note che scorrono
notes.push({ id, lane, y: 70, hit: false, missed: false });
// Ogni frame:
n.y += noteSpeed * dt;  // noteSpeed = 140 px/s
// Se n.y > HITLINE_Y + 40 → missed = true

// Hit detection al click del bottone
const dist = Math.abs(n.y - HITLINE_Y);
if (dist <= HIT_WINDOW) { /* hit! */ }  // HIT_WINDOW = 38px
```

### Conversione (Canvas 2D) — dettagli implementativi

```javascript
// Fedeli: cerchi con conv (0–1), colore interpolato grigio→oro
// SuperBlessed: conv=1 fisso, si muovono, aura pulsante
// Diavoli: convProgress (0–1), convFullTimer (0–2s), muoiono se fullTimer >= 2

// Velocità conversione scalata da equipaggiamento:
const speedMult = 1 + Game.getEquipmentAbilities().conversionSpeed;
const CONV_RATE = 0.52 * speedMult;
```

### Salva i Prigionieri (Top-down action) — dettagli implementativi

```javascript
// Struttura stato
this._rescue = {
  running: true,
  timer: 60,
  strengthBase: strBase,      // da classe + rescueStrengthBonus
  strength: strBase,          // scende per prossimità nemici, sale al salvataggio
  savedCount: 0,
  totalPrisoners: 10,         // 4 campi × (2+2+3+3)
  died: false,
  paladin: { x, y, destX, destY, speed: 145 },  // px/s
  camps: [...],               // 4 campi con enemies + prisoners
  particles: [],              // hit floaters, spark alla morte, +strength
  hitCooldown: {},            // id nemico → cooldown residuo (s)
};

// Struttura campo
camp = {
  id, cx, cy,
  enemies: [{ id, x, y, hp, maxHp, alive, flashT }],
  prisoners: [{ x, y, state }]  // state: 'guarded'|'freed'|'rescued'
}

// Movimento paladin
const dist = Math.hypot(destX - x, destY - y);
if (dist > 2) { x += (dx/dist) * speed * dt; }

// Proximity drain (per ogni nemico entro 92px)
strength -= 2.8 * nearCount * dt;
if (strength <= 0) → _endRescueGame() con died=true

// Danno per click (scala con prigionieri salvati)
const dmg = Math.max(1, 1 + Math.floor(savedCount / 2));
// 0 salvati = 1 dmg, 2 = 2 dmg, 4 = 3 dmg, ... 10 = 6 dmg

// Recupero forza al salvataggio
strength = Math.min(strength + 3, strengthBase + savedCount * 4);

// Hit detection: click su nemico entro raggio 22px
// se paladin entro 95px → attacco; altrimenti → movimento automatico verso nemico
// cooldown per click: 0.18s per nemico (evita spam)
```

**Render del paladino a cavallo** (`_drawRescuePaladin`):
- Disegno puramente canvas: cavallo marrone a 4 gambe, collo, testa, mane, coda
- Cavaliere: armatura blu con croce dorata sul petto, elmo oro, pennacchio rosso, scudo, spada
- Aura radiale oro scalata sulla forza attuale / forza base
- Badge forza sopra la testa: verde se >140% base, oro se normale, rosso se <4

---

## Sistema equipaggiamento e abilità

### getEquipmentAbilities()

Aggrega le abilità di tutti gli item equipaggiati:

```javascript
Game.getEquipmentAbilities() {
  const result = {
    pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0,
    goldBonus: 0, xpBonus: 0, missionBonus: 0,
    challengeBonus: 0, challengeRefresh: 0, diceRerollBonus: 0,
    studyBonus: 0, arenaBonus: 0, arenaDoubleHit: false,
    conversionBonus: 0, conversionSpeed: 0,
    stableBonus: 0, rescueBonus: 0, rescueStrengthBonus: 0,
  };
  for (const itemId of Object.values(this.state.character.equipment)) {
    if (!itemId) continue;
    const item = DB.items.find(i => i.id === itemId);
    if (!item?.abilities) continue;
    result.pickpocketBonus += item.abilities.pickpocketBonus || 0;
    // ... ecc per ogni campo ...
    result.arenaDoubleHit = result.arenaDoubleHit || !!(item.abilities.arenaDoubleHit);
  }
  return result;
}
```

**Nota**: i bonus numerici si **sommano**, i boolean si combinano con **OR**.

---

## Aggiungere nuove classi o meccaniche

### Checklist: nuova classe

1. **`data.js`** → Aggiungi oggetto in `CLASSES` con `id`, `name`, `proficiencies`, `avatar`, `startingGold` e flag meccaniche
2. **`data.js`** → Aggiungi eventuali missioni esclusive con `classMission: 'nuovaclasse'`
3. **`assets/`** → Aggiungi `nuovaclasse.svg` per l'avatar
4. **`index.html`** → Aggiungi bottone sidebar e/o tab nav con `d-none` + `id` descrittivo
5. **`js/ui.js`** → `updateClassConditionalUI()`: aggiungi `.toggle('d-none', !cls.hasNuovaFeature)`
6. **`js/ui.js`** → Aggiungi `renderNuovaFeatureBtn()` e chiamala in `refresh()`
7. **`js/game.js`** → `getEquipmentAbilities()`: aggiungi nuove abilità al result e alla loop
8. **`js/game.js`** → `newGame()`: aggiungi nuovi campi di stato
9. **`js/game.js`** → `init()`: aggiungi migrazioni per i nuovi campi
10. **`js/game.js`** → `nextDay()`: aggiungi reset dei nuovi contatori
11. **`js/game.js`** → Aggiungi metodi `nuovaFeatureRemaining()`, `startNuovaFeature()`, `applyNuovaFeatureResult()`
12. **`js/app.js`** → Aggiungi variabili stato minigioco come proprietà di `App`
13. **`js/app.js`** → `init()`: registra event listener per il bottone/modal
14. **`js/app.js`** → Aggiungi `_startNuovaFeature()`, `_nuovaFeatureLoop()`, `_drawNuovaFeature()`, `_endNuovaFeature()`
15. **`css/style.css`** → Aggiungi `.btn-nuovafeature` e stili specifici

### Checklist: nuova abilità oggetto

1. **`data.js`** → Aggiungi campo `nuovaAbilita: valore` all'`abilities` degli item che la hanno
2. **`js/game.js`** → `getEquipmentAbilities()`: aggiungi `nuovaAbilita: 0` al result e accumula nel loop
3. **Usa** `Game.getEquipmentAbilities().nuovaAbilita` ovunque ti serve

### Checklist: nuovo minigioco modal

1. Crea `<div class="modal fade" id="modal-XXX" data-bs-backdrop="static">` in `index.html`
2. In `app.js` init: `new bootstrap.Modal(document.getElementById('modal-XXX')).show()` al click del trigger
3. Gestisci `hidden.bs.modal` per fermare RAF e aggiornare UI: `document.getElementById('modal-XXX').addEventListener('hidden.bs.modal', () => { ... })`
4. Il bottone "Chiudi" nel risultato: `data-bs-dismiss="modal"` basta per chiudere Bootstrap Modal

---

## Note di sviluppo

### Performance canvas
- Usa `ctx.save()` / `ctx.restore()` per stati grafici complessi
- Il `dt` cappato a 0.1s evita "salti" di fisica quando la tab è in background
- Le particelle vengono filtrate ogni frame: non usare `splice` in loop, usa `filter`

### Gestione stato quotidiano
- **Mai** usare contatori negativi: usare sempre `Math.max(0, ...)`
- I contatori `xUsed` partono da 0 e vengono confrontati con `xPerDay + abilityBonus`
- La formula standard: `Math.max(0, cls.xPerDay + abilBonus - state.xUsed)`

### Ordinamento items nel DB
Gli item sono raggruppati per fascia di ID:
- 100–199: oggetti base (Tier 1)
- 200–299: oggetti livello medio (Tier 1–2)
- 300–399: oggetti avanzati (Tier 2)
- 400–499: oggetti rari (Tier 2–3)
- 500–599: oggetti epici (Tier 3)
- 600–699: oggetti epici/leggendari (Tier 3)
- 700–799: oggetti leggendari
- 800–899: oggetti speciali
- 900–999: oggetti sfide (challenge) e consumabili
- 1001–1109: oggetti classi speciali (Arena, Chierico, Paladino cavalcatura)
- 1110–1199: oggetti Paladino salvataggio (`rescueBonus`, `rescueStrengthBonus`)
- 901–910: consumabili (istantanei e boost)

---

*Per domande o contributi, apri una issue o una PR sul repository.*
