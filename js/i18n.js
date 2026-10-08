/* ═══════════════════════════════════════════════════════════
   BadHeroSimulator — i18n (Internationalisation)
   Supported languages: 'it' (Italiano), 'en' (English)
   Default: 'en' — saved in localStorage key 'bhs_lang'
   ═══════════════════════════════════════════════════════════ */

const TRANSLATIONS = {

  /* ────────────────────────────── ITALIANO ── */
  it: {
    /* Navbar */
    'nav.theme':     'Cambia tema',
    'nav.export':    'Esporta salvataggio su file',
    'nav.import':    'Importa salvataggio da file',
    'nav.save':      'Salva',
    'nav.load':      'Carica',
    'nav.newgame':   'Nuova Partita',

    /* Day bar */
    'day.prefix':    'Giorno',
    'day.next':      'Avanza Giorno',
    'day.gold':      'mo',

    /* Tabs */
    'tab.quests':    'Missioni',
    'tab.market':    'Mercato',
    'tab.inventory': 'Inventario',
    'tab.challenges':'Sfide',
    'tab.dice':      'Gioca a Dadi',
    'tab.forest':    'Foresta',
    'tab.spells':    'Incantesimi',
    'tab.convert':   'Conversione',
    'tab.arena':     'Arena',
    'tab.rescue':    'Salva i Prigionieri',
    'tab.combat':    'Combatti',
    'tab.journal':   'Diario',

    /* Character card */
    'char.card':       'Scheda Personaggio',
    'char.prof':       'Competenza',
    'char.xp':         'Esperienza',
    'char.renown':     'Fama',
    'char.notoriety':  'Visibilità',
    'char.bounty':     'Taglia',
    'char.unknown':    'Sconosciuto',
    'char.renown.pts': 'punti fama',
    'char.anon':       '🌫️ Anonimo',
    'char.boosts':     'Potenziamenti attivi',
    'char.pickpocket': 'Borseggia',
    'char.study':      'Studia',
    'char.druid.study':'🌿 Studia la Foresta',
    'char.drink':      'Gara di Bevute',
    'char.pray':       'Prega',
    'char.stable':     'Accudisci Cavalcatura',

    /* Stats */
    'stat.str': 'FOR', 'stat.str.full': 'Forza',
    'stat.dex': 'DES', 'stat.dex.full': 'Destrezza',
    'stat.con': 'COS', 'stat.con.full': 'Costituzione',
    'stat.int': 'INT', 'stat.int.full': 'Intelligenza',
    'stat.wis': 'SAG', 'stat.wis.full': 'Saggezza',
    'stat.cha': 'CAR', 'stat.cha.full': 'Carisma',

    /* Classes */
    'class.guerriero': 'Guerriero',
    'class.paladino':  'Paladino',
    'class.chierico':  'Chierico',
    'class.druido':    'Druido',
    'class.ladro':     'Ladro',
    'class.mago':      'Mago',

    /* Combat HUD */
    'combat.header':   'Combattimento',
    'combat.turn':     'Turno',
    'combat.hero':     'Eroe',
    'combat.enemy':    'Nemico',
    'combat.ac':       '🛡️ CA',
    'combat.hp.max':   '❤️ HP massimi',
    'combat.sessions': 'Combattimenti oggi',
    'combat.start':    '⚔️ Trova un Nemico',
    'combat.exit':     '🚪 Esci',
    'combat.win.xp':   '⭐ Punti esperienza',
    'combat.win.gold': '💰 Oro',
    'combat.win.fame': '🌟 Fama',
    'combat.win.item': '🎁 Un oggetto con bonus in —',
    'combat.loss.gold':'💸 10–20% del tuo oro',
    'combat.loss.item':'🎒 Un oggetto casuale dall\'inventario o dall\'equipaggiamento',
    'combat.loss.fame':'👁️ 3 punti fama',
    'combat.win.head': '🏆 Se vinci',
    'combat.loss.head':'💀 Se perdi',

    /* Market */
    'market.refresh': 'Si aggiorna ogni giorno',
    'market.empty':   'Nessun oggetto disponibile.',
    'market.empty2':  'Nessun oggetto disponibile oggi.',
    'market.banned':  'Il mercante ti ha riconosciuto — non puoi più comprare né rubare oggi.',
    'market.steal':   'Ruba',
    'market.buy':     'Acquista',
    'market.buy.ban': 'Vietato',
    'market.buy.low': 'Liv. basso',
    'market.buy.gold':'Oro insuff.',
    'market.req.lv':  'Richiede Lv.{n}',
    'market.req.stat':'{stat} {n} richiesta',

    /* Inventory */
    'inv.equip':  'Equipaggiamento',
    'inv.pack':   'Zaino',
    'inv.empty':  'Vuoto',
    'inv.empty2': 'Zaino vuoto',

    /* Item modal */
    'item.effect':    'Effetto',
    'item.stats':     'Statistiche',
    'item.abilities': 'Abilità speciali',
    'item.reqs':      'Requisiti',
    'item.req.lv':    'Livello richiesto',
    'item.req.stat':  '{stat} richiesta',
    'item.sell.val':  'Valore vendita',
    'item.use':       'Usa',
    'item.equip':     'Equipaggia',
    'item.compare':   'Confronta',
    'item.sell':      'Vendi ({n} mo)',
    'item.unequip':   'Rimuovi',
    'item.buy.btn':   'Acquista ({n} mo)',
    'item.close':     'Chiudi',
    'item.boost.on':  'Bonus già attivo',
    'item.no.gold':   'Oro insufficiente',
    'item.no.lv':     'Richiede Lv.{n}',

    /* Missions */
    'quest.avail':    'Missioni disponibili oggi',
    'quest.done.cnt': 'Completate: {n} / {max}',
    'quest.loading':  'Caricamento missioni...',
    'quest.empty':    'Nessuna missione disponibile.',
    'quest.limit':    'Limite giornaliero raggiunto',
    'quest.action':   'Affronta la missione',
    'quest.done':     'Completata',
    'quest.tag.item': 'oggetto possibile',
    'quest.invest':   'Investimento in Conoscenza',
    'quest.invest.d': 'Spendi {n} mo in libri, mentori e contatti per ottenere {n2} PE.',
    'quest.invest.0': 'Non hai abbastanza oro per investire oggi.',
    'quest.invest.u': 'Hai già investito oggi: −{n} mo → +{n2} PE (×{mult})',
    'quest.invest.done':'Completato',
    'quest.invest.btn':'Investi',
    'quest.invest.toast': 'Investimento: −{n} mo → +{n2} PE!',

    /* Mission modal */
    'mq.title':    'Missione',
    'mq.req':      'Prova richiesta',
    'mq.roll':     'Lancia il dado',
    'mq.how':      'Come vuoi affrontare questa missione?',
    'mq.reroll':   'Usa Rilancio ({n} rimasti)',
    'mq.close':    'Chiudi',

    /* Mission roll results */
    'roll.nat20':  'CRITICO 🎯',
    'roll.success':'Superato',
    'roll.partial':'Parziale',
    'roll.fail':   'Fallito',
    'roll.nat1':   'CRITICO 1',
    'roll.dice':   'dado',
    'roll.prof':   'competenza',
    'roll.xp':     '+{n} punti esperienza',
    'roll.gold':   '+{n} monete d\'oro',
    'roll.fame.p': '+{n} punti fama',
    'roll.fame.n': '{n} punti fama',
    'roll.item':   'Trovato: {name}',

    /* Challenges */
    'chal.info':   'Le sfide completate vengono sostituite il giorno dopo',
    'chal.loading':'Caricamento sfide...',
    'chal.empty':  'Nessuna sfida disponibile.',
    'chal.refresh':   '🔄 {n} refresh disponibil{e}',
    'chal.today':  'Scade oggi',
    '1.day':       '1 giorno',
    'n.days':      '{n} giorni',
    'chal.done':   'Completata',
    'chal.ongoing':'In corso',

    /* Journal */
    'journal.header': 'Diario delle Avventure',
    'journal.empty':  'Il tuo diario è ancora vuoto...',
    'journal.day':    'Giorno {n}',

    /* Guild tax */
    'tax.label':    'Tassa giornaliera gilda: {n} mo',
    'tax.broke':    'Insufficiente!',

    /* Thief attack */
    'thief.title':  'LADRO',
    'thief.desc':   'Una figura incappucciata ti segue.',
    'thief.warn':   'Affronta o subisci il furto prima di avanzare al giorno successivo',
    'thief.win':    'Vittoria: PE + Fama + oro del ladro',
    'thief.loss':   'Sconfitta: Perdi fino al 20% dell\'oro',
    'thief.a1':     'Difenditi',
    'thief.a2':     'Tendi un\'imboscata',
    'thief.a3':     'Anticipane le mosse',

    /* Wanted */
    'wanted.title': 'CACCIATORE DI TAGLIE',
    'wanted.desc':  'Un sicario ti attende nel vicolo.',
    'wanted.warn':  'Missione obbligatoria — affrontala prima di avanzare al giorno successivo',
    'wanted.win':   'Vittoria: PE + Fama + Taglia ridotta',
    'wanted.loss':  'Sconfitta: Oro dimezzato',
    'wanted.btn':   'Affronta il Cacciatore',
    'wanted.modal': 'Attacco di Taglia',
    'wanted.hint':  'Clicca quando 🗡️ tocca ⚔️!',
    'wanted.round.win':   '✅ Prova superata! Preparati...',
    'wanted.round.loss':  '❌ Mancato!',
    'wanted.outcome.win': 'Il cacciatore è a terra. La tua taglia è stata ridotta drasticamente.',
    'wanted.outcome.loss':'Sei riuscito a fuggire, ma hai perso metà del tuo oro. La taglia è comunque diminuita.',
    'wanted.reward':      'Taglia −{n} pt → {r} pt rimasti',
    'wanted.penalty':     '-{n} monete d\'oro',

    /* Pickpocket */
    'pp.modal': 'Borseggio',
    'pp.hint':  'Clicca quando la mano è sopra la borsa!',
    'pp.reroll':'Usa Rilancio ({n} rimasti)',
    'pp.close': 'Chiudi',
    'pp.gold':  '+{n} monete d\'oro',
    'pp.xp':    '+{n} punti esperienza',
    'pp.item':  'Trovato: {name}',

    /* Dice game */
    'dice.title':   'Il Tavolo dei Dadi',
    'dice.broke':   'Oro insufficiente per scommettere.',
    'dice.bet':     'Scommessa:',
    'dice.quickness':'Rapidità di Mano:',
    'dice.roll':    'Tira i Dadi!',
    'dice.reroll.h':'Rapidità di Mano',
    'dice.reroll.d':'{n} rilanci rimasti. Vuoi ritirare i dadi?',
    'dice.reroll.btn':'Ritira i Dadi',
    'dice.accept':  'Accetta risultato',
    'dice.again':   'Gioca ancora',
    'dice.r1':      'Round 1 — Inizia la sfida!',
    'dice.r2':      'Round 2 — Stai barcollando...',
    'dice.r3':      'Finale! Concentrati!',

    /* Drinking game */
    'drink.modal': 'Gara di Bevute',
    'drink.hint':  'Pronto? Bevi quando il livello è nella zona dorata!',
    'drink.drunk': 'Ubriachezza',
    'drink.sober': 'Sobrio',
    'drink.btn':   'Bevi!',
    'drink.close': 'Chiudi',
    'drink.win.nat20':'🍺 Leggenda della Taverna! Un eroe senza pari!',
    'drink.win':      '🍺 Vittoria! Nessuno regge il confronto con te.',
    'drink.loss':     '😵 Sconfitto! Cadi dal sgabello tra le risate degli avventori.',

    /* Prayer */
    'pray.modal':  'Preghiera',
    'pray.faith':  '🙏 Fede',
    'pray.hint':   'Prega con devozione… aspetta il momento di grazia',
    'pray.btn':    '🙏 Amen!',
    'pray.banish': '☩ Scaccia!',
    'pray.close':  'Chiudi',
    'pray.r.divine':'✨ Benedizione Divina!',
    'pray.r.high':   '🙏 Preghiera esaudita!',
    'pray.r.mid':    '🙏 Il Divino ti ha ascoltato.',
    'pray.r.low':    '🙏 Una preghiera tranquilla.',
    'pray.devotion': 'Devozione: {n}%',

    /* Conversion */
    'conv.header':  'Piazza della Conversione',
    'conv.desc':    'Guida il Chierico nella piazza e converti i fedeli! I diavoli tolgono fede a chi si avvicina — tienili lontani muovendoti tra il gregge.',
    'conv.sessions':'sessione disponibile oggi',
    'conv.start':   'Inizia la Missione',
    'conv.converted':'Convertiti:',
    'conv.blessed': 'Benedetti:',
    'conv.hint':    'Muovi il mouse sul canvas per guidare il Chierico',
    'conv.close':   'Chiudi',
    'conv.r.divine':'✨ Benedizione Divina!',
    'conv.r.high':  '✝️ Grande conversione!',
    'conv.r.mid':   '✝️ Il gregge cresce.',
    'conv.r.low':   '✝️ Pochi cuori aperti oggi.',
    'conv.stats':   'Punteggio: {n}% · Benedetti: {b}',

    /* Arena */
    'arena.header': 'Arena dei Gladiatori',
    'arena.desc':   'Sopravvivi il più a lungo possibile contro ondate di nemici. Clicca sui nemici per colpirli. Se uno ti tocca, è finita.',
    'arena.secs':   'Secondi',
    'arena.record': 'Record uccisioni',
    'arena.sessions':'Sessioni oggi',
    'arena.double': 'Doppio Danno attivo',
    'arena.start':  'Entra nell\'Arena',
    'arena.kills':  'abbattuti',
    'arena.again':  'Gioca di Nuovo',
    'arena.win':    'Sopravvissuto! {n} nemici abbattuti!',
    'arena.loss':   'Sconfitto dopo {n} uccisioni',
    'arena.record.new':'🎉 Nuovo record personale!',
    'arena.record.old':'Record: {n} uccisioni',
    'arena.bonus':  'Bonus sopravvivenza +25%',

    /* Rescue (Paladino) */
    'rescue.header': 'Salva i Prigionieri',
    'rescue.desc':   'Muovi il paladino cliccando sulla mappa. Clicca i nemici da vicino per attaccarli. Ogni 10s si attiva il Giusto Potere! che colpisce automaticamente i nemici vicini. Sconfiggi tutti i nemici per evocare il Boss finale!',
    'rescue.pow':    'Giusto Potere!',
    'rescue.str':    'Forza iniziale',
    'rescue.missions':'Missioni oggi',
    'rescue.camps':  'Campi nemici',
    'rescue.dur':    'Durata',
    'rescue.start':  'Inizia la Missione',
    'rescue.hud.pow':'Giusto Potere',
    'rescue.hint':   'Clicca mappa → muovi · Clicca nemico da vicino → attacca · Ogni 6s → Giusto Potere! · Sconfiggi tutti → Boss!',
    'rescue.again':  'Nuova Missione',
    'rescue.r.leg':  '👑 Boss Sconfitto! Leggendario!',
    'rescue.r.glory':'🏆 Missione Gloriosa!',
    'rescue.r.ok':   '✅ Missione Riuscita',
    'rescue.r.part': '⚔️ Missione Parziale',
    'rescue.r.died': '💀 Il Paladino è Caduto',
    'rescue.r.fail': '😔 Missione Fallita',
    'rescue.boss':   '👑 Boss eliminato!',
    'rescue.freed':  '{n}/{max} prigionieri liberati ({pct}%)',
    'rescue.no.rew': 'Nessuna ricompensa',

    /* Stable (Paladino) */
    'stable.modal':  'Cura della Cavalcatura',
    'stable.health': '❤️ Salute:',
    'stable.happy':  '😊 Felicità:',
    'stable.hint':   'Premi il bottone quando l\'icona raggiunge la riga!',
    'stable.close':  'Chiudi',
    'stable.r.best': '🐎 Cavalcatura eccellente!',
    'stable.r.good': '🐎 Buona cura!',
    'stable.r.ok':   '🐎 Sufficiente.',
    'stable.r.fail': '😔 Il cavallo non era soddisfatto...',
    'stable.score':  'Punteggio: {n}%',

    /* Nature game (Druido) */
    'nature.header': 'Equilibrio della Natura',
    'nature.desc':   'Una foresta squilibrata chiede il tuo aiuto. Piazza le tue carte natura sulla griglia per riportare armonia — valori tra 4 e 7 — prima di esaurire le mosse.',
    'nature.low':    '🔴 Troppo basso (<3)',
    'nature.ok':     '🟢 Equilibrato (3–8)',
    'nature.high':   '🟣 Troppo alto (>8)',
    'nature.start':  'Entra nella Foresta',
    'nature.moves':  'Mosse rimaste:',
    'nature.hint':   'Seleziona una carta, poi clicca una cella della griglia',
    'nature.retry':  'Riprova',
    'nature.tomorrow':'Torna domani',

    /* Farming game (Druido) */
    'farm.modal':  'Coltiva la Foresta',
    'farm.score':  'Punti:',
    'farm.legend': 'Clicca quando 💧 o ☀️ lampeggia per avanzare · Quando compare ✂️ <b>clicca ripetutamente</b> per raccogliere · Debella le 🟣 macchie viola cliccando!',
    'farm.r.best': '🌟 Raccolta Eccellente!',
    'farm.r.good': '🌿 Buon Raccolto',
    'farm.r.ok':   '🪴 Raccolto Modesto',
    'farm.r.poor': '🥀 Scarso Raccolto',
    'farm.reward': 'Punteggio: {n} pt — +{xp} PE, +{gold} mo',
    'farm.ingr':   '🎁 Ingrediente: {icon} {name}',

    /* Study / Memory game */
    'study.modal': 'Studio Arcano',
    'study.errors':'Errori: {n}/8',
    'study.pairs': 'Coppie: {n}/6',
    'study.close': 'Chiudi',
    'study.r.best':'🌟 Eccellente',
    'study.r.good':'✅ Buono',
    'study.r.ok':  '⚠️ Sufficiente',
    'study.r.fail':'Fallimento!',
    'study.no.rew':'Nessuna ricompensa.',
    'study.ingr.m':'Componenti',
    'study.ingr.d':'Ingredienti',
    'study.recipe.m':'📖 Incantesimo scoperto',
    'study.recipe.d':'📖 Ricetta scoperta',

    /* Spells (Mago) */
    'spell.lab':      'Laboratorio Arcano',
    'spell.craft.d':  'Seleziona 2–3 componenti dall\'inventario per preparare un incantesimo.',
    'spell.craft.btn':'Incanta',
    'spell.clear':    'Svuota',
    'spell.free.h':   'Crea un incantesimo senza componenti',
    'spell.free.d':   'Grazie alla tua profonda padronanza arcana puoi manifestare magia dal nulla... Richiede una prova di Intelligenza (CD 12). Utilizzabile due volte al giorno.',
    'spell.free.btn': 'Canalizza',
    'spell.components':'Componenti',
    'spell.prepared': 'Incantesimi Preparati',
    'spell.grimoire': 'Grimorio',
    'spell.known.0':  'Nessun incantesimo conosciuto. Studia per scoprirli!',
    'spell.clients':  'Richieste Clienti',
    'spell.clients.0':'Nessuna richiesta oggi.',
    'spell.comp.0':   'Nessuna componente.',
    'spell.inv.0':    'Nessun incantesimo.',
    'spell.ingr.ok':  '✓ disponibile',
    'spell.ingr.miss':'✗ manca',
    'spell.reward':   'Ricompensa: +{xp} PE, +{gold} mo',
    'spell.deliver':  'Consegna',
    'spell.wants':    'vuole',
    'spell.slot':     'Slot {n}',
    'spell.used':     'Esaurite per oggi',
    'spell.left':     '{n} rimanenti',

    /* Compare modal */
    'cmp.market':  'Mercato',
    'cmp.equipped':'{slot} equipaggiato',
    'cmp.empty':   'Slot vuoto',

    /* Item modal — recipe */
    'rec.title':  'Ricetta',
    'rec.ingr':   'Ingredienti/Componenti necessari:',
    'rec.close':  'Chiudi',
    'rec.prep':   'Prepara',

    /* Level up */
    'lvup.title':   'Livello Superiore!',
    'lvup.sub':     'Sei diventato Lv.{n}',
    'lvup.desc':    'Scegli 2 caratteristiche da migliorare (+1 ciascuna)',
    'lvup.count':   'Selezionate: {n}/2',
    'lvup.confirm': 'Conferma',

    /* Character creation */
    'create.title':   'Crea il tuo personaggio',
    'create.class.h': 'Scegli la tua classe',
    'create.intro':   'Sopravvivi giorno per giorno tra missioni e il mercato. Ogni giorno la Gilda esige la sua tassa. Non pagare significa perdere la reputazione.',
    'create.name.lbl':'Nome del personaggio',
    'create.name.ph': 'Inserisci il nome...',
    'create.name.err':'Inserisci un nome per il personaggio.',
    'create.back':    'Cambia classe',
    'create.roll':    'Lancia le Caratteristiche',
    'create.assign.h':'Assegna i tuoi valori alle caratteristiche',
    'create.method':  'Metodo: 4d6, scarta il dado più basso.',
    'create.reroll':  'Rilancia',
    'create.random':  'Assegna casualmente',
    'create.start':   'Inizia l\'Avventura',

    /* Game over */
    'over.title':   'GAME OVER',
    'over.sub':     'La Gilda dei Ladri ti ha espulso per mancato pagamento. La tua reputazione è andata in pezzi.',
    'over.days':    'Giorni sopravvissuto',
    'over.level':   'Livello raggiunto',
    'over.gold':    'Oro rimasto',
    'over.fame':    'Fama finale',
    'over.new':     'Nuova Partita',

    /* New game confirm */
    'newgame.q':    'Vuoi iniziare una nuova partita?',
    'newgame.warn': 'Tutti i progressi andranno persi.',
    'newgame.cancel':'Annulla',
    'newgame.ok':   'Ricomincia',

    /* Toasts / system */
    'toast.lvup':   'Livello {n} raggiunto!',
    'toast.new':    'Benvenuto, {name}! La tua avventura da {cls} ha inizio.',
    'toast.wanted': '🎯 Un Cacciatore di Taglie ti sta cercando! Affrontalo nel tab Missioni.',
    'toast.block':  '⚠️ Devi prima affrontare il Cacciatore di Taglie!',
    'toast.tax.ok': 'Tassa pagata ({n} mo). Giorno {day} — nuove missioni.',
    'toast.tax.ko': 'Impossibile pagare la tassa! -{n} fama. Giorno {day}.',
    'toast.export': '💾 Salvataggio esportato!',

    /* Tutorial */
    'tut.story.h':    'La Storia',
    'tut.story':      'Sei un avventuriero indebitato con la Gilda dei Ladri. Ogni giorno esigono la loro tassa — non pagarla significa perdere la reputazione. Sopravvivi giorno per giorno: affronta missioni, acquista al mercato, potenzia il tuo eroe e tieni soddisfatta la Gilda.',
    'tut.loop.h':     'Il Ciclo Quotidiano',
    'tut.loop.quests':'Guadagna PE e oro',
    'tut.loop.market':'Compra e equipaggia',
    'tut.loop.combat':'Combatti per la gloria',
    'tut.loop.day':   'Paga la tassa',
    'tut.tips.h':     'Consigli',
    'tut.tip1':       'Ogni classe ha abilità speciali uniche — scegli lo stile di gioco che ti si addice.',
    'tut.tip2':       'La tassa della gilda aumenta ogni giorno — tieni le riserve d\'oro in salute.',
    'tut.tip3':       'Equipaggiare oggetti dà bonus alle statistiche e vantaggi speciali.',
    'tut.tip4':       'La Fama sblocca titoli e può ridurre la tua Taglia o Visibilità.',
    'tut.classes.h':  'Classi',
    'tut.cls.guerriero':'Forza bruta, campione d\'arena',
    'tut.cls.paladino': 'Missioni di salvataggio, cavalcatura divina',
    'tut.cls.chierico': 'Preghiera e conversione',
    'tut.cls.druido':   'Coltivazione e erboristeria',
    'tut.cls.ladro':    'Borseggio e giochi di dadi',
    'tut.cls.mago':     'Incantesimi e studio arcano',
    'tut.begin':      'Scegli la tua classe →',

    /* Generic */
    'btn.close':  'Chiudi',
    'btn.again':  'Gioca di Nuovo',
    'lbl.no.rew': 'Nessuna ricompensa',
    'lbl.xp':     'PE',
    'lbl.hp':     'PV',
    'lbl.gp':     'mo',
    'lbl.ac':     'CA',
    'lbl.day':    'Giorno',
  },

  /* ────────────────────────────── ENGLISH ── */
  en: {
    /* Navbar */
    'nav.theme':     'Toggle theme',
    'nav.export':    'Export save to file',
    'nav.import':    'Import save from file',
    'nav.save':      'Save',
    'nav.load':      'Load',
    'nav.newgame':   'New Game',

    /* Day bar */
    'day.prefix':    'Day',
    'day.next':      'End Day',
    'day.gold':      'gp',

    /* Tabs */
    'tab.quests':    'Quests',
    'tab.market':    'Market',
    'tab.inventory': 'Inventory',
    'tab.challenges':'Challenges',
    'tab.dice':      'Play Dice',
    'tab.forest':    'Forest',
    'tab.spells':    'Spellcraft',
    'tab.convert':   'Conversion',
    'tab.arena':     'Arena',
    'tab.rescue':    'Rescue Prisoners',
    'tab.combat':    'Combat',
    'tab.journal':   'Chronicle',

    /* Character card */
    'char.card':       'Character Sheet',
    'char.prof':       'Proficiency',
    'char.xp':         'Experience',
    'char.renown':     'Renown',
    'char.notoriety':  'Notoriety',
    'char.bounty':     'Bounty',
    'char.unknown':    'Unknown',
    'char.renown.pts': 'renown points',
    'char.anon':       '🌫️ Anonymous',
    'char.boosts':     'Active boons',
    'char.pickpocket': 'Pickpocket',
    'char.study':      'Study',
    'char.druid.study':'🌿 Tend the Forest',
    'char.drink':      'Drinking Contest',
    'char.pray':       'Pray',
    'char.stable':     'Tend Mount',

    /* Stats */
    'stat.str': 'STR', 'stat.str.full': 'Strength',
    'stat.dex': 'DEX', 'stat.dex.full': 'Dexterity',
    'stat.con': 'CON', 'stat.con.full': 'Constitution',
    'stat.int': 'INT', 'stat.int.full': 'Intelligence',
    'stat.wis': 'WIS', 'stat.wis.full': 'Wisdom',
    'stat.cha': 'CHA', 'stat.cha.full': 'Charisma',

    /* Classes */
    'class.guerriero': 'Warrior',
    'class.paladino':  'Paladin',
    'class.chierico':  'Cleric',
    'class.druido':    'Druid',
    'class.ladro':     'Rogue',
    'class.mago':      'Mage',

    /* Combat HUD */
    'combat.header':   'Battle',
    'combat.turn':     'Round',
    'combat.hero':     'Hero',
    'combat.enemy':    'Foe',
    'combat.ac':       '🛡️ AC',
    'combat.hp.max':   '❤️ Max HP',
    'combat.sessions': 'Battles today',
    'combat.start':    '⚔️ Seek an Enemy',
    'combat.exit':     '🚪 Retreat',
    'combat.win.xp':   '⭐ Experience points',
    'combat.win.gold': '💰 Gold',
    'combat.win.fame': '🌟 Renown',
    'combat.win.item': '🎁 An item with bonus in —',
    'combat.loss.gold':'💸 10–20% of your gold',
    'combat.loss.item':'🎒 A random item from inventory or equipment',
    'combat.loss.fame':'👁️ 3 renown points',
    'combat.win.head': '🏆 Victory',
    'combat.loss.head':'💀 Defeat',

    /* Market */
    'market.refresh': 'Refreshes each day',
    'market.empty':   'No wares available.',
    'market.empty2':  'No wares available today.',
    'market.banned':  'The merchant has recognised you — you may neither buy nor steal today.',
    'market.steal':   'Steal',
    'market.buy':     'Purchase',
    'market.buy.ban': 'Banned',
    'market.buy.low': 'Low Lvl',
    'market.buy.gold':'No Gold',
    'market.req.lv':  'Requires Lv.{n}',
    'market.req.stat':'{stat} {n} required',

    /* Inventory */
    'inv.equip':  'Equipment',
    'inv.pack':   'Pack',
    'inv.empty':  'Empty',
    'inv.empty2': 'Pack is empty',

    /* Item modal */
    'item.effect':    'Effect',
    'item.stats':     'Statistics',
    'item.abilities': 'Special abilities',
    'item.reqs':      'Requirements',
    'item.req.lv':    'Level required',
    'item.req.stat':  '{stat} required',
    'item.sell.val':  'Sale value',
    'item.use':       'Use',
    'item.equip':     'Equip',
    'item.compare':   'Compare',
    'item.sell':      'Sell ({n} gp)',
    'item.unequip':   'Remove',
    'item.buy.btn':   'Buy ({n} gp)',
    'item.close':     'Close',
    'item.boost.on':  'Boon already active',
    'item.no.gold':   'Insufficient gold',
    'item.no.lv':     'Requires Lv.{n}',

    /* Missions */
    'quest.avail':    'Quests available today',
    'quest.done.cnt': 'Completed: {n} / {max}',
    'quest.loading':  'Loading quests...',
    'quest.empty':    'No quests available.',
    'quest.limit':    'Daily limit reached',
    'quest.action':   'Undertake quest',
    'quest.done':     'Completed',
    'quest.tag.item': 'item possible',
    'quest.invest':   'Investment in Knowledge',
    'quest.invest.d': 'Spend {n} gp on tomes, mentors and contacts to earn {n2} XP.',
    'quest.invest.0': 'You lack the gold to invest today.',
    'quest.invest.u': 'Already invested today: −{n} gp → +{n2} XP (×{mult})',
    'quest.invest.done':'Completed',
    'quest.invest.btn':'Invest',
    'quest.invest.toast': 'Investment: −{n} gp → +{n2} XP!',

    /* Mission modal */
    'mq.title':    'Quest',
    'mq.req':      'Check required',
    'mq.roll':     'Roll the dice',
    'mq.how':      'How do you wish to approach this quest?',
    'mq.reroll':   'Use Fortune Die ({n} left)',
    'mq.close':    'Close',

    /* Mission roll results */
    'roll.nat20':  'CRITICAL HIT 🎯',
    'roll.success':'Passed',
    'roll.partial':'Partial',
    'roll.fail':   'Failed',
    'roll.nat1':   'FUMBLE',
    'roll.dice':   'die',
    'roll.prof':   'proficiency',
    'roll.xp':     '+{n} experience points',
    'roll.gold':   '+{n} gold pieces',
    'roll.fame.p': '+{n} renown points',
    'roll.fame.n': '{n} renown points',
    'roll.item':   'Found: {name}',

    /* Challenges */
    'chal.info':   'Completed challenges are replaced the following day',
    'chal.loading':'Loading challenges...',
    'chal.empty':  'No challenges available.',
    'chal.refresh':   '🔄 {n} refresh{e} available',
    'chal.today':  'Expires today',
    '1.day':       '1 day',
    'n.days':      '{n} days',
    'chal.done':   'Completed',
    'chal.ongoing':'In progress',

    /* Journal */
    'journal.header': 'Chronicle of Adventures',
    'journal.empty':  'Your chronicle is still blank...',
    'journal.day':    'Day {n}',

    /* Guild tax */
    'tax.label':    'Daily guild tithe: {n} gp',
    'tax.broke':    'Insufficient!',

    /* Thief attack */
    'thief.title':  'ROGUE',
    'thief.desc':   'A hooded figure shadows you.',
    'thief.warn':   'Confront or suffer the theft before advancing to the next day',
    'thief.win':    'Victory: XP + Renown + rogue\'s gold',
    'thief.loss':   'Defeat: Lose up to 20% of your gold',
    'thief.a1':     'Stand your ground',
    'thief.a2':     'Lay an ambush',
    'thief.a3':     'Anticipate their moves',

    /* Wanted */
    'wanted.title': 'BOUNTY HUNTER',
    'wanted.desc':  'A blade-for-hire awaits in the alley.',
    'wanted.warn':  'Mandatory encounter — resolve it before advancing to the next day',
    'wanted.win':   'Victory: XP + Renown + Bounty reduced',
    'wanted.loss':  'Defeat: Gold halved',
    'wanted.btn':   'Face the Hunter',
    'wanted.modal': 'Bounty Attack',
    'wanted.hint':  'Click when 🗡️ touches ⚔️!',
    'wanted.round.win':   '✅ Check passed! Brace yourself...',
    'wanted.round.loss':  '❌ Missed!',
    'wanted.outcome.win': 'The hunter lies defeated. Your bounty has been drastically reduced.',
    'wanted.outcome.loss':'You managed to flee, but lost half your gold. Your bounty still dropped.',
    'wanted.reward':      'Bounty −{n} pts → {r} pts remaining',
    'wanted.penalty':     '-{n} gold pieces',

    /* Pickpocket */
    'pp.modal': 'Pickpocket',
    'pp.hint':  'Click when the hand is over the purse!',
    'pp.reroll':'Use Fortune Die ({n} left)',
    'pp.close': 'Close',
    'pp.gold':  '+{n} gold pieces',
    'pp.xp':    '+{n} experience points',
    'pp.item':  'Found: {name}',

    /* Dice game */
    'dice.title':   'The Dice Table',
    'dice.broke':   'Insufficient gold to wager.',
    'dice.bet':     'Wager:',
    'dice.quickness':'Sleight of Hand:',
    'dice.roll':    'Roll the Dice!',
    'dice.reroll.h':'Sleight of Hand',
    'dice.reroll.d':'{n} rerolls remaining. Reroll the dice?',
    'dice.reroll.btn':'Reroll Dice',
    'dice.accept':  'Accept result',
    'dice.again':   'Play again',
    'dice.r1':      'Round 1 — The game begins!',
    'dice.r2':      'Round 2 — You\'re swaying...',
    'dice.r3':      'Final round — Focus!',

    /* Drinking game */
    'drink.modal': 'Drinking Contest',
    'drink.hint':  'Ready? Drink when the level hits the golden zone!',
    'drink.drunk': 'Inebriation',
    'drink.sober': 'Sober',
    'drink.btn':   'Drink!',
    'drink.close': 'Close',
    'drink.win.nat20':'🍺 Tavern Legend! A hero without equal!',
    'drink.win':      '🍺 Victory! None can match your constitution.',
    'drink.loss':     '😵 Defeated! You topple from your stool to raucous laughter.',

    /* Prayer */
    'pray.modal':  'Prayer',
    'pray.faith':  '🙏 Faith',
    'pray.hint':   'Pray with devotion… await the moment of grace',
    'pray.btn':    '🙏 Amen!',
    'pray.banish': '☩ Banish!',
    'pray.close':  'Close',
    'pray.r.divine':'✨ Divine Blessing!',
    'pray.r.high':   '🙏 Prayer answered!',
    'pray.r.mid':    '🙏 The Divine has heard you.',
    'pray.r.low':    '🙏 A quiet moment of prayer.',
    'pray.devotion': 'Devotion: {n}%',

    /* Conversion */
    'conv.header':  'The Conversion Square',
    'conv.desc':    'Guide the Cleric through the square and convert the faithful! Devils drain the faith of those nearby — keep them at bay by moving among your flock.',
    'conv.sessions':'session available today',
    'conv.start':   'Begin the Mission',
    'conv.converted':'Converts:',
    'conv.blessed': 'Blessed:',
    'conv.hint':    'Move the mouse on the canvas to guide the Cleric',
    'conv.close':   'Close',
    'conv.r.divine':'✨ Divine Blessing!',
    'conv.r.high':  '✝️ Great conversion!',
    'conv.r.mid':   '✝️ The flock grows.',
    'conv.r.low':   '✝️ Few open hearts today.',
    'conv.stats':   'Score: {n}% · Blessed: {b}',

    /* Arena */
    'arena.header': 'Gladiators\' Arena',
    'arena.desc':   'Survive as long as possible against waves of enemies. Click enemies to strike. If one touches you, it\'s over.',
    'arena.secs':   'Seconds',
    'arena.record': 'Kill record',
    'arena.sessions':'Sessions today',
    'arena.double': 'Double Damage active',
    'arena.start':  'Enter the Arena',
    'arena.kills':  'slain',
    'arena.again':  'Play Again',
    'arena.win':    'Survived! {n} enemies slain!',
    'arena.loss':   'Fallen after {n} kills',
    'arena.record.new':'🎉 New personal record!',
    'arena.record.old':'Record: {n} kills',
    'arena.bonus':  'Survival bonus +25%',

    /* Rescue (Paladino) */
    'rescue.header': 'Rescue the Prisoners',
    'rescue.desc':   'Guide the Paladin by clicking the map. Click nearby enemies to attack. Every 10s, Righteous Might! strikes surrounding foes automatically. Defeat all enemies to summon the final Boss!',
    'rescue.pow':    'Righteous Might!',
    'rescue.str':    'Starting Strength',
    'rescue.missions':'Missions today',
    'rescue.camps':  'Enemy camps',
    'rescue.dur':    'Duration',
    'rescue.start':  'Begin the Mission',
    'rescue.hud.pow':'Righteous Might',
    'rescue.hint':   'Click map → move · Click nearby foe → attack · Every 6s → Righteous Might! · Defeat all → Boss!',
    'rescue.again':  'New Mission',
    'rescue.r.leg':  '👑 Boss Defeated! Legendary!',
    'rescue.r.glory':'🏆 Glorious Victory!',
    'rescue.r.ok':   '✅ Mission Accomplished',
    'rescue.r.part': '⚔️ Partial Victory',
    'rescue.r.died': '💀 The Paladin Has Fallen',
    'rescue.r.fail': '😔 Mission Failed',
    'rescue.boss':   '👑 Boss eliminated!',
    'rescue.freed':  '{n}/{max} prisoners freed ({pct}%)',
    'rescue.no.rew': 'No reward',

    /* Stable (Paladino) */
    'stable.modal':  'Tend your Mount',
    'stable.health': '❤️ Health:',
    'stable.happy':  '😊 Happiness:',
    'stable.hint':   'Press the button when the icon reaches the line!',
    'stable.close':  'Close',
    'stable.r.best': '🐎 Steed in excellent health!',
    'stable.r.good': '🐎 Well tended!',
    'stable.r.ok':   '🐎 Adequate care.',
    'stable.r.fail': '😔 Your horse was not satisfied...',
    'stable.score':  'Score: {n}%',

    /* Nature game (Druido) */
    'nature.header': 'Balance of Nature',
    'nature.desc':   'An unbalanced forest needs your aid. Place your nature cards on the grid to restore harmony — values between 4 and 7 — before your moves run out.',
    'nature.low':    '🔴 Too low (<3)',
    'nature.ok':     '🟢 Balanced (3–8)',
    'nature.high':   '🟣 Too high (>8)',
    'nature.start':  'Enter the Forest',
    'nature.moves':  'Moves remaining:',
    'nature.hint':   'Select a card, then click a cell on the grid',
    'nature.retry':  'Try Again',
    'nature.tomorrow':'Come back tomorrow',

    /* Farming game (Druido) */
    'farm.modal':  'Tend the Forest',
    'farm.score':  'Score:',
    'farm.legend': 'Click when 💧 or ☀️ flashes to advance · When ✂️ appears, <b>click repeatedly</b> to harvest · Dispel the 🟣 purple blight by clicking!',
    'farm.r.best': '🌟 Bountiful Harvest!',
    'farm.r.good': '🌿 Good Harvest',
    'farm.r.ok':   '🪴 Modest Harvest',
    'farm.r.poor': '🥀 Poor Harvest',
    'farm.reward': 'Score: {n} pts — +{xp} XP, +{gold} gp',
    'farm.ingr':   '🎁 Ingredient: {icon} {name}',

    /* Study / Memory game */
    'study.modal': 'Arcane Study',
    'study.errors':'Errors: {n}/8',
    'study.pairs': 'Pairs: {n}/6',
    'study.close': 'Close',
    'study.r.best':'🌟 Excellent',
    'study.r.good':'✅ Good',
    'study.r.ok':  '⚠️ Sufficient',
    'study.r.fail':'Failure!',
    'study.no.rew':'No reward.',
    'study.ingr.m':'Components',
    'study.ingr.d':'Ingredients',
    'study.recipe.m':'📖 Spell discovered',
    'study.recipe.d':'📖 Recipe discovered',

    /* Spells (Mago) */
    'spell.lab':      'Arcane Laboratory',
    'spell.craft.d':  'Select 2–3 components from your inventory to brew a spell.',
    'spell.craft.btn':'Enchant',
    'spell.clear':    'Clear',
    'spell.free.h':   'Weave a spell without components',
    'spell.free.d':   'Through your profound mastery of the arcane you can manifest magic from nothing... Requires an Intelligence check (DC 12). Usable twice per day.',
    'spell.free.btn': 'Channel',
    'spell.components':'Components',
    'spell.prepared': 'Prepared Spells',
    'spell.grimoire': 'Spellbook',
    'spell.known.0':  'No spells known. Study to discover them!',
    'spell.clients':  'Client Requests',
    'spell.clients.0':'No requests today.',
    'spell.comp.0':   'No components.',
    'spell.inv.0':    'No spells.',
    'spell.ingr.ok':  '✓ available',
    'spell.ingr.miss':'✗ missing',
    'spell.reward':   'Reward: +{xp} XP, +{gold} gp',
    'spell.deliver':  'Deliver',
    'spell.wants':    'wants',
    'spell.slot':     'Slot {n}',
    'spell.used':     'Expended for today',
    'spell.left':     '{n} remaining',

    /* Compare modal */
    'cmp.market':  'Market',
    'cmp.equipped':'{slot} equipped',
    'cmp.empty':   'Empty slot',

    /* Item modal — recipe */
    'rec.title':  'Recipe',
    'rec.ingr':   'Required ingredients/components:',
    'rec.close':  'Close',
    'rec.prep':   'Prepare',

    /* Level up */
    'lvup.title':   'Level Up!',
    'lvup.sub':     'You have reached Lv.{n}',
    'lvup.desc':    'Choose 2 ability scores to improve (+1 each)',
    'lvup.count':   'Selected: {n}/2',
    'lvup.confirm': 'Confirm',

    /* Character creation */
    'create.title':   'Create your character',
    'create.class.h': 'Choose your class',
    'create.intro':   'Survive day by day through quests and the market. Each day the Guild demands its tithe. Failing to pay means losing your standing.',
    'create.name.lbl':'Character name',
    'create.name.ph': 'Enter your name...',
    'create.name.err':'Please enter a name for your character.',
    'create.back':    'Change class',
    'create.roll':    'Roll Ability Scores',
    'create.assign.h':'Assign your scores to ability scores',
    'create.method':  'Method: 4d6, drop the lowest die.',
    'create.reroll':  'Reroll',
    'create.random':  'Assign randomly',
    'create.start':   'Begin the Adventure',

    /* Game over */
    'over.title':   'GAME OVER',
    'over.sub':     'The Thieves\' Guild has expelled you for non-payment. Your reputation lies in ruins.',
    'over.days':    'Days survived',
    'over.level':   'Level reached',
    'over.gold':    'Gold remaining',
    'over.fame':    'Final renown',
    'over.new':     'New Game',

    /* New game confirm */
    'newgame.q':    'Start a new game?',
    'newgame.warn': 'All progress will be lost.',
    'newgame.cancel':'Cancel',
    'newgame.ok':   'Start over',

    /* Toasts / system */
    'toast.lvup':   'Level {n} reached!',
    'toast.new':    'Welcome, {name}! Your adventure as a {cls} begins.',
    'toast.wanted': '🎯 A Bounty Hunter is on your trail! Find them in the Quests tab.',
    'toast.block':  '⚠️ You must first face the Bounty Hunter!',
    'toast.tax.ok': 'Tithe paid ({n} gp). Day {day} — new quests await.',
    'toast.tax.ko': 'Unable to pay the tithe! -{n} renown. Day {day}.',
    'toast.export': '💾 Save exported!',

    /* Tutorial */
    'tut.story.h':    'The Story',
    'tut.story':      'You are an adventurer deep in debt to the Thieves\' Guild. Each day they demand their tithe — fail to pay and your reputation crumbles. Survive day by day: take quests, shop at the market, level up your hero, and keep the Guild satisfied.',
    'tut.loop.h':     'Daily Loop',
    'tut.loop.quests':'Earn XP & gold',
    'tut.loop.market':'Buy & equip gear',
    'tut.loop.combat':'Fight for glory',
    'tut.loop.day':   'Pay the tithe',
    'tut.tips.h':     'Tips',
    'tut.tip1':       'Each class has unique special abilities — pick the playstyle that suits you.',
    'tut.tip2':       'The guild tithe rises each day — keep your gold reserves healthy.',
    'tut.tip3':       'Equipping items grants stat bonuses and special perks.',
    'tut.tip4':       'Renown unlocks titles and can reduce your Bounty or Notoriety.',
    'tut.classes.h':  'Classes',
    'tut.cls.guerriero':'Brute force, arena champion',
    'tut.cls.paladino': 'Rescue quests, divine mount',
    'tut.cls.chierico': 'Prayer & conversion',
    'tut.cls.druido':   'Tend the forest, herbalism',
    'tut.cls.ladro':    'Pickpocket & dice games',
    'tut.cls.mago':     'Spellcraft & arcane study',
    'tut.begin':      'Choose your class →',

    /* Generic */
    'btn.close':  'Close',
    'btn.again':  'Play Again',
    'lbl.no.rew': 'No reward',
    'lbl.xp':     'XP',
    'lbl.hp':     'HP',
    'lbl.gp':     'gp',
    'lbl.ac':     'AC',
    'lbl.day':    'Day',
  }
};

/* ═══════════════════════════════════════════════════════════
   I18n singleton
   ═══════════════════════════════════════════════════════════ */
const I18n = {
  lang: (() => { try { return localStorage.getItem('bhs_lang') || 'en'; } catch(e) { return 'en'; } })(),

  t(key, vars = {}) {
    const dict = TRANSLATIONS[this.lang] ?? TRANSLATIONS.en;
    let s = dict[key] ?? TRANSLATIONS.en[key] ?? TRANSLATIONS.it[key] ?? key;
    Object.entries(vars).forEach(([k, v]) => {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
    return s;
  },

  setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    this.lang = lang;
    try { localStorage.setItem('bhs_lang', lang); } catch(e) {}
    this.apply();
    if (typeof UI !== 'undefined' && UI.refresh) UI.refresh();
  },

  apply() {
    // Language toggle button icon
    const btn = document.getElementById('btn-lang-toggle');
    if (btn) btn.innerHTML = this.lang === 'it' ? '🇬🇧' : '🇮🇹';

    // Static elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.dataset.i18nTitle);
    });
  }
};

// Shorthand global
window.I18n = I18n;
window.t = (key, vars) => I18n.t(key, vars);
