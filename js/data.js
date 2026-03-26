/* ============================================================
   data.js — Database: missioni (30), oggetti (40), costanti
   ============================================================ */

const QUALITY = {
  1: { name: 'Comune',     color: '#95a5a6', cls: 'q-comune'     },
  2: { name: 'Non Comune', color: '#27ae60', cls: 'q-noncomune'  },
  3: { name: 'Raro',       color: '#2980b9', cls: 'q-raro'       },
  4: { name: 'Epico',      color: '#8e44ad', cls: 'q-epico'      },
  5: { name: 'Leggendario',color: '#e67e22', cls: 'q-leggendario'}
};

const SLOT_META = {
  head:      { icon: '🪖', label: 'Testa',       bi: 'bi-person-badge'    },
  gloves:    { icon: '🧤', label: 'Guanti',       bi: 'bi-hand-index'      },
  legs:      { icon: '🦿', label: 'Gambe',        bi: 'bi-person-standing' },
  torso:     { icon: '🥋', label: 'Torso',        bi: 'bi-shield-shaded'   },
  boots:     { icon: '👢', label: 'Stivali',      bi: 'bi-arrow-down-up'   },
  ring:      { icon: '💍', label: 'Anello',        bi: 'bi-circle'          },
  ringRight: { icon: '💍', label: 'Anello',        bi: 'bi-circle'          },
  ringLeft:  { icon: '💍', label: 'Anello',        bi: 'bi-circle-fill'     },
  weapon:     { icon: '🗡️',  label: 'Arma',         bi: 'bi-scissors'       },
  consumable: { icon: '⚗️',  label: 'Consumabile',  bi: 'bi-flask-fill'     },
};

/* ── NOMI NPC GIOCO DADI ─────────────────────────────────── */
const DICE_NPC_NAMES = [
  'Bardo Ronin', 'Nana Harpell', 'Il Goblin Grasso', 'Mercante Brunn',
  'Capitano Vex', 'Strega Ilda', 'Nano Thorek', 'Elfo Aerindel',
  'La Volpe', 'Zingaro Teto', 'Spia Morenna', 'Cavaliere Senza Nome',
  'Taverniere Brog', 'Maga Sylvara', 'Contrabbandiere Fen',
];

/* ── LIVELLI TAGLIA ──────────────────────────────────────── */
const WANTED_LEVELS = [
  { min: 0,   label: 'Pulito',          color: '#52b788', icon: '😊' },
  { min: 15,  label: 'Sospettato',      color: '#e9c46a', icon: '👀' },
  { min: 40,  label: 'Ricercato',       color: '#f4a261', icon: '⚠️' },
  { min: 80,  label: 'Molto Ricercato', color: '#e76f51', icon: '🚨' },
  { min: 150, label: 'Taglia Alta',     color: '#c0392b', icon: '💀' },
];

const WANTED_NARRATIVES = [
  "Un sicario si para davanti a te nel vicolo buio. Nessun testimone, nessuna via di fuga.",
  "Il cacciatore di taglie ti ha finalmente trovato. Occhi freddi, spada sguainata.",
  "Un guerriero corazzato ti blocca l'uscita. Vuole la tua testa — e la taglia che ne consegue.",
  "Passi pesanti ti rincorrono nei vicoli. Quando ti volti, vedi l'armatura di un bounty hunter.",
  "Una figura incappucciata salta dal tetto. La tua taglia è diventata troppo appetitosa.",
];

/* ── POOL SFIDE ──────────────────────────────────────────── */
const CHALLENGE_POOL = [
  { id: 1,  type: 'mission_stat',       desc: 'Completa una missione con una prova di Forza',        icon: '💪', condition: { stat: 'str' },          reward: { xp: 90,  gold: 40,  fame: 6  } },
  { id: 2,  type: 'mission_stat',       desc: 'Completa una missione con una prova di Destrezza',    icon: '🤸', condition: { stat: 'dex' },          reward: { xp: 60,  gold: 25,  fame: 4  } },
  { id: 3,  type: 'mission_stat',       desc: 'Completa una missione con una prova di Intelligenza', icon: '🧠', condition: { stat: 'int' },          reward: { xp: 70,  gold: 30,  fame: 5  } },
  { id: 4,  type: 'mission_stat',       desc: 'Completa una missione con una prova di Carisma',      icon: '🗣️', condition: { stat: 'cha' },          reward: { xp: 70,  gold: 30,  fame: 5  } },
  { id: 5,  type: 'mission_stat',       desc: 'Completa una missione con una prova di Saggezza',     icon: '🦉', condition: { stat: 'wis' },          reward: { xp: 80,  gold: 35,  fame: 6  } },
  { id: 6,  type: 'mission_stat',       desc: 'Completa una missione con una prova di Costituzione', icon: '🛡️', condition: { stat: 'con' },          reward: { xp: 80,  gold: 35,  fame: 6  } },
  { id: 7,  type: 'mission_tier',       desc: 'Completa una missione di Tier 2 o superiore',         icon: '⭐', condition: { tier: 2 },              reward: { xp: 100, gold: 45,  fame: 8  } },
  { id: 8,  type: 'mission_tier',       desc: 'Completa una missione di Tier 3',                     icon: '🌟', condition: { tier: 3 },              reward: { xp: 180, gold: 80,  fame: 18 } },
  { id: 9,  type: 'complete_missions',  desc: 'Completa almeno 2 missioni oggi',                     icon: '📋', condition: { count: 2 },             reward: { xp: 100, gold: 50,  fame: 8  } },
  { id: 10, type: 'pickpocket_success', desc: 'Esegui un borseggio con successo',                    icon: '🖐️', condition: {},                       reward: { xp: 60,  gold: 30,  fame: 4  }, classRestrict: 'ladro' },
  { id: 11, type: 'wear_quality',       desc: 'Indossa almeno 3 oggetti di qualsiasi rarità',        icon: '👜', condition: { quality: 1, count: 3 }, reward: { xp: 60,  gold: 20,  fame: 4  } },
  { id: 12, type: 'wear_quality',       desc: 'Indossa almeno 2 oggetti Non Comuni o superiori',     icon: '💚', condition: { quality: 2, count: 2 }, reward: { xp: 90,  gold: 40,  fame: 7  } },
  { id: 13, type: 'wear_quality',       desc: 'Indossa almeno 1 oggetto Raro o superiore',           icon: '💙', condition: { quality: 3, count: 1 }, reward: { xp: 120, gold: 55,  fame: 10 } },
  { id: 14, type: 'wear_quality',       desc: 'Indossa almeno 1 oggetto Epico o superiore',          icon: '💜', condition: { quality: 4, count: 1 }, reward: { xp: 200, gold: 100, fame: 20 } },
  { id: 15, type: 'reach_fame',         desc: 'Raggiungi 50 punti fama',                             icon: '👁️', condition: { fame: 50 },             reward: { xp: 60,  gold: 20,  fame: 0  } },
  { id: 16, type: 'reach_fame',         desc: 'Raggiungi 150 punti fama',                            icon: '👁️', condition: { fame: 150 },            reward: { xp: 120, gold: 40,  fame: 0  } },
  { id: 17, type: 'reach_fame',         desc: 'Raggiungi 300 punti fama',                            icon: '👁️', condition: { fame: 300 },            reward: { xp: 200, gold: 80,  fame: 0  } },
  { id: 18, type: 'gold_above',         desc: 'Accumula almeno 200 monete d\'oro',                   icon: '💰', condition: { gold: 200 },            reward: { xp: 70,  gold: 0,   fame: 7  } },
  { id: 19, type: 'gold_above',         desc: 'Accumula almeno 500 monete d\'oro',                   icon: '💰', condition: { gold: 500 },            reward: { xp: 130, gold: 0,   fame: 12 } },
  { id: 20, type: 'gold_below',         desc: 'Spendi fino ad avere meno di 50 monete d\'oro',       icon: '🪙', condition: { gold: 50 },             reward: { xp: 100, gold: 90,  fame: 5  } },
  { id: 21, type: 'reach_level',        desc: 'Raggiungi il livello 3',                              icon: '📈', condition: { level: 3 },             reward: { xp: 250, gold: 80,  fame: 20 } },
  { id: 22, type: 'reach_level',        desc: 'Raggiungi il livello 5',                              icon: '📈', condition: { level: 5 },             reward: { xp: 400, gold: 150, fame: 35 } },
  { id: 23, type: 'mission_nat20',      desc: 'Ottieni un 20 naturale in una prova di missione',     icon: '🎯', condition: {},                       reward: { xp: 150, gold: 60,  fame: 15 } },
  { id: 24, type: 'buy_item',           desc: 'Acquista un oggetto dal Mercato',                icon: '🛒', condition: {},                       reward: { xp: 50,  gold: 0,   fame: 5  } },
  { id: 25, type: 'complete_missions',  desc: 'Completa almeno 1 missione oggi',                     icon: '📋', condition: { count: 1 },             reward: { xp: 40,  gold: 15,  fame: 3  } },
  { id: 26, type: 'sell_item',          desc: 'Vendi un oggetto Comune',                             icon: '🪙', condition: { quality: 1 },           reward: { xp: 40,  gold: 20,  fame: 3  } },
  { id: 27, type: 'sell_item',          desc: 'Vendi un oggetto Non Comune',                         icon: '💚', condition: { quality: 2 },           reward: { xp: 70,  gold: 35,  fame: 6  } },
  { id: 28, type: 'sell_item',          desc: 'Vendi un oggetto Raro',                               icon: '💙', condition: { quality: 3 },           reward: { xp: 110, gold: 55,  fame: 10 } },
  { id: 29, type: 'sell_item',          desc: 'Vendi un oggetto Epico',                              icon: '💜', condition: { quality: 4 },           reward: { xp: 180, gold: 90,  fame: 18 } },
  { id: 30, type: 'sell_item',          desc: 'Vendi un oggetto Leggendario',                        icon: '🟠', condition: { quality: 5 },           reward: { xp: 300, gold: 150, fame: 30 } },
];

/* ── CLASSI PERSONAGGIO ──────────────────────────────────── */
const CLASSES = [
  {
    id: 'ladro',
    name: 'Ladro',
    desc: 'Maestro del furto e dell\'inganno. Vive nell\'ombra, colpisce nel silenzio.',
    proficiencies: ['dex', 'int', 'cha'],
    avatar: 'ladro.svg',
    hasPickpocket: true,
    hasDiceGame: true,
    startingGold: 30,
  },
  {
    id: 'guerriero',
    name: 'Guerriero',
    desc: 'Combattente provato. La forza è il suo argomento, la resistenza il suo capitale.',
    proficiencies: ['str', 'con', 'dex'],
    avatar: 'guerriero.svg',
    hasPickpocket: false,
    hasDiceGame: true,
    startingGold: 50,
  },
  {
    id: 'mago',
    name: 'Mago',
    desc: 'Studioso dell\'arcano. La conoscenza vale più di qualsiasi spada.',
    proficiencies: ['int', 'wis', 'cha'],
    avatar: 'mago.svg',
    hasPickpocket: false,
    hasDiceGame: false,
    startingGold: 20,
    hasStudy: true,
    hasSpellTab: true,
    studyPerDay: 2,
  },
  {
    id: 'paladino',
    name: 'Paladino',
    desc: 'Campione giurato. La sua fede è la sua armatura, il suo onore la sua lama.',
    proficiencies: ['str', 'cha', 'con'],
    avatar: 'paladino.svg',
    hasPickpocket: false,
    hasDiceGame: false,
    startingGold: 40,
  },
  {
    id: 'druido',
    name: 'Druido',
    desc: 'Custode della natura. Legge il vento, parla con le bestie, piega il mondo selvatico.',
    proficiencies: ['wis', 'int', 'con'],
    avatar: 'druido.svg',
    hasPickpocket: false,
    hasDiceGame: false,
    startingGold: 25,
    hasStudy: true,
    hasPotioniTab: true,
    studyPerDay: 2,
  },
  {
    id: 'chierico',
    name: 'Chierico',
    desc: 'Servo di una divinità. La sua devozione porta guarigione, ma anche devastazione.',
    proficiencies: ['wis', 'cha', 'con'],
    avatar: 'chierico.svg',
    hasPickpocket: false,
    hasDiceGame: false,
    startingGold: 35,
  },
];

