# ⚔️ BadHeroSimulator

> *Sei un eroe mediocre in un mondo crudele. Sopravvivi, accumula fama, e cerca di non fare troppi danni.*

BadHeroSimulator è un gioco RPG testuale a turni giocabile nel browser, ambientato in un'estetica dark fantasy. Ogni giorno avanzi compiendo missioni, gestendo le tue risorse e cercando di non perdere la testa — nel senso letterale del termine.

---

## 🎮 Di cosa si tratta

Un simulatore di vita da "eroe non proprio eroico" in cui:

- Scegli una **classe** tra 6 disponibili, ognuna con meccaniche uniche
- Compi **missioni** usando le tue statistiche (D&D-style, tiro D20)
- Accumuli **fama**, **oro** e **esperienza** per crescere di livello
- Gestisci **equipaggiamento**, **inventario** e le avventure quotidiane
- Ogni classe ha **minigiochi esclusivi** pensati per il suo stile di vita

Il gioco è in **italiano**, con un tono ironico e narrativo.

---

## 🏰 Classi disponibili

| Classe | Stile | Meccaniche esclusive |
|--------|-------|----------------------|
| 🗡️ **Ladro** | Furtivo, ingannevole | Borseggio, Gioco dei Dadi, Sistema Taglia |
| ⚔️ **Guerriero** | Brutale, resistente | Arena (2/giorno), Gara di Bevute |
| 🔮 **Mago** | Arcano, studioso | Studia (memory game), Tab Incantesimi |
| 🛡️ **Paladino** | Onorevole, fiero | Accudisci Cavalcatura (Guitar Hero), Salva i Prigionieri (top-down action) |
| 🌿 **Druido** | Naturale, alchimico | Studia, Tab Pozioni, ingredienti da missioni |
| ✝️ **Chierico** | Devoto, carismatico | Preghiera, Conversione (evangelizzazione) |

---

## 🔄 Il ciclo quotidiano

1. **Compi missioni** — scegli un approccio, tira i dadi, raccogli ricompense
2. **Usa le abilità di classe** — minigiochi esclusivi per XP e oro extra
3. **Gestisci l'equipaggiamento** — acquista al mercato, vesti, potenzia le statistiche
4. **Completa le sfide** — obiettivi giornalieri per bonus aggiuntivi
5. **Avanza al giorno successivo** — paga la tassa alla gilda e ricomincia

---

## 🚀 Come avviare

Il gioco è interamente client-side. Non richiede installazione né server.

```bash
# Clona il repository
git clone https://github.com/whiteseraph83/BadHeroSimulator.git

# Apri index.html nel browser
open index.html
```

Oppure apri semplicemente `index.html` con qualsiasi browser moderno.

**Requisiti:** Browser con supporto ES6+ (Chrome, Firefox, Edge, Safari moderni).

---

## 💾 Salvataggio

Il gioco salva automaticamente in **localStorage** del browser dopo ogni azione.
Non serve un account o una connessione internet.

---

## 🎨 Temi

L'interfaccia supporta **tema scuro** (default) e **tema chiaro**, selezionabili dall'icona ☀️/🌙 in alto a destra.

---

## 📁 Struttura del progetto

```
BadHeroSimulator/
├── index.html          # UI principale e layout
├── css/
│   └── style.css       # Tema dark/light, animazioni, componenti
├── js/
│   ├── data.js         # Database: classi, missioni, oggetti, ricette
│   ├── game.js         # Logica di gioco: stato, dadi, XP, salvataggio
│   ├── ui.js           # Rendering DOM e aggiornamento interfaccia
│   └── app.js          # Entry point: eventi, minigiochi, coordinamento
└── assets/
    └── *.svg           # Avatar delle classi
```

---

## 📖 Documentazione

- [`GAMEPLAY.md`](GAMEPLAY.md) — Regole, meccaniche e guida al gioco
- [`TECHNICAL.md`](TECHNICAL.md) — Architettura tecnica e riferimento per sviluppatori

---

## 🛠️ Tecnologie

- **Vanilla JavaScript** — nessun framework, nessuna dipendenza esterna
- **Bootstrap 5** — layout e componenti UI
- **Bootstrap Icons** — iconografia
- **HTML5 Canvas** — rendering dei minigiochi
- **localStorage** — persistenza del salvataggio
- **Google Fonts** — Cinzel + Crimson Text per il tema fantasy

---

*Sviluppato con ❤️ e un pizzico di caos.*
