# 📜 Guida al Gioco — BadHeroSimulator

## Indice

1. [Creazione del personaggio](#creazione-del-personaggio)
2. [Statistiche e prove](#statistiche-e-prove)
3. [Il ciclo quotidiano](#il-ciclo-quotidiano)
4. [Missioni](#missioni)
5. [Fama e Taglia](#fama-e-taglia)
6. [XP e Livelli](#xp-e-livelli)
7. [Equipaggiamento e Mercato](#equipaggiamento-e-mercato)
8. [Sfide giornaliere](#sfide-giornaliere)
9. [Classi e minigiochi](#classi-e-minigiochi)
10. [Sistemi di crafting](#sistemi-di-crafting)
11. [Oggetti consumabili e boost](#oggetti-consumabili-e-boost)
12. [Condizioni di fine partita](#condizioni-di-fine-partita)

---

## Creazione del personaggio

All'avvio scegli:

1. **La classe** — determina proficienze, abilità speciali e oro iniziale
2. **Il nome** del tuo personaggio
3. **Le statistiche** — vengono tirate automaticamente (4d6, si scarta il dado più basso), poi assegni liberamente i valori alle 6 statistiche

### Le 6 statistiche (stile D&D)

| Stat | Abbreviazione | Usata per |
|------|---------------|-----------|
| Forza | FOR | Combattimento fisico, sforzi bruti |
| Destrezza | DES | Furtività, velocità, precisione |
| Costituzione | COS | Resistenza, prove fisiche |
| Intelligenza | INT | Conoscenza, enigmi, arcano |
| Saggezza | SAG | Percezione, intuizione, natura |
| Carisma | CAR | Persuasione, inganno, presenza |

Il **modificatore** di ogni statistica è `(valore - 10) / 2` arrotondato per difetto.

### Proficienze di classe

Ogni classe è competente in 3 statistiche. Quando usi una statistica in cui sei proficiente, aggiungi il **bonus di competenza** (inizialmente +2, aumenta a +3 al livello 5 e +4 al livello 9) al tiro.

---

## Statistiche e prove

Ogni prova usa un **tiro D20** con questo calcolo:

```
Risultato = D20 + modificatore stat + (bonus competenza se proficiente)
```

Confrontato con la **DC (Difficulty Class)** della missione:

| Esito | Condizione |
|-------|-----------|
| **Successo pieno** | Risultato ≥ DC |
| **Successo parziale** | Risultato ≥ DC − 5 |
| **Fallimento** | Risultato < DC − 5 |
| **Naturale 20** | D20 = 20 → successo automatico con bonus |
| **Naturale 1** | D20 = 1 → fallimento automatico |

---

## Il ciclo quotidiano

Ogni "giorno" in gioco è un turno completo. Al clic di **"Avanza al giorno successivo"**:

### 1. Tassa alla Gilda
Devi pagare una tassa giornaliera automatica basata su livello e fama.
- **Se hai abbastanza oro**: la tassa viene detratta
- **Se non hai oro**: perdi fama invece (15 + livello × 2 punti fama)
- **Se la fama scende a 0**: **Game Over**

### 2. Reset dei contatori giornalieri
Tutti i limiti d'uso si azzerano: borseggi, studi, preghiere, arena, cavalcatura, conversioni, bevute, missioni completate.

### 3. Nuovi contenuti generati
- Missioni giornaliere (filtrate per classe e livello di fama)
- Oggetti al mercato
- Sfide del giorno
- Richieste clienti (Druido, Mago, Chierico)

### 4. Boost attivi decrementati
I potenziamenti temporanei perdono un giorno di durata. Quelli scaduti vengono rimossi.

---

## Missioni

Le missioni sono il cuore del gioco. Ogni giorno hai un pool di **2–4 missioni** completabili (aumentabili con equipaggiamento).

### Tier e requisiti di fama

| Tier | Fama minima | Difficoltà DC | Ricompense |
|------|-------------|---------------|------------|
| 1 | 0+ | 11–13 | Basse |
| 2 | 50+ | 13–16 | Medie |
| 3 | 150+ | 16–18 | Alte |

### Come completare una missione

1. Clicca su una missione disponibile
2. Scegli un **approccio** (ognuno usa una statistica diversa)
3. Il gioco tira automaticamente il D20 e mostra il risultato
4. Ottieni le ricompense in base all'esito

### Ricompense missione
- **XP** (50–600 a missione)
- **Oro** (8–600 mo)
- **Fama XP** (piccola quantità per completamento)
- **Oggetti** (chance variabile, tier coerente con la missione)
- **Ingredienti/componenti** (classi crafting)

### Missioni esclusive di classe
Alcune classi hanno missioni tematiche dedicate che compaiono nel loro pool:
- 🔮 **Mago**: grimori perduti, portali instabili, necromanti
- 🌿 **Druido**: creature ferite, boschi corrotti, spiriti ancestrali
- ⚔️ **Guerriero**: scorte, tornei, prigionieri da liberare

---

## Fama e Taglia

### Fama (tutte le classi)
- Parte da **10**
- Sblocca missioni di tier superiore (50 per Tier 2, 150 per Tier 3)
- Aumenta con missioni, sfide, minigiochi
- **Livelli di fama:**

| Punti | Titolo |
|-------|--------|
| 0 | Sconosciuto |
| 50 | Conosciuto |
| 120 | Rispettato |
| 220 | Noto |
| 380 | Temuto |
| 600 | Famigerato |
| 900 | Infame |
| 1.300 | Leggendario |
| 1.800 | Immortale |
| 2.500 | Il Fantasma |

### Taglia (solo Ladro) / Visibilità (altre classi)
Misura quanto sei "sul radar" delle autorità o dei nemici.

- **Ladro**: la Taglia sale con azioni criminali, attira cacciatori di taglie
- **Altre classi**: la Visibilità aumenta con la fama, attira ladri e aggressori

Se Taglia/Visibilità supera certi soglie, ogni avanzamento di giorno può generare un **evento ostile** da risolvere prima di procedere.

---

## XP e Livelli

### Livello massimo: 10

### Tabella XP (cumulativa)

| Da Lv → A Lv | XP necessari |
|---|---|
| 1 → 2 | 300 |
| 2 → 3 | 900 |
| 3 → 4 | 2.700 |
| 4 → 5 | 6.500 |
| 5 → 6 | 14.000 |
| 6 → 7 | 23.000 |
| 7 → 8 | 34.000 |
| 8 → 9 | 48.000 |
| 9 → 10 | 64.000 |

### Level Up
Al level up scegli **2 statistiche** da aumentare di +1. Il bonus di competenza aumenta automaticamente ai livelli 5 e 9.

---

## Equipaggiamento e Mercato

### Slot equipaggiamento (8 slot)

`Testa` · `Guanti` · `Gambe` · `Torso` · `Stivali` · `Anello sx` · `Anello dx` · `Arma`

Più uno slot **Consumabile** nell'inventario.

### Qualità oggetti

| Qualità | Colore | Caratteristiche |
|---------|--------|-----------------|
| ⚪ Comune | Grigio | Bonus base |
| 🟢 Non Comune | Verde | Bonus migliori |
| 🔵 Raro | Blu | Bonus significativi + abilità |
| 🟣 Epico | Viola | Abilità potenti |
| 🟠 Leggendario | Arancio | Abilità uniche e rare |

### Abilità degli oggetti
Gli oggetti equipaggiati possono conferire abilità speciali:

| Abilità | Effetto |
|---------|---------|
| `pickpocketBonus` | +N tentativi di borseggio/giorno |
| `rerollBonus` | +N rilanci missione/giorno |
| `missionBonus` | +N missioni completabili/giorno |
| `taxDiscount` | Riduce la tassa giornaliera del X% |
| `goldBonus` | +X% oro da tutte le fonti |
| `xpBonus` | +X% XP da tutte le fonti |
| `challengeBonus` | +N sfide attive contemporaneamente |
| `studyBonus` | +N studi/giorno (Mago/Druido) |
| `arenaBonus` | +N sessioni arena/giorno (Guerriero) |
| `arenaDoubleHit` | Ogni click in arena fa 2 danni |
| `conversionBonus` | +N sessioni conversione/giorno (Chierico) |
| `conversionSpeed` | +X% velocità di conversione (Chierico) |
| `stableBonus` | +N sessioni cavalcatura/giorno (Paladino) |
| `rescueBonus` | +N sessioni "Salva i Prigionieri"/giorno (Paladino) |
| `rescueStrengthBonus` | +N Forza iniziale nel minigioco salvataggio (Paladino) |

### Mercato
- Si aggiorna ogni giorno con **6–8 oggetti**
- Puoi comprare e vendere (prezzo di rivendita ~40% del prezzo d'acquisto)
- Alcuni oggetti richiedono livello minimo o statistiche minime per essere equipaggiati

---

## Sfide giornaliere

Ogni giorno hai **3 sfide attive** (aumentabili con equipaggiamento). Completarle dà ricompense bonus.

**Tipi di sfida:**
- Completa missioni con una specifica statistica
- Completa N missioni in un giorno
- Raggiungi un certo livello di fama/oro
- Indossa oggetti di una certa qualità
- Ottieni un naturale 20 in una prova
- Acquista/vendi oggetti al mercato

Puoi **rifiutare e sostituire** una sfida se hai l'abilità `challengeRefresh` sull'equipaggiamento.

---

## Classi e minigiochi

### 🗡️ Ladro

#### Borseggio
- **1 tentativo/giorno** (+ bonus oggetti)
- Mini-gioco di timing: appare un bersaglio, devi cliccare al momento giusto
- Fallire non costa nulla, ma sprechi il tentativo

#### Gioco dei Dadi
- Sfida un NPC casuale su un lancio di dadi
- Scegli la puntata, poi si tirano i dadi
- Puoi usare rilanci bonus (da equipaggiamento)

#### Sistema Taglia
- La taglia sale compiendo azioni criminali
- Sopra certi livelli appare un **cacciatore di taglie** da affrontare ogni giorno
- Vincere: guadagni fama, la taglia si dimezza
- Perdere: perdi oro, la taglia aumenta

---

### ⚔️ Guerriero

#### Arena (2 sessioni/giorno)
- Sopravvivi il più a lungo possibile contro ondate di nemici
- **Clicca sui nemici** per colpirli, ogni nemico ha HP variabili
- Se un nemico ti tocca: game over della sessione
- Nemici: Goblin (1 HP) → Orco (3) → Troll (6) → Drago (9) → Lich (12)
- Ricompensa proporzionale al numero di uccisioni

> 💡 Con la *Spada dei Campioni dell'Arena* ogni click fa **2 danni** invece di 1

#### Gara di Bevute
- 3 round contro un avversario NPC
- Mini-gioco: un boccale con livello del liquido che oscilla; clicca **"Bevi!"** quando il liquido è nella zona target
- La zona target si restringe ad ogni round (effetto ubriachezza crescente)
- Vinci 2 round su 3 → tiro COS finale scala la ricompensa

---

### 🔮 Mago

#### Studia (2 volte/giorno)
- Mini-gioco memory: griglia 4×4 di simboli arcani da abbinare in coppia
- Hai **90 secondi** e massimo **8 errori**
- Ricompensa dipende da errori commessi e tempo rimanente
- Premia anche **ingredienti/componenti** per il crafting

#### Tab Incantesimi
- Combina componenti per creare incantesimi
- Vendi gli incantesimi a clienti NPC o tienili in inventario
- Richieste clienti si aggiornano ogni giorno

---

### 🛡️ Paladino

#### Accudisci Cavalcatura (2 volte/giorno)
- Mini-gioco **Guitar Hero**: 5 corsie con icone che scorrono dall'alto verso il basso
- Una **riga luminosa** indica il momento perfetto
- Clicca il bottone corrispondente quando l'icona tocca la riga

| Corsia | Bisogno | Colore |
|--------|---------|--------|
| 🌾 | Paglia | Oro |
| 🪮 | Spazzola | Verde |
| 🐎 | Corsa | Arancio |
| 🥕 | Carote | Rosso |
| 💧 | Acqua | Blu |

- **Barre Salute e Felicità** del cavallo crescono con ogni hit corretta
- **Punteggio finale** = media di Salute + Felicità
- Soglie ricompensa: ≥85% eccellente · ≥65% buona · ≥50% sufficiente · <50% nulla

#### Salva i Prigionieri (2 volte/giorno)
- Mini-gioco **top-down action** su canvas 520×320: il Paladino a cavallo (disegnato a mano) si muove in una mappa dungeon
- **Clicca sulla mappa** per muovere il paladino verso quel punto
- **6 campi prigionieri** distribuiti sulla mappa (3 in alto, 3 in basso), ognuno difeso da nemici che **pattugliando** continuamente il loro campo

| Campo | Posizione | Nemici | HP nemico | Prigionieri |
|-------|-----------|--------|-----------|-------------|
| 1 | Alto sx | 2 | 3 HP | 2 |
| 2 | Alto centro | 2 | 3 HP | 2 |
| 3 | Alto dx | 2 | 4 HP | 2 |
| 4 | Basso sx | 3 | 5 HP | 3 |
| 5 | Basso centro | 3 | 6 HP | 3 |
| 6 | Basso dx | 3 | 8 HP | 3 |

- **Clicca un nemico** (entro raggio 95px dal paladino) per attaccarlo
  - Troppo lontano? Il paladino si muove automaticamente verso il nemico
  - **Danno per click** scala con i salvati: 1 dmg (inizio) → 2 → 3 → 4 → 5 → 6 (max)
- **Forza ⚡** visibile sopra il paladino: si svuota **-2.8/s** per ogni nemico nelle vicinanze
  - Se raggiunge 0 → **sconfitta immediata**
- Quando tutti i nemici di un campo sono eliminati → i prigionieri corrono verso il paladino e si uniscono a lui (+3 forza ciascuno)
- Un cerchio tratteggiato oro mostra il raggio d'attacco attivo
- **Durata:** 60 secondi

#### ⚡ Giusto Potere! (abilità automatica)
- Si ricarica ogni **10 secondi**; quando pronta si **attiva automaticamente** per **3 secondi**
- Durante l'attivazione: ogni **0,5 secondi** infligge danno a tutti i nemici nel raggio d'attacco
- Un arco dorato attorno al paladino mostra il progresso della ricarica
- La scritta **"⚡ Giusto Potere! ⚡"** appare in basso durante l'attivazione

#### 👑 Boss Finale
- Quando **tutti e 6 i campi** sono stati liberati, un **boss** appare al centro della mappa
- Il boss è più grande, ha **28 HP** e pattuglia il centro
- Sconfiggere il boss sblocca il tier **Leggendario** (ricompensa massima)

**Soglie di ricompensa:**

| % prigionieri salvati | Boss | Tier | XP | Oro | Fama |
|---|---|---|---|---|---|
| ≥ 80% + boss sconfitto | ✅ | 👑 Leggendario | 380 | 140 | 28 |
| ≥ 80% | — | 🏆 Glorioso | 250 + lv×10 | 90 + lv×3 | 18 |
| ≥ 60% | — | ✅ Buono | 160 + lv×10 | 55 + lv×3 | 11 |
| ≥ 40% | — | ⚔️ Parziale | 90 + lv×10 | 28 + lv×3 | 5 |
| < 40% o morte | — | 😔 Fallimento | — | — | — |

> 💡 Gli oggetti con `rescueStrengthBonus` aumentano la **Forza iniziale**; quelli con `rescueBonus` aggiungono **sessioni extra** al giorno.

---

### 🌿 Druido

#### Studia (2 volte/giorno)
*Identico al Mago, vedi sopra.*

#### Tab Pozioni
- **Laboratorio**: seleziona 2–3 ingredienti → "Mescola" → ricetta valida crea pozione
- Ingredienti sbagliati: consumati, +15 XP per la sperimentazione
- **Inventario ingredienti**: ottenuti da missioni e Studia
- **Richieste clienti**: consegna la pozione giusta per oro extra

---

### ✝️ Chierico

#### Prega (2 volte/giorno)
- Mini-gioco: sfera luminosa scorre il percorso, mantieni alta la **barra devozione**
- Clicca **"Amen!"** durante la **grazia** (flash dorato) per guadagnare devozione
- Clicca **"Scaccia!"** quando appare un **demone/non-morto** entro 2.4 secondi
- Click errati penalizzano: −18 devozione
- La barra drena velocemente durante grazia e presenza demoniaca
- Ricompensa scalata sulla devozione finale (%)

#### Conversione (2 volte/giorno)
- Mini-gioco canvas: guida il Chierico (croce luminosa) muovendo il mouse
- **Fedeli grigi** si convertono (diventano dorati) se li tocchi con l'aura
- **SuperBenedetti** ⭐: fedeli a conversione massima per 2 secondi → si muovono da soli, non decadono, convertono i vicini
- **Demoni** 😈: tolgono fede ai fedeli vicini; avvicinarsi li converte progressivamente → a 100% per 2s scompaiono
- Nuovi demoni appaiono ogni ~10 secondi
- Ricompensa basata sulla % media di conversione

---

## Sistemi di crafting

### Ingredienti e Pozioni (Druido · Chierico)

**50 ingredienti** in 5 tier di qualità (da erba di campo a lacrima del mondo).

**25 ricette** di pozioni: ognuna richiede 3 ingredienti specifici. Qualità 1–5.

**Come ottenere ingredienti:**
- Completare missioni (chance ~30–50%)
- Mini-gioco Studia (1–2 ingredienti per sessione)

**Come craftare:**
1. Vai al Tab Pozioni
2. Clicca sugli ingredienti per aggiungerli agli slot (max 3)
3. Clicca "Mescola"
4. Se la combinazione è valida → pozione creata in inventario
5. Consegna ai clienti NPC per la ricompensa piena

---

### Componenti e Incantesimi (Mago · Chierico)

Sistema identico a Pozioni ma con componenti arcane (50 tipi) e incantesimi (25 ricette).

---

## Oggetti consumabili e boost

### Consumabili istantanei
Usabili una volta sola, effetto immediato:
- **+XP** (es. Pergamena dell'Erudito: +180 XP)
- **+Oro** (es. Borsa del Mendicante: +40 mo)
- **+Fama** (es. Medaglione della Gilda: +15 fama)

### Boost temporanei
Durano 2–5 giorni, effetto moltiplicativo:
- **+XP%** (es. Estratto di Concentrazione: +30% XP per 3 giorni)
- **+Oro%** (es. Elisir della Fortuna: +25% oro per 2 giorni)
- **+Fama%** (es. Incenso della Reputazione: +25% fama per 3 giorni)
- Non puoi avere due boost dello stesso tipo attivi contemporaneamente

---

## Condizioni di fine partita

### Game Over 💀
La partita termina se la **fama scende a 0 o meno**.

Questo può accadere per:
- Non riuscire a pagare la tassa giornaliera per molti giorni consecutivi
- Perdere fama in eventi ostili senza recuperarla

### Nuova partita
Puoi sempre azzerare il salvataggio e ricominciare da capo con un nuovo personaggio.

---

## Consigli per sopravvivere

1. **Completa sempre le sfide giornaliere** — sono la fonte di XP e oro più costante
2. **Equipaggia oggetti con `missionBonus`** — completare più missioni al giorno accelera la crescita
3. **Non ignorare i minigiochi di classe** — danno XP extra preziosa nelle prime sessioni
4. **Tieni sempre abbastanza oro** per la tassa — perdere fama è pericoloso
5. **Tier 2 missioni a 50 fama** sono molto più remunerative: sbloccarle presto è una priorità
6. **I boost temporanei si sommano** agli oggetti: usali nelle sessioni intensive

---

*Buona fortuna, eroe mediocre. Ne avrai bisogno.*