const DB = {

  /* ── MISSIONI ─────────────────────────────────────────── */
  missions: [

    /* ═══════════════  TIER 1 — Sconosciuto (0+ fama) ═══════════════ */
    {
      id: 1, tier: 1, minFame: 0, classRestrict: 'ladro',
      name: "Borseggio al Mercato",
      desc: "Il mercato è affollato. Un mercante grasso tiene la borsa al cinturone. È il momento giusto.",
      type: "furto",
      approaches: [
        { label: "Mano lesta", stat: "dex", dc: 11,
          successText: "Le dita scivolano veloci. La borsa è tua prima che lui finisca di contrattare.",
          partialText: "Prendi metà del contenuto prima di sentire una mano sulla spalla. Ti dilégui.",
          failText: "Le sue urla attirano l'attenzione. Fuggi a mani vuote tra le bancarelle." }
      ],
      rewards: { xp: 60, goldMin: 8, goldMax: 20, fameXp: 5, itemChance: 0.1, itemTier: 1 }
    },
    {
      id: 2, tier: 1, minFame: 0,
      name: "Forzare una Serratura",
      desc: "Un magazzino abbandonato, ma la serratura è nuova. Qualcuno ci tiene qualcosa di prezioso.",
      type: "infiltrazione",
      approaches: [
        { label: "Scassinare", stat: "dex", dc: 12,
          successText: "Il grimaldello gira con un clic soddisfacente. La porta cede.",
          partialText: "La serratura cede ma fai rumore. Prendi quel che puoi e fuggi.",
          failText: "Il grimaldello si spezza. La serratura rimane chiusa." },
        { label: "Trovare il punto debole", stat: "int", dc: 11,
          successText: "Individui la serratura difettosa e la apri con un colpo preciso.",
          partialText: "Il tuo metodo funziona a metà: accesso parziale prima che arrivi qualcuno.",
          failText: "La tua analisi era sbagliata. Perdi tempo prezioso." }
      ],
      rewards: { xp: 70, goldMin: 12, goldMax: 25, fameXp: 6, itemChance: 0.2, itemTier: 1 }
    },
    {
      id: 3, tier: 1, minFame: 0,
      name: "Furto alla Taverna",
      desc: "L'oste ha nascosto le entrate del giorno sotto il bancone. C'è sempre una via.",
      type: "furto",
      approaches: [
        { label: "Distrazione col Carisma", stat: "cha", dc: 11,
          successText: "Il tuo racconto fa sbellicare tutti. L'oste lascia il bancone. Colpo perfetto.",
          partialText: "Riesci a distrarlo ma hai solo un momento. Prendi il meno.",
          failText: "L'oste ti fissa con sospetto. Decidi di non rischiare." },
        { label: "Destrezza sotto il bancone", stat: "dex", dc: 12,
          successText: "La mano scivola sotto il bancone mentre lui gira la schiena.",
          partialText: "Le dita toccano la borsa ma l'oste si gira. Recuperi solo un po'.",
          failText: "Lui abbassa lo sguardo proprio mentre stai allungando la mano. Fuggi." }
      ],
      rewards: { xp: 65, goldMin: 15, goldMax: 30, fameXp: 6, itemChance: 0.1, itemTier: 1 }
    },
    {
      id: 4, tier: 1, minFame: 0,
      name: "Seguire un Mercante",
      desc: "Un commerciante straniero nasconde qualcosa. La gilda vuole sapere dove va di notte.",
      type: "spionaggio",
      approaches: [
        { label: "Seguirlo di nascosto", stat: "dex", dc: 11,
          successText: "Ti muovi come un'ombra. Lo segui fino al suo deposito segreto.",
          partialText: "Lo segui per un po', poi lo perdi di vista. Riferisci quel che hai visto.",
          failText: "Si accorge di essere seguito e cambia percorso." }
      ],
      rewards: { xp: 55, goldMin: 10, goldMax: 18, fameXp: 5, itemChance: 0.05, itemTier: 1 }
    },
    {
      id: 5, tier: 1, minFame: 0,
      name: "Spiare una Conversazione",
      desc: "Due nobili parlano sottovoce nell'angolo buio di una locanda. Qualcuno pagherà bene per quelle informazioni.",
      type: "spionaggio",
      approaches: [
        { label: "Ascoltare con attenzione", stat: "wis", dc: 10,
          successText: "Ogni parola è nitida. Memorizzi tutto e lo rivendi al committente.",
          partialText: "Senti frammenti. Abbastanza per una ricompensa parziale.",
          failText: "I loro sussurri si perdono nel rumore della taverna." },
        { label: "Analizzare il linguaggio del corpo", stat: "int", dc: 11,
          successText: "Leggi gesti e sguardi: stai trafficando segreti di stato.",
          partialText: "Capisci l'argomento ma non i dettagli.",
          failText: "Troppo distante. Non riesci a capire nulla di utile." }
      ],
      rewards: { xp: 50, goldMin: 8, goldMax: 15, fameXp: 4, itemChance: 0.05, itemTier: 1 }
    },
    {
      id: 6, tier: 1, minFame: 0,
      name: "Contrabbando di Merci",
      desc: "Un carretto di merci proibite deve passare il checkpoint notturno. Hai una parola da dire alle guardie.",
      type: "inganno",
      approaches: [
        { label: "Corrompere la guardia", stat: "cha", dc: 12,
          successText: "La guardia sorride e fa passare il carretto. Affare fatto.",
          partialText: "La guardia accetta ma ti chiede di più. Il guadagno si riduce.",
          failText: "La guardia è incorruttibile. Il carretto viene bloccato." },
        { label: "Passare inosservato", stat: "dex", dc: 11,
          successText: "Guidate il carretto dal vicolo posteriore mentre le guardie sono distratte.",
          partialText: "Passate, ma una guardia nota qualcosa. Fretta, fretta.",
          failText: "Il rumore delle ruote vi tradisce." }
      ],
      rewards: { xp: 75, goldMin: 20, goldMax: 35, fameXp: 7, itemChance: 0.15, itemTier: 1 }
    },
    {
      id: 7, tier: 1, minFame: 0,
      name: "Truffa al Gioco d'Azzardo",
      desc: "Un giocatore ricco siede al tavolo. Con le carte giuste — o le mani giuste — puoi svuotargli il portafoglio.",
      type: "inganno",
      approaches: [
        { label: "Barare con destrezza", stat: "dex", dc: 12,
          successText: "Le carte scorrono tra le dita come seta. Non si accorge di nulla.",
          partialText: "Vinci qualcosa prima che un altro giocatore alzi il sopracciglio.",
          failText: "Il tuo trucco viene scoperto. Fuggi prima che tirino fuori le spade." },
        { label: "Bluffare con astuzia", stat: "int", dc: 11,
          successText: "Leggi ogni sua espressione. Lo fai giocare esattamente come vuoi.",
          partialText: "Guadagni qualcosa ma lui se ne va prima della mano finale.",
          failText: "Lui bleffa meglio di te. Perdi la puntata." }
      ],
      rewards: { xp: 70, goldMin: 25, goldMax: 50, fameXp: 6, itemChance: 0.1, itemTier: 1 }
    },
    {
      id: 8, tier: 1, minFame: 0,
      name: "Recupero di un Pacco Rubato",
      desc: "Un mercante ti ha ingaggiato: qualcuno gli ha rubato un pacco prezioso. Recuperalo.",
      type: "recupero",
      approaches: [
        { label: "Prendere di forza", stat: "str", dc: 12,
          successText: "Il ladro non si aspettava resistenza. Il pacco è tuo.",
          partialText: "Una colluttazione veloce. Recuperi il pacco ma con qualche danno.",
          failText: "Il ladro è più forte del previsto. Fugge con il pacco." },
        { label: "Seguirlo e agire di soppiatto", stat: "dex", dc: 11,
          successText: "Lo segui fino al nascondiglio. Mentre dorme, recuperi il pacco.",
          partialText: "Trovi il nascondiglio ma il ladro è sveglio. Prendi il pacco e fuggi.",
          failText: "Lo perdi di vista per le vie del quartiere." }
      ],
      rewards: { xp: 65, goldMin: 18, goldMax: 30, fameXp: 6, itemChance: 0.1, itemTier: 1 }
    },
    {
      id: 9, tier: 1, minFame: 0,
      name: "Sabotare un Carro",
      desc: "Un concorrente della gilda deve essere fermato. Il suo carro di rifornimenti non deve arrivare a destinazione.",
      type: "sabotaggio",
      approaches: [
        { label: "Analizzare e sabotare", stat: "int", dc: 12,
          successText: "Un perno allentato al punto giusto. Il carro si romperà a metà strada.",
          partialText: "Sabotaggio parziale: il carro si fermerà ma riparabile.",
          failText: "Non trovi il punto giusto nel tempo disponibile." }
      ],
      rewards: { xp: 60, goldMin: 15, goldMax: 25, fameXp: 5, itemChance: 0.1, itemTier: 1 }
    },
    {
      id: 10, tier: 1, minFame: 0,
      name: "Rubare da una Casa Privata",
      desc: "Una casa borghese nel quartiere dei mercanti. I padroni sono fuori città.",
      type: "furto",
      approaches: [
        { label: "Entrare dalla finestra", stat: "dex", dc: 12,
          successText: "Salti sul davanzale con grazia felina. Dentro e fuori in dieci minuti.",
          partialText: "Entri ma fai rumore. Prendi quel che riesci prima di fuggire.",
          failText: "Un vicino ti vede. Non è il momento." }
      ],
      rewards: { xp: 80, goldMin: 25, goldMax: 45, fameXp: 7, itemChance: 0.25, itemTier: 1 }
    },

    /* ═══════════════  TIER 2 — Conosciuto/Noto (50+ fama) ═══════════════ */
    {
      id: 11, tier: 2, minFame: 50,
      name: "Infiltrarsi nel Palazzo del Mercante",
      desc: "Il palazzo del ricco mercante Aldric cela un contratto segreto. La gilda ne vuole una copia.",
      type: "infiltrazione",
      approaches: [
        { label: "Infiltrarsi di nascosto", stat: "dex", dc: 14,
          successText: "Passi tra le guardie come fumo. Il contratto è nelle tue mani.",
          partialText: "Entri ma devi affrettarti. Copi solo parte del documento.",
          failText: "Una guardia ti individua. Fuggi dai tetti." },
        { label: "Trovare il percorso sicuro", stat: "int", dc: 14,
          successText: "Studi le rotazioni delle guardie. Il momento perfetto arriva.",
          partialText: "Il tuo piano funziona a metà. Informazioni parziali.",
          failText: "Le rotazioni cambiano. Il tuo piano crolla." }
      ],
      rewards: { xp: 130, goldMin: 35, goldMax: 60, fameXp: 12, itemChance: 0.3, itemTier: 2 }
    },
    {
      id: 12, tier: 2, minFame: 50,
      name: "Rubare il Sigillo del Governatore",
      desc: "Il sigillo ufficiale del governatore vale una fortuna per chi sa come usarlo.",
      type: "furto",
      approaches: [
        { label: "Sottrarlo durante un evento", stat: "dex", dc: 15,
          successText: "Durante il banchetto, la tua mano è invisibile. Sigillo acquisito.",
          partialText: "Lo prendi ma qualcuno nota l'assenza. Hai poco tempo.",
          failText: "Il sigillo è sorvegliato da un occhio attento." },
        { label: "Convincere un servitore", stat: "cha", dc: 14,
          successText: "Il servitore crede alla tua storia. Ti porta dove vuoi andare.",
          partialText: "Il servitore ti aiuta a metà, poi si spaventa.",
          failText: "Il servitore ti denuncia al maggiordomo." }
      ],
      rewards: { xp: 150, goldMin: 50, goldMax: 90, fameXp: 15, itemChance: 0.3, itemTier: 2 }
    },
    {
      id: 13, tier: 2, minFame: 50,
      name: "Eliminare una Guardia Corrotta",
      desc: "Una guardia sta estorcendo denaro ai commercianti del porto. La gilda vuole un messaggio.",
      type: "eliminazione",
      approaches: [
        { label: "Tendere un agguato furtivo", stat: "dex", dc: 15,
          successText: "Nell'ombra del vicolo, la guardia non sa cos'è successo.",
          partialText: "La guardia sopravvive ma è fuori combattimento. Missione parziale.",
          failText: "La guardia era in coppia. Fuggi prima di essere identificato." },
        { label: "Affrontarla di forza", stat: "str", dc: 14,
          successText: "Uno scontro rapido e deciso. La guardia non rappresenta più un problema.",
          partialText: "La guardia è neutralizzata ma hai delle ferite. Ricompensa ridotta.",
          failText: "La guardia chiama rinforzi. Fuga precipitosa." }
      ],
      rewards: { xp: 160, goldMin: 45, goldMax: 80, fameXp: 14, itemChance: 0.25, itemTier: 2 }
    },
    {
      id: 14, tier: 2, minFame: 50,
      name: "Recuperare Documenti dal Tribunale",
      desc: "Prove imbarazzanti per un nobile devono sparire dall'archivio del tribunale.",
      type: "recupero",
      approaches: [
        { label: "Infiltrarsi di notte", stat: "dex", dc: 14,
          successText: "Nell'oscurità, l'archivio è tuo. I documenti spariscono.",
          partialText: "Trovi i documenti ma devi fuggire prima di recuperarli tutti.",
          failText: "Una guardia notturna fa il giro anticipato." },
        { label: "Individuare i documenti rapidamente", stat: "int", dc: 15,
          successText: "Conosci il sistema di archiviazione. Trovi tutto in cinque minuti.",
          partialText: "Trovi la metà prima che il tempo si esaurisca.",
          failText: "I documenti sono stati spostati. Pista sbagliata." }
      ],
      rewards: { xp: 140, goldMin: 60, goldMax: 100, fameXp: 13, itemChance: 0.2, itemTier: 2 }
    },
    {
      id: 15, tier: 2, minFame: 50,
      name: "Spiare la Gilda dei Maghi",
      desc: "La gilda dei maghi nasconde un progetto segreto. Un committente misterioso paga bene per informazioni.",
      type: "spionaggio",
      approaches: [
        { label: "Ascoltare attraverso il muro", stat: "wis", dc: 15,
          successText: "Il muro è sottile. Ogni parola degli arcanisti ti arriva chiara.",
          partialText: "Senti frammenti di incantesimi e piani. Qualcosa di utile.",
          failText: "Un incantesimo di silenzio blocca i suoni. Niente da riferire." },
        { label: "Decifrare i messaggi lasciati", stat: "int", dc: 14,
          successText: "I loro codici non sono abbastanza complessi. Li decifri tutti.",
          partialText: "Decifri metà del messaggio. Informazioni parziali ma utili.",
          failText: "Il codice è arcano. Troppo difficile senza magia." }
      ],
      rewards: { xp: 145, goldMin: 55, goldMax: 95, fameXp: 14, itemChance: 0.35, itemTier: 2 }
    },
    {
      id: 16, tier: 2, minFame: 50,
      name: "Furto alla Tesoreria Cittadina",
      desc: "La tesoreria cittadina ha una vulnerabilità durante il cambio della guardia. Una finestra di tre minuti.",
      type: "furto",
      approaches: [
        { label: "Muoversi rapidissimo", stat: "dex", dc: 15,
          successText: "Tre minuti sono più che sufficienti per le tue mani veloci.",
          partialText: "Prendi qualcosa ma il tempo è meno del previsto.",
          failText: "Il cambio della guardia è anticipato. Niente da fare." },
        { label: "Pianificare ogni secondo", stat: "int", dc: 15,
          successText: "Il tuo piano era perfetto. Ogni secondo era contato.",
          partialText: "Un piccolo errore di calcolo. Prendi meno del previsto.",
          failText: "La finestra di opportunità era un'ora prima." }
      ],
      rewards: { xp: 180, goldMin: 80, goldMax: 150, fameXp: 18, itemChance: 0.3, itemTier: 2 }
    },
    {
      id: 17, tier: 2, minFame: 50,
      name: "Sabotare la Guardia Notturna",
      desc: "Una banda rivale vuole un distretto sguarnito per una notte. Pagano bene per chi elimina le pattuglie.",
      type: "sabotaggio",
      approaches: [
        { label: "Neutralizzarle nell'ombra", stat: "dex", dc: 14,
          successText: "Una dopo l'altra, le guardie cadono nel sonno grazie alle tue erbe.",
          partialText: "Neutralizzi metà delle pattuglie. Il distretto è parzialmente sguarnito.",
          failText: "Una guardia sveglia allarma le altre." },
        { label: "Creare diversivi convincenti", stat: "int", dc: 15,
          successText: "Falsi segnali di pericolo spostano tutte le guardie dall'altra parte della città.",
          partialText: "Alcuni diversivi funzionano. Pattuglie ridotte.",
          failText: "Il comandante riconosce la trappola." }
      ],
      rewards: { xp: 155, goldMin: 50, goldMax: 85, fameXp: 15, itemChance: 0.2, itemTier: 2 }
    },
    {
      id: 18, tier: 2, minFame: 50,
      name: "Assassinare un Informatore",
      desc: "Un informatore sta per rivelare i nomi dei membri della gilda alle autorità. Va fermato.",
      type: "eliminazione",
      approaches: [
        { label: "Agguato silenzioso", stat: "dex", dc: 16,
          successText: "L'informatore non consegnerà mai quel rapporto.",
          partialText: "Missione compiuta ma non in silenzio. La gilda è contrariata.",
          failText: "L'informatore era protetto da una guardia del corpo." },
        { label: "Affrontarlo di petto", stat: "str", dc: 15,
          successText: "Veloce, diretto, efficace. Nessun testimone.",
          partialText: "Lo fermi ma lui riesce a fuggire ferito.",
          failText: "Più forte di quanto pensassi. Fuggi." }
      ],
      rewards: { xp: 170, goldMin: 70, goldMax: 120, fameXp: 16, itemChance: 0.3, itemTier: 2 }
    },
    {
      id: 19, tier: 2, minFame: 50,
      name: "Recuperare un Artefatto Rubato",
      desc: "Un collezionista ha bisogno che un artefatto magico venga recuperato da chi glielo ha sottratto.",
      type: "recupero",
      approaches: [
        { label: "Localizzare e analizzare", stat: "int", dc: 14,
          successText: "Trovi il ricettatore e individui dove tiene l'artefatto.",
          partialText: "Lo trovi ma deve essere negoziato. Commissione ridotta.",
          failText: "Il ricettatore lo ha già rivenduto. Pista persa." }
      ],
      rewards: { xp: 135, goldMin: 40, goldMax: 70, fameXp: 12, itemChance: 0.4, itemTier: 2 }
    },
    {
      id: 20, tier: 2, minFame: 50,
      name: "Infiltrarsi nella Gilda degli Assassini",
      desc: "Qualcuno vuole sapere chi ha ordinato un contratto. L'informazione è negli archivi della gilda.",
      type: "infiltrazione",
      approaches: [
        { label: "Fingersi un membro", stat: "cha", dc: 15,
          successText: "La tua recitazione è convincente. Accedi agli archivi come uno di loro.",
          partialText: "Ti insospettiscono ma non abbastanza. Informazioni parziali.",
          failText: "Ti smascherano subito. Fuga disperata." },
        { label: "Entrare di nascosto", stat: "dex", dc: 16,
          successText: "Nessuno si accorge di te. Gli archivi sono aperti.",
          partialText: "Entri ma sei costretto a uscire prima del previsto.",
          failText: "La sicurezza è impenetrabile per via furtiva." }
      ],
      rewards: { xp: 175, goldMin: 65, goldMax: 110, fameXp: 17, itemChance: 0.35, itemTier: 2 }
    },
    {
      id: 21, tier: 2, minFame: 50,
      name: "Consegnare un Messaggio Cifrato",
      desc: "Un messaggio codificato deve raggiungere una spia in incognito. Non devi essere visto né fermato.",
      type: "spionaggio",
      approaches: [
        { label: "Muoversi inosservato", stat: "dex", dc: 13,
          successText: "Consegna effettuata. Nessuno ti ha seguito.",
          partialText: "Consegnato ma sei stato notato. La spia cambierà posto.",
          failText: "Una guardia ti ferma per un controllo. Devi disfarti del messaggio." },
        { label: "Usare un intermediario", stat: "cha", dc: 14,
          successText: "Convinci un ragazzo di strada a consegnare il messaggio innocentemente.",
          partialText: "L'intermediario consegna ma con ritardo.",
          failText: "L'intermediario apre il messaggio e ne svela il contenuto." }
      ],
      rewards: { xp: 120, goldMin: 30, goldMax: 55, fameXp: 10, itemChance: 0.15, itemTier: 2 }
    },
    {
      id: 22, tier: 2, minFame: 50,
      name: "Rubare un Cavallo da Razza",
      desc: "Un nobile vuole il cavallo campione del suo rivale prima della corsa reale.",
      type: "furto",
      approaches: [
        { label: "Portarlo via di notte", stat: "dex", dc: 15,
          successText: "Il cavallo ti segue docilmente nell'oscurità. Gentiluomo equestre.",
          partialText: "Il cavallo nitrisce una volta. Hai appena il tempo di allontanarti.",
          failText: "Il palafreniere era ancora sveglio." },
        { label: "Convincere il palafreniere", stat: "cha", dc: 14,
          successText: "Una storia convincente e qualche moneta. Il cavallo è 'affidato' a te.",
          partialText: "Il palafreniere è sospettoso ma ti lascia passare con il cavallo.",
          failText: "Il palafreniere chiama la guardia." }
      ],
      rewards: { xp: 160, goldMin: 60, goldMax: 100, fameXp: 15, itemChance: 0.2, itemTier: 2 }
    },

    /* ═══════════════  TIER 3 — Noto+ (150+ fama) ═══════════════ */
    {
      id: 23, tier: 3, minFame: 150,
      name: "Rubare la Corona del Duca",
      desc: "La corona del Duca sarà esposta durante la festa d'incoronazione. Una notte, una finestra.",
      type: "furto",
      approaches: [
        { label: "Operazione ombra", stat: "dex", dc: 17,
          successText: "La corona sparisce dalla teca nel momento esatto in cui le luci si abbassano.",
          partialText: "Prendi la corona ma scatta un allarme. Fuga acrobatica.",
          failText: "Le misure di sicurezza erano state raddoppiate." }
      ],
      rewards: { xp: 280, goldMin: 150, goldMax: 300, fameXp: 35, itemChance: 0.5, itemTier: 3 }
    },
    {
      id: 24, tier: 3, minFame: 150,
      name: "Eliminare il Capo della Guardia",
      desc: "Il Capitano Mordrek è il pilastro della sicurezza cittadina. Qualcuno vuole quel pilastro rimosso.",
      type: "eliminazione",
      approaches: [
        { label: "Agguato nell'ombra", stat: "dex", dc: 18,
          successText: "Il Capitano cade. La città si trova improvvisamente vulnerabile.",
          partialText: "Ferito ma non eliminato. Il contratto è parzialmente soddisfatto.",
          failText: "Mordrek era già allertato. Fuga tra le guardie." },
        { label: "Sfida diretta", stat: "str", dc: 17,
          successText: "Uno scontro leggendario. Ne esci vincitore.",
          partialText: "Lo batti ma con gravi conseguenze. Ricompensa ridotta.",
          failText: "Mordrek era un guerriero esperto. Non era abbastanza." }
      ],
      rewards: { xp: 320, goldMin: 180, goldMax: 350, fameXp: 40, itemChance: 0.5, itemTier: 3 }
    },
    {
      id: 25, tier: 3, minFame: 150,
      name: "Infiltrarsi nel Castello Reale",
      desc: "Un documento firmato dal Re è necessario per un piano che cambierà la storia.",
      type: "infiltrazione",
      approaches: [
        { label: "Passare dalle grondaie", stat: "dex", dc: 18,
          successText: "Arrampicato come un gatto, raggiungi le stanze private del Re.",
          partialText: "Entri ma devi deviare. Raggiungi solo l'anticamera.",
          failText: "Le grondaie erano trappola. Le guardie ti aspettavano." },
        { label: "Trovare la via segreta", stat: "int", dc: 17,
          successText: "Hai studiato le planimetrie. C'era un passaggio segreto che nessuno usava da secoli.",
          partialText: "Il passaggio esiste ma porta in una stanza secondaria.",
          failText: "Il passaggio era stato murato. I tuoi piani erano obsoleti." }
      ],
      rewards: { xp: 300, goldMin: 160, goldMax: 280, fameXp: 38, itemChance: 0.55, itemTier: 3 }
    },
    {
      id: 26, tier: 3, minFame: 150,
      name: "Recuperare il Grimorio del Mago Supremo",
      desc: "Il potente mago Zelindor custodisce un grimorio che non gli appartiene. Recuperalo.",
      type: "recupero",
      approaches: [
        { label: "Rubare mentre dorme", stat: "dex", dc: 17,
          successText: "I maghi dormono profondamente dopo i rituali. Il grimorio è tuo.",
          partialText: "Prendi il grimorio ma un guardiano magico si attiva. Fuggi.",
          failText: "Il grimorio era protetto da incantesimi di allarme." },
        { label: "Decifrare le protezioni magiche", stat: "int", dc: 18,
          successText: "Le protezioni arcane non sono un segreto per te. Le disattivi tutte.",
          partialText: "Disattivi metà delle protezioni. Riesci a prendere il grimorio di corsa.",
          failText: "Le protezioni erano troppo complesse. La magia ti respinge." }
      ],
      rewards: { xp: 290, goldMin: 140, goldMax: 260, fameXp: 36, itemChance: 0.6, itemTier: 3 }
    },
    {
      id: 27, tier: 3, minFame: 150,
      name: "Assassinare un Nobile Traditore",
      desc: "Il Conte Varen sta vendendo informazioni ai nemici del regno. Il Re vuole silenzio permanente.",
      type: "eliminazione",
      approaches: [
        { label: "Veleno nel vino", stat: "dex", dc: 17,
          successText: "Il Conte porta il calice alle labbra durante il banchetto. Non si alzerà.",
          partialText: "Il veleno è stato diluito. Sopravviverà ma è neutralizzato.",
          failText: "L'assaggiatore reale intercetta il calice avvelenato." }
      ],
      rewards: { xp: 310, goldMin: 200, goldMax: 400, fameXp: 42, itemChance: 0.5, itemTier: 3 }
    },
    {
      id: 28, tier: 3, minFame: 150,
      name: "Rubare il Tesoro del Drago Mercante",
      desc: "Saryndax non è un vero drago, ma è il commerciante più ricco — e più crudele — della regione.",
      type: "furto",
      approaches: [
        { label: "Ingannarlo con un affare falso", stat: "cha", dc: 18,
          successText: "La tua proposta è così convincente che ti invita nei suoi forzieri.",
          partialText: "Abbocca a metà. Ottieni accesso parziale ai suoi beni.",
          failText: "Saryndax ha visto ogni tipo di truffa. Non abbocca." },
        { label: "Svuotare il forziere di notte", stat: "int", dc: 17,
          successText: "Il meccanismo del forziere era complesso ma non per la tua mente.",
          partialText: "Apri il forziere ma una trappola si attiva. Prendi quel che puoi.",
          failText: "Il forziere aveva tre serrature. Ne apri solo due." }
      ],
      rewards: { xp: 350, goldMin: 250, goldMax: 500, fameXp: 45, itemChance: 0.6, itemTier: 3 }
    },
    {
      id: 29, tier: 3, minFame: 150,
      name: "Sabotare il Piano dell'Inquisizione",
      desc: "L'Inquisizione sta pianificando una purga. I documenti che la autorizzano devono sparire.",
      type: "sabotaggio",
      approaches: [
        { label: "Bruciare l'archivio", stat: "dex", dc: 17,
          successText: "In pochi minuti, anni di indagini dell'Inquisizione vanno in fumo.",
          partialText: "Bruci parte dell'archivio prima di essere scoperto.",
          failText: "Le guardie dell'Inquisizione sono onnipresenti." },
        { label: "Falsificare i documenti", stat: "int", dc: 18,
          successText: "I documenti autentici vengono sostituiti con falsi che annullano i mandati.",
          partialText: "Falsifichi alcuni documenti chiave. Il piano è ritardato.",
          failText: "La tua calligrafia non regge all'ispezione." }
      ],
      rewards: { xp: 330, goldMin: 170, goldMax: 320, fameXp: 40, itemChance: 0.5, itemTier: 3 }
    },
    {
      id: 30, tier: 3, minFame: 150,
      name: "Recuperare il Sigillo del Re",
      desc: "Il sigillo personale del Re è stato rubato da una spia nemica. Se venisse usato, la guerra sarebbe inevitabile.",
      type: "recupero",
      approaches: [
        { label: "Seguire la spia e agire", stat: "dex", dc: 18,
          successText: "La segui fino al punto di passaggio. Sigillo recuperato, spia neutralizzata.",
          partialText: "Recuperi il sigillo ma la spia riesce a fuggire. Missione parziale.",
          failText: "La spia si accorge di essere seguita e accelera la consegna." },
        { label: "Decifrare dove si dirige", stat: "int", dc: 17,
          successText: "Anticipi i suoi movimenti. La intercetti prima che raggiunga la destinazione.",
          partialText: "La anticipi ma hai solo un breve scontro. Il sigillo è tuo.",
          failText: "La tua analisi era sbagliata. Troppo tardi." }
      ],
      rewards: { xp: 400, goldMin: 300, goldMax: 600, fameXp: 50, itemChance: 0.65, itemTier: 3 }
    },

    /* ═══════════════  MAGO — TIER 1 (0+ fama) ═══════════════ */
    {
      id: 201, tier: 1, minFame: 0, classMission: 'mago',
      name: "Il Grimorio Perduto",
      desc: "Un prezioso libro di magia è stato rubato dalla biblioteca della torre. Il mago anziano è disperato.",
      type: "recupero",
      approaches: [
        { label: "Analizzare la traccia arcana", stat: "int", dc: 11,
          successText: "La tua mente coglie i residui magici. Trovi il grimorio in un nascondiglio vicino.",
          partialText: "La traccia è debole ma sufficiente. Recuperi il libro con qualche difficoltà.",
          failText: "La traccia è troppo dispersa. Il grimorio rimane perduto per oggi." },
        { label: "Cercare di nascosto", stat: "dex", dc: 13,
          successText: "Ti muovi furtivo tra i vicoli. Il ladro non si accorge di te mentre recuperi il grimorio.",
          partialText: "Trovi il ladro ma fa resistenza. Il libro è tuo, ma con qualche danno.",
          failText: "Il ladro ti vede e fugge con il grimorio." }
      ],
      rewards: { xp: 60, goldMin: 10, goldMax: 22, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 0.4, ingredientTierMax: 1 }
    },
    {
      id: 202, tier: 1, minFame: 0, classMission: 'mago',
      name: "Identificare l'Artefatto",
      desc: "Un mercante ha trovato un oggetto strano nel suo magazzino. Teme sia maledetto. Vuole che qualcuno lo analizzi.",
      type: "analisi",
      approaches: [
        { label: "Rituali di identificazione", stat: "int", dc: 12,
          successText: "Il tuo studio rivela l'oggetto: un amuleto di protezione dimenticato. Prezioso.",
          partialText: "Riesci a capire che non è pericoloso, ma i dettagli ti sfuggono.",
          failText: "L'analisi fallisce. L'oggetto rimane un mistero e il mercante non ti paga." }
      ],
      rewards: { xp: 65, goldMin: 12, goldMax: 28, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 0.4, ingredientTierMax: 1 }
    },
    {
      id: 203, tier: 1, minFame: 0, classMission: 'mago',
      name: "La Creatura nel Magazzino",
      desc: "Un piccolo costrutto magico è sfuggito al suo padrone e ha devastato un magazzino. Va fermato.",
      type: "eliminazione",
      approaches: [
        { label: "Disattivare il nucleo magico", stat: "int", dc: 11,
          successText: "Individui il nucleo di energia. Con il giusto incantesimo lo disattivi senza danni.",
          partialText: "Riesci a indebolirlo ma il costrutto si danneggia parzialmente nel processo.",
          failText: "Il costrutto è più complesso del previsto. Fuggi prima che distrugga anche te." },
        { label: "Smontarlo con la forza", stat: "str", dc: 14,
          successText: "Lo afferri e lo smonti pezzo per pezzo. Efficace, se non elegante.",
          partialText: "Lo danneggi abbastanza da bloccarlo, ma rischi qualche graffio.",
          failText: "Il costrutto è troppo resistente. Ti allontani sconfitto." }
      ],
      rewards: { xp: 70, goldMin: 14, goldMax: 30, fameXp: 6, itemChance: 0.15, itemTier: 1, ingredientChance: 0.4, ingredientTierMax: 1 }
    },
    {
      id: 204, tier: 1, minFame: 0, classMission: 'mago',
      name: "L'Apprendista Fuggiasco",
      desc: "Un giovane apprendista è fuggito dalla scuola di magia dopo aver rubato un incantesimo proibito.",
      type: "recupero",
      approaches: [
        { label: "Convincerlo a tornare", stat: "cha", dc: 11,
          successText: "Le tue parole toccano il ragazzo. Capisce i rischi e torna con te.",
          partialText: "Lo convinci a tornare, ma è diffidente. Missione compiuta a metà.",
          failText: "Il ragazzo non si fida. Fugge più lontano." },
        { label: "Prevedere i suoi movimenti", stat: "int", dc: 13,
          successText: "Anticipi i suoi pensieri: uno studente in fuga cerca sempre la stessa cosa. Lo trovi.",
          partialText: "La tua previsione era quasi giusta. Lo trovi ma ha già usato l'incantesimo.",
          failText: "Le tue deduzioni erano errate. Le tracce si perdono." }
      ],
      rewards: { xp: 60, goldMin: 10, goldMax: 22, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 0.4, ingredientTierMax: 1 }
    },
    {
      id: 205, tier: 1, minFame: 0, classMission: 'mago',
      name: "Raccogliere Erbe Magiche",
      desc: "Una spedizione in una zona pericolosa per raccogliere erbe rare necessarie a un laboratorio.",
      type: "raccolta",
      approaches: [
        { label: "Seguire i sensi magici", stat: "wis", dc: 11,
          successText: "I tuoi sensi guidano ogni passo. Raccogli le erbe più pure senza rischi.",
          partialText: "Trovi le erbe ma la zona è più pericolosa del previsto. Ne recuperi metà.",
          failText: "Perdi la via nel bosco. Torni a mani vuote." },
        { label: "Muoversi in silenzio", stat: "dex", dc: 13,
          successText: "Ti muovi come un'ombra tra le bestie. Le erbe sono tue senza disturbare nulla.",
          partialText: "Quasi silenzioso, ma una bestia ti sente. Scappi con qualche raccolta.",
          failText: "Fai troppo rumore. Le bestie ti cacciano via." }
      ],
      rewards: { xp: 55, goldMin: 8, goldMax: 20, fameXp: 5, itemChance: 0.05, itemTier: 1, ingredientChance: 0.6, ingredientTierMax: 1 }
    },
    {
      id: 206, tier: 1, minFame: 0, classMission: 'mago',
      name: "La Trappola di Rune",
      desc: "Delle rune esplosive sono state incise su una porta del mercato. La città è in pericolo.",
      type: "disinnesco",
      approaches: [
        { label: "Disattivare le rune con precisione", stat: "int", dc: 12,
          successText: "Le tue mani tremano, ma la mente è ferma. Le rune si spengono una a una.",
          partialText: "Ne disattivi la maggior parte. La piccola esplosione rimanente non fa danni gravi.",
          failText: "Tocchi la sequenza sbagliata. La porta esplode, per fortuna senza feriti." }
      ],
      rewards: { xp: 70, goldMin: 15, goldMax: 30, fameXp: 6, itemChance: 0.15, itemTier: 1, ingredientChance: 0.4, ingredientTierMax: 1 }
    },
    {
      id: 207, tier: 1, minFame: 0, classMission: 'mago',
      name: "Il Sogno Ricorrente",
      desc: "Un villaggio è tormentato da incubi ogni notte. Qualcosa di magico li causa. Ti chiedono aiuto.",
      type: "indagine",
      approaches: [
        { label: "Analizzare il campo onirico", stat: "wis", dc: 11,
          successText: "Mediti e entri nello spazio tra sogno e veglia. Trovi e dissolvi la fonte.",
          partialText: "Individui la fonte ma riesci solo a indebolirla. Gli incubi diminuiscono.",
          failText: "Il campo onirico ti travolge. Esci confuso senza risolverlo." },
        { label: "Studiare i segni magici", stat: "int", dc: 13,
          successText: "I pattern magici ti conducono a un artefatto nascosto nel pozzo del villaggio.",
          partialText: "Trovi l'artefatto ma non riesci a distruggerlo completamente.",
          failText: "I segni sono troppo oscuri per la tua comprensione attuale." }
      ],
      rewards: { xp: 65, goldMin: 12, goldMax: 25, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 0.4, ingredientTierMax: 1 }
    },
    {
      id: 208, tier: 1, minFame: 0, classMission: 'mago',
      name: "Tradurre il Manoscritto",
      desc: "Un antico testo è stato trovato nelle catacombe. Nessuno lo capisce. Serve una mente arcana.",
      type: "analisi",
      approaches: [
        { label: "Decifrare l'antico alfabeto", stat: "int", dc: 12,
          successText: "Il testo rivela la posizione di un deposito segreto. La città è grata.",
          partialText: "Traduci parzialmente. Abbastanza da capire i punti salienti.",
          failText: "Il linguaggio è troppo arcaico anche per te." }
      ],
      rewards: { xp: 60, goldMin: 10, goldMax: 22, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 0.4, ingredientTierMax: 1 }
    },
    {
      id: 209, tier: 1, minFame: 0, classMission: 'mago',
      name: "La Fontana Avvelenata",
      desc: "La fontana del villaggio è stata contaminata da magia oscura. L'acqua fa ammalare chi la beve.",
      type: "purificazione",
      approaches: [
        { label: "Rituali di purificazione", stat: "int", dc: 11,
          successText: "Il tuo incantesimo di purificazione dissolve la contaminazione. L'acqua torna limpida.",
          partialText: "La purifichi parzialmente. Meglio di prima, ma richiederà altri trattamenti.",
          failText: "La contaminazione è radicata. Non riesci a rimuoverla." },
        { label: "Meditare sulla fonte del male", stat: "wis", dc: 13,
          successText: "Percependo l'oscurità, la indirizzi altrove. La fontana è salva.",
          partialText: "Indebolisci la magia ma non la elimini del tutto.",
          failText: "L'oscurità è troppo profonda per essere percepita." }
      ],
      rewards: { xp: 65, goldMin: 12, goldMax: 26, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 0.5, ingredientTierMax: 1 }
    },
    {
      id: 210, tier: 1, minFame: 0, classMission: 'mago',
      name: "Il Messaggero Incantato",
      desc: "Una lettera sigillata con rune magiche deve essere consegnata. Il sigillo non deve essere spezzato.",
      type: "consegna",
      approaches: [
        { label: "Presentarsi con autorità arcana", stat: "cha", dc: 11,
          successText: "Il tuo portamento da mago apre ogni porta. La lettera è consegnata intatta.",
          partialText: "Qualche difficoltà, ma la lettera arriva a destinazione.",
          failText: "Vieni bloccato da guardie sospettose. La lettera non parte." },
        { label: "Trovare la via più sicura", stat: "dex", dc: 12,
          successText: "Ti muovi attraverso i vicoli secondari. La consegna è perfetta.",
          partialText: "Qualche deviazione necessaria, ma ci arrivi.",
          failText: "La via è bloccata. Non riesci a consegnare." }
      ],
      rewards: { xp: 55, goldMin: 10, goldMax: 20, fameXp: 5, itemChance: 0.05, itemTier: 1, ingredientChance: 0.4, ingredientTierMax: 1 }
    },

    /* ═══════════════  MAGO — TIER 2 (50+ fama) ═══════════════ */
    {
      id: 211, tier: 2, minFame: 50, classMission: 'mago',
      name: "Il Dungeon dell'Anatema",
      desc: "Un dungeon maledetto da un antico anatema. I mostri al suo interno non possono morire davvero.",
      type: "esplorazione",
      approaches: [
        { label: "Spezzare la maledizione", stat: "int", dc: 14,
          successText: "Trovi il nucleo dell'anatema e lo dissolvi. Il dungeon ritrova pace.",
          partialText: "Indebolisci l'anatema abbastanza da attraversare il dungeon e recuperare ciò che serve.",
          failText: "L'anatema è oltre le tue capacità attuali." },
        { label: "Combattere con la forza bruta", stat: "str", dc: 16,
          successText: "Se non puoi ucciderli, basta che non si rialzino in tempo. Passi tra le macerie.",
          partialText: "Ci vuole molto sforzo fisico. Esci con qualche ferita ma vittorioso.",
          failText: "I mostri non si fermano. Sei costretto a ritiراrti." }
      ],
      rewards: { xp: 120, goldMin: 30, goldMax: 70, fameXp: 12, itemChance: 0.3, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 212, tier: 2, minFame: 50, classMission: 'mago',
      name: "La Setta dell'Ombra",
      desc: "Una setta di seguaci della magia oscura si è infiltrata nella città. Devi scoprire i loro piani.",
      type: "infiltrazione",
      approaches: [
        { label: "Infiltrarti come simpatizzante", stat: "cha", dc: 14,
          successText: "Fingi di condividere le loro credenze. Scopri i piani e li riporti alle autorità.",
          partialText: "Ti infiltri parzialmente ma destano sospetti. Ottieni informazioni frammentarie.",
          failText: "Ti smascherano. Fuggi a stento." },
        { label: "Decifrare i loro simboli", stat: "int", dc: 16,
          successText: "I codici della setta sono sofisticati ma non per te. Sveli tutto.",
          partialText: "Decifri parte del codice. Abbastanza per un avvertimento.",
          failText: "Il loro sistema crittografico supera la tua comprensione." }
      ],
      rewards: { xp: 130, goldMin: 35, goldMax: 80, fameXp: 13, itemChance: 0.3, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 213, tier: 2, minFame: 50, classMission: 'mago',
      name: "Il Costrutto Ribelle",
      desc: "Un golem di pietra creato per proteggere la città è impazzito e attacca i cittadini.",
      type: "neutralizzazione",
      approaches: [
        { label: "Disattivare il core magico", stat: "int", dc: 14,
          successText: "Individui la pietra di controllo. Un incantesimo preciso lo ferma.",
          partialText: "Riesci a rallentarlo ma non a fermarlo del tutto. Le guardie finiscono il lavoro.",
          failText: "Il core è protetto. Non riesci ad accedervi." },
        { label: "Abbatterlo fisicamente", stat: "str", dc: 16,
          successText: "Fratturi le giunture vitali. Il golem crolla in pezzi innocui.",
          partialText: "Lo danneggi seriamente. Non può più attaccare, ma è ancora in piedi.",
          failText: "È troppo resistente. Ti schivi appena in tempo." }
      ],
      rewards: { xp: 125, goldMin: 32, goldMax: 75, fameXp: 12, itemChance: 0.3, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 214, tier: 2, minFame: 50, classMission: 'mago',
      name: "L'Alchimista Folle",
      desc: "Un alchimista ha perso la ragione dopo un esperimento fallito. I suoi esperimenti minacciano il quartiere.",
      type: "neutralizzazione",
      approaches: [
        { label: "Ragionare con lui", stat: "int", dc: 13,
          successText: "Parli la sua lingua. Lo porti piano piano alla realtà. Accetta di fermarsi.",
          partialText: "Lo calmi abbastanza da fermarlo temporaneamente.",
          failText: "La sua mente è troppo frantumata. Non risponde alla logica." },
        { label: "Intuire dove si trova la coscienza", stat: "wis", dc: 15,
          successText: "Percepire il suo dolore ti permette di trovare la via giusta. Guarisce.",
          partialText: "Senti la sua angoscia. Lo calmi parzialmente.",
          failText: "La follia è troppo profonda per essere percepita." }
      ],
      rewards: { xp: 115, goldMin: 28, goldMax: 65, fameXp: 11, itemChance: 0.3, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 215, tier: 2, minFame: 50, classMission: 'mago',
      name: "La Rete dell'Aragnide",
      desc: "Un covo di ragni magici ha infestato la cantina di un nobile. Producono veleno arcano.",
      type: "eliminazione",
      approaches: [
        { label: "Bruciare la tana con la magia del fuoco", stat: "int", dc: 14,
          successText: "Le fiamme arcane puliscono ogni angolo. La cantina è sicura.",
          partialText: "Elimini la maggior parte ma alcuni fuggono dalle fessure.",
          failText: "I ragni si dissolvono nel buio prima che le fiamme li raggiungano." },
        { label: "Muoversi silenziosamente ed eliminarli", stat: "dex", dc: 16,
          successText: "Ti muovi nell'ombra come loro. Li elimini uno a uno senza farli allarmare.",
          partialText: "Ne elimini la metà prima che l'allarme scatti.",
          failText: "Sei troppo lento. I ragni ti circondano e fuggi." }
      ],
      rewards: { xp: 120, goldMin: 30, goldMax: 70, fameXp: 12, itemChance: 0.3, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 216, tier: 2, minFame: 50, classMission: 'mago',
      name: "Il Cristallo delle Visioni",
      desc: "Una sfera di cristallo rubata mostra visioni del futuro. Va recuperata prima che cada in mani sbagliate.",
      type: "recupero",
      approaches: [
        { label: "Usare la sfera per trovarsi", stat: "int", dc: 13,
          successText: "Usi la sfera stessa per localizzarla. Un paradosso risolto magistralmente.",
          partialText: "Ottieni un'immagine parziale. Abbastanza per orientarti.",
          failText: "Le visioni sono troppo caotiche per essere interpretate." },
        { label: "Intuire dove si nasconde il ladro", stat: "wis", dc: 15,
          successText: "Il tuo intuito ti porta direttamente al ladro. La sfera è recuperata.",
          partialText: "Quasi giusto: trovi il nascondiglio ma il ladro è già partito. La sfera c'è.",
          failText: "La tua percezione ti tradisce. Il ladro scompare." }
      ],
      rewards: { xp: 125, goldMin: 32, goldMax: 75, fameXp: 12, itemChance: 0.3, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 217, tier: 2, minFame: 50, classMission: 'mago',
      name: "Il Contratto Demoniaco",
      desc: "Un mercante ha firmato un contratto demoniaco per ricchezze. Ora vuole uscirne. Non è semplice.",
      type: "liberazione",
      approaches: [
        { label: "Trovare la clausola di uscita", stat: "wis", dc: 14,
          successText: "Ogni contratto demoniaco ha una via d'uscita nascosta. La trovi e la sfrutti.",
          partialText: "Trovi una clausola parziale. Il mercante è liberato ma a un costo.",
          failText: "Il contratto è ermetico. Nessuna via di fuga evidente." },
        { label: "Riscrivere il contratto con la magia", stat: "int", dc: 16,
          successText: "Con abilità arcana riformuli i termini. Il demonio è vincolato a rispettarli.",
          partialText: "Modifichi parzialmente il contratto. Le condizioni migliorano.",
          failText: "Il demonio si accorge del tentativo. Il contratto si inasprisce." }
      ],
      rewards: { xp: 130, goldMin: 35, goldMax: 80, fameXp: 14, itemChance: 0.35, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 218, tier: 2, minFame: 50, classMission: 'mago',
      name: "Il Portale Instabile",
      desc: "Un portale dimensionale si è aperto in un deposito. Creature da altri piani stanno passando.",
      type: "sigillo",
      approaches: [
        { label: "Sigillare il portale con rune", stat: "int", dc: 15,
          successText: "Le rune di sigillo convergono perfettamente. Il portale si chiude con un botto.",
          partialText: "Lo rimpicciolisci abbastanza da bloccare il passaggio. Non è permanente.",
          failText: "Le rune si distorcono. Il portale si allarga invece di chiudersi." },
        { label: "Percepire le frequenze del piano", stat: "wis", dc: 14,
          successText: "Senti la frequenza dell'altro piano e la interrompi manualmente. Funziona.",
          partialText: "Interrompi parzialmente la connessione. Il flusso si riduce.",
          failText: "Le frequenze sono incoerenti. Perdi l'orientamento." }
      ],
      rewards: { xp: 135, goldMin: 38, goldMax: 85, fameXp: 14, itemChance: 0.35, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 219, tier: 2, minFame: 50, classMission: 'mago',
      name: "La Maledizione della Luna",
      desc: "Ad ogni luna piena gli abitanti di un villaggio si tramutano in bestie. Una maledizione antica.",
      type: "liberazione",
      approaches: [
        { label: "Cercare il rituale di rottura", stat: "wis", dc: 14,
          successText: "Il rituale di purificazione lunare funziona. La maledizione è spezzata.",
          partialText: "Il rituale è parzialmente corretto. La trasformazione diventa meno violenta.",
          failText: "Manca un componente chiave. La maledizione persiste." },
        { label: "Convincere la luna con la persuasione arcana", stat: "cha", dc: 15,
          successText: "La tua voce risuona tra le sfere celesti. La maledizione si dissolve.",
          partialText: "La luna risponde, ma solo in parte.",
          failText: "Le sfere celestiali non rispondono." }
      ],
      rewards: { xp: 125, goldMin: 30, goldMax: 72, fameXp: 13, itemChance: 0.3, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },
    {
      id: 220, tier: 2, minFame: 50, classMission: 'mago',
      name: "Il Torneo dei Maghi",
      desc: "Un torneo arcano. Prove di conoscenza e abilità magica. Un'occasione per farti un nome.",
      type: "competizione",
      approaches: [
        { label: "Dominare le prove teoriche", stat: "int", dc: 14,
          successText: "La tua erudizione è insuperabile. Vinci ogni prova teorica con distinzione.",
          partialText: "Passi la maggior parte delle prove. Un buon risultato.",
          failText: "I tuoi avversari sono più preparati. Eliminato nelle prime fasi." },
        { label: "Convincere i giudici con il portamento", stat: "cha", dc: 15,
          successText: "La tua presenza scenica incanta i giudici. Vinci anche senza il punteggio massimo.",
          partialText: "Fai una buona impressione. Qualche punto bonus.",
          failText: "I giudici non sono impressionati dall'apparenza." }
      ],
      rewards: { xp: 120, goldMin: 30, goldMax: 70, fameXp: 15, itemChance: 0.3, itemTier: 2, ingredientChance: 0.5, ingredientTierMax: 2 }
    },

    /* ═══════════════  MAGO — TIER 3 (150+ fama) ═══════════════ */
    {
      id: 221, tier: 3, minFame: 150, classMission: 'mago',
      name: "Il Necromantico",
      desc: "Un negromante sta costruendo un esercito di non-morti. Va fermato prima che sia troppo tardi.",
      type: "eliminazione",
      approaches: [
        { label: "Smontare i suoi rituali di legame", stat: "int", dc: 16,
          successText: "Senza i rituali, i non-morti crollano. Il negromante è impotente e si arrende.",
          partialText: "Interrompi parte dei rituali. L'esercito si dimezza.",
          failText: "I rituali sono troppo complessi. Il negromante ride della tua impotenza." },
        { label: "Affrontarlo fisicamente", stat: "str", dc: 17,
          successText: "La sua magia è potente ma lui è fragile. Lo disarmi e lo catturi.",
          partialText: "Lo ferisci abbastanza da farlo fuggire. L'esercito si disperде.",
          failText: "I non-morti ti bloccano. Fuggi a stento con la vita." }
      ],
      rewards: { xp: 200, goldMin: 80, goldMax: 180, fameXp: 25, itemChance: 0.5, itemTier: 3, ingredientChance: 0.6, ingredientTierMax: 3 }
    },
    {
      id: 222, tier: 3, minFame: 150, classMission: 'mago',
      name: "Il Sigillo Dimenticato",
      desc: "Un antico sigillo protettivo si sta sgretolando. Se cade, qualcosa di terribile verrà liberato.",
      type: "ripristino",
      approaches: [
        { label: "Ridisegnare le rune originali", stat: "int", dc: 16,
          successText: "Studi i frammenti sopravvissuti e ricrei il sigillo originale. Tiene.",
          partialText: "Il sigillo regge, ma è indebolito. Durerà ancora qualche anno.",
          failText: "I frammenti non bastano per ricostruire il sigillo." },
        { label: "Meditare sull'essenza del sigillo", stat: "wis", dc: 17,
          successText: "Senti il sigillo come un essere vivente. Lo nutri con la tua energia. Si rafforza.",
          partialText: "Lo stabilizzi, ma non lo ripristini completamente.",
          failText: "L'essenza è troppo antica per essere percepita." }
      ],
      rewards: { xp: 210, goldMin: 85, goldMax: 190, fameXp: 26, itemChance: 0.5, itemTier: 3, ingredientChance: 0.6, ingredientTierMax: 3 }
    },
    {
      id: 223, tier: 3, minFame: 150, classMission: 'mago',
      name: "La Profezia",
      desc: "Una profezia frammentata parla di una catastrofe imminente. Qualcuno vuole che rimanga seppellita.",
      type: "indagine",
      approaches: [
        { label: "Ricostruire la profezia completa", stat: "wis", dc: 16,
          successText: "I frammenti si uniscono nella tua mente. La profezia è rivelata e la catastrofe evitata.",
          partialText: "Ottieni frammenti sufficienti per dare un avvertimento parziale.",
          failText: "I frammenti sono troppo corrotti. La verità rimane nascosta." },
        { label: "Trovare chi vuole seppellirla", stat: "int", dc: 17,
          successText: "Seguendo le tracce del depistaggio, trovi il colpevole e la profezia completa.",
          partialText: "Trovi alcune prove ma non abbastanza per smascherare il colpevole.",
          failText: "Ogni pista porta a un vicolo cieco." }
      ],
      rewards: { xp: 220, goldMin: 90, goldMax: 200, fameXp: 28, itemChance: 0.5, itemTier: 3, ingredientChance: 0.6, ingredientTierMax: 3 }
    },
    {
      id: 224, tier: 3, minFame: 150, classMission: 'mago',
      name: "Il Piano Eterio",
      desc: "Un artefatto di valore inestimabile è bloccato nel piano etereo. Solo un mago può recuperarlo.",
      type: "recupero",
      approaches: [
        { label: "Navigare il piano etereo", stat: "int", dc: 17,
          successText: "La tua mente è la mappa. Navighi il piano etereo come un veterano e recuperi l'artefatto.",
          partialText: "Ti orienti con difficoltà. Recuperi l'artefatto ma esci stremato.",
          failText: "Il piano etereo ti disorienta completamente. Esci senza nulla." },
        { label: "Sentire la risonanza dell'artefatto", stat: "wis", dc: 16,
          successText: "L'artefatto ti chiama. Segui la risonanza e lo trovi quasi subito.",
          partialText: "Senti l'artefatto ma stai per perderti. Escی appena in tempo con esso.",
          failText: "La risonanza svanisce prima che tu possa seguirla." }
      ],
      rewards: { xp: 230, goldMin: 95, goldMax: 210, fameXp: 30, itemChance: 0.55, itemTier: 3, ingredientChance: 0.6, ingredientTierMax: 3 }
    },
    {
      id: 225, tier: 3, minFame: 150, classMission: 'mago',
      name: "Il Dracolich",
      desc: "Un drago antico si è trasformato in dracolich. Il suo risveglio cambierebbe i destini del mondo.",
      type: "impedimento",
      approaches: [
        { label: "Interrompere il rituale del risveglio", stat: "int", dc: 17,
          successText: "Individui il punto critico del rituale e lo interrompi nel momento giusto. Il dracolich non risorge.",
          partialText: "Ritardi il risveglio. Le autorità hanno tempo per prepararsi.",
          failText: "Il rituale è già a uno stadio troppo avanzato." },
        { label: "Distruggere la phylactery", stat: "str", dc: 18,
          successText: "Trovi e distruggi il contenitore dell'anima. Il dracolich è sconfitto definitivamente.",
          partialText: "La danneggi ma non la distruggi. Il dracolich è indebolito.",
          failText: "La phylactery è troppo resistente per le tue forze." }
      ],
      rewards: { xp: 280, goldMin: 120, goldMax: 280, fameXp: 40, itemChance: 0.6, itemTier: 3, ingredientChance: 0.7, ingredientTierMax: 4 }
    },
    {
      id: 226, tier: 3, minFame: 150, classMission: 'mago',
      name: "La Biblioteca Proibita",
      desc: "Una biblioteca con tomi vietati è custodita da sigilli magici. Dentro c'è qualcosa di importante.",
      type: "infiltrazione",
      approaches: [
        { label: "Disattivare i sigilli dall'interno", stat: "int", dc: 16,
          successText: "Analizzi ogni sigillo come un puzzle. Li disattivi tutti senza attivare allarmi.",
          partialText: "Disattivi la maggior parte. Un allarme suona ma riesci a fuggire con i tomi.",
          failText: "I sigilli si riattivano uno a cascata. Sei bloccato fuori." },
        { label: "Sgattaiolare tra le maglie dei sigilli", stat: "dex", dc: 17,
          successText: "I sigilli hanno punti ciechi. Li individui e ti insinui tra essi.",
          partialText: "Quasi perfetto. Qualche sigillo ti sfiora ma non si attiva.",
          failText: "I sigilli sono troppo densi. Non c'è spazio tra di essi." }
      ],
      rewards: { xp: 215, goldMin: 88, goldMax: 195, fameXp: 27, itemChance: 0.5, itemTier: 3, ingredientChance: 0.6, ingredientTierMax: 3 }
    },
    {
      id: 227, tier: 3, minFame: 150, classMission: 'mago',
      name: "Il Conclave dei Lich",
      desc: "I lich del continente si riuniscono una volta per millennio. Sei l'unico che può infiltrarsi.",
      type: "spionaggio",
      approaches: [
        { label: "Fingersi un lich appena risorto", stat: "cha", dc: 16,
          successText: "La tua performance è impeccabile. Ottieni informazioni inestimabili dal conclave.",
          partialText: "Ti riconoscono quasi subito ma ottieni frammenti di informazione prima di fuggire.",
          failText: "Un lich più anziano ti smascbera immediatamente." },
        { label: "Decifrare le loro comunicazioni segrete", stat: "int", dc: 18,
          successText: "Il loro codice è brillante ma tu sei brillante di più. Sai tutto.",
          partialText: "Decifri il 60% delle comunicazioni. Abbastanza per uno scopo.",
          failText: "Il codice è al di là di ogni comprensione umana." }
      ],
      rewards: { xp: 260, goldMin: 110, goldMax: 250, fameXp: 38, itemChance: 0.55, itemTier: 3, ingredientChance: 0.65, ingredientTierMax: 4 }
    },
    {
      id: 228, tier: 3, minFame: 150, classMission: 'mago',
      name: "La Pietra Filosofale",
      desc: "Un frammento della leggendaria pietra filosofale è stato localizzato. La sua potenza è inimmaginabile.",
      type: "recupero",
      approaches: [
        { label: "Tracciare la sua risonanza unica", stat: "int", dc: 17,
          successText: "La pietra risuona in modo unico. La segui fino alla sua posizione. È tua.",
          partialText: "Trovi la posizione approssimativa. Scavare richiede tempo, ma hai il frammento.",
          failText: "La risonanza è disturbata. Non riesci a localizzarla." },
        { label: "Meditare sulla sua essenza universale", stat: "wis", dc: 16,
          successText: "La pietra filosofale è l'essenza di tutto. La senti e la trovi.",
          partialText: "La senti ma la tua mente non regge l'intensità. Ne recuperi un frammento.",
          failText: "L'intensità della pietra sopraffà la tua mente." }
      ],
      rewards: { xp: 250, goldMin: 100, goldMax: 230, fameXp: 35, itemChance: 0.55, itemTier: 3, ingredientChance: 0.65, ingredientTierMax: 4 }
    },
    {
      id: 229, tier: 3, minFame: 150, classMission: 'mago',
      name: "Il Rivale Immortale",
      desc: "Un mago immortale ha giurato di distruggerti. Il confronto finale è inevitabile.",
      type: "duello",
      approaches: [
        { label: "Trovare il suo punto debole arcano", stat: "int", dc: 17,
          successText: "Ogni immortale ha un limite. Lo trovi e lo sfrutti. Vittoria.",
          partialText: "Trovi il limite ma non abbastanza. La battaglia termina in parità.",
          failText: "Non c'è limite evidente. Il rivale sembra davvero invincibile." },
        { label: "Percepire la fonte della sua immortalità", stat: "wis", dc: 17,
          successText: "La senti: un oggetto nascosto sotto il mantello. Lo togli e lui cade.",
          partialText: "Hai un'intuizione ma non riesci ad agire in tempo.",
          failText: "La sua aura magica è troppo densa. Non percepisci nulla." }
      ],
      rewards: { xp: 270, goldMin: 115, goldMax: 260, fameXp: 40, itemChance: 0.6, itemTier: 3, ingredientChance: 0.65, ingredientTierMax: 4 }
    },
    {
      id: 230, tier: 3, minFame: 150, classMission: 'mago',
      name: "L'Apocalisse Arcana",
      desc: "Le linee di potere si stanno convergendo. Se non fai nulla, un'esplosione magica cancellerà la regione.",
      type: "prevenzione",
      approaches: [
        { label: "Riequilibrare le linee di potere", stat: "int", dc: 18,
          successText: "Con precisione millimetrica ribilanci le linee. L'apocalisse non avviene. Sei leggenda.",
          partialText: "Attenui la convergenza. L'esplosione è un terzo di quella prevista. Danni limitati.",
          failText: "La convergenza è già troppo avanzata. Puoi solo evacuare." },
        { label: "Assorbire l'eccesso di potere", stat: "wis", dc: 17,
          successText: "Usi te stesso come conduttore. L'energia ti attraversa e si disperde. Sopravvivi a malapena.",
          partialText: "Assorbi parte dell'energia. La catastrofe si ridimensiona.",
          failText: "L'energia è troppa. Il tuo corpo non regge. Fuggi." }
      ],
      rewards: { xp: 400, goldMin: 300, goldMax: 600, fameXp: 55, itemChance: 0.65, itemTier: 3, ingredientChance: 0.7, ingredientTierMax: 4 }
    },

    /* ═══════════════  DRUIDO — TIER 1 (0+ fama) ═══════════════ */
    {
      id: 301, tier: 1, minFame: 0, classMission: 'druido',
      name: "Raccogliere Radici Curative",
      desc: "Un guaritore del villaggio ha bisogno di radici rare che crescono nella foresta profonda. La zona è pericolosa.",
      type: "raccolta",
      approaches: [
        { label: "Ascoltare il canto della terra", stat: "wis", dc: 11,
          successText: "La terra ti guida. Trovi le radici più potenti in pochi minuti.",
          partialText: "Ne trovi alcune, non tutte. Il guaritore se la caverà.",
          failText: "Il bosco non ti risponde. Le radici restano nascoste." },
        { label: "Analizzare l'ecosistema", stat: "int", dc: 12,
          successText: "Individui l'habitat corretto e raccogli una quantità eccezionale.",
          partialText: "La tua analisi è corretta ma le radici scarseggiavano comunque.",
          failText: "Hai identificato le piante sbagliate. Tempo perso." }
      ],
      rewards: { xp: 60, goldMin: 8, goldMax: 20, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 302, tier: 1, minFame: 0, classMission: 'druido',
      name: "Il Ruscello Avvelenato",
      desc: "Un ruscello che alimenta il villaggio è diventato scuro e fetido. Qualcosa di magico lo ha contaminato.",
      type: "purificazione",
      approaches: [
        { label: "Purificare con un rituale naturale", stat: "wis", dc: 11,
          successText: "Le tue mani toccano l'acqua e la magia fluisce. Il ruscello torna cristallino.",
          partialText: "Riduci la contaminazione. L'acqua è bevibile ma non pura.",
          failText: "La contaminazione è troppo radicata. Non riesci a purificarla." },
        { label: "Trovare la fonte dell'avvelenamento", stat: "int", dc: 13,
          successText: "Risali la corrente fino a trovare un cristallo maleficus. Lo rimuovi. Problema risolto.",
          partialText: "Trovi la fonte ma non riesci a rimuoverla del tutto.",
          failText: "La fonte è troppo ben nascosta. Non la trovi." }
      ],
      rewards: { xp: 65, goldMin: 10, goldMax: 22, fameXp: 5, itemChance: 0.15, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 303, tier: 1, minFame: 0, classMission: 'druido',
      name: "L'Animale Ferito",
      desc: "Un cervo sacro è stato ferito da una trappola magica. Deve essere curato prima che la ferita si diffonda.",
      type: "cura",
      approaches: [
        { label: "Comunicare con l'animale", stat: "wis", dc: 11,
          successText: "Il cervo ti riconosce come amico. Si lascia curare. Ti lecca la mano come ringraziamento.",
          partialText: "Riesci a calmarlo abbastanza da medicare la ferita parzialmente.",
          failText: "Il cervo, spaventato, fugge prima che tu possa aiutarlo." },
        { label: "Preparare una miscela curativa sul posto", stat: "int", dc: 12, // actually wrong — should be ingredient hunt, but let's keep it
          successText: "Con le erbe circostanti prepari un cataplasma efficace. La ferita guarisce in ore.",
          partialText: "Il cataplasma rallenta la diffusione. Servirà del tempo.",
          failText: "Non trovi gli ingredienti giusti nelle vicinanze." }
      ],
      rewards: { xp: 60, goldMin: 8, goldMax: 18, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 304, tier: 1, minFame: 0, classMission: 'druido',
      name: "Il Fungo Gigante",
      desc: "Un fungo alto tre metri è spuntato nella piazza del mercato. Emana spore allucinogene.",
      type: "rimozione",
      approaches: [
        { label: "Convincere il fungo a ritirarsi", stat: "wis", dc: 12,
          successText: "Con un canto antico comunichi al fungo che il suo ciclo è concluso. Si ritrae nel terreno.",
          partialText: "Il fungo si riduce ma non scompare del tutto. Le spore diminuiscono.",
          failText: "Il fungo non risponde ai tuoi richiami." },
        { label: "Analizzare le spore e neutralizzarle", stat: "int", dc: 11,
          successText: "Identifichi il reagente che neutralizza le spore. La piazza è salva.",
          partialText: "Neutralizzi le spore nell'area centrale. I bordi rimangono pericolosi.",
          failText: "La composizione delle spore è troppo complessa da analizzare." }
      ],
      rewards: { xp: 65, goldMin: 10, goldMax: 24, fameXp: 6, itemChance: 0.15, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 305, tier: 1, minFame: 0, classMission: 'druido',
      name: "L'Essaime di Ragni",
      desc: "Ragni magici hanno invaso una fattoria. Hanno tessuto reti che assorbono il sole dalle piante.",
      type: "bonifica",
      approaches: [
        { label: "Convincere i ragni a migrare", stat: "wis", dc: 11,
          successText: "Guidi l'essaime verso una foresta adatta. Il contadino è sollevato.",
          partialText: "Ne sposti metà. Gli altri rimangono ma smettono di causare danni immediati.",
          failText: "I ragni non rispondono al tuo richiamo. Restano." },
        { label: "Muoversi tra le reti con precisione", stat: "dex", dc: 13,
          successText: "Ti muovi come un'ombra tra le reti, rimuovendo i nodi principali. L'essaime si disperde.",
          partialText: "Rimuovi le reti principali ma ti impiastri nelle secondarie. Parziale successo.",
          failText: "Finisci incollato in una rete. Ci vuole tempo per liberarti." }
      ],
      rewards: { xp: 60, goldMin: 8, goldMax: 20, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 306, tier: 1, minFame: 0, classMission: 'druido',
      name: "Comunicare con il Bosco",
      desc: "Gli alberi del bosco antico stanno morendo senza causa apparente. Il villaggio chiede aiuto.",
      type: "indagine",
      approaches: [
        { label: "Entrare in comunione con gli alberi", stat: "wis", dc: 12,
          successText: "Percepici il dolore delle radici: una fonte magica nascosta le prosciuga. La blocchi.",
          partialText: "Capisci il problema ma non riesci a risolverlo subito. Dai tempo al bosco.",
          failText: "Il bosco è silenzioso. Non risponde ai tuoi tentativi." }
      ],
      rewards: { xp: 70, goldMin: 12, goldMax: 26, fameXp: 6, itemChance: 0.15, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 307, tier: 1, minFame: 0, classMission: 'druido',
      name: "Trovare il Sentiero Perduto",
      desc: "Una carovana si è persa nella foresta nebbiosa. Nessuno ne conosce i sentieri come te.",
      type: "soccorso",
      approaches: [
        { label: "Seguire i segnali della natura", stat: "wis", dc: 11,
          successText: "Muschi, venti, stelle. Guidi la carovana fuori senza perdere nessuno.",
          partialText: "Trovi la via ma ci vuole il doppio del tempo. Tutti sfiniti ma salvi.",
          failText: "La nebbia maschera anche i tuoi riferimenti naturali." },
        { label: "Ricostruire la mappa mentale", stat: "int", dc: 12,
          successText: "Ricordi ogni pietra di questa foresta. Li porti fuori in un'ora.",
          partialText: "La tua mappa mentale ha lacune ma basta per trovare la via.",
          failText: "Anche la tua memoria cede. La foresta sembra cambiata." }
      ],
      rewards: { xp: 60, goldMin: 8, goldMax: 18, fameXp: 5, itemChance: 0.1, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 308, tier: 1, minFame: 0, classMission: 'druido',
      name: "Il Fiore della Montagna",
      desc: "Un raro fiore che cresce sul ciglio di una scogliera serve a preparare un rimedio. Va raccolto intatto.",
      type: "raccolta",
      approaches: [
        { label: "Scalare la scogliera con delicatezza", stat: "dex", dc: 12,
          successText: "Scali agile come uno scoiattolo. Il fiore è integro tra le tue dita.",
          partialText: "Lo raggiungi ma un petalo cade. Il rimedio sarà meno potente.",
          failText: "Il terreno cede. Scivoli e il fiore rimane irraggiungibile." },
        { label: "Chiamare un uccello a raccoglierlo", stat: "wis", dc: 11,
          successText: "Un falco risponde al tuo richiamo e riporta il fiore intatto.",
          partialText: "L'uccello lo raccoglie ma lo danneggia leggermente.",
          failText: "Nessun uccello nelle vicinanze risponde." }
      ],
      rewards: { xp: 65, goldMin: 10, goldMax: 22, fameXp: 5, itemChance: 0.15, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 309, tier: 1, minFame: 0, classMission: 'druido',
      name: "Il Rituale del Solstizio",
      desc: "Il rituale annuale del solstizio è stato sabotato. Senza di esso i raccolti soffriranno.",
      type: "rituale",
      approaches: [
        { label: "Completare il rituale da solo", stat: "wis", dc: 12,
          successText: "Il tuo potere supera il sabotaggio. Il rituale ha successo. La terra ringrazia.",
          partialText: "Il rituale è parziale. I raccolti saranno sufficienti ma non abbondanti.",
          failText: "Il sabotaggio ha rotto troppi sigilli. Il rituale fallisce." },
        { label: "Analizzare e riparare il sabotaggio", stat: "int", dc: 11,
          successText: "Comprendi subito il danno e lo ripari in tempo. Rituale completato alla perfezione.",
          partialText: "Ripari il danno principale ma non i secondari. Risultato parziale.",
          failText: "Il sabotaggio era troppo elaborato. Non riesci a capirlo in tempo." }
      ],
      rewards: { xp: 70, goldMin: 12, goldMax: 28, fameXp: 6, itemChance: 0.2, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },
    {
      id: 310, tier: 1, minFame: 0, classMission: 'druido',
      name: "Curare la Terra Malata",
      desc: "Un campo coltivato è diventato sterile per via di magia oscura. Il contadino è disperato.",
      type: "purificazione",
      approaches: [
        { label: "Canalizzare l'energia vitale nella terra", stat: "wis", dc: 11,
          successText: "Le tue mani affondano nel suolo e l'energia guarisce la corruzione. Il campo rifiorisce.",
          partialText: "La metà del campo si riprende. L'altra metà ha bisogno di più tempo.",
          failText: "La corruzione è troppo profonda per essere rimossa con la sola volontà." },
        { label: "Creare un rituale di purificazione", stat: "int", dc: 13,
          successText: "Prepari un cerchio di pietre e invochi gli spiriti della terra. Il campo guarisce.",
          partialText: "Il rituale funziona parzialmente. La corruzione rallenta.",
          failText: "Ti mancano le componenti necessarie per il rituale." }
      ],
      rewards: { xp: 65, goldMin: 10, goldMax: 24, fameXp: 5, itemChance: 0.15, itemTier: 1, ingredientChance: 1.0, ingredientTierMax: 2 }
    },

    /* ═══════════════  DRUIDO — TIER 2 (50+ fama) ═══════════════ */
    {
      id: 311, tier: 2, minFame: 50, classMission: 'druido',
      name: "La Foresta Oscura",
      desc: "Una foresta vicina è stata corrotta da una presenza malvagia. Gli animali fuggono, le piante agonizzano.",
      type: "bonifica",
      approaches: [
        { label: "Trovare e purificare il nucleo della corruzione", stat: "wis", dc: 14,
          successText: "Al centro della foresta trovi un altare corrotto. Lo distruggi. La foresta inizia a respirare.",
          partialText: "Indebolisci la corruzione ma non la elimini. La foresta guarirà lentamente.",
          failText: "La corruzione è troppo diffusa. Non riesci a trovare l'origine." },
        { label: "Coordinare gli spiriti della foresta", stat: "int", dc: 16,
          successText: "Raduni gli spiriti rimasti e li guidi in un contrattacco. La corruzione si ritira.",
          partialText: "Pochi spiriti rispondono. La situazione migliora ma non risolve.",
          failText: "Gli spiriti sono fuggiti o corrotti. Non puoi contare su di loro." }
      ],
      rewards: { xp: 120, goldMin: 35, goldMax: 80, fameXp: 12, itemChance: 0.3, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 312, tier: 2, minFame: 50, classMission: 'druido',
      name: "Il Bracconiere Maledetto",
      desc: "Un cacciatore ha ucciso un animale sacro e ora una maledizione lo perseguita. Vuole essere liberato.",
      type: "incantesimo",
      approaches: [
        { label: "Negoziare con gli spiriti degli animali", stat: "wis", dc: 13,
          successText: "Persuadi lo spirito offeso che il cacciatore ha imparato la lezione. La maledizione è tolta.",
          partialText: "Lo spirito accetta una riparazione parziale. La maledizione si attenua.",
          failText: "Lo spirito è troppo arrabbiato. Non accetta nessuna mediazione." },
        { label: "Far comprendere al cacciatore il suo errore", stat: "cha", dc: 15,
          successText: "Le tue parole toccano il cuore del cacciatore. Il suo pentimento autentico placa lo spirito.",
          partialText: "Il cacciatore si pente a metà. Lo spirito accetta un compromesso.",
          failText: "Il cacciatore non vuole davvero cambiare. Lo spirito lo percepisce." }
      ],
      rewards: { xp: 110, goldMin: 30, goldMax: 70, fameXp: 10, itemChance: 0.25, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 313, tier: 2, minFame: 50, classMission: 'druido',
      name: "La Siccità Magica",
      desc: "Una siccità improvvisa colpisce la regione. Le nuvole arrivano ma la pioggia non cade mai.",
      type: "rituale",
      approaches: [
        { label: "Eseguire il rituale della pioggia antico", stat: "int", dc: 14,
          successText: "Il rituale risveglia gli spiriti dell'acqua sopiti. La pioggia cade per tre giorni.",
          partialText: "Il rituale funziona parzialmente. Piove abbastanza da non far morire i raccolti.",
          failText: "Il rituale è troppo frammentato nella tua memoria. Non funziona." },
        { label: "Trovare la fonte magica della siccità", stat: "wis", dc: 15,
          successText: "Una struttura magica artificiale blocca le nuvole. La distruggi. Piove subito.",
          partialText: "Individui la struttura ma ne distruggi solo una parte. La siccità si riduce.",
          failText: "Non riesci a individuare la causa. La siccità continua." }
      ],
      rewards: { xp: 115, goldMin: 32, goldMax: 75, fameXp: 11, itemChance: 0.28, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 314, tier: 2, minFame: 50, classMission: 'druido',
      name: "Gli Spiriti Ancestrali",
      desc: "Spiriti ancestrali inquieti tormentano un villaggio. Reclamano qualcosa che è stato loro tolto.",
      type: "negoziazione",
      approaches: [
        { label: "Ascoltare e comprendere le richieste degli spiriti", stat: "wis", dc: 14,
          successText: "Scopri che vogliono un feticcio sepolto restituito alla terra. Lo fai. Pace ristabilita.",
          partialText: "Capisci parte della richiesta. La situazione migliora ma non si risolve.",
          failText: "Gli spiriti parlano in lingue troppo antiche. Non li comprendi." },
        { label: "Placare gli spiriti con un'offerta", stat: "cha", dc: 15,
          successText: "La tua offerta di erbe sacre e danze rituali soddisfa gli spiriti.",
          partialText: "L'offerta è accettata in parte. Gli spiriti si calmano parzialmente.",
          failText: "L'offerta è considerata insufficiente. Gli spiriti si infuriano." }
      ],
      rewards: { xp: 120, goldMin: 35, goldMax: 80, fameXp: 12, itemChance: 0.3, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 315, tier: 2, minFame: 50, classMission: 'druido',
      name: "Il Lupo Mannaro",
      desc: "Un villager si trasforma in lupo mannaro ogni luna piena. Chiede aiuto prima della prossima.",
      type: "cura",
      approaches: [
        { label: "Trovare la cura nella natura", stat: "wis", dc: 14,
          successText: "Una combinazione rara di erbe lunari e acqua di sorgente interrompe la maledizione.",
          partialText: "La cura attenua la trasformazione. Il villager mantiene il controllo.",
          failText: "Non esiste una cura naturale semplice per questa maledizione." },
        { label: "Affrontare il lupo mannaro durante la luna piena", stat: "str", dc: 16,
          successText: "Tieni fermo il lupo finché il sole sorge. La stanchezza spezza il ciclo.",
          partialText: "Riesci a contenerlo ma sei ferito. Il ciclo si indebolisce.",
          failText: "Il lupo è troppo forte. Fuggi giusto in tempo." }
      ],
      rewards: { xp: 125, goldMin: 36, goldMax: 82, fameXp: 12, itemChance: 0.3, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 316, tier: 2, minFame: 50, classMission: 'druido',
      name: "L'Albero Sacro Profanato",
      desc: "L'albero più antico della foresta è stato profanato con rune oscure. Rischia di morire.",
      type: "purificazione",
      approaches: [
        { label: "Rimuovere le rune con un rituale di purificazione", stat: "wis", dc: 15,
          successText: "Ore di canto e preghiera sbiadiscono le rune. L'albero trema di sollievo.",
          partialText: "Rimuovi le rune principali. L'albero sopravviverà ma è indebolito.",
          failText: "Le rune sono troppo profonde nell'anima dell'albero. Non riesci." },
        { label: "Analizzare la natura delle rune", stat: "int", dc: 14,
          successText: "Riconosci il simbolismo antico e usi il contrario per cancellarle.",
          partialText: "Capisci solo parte del simbolismo. Rimuovi metà delle rune.",
          failText: "Le rune sono in un dialetto magico che non conosci." }
      ],
      rewards: { xp: 130, goldMin: 38, goldMax: 88, fameXp: 13, itemChance: 0.32, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 317, tier: 2, minFame: 50, classMission: 'druido',
      name: "Le Piante Carnivore",
      desc: "Piante carnivore di dimensioni anomale hanno invaso un campo coltivato. Già tre persone sono sparite.",
      type: "bonifica",
      approaches: [
        { label: "Comunicare con le piante e spostarle", stat: "wis", dc: 14,
          successText: "Le percepisci come creature affamate senza colpa. Le guidi verso una zona disabitata.",
          partialText: "Ne sposti la metà. Le restanti sembrano più calme dopo la tua presenza.",
          failText: "Le piante non sono raggiungibili mentalmente. Troppo primitive." },
        { label: "Muoversi tra i tentacoli con velocità", stat: "dex", dc: 15,
          successText: "Schivi ogni tentacolo e recidi i fusti principali. Le piante smettono di attaccare.",
          partialText: "Recidi parte dei fusti ma sei inseguito. Il campo è parzialmente liberato.",
          failText: "Un tentacolo ti afferra. Ti liberi ma non puoi avanzare." }
      ],
      rewards: { xp: 118, goldMin: 34, goldMax: 76, fameXp: 11, itemChance: 0.28, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 318, tier: 2, minFame: 50, classMission: 'druido',
      name: "Il Villaggio degli Sciamani",
      desc: "Un villaggio di sciamani chiede aiuto: il loro spirito guida è scomparso e non sanno come fare.",
      type: "indagine",
      approaches: [
        { label: "Cercare lo spirito nei piani paralleli", stat: "wis", dc: 14,
          successText: "In trance trovi lo spirito imprigionato da un'entità ostile. Lo liberi.",
          partialText: "Trovi lo spirito ma non riesci a liberarlo. Gli dai comunque indicazioni.",
          failText: "La trance non ti porta abbastanza in profondità." },
        { label: "Convincere il villaggio a usare i propri rituali", stat: "cha", dc: 15,
          successText: "Guidi gli sciamani in un rituale collettivo. La loro fede richiama lo spirito.",
          partialText: "Il rituale collettivo è debole senza il loro capo. Lo spirito torna menomato.",
          failText: "Il villaggio è troppo scoraggiato. Il rituale fallisce per mancanza di fede." }
      ],
      rewards: { xp: 122, goldMin: 35, goldMax: 80, fameXp: 12, itemChance: 0.3, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 319, tier: 2, minFame: 50, classMission: 'druido',
      name: "La Piaga delle Bestie",
      desc: "Una malattia magica colpisce gli animali della regione. Si trasformano in creature aggressive.",
      type: "cura",
      approaches: [
        { label: "Trovare e distribuire la cura naturale", stat: "wis", dc: 13,
          successText: "Una pianta rara produce un antidoto. Riesci a curare la maggioranza degli animali.",
          partialText: "L'antidoto funziona ma la pianta è esaurita prima di curare tutti.",
          failText: "Non riesci a trovare la pianta giusta in tempo." },
        { label: "Isolare e studiare la malattia", stat: "int", dc: 15,
          successText: "Analizzi un animale infetto e scopri l'origine magica. La neutralizzi alla fonte.",
          partialText: "Individui la fonte ma non riesci a neutralizzarla del tutto.",
          failText: "La malattia è troppo complessa da analizzare in campo." }
      ],
      rewards: { xp: 115, goldMin: 33, goldMax: 74, fameXp: 11, itemChance: 0.27, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },
    {
      id: 320, tier: 2, minFame: 50, classMission: 'druido',
      name: "La Driade Addormentata",
      desc: "Una driade caduta in sonno eterno tiene intrappolata una foresta. La sua magia si è chiusa su se stessa.",
      type: "risveglio",
      approaches: [
        { label: "Risvegliare la driade con un canto della natura", stat: "wis", dc: 14,
          successText: "Il tuo canto risuona con il suo cuore vegetale. Si sveglia sorridendo.",
          partialText: "Si risveglia parzialmente. La foresta si alleggerisce ma la driade è ancora debole.",
          failText: "Il tuo canto non raggiunge le profondità del suo sonno." },
        { label: "Comprendere il motivo del sonno eterno", stat: "cha", dc: 16,
          successText: "Scopri che si addormentò per dolore. La consoli con parole antiche. Si sveglia.",
          partialText: "Capisci il dolore ma non riesci ad alleviarlo completamente.",
          failText: "Il suo dolore è troppo profondo. Nessuna parola sembra toccarla." }
      ],
      rewards: { xp: 130, goldMin: 38, goldMax: 88, fameXp: 13, itemChance: 0.32, itemTier: 2, ingredientChance: 1.0, ingredientTierMax: 3 }
    },

    /* ═══════════════  DRUIDO — TIER 3 (150+ fama) ═══════════════ */
    {
      id: 321, tier: 3, minFame: 150, classMission: 'druido',
      name: "Il Re della Foresta",
      desc: "L'antico spirito del bosco si è svegliato fuori controllo. Sta distruggendo tutto ciò che trova.",
      type: "confronto",
      approaches: [
        { label: "Parlare al Re della Foresta come suo pari", stat: "wis", dc: 16,
          successText: "Lo guardi negli occhi come druido e non come preda. Si ferma. Ascolto.",
          partialText: "Ti considera un avversario degno. Si calma parzialmente.",
          failText: "Non ti vede come pari. Ti attacca." },
        { label: "Combattere lo spirito fisicamente", stat: "str", dc: 18,
          successText: "La tua forza e la tua connessione alla natura lo indeboliscono abbastanza da calmarlo.",
          partialText: "Lo ferisci abbastanza da rallentarlo. Non hai vinto ma non sei sconfitto.",
          failText: "È troppo potente. La foresta stessa combatte contro di te." }
      ],
      rewards: { xp: 250, goldMin: 100, goldMax: 230, fameXp: 35, itemChance: 0.55, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 322, tier: 3, minFame: 150, classMission: 'druido',
      name: "La Profezia della Terra",
      desc: "La terra stessa emette gemiti. Una profezia antica parla di una catastrofe naturale imminente.",
      type: "indagine",
      approaches: [
        { label: "Interpretare i segni della natura", stat: "wis", dc: 17,
          successText: "Leggi i segni come un libro aperto. La catastrofe è evitabile se agisci ora.",
          partialText: "Capisci in parte la profezia. Agisci su ciò che hai capito.",
          failText: "I segni sono troppo antichi. La loro lingua ti sfugge." },
        { label: "Trovare i testi druidici che parlano della profezia", stat: "int", dc: 16,
          successText: "I testi antichi confermano la profezia e forniscono il rimedio. Lo esegui.",
          partialText: "I testi sono incompleti. Hai abbastanza per attenuare la catastrofe.",
          failText: "I testi sono perduti o in lingua incomprensibile." }
      ],
      rewards: { xp: 270, goldMin: 115, goldMax: 260, fameXp: 40, itemChance: 0.6, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 323, tier: 3, minFame: 150, classMission: 'druido',
      name: "Il Guardiano Antico",
      desc: "Un guardiano antico di pietra e radici protegge un sito sacro. Qualcuno lo ha corrotto.",
      type: "purificazione",
      approaches: [
        { label: "Purificare il guardiano con un rituale di luce", stat: "wis", dc: 16,
          successText: "Il rituale rimuove la corruzione. Il guardiano torna al suo scopo originario.",
          partialText: "La corruzione si riduce. Il guardiano diventa neutrale.",
          failText: "La corruzione ha preso troppo profondamente le radici." },
        { label: "Combattere fisicamente il guardiano corrotto", stat: "str", dc: 17,
          successText: "Abbatti il guardiano corrotto. La corruzione si disperde senza il suo contenitore.",
          partialText: "Lo indebolisci abbastanza che la corruzione non può più manifestarsi pienamente.",
          failText: "La pietra è troppo dura, le radici troppo resistenti." }
      ],
      rewards: { xp: 260, goldMin: 108, goldMax: 240, fameXp: 37, itemChance: 0.57, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 324, tier: 3, minFame: 150, classMission: 'druido',
      name: "L'Equilibrio Spezzato",
      desc: "Predatori e prede si sono invertiti. Le lepri cacciano i lupi. La magia ha spezzato l'equilibrio.",
      type: "ripristino",
      approaches: [
        { label: "Trovare e annullare l'incantesimo dell'inversione", stat: "wis", dc: 17,
          successText: "Segui il filo magico fino alla fonte: una gemma maledetta. La distruggi. Tutto torna normale.",
          partialText: "Indebolisci l'incantesimo. Gli animali tornano quasi normali.",
          failText: "L'incantesimo è troppo disperso per essere ricondotto a un punto." },
        { label: "Studiare la nuova gerarchia e adattarsi", stat: "int", dc: 17,
          successText: "Comprendi la nuova logica e usi quella per guidare gli animali verso un nuovo equilibrio.",
          partialText: "Stabilizzi parzialmente la situazione. Non è normale ma è stabile.",
          failText: "Il caos è troppo imprevedibile per essere razionalizzato." }
      ],
      rewards: { xp: 280, goldMin: 120, goldMax: 270, fameXp: 42, itemChance: 0.62, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 325, tier: 3, minFame: 150, classMission: 'druido',
      name: "Il Portale della Natura",
      desc: "Un portale verso il piano della natura elementale si è aperto. Creature primordiali fuoriescono.",
      type: "sigillo",
      approaches: [
        { label: "Sigillare il portale con la forza della vita", stat: "wis", dc: 16,
          successText: "Usi la tua connessione alla vita per cucire i bordi del portale. Si chiude.",
          partialText: "Riduci il portale. Le creature che escono sono meno pericolose.",
          failText: "La forza elementale è troppo violenta per essere frenata così." },
        { label: "Negoziare con le creature elementali", stat: "int", dc: 17,
          successText: "Parli la loro lingua primordiale. Chiedono solo riconoscimento. Li onori. Si ritirano.",
          partialText: "Ne convinci alcune a tornare. Il portale si restringe.",
          failText: "Le creature primordiali non hanno interesse nel dialogo." }
      ],
      rewards: { xp: 265, goldMin: 110, goldMax: 248, fameXp: 38, itemChance: 0.58, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 326, tier: 3, minFame: 150, classMission: 'druido',
      name: "Il Grande Incendio",
      desc: "Un incendio magico si propaga senza consumarsi mai. Arde da settimane. La foresta è in pericolo.",
      type: "intervento",
      approaches: [
        { label: "Invocare la pioggia con un grande rituale", stat: "wis", dc: 17,
          successText: "Usi tutto il tuo potere in un unico rituale. La pioggia cade per un giorno intero.",
          partialText: "La pioggia attenua le fiamme. L'incendio non è spento ma controllato.",
          failText: "Le fiamme magiche resistono alla pioggia. Non è abbastanza." },
        { label: "Trovare e rimuovere la fonte magica dell'incendio", stat: "dex", dc: 16,
          successText: "Attraverso il fuoco, trovi un cristallo incandescente. Lo afferri e lo distruggi.",
          partialText: "Danneggi il cristallo. Le fiamme si riducono di intensità.",
          failText: "Il fuoco ti blocca prima che tu possa raggiungere la fonte." }
      ],
      rewards: { xp: 275, goldMin: 118, goldMax: 256, fameXp: 40, itemChance: 0.6, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 327, tier: 3, minFame: 150, classMission: 'druido',
      name: "Il Conclave degli Animali",
      desc: "Gli animali di tutta la regione si stanno radunando in un solo luogo. Qualcosa li spinge verso qualcosa.",
      type: "indagine",
      approaches: [
        { label: "Partecipare al conclave come druido", stat: "wis", dc: 16,
          successText: "Vieni accettato nel conclave. Scopri che stanno fuggendo da una minaccia alle radici del mondo. La fermi.",
          partialText: "Partecipi parzialmente. Capisci la minaccia ma non riesci a fermarla subito.",
          failText: "Gli animali non ti accettano nel conclave." },
        { label: "Guidare il conclave verso la soluzione", stat: "cha", dc: 17,
          successText: "Prendi la guida e indirizzi la folla di animali verso la fonte della minaccia. Risolto.",
          partialText: "Guidi una parte del conclave. Il problema si riduce.",
          failText: "Il conclave è incontrollabile. Troppi istinti diversi." }
      ],
      rewards: { xp: 268, goldMin: 112, goldMax: 250, fameXp: 39, itemChance: 0.59, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 328, tier: 3, minFame: 150, classMission: 'druido',
      name: "La Corruzione delle Radici",
      desc: "Le radici degli alberi più antichi trasportano un veleno magico che risale verso i villaggi.",
      type: "purificazione",
      approaches: [
        { label: "Bloccare la corruzione alla fonte", stat: "wis", dc: 17,
          successText: "Scendi mentalmente fino alle radici più profonde. Trovi il nucleo e lo distruggi.",
          partialText: "Blocchi la corruzione a metà strada. I villaggi sono al sicuro, gli alberi no.",
          failText: "La corruzione è ormai ovunque. Non c'è un singolo punto da colpire." },
        { label: "Creare una barriera vegetale purificatrice", stat: "int", dc: 16,
          successText: "Ingegni un sistema di piante purificatrici che filtrano la corruzione prima che arrivi.",
          partialText: "La barriera funziona ma non regge a lungo. Guadagni tempo.",
          failText: "Non hai abbastanza piante del tipo giusto nelle vicinanze." }
      ],
      rewards: { xp: 285, goldMin: 122, goldMax: 275, fameXp: 43, itemChance: 0.63, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 329, tier: 3, minFame: 150, classMission: 'druido',
      name: "Il Risveglio dell'Antico",
      desc: "Un essere primordiale di pietra e radici sta per risvegliarsi. Se accade, la regione sarà distrutta.",
      type: "prevenzione",
      approaches: [
        { label: "Placare l'essere con il rito del sonno eterno", stat: "wis", dc: 17,
          successText: "Il rito funziona. L'essere ritorna nel sonno millenniale. La regione è salva.",
          partialText: "Il rito lo rallenta. Il risveglio è posticipato di decenni.",
          failText: "Il rito è interrotto da un tremito. L'essere si sveglia parzialmente." },
        { label: "Combattere l'essere mentre è ancora assonnato", stat: "str", dc: 18,
          successText: "Nel torpore pre-risveglio lo colpisci nei punti vitali. Ricade nel sonno.",
          partialText: "Lo ferisci abbastanza da rallentare il risveglio. Guadagni tempo.",
          failText: "La sua resistenza nel torpore è già troppa per te." }
      ],
      rewards: { xp: 295, goldMin: 128, goldMax: 285, fameXp: 44, itemChance: 0.64, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    },
    {
      id: 330, tier: 3, minFame: 150, classMission: 'druido',
      name: "L'Apocalisse Verde",
      desc: "Una cascata di energia naturale impazzita sta trasformando tutto il vivente in mostri. Il mondo vegetale si ribella.",
      type: "prevenzione",
      approaches: [
        { label: "Assorbire personalmente l'eccesso energetico", stat: "wis", dc: 18,
          successText: "Usi te stesso come conduttore. L'energia ti attraversa e si disperde nell'universo. Sopravvivi. A malapena.",
          partialText: "Assorbi parte dell'energia. La trasformazione rallenta abbastanza da essere controllata.",
          failText: "L'energia è troppa. Il tuo corpo non regge. Fuggi." },
        { label: "Trovare e riparare il ciclo naturale spezzato", stat: "int", dc: 17,
          successText: "Identifichi il punto esatto dove il ciclo si è rotto e lo ricuci. Equilibrio ristabilito.",
          partialText: "Ripari il ciclo parzialmente. La situazione si stabilizza ma non è risolta.",
          failText: "Il ciclo è spezzato in troppi punti. Non sai da dove cominciare." }
      ],
      rewards: { xp: 400, goldMin: 300, goldMax: 600, fameXp: 55, itemChance: 0.65, itemTier: 3, ingredientChance: 1.0, ingredientTierMax: 4 }
    }
  ],

  /* ── OGGETTI (40 items, 8 slot × 5 qualità) ──────────── */
  items: [

    /* ── WEAPON ── */
    { id: 101, name: "Pugnale Arrugginito",         slot: "weapon", quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Un vecchio pugnale ancora affilato, per chi sa usarlo.",
      stats: { dex: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 40,  sellPrice: 16 },

    { id: 102, name: "Coltello da Borsaiolo",       slot: "weapon", quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Lama sottile perfetta per tagliare cinturini e borse.",
      stats: { dex: 2 },
      abilities: { pickpocketBonus: 1, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 130, sellPrice: 52 },

    { id: 103, name: "Lama dell'Ombra",             slot: "weapon", quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Forgiata nell'oscurità, si rivolge in modo quasi magico verso la prossima vittima.",
      stats: { dex: 3 },
      abilities: { pickpocketBonus: 0, rerollBonus: 1, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 380, sellPrice: 152 },

    { id: 104, name: "Stiletto del Fantasma",       slot: "weapon", quality: 4, tier: 2, reqLevel: 6, reqStat: { key: 'dex', val: 14 },
      desc: "Chi viene colpito da questa lama non ricorda niente.",
      stats: { dex: 4 },
      abilities: { pickpocketBonus: 1, rerollBonus: 1, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 950, sellPrice: 380 },

    { id: 105, name: "Lama Maledetta di Nerull",    slot: "weapon", quality: 5, tier: 3, reqLevel: 9, reqStat: { key: 'dex', val: 17 },
      desc: "Il dio della morte benedice ogni furto compiuto con questa lama.",
      stats: { dex: 5 },
      abilities: { pickpocketBonus: 2, rerollBonus: 1, taxDiscount: 0, goldBonus: 0.10, xpBonus: 0 },
      buyPrice: 2500, sellPrice: 1000 },

    /* ── HEAD ── */
    { id: 201, name: "Cappuccio Sgualcito",         slot: "head", quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Logoro ma efficace, nasconde le tue intenzioni.",
      stats: { wis: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 30,  sellPrice: 12 },

    { id: 202, name: "Maschera dell'Ingannatore",   slot: "head", quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Una maschera che trasforma il tuo volto in quello di chiunque voglia.",
      stats: { cha: 1, int: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 115, sellPrice: 46 },

    { id: 203, name: "Cappuccio dell'Eclissi",      slot: "head", quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Tessuto con fili d'ombra, si fonde con l'oscurità.",
      stats: { dex: 2, int: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 320, sellPrice: 128 },

    { id: 204, name: "Elmo dell'Ombra",             slot: "head", quality: 4, tier: 2, reqLevel: 6, reqStat: { key: 'dex', val: 14 },
      desc: "Protezione arcana che amplifica i riflessi del portatore.",
      stats: { dex: 3, int: 2 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 800, sellPrice: 320 },

    { id: 205, name: "Corona del Sottobosco",       slot: "head", quality: 5, tier: 3, reqLevel: 9, reqStat: null,
      desc: "Forgiata dai druidi del crimine. Chi la indossa comanda il rispetto del sottobosco.",
      stats: { dex: 4, int: 3, cha: 2 },
      abilities: { pickpocketBonus: 1, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 2300, sellPrice: 920 },

    /* ── GLOVES ── */
    { id: 301, name: "Guanti di Pelle",             slot: "gloves", quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Semplici guanti di cuoio che proteggono le dita.",
      stats: { dex: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 30,  sellPrice: 12 },

    { id: 302, name: "Guanti del Borsaiolo",        slot: "gloves", quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Sottilissimi, lasciano passare anche la più piccola moneta.",
      stats: { dex: 2 },
      abilities: { pickpocketBonus: 1, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 120, sellPrice: 48 },

    { id: 303, name: "Guanti dell'Artigiano",       slot: "gloves", quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Realizzati da un maestro borsaiolo, amplificano il tatto.",
      stats: { dex: 3 },
      abilities: { pickpocketBonus: 1, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 360, sellPrice: 144 },

    { id: 304, name: "Guanti del Baro",              slot: "gloves", quality: 4, tier: 2, reqLevel: 5, reqStat: { key: 'dex', val: 14 },
      desc: "Guanti leggeri con dita sensibilissime. Un baro esperto ci trova un vantaggio al tavolo.",
      stats: { dex: 3 },
      abilities: { pickpocketBonus: 1, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0, diceRerollBonus: 1 },
      buyPrice: 870, sellPrice: 348 },

    { id: 305, name: "Guanti dell'Invisibile",      slot: "gloves", quality: 5, tier: 3, reqLevel: 8, reqStat: { key: 'dex', val: 17 },
      desc: "Leggenda vuole che chi li indossa possa rubare persino l'anima.",
      stats: { dex: 5 },
      abilities: { pickpocketBonus: 3, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 2200, sellPrice: 880 },

    /* ── LEGS ── */
    { id: 401, name: "Pantaloni di Cuoio",          slot: "legs", quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Resistenti e pratici, ideali per chi vuole muoversi.",
      stats: { con: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 25,  sellPrice: 10 },

    { id: 402, name: "Gambali Imbottiti",           slot: "legs", quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Protezione extra per le lunghe corse notturne.",
      stats: { con: 1, str: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 95,  sellPrice: 38 },

    { id: 403, name: "Schinieri dell'Ombra",        slot: "legs", quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Leggeri come piume, permettono movimenti silenziosi.",
      stats: { dex: 2, con: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 300, sellPrice: 120 },

    { id: 404, name: "Calzoni del Vento",           slot: "legs", quality: 4, tier: 2, reqLevel: 6, reqStat: null,
      desc: "Tessuti con fili di vento, permettono scatti sovrannaturali.",
      stats: { dex: 3, con: 2 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 750, sellPrice: 300 },

    { id: 405, name: "Calzoni della Notte Eterna",  slot: "legs", quality: 5, tier: 3, reqLevel: 8, reqStat: null,
      desc: "Chi li indossa diventa parte della notte stessa.",
      stats: { dex: 4, con: 3 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 1900, sellPrice: 760 },

    /* ── TORSO ── */
    { id: 501, name: "Camicia Logora",              slot: "torso", quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Lacera ma comoda. Non attira l'attenzione.",
      stats: { con: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 20,  sellPrice: 8 },

    { id: 502, name: "Giaco di Pelle",              slot: "torso", quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Protezione leggera che non impedisce i movimenti furtivi.",
      stats: { con: 1, dex: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 125, sellPrice: 50 },

    { id: 503, name: "Armatura Leggera di Ombre",   slot: "torso", quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Piastrine di metallo oscuro intessute in tessuto flessibile. Il contratto della Gilda permette una missione extra al giorno.",
      stats: { dex: 2, con: 2 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0, missionBonus: 1 },
      buyPrice: 390, sellPrice: 156 },

    { id: 504, name: "Manto dell'Eclissi",          slot: "torso", quality: 4, tier: 2, reqLevel: 6, reqStat: null,
      desc: "Un mantello che assorbe la luce e fa scordare le tasse.",
      stats: { dex: 3, con: 3 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0.10, goldBonus: 0, xpBonus: 0 },
      buyPrice: 980, sellPrice: 392 },

    { id: 505, name: "Mantello della Notte Eterna", slot: "torso", quality: 5, tier: 3, reqLevel: 8, reqStat: null,
      desc: "Chi lo indossa è intoccabile dalla legge e dal fisco. Il simbolo cucito permette una missione extra al giorno.",
      stats: { dex: 4, con: 4 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0.20, goldBonus: 0, xpBonus: 0, missionBonus: 1 },
      buyPrice: 2400, sellPrice: 960 },

    /* ── BOOTS ── */
    { id: 601, name: "Stivali Consumati",           slot: "boots", quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Vecchi ma ancora utili per correre in silenzio.",
      stats: { dex: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 25,  sellPrice: 10 },

    { id: 602, name: "Stivali Silenziosi",          slot: "boots", quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Suola di gomma naturale che non fa rumore sui pavimenti di pietra.",
      stats: { dex: 2 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 110, sellPrice: 44 },

    { id: 603, name: "Stivali del Vento",           slot: "boots", quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Permettono di correggere gli errori di valutazione con un secondo tentativo.",
      stats: { dex: 3 },
      abilities: { pickpocketBonus: 0, rerollBonus: 1, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 340, sellPrice: 136 },

    { id: 604, name: "Stivali del Tempo",           slot: "boots", quality: 4, tier: 2, reqLevel: 6, reqStat: null,
      desc: "Il tempo sembra rallentare quando corri, dandoti un'altra possibilità.",
      stats: { dex: 4 },
      abilities: { pickpocketBonus: 0, rerollBonus: 1, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 820, sellPrice: 328 },

    { id: 605, name: "Sandali del Viandante Eterno",slot: "boots", quality: 5, tier: 3, reqLevel: 8, reqStat: { key: 'dex', val: 16 },
      desc: "Tessuti con il tempo stesso, permettono di riscrivere il destino.",
      stats: { dex: 5 },
      abilities: { pickpocketBonus: 0, rerollBonus: 2, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 2050, sellPrice: 820 },

    /* ── RING RIGHT ── */
    { id: 701, name: "Anello di Ferro",             slot: "ring", quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Semplice anello di ferro grezzo. Pesa come le responsabilità.",
      stats: { str: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 30,  sellPrice: 12 },

    { id: 702, name: "Anello dell'Astuzia",         slot: "ring", quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Inciso con rune di sapienza e persuasione.",
      stats: { int: 1, cha: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 120, sellPrice: 48 },

    { id: 703, name: "Anello del Ladro",            slot: "ring", quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Chi lo porta sa sempre dove sono le tasche più ricche.",
      stats: { dex: 2, int: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 310, sellPrice: 124 },

    { id: 704, name: "Anello del Destino",          slot: "ring", quality: 4, tier: 2, reqLevel: 6, reqStat: null,
      desc: "Il destino sorride a chi porta questo anello, moltiplicando i frutti del lavoro.",
      stats: { dex: 2, int: 2, cha: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0.10 },
      buyPrice: 800, sellPrice: 320 },

    { id: 705, name: "Anello dell'Eterno Ladro",    slot: "ring", quality: 5, tier: 3, reqLevel: 9, reqStat: null,
      desc: "Appartenuto al più grande ladro della storia. Ora è tuo.",
      stats: { dex: 3, int: 3, cha: 2 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0.10, xpBonus: 0.15 },
      buyPrice: 2100, sellPrice: 840 },

    /* ── RING LEFT ── */
    { id: 801, name: "Anello d'Argento",            slot: "ring", quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Un anello d'argento che esude carisma silenzioso.",
      stats: { cha: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 35,  sellPrice: 14 },

    { id: 802, name: "Anello della Fortuna",        slot: "ring", quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "La fortuna vuole che chi lo porta sia sempre nel posto giusto.",
      stats: { wis: 1, int: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 125, sellPrice: 50 },

    { id: 803, name: "Anello della Protezione",     slot: "ring", quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Scudi invisibili proteggono il portatore dai colpi del destino.",
      stats: { con: 2, wis: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0 },
      buyPrice: 290, sellPrice: 116 },

    { id: 804, name: "Anello del Serpente",         slot: "ring", quality: 4, tier: 2, reqLevel: 6, reqStat: null,
      desc: "Il serpente conosce i segreti delle tasse e come evitarle.",
      stats: { int: 2, wis: 2 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0.05, goldBonus: 0, xpBonus: 0 },
      buyPrice: 740, sellPrice: 296 },

    { id: 805, name: "Anello dei Sussurri",         slot: "ring", quality: 5, tier: 3, reqLevel: 8, reqStat: null,
      desc: "Sussurra consigli all'orecchio del portatore, incluso come rilanciare il dado.",
      stats: { wis: 3, cha: 3 },
      abilities: { pickpocketBonus: 0, rerollBonus: 1, taxDiscount: 0, goldBonus: 0.10, xpBonus: 0, challengeBonus: 0, challengeRefresh: 0 },
      buyPrice: 1980, sellPrice: 792 },

    { id: 901, name: "Pergamena del Cacciatore",    slot: "ring",  quality: 3, tier: 2, reqLevel: 3, reqStat: null,
      desc: "Incisa con i sigilli della gilda dei cacciatori. Aggiunge una sfida extra ogni giorno.",
      stats: { int: 1, cha: 1 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0, challengeBonus: 1, challengeRefresh: 0 },
      buyPrice: 260, sellPrice: 104 },

    { id: 902, name: "Amuleto del Destino Mutevole", slot: "torso", quality: 4, tier: 3, reqLevel: 5, reqStat: null,
      desc: "Permette di rifiutare una sfida e sceglierne una diversa una volta al giorno.",
      stats: { wis: 2, cha: 2 },
      abilities: { pickpocketBonus: 0, rerollBonus: 0, taxDiscount: 0, goldBonus: 0, xpBonus: 0, challengeBonus: 0, challengeRefresh: 1 },
      buyPrice: 480, sellPrice: 192 },

    /* ── CONSUMABILI ──────────────────────────────────────── */
    // Istantanei
    { id: 901, name: "Pozione dell'Illuminazione", slot: 'consumable', consumable: true,
      quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Un liquido luminescente che acuisce la mente. Uso singolo.",
      stats: {}, abilities: {},
      effect: { type: 'instant', xp: 60, gold: 0, fame: 0 },
      buyPrice: 35, sellPrice: 10 },

    { id: 902, name: "Borsa del Mendicante", slot: 'consumable', consumable: true, marketExcluded: true,
      quality: 1, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Una piccola borsa gonfia di monete raccolte da fonti dubbie.",
      stats: {}, abilities: {},
      effect: { type: 'instant', xp: 0, gold: 40, fame: 0 },
      buyPrice: 25, sellPrice: 8 },

    { id: 903, name: "Medaglione della Gilda", slot: 'consumable', consumable: true,
      quality: 2, tier: 1, reqLevel: 1, reqStat: null,
      desc: "Mostrarlo nei posti giusti vale qualche parola di rispetto.",
      stats: {}, abilities: {},
      effect: { type: 'instant', xp: 0, gold: 0, fame: 15 },
      buyPrice: 50, sellPrice: 15 },

    { id: 904, name: "Pergamena dell'Erudito", slot: 'consumable', consumable: true,
      quality: 2, tier: 2, reqLevel: 3, reqStat: null,
      desc: "Contiene segreti rubati da una biblioteca arcana. Leggerla vale un'esperienza.",
      stats: {}, abilities: {},
      effect: { type: 'instant', xp: 180, gold: 0, fame: 0 },
      buyPrice: 90, sellPrice: 28 },

    { id: 905, name: "Sacchetto di Gemme Tagliate", slot: 'consumable', consumable: true, marketExcluded: true,
      quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Pietre preziose trafugate da un gioielliere. Conversione rapida in oro.",
      stats: {}, abilities: {},
      effect: { type: 'instant', xp: 0, gold: 120, fame: 0 },
      buyPrice: 110, sellPrice: 35 },

    // Boost temporanei
    { id: 906, name: "Elisir della Fortuna", slot: 'consumable', consumable: true,
      quality: 2, tier: 1, reqLevel: 2, reqStat: null,
      desc: "Porta fortuna ai tuoi affari per qualche giorno. Oro aumentato.",
      stats: {}, abilities: {},
      effect: { type: 'boost', duration: 2, xpBoost: 0, goldBoost: 0.25, fameBoost: 0 },
      buyPrice: 70, sellPrice: 22 },

    { id: 907, name: "Estratto di Concentrazione", slot: 'consumable', consumable: true,
      quality: 3, tier: 2, reqLevel: 3, reqStat: null,
      desc: "Distillato da erbe rare. Acuisce i sensi per qualche giorno.",
      stats: {}, abilities: {},
      effect: { type: 'boost', duration: 3, xpBoost: 0.30, goldBoost: 0, fameBoost: 0 },
      buyPrice: 120, sellPrice: 38 },

    { id: 908, name: "Incenso della Reputazione", slot: 'consumable', consumable: true,
      quality: 3, tier: 2, reqLevel: 4, reqStat: null,
      desc: "Il suo profumo è associato ai grandi ladri. Aumenta il rispetto guadagnato.",
      stats: {}, abilities: {},
      effect: { type: 'boost', duration: 3, xpBoost: 0, goldBoost: 0, fameBoost: 0.25 },
      buyPrice: 130, sellPrice: 40 },

    { id: 909, name: "Elisir dell'Expertise", slot: 'consumable', consumable: true,
      quality: 4, tier: 3, reqLevel: 6, reqStat: null,
      desc: "Formula segreta della gilda degli alchimisti. Amplifica sia l'apprendimento che i guadagni.",
      stats: {}, abilities: {},
      effect: { type: 'boost', duration: 3, xpBoost: 0.30, goldBoost: 0.20, fameBoost: 0 },
      buyPrice: 280, sellPrice: 90 },

    { id: 910, name: "Benedizione del Pantheon", slot: 'consumable', consumable: true,
      quality: 5, tier: 3, reqLevel: 8, reqStat: null,
      desc: "Una reliquia sacra ai ladri. Chi la usa è benedetto dagli dèi del crimine.",
      stats: {}, abilities: {},
      effect: { type: 'boost', duration: 5, xpBoost: 0.50, goldBoost: 0.30, fameBoost: 0.20 },
      buyPrice: 600, sellPrice: 200 },

  ],

  /* ── TABELLA XP ─────────────────────────────────────── */
  // xpTable[i] = XP totale necessario per passare dal livello (i+1) al livello (i+2)
  // xpTable[0]=300 → lv1 → lv2 richiede 300 XP totali
  xpTable: [300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000],

  /* ── SFIDE RIFERIMENTO ──────────────────────────────── */
  challenges: CHALLENGE_POOL,

  /* ── LIVELLI FAMA ────────────────────────────────────── */
  fameLevels: [
    { min: 0,    title: "Sconosciuto",  tier: 1 },
    { min: 50,   title: "Conosciuto",   tier: 1 },
    { min: 120,  title: "Rispettato",   tier: 2 },
    { min: 220,  title: "Noto",         tier: 2 },
    { min: 380,  title: "Temuto",       tier: 2 },
    { min: 600,  title: "Famigerato",   tier: 3 },
    { min: 900,  title: "Infame",       tier: 3 },
    { min: 1300, title: "Leggendario",  tier: 3 },
    { min: 1800, title: "Immortale",    tier: 4 },
    { min: 2500, title: "Il Fantasma",  tier: 4 }
  ]
};

/* ── INGREDIENTI (50 items, IDs 1001-1050) ───────────── */
const INGREDIENTS = [
  // TIER 1 — Comuni (1001-1010)
  { id: 1001, name: 'Erba di Campo',              quality: 1, icon: '🌿', desc: 'Un\'erba comune che cresce ovunque. Base di molte preparazioni.' },
  { id: 1002, name: 'Fungo Grigio',               quality: 1, icon: '🍄', desc: 'Fungo dal sapore acre. Utile come addormentante blando.' },
  { id: 1003, name: 'Radice di Quercia',           quality: 1, icon: '🪵', desc: 'Radice robusta dalle proprietà rigeneranti.' },
  { id: 1004, name: 'Petali di Rosa Selvatica',   quality: 1, icon: '🌸', desc: 'Delicati petali con lieve potere calmante.' },
  { id: 1005, name: 'Argilla Morbida',             quality: 1, icon: '🏺', desc: 'Argilla ricca di minerali. Base per impacchi e unguenti.' },
  { id: 1006, name: 'Cenere di Legno',             quality: 1, icon: '🪣', desc: 'Residuo di legno bruciato. Purifica e neutralizza.' },
  { id: 1007, name: 'Cristallo di Sale',           quality: 1, icon: '🧂', desc: 'Sale puro estratto da sorgenti antiche. Stabilizzante.' },
  { id: 1008, name: 'Foglia di Betulla',           quality: 1, icon: '🍃', desc: 'Foglia leggera con proprietà diuretiche e purificanti.' },
  { id: 1009, name: 'Acqua di Sorgente',           quality: 1, icon: '💧', desc: 'Acqua pura non contaminata. Solvente universale.' },
  { id: 1010, name: 'Sabbia del Fiume',            quality: 1, icon: '⏳', desc: 'Sabbia fine dalle rive del fiume. Abrasivo naturale.' },
  // TIER 2 — Non Comuni (1011-1020)
  { id: 1011, name: 'Cristallo di Ghiaccio',      quality: 2, icon: '🧊', desc: 'Cristallo formatosi in luoghi di gelo eterno. Preserva.' },
  { id: 1012, name: 'Polvere di Luna',             quality: 2, icon: '🌙', desc: 'Residuo argentato dei raggi lunari. Potenzia incantesimi.' },
  { id: 1013, name: 'Resina di Pino Antico',      quality: 2, icon: '🌲', desc: 'Resina raccolta da alberi centenari. Altamente concentrata.' },
  { id: 1014, name: 'Sangue di Rospo',             quality: 2, icon: '🐸', desc: 'Sangue tossico ma con proprietà curative se diluito.' },
  { id: 1015, name: 'Fiore di Notte',              quality: 2, icon: '🌑', desc: 'Fiore che sboccia solo al buio. Potere soporifico.' },
  { id: 1016, name: 'Lumaca Argentata',            quality: 2, icon: '🐌', desc: 'La bava di questa lumaca ha proprietà lubrificanti e magiche.' },
  { id: 1017, name: 'Muschio di Pietra',           quality: 2, icon: '🪨', desc: 'Muschio che cresce su pietre millenarie. Assorbe energia.' },
  { id: 1018, name: 'Uovo di Draghetto',           quality: 2, icon: '🥚', desc: 'Guscio di uovo di draghetto. Concentrato di energia draconica.' },
  { id: 1019, name: 'Coda di Lucertola Magica',   quality: 2, icon: '🦎', desc: 'Si rigenera. Simbolo di rinnovamento e velocità.' },
  { id: 1020, name: 'Radice di Mandragora',       quality: 2, icon: '🫚', desc: 'Radice antropomorfa dal potere straordinario. Pericolosa da raccogliere.' },
  // TIER 3 — Rari (1021-1030)
  { id: 1021, name: 'Penna di Fenice',             quality: 3, icon: '🔥', desc: 'Piuma di una fenice. Brucia di fuoco immortale.' },
  { id: 1022, name: 'Polvere di Stella',           quality: 3, icon: '✨', desc: 'Polvere raccolta da meteoriti. Risuona con la magia celeste.' },
  { id: 1023, name: 'Occhio di Basilisco',         quality: 3, icon: '👁️', desc: 'Occhio essiccato di basilisco. Ancora uno sguardo pietrificante inerte.' },
  { id: 1024, name: 'Cuore di Golem',              quality: 3, icon: '⚙️', desc: 'Nucleo di un golem spento. Cristallizza le energie arcanе.' },
  { id: 1025, name: 'Seta di Ragno Fantasma',     quality: 3, icon: '🕸️', desc: 'Filo invisibile tessuto da ragni spettrali. Connette piani.' },
  { id: 1026, name: 'Corno di Unicorno',           quality: 3, icon: '🦄', desc: 'Frammento di corno di unicorno. Purezza assoluta.' },
  { id: 1027, name: 'Lacrima di Sirena',           quality: 3, icon: '🧜', desc: 'Lacrima salata di sirena. Evoca emozioni profonde.' },
  { id: 1028, name: 'Cristallo di Tempo',          quality: 3, icon: '⌛', desc: 'Cristallo che rallenta la percezione del tempo.' },
  { id: 1029, name: 'Ossidiana Viva',              quality: 3, icon: '🖤', desc: 'Ossidiana che pulsa come se avesse un cuore. Assorbe mana.' },
  { id: 1030, name: 'Miele di Api Infernali',      quality: 3, icon: '🍯', desc: 'Miele bruciante prodotto da api dei piani infernali.' },
  // TIER 4 — Epici (1031-1040)
  { id: 1031, name: 'Essenza di Drago',            quality: 4, icon: '🐉', desc: 'Essenza estratta dal sangue di un drago antico. Potere immenso.' },
  { id: 1032, name: 'Polvere di Lich',             quality: 4, icon: '💀', desc: 'Polvere ricavata dalle ossa di un lich. Necrotica ma potentissima.' },
  { id: 1033, name: 'Cristallo dell\'Anima',       quality: 4, icon: '💎', desc: 'Cristallo che ha assorbito un\'anima intera. Carico di vita.' },
  { id: 1034, name: 'Sangue di Demone',            quality: 4, icon: '😈', desc: 'Sangue fumante di un demone. Corrompente e potenziante.' },
  { id: 1035, name: 'Cuore di Tempesta',           quality: 4, icon: '⛈️', desc: 'Sfera di plasma raccolta dall\'occhio di un uragano magico.' },
  { id: 1036, name: 'Occhio dell\'Abisso',         quality: 4, icon: '🌀', desc: 'Un vortice solidificato. Guarda dentro e vedi l\'infinito.' },
  { id: 1037, name: 'Capello di Strega Immortale', quality: 4, icon: '🧙', desc: 'Un solo capello di una strega che non è mai morta.' },
  { id: 1038, name: 'Lacrima dell\'Angelo',        quality: 4, icon: '👼', desc: 'Lacrima purissima di un angelo caduto. Celestiale e terrena.' },
  { id: 1039, name: 'Meteorite Arcano',            quality: 4, icon: '☄️', desc: 'Frammento di un meteorite intriso di magia cosmica.' },
  { id: 1040, name: 'Soffio di Drago Antico',      quality: 4, icon: '💨', desc: 'Soffio condensato dell\'ultimo respiro di un drago antico.' },
  // TIER 5 — Leggendari (1041-1050)
  { id: 1041, name: 'Lacrima di Dio',              quality: 5, icon: '🌟', desc: 'Una lacrima versata da una divinità. Contiene la creazione.' },
  { id: 1042, name: 'Scaglia Primordiale',         quality: 5, icon: '🐍', desc: 'Scaglia del serpente primordiale. Esiste dall\'inizio dei tempi.' },
  { id: 1043, name: 'Polvere della Creazione',     quality: 5, icon: '✳️', desc: 'Polvere rimasta dall\'atto della creazione dell\'universo.' },
  { id: 1044, name: 'Frammento del Tempo',         quality: 5, icon: '⏱️', desc: 'Un pezzo di tempo solidificato. Distorce la realtà intorno a sé.' },
  { id: 1045, name: 'Soffio del Vuoto',            quality: 5, icon: '🌑', desc: 'Aria proveniente dal nulla assoluto tra i piani.' },
  { id: 1046, name: 'Prima Fiamma',                quality: 5, icon: '🕯️', desc: 'La fiamma originale che ha portato la luce al mondo.' },
  { id: 1047, name: 'Cristallo dell\'Infinito',    quality: 5, icon: '♾️', desc: 'Un cristallo che non ha inizio né fine. Trascende la magia.' },
  { id: 1048, name: 'Sangue della Luna Rossa',     quality: 5, icon: '🩸', desc: 'Sangue che scorre solo durante un\'eclissi lunare totale.' },
  { id: 1049, name: 'Cuore del Cosmo',             quality: 5, icon: '🌌', desc: 'Nucleo pulsante del cosmo. Ogni battito è un\'era.' },
  { id: 1050, name: 'Lacrima del Mondo',           quality: 5, icon: '🌍', desc: 'Il pianeta stesso ha pianto. Questa è quella lacrima.' },
];

/* ── RICETTE POZIONI (25 ricette, IDs p001-p025) ─────── */
const POTION_RECIPES = [
  // Qualità 1 — 2 ingredienti
  { id: 'p001', name: 'Pozione di Guarigione',              quality: 1, icon: '🧪',
    ingredients: [1003, 1009],
    desc: 'La classica pozione rossa. Chiude ferite e ridona vigore.',
    reward: { xp: 40, gold: 25 }, clientGold: 60 },
  { id: 'p002', name: 'Filtro del Sonno',                   quality: 1, icon: '😴',
    ingredients: [1002, 1015],
    desc: 'Induce un sonno profondo e ristoratore. O qualcos\'altro.',
    reward: { xp: 40, gold: 20 }, clientGold: 50 },
  { id: 'p003', name: 'Elisir di Lucidità',                 quality: 1, icon: '🧠',
    ingredients: [1001, 1009],
    desc: 'Schiarisce la mente e migliora la concentrazione per ore.',
    reward: { xp: 35, gold: 20 }, clientGold: 45 },
  { id: 'p004', name: 'Tonico Rinforzante',                 quality: 1, icon: '💪',
    ingredients: [1005, 1014],
    desc: 'Rinforza temporaneamente muscoli e resistenza fisica.',
    reward: { xp: 40, gold: 22 }, clientGold: 55 },
  // Qualità 2 — 2 ingredienti
  { id: 'p005', name: 'Pozione di Velocità',                quality: 2, icon: '⚡',
    ingredients: [1011, 1019],
    desc: 'I riflessi accelerano oltre il normale. Ogni cosa sembra lenta.',
    reward: { xp: 70, gold: 45 }, clientGold: 110 },
  { id: 'p006', name: 'Unguento dell\'Ombra',               quality: 2, icon: '🌒',
    ingredients: [1006, 1017],
    desc: 'Applicato sulla pelle, rende più difficile essere visti al buio.',
    reward: { xp: 65, gold: 40 }, clientGold: 100 },
  { id: 'p007', name: 'Pozione di Resistenza',              quality: 2, icon: '🛡️',
    ingredients: [1013, 1020],
    desc: 'La pelle diventa dura come corteccia. Riduce i danni fisici.',
    reward: { xp: 75, gold: 50 }, clientGold: 120 },
  { id: 'p008', name: 'Filtro Amoroso',                     quality: 2, icon: '💕',
    ingredients: [1004, 1016],
    desc: 'Un profumo incantato. Chi lo inhala prova simpatia intensa.',
    reward: { xp: 60, gold: 45 }, clientGold: 115 },
  { id: 'p009', name: 'Tonico della Saggezza',              quality: 2, icon: '🦉',
    ingredients: [1008, 1020],
    desc: 'Apre la mente a percepzioni sottili. Aumenta l\'intuizione.',
    reward: { xp: 80, gold: 55 }, clientGold: 130 },
  // Qualità 3
  { id: 'p010', name: 'Pozione di Invisibilità',            quality: 3, icon: '👻',
    ingredients: [1012, 1017, 1025],
    desc: 'Il corpo diventa trasparente alla luce per breve tempo.',
    reward: { xp: 120, gold: 90 }, clientGold: 220 },
  { id: 'p011', name: 'Elisir di Volo',                     quality: 3, icon: '🦅',
    ingredients: [1021, 1022, 1028],
    desc: 'Le braccia si trasformano in ali di vento. Voli per un\'ora.',
    reward: { xp: 130, gold: 100 }, clientGold: 250 },
  { id: 'p012', name: 'Pozione di Forza Bestiale',          quality: 3, icon: '🐻',
    ingredients: [1018, 1029, 1031],
    desc: 'La forza di un orso in un corpo umano. Usa con cautela.',
    reward: { xp: 140, gold: 110 }, clientGold: 270 },
  { id: 'p013', name: 'Filtro della Verità',                quality: 3, icon: '🔍',
    ingredients: [1023, 1026, 1028],
    desc: 'Chi lo beve non può mentire per un\'ora. Usato in tribunali.',
    reward: { xp: 125, gold: 95 }, clientGold: 240 },
  { id: 'p014', name: 'Unguento Anti-Veleno',               quality: 3, icon: '💚',
    ingredients: [1014, 1025, 1030],
    desc: 'Neutralizza quasi ogni veleno conosciuto. Vita salva.',
    reward: { xp: 115, gold: 85 }, clientGold: 210 },
  { id: 'p015', name: 'Pozione del Tempo',                  quality: 3, icon: '⌛',
    ingredients: [1011, 1022, 1028],
    desc: 'Il tempo rallenta intorno a te. Dieci minuti sembrano un\'ora.',
    reward: { xp: 150, gold: 120 }, clientGold: 300 },
  // Qualità 4
  { id: 'p016', name: 'Elisir dell\'Immortalità Temporanea', quality: 4, icon: '⚜️',
    ingredients: [1026, 1031, 1038],
    desc: 'Per un\'ora sei invulnerabile. Ma il corpo paga il prezzo dopo.',
    reward: { xp: 220, gold: 180 }, clientGold: 450 },
  { id: 'p017', name: 'Pozione del Caos',                   quality: 4, icon: '🌀',
    ingredients: [1034, 1036, 1039],
    desc: 'Effetti imprevedibili e devastanti. Nessuno sa cosa farà.',
    reward: { xp: 200, gold: 160 }, clientGold: 400 },
  { id: 'p018', name: 'Distillato di Lich',                 quality: 4, icon: '💀',
    ingredients: [1032, 1033, 1034],
    desc: 'L\'essenza della non-morte. Sospende il processo biologico.',
    reward: { xp: 230, gold: 190 }, clientGold: 480 },
  { id: 'p019', name: 'Elisir della Tempesta',              quality: 4, icon: '⛈️',
    ingredients: [1021, 1035, 1039],
    desc: 'Il corpo diventa conduttore di fulmini. Pericoloso e magnifico.',
    reward: { xp: 210, gold: 170 }, clientGold: 420 },
  { id: 'p020', name: 'Filtro della Dominazione',           quality: 4, icon: '👑',
    ingredients: [1033, 1034, 1037],
    desc: 'La mente di chi lo beve cede al volere di chi lo ha creato.',
    reward: { xp: 250, gold: 200 }, clientGold: 500 },
  { id: 'p021', name: 'Pozione dell\'Abisso',               quality: 4, icon: '🌑',
    ingredients: [1029, 1036, 1040],
    desc: 'Apre un collegamento temporaneo con i piani infernali.',
    reward: { xp: 240, gold: 195 }, clientGold: 490 },
  // Qualità 5
  { id: 'p022', name: 'Elisir della Creazione',             quality: 5, icon: '✳️',
    ingredients: [1041, 1043, 1047],
    desc: 'Chi lo beve può creare qualcosa dal nulla per un istante.',
    reward: { xp: 400, gold: 350 }, clientGold: 900 },
  { id: 'p023', name: 'Distillato dell\'Eternità',          quality: 5, icon: '♾️',
    ingredients: [1044, 1047, 1050],
    desc: 'Il tempo smette di scorrere intorno al bevitore. Per sempre.',
    reward: { xp: 450, gold: 400 }, clientGold: 1000 },
  { id: 'p024', name: 'Pozione del Vuoto Cosmico',          quality: 5, icon: '🌌',
    ingredients: [1045, 1046, 1049],
    desc: 'Apre una finestra sul nulla assoluto. La realtà vacilla.',
    reward: { xp: 480, gold: 430 }, clientGold: 1100 },
  { id: 'p025', name: 'Lacrimagio — Quintessenza',          quality: 5, icon: '🌟',
    ingredients: [1041, 1048, 1050],
    desc: 'La pozione ultima. Condensa la sofferenza e la speranza del mondo.',
    reward: { xp: 500, gold: 500 }, clientGold: 1300 },

  // ── NUOVE — Qualità 1 (2 ingredienti) ────────────────────────
  { id: 'p026', name: 'Tisana delle Erbe',                  quality: 1, icon: '🍵',
    ingredients: [1001, 1005],
    desc: 'Un infuso semplice ma efficace. Allevia dolori lievi e stanchezza.',
    reward: { xp: 30, gold: 18 }, clientGold: 40 },
  { id: 'p027', name: 'Brodo delle Ceneri',                 quality: 1, icon: '🫙',
    ingredients: [1002, 1006],
    desc: 'Liquido grigio dall\'odore acre. Purifica lo stomaco da sostanze nocive.',
    reward: { xp: 35, gold: 18 }, clientGold: 42 },
  { id: 'p028', name: 'Acqua Floreale',                     quality: 1, icon: '🌺',
    ingredients: [1004, 1010],
    desc: 'Distillato di petali e sabbia. Usato in cosmesi e rituali minori.',
    reward: { xp: 30, gold: 15 }, clientGold: 38 },
  { id: 'p029', name: 'Sale di Betulla',                    quality: 1, icon: '🧴',
    ingredients: [1007, 1008],
    desc: 'Miscela cristallina con proprietà disinfettanti e cicatrizzanti.',
    reward: { xp: 35, gold: 20 }, clientGold: 44 },
  { id: 'p030', name: 'Impacco Boschivo',                   quality: 1, icon: '🌱',
    ingredients: [1003, 1005],
    desc: 'Pasta densa a base di radici. Applicata sulle ferite accelera la guarigione.',
    reward: { xp: 38, gold: 22 }, clientGold: 48 },

  // ── NUOVE — Qualità 2 (2 ingredienti) ────────────────────────
  { id: 'p031', name: 'Cristallo Lunare Fuso',              quality: 2, icon: '🌙',
    ingredients: [1011, 1012],
    desc: 'Liquido argentato che brilla al buio. Potenzia la vista notturna.',
    reward: { xp: 65, gold: 38 }, clientGold: 95 },
  { id: 'p032', name: 'Resina del Rospo',                   quality: 2, icon: '🐸',
    ingredients: [1013, 1014],
    desc: 'Densa e vischiosa. Rallenta i riflessi di chi la ingerisce.',
    reward: { xp: 60, gold: 35 }, clientGold: 88 },
  { id: 'p033', name: 'Ombra Argentata',                    quality: 2, icon: '🌫️',
    ingredients: [1015, 1016],
    desc: 'Nebbia solidificata in flacone. Oscura i sensi per alcuni minuti.',
    reward: { xp: 65, gold: 40 }, clientGold: 100 },
  { id: 'p034', name: 'Pietra Viva del Drago',              quality: 2, icon: '🥚',
    ingredients: [1017, 1018],
    desc: 'Frammenti di pietra e guscio fusi insieme. Induris la pelle brevemente.',
    reward: { xp: 70, gold: 42 }, clientGold: 105 },
  { id: 'p035', name: 'Coda della Mandragora',              quality: 2, icon: '🌿',
    ingredients: [1019, 1020],
    desc: 'Unisce le proprietà rigenerative di due rare radici magiche.',
    reward: { xp: 75, gold: 48 }, clientGold: 118 },
  { id: 'p036', name: 'Filtro della Luna',                  quality: 2, icon: '🔮',
    ingredients: [1012, 1016],
    desc: 'La luna riflessa in un flacone. Amplifica i sogni lucidi.',
    reward: { xp: 68, gold: 42 }, clientGold: 105 },
  { id: 'p037', name: 'Siero Ghiacciato',                   quality: 2, icon: '❄️',
    ingredients: [1011, 1013],
    desc: 'Abbassa la temperatura corporea. Utile contro febbri magiche.',
    reward: { xp: 70, gold: 44 }, clientGold: 108 },
  { id: 'p038', name: 'Veleno dell\'Alba',                  quality: 2, icon: '☠️',
    ingredients: [1014, 1015],
    desc: 'Tossico al buio, guaritore alla luce. Il contesto è tutto.',
    reward: { xp: 72, gold: 46 }, clientGold: 112 },

  // ── NUOVE — Qualità 3 (2 ingredienti) ────────────────────────
  { id: 'p039', name: 'Fuoco di Golem',                     quality: 3, icon: '⚙️',
    ingredients: [1021, 1024],
    desc: 'Fiamma artificiale che non si spegne con l\'acqua. Brucia a freddo.',
    reward: { xp: 118, gold: 88 }, clientGold: 215 },
  { id: 'p040', name: 'Occhio di Stella',                   quality: 3, icon: '🌟',
    ingredients: [1022, 1023],
    desc: 'Pozione della chiaroveggenza. Rivela oggetti nascosti nel raggio di vista.',
    reward: { xp: 125, gold: 92 }, clientGold: 225 },
  { id: 'p041', name: 'Velo Spettrale',                     quality: 3, icon: '👁️',
    ingredients: [1025, 1026],
    desc: 'Rende chi lo beve invisibile ai morti e agli spiriti.',
    reward: { xp: 120, gold: 90 }, clientGold: 220 },
  { id: 'p042', name: 'Lacrime dell\'Ossidiana',             quality: 3, icon: '🖤',
    ingredients: [1027, 1029],
    desc: 'Lacrima e pietra fuse. Pietrifica i sogni del bevitore per una notte.',
    reward: { xp: 130, gold: 98 }, clientGold: 240 },
  { id: 'p043', name: 'Cristallo del Miele Infernale',      quality: 3, icon: '🍯',
    ingredients: [1028, 1030],
    desc: 'Dolce e letale. Blocca il tempo soggettivo per sessanta secondi.',
    reward: { xp: 135, gold: 102 }, clientGold: 250 },
  { id: 'p044', name: 'Miele della Fenice',                 quality: 3, icon: '🔥',
    ingredients: [1021, 1030],
    desc: 'Dolcissimo. Chi lo beve non sente dolore per alcune ore.',
    reward: { xp: 122, gold: 92 }, clientGold: 228 },
  { id: 'p045', name: 'Occhio di Sirena',                   quality: 3, icon: '🧜',
    ingredients: [1023, 1027],
    desc: 'Permette di respirare sott\'acqua e di comprendere i linguaggi del mare.',
    reward: { xp: 128, gold: 96 }, clientGold: 235 },
  { id: 'p046', name: 'Cuore dell\'Ombra',                  quality: 3, icon: '💜',
    ingredients: [1024, 1025],
    desc: 'Connette il bevitore al regno degli spiriti per breve tempo.',
    reward: { xp: 132, gold: 100 }, clientGold: 245 },

  // ── NUOVE — Qualità 4 (2 ingredienti) ────────────────────────
  { id: 'p047', name: 'Sangue del Non-Morto',               quality: 4, icon: '🩸',
    ingredients: [1031, 1033],
    desc: 'Mescola vita e morte. Il bevitore sopravvive a ferite normalmente letali.',
    reward: { xp: 215, gold: 175 }, clientGold: 440 },
  { id: 'p048', name: 'Ruggito della Tempesta',             quality: 4, icon: '⚡',
    ingredients: [1032, 1035],
    desc: 'La voce diventa tuono. I suoi ordini vengono eseguiti senza discussione.',
    reward: { xp: 205, gold: 165 }, clientGold: 415 },
  { id: 'p049', name: 'Strega Immortale',                   quality: 4, icon: '🧙',
    ingredients: [1036, 1037],
    desc: 'Capello e abisso distillati. Conferisce conoscenze magiche istantanee.',
    reward: { xp: 225, gold: 182 }, clientGold: 455 },
  { id: 'p050', name: 'Meteora Condensata',                 quality: 4, icon: '☄️',
    ingredients: [1038, 1039],
    desc: 'Lacrime celesti e roccia cosmica. Esplode se agitata con forza.',
    reward: { xp: 218, gold: 178 }, clientGold: 445 },
  { id: 'p051', name: 'Soffio del Drago Eterno',            quality: 4, icon: '🐉',
    ingredients: [1031, 1040],
    desc: 'Essenza draconica allo stato puro. Trasforma il respiro in fuoco per ore.',
    reward: { xp: 235, gold: 190 }, clientGold: 470 },
  { id: 'p052', name: 'Abisso Solidificato',                quality: 4, icon: '🌀',
    ingredients: [1032, 1036],
    desc: 'Polvere di lich e occhio dell\'abisso. Dissolve la materia che tocca.',
    reward: { xp: 245, gold: 198 }, clientGold: 495 },

  // ── NUOVE — Qualità 5 (2 ingredienti) ────────────────────────
  { id: 'p053', name: 'Scaglia della Creazione',            quality: 5, icon: '🐍',
    ingredients: [1041, 1042],
    desc: 'Lacrima divina e scaglia primordiale. Riporta in vita ciò che era perduto.',
    reward: { xp: 420, gold: 360 }, clientGold: 950 },
  { id: 'p054', name: 'Fiamma del Tempo',                   quality: 5, icon: '🕯️',
    ingredients: [1044, 1046],
    desc: 'Frammento del tempo e prima fiamma. Brucia il passato per cambiare il futuro.',
    reward: { xp: 460, gold: 410 }, clientGold: 1050 },
  { id: 'p055', name: 'Luna Primordiale',                   quality: 5, icon: '🩸',
    ingredients: [1045, 1048],
    desc: 'Soffio del vuoto e sangue lunare. Chi lo beve tocca l\'inizio del mondo.',
    reward: { xp: 490, gold: 440 }, clientGold: 1150 },
];

/* ── COMPONENTI ARCANE (50 items, IDs 2001-2050) ─────── */
const SPELL_COMPONENTS = [
  // TIER 1 — Comuni (2001-2010)
  { id: 2001, name: 'Guano di Pipistrello',      quality: 1, icon: '🦇', desc: 'Essenziale per incantesimi esplosivi. Odore insopportabile.' },
  { id: 2002, name: 'Zampe di Ragno',             quality: 1, icon: '🕷️', desc: 'Sei zampe di ragno comune. Componente per incantesimi di intrappolarsi.' },
  { id: 2003, name: 'Zolfo',                      quality: 1, icon: '🌋', desc: 'Polvere gialla dall\'odore acre. Base di molti incantesimi di fuoco.' },
  { id: 2004, name: 'Mercurio Grezzo',            quality: 1, icon: '💧', desc: 'Liquido argentato e tossico. Amplifica le vibrazioni arcane.' },
  { id: 2005, name: 'Fiele di Serpente',          quality: 1, icon: '🐍', desc: 'Bile gialla estratta da un serpente comune. Acidica e corrosiva.' },
  { id: 2006, name: 'Polvere di Carbone',         quality: 1, icon: '🪨', desc: 'Carbone finemente macinato. Conduttore di energia magica elementare.' },
  { id: 2007, name: 'Dente di Lupo',              quality: 1, icon: '🐺', desc: 'Dente di lupo adulto. Porta l\'istinto predatorio negli incantesimi.' },
  { id: 2008, name: 'Olio di Rospo',              quality: 1, icon: '🐸', desc: 'Olio estratto dalla pelle di un rospo. Scivoloso e appiccicoso.' },
  { id: 2009, name: 'Sale Grigio',                quality: 1, icon: '🧂', desc: 'Sale non purificato con impurità minerali. Stabilizzante arcano.' },
  { id: 2010, name: 'Fegato di Corvo',            quality: 1, icon: '🐦', desc: 'Piccolo organo dal potere divinatorio. Usato per incantesimi di visione.' },
  // TIER 2 — Non Comuni (2011-2020)
  { id: 2011, name: 'Corno di Demone Minore',     quality: 2, icon: '😈', desc: 'Corno spezzato di un diavoletto. Amplifica incantesimi oscuri.' },
  { id: 2012, name: 'Occhio di Sapo Gigante',     quality: 2, icon: '👁️', desc: 'Occhio gelatinoso e semitrasparente. Potenzia incantesimi di percezione.' },
  { id: 2013, name: 'Bava di Ghoul',              quality: 2, icon: '🧟', desc: 'Secrezione necrotica di un ghoul. Porta paralisi agli incantesimi.' },
  { id: 2014, name: 'Pirite Arcana',              quality: 2, icon: '✨', desc: 'Pirite che scintilla anche al buio. Concentra l\'energia arcana.' },
  { id: 2015, name: 'Unghia di Strega',           quality: 2, icon: '🧙', desc: 'Unghia lunga di una strega invecchiata. Porta saggezza oscura.' },
  { id: 2016, name: 'Polvere di Osso',            quality: 2, icon: '💀', desc: 'Ossa di animale polverizzate. Usata in necromanzia e invocazione.' },
  { id: 2017, name: 'Lingua di Basilisco',        quality: 2, icon: '👁️', desc: 'Lingua essiccata di basilisco. Porta l\'effetto pietrificante.' },
  { id: 2018, name: 'Cuore di Corvo',             quality: 2, icon: '🖤', desc: 'Cuore essiccato di un corvo vecchio. Porta presagi nei rituali.' },
  { id: 2019, name: 'Fumo Congelato',             quality: 2, icon: '❄️', desc: 'Fumo solidificato in modo magico. Rilascia nuvole al calore.' },
  { id: 2020, name: 'Muffa Fosforescente',        quality: 2, icon: '🌿', desc: 'Muffa che brilla al buio. Amplifica incantesimi di luce e oscurità.' },
  // TIER 3 — Rari (2021-2030)
  { id: 2021, name: 'Sangue di Vampiro',          quality: 3, icon: '🧛', desc: 'Sangue scuro e freddo di un vampiro. Potenzia incantesimi di terrore.' },
  { id: 2022, name: 'Fiele di Drago Giovane',     quality: 3, icon: '🐉', desc: 'Bile magmatica di un drago giovane. Potenzia enormemente gli incantesimi di fuoco.' },
  { id: 2023, name: 'Corno del Diavolo',          quality: 3, icon: '😈', desc: 'Corno intero di un diavolo di rango. Collegamento diretto ai piani infernali.' },
  { id: 2024, name: 'Dente di Golem',             quality: 3, icon: '⚙️', desc: 'Frammento del nucleo di un golem. Porta solidità agli incantesimi costruttivi.' },
  { id: 2025, name: 'Cenere di Fenice',           quality: 3, icon: '🔥', desc: 'Cenere sacra di fenice. Porta immortalità temporanea e fuoco purificante.' },
  { id: 2026, name: 'Veleno di Wyvern',           quality: 3, icon: '🐲', desc: 'Veleno paralizzante di wyvern. Altamente tossico e magicamente attivo.' },
  { id: 2027, name: 'Capello di Lich',            quality: 3, icon: '💀', desc: 'Un singolo capello di un lich. Porta la non-morte negli incantesimi.' },
  { id: 2028, name: 'Coda di Diavolo Minore',     quality: 3, icon: '😈', desc: 'Coda mozzata di un diavolo di basso rango. Porta contratti arcani.' },
  { id: 2029, name: 'Siero di Medusa',            quality: 3, icon: '🐍', desc: 'Liquido estratto dai capelli-serpente di una medusa. Porta pietrificazione.' },
  { id: 2030, name: 'Polvere di Lich Minore',     quality: 3, icon: '☠️', desc: 'Polvere ricavata da un lich di basso potere. Necrotica e instabile.' },
  // TIER 4 — Epici (2031-2040)
  { id: 2031, name: 'Sangue di Arcangelo',        quality: 4, icon: '👼', desc: 'Sangue dorato di un arcangelo caduto. Celestiale e devastante.' },
  { id: 2032, name: 'Nucleo di Aberrazione',      quality: 4, icon: '🌀', desc: 'Centro pulsante di una creatura aberrante. Distorce la realtà.' },
  { id: 2033, name: 'Scaglia di Leviatano',       quality: 4, icon: '🐋', desc: 'Scaglia del leviatano degli abissi. Porta potere degli oceani cosmici.' },
  { id: 2034, name: 'Cuore di Lich',              quality: 4, icon: '💜', desc: 'Cuore mummificato di un lich potente. Concentrato di non-vita.' },
  { id: 2035, name: 'Veleno di Dracolich',        quality: 4, icon: '💀', desc: 'Veleno necrotico di un dracolich. Uccide e resuscita allo stesso tempo.' },
  { id: 2036, name: 'Sangue di Demone Maggiore',  quality: 4, icon: '😈', desc: 'Sangue fumante di un demone di alto rango. Corruzione incarnata.' },
  { id: 2037, name: 'Essenza del Vuoto',          quality: 4, icon: '🌑', desc: 'Estratto dal nulla tra i piani. Annulla la magia che lo tocca.' },
  { id: 2038, name: 'Bava del Caos',              quality: 4, icon: '🌀', desc: 'Secrezione di una creatura del caos. Ogni uso ha effetti imprevedibili.' },
  { id: 2039, name: 'Polvere di Dio Minore',      quality: 4, icon: '⭐', desc: 'Frammento di una divinità minore morta. Potere puro e instabile.' },
  { id: 2040, name: 'Cristallo del Male Puro',    quality: 4, icon: '🖤', desc: 'Il male solidificato in cristallo. Amplifica ogni aspetto oscuro.' },
  // TIER 5 — Leggendari (2041-2050)
  { id: 2041, name: 'Sangue del Caos Primordiale',quality: 5, icon: '🌋', desc: 'Il primo sangue versato nell\'universo. Prima del bene e del male.' },
  { id: 2042, name: 'Fiele dell\'Universo',       quality: 5, icon: '🌌', desc: 'Bile cosmica raccolta nei punti di morte delle stelle.' },
  { id: 2043, name: 'Vuoto Solidificato',         quality: 5, icon: '⬛', desc: 'Nulla assoluto in forma solida. Sembra trasparente ma è opaco al pensiero.' },
  { id: 2044, name: 'Zolfo Cosmico',              quality: 5, icon: '🌠', desc: 'Zolfo distillato da eruzioni stellari. Brucia oltre il piano fisico.' },
  { id: 2045, name: 'Mercurio dell\'Infinito',    quality: 5, icon: '♾️', desc: 'Mercurio che scorre in direzioni impossibili. Collega tutti i piani.' },
  { id: 2046, name: 'Frammento di Divinità',      quality: 5, icon: '✝️', desc: 'Un frammento di un dio antico. Il più piccolo contiene un universo.' },
  { id: 2047, name: 'Lacrima del Cosmo',          quality: 5, icon: '💫', desc: 'Lacrima versata dall\'universo stesso. Contiene tutto il dolore cosmico.' },
  { id: 2048, name: 'Solfuro dell\'Abisso',       quality: 5, icon: '🕳️', desc: 'Zolfo estratto dal fondo dell\'abisso. Dove non arriva nemmeno la luce.' },
  { id: 2049, name: 'Cuore del Nulla',            quality: 5, icon: '🌀', desc: 'Nucleo pulsante del nulla stesso. Ogni battito crea e distrugge.' },
  { id: 2050, name: 'Polvere dell\'Inizio',       quality: 5, icon: '🌟', desc: 'Polvere rimasta dall\'esplosione che ha creato la realtà.' },
];

/* ── RICETTE INCANTESIMI (55 ricette, IDs s001-s055) ─── */
const SPELL_RECIPES = [
  // Qualità 1 — 2 componenti
  { id: 's001', name: 'Dardo Magico',             quality: 1, icon: '🏹',
    components: [2001, 2003],
    desc: 'Il classico dardo di energia arcana. Veloce, preciso, infallibile.',
    reward: { xp: 40, gold: 25 }, clientGold: 60 },
  { id: 's002', name: 'Scintilla Arcana',         quality: 1, icon: '⚡',
    components: [2002, 2004],
    desc: 'Piccola scarica elettrica. Stordisce per qualche secondo.',
    reward: { xp: 35, gold: 20 }, clientGold: 50 },
  { id: 's003', name: 'Mano Maga',                quality: 1, icon: '🖐️',
    components: [2005, 2006],
    desc: 'Mano spettrale che manipola oggetti a distanza.',
    reward: { xp: 30, gold: 18 }, clientGold: 42 },
  { id: 's004', name: 'Nebbia Oscurante',         quality: 1, icon: '🌫️',
    components: [2001, 2008],
    desc: 'Nebbia magica che blocca la visione nell\'area bersaglio.',
    reward: { xp: 35, gold: 20 }, clientGold: 48 },
  { id: 's005', name: 'Globo di Luce',            quality: 1, icon: '💡',
    components: [2004, 2009],
    desc: 'Sfera luminosa fluttuante. Illumina senza consumare torce.',
    reward: { xp: 30, gold: 15 }, clientGold: 38 },
  { id: 's006', name: 'Sigillo Silenzioso',       quality: 1, icon: '🤫',
    components: [2007, 2009],
    desc: 'Sigillo che impedisce al bersaglio di emettere suoni.',
    reward: { xp: 38, gold: 22 }, clientGold: 52 },
  { id: 's007', name: 'Tiro di Acido',            quality: 1, icon: '☠️',
    components: [2005, 2010],
    desc: 'Goccia di acido magico. Corrode qualsiasi materiale.',
    reward: { xp: 40, gold: 24 }, clientGold: 55 },
  { id: 's008', name: 'Lingua di Fuoco',          quality: 1, icon: '🔥',
    components: [2003, 2010],
    desc: 'Fiamma concentrata che si estende come una frusta.',
    reward: { xp: 42, gold: 25 }, clientGold: 58 },
  { id: 's009', name: 'Stordimento Minore',       quality: 1, icon: '😵',
    components: [2006, 2008],
    desc: 'Onda psichica minore. Causa confusione per pochi secondi.',
    reward: { xp: 35, gold: 20 }, clientGold: 48 },
  { id: 's010', name: 'Vento Ostile',             quality: 1, icon: '💨',
    components: [2002, 2007],
    desc: 'Raffica di vento magico che respinge i nemici.',
    reward: { xp: 35, gold: 20 }, clientGold: 46 },
  // Qualità 2 — 2 componenti
  { id: 's011', name: 'Fulmine',                  quality: 2, icon: '⚡',
    components: [2011, 2019],
    desc: 'Fulmine arcano che colpisce in linea retta. Paralizzante.',
    reward: { xp: 70, gold: 45 }, clientGold: 110 },
  { id: 's012', name: 'Sfera di Ghiaccio',        quality: 2, icon: '🧊',
    components: [2011, 2015],
    desc: 'Sfera di ghiaccio arcano. Congela al contatto.',
    reward: { xp: 65, gold: 40 }, clientGold: 100 },
  { id: 's013', name: 'Manto d\'Oscurità',        quality: 2, icon: '🌑',
    components: [2013, 2018],
    desc: 'Mantello di ombre reali. Chi lo indossa scompare dal campo visivo.',
    reward: { xp: 75, gold: 50 }, clientGold: 120 },
  { id: 's014', name: 'Incantesimo di Paura',     quality: 2, icon: '😱',
    components: [2012, 2017],
    desc: 'Illusione spaventosa che costringe il bersaglio alla fuga.',
    reward: { xp: 68, gold: 42 }, clientGold: 105 },
  { id: 's015', name: 'Armatura Arcana',          quality: 2, icon: '🛡️',
    components: [2014, 2016],
    desc: 'Barriera di energia magica. Riduce i danni fisici subiti.',
    reward: { xp: 72, gold: 46 }, clientGold: 112 },
  { id: 's016', name: 'Rilevamento Magico',       quality: 2, icon: '🔍',
    components: [2016, 2020],
    desc: 'Rivela oggetti e creature magiche nell\'area circostante.',
    reward: { xp: 60, gold: 38 }, clientGold: 92 },
  { id: 's017', name: 'Illusione Minore',         quality: 2, icon: '🎭',
    components: [2013, 2020],
    desc: 'Crea una copia illusoria di un oggetto o persona.',
    reward: { xp: 65, gold: 40 }, clientGold: 98 },
  { id: 's018', name: 'Frecce Velenose',          quality: 2, icon: '🏹',
    components: [2012, 2015],
    desc: 'Tre frecce di veleno arcano. Avvelenamento progressivo.',
    reward: { xp: 70, gold: 44 }, clientGold: 108 },
  { id: 's019', name: 'Rallentare',               quality: 2, icon: '🐢',
    components: [2014, 2019],
    desc: 'Rallenta drasticamente il bersaglio. Come muoversi nel miele.',
    reward: { xp: 68, gold: 42 }, clientGold: 105 },
  { id: 's020', name: 'Volo del Corvo',           quality: 2, icon: '🐦',
    components: [2017, 2018],
    desc: 'Trasforma il mago in corvo per alcune ore.',
    reward: { xp: 78, gold: 52 }, clientGold: 125 },
  // Qualità 3 — 2 componenti
  { id: 's021', name: 'Palla di Fuoco',           quality: 3, icon: '🔥',
    components: [2021, 2025],
    desc: 'Sfera di fuoco esplosiva. L\'incantesimo iconico di ogni mago.',
    reward: { xp: 120, gold: 90 }, clientGold: 220 },
  { id: 's022', name: 'Folgore',                  quality: 3, icon: '⚡',
    components: [2022, 2024],
    desc: 'Colpo di fulmine devastante. Danneggia tutto in linea retta.',
    reward: { xp: 130, gold: 100 }, clientGold: 250 },
  { id: 's023', name: 'Invisibilità',             quality: 3, icon: '👻',
    components: [2023, 2027],
    desc: 'Rende completamente invisibili finché si rimane fermi.',
    reward: { xp: 125, gold: 95 }, clientGold: 235 },
  { id: 's024', name: 'Charme del Vampiro',       quality: 3, icon: '🧛',
    components: [2021, 2029],
    desc: 'Incantesimo di controllo mentale. Il bersaglio obbedisce per un\'ora.',
    reward: { xp: 135, gold: 105 }, clientGold: 260 },
  { id: 's025', name: 'Porta Dimensionale',       quality: 3, icon: '🌀',
    components: [2028, 2030],
    desc: 'Apre un portale istantaneo verso un luogo conosciuto.',
    reward: { xp: 140, gold: 110 }, clientGold: 270 },
  { id: 's026', name: 'Pioggia di Acido',         quality: 3, icon: '☠️',
    components: [2022, 2026],
    desc: 'Nube di acido arcano. Corrode armature e strutture.',
    reward: { xp: 118, gold: 88 }, clientGold: 215 },
  { id: 's027', name: 'Onda Psichica',            quality: 3, icon: '🧠',
    components: [2023, 2028],
    desc: 'Esplosione di energia psichica. Stordisce nell\'area.',
    reward: { xp: 122, gold: 92 }, clientGold: 228 },
  { id: 's028', name: 'Metamorfosi',              quality: 3, icon: '🦋',
    components: [2025, 2030],
    desc: 'Trasforma il bersaglio in un animale per alcune ore.',
    reward: { xp: 132, gold: 102 }, clientGold: 248 },
  { id: 's029', name: 'Convocare Famiglio',       quality: 3, icon: '🐱',
    components: [2024, 2029],
    desc: 'Invoca un famiglio magico che obbedisce al mago.',
    reward: { xp: 115, gold: 85 }, clientGold: 210 },
  { id: 's030', name: 'Occhio di Medusa',         quality: 3, icon: '👁️',
    components: [2026, 2027],
    desc: 'Sguardo pietrificante. Il bersaglio si trasforma in pietra per minuti.',
    reward: { xp: 138, gold: 108 }, clientGold: 265 },
  // Qualità 3 aggiuntiva — 2 componenti
  { id: 's051', name: 'Nebbia Velenosa',          quality: 3, icon: '🌫️',
    components: [2021, 2026],
    desc: 'Nube di gas velenoso che persiste nell\'area per minuti.',
    reward: { xp: 128, gold: 98 }, clientGold: 240 },
  { id: 's052', name: 'Muro di Fuoco',            quality: 3, icon: '🧱',
    components: [2022, 2025],
    desc: 'Barriera di fuoco magico. Blocca il passaggio e brucia chi tenta.',
    reward: { xp: 126, gold: 96 }, clientGold: 236 },
  { id: 's053', name: 'Scudo Etereo',             quality: 3, icon: '🛡️',
    components: [2023, 2024],
    desc: 'Scudo del piano etereo. Blocca danni fisici e magici.',
    reward: { xp: 120, gold: 92 }, clientGold: 225 },
  // Qualità 4 — 3 componenti
  { id: 's031', name: 'Meteora Arcana',           quality: 4, icon: '☄️',
    components: [2031, 2035, 2039],
    desc: 'Meteorite di energia arcana pura. Cratere di venti metri.',
    reward: { xp: 220, gold: 180 }, clientGold: 450 },
  { id: 's032', name: 'Interruzione del Tempo',   quality: 4, icon: '⏱️',
    components: [2032, 2038, 2039],
    desc: 'Ferma il tempo per tutti tranne il mago. Due round extra.',
    reward: { xp: 240, gold: 195 }, clientGold: 490 },
  { id: 's033', name: 'Controllo Mentale',        quality: 4, icon: '👑',
    components: [2034, 2036, 2038],
    desc: 'Controllo totale della mente del bersaglio. Permanente se non spezzato.',
    reward: { xp: 250, gold: 200 }, clientGold: 500 },
  { id: 's034', name: 'Fusione con l\'Ombra',     quality: 4, icon: '🌑',
    components: [2031, 2037, 2040],
    desc: 'Il mago diventa un\'ombra reale. Intangibile e invisibile.',
    reward: { xp: 230, gold: 188 }, clientGold: 470 },
  { id: 's035', name: 'Invocazione Abissale',     quality: 4, icon: '🌀',
    components: [2033, 2036, 2037],
    desc: 'Invoca una creatura dall\'abisso. Servitore potente ma imprevedibile.',
    reward: { xp: 245, gold: 198 }, clientGold: 492 },
  { id: 's036', name: 'Tocco del Lich',           quality: 4, icon: '💀',
    components: [2032, 2034, 2040],
    desc: 'Il tocco drena la vita del bersaglio e la trasferisce al mago.',
    reward: { xp: 235, gold: 192 }, clientGold: 480 },
  { id: 's037', name: 'Vortice Cosmico',          quality: 4, icon: '🌪️',
    components: [2035, 2037, 2040],
    desc: 'Vortice di energia cosmica. Risucchia tutto nell\'area.',
    reward: { xp: 248, gold: 200 }, clientGold: 498 },
  { id: 's038', name: 'Sigillo del Male',         quality: 4, icon: '🔒',
    components: [2031, 2033, 2038],
    desc: 'Sigillo che imprigiona un\'entità per anni. Irremovibile senza contrincantesimo.',
    reward: { xp: 225, gold: 184 }, clientGold: 460 },
  { id: 's039', name: 'Tempesta di Caos',         quality: 4, icon: '⛈️',
    components: [2032, 2039, 2033],
    desc: 'Tempesta di energia caotica. Effetti imprevedibili e devastanti.',
    reward: { xp: 238, gold: 194 }, clientGold: 485 },
  { id: 's040', name: 'Annullamento',             quality: 4, icon: '❌',
    components: [2034, 2035, 2036],
    desc: 'Cancella completamente ogni magia nell\'area di effetto.',
    reward: { xp: 220, gold: 180 }, clientGold: 448 },
  // Qualità 4 aggiuntiva — 2 componenti
  { id: 's054', name: 'Ruggito del Drago',        quality: 4, icon: '🐉',
    components: [2033, 2035],
    desc: 'Ruggito magico di potenza draconica. Terrorizza tutti nell\'area.',
    reward: { xp: 215, gold: 175 }, clientGold: 440 },
  { id: 's055', name: 'Trono del Male',           quality: 4, icon: '🖤',
    components: [2032, 2040],
    desc: 'Incantesimo di dominazione totale. Tutto nell\'area si inchina.',
    reward: { xp: 228, gold: 186 }, clientGold: 465 },
  // Qualità 5 — 3 componenti
  { id: 's041', name: 'Disintegrazione',          quality: 5, icon: '💥',
    components: [2041, 2043, 2047],
    desc: 'Riduce il bersaglio a polvere cosmica. Nessun modo per tornare.',
    reward: { xp: 400, gold: 350 }, clientGold: 900 },
  { id: 's042', name: 'Apocalisse Arcana',        quality: 5, icon: '🌋',
    components: [2044, 2048, 2050],
    desc: 'L\'incantesimo finale. Cancella tutto nell\'area di una città.',
    reward: { xp: 500, gold: 500 }, clientGold: 1300 },
  { id: 's043', name: 'Creare Lich',              quality: 5, icon: '💀',
    components: [2042, 2046, 2049],
    desc: 'Trasforma il mago in un lich. Immortalità al prezzo dell\'anima.',
    reward: { xp: 480, gold: 430 }, clientGold: 1100 },
  { id: 's044', name: 'Riscrivere la Realtà',     quality: 5, icon: '✳️',
    components: [2043, 2045, 2047],
    desc: 'Il mago riscrive le leggi della fisica locali per un\'ora.',
    reward: { xp: 460, gold: 410 }, clientGold: 1050 },
  { id: 's045', name: 'Divorare il Cosmo',        quality: 5, icon: '🌌',
    components: [2041, 2049, 2050],
    desc: 'Il mago diventa un buco nero temporaneo. Risucchia e distrugge.',
    reward: { xp: 490, gold: 440 }, clientGold: 1150 },
  { id: 's046', name: 'Caos Primordiale',         quality: 5, icon: '🌀',
    components: [2044, 2045, 2046],
    desc: 'Richiama il caos delle origini. Tutto è possibile, nulla è sicuro.',
    reward: { xp: 470, gold: 420 }, clientGold: 1080 },
  { id: 's047', name: 'Frammento Divino',         quality: 5, icon: '⭐',
    components: [2041, 2046, 2048],
    desc: 'Canalizza un frammento di potere divino. Il mago tocca la divinità.',
    reward: { xp: 450, gold: 400 }, clientGold: 1000 },
  { id: 's048', name: 'Nulla Assoluto',           quality: 5, icon: '⬛',
    components: [2042, 2043, 2049],
    desc: 'Chiama il nulla. Tutto ciò che tocca semplicemente smette di esistere.',
    reward: { xp: 480, gold: 440 }, clientGold: 1120 },
  { id: 's049', name: 'Risveglio Infinito',       quality: 5, icon: '♾️',
    components: [2045, 2047, 2048],
    desc: 'Il mago risveglia la mente cosmica. Sa tutto per dieci minuti.',
    reward: { xp: 420, gold: 370 }, clientGold: 950 },
  { id: 's050', name: 'La Grande Cancellazione',  quality: 5, icon: '🌟',
    components: [2043, 2044, 2050],
    desc: 'Cancella una cosa dall\'esistenza per sempre. Mai e poi mai vista.',
    reward: { xp: 500, gold: 500 }, clientGold: 1300 },
];
