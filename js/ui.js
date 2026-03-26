/* ============================================================
   ui.js — Rendering e aggiornamento dell'interfaccia v2
   ============================================================ */

const UI = {

  /* ─── Qualità badge ─────────────────────────────────────── */
  qualityBadge(q) {
    const qd = QUALITY[q];
    if (!qd) return '';
    return `<span class="quality-badge ${qd.cls}">${qd.name}</span>`;
  },

  /* ─── Scheda personaggio ───────────────────────────────── */
  renderCharacter() {
    const { character: c } = Game.state;

    document.getElementById('char-name').textContent  = c.name;
    document.getElementById('char-level').textContent = `Lv.${c.level}`;
    document.getElementById('day-badge').textContent  = `Giorno ${c.day}`;

    // Bonus competenza
    document.getElementById('prof-badge').textContent = `+${c.proficiency}`;

    // Stats — mostra valori effettivi con indicazione bonus
    const statKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const statIds  = { str: 'stat-str', dex: 'stat-dex', con: 'stat-con', int: 'stat-int', wis: 'stat-wis', cha: 'stat-cha' };
    for (const key of statKeys) {
      const box      = document.getElementById(statIds[key]);
      const effVal   = Game.effectiveStat(key);
      const equipB   = Game.equipBonusForStat(key);
      const mod      = Game.modifier(effVal);
      box.querySelector('.stat-value').textContent = effVal + (equipB > 0 ? '' : '');
      box.querySelector('.stat-mod').textContent   = (mod >= 0 ? '+' : '') + mod;
      box.classList.toggle('proficient', Game.hasProficiency(key));
      box.classList.toggle('has-equip-bonus', equipB > 0);
      box.title = equipB > 0 ? `Base: ${c.stats[key]} + Equip: +${equipB}` : '';
    }

    // XP
    const xpNext = Game.xpForNextLevel();
    document.getElementById('xp-text').textContent = `${c.xp} / ${xpNext}`;
    document.getElementById('xp-bar').style.width  = Game.xpPercent() + '%';

    // Fama
    const fameLevel = Game.getFameLevel();
    document.getElementById('fame-title').textContent  = fameLevel.title;
    document.getElementById('fame-points').textContent = c.fame;
    document.getElementById('fame-bar').style.width    = Game.famePercent() + '%';

    // Oro
    document.getElementById('char-gold').textContent = c.gold;

    // Taglia (nascosta per il Mago)
    const isMago = Game.getClasse().id === 'mago';
    document.getElementById('wanted-display').classList.toggle('d-none', isMago);
    if (!isMago) {
      const wanted    = c.wanted || 0;
      const wl        = Game.getWantedLevel();
      const wantedPct = Math.min(100, wanted / 300 * 100);
      document.getElementById('wanted-label').textContent         = `${wl.icon} ${wl.label}`;
      document.getElementById('wanted-bar-fill').style.width      = wantedPct + '%';
      document.getElementById('wanted-bar-fill').style.background = wl.color;
      document.getElementById('wanted-points').textContent        = `${wanted} pt`;
      document.getElementById('wanted-display').style.opacity     = wanted === 0 ? '0.4' : '1';
    }
  },

  /* ─── Boost attivi ─────────────────────────────────────── */
  renderActiveBoosts() {
    if (!Game.state) return;
    const boosts = Game.state.activeBoosts || [];
    const el     = document.getElementById('active-boosts-display');
    if (!el) return;
    if (!boosts.length) { el.classList.add('d-none'); return; }
    el.classList.remove('d-none');
    document.getElementById('active-boosts-list').innerHTML = boosts.map(b => {
      const parts = [];
      if (b.xpBoost)   parts.push(`+${Math.round(b.xpBoost*100)}% PE`);
      if (b.goldBoost)  parts.push(`+${Math.round(b.goldBoost*100)}% oro`);
      if (b.fameBoost) parts.push(`+${Math.round(b.fameBoost*100)}% fama`);
      return `<div class="boost-badge">
        <span class="boost-name">${b.name}</span>
        <span class="text-success small">${parts.join(' ')}</span>
        <span class="boost-days">${b.daysLeft}g</span>
      </div>`;
    }).join('');
  },

  _consumableEffectHtml(item) {
    if (!item?.effect) return '';
    const e = item.effect;
    if (e.type === 'instant') {
      const parts = [];
      if (e.xp)   parts.push(`+${e.xp} PE`);
      if (e.gold)  parts.push(`+${e.gold} mo`);
      if (e.fame)  parts.push(`+${e.fame} fama`);
      return `<div class="reward-row"><span class="reward-icon">⚡</span><span class="text-success">${parts.join(', ')}</span> <span class="text-muted small">(istantaneo)</span></div>`;
    } else {
      const parts = [];
      if (e.xpBoost)   parts.push(`+${Math.round(e.xpBoost*100)}% PE`);
      if (e.goldBoost)  parts.push(`+${Math.round(e.goldBoost*100)}% oro`);
      if (e.fameBoost) parts.push(`+${Math.round(e.fameBoost*100)}% fama`);
      return `<div class="reward-row"><span class="reward-icon">⏱️</span><span class="text-info">${parts.join(' ')}</span> <span class="text-muted small">per ${e.duration} giorni</span></div>`;
    }
  },

  /* ─── Pickpocket button ─────────────────────────────────── */
  renderPickpocketBtn() {
    const remaining = Game.pickpocketsRemaining();
    const btn       = document.getElementById('btn-pickpocket');
    const badge     = document.getElementById('pickpocket-badge');
    badge.textContent = remaining;
    btn.disabled = remaining <= 0 || Game.state.gameOver;
  },

  /* ─── Studio btn (Mago e Druido) ────────────────────────── */
  renderStudyBtn() {
    const btn   = document.getElementById('btn-study');
    const badge = document.getElementById('study-badge');
    if (!btn) return;
    const remaining = Game.studiesRemaining();
    badge.textContent = remaining;
    btn.disabled = remaining <= 0 || Game.state.gameOver;
  },

  /* ─── Tab Pozioni (solo Druido) ────────────────────────────── */
  renderPozioniTab() {
    const ingInv    = Game.state.ingredientInventory || [];
    const potInv    = Game.state.potionInventory     || [];
    const requests  = Game.state.potionRequests      || [];

    // Badge contatori
    document.getElementById('ingredient-count').textContent = ingInv.length;
    document.getElementById('potion-count').textContent     = potInv.length;

    // Ingredienti raggruppati per ID
    this._renderIngredientInventory(ingInv);
    this._renderPotionInventory(potInv);
    this._renderPotionRequests(requests);
  },

  _renderIngredientInventory(ingInv) {
    const el = document.getElementById('ingredient-inventory');
    if (!el) return;
    if (ingInv.length === 0) {
      el.innerHTML = '<p class="text-muted small fst-italic">Nessun ingrediente.</p>';
      return;
    }
    // Raggruppa per ID
    const counts = {};
    ingInv.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    const uniqueIds = Object.keys(counts).map(Number).sort((a, b) => {
      const ia = INGREDIENTS.find(x => x.id === a);
      const ib = INGREDIENTS.find(x => x.id === b);
      return (ia?.quality || 0) - (ib?.quality || 0);
    });
    el.innerHTML = uniqueIds.map(id => {
      const ing = INGREDIENTS.find(x => x.id === id);
      if (!ing) return '';
      const qty = counts[id];
      const qCls = QUALITY[ing.quality]?.cls || '';
      const selected = (App._craftSelected || []).filter(x => x === id).length;
      const isSelected = selected > 0;
      return `<div class="ingredient-card ${isSelected ? 'selected' : ''}" data-ing-id="${id}" title="${ing.desc}">
        <span>${ing.icon}</span>
        <span class="${qCls}" style="flex:1">${ing.name}</span>
        <span class="ingredient-qty">×${qty}</span>
      </div>`;
    }).join('');
  },

  _renderPotionInventory(potInv) {
    const el = document.getElementById('potion-inventory');
    if (!el) return;
    if (potInv.length === 0) {
      el.innerHTML = '<p class="text-muted small fst-italic">Nessuna pozione.</p>';
      return;
    }
    const counts = {};
    potInv.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    el.innerHTML = Object.keys(counts).map(id => {
      const recipe = POTION_RECIPES.find(r => r.id === id);
      if (!recipe) return '';
      const qCls = QUALITY[recipe.quality]?.cls || '';
      return `<div class="potion-card">
        <span>${recipe.icon}</span>
        <span class="${qCls}" style="flex:1">${recipe.name}</span>
        <span class="ingredient-qty">×${counts[id]}</span>
      </div>`;
    }).join('');
  },

  _renderPotionRequests(requests) {
    const el = document.getElementById('potion-requests');
    if (!el) return;
    if (requests.length === 0) {
      el.innerHTML = '<p class="text-muted small fst-italic">Nessuna richiesta oggi.</p>';
      return;
    }
    el.innerHTML = requests.map(req => {
      const recipe = POTION_RECIPES.find(r => r.id === req.recipeId);
      if (!recipe) return '';
      const potInv = Game.state.potionInventory || [];
      const hasPotion = potInv.includes(req.recipeId);
      const qCls = QUALITY[recipe.quality]?.cls || '';
      return `<div class="potion-request-card mb-2">
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="fw-bold text-gold">${req.clientName}</span>
          <span class="text-muted small">vuole</span>
          <span>${recipe.icon} <span class="${qCls}">${recipe.name}</span></span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="small text-muted">
            💰 ${req.reward.gold} mo &nbsp; ⭐ ${req.reward.fame} fama &nbsp; 📚 ${req.reward.xp} PE
          </div>
          <button class="btn btn-sm ${hasPotion ? 'btn-gold' : 'btn-outline-secondary'}"
            ${hasPotion ? '' : 'disabled'}
            data-request-id="${req.id}">
            <i class="bi bi-box-arrow-right"></i> Consegna
          </button>
        </div>
      </div>`;
    }).join('');
  },

  renderCraftSlots() {
    const el = document.getElementById('craft-ingredient-slots');
    if (!el) return;
    const selected = App._craftSelected || [];
    const MAX = 3;
    let html = selected.map((id, i) => {
      const ing = INGREDIENTS.find(x => x.id === id);
      return `<div class="craft-slot filled" data-slot-index="${i}" title="Clicca per rimuovere">
        ${ing ? ing.icon : '?'} <span class="small">${ing ? ing.name : '?'}</span>
        <span class="craft-slot-remove">×</span>
      </div>`;
    }).join('');
    for (let i = selected.length; i < MAX; i++) {
      html += `<div class="craft-slot empty"><span class="text-muted small">Slot ${i+1}</span></div>`;
    }
    el.innerHTML = html;
    const btn = document.getElementById('btn-craft-potion');
    if (btn) btn.disabled = selected.length < 2 || selected.length > MAX;
  },

  /* ─── Tab Pozioni comment update ───────────────────────── */

  /* ─── Tab Incantesimi (solo Mago) ───────────────────────── */
  renderIncantesimiTab() {
    const compInv   = Game.state.componentInventory || [];
    const spellInv  = Game.state.spellInventory     || [];
    const requests  = Game.state.spellRequests      || [];
    const known     = Game.state.knownSpells        || [];

    const countEl = document.getElementById('component-count');
    const spellCountEl = document.getElementById('spell-count');
    const knownCountEl = document.getElementById('known-spells-count');
    if (countEl)      countEl.textContent     = compInv.length;
    if (spellCountEl) spellCountEl.textContent = spellInv.length;
    if (knownCountEl) knownCountEl.textContent  = known.length;

    this._renderComponentInventory(compInv);
    this._renderSpellInventory(spellInv);
    this._renderSpellRequests(requests);
    this._renderKnownSpells(known);

    // Anche aggiorna il Ricettario del Druido se visibile
    const knownRecipes = Game.state.knownRecipes || [];
    const krCountEl = document.getElementById('known-recipes-count');
    if (krCountEl) krCountEl.textContent = knownRecipes.length;
    this._renderKnownRecipes(knownRecipes);
  },

  _renderComponentInventory(compInv) {
    const el = document.getElementById('component-inventory');
    if (!el) return;
    if (compInv.length === 0) {
      el.innerHTML = '<p class="text-muted small fst-italic">Nessuna componente.</p>';
      return;
    }
    const counts = {};
    compInv.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    const uniqueIds = Object.keys(counts).map(Number).sort((a, b) => {
      const ca = SPELL_COMPONENTS.find(x => x.id === a);
      const cb = SPELL_COMPONENTS.find(x => x.id === b);
      return (ca?.quality || 0) - (cb?.quality || 0);
    });
    el.innerHTML = uniqueIds.map(id => {
      const comp = SPELL_COMPONENTS.find(x => x.id === id);
      if (!comp) return '';
      const qty = counts[id];
      const qCls = QUALITY[comp.quality]?.cls || '';
      const selected = (App._spellCraftSelected || []).filter(x => x === id).length;
      const isSelected = selected > 0;
      return `<div class="ingredient-card ${isSelected ? 'selected' : ''}" data-comp-id="${id}" title="${comp.desc}">
        <span>${comp.icon}</span>
        <span class="${qCls}" style="flex:1">${comp.name}</span>
        <span class="ingredient-qty">×${qty}</span>
      </div>`;
    }).join('');
  },

  _renderSpellInventory(spellInv) {
    const el = document.getElementById('spell-inventory');
    if (!el) return;
    if (spellInv.length === 0) {
      el.innerHTML = '<p class="text-muted small fst-italic">Nessun incantesimo.</p>';
      return;
    }
    const counts = {};
    spellInv.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
    el.innerHTML = Object.keys(counts).map(id => {
      const recipe = SPELL_RECIPES.find(r => r.id === id);
      if (!recipe) return '';
      const qCls = QUALITY[recipe.quality]?.cls || '';
      return `<div class="potion-card">
        <span>${recipe.icon}</span>
        <span class="${qCls}" style="flex:1">${recipe.name}</span>
        <span class="ingredient-qty">×${counts[id]}</span>
      </div>`;
    }).join('');
  },

  _renderSpellRequests(requests) {
    const el = document.getElementById('spell-requests');
    if (!el) return;
    if (requests.length === 0) {
      el.innerHTML = '<p class="text-muted small fst-italic">Nessuna richiesta oggi.</p>';
      return;
    }
    el.innerHTML = requests.map(req => {
      const recipe = SPELL_RECIPES.find(r => r.id === req.recipeId);
      if (!recipe) return '';
      const spellInv = Game.state.spellInventory || [];
      const hasSpell = spellInv.includes(req.recipeId);
      const qCls = QUALITY[recipe.quality]?.cls || '';
      return `<div class="potion-request-card mb-2">
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="fw-bold text-gold">${req.clientName}</span>
          <span class="text-muted small">vuole</span>
          <span>${recipe.icon} <span class="${qCls}">${recipe.name}</span></span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="small text-muted">
            💰 ${req.reward.gold} mo &nbsp; ⭐ ${req.reward.fame} fama &nbsp; 📚 ${req.reward.xp} PE
          </div>
          <button class="btn btn-sm ${hasSpell ? 'btn-gold' : 'btn-outline-secondary'}"
            ${hasSpell ? '' : 'disabled'}
            data-spell-request-id="${req.id}">
            <i class="bi bi-box-arrow-right"></i> Consegna
          </button>
        </div>
      </div>`;
    }).join('');
  },

  _renderKnownSpells(known) {
    const el = document.getElementById('known-spells-list');
    if (!el) return;
    if (known.length === 0) {
      el.innerHTML = '<p class="text-muted small fst-italic">Nessun incantesimo conosciuto. Studia per scoprirli!</p>';
      return;
    }
    el.innerHTML = known.map(id => {
      const r = SPELL_RECIPES.find(x => x.id === id);
      if (!r) return '';
      const qCls = QUALITY[r.quality]?.cls || '';
      return `<div class="recipe-card" data-recipe-id="${r.id}" data-recipe-type="spell">
        <span>${r.icon}</span>
        <span class="${qCls}" style="flex:1">${r.name}</span>
        <span class="badge" style="background:${QUALITY[r.quality]?.color || '#999'};color:#000;font-size:.65rem">Q${r.quality}</span>
      </div>`;
    }).join('');
  },

  _renderKnownRecipes(known) {
    const el = document.getElementById('known-recipes-list');
    if (!el) return;
    if (known.length === 0) {
      el.innerHTML = '<p class="text-muted small fst-italic">Nessuna ricetta conosciuta. Studia per scoprirle!</p>';
      return;
    }
    el.innerHTML = known.map(id => {
      const r = POTION_RECIPES.find(x => x.id === id);
      if (!r) return '';
      const qCls = QUALITY[r.quality]?.cls || '';
      return `<div class="recipe-card" data-recipe-id="${r.id}" data-recipe-type="potion">
        <span>${r.icon}</span>
        <span class="${qCls}" style="flex:1">${r.name}</span>
        <span class="badge" style="background:${QUALITY[r.quality]?.color || '#999'};color:#000;font-size:.65rem">Q${r.quality}</span>
      </div>`;
    }).join('');
  },

  renderSpellCraftSlots() {
    const el = document.getElementById('craft-spell-slots');
    if (!el) return;
    const selected = App._spellCraftSelected || [];
    const MAX = 3;
    let html = selected.map((id, i) => {
      const comp = SPELL_COMPONENTS.find(x => x.id === id);
      return `<div class="craft-slot filled" data-spell-slot-index="${i}" title="Clicca per rimuovere">
        ${comp ? comp.icon : '?'} <span class="small">${comp ? comp.name : '?'}</span>
        <span class="craft-slot-remove">×</span>
      </div>`;
    }).join('');
    for (let i = selected.length; i < MAX; i++) {
      html += `<div class="craft-slot empty"><span class="text-muted small">Slot ${i+1}</span></div>`;
    }
    el.innerHTML = html;
    const btn = document.getElementById('btn-craft-spell');
    if (btn) btn.disabled = selected.length < 2 || selected.length > MAX;
  },

  openRecipeModal(recipeId, type) {
    const r = type === 'spell'
      ? SPELL_RECIPES.find(x => x.id === recipeId)
      : POTION_RECIPES.find(x => x.id === recipeId);
    if (!r) return;
    const isSpell = type === 'spell';
    document.getElementById('modal-recipe-title').textContent = r.name;
    document.getElementById('modal-recipe-icon').textContent  = r.icon;
    document.getElementById('modal-recipe-desc').textContent  = r.desc;
    const qData = QUALITY[r.quality];
    const qBadge = document.getElementById('modal-recipe-quality');
    qBadge.textContent = qData?.name || '';
    qBadge.style.background = qData?.color || '#999';
    qBadge.style.color = '#000';
    const items = isSpell ? r.components : r.ingredients;
    const itemData = isSpell ? SPELL_COMPONENTS : INGREDIENTS;
    const inv = isSpell ? (Game.state.componentInventory || []) : (Game.state.ingredientInventory || []);
    document.getElementById('modal-recipe-ingredients').innerHTML = items.map(id => {
      const item = itemData.find(x => x.id === id);
      if (!item) return '';
      const has = inv.filter(x => x === id).length;
      const qCls = QUALITY[item.quality]?.cls || '';
      return `<div class="d-flex align-items-center gap-2 mb-1">
        <span>${item.icon}</span>
        <span class="${qCls}" style="flex:1">${item.name}</span>
        <span class="small ${has > 0 ? 'text-success' : 'text-danger'}">${has > 0 ? '✓ disponibile' : '✗ manca'}</span>
      </div>`;
    }).join('');
    document.getElementById('modal-recipe-reward').textContent = `Ricompensa: +${r.reward.xp} PE, +${r.reward.gold} mo`;
    // Salva tipo sul bottone Prepara
    const prepBtn = document.getElementById('btn-recipe-prepare');
    prepBtn.dataset.recipeId   = recipeId;
    prepBtn.dataset.recipeType = type;
    const modal = new bootstrap.Modal(document.getElementById('modal-recipe'));
    modal.show();
  },

  /* ─── Guild tax info ────────────────────────────────────── */
  renderGuildTaxInfo() {
    const tax    = Game.guildTax();
    const canPay = Game.canAffordTax();
    document.getElementById('tax-amount').textContent = `${tax} mo`;
    const label = document.getElementById('tax-canpay-label');
    if (canPay) {
      label.innerHTML = `<span class="tax-can-pay"><i class="bi bi-check-circle"></i> Puoi pagare</span>`;
    } else {
      label.innerHTML = `<span class="tax-cannot-pay"><i class="bi bi-x-circle"></i> Oro insufficiente!</span>`;
    }
    document.getElementById('day-tax-info').textContent = `Tassa: ${tax} mo`;
  },

  /* ─── Missioni giornaliere ─────────────────────────────── */
  renderMissions() {
    const container = document.getElementById('missions-container');
    const ids       = [...Game.state.dailyMissions].sort((a, b) => {
      const ma = DB.missions.find(m => m.id === a);
      const mb = DB.missions.find(m => m.id === b);
      return (ma?.tier ?? 0) - (mb?.tier ?? 0);
    });
    const completed = Game.state.completedToday.length;
    const limit     = Game.missionsCompletableToday();
    const atLimit   = completed >= limit;

    // Aggiorna il counter
    const counter = document.getElementById('missions-completed-counter');
    if (counter) {
      counter.textContent = `Completate: ${completed} / ${limit}`;
      counter.className   = atLimit
        ? 'badge bg-warning text-dark small'
        : 'badge bg-dark border border-secondary text-light small';
    }

    if (!ids || ids.length === 0) {
      container.innerHTML = '<div class="col-12 text-center text-muted py-4"><i class="bi bi-hourglass-split fs-3"></i><p class="mt-2">Nessuna missione disponibile.</p></div>';
      return;
    }

    container.innerHTML = ids.map(id => {
      const m    = DB.missions.find(mis => mis.id === id);
      const done = Game.isMissionCompleted(id);
      const blocked = !done && atLimit;
      return `<div class="col-md-6">
        <div class="mission-card ${done ? 'completed' : ''}">
          <div class="d-flex justify-content-between align-items-start mb-1">
            <div class="mission-title">${this._typeIcon(m.type)} ${m.name}</div>
            <div class="star-row">${this._stars(m.tier)}</div>
          </div>
          <div class="mission-desc">${m.desc}</div>
          <div class="mission-tags">
            <span class="mission-tag tag-xp"><i class="bi bi-star-fill"></i> ${m.rewards.xp} PE</span>
            <span class="mission-tag tag-gold"><i class="bi bi-coin"></i> ${m.rewards.goldMin}-${m.rewards.goldMax} mo</span>
            <span class="mission-tag tag-fame"><i class="bi bi-eye"></i> +${m.rewards.fameXp} fama</span>
            ${m.rewards.itemChance > 0 ? `<span class="mission-tag tag-item"><i class="bi bi-gem"></i> oggetto possibile</span>` : ''}
            <span class="mission-tag tag-dc">CD ${m.approaches.map(a => a.dc).join('/')}</span>
          </div>
          ${done
            ? '<div class="text-muted small text-center">Completata</div>'
            : blocked
              ? '<div class="text-warning small text-center py-1"><i class="bi bi-lock-fill"></i> Limite giornaliero raggiunto</div>'
              : `<button class="btn btn-gold w-100 btn-sm mission-action" data-mission="${id}">
                  <i class="bi bi-dice-6"></i> Affronta la missione
                 </button>`
          }
        </div>
      </div>`;
    }).join('');

    container.querySelectorAll('.mission-action').forEach(btn => {
      btn.addEventListener('click', () => App.openMissionModal(parseInt(btn.dataset.mission)));
    });
  },

  /* ─── Mercato Nero ──────────────────────────────────────── */
  renderMarket() {
    const container  = document.getElementById('market-container');
    const marketItems = Game.state.marketItems;
    const char        = Game.state.character;

    document.getElementById('market-count').textContent =
      `${marketItems.length} oggett${marketItems.length === 1 ? 'o' : 'i'} disponibil${marketItems.length === 1 ? 'e' : 'i'}`;

    if (!marketItems.length) {
      container.innerHTML = '<div class="col-12 text-center text-muted py-4"><p>Nessun oggetto disponibile oggi.</p></div>';
      return;
    }

    container.innerHTML = marketItems.map(entry => {
      const item       = DB.items.find(i => i.id === entry.itemId);
      if (!item) return '';
      const qd         = QUALITY[item.quality];
      const slotMeta   = SLOT_META[item.slot];
      const canAfford  = char.gold >= entry.buyPrice;
      const levelOk    = char.level >= (item.reqLevel || 1);
      const statOk     = !item.reqStat || Game.effectiveStat(item.reqStat.key) >= item.reqStat.val;
      const canBuy     = canAfford && levelOk;

      const statsHtml = Object.entries(item.stats)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `<span class="item-stat-pill">+${v} ${Game.statLabel(k)}</span>`)
        .join('');

      const abilitiesHtml = this._abilitiesShort(item.abilities);

      let warningHtml = '';
      if (!levelOk) warningHtml += `<div class="small text-warning mt-1"><i class="bi bi-exclamation-triangle"></i> Richiede Lv.${item.reqLevel}</div>`;
      if (!statOk)  warningHtml += `<div class="small text-warning mt-1"><i class="bi bi-exclamation-triangle"></i> ${Game.statLabel(item.reqStat.key)} ${item.reqStat.val} richiesta</div>`;

      return `<div class="col-md-6 col-lg-4">
        <div class="item-card market-card${!levelOk || !statOk ? ' item-req-fail' : ''}">
          <div class="item-card-header" style="border-color:${qd.color}20; background:${qd.color}12;">
            <span class="item-slot-icon">${slotMeta.icon}</span>
            <span class="item-card-name" style="color:${qd.color}">${item.name}</span>
            ${this.qualityBadge(item.quality)}
          </div>
          <div class="item-card-body">
            <div class="item-slot-label text-muted small">${slotMeta.label}</div>
            <div class="item-stats-row mt-1">${statsHtml}</div>
            ${abilitiesHtml ? `<div class="item-abilities-row mt-1">${abilitiesHtml}</div>` : ''}
            ${warningHtml}
            <div class="d-flex justify-content-between align-items-center mt-2 gap-1">
              <span class="item-price"><i class="bi bi-coin"></i> ${entry.buyPrice} mo</span>
              <div class="d-flex gap-1">
                ${!item.consumable ? `<button class="btn btn-sm btn-outline-secondary btn-compare-item" data-itemid="${item.id}" title="Confronta con equipaggiamento">
                  <i class="bi bi-arrow-left-right"></i>
                </button>` : ''}
                <button class="btn btn-sm ${canBuy ? 'btn-gold' : 'btn-outline-secondary'} btn-buy-item"
                  data-itemid="${item.id}"
                  ${!canBuy ? 'disabled' : ''}>
                  ${canAfford ? (levelOk ? 'Acquista' : 'Liv. basso') : 'Oro insuff.'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    container.querySelectorAll('.btn-buy-item').forEach(btn => {
      btn.addEventListener('click', () => App.buyItem(parseInt(btn.dataset.itemid)));
    });
    container.querySelectorAll('.btn-compare-item').forEach(btn => {
      btn.addEventListener('click', () => this.showCompareModal(parseInt(btn.dataset.itemid)));
    });
  },

  /* ─── Pannello equipaggiamento ──────────────────────────── */
  renderEquipmentPanel() {
    const panel  = document.getElementById('equipment-panel');
    const equip  = Game.state.character.equipment;
    const slots  = ['head', 'torso', 'gloves', 'legs', 'boots', 'ringRight', 'ringLeft', 'weapon'];

    panel.innerHTML = slots.map(slot => {
      const itemId   = equip[slot];
      const item     = itemId ? DB.items.find(i => i.id === itemId) : null;
      const slotMeta = SLOT_META[slot];
      const qd       = item ? QUALITY[item.quality] : null;

      if (item) {
        return `<div class="equip-slot-card has-item mb-1" style="border-color:${qd.color}40;"
            data-slot="${slot}" data-itemid="${itemId}" role="button" tabindex="0">
          <div class="d-flex align-items-center gap-2">
            <span class="equip-slot-icon">${slotMeta.icon}</span>
            <div class="flex-fill">
              <div class="equip-slot-label text-muted small">${slotMeta.label}</div>
              <div class="equip-slot-name" style="color:${qd.color}">${item.name}</div>
            </div>
            ${this.qualityBadge(item.quality)}
          </div>
        </div>`;
      } else {
        return `<div class="equip-slot-card empty mb-1" data-slot="${slot}">
          <div class="d-flex align-items-center gap-2">
            <span class="equip-slot-icon text-muted">${slotMeta.icon}</span>
            <div>
              <div class="equip-slot-label text-muted small">${slotMeta.label}</div>
              <div class="equip-slot-name text-muted small fst-italic">Vuoto</div>
            </div>
          </div>
        </div>`;
      }
    }).join('');

    panel.querySelectorAll('.equip-slot-card.has-item').forEach(card => {
      card.addEventListener('click', () => {
        const itemId = parseInt(card.dataset.itemid);
        const slot   = card.dataset.slot;
        this.openItemModal(itemId, { source: 'equipment', slot, marketPrice: null });
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') card.click();
      });
    });
  },

  /* ─── Griglia inventario ────────────────────────────────── */
  renderInventoryGrid() {
    const container = document.getElementById('inventory-container');
    const inventory = Game.state.character.inventory;

    if (!inventory.length) {
      container.innerHTML = '<div class="col-12 text-muted small fst-italic py-2">Zaino vuoto</div>';
      return;
    }

    container.innerHTML = inventory.map(itemId => {
      const item = DB.items.find(i => i.id === itemId);
      if (!item) return '';
      const qd       = QUALITY[item.quality];
      const slotMeta = SLOT_META[item.slot];
      const char     = Game.state.character;
      const _levelOk = char.level >= (item.reqLevel || 1);
      const _statOk  = !item.reqStat || Game.effectiveStat(item.reqStat.key) >= item.reqStat.val;
      return `<div class="col-6 col-md-4">
        <div class="item-card inv-item-card${!_levelOk || !_statOk ? ' item-req-fail' : ''}" role="button" tabindex="0"
          data-itemid="${itemId}">
          <div class="d-flex align-items-center gap-1 mb-1">
            <span class="quality-dot" style="background:${qd.color};"></span>
            <span class="item-slot-icon small">${slotMeta.icon}</span>
          </div>
          <div class="inv-item-name" style="color:${qd.color}">${item.name}</div>
          <div class="text-muted small">${slotMeta.label}</div>
        </div>
      </div>`;
    }).join('');

    container.querySelectorAll('.inv-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const itemId = parseInt(card.dataset.itemid);
        this.openItemModal(itemId, { source: 'inventory', slot: null, marketPrice: null });
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') card.click();
      });
    });
  },

  /* ─── Log avventure ─────────────────────────────────────── */
  renderLog() {
    const log = Game.state.character.log;
    const el  = document.getElementById('adventure-log');
    if (!log.length) {
      el.innerHTML = '<p class="text-muted small fst-italic">Il tuo diario è ancora vuoto...</p>';
      return;
    }
    el.innerHTML = log.slice(0, 500).map(entry => `
      <div class="log-entry">
        <span class="log-day">Giorno ${entry.day}</span>
        <span class="log-${entry.type || 'text'}"> — ${entry.text}</span>
      </div>
    `).join('');
  },

  /* ─── Modal oggetto ─────────────────────────────────────── */
  openItemModal(itemId, context) {
    const item = DB.items.find(i => i.id === itemId);
    if (!item) return;

    const qd       = QUALITY[item.quality];
    const slotMeta = SLOT_META[item.slot];
    const char     = Game.state.character;

    document.getElementById('item-modal-title').innerHTML =
      `${item.name} ${this.qualityBadge(item.quality)}`;
    document.getElementById('item-modal-itemid').value   = itemId;
    document.getElementById('item-modal-context').value  = context.source;
    document.getElementById('item-modal-slot').value     = context.slot || '';
    document.getElementById('item-modal-marketprice').value = context.marketPrice || '';

    // Body
    const statsHtml = Object.entries(item.stats)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `<div class="d-flex justify-content-between">
        <span class="text-muted">${Game.statLabel(k)}</span>
        <span class="text-success">+${v}</span>
      </div>`)
      .join('');

    const abilitiesHtml = this._abilitiesLong(item.abilities);

    let reqHtml = '';
    if (item.reqLevel > 1) reqHtml += `<div class="d-flex justify-content-between"><span class="text-muted">Livello richiesto</span><span class="${char.level >= item.reqLevel ? 'text-success' : 'text-danger'}">${item.reqLevel}</span></div>`;
    if (item.reqStat) {
      const effVal = Game.effectiveStat(item.reqStat.key);
      reqHtml += `<div class="d-flex justify-content-between"><span class="text-muted">${Game.statLabel(item.reqStat.key)} richiesta</span><span class="${effVal >= item.reqStat.val ? 'text-success' : 'text-danger'}">${item.reqStat.val}</span></div>`;
    }

    const effectHtml = item.consumable ? `<div class="item-modal-section mb-2"><div class="text-gold small mb-1">Effetto</div>${this._consumableEffectHtml(item)}</div>` : '';

    document.getElementById('item-modal-body').innerHTML = `
      <div class="mb-2 d-flex gap-2 align-items-center">
        <span style="font-size:1.5rem">${slotMeta.icon}</span>
        <div>
          <div class="text-muted small">${slotMeta.label}</div>
          <div class="small fst-italic text-light">${item.desc}</div>
        </div>
      </div>
      ${effectHtml}
      ${statsHtml ? `<div class="item-modal-section mb-2"><div class="text-gold small mb-1">Statistiche</div>${statsHtml}</div>` : ''}
      ${abilitiesHtml ? `<div class="item-modal-section mb-2"><div class="text-gold small mb-1">Abilità speciali</div>${abilitiesHtml}</div>` : ''}
      ${reqHtml ? `<div class="item-modal-section mb-2"><div class="text-gold small mb-1">Requisiti</div>${reqHtml}</div>` : ''}
      <div class="d-flex justify-content-between mt-2">
        <span class="text-muted small">Valore vendita</span>
        <span class="text-warning small"><i class="bi bi-coin"></i> ${item.sellPrice} mo</span>
      </div>
    `;

    // Footer buttons
    const footer   = document.getElementById('item-modal-footer');
    footer.innerHTML = '';

    if (context.source === 'inventory' && item.consumable) {
      // Controlla se c'è già un boost attivo dello stesso tipo
      const boosts = Game.state.activeBoosts || [];
      const alreadyActive = item.effect?.type === 'boost' && boosts.some(b => b.itemId === item.id);

      if (alreadyActive) {
        // Mostra avviso — pulsante disabilitato
        const warn = document.createElement('span');
        warn.className = 'small text-warning fst-italic me-2';
        warn.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> Bonus già attivo';
        footer.appendChild(warn);
      }

      const useBtn = document.createElement('button');
      useBtn.className = 'btn btn-success btn-sm';
      useBtn.innerHTML = '<i class="bi bi-flask-fill"></i> Usa';
      useBtn.disabled  = alreadyActive;
      useBtn.addEventListener('click', () => App.useConsumableFromModal());
      footer.appendChild(useBtn);

    } else if (context.source === 'inventory') {
      // Equip button
      const levelOk = char.level >= (item.reqLevel || 1);
      const statOk  = !item.reqStat || Game.effectiveStat(item.reqStat.key) >= item.reqStat.val;
      const equipBtn = document.createElement('button');
      equipBtn.className = `btn btn-gold btn-sm`;
      equipBtn.innerHTML = '<i class="bi bi-shield-check"></i> Equipaggia';
      equipBtn.disabled  = !(levelOk && statOk);
      if (!levelOk) equipBtn.title = `Richiede Lv.${item.reqLevel}`;
      equipBtn.addEventListener('click', () => App.equipItemFromModal());
      footer.appendChild(equipBtn);

      // Compare button (solo se c'è qualcosa equipaggiato nello stesso slot)
      const targetSlots = item.slot === 'ring' ? ['ringRight', 'ringLeft'] : [item.slot];
      const hasEquipped = targetSlots.some(s => char.equipment[s]);
      if (hasEquipped) {
        const cmpBtn = document.createElement('button');
        cmpBtn.className = 'btn btn-outline-secondary btn-sm';
        cmpBtn.innerHTML = '<i class="bi bi-arrow-left-right"></i> Confronta';
        cmpBtn.addEventListener('click', () => {
          bootstrap.Modal.getInstance(document.getElementById('modal-item'))?.hide();
          this.showCompareModal(item.id);
        });
        footer.appendChild(cmpBtn);
      }

      // Sell button
      const sellBtn = document.createElement('button');
      sellBtn.className = 'btn btn-outline-warning btn-sm';
      sellBtn.innerHTML = `<i class="bi bi-currency-exchange"></i> Vendi (${item.sellPrice} mo)`;
      sellBtn.addEventListener('click', () => App.sellItemFromModal());
      footer.appendChild(sellBtn);

    } else if (context.source === 'equipment') {
      // Unequip button
      const unequipBtn = document.createElement('button');
      unequipBtn.className = 'btn btn-outline-secondary btn-sm';
      unequipBtn.innerHTML = '<i class="bi bi-box-arrow-up"></i> Rimuovi';
      unequipBtn.addEventListener('click', () => App.unequipItemFromModal());
      footer.appendChild(unequipBtn);

      // Sell while equipped
      const sellBtn = document.createElement('button');
      sellBtn.className = 'btn btn-outline-warning btn-sm';
      sellBtn.innerHTML = `<i class="bi bi-currency-exchange"></i> Vendi (${item.sellPrice} mo)`;
      sellBtn.addEventListener('click', () => App.sellItemFromModal());
      footer.appendChild(sellBtn);

    } else if (context.source === 'market') {
      const price    = context.marketPrice;
      const canAfford = char.gold >= price;
      const levelOk   = char.level >= (item.reqLevel || 1);
      const buyBtn    = document.createElement('button');
      buyBtn.className = `btn btn-gold btn-sm`;
      buyBtn.innerHTML = `<i class="bi bi-bag-plus"></i> Acquista (${price} mo)`;
      buyBtn.disabled  = !canAfford || !levelOk;
      if (!canAfford) buyBtn.title = 'Oro insufficiente';
      if (!levelOk)   buyBtn.title = `Richiede Lv.${item.reqLevel}`;
      buyBtn.addEventListener('click', () => App.buyItemFromModal());
      footer.appendChild(buyBtn);
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-outline-secondary btn-sm';
    closeBtn.setAttribute('data-bs-dismiss', 'modal');
    closeBtn.textContent = 'Chiudi';
    footer.appendChild(closeBtn);

    const modal = new bootstrap.Modal(document.getElementById('modal-item'));
    modal.show();
  },

  /* ─── Modal missione ───────────────────────────────────── */
  openMissionModal(mission) {
    document.getElementById('mission-modal-title').textContent = mission.name;
    document.getElementById('mission-modal-desc').textContent  = mission.desc;

    document.getElementById('mission-phase-choose').classList.remove('d-none');
    document.getElementById('mission-phase-result').classList.add('d-none');
    document.getElementById('mission-reroll-area').classList.add('d-none');

    const single = document.getElementById('mission-approach-single');
    const choice = document.getElementById('mission-approach-choice');

    if (mission.approaches.length === 1) {
      single.classList.remove('d-none');
      choice.classList.add('d-none');
      const ap = mission.approaches[0];
      document.getElementById('mission-single-stat').textContent = Game.statLabel(ap.stat);
      document.getElementById('mission-single-dc').textContent   = ap.dc;
    } else {
      single.classList.add('d-none');
      choice.classList.remove('d-none');
      mission.approaches.forEach((ap, i) => {
        document.getElementById(`approach-${i+1}-stat`).textContent  = Game.statLabel(ap.stat);
        document.getElementById(`approach-${i+1}-label`).textContent = ap.label;
        document.getElementById(`approach-${i+1}-dc`).textContent    = ap.dc;
      });
    }

    const modal = new bootstrap.Modal(document.getElementById('modal-mission'));
    modal.show();
    return modal;
  },

  showMissionResult(resolution, isReroll = false) {
    document.getElementById('mission-phase-choose').classList.add('d-none');
    document.getElementById('mission-phase-result').classList.remove('d-none');

    const { check, rewards, outcomeText } = resolution;
    const dice = document.getElementById('dice-display');

    dice.textContent = '?';
    dice.className   = 'dice-d20 rolling';
    setTimeout(() => {
      dice.textContent = check.roll;
      dice.className   = 'dice-d20';
      if (check.result === 'nat20') dice.classList.add('nat20');
      if (check.result === 'nat1')  dice.classList.add('nat1');
    }, 1200);

    const hasProficiency = Game.hasProficiency(check.statKey);
    const profBonus      = Game.state.character.proficiency;
    // statMod è già calcolato sulla stat effettiva (base + equip) — NON aggiungere equip separatamente
    const statMod        = Game.modifier(Game.effectiveStat(check.statKey));
    const eqBonus        = Game.equipBonusForStat(check.statKey);

    // Costruisce la formula step-by-step in modo leggibile
    // Nota: statMod include già il bonus equip; se presente, mostriamo la nota "(+equip)" nella label
    const statLabel = eqBonus !== 0
      ? `${Game.statLabel(check.statKey)}<span class="rb-equip-note">+eq</span>`
      : Game.statLabel(check.statKey);

    let parts = [];
    parts.push(`<span class="rb-dice">${check.roll}</span><span class="rb-label">dado</span>`);
    parts.push(`<span class="rb-plus">+</span><span class="rb-val">${statMod >= 0 ? '+'+statMod : statMod}</span><span class="rb-label">${statLabel}</span>`);
    if (hasProficiency) {
      parts.push(`<span class="rb-plus">+</span><span class="rb-val rb-prof">+${profBonus}</span><span class="rb-label">competenza</span>`);
    }
    parts.push(`<span class="rb-eq">=</span><span class="rb-total">${check.total}</span>`);
    parts.push(`<span class="roll-vs">vs</span><span class="roll-dc">CD ${check.dc}</span>`);

    document.getElementById('roll-breakdown').innerHTML = parts.join(' ');

    const outcomeEl = document.getElementById('mission-outcome');
    const classes   = { nat20: 'outcome-nat20', success: 'outcome-success', partial: 'outcome-partial', failure: 'outcome-failure', nat1: 'outcome-nat1' };
    outcomeEl.className   = `mission-outcome ${classes[check.result]}`;
    outcomeEl.textContent = outcomeText;

    const rewardsEl = document.getElementById('mission-rewards');
    const isSuccess = check.result === 'nat20' || check.result === 'success';
    const isPartial = check.result === 'partial';
    if (rewards.xp > 0 || rewards.gold > 0 || rewards.fame !== 0 || rewards.item) {
      rewardsEl.classList.remove('d-none');
      rewardsEl.innerHTML = [
        rewards.xp   > 0  ? `<div class="reward-row"><span class="reward-icon">⭐</span> +${rewards.xp} punti esperienza</div>` : '',
        rewards.gold > 0  ? `<div class="reward-row"><span class="reward-icon">💰</span> +${rewards.gold} monete d'oro</div>` : '',
        rewards.fame > 0  ? `<div class="reward-row"><span class="reward-icon">👁️</span> +${rewards.fame} punti fama</div>` : '',
        rewards.fame < 0  ? `<div class="reward-row text-danger"><span class="reward-icon">📉</span> ${rewards.fame} punti fama</div>` : '',
        rewards.item      ? `<div class="reward-row text-info"><span class="reward-icon">✨</span> Trovato: <strong>${rewards.item.name}</strong></div>` : ''
      ].join('');
    } else {
      rewardsEl.classList.add('d-none');
    }

    // Reroll button: solo dopo il dado, se result è failure/partial/nat1 e rerolls disponibili
    const rerollArea = document.getElementById('mission-reroll-area');
    const canReroll  = Game.rerollsRemaining() > 0 &&
      (check.result === 'failure' || check.result === 'partial' || check.result === 'nat1');

    if (canReroll && !isReroll) {
      rerollArea.classList.remove('d-none');
      document.getElementById('rerolls-remaining-label').textContent = Game.rerollsRemaining();
    } else {
      rerollArea.classList.add('d-none');
    }
  },

  /* ─── Modal borseggio ───────────────────────────────────── */
  openPickpocketGame() {
    document.getElementById('pp-game-phase').classList.remove('d-none');
    document.getElementById('pp-result-phase').classList.add('d-none');
    document.getElementById('btn-pickpocket-reroll').classList.add('d-none');
    document.getElementById('pickpocket-reward').classList.add('d-none');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-pickpocket')).show();
  },

  showPickpocketResult(result) {
    document.getElementById('pp-game-phase').classList.add('d-none');
    document.getElementById('pp-result-phase').classList.remove('d-none');

    const outcomeEl = document.getElementById('pickpocket-outcome');
    outcomeEl.className   = `mission-outcome ${result.success ? 'outcome-success' : 'outcome-failure'}`;
    outcomeEl.textContent = result.outcomeText;

    const rewardEl = document.getElementById('pickpocket-reward');
    if (result.reward) {
      rewardEl.classList.remove('d-none');
      let html = '';
      if (result.reward.type === 'gold') {
        html = `<div class="reward-row"><span class="reward-icon">💰</span> +${result.reward.amount} monete d'oro</div>`;
      } else if (result.reward.type === 'xp') {
        html = `<div class="reward-row"><span class="reward-icon">⭐</span> +${result.reward.amount} punti esperienza</div>`;
      } else if (result.reward.type === 'item') {
        html = `<div class="reward-row text-info"><span class="reward-icon">✨</span> Trovato: <strong>${result.reward.item.name}</strong></div>`;
      }
      rewardEl.innerHTML = html;
    } else {
      rewardEl.classList.add('d-none');
    }

    const rerollBtn = document.getElementById('btn-pickpocket-reroll');
    if (!result.success && Game.rerollsRemaining() > 0) {
      rerollBtn.classList.remove('d-none');
      document.getElementById('pp-rerolls-remaining').textContent = Game.rerollsRemaining();
    } else {
      rerollBtn.classList.add('d-none');
    }
  },

  /* ─── Modal game over ───────────────────────────────────── */
  showGameOverModal() {
    const char = Game.state.character;
    document.getElementById('gameover-stats').innerHTML = `
      <div class="gameover-stat-row"><span>Giorni sopravvissuto</span><strong>${char.day}</strong></div>
      <div class="gameover-stat-row"><span>Livello raggiunto</span><strong>Lv.${char.level}</strong></div>
      <div class="gameover-stat-row"><span>Oro rimasto</span><strong>${char.gold} mo</strong></div>
      <div class="gameover-stat-row"><span>Fama finale</span><strong>${char.fame}</strong></div>
    `;
    const modal = new bootstrap.Modal(document.getElementById('modal-gameover'), { backdrop: 'static', keyboard: false });
    modal.show();
  },

  /* ─── Modal creation ────────────────────────────────────── */
  showCreateModal() {
    const modal = new bootstrap.Modal(document.getElementById('modal-create'), { backdrop: 'static' });
    document.getElementById('create-step-0').classList.remove('d-none');
    document.getElementById('create-step-1').classList.add('d-none');
    document.getElementById('create-step-2').classList.add('d-none');
    modal.show();
    return modal;
  },

  showRollStep(rolledValues) {
    document.getElementById('create-step-0').classList.add('d-none');
    document.getElementById('create-step-1').classList.add('d-none');
    document.getElementById('create-step-2').classList.remove('d-none');

    const container = document.getElementById('rolled-values');
    container.innerHTML = rolledValues.map((v, i) =>
      `<div class="rolled-pill" data-index="${i}">${v}</div>`
    ).join('');

    const selects = document.querySelectorAll('.stat-assign');
    selects.forEach(sel => {
      sel.innerHTML = '<option value="">—</option>' +
        rolledValues.map((v, i) => `<option value="${i}">${v}</option>`).join('');
      sel.value = '';
    });

    this._bindStatAssignment(rolledValues);
    this._updateConfirmBtn();
  },

  _bindStatAssignment(rolled) {
    document.querySelectorAll('.stat-assign').forEach(sel => {
      sel.addEventListener('change', () => {
        this._updateRolledPills(rolled);
        this._updateConfirmBtn();
      });
    });
  },

  _updateRolledPills(rolled) {
    const usedIndices = new Set(
      [...document.querySelectorAll('.stat-assign')]
        .map(s => s.value)
        .filter(v => v !== '')
        .map(Number)
    );
    document.querySelectorAll('.rolled-pill').forEach((pill, i) => {
      pill.classList.toggle('used', usedIndices.has(i));
    });
  },

  _updateConfirmBtn() {
    const selects  = document.querySelectorAll('.stat-assign');
    const values   = [...selects].map(s => s.value);
    const allFilled = values.every(v => v !== '');
    const noDup    = new Set(values).size === values.length;
    document.getElementById('btn-confirm-create').disabled = !(allFilled && noDup);
  },

  getStatAssignments(rolled) {
    const result  = {};
    document.querySelectorAll('.stat-assign').forEach(sel => {
      result[sel.dataset.stat] = rolled[parseInt(sel.value)];
    });
    return result;
  },

  /* ─── Modal level up ───────────────────────────────────── */
  showLevelUpModal(newLevel, onConfirm) {
    document.getElementById('levelup-newlevel').textContent       = `Lv.${newLevel}`;
    document.getElementById('levelup-selected-count').textContent = '0';

    const btns     = document.getElementById('levelup-stat-buttons');
    const statKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    let selected   = [];

    btns.innerHTML = statKeys.map(k =>
      `<button class="btn-stat-up" data-stat="${k}">${Game.statLabel(k)}</button>`
    ).join('');

    btns.querySelectorAll('.btn-stat-up').forEach(btn => {
      btn.addEventListener('click', () => {
        const stat = btn.dataset.stat;
        if (selected.includes(stat)) {
          selected = selected.filter(s => s !== stat);
          btn.classList.remove('picked');
        } else if (selected.length < 2) {
          selected.push(stat);
          btn.classList.add('picked');
        }
        document.getElementById('levelup-selected-count').textContent = selected.length;
        document.getElementById('btn-levelup-confirm').disabled = selected.length < 2;
      });
    });

    document.getElementById('btn-levelup-confirm').disabled = true;
    document.getElementById('btn-levelup-confirm').onclick = () => {
      if (selected.length === 2) {
        onConfirm(selected);
        bootstrap.Modal.getInstance(document.getElementById('modal-levelup')).hide();
      }
    };

    const modal = new bootstrap.Modal(document.getElementById('modal-levelup'), { backdrop: 'static' });
    modal.show();
  },

  /* ─── Toast ────────────────────────────────────────────── */
  toast(msg, delay = 2800) {
    document.getElementById('toast-body').textContent = msg;
    const t = new bootstrap.Toast(document.getElementById('toast-main'), { delay });
    t.show();
  },

  /* ─── Refresh completo ─────────────────────────────────── */
  /* ─── Missione Taglia ───────────────────────────────────── */
  renderThiefAttack() {
    const section = document.getElementById('thief-attack-section');
    if (!section || !Game.state) return;
    const clsId = Game.getClasse().id;
    if (clsId === 'ladro') { section.classList.add('d-none'); return; }
    const pending   = Game.state.thiefAttackPending;
    const completed = Game.state.thiefAttackCompleted;
    section.classList.toggle('d-none', !pending || completed);
    if (pending && !completed) {
      document.getElementById('thief-narrative-text').textContent = Game.getThiefNarrative();
      // Riabilita bottoni e nasconde risultato
      document.querySelectorAll('#thief-approaches button').forEach(b => b.disabled = false);
      document.getElementById('thief-result').classList.add('d-none');
    }
  },

  renderWantedMission() {
    const section = document.getElementById('wanted-mission-section');
    const clsId = Game.getClasse().id;
    if (clsId === 'mago' || clsId === 'druido') { section.classList.add('d-none'); return; }
    if (!section || !Game.state) return;
    const pending   = Game.state.wantedMissionPending;
    const completed = Game.state.wantedMissionCompleted;
    section.classList.toggle('d-none', !pending || completed);
    if (pending && !completed) {
      document.getElementById('wanted-narrative-text').textContent = Game.getWantedNarrative();
    }
  },

  openWantedModal() {
    // Reset UI
    document.getElementById('wanted-game-phase').classList.remove('d-none');
    document.getElementById('wanted-result-phase').classList.add('d-none');
    document.getElementById('btn-wanted-close').classList.add('d-none');
    document.getElementById('wanted-instruction').textContent = 'Clicca quando 🗡️ tocca ⚔️!';
    document.getElementById('wanted-rewards').classList.add('d-none');
    // Round dots
    ['wanted-dot-1','wanted-dot-2'].forEach(id => {
      const d = document.getElementById(id);
      d.classList.remove('won','lost','active');
      d.classList.add('active');
    });
    document.getElementById('wanted-dot-1').classList.remove('active');
    document.getElementById('wanted-dot-2').classList.remove('active');
    document.getElementById('wanted-dot-1').classList.add('active');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-wanted')).show();
  },

  updateWantedRoundDot(roundIdx, won) {
    const id = `wanted-dot-${roundIdx + 1}`;
    const dot = document.getElementById(id);
    dot.classList.remove('active');
    dot.classList.add(won ? 'won' : 'lost');
    if (roundIdx === 0 && won) {
      document.getElementById('wanted-dot-2').classList.add('active');
    }
  },

  showWantedRoundFeedback(won, onContinue) {
    const instruction = document.getElementById('wanted-instruction');
    instruction.textContent = won ? '✅ Prova superata! Preparati...' : '❌ Mancato!';
    instruction.style.color = won ? '#52b788' : '#e74c3c';
    if (won) setTimeout(() => {
      instruction.textContent = 'Clicca quando 🗡️ tocca ⚔️!';
      instruction.style.color = '#aaa';
      onContinue();
    }, 1000);
  },

  showWantedResult(result, won) {
    document.getElementById('wanted-game-phase').classList.add('d-none');
    document.getElementById('wanted-result-phase').classList.remove('d-none');
    document.getElementById('btn-wanted-close').classList.remove('d-none');

    const outcomeEl = document.getElementById('wanted-outcome');
    outcomeEl.className = `mission-outcome ${won ? 'outcome-success' : 'outcome-failure'}`;
    outcomeEl.textContent = won
      ? 'Il cacciatore è a terra. La tua taglia è stata ridotta.'
      : 'Sei riuscito a fuggire, ma hai perso metà del tuo oro.';

    const rewardEl = document.getElementById('wanted-rewards');
    rewardEl.classList.remove('d-none');
    if (won) {
      rewardEl.innerHTML =
        `<div class="reward-row"><span class="reward-icon">⭐</span> +${result.xp} PE</div>` +
        `<div class="reward-row"><span class="reward-icon">👁️</span> +${result.fame} fama</div>` +
        `<div class="reward-row text-warning"><span class="reward-icon">🎯</span> Taglia: ${result.wantedAfter} pt</div>`;
    } else {
      rewardEl.innerHTML =
        `<div class="reward-row text-danger"><span class="reward-icon">💰</span> -${result.goldLost} monete d'oro</div>`;
    }
  },

  /* ─── Tab Sfide ─────────────────────────────────────────── */
  renderChallenges() {
    const container = document.getElementById('challenges-container');
    if (!container || !Game.state) return;

    const daily    = Game.state.dailyChallenges || [];
    const refreshes = Game.challengeRefreshesRemaining();

    const info = document.getElementById('challenges-refresh-info');
    if (info) info.textContent = refreshes > 0 ? `🔄 ${refreshes} refresh disponibil${refreshes === 1 ? 'e' : 'i'}` : '';

    // Badge notifica sul tab
    const badge = document.getElementById('challenges-badge');
    const completedCount = daily.filter(d => d.completed).length;
    const total = daily.length;
    if (badge) badge.classList.toggle('d-none', completedCount === total || total === 0);

    if (!daily.length) {
      container.innerHTML = '<div class="text-muted text-center py-4">Nessuna sfida disponibile.</div>';
      return;
    }

    container.innerHTML = daily.map((dc, idx) => {
      const tmpl = DB.challenges.find(c => c.id === dc.challengeId);
      if (!tmpl) return '';
      const canRefresh = !dc.completed && refreshes > 0;
      const rwdParts = [];
      if (tmpl.reward.xp)   rwdParts.push(`<span class="challenge-rwd"><i class="bi bi-star-fill text-warning"></i> +${tmpl.reward.xp} PE</span>`);
      if (tmpl.reward.gold) rwdParts.push(`<span class="challenge-rwd"><i class="bi bi-coin text-warning"></i> +${tmpl.reward.gold} mo</span>`);
      if (tmpl.reward.fame) rwdParts.push(`<span class="challenge-rwd"><i class="bi bi-eye text-info"></i> +${tmpl.reward.fame} fama</span>`);

      return `<div class="challenge-card ${dc.completed ? 'completed' : ''}">
        <div class="d-flex align-items-start gap-2">
          <span class="challenge-icon">${tmpl.icon}</span>
          <div class="flex-fill">
            <div class="challenge-desc ${dc.completed ? 'text-decoration-line-through text-muted' : ''}">${tmpl.desc}</div>
            <div class="challenge-rewards mt-1">${rwdParts.join(' ')}</div>
          </div>
          <div class="d-flex flex-column align-items-end gap-1">
            ${dc.completed
              ? '<span class="badge bg-success"><i class="bi bi-check-lg"></i> Completata</span>'
              : '<span class="badge bg-secondary">In corso</span>'}
            ${canRefresh
              ? `<button class="btn btn-outline-secondary btn-xs btn-challenge-refresh" data-idx="${idx}" title="Sostituisci con una nuova sfida"><i class="bi bi-arrow-repeat"></i></button>`
              : ''}
          </div>
        </div>
      </div>`;
    }).join('');

    container.querySelectorAll('.btn-challenge-refresh').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Game.refreshChallenge(parseInt(btn.dataset.idx));
        if (res.ok) { this.renderChallenges(); }
        else UI.toast(res.reason);
      });
    });
  },

  refresh() {
    if (!Game.state) return;
    this.updateClassConditionalUI();
    this.renderCharacter();
    this.renderPickpocketBtn();
    this.renderStudyBtn();
    this.renderPozioniTab();
    this.renderIncantesimiTab();
    this.renderCraftSlots();
    this.renderSpellCraftSlots();
    this.renderGuildTaxInfo();
    this.renderActiveBoosts();
    this.renderThiefAttack();
    this.renderWantedMission();
    this.renderMissions();
    this.renderMarket();
    this.renderEquipmentPanel();
    this.renderInventoryGrid();
    this.renderChallenges();
    this.renderLog();
  },

  /* ─── UI condizionale per classe ────────────────────────── */
  updateClassConditionalUI() {
    if (!Game.state) return;
    const cls = Game.getClasse();
    const profAbbr = { str:'FOR', dex:'DES', con:'COS', int:'INT', wis:'SAG', cha:'CAR' };

    // Pickpocket button (solo Ladro)
    document.getElementById('pickpocket-wrapper').classList.toggle('d-none', !cls.hasPickpocket);

    // Tab Dadi (Ladro e Guerriero)
    document.getElementById('tab-dice-nav').classList.toggle('d-none', !cls.hasDiceGame);

    // Studio (Mago e Druido)
    document.getElementById('study-wrapper').classList.toggle('d-none', !cls.hasStudy);

    // Tab Pozioni (solo Druido)
    document.getElementById('tab-pozioni-nav').classList.toggle('d-none', !cls.hasPotioniTab);

    // Tab Incantesimi (solo Mago)
    document.getElementById('tab-incantesimi-nav').classList.toggle('d-none', !cls.hasSpellTab);

    // Classe sotto il nome
    document.getElementById('char-class').textContent = cls.name;

    // Avatar
    const avatar = document.getElementById('char-avatar');
    avatar.src = `assets/${cls.avatar}`;
    avatar.alt = cls.name;

    // Testo proficienze
    document.getElementById('prof-stats-text').textContent =
      cls.proficiencies.map(k => profAbbr[k]).join(' · ');
  },

  /* ─── Step griglia classi (modal creazione) ─────────────── */
  showClassStep() {
    document.getElementById('create-step-0').classList.remove('d-none');
    document.getElementById('create-step-1').classList.add('d-none');
    document.getElementById('create-step-2').classList.add('d-none');

    const grid = document.getElementById('class-selection-grid');
    const profAbbr = { str:'FOR', dex:'DES', con:'COS', int:'INT', wis:'SAG', cha:'CAR' };
    grid.innerHTML = CLASSES.map(cls => `
      <div class="col-6 col-md-4">
        <div class="class-card" data-class-id="${cls.id}">
          <img src="assets/${cls.avatar}" alt="${cls.name}" />
          <div class="class-card-name">${cls.name}</div>
          <div class="class-card-desc">${cls.desc}</div>
          <div class="class-card-profs">
            <i class="bi bi-patch-check-fill text-green"></i>
            ${cls.proficiencies.map(k => profAbbr[k]).join(' · ')}
            ${cls.hasPickpocket ? '<span class="ms-1 text-warning" title="Ha il borseggio"><i class="bi bi-hand-index-thumb"></i></span>' : ''}
            ${cls.hasDiceGame   ? '<span class="ms-1 text-info"    title="Ha il gioco dei dadi"><i class="bi bi-dice-5"></i></span>' : ''}
          </div>
        </div>
      </div>`).join('');
  },

  /* ─── Step intro classe (modal creazione) ───────────────── */
  showIntroStep(cls) {
    document.getElementById('create-step-0').classList.add('d-none');
    document.getElementById('create-step-1').classList.remove('d-none');
    document.getElementById('create-step-2').classList.add('d-none');

    document.getElementById('create-class-avatar').src = `assets/${cls.avatar}`;
    document.getElementById('create-class-avatar').alt = cls.name;
    document.getElementById('create-class-name').textContent = cls.name;
    document.getElementById('create-class-desc').textContent = cls.desc;
    document.getElementById('name-error').classList.add('d-none');
    document.getElementById('char-name-input').value = '';
    document.getElementById('char-name-input').focus();
  },

  /* ─── Helpers privati ───────────────────────────────────── */
  _stars(tier) {
    const max    = 5;
    const filled = tier + 1;
    return Array.from({ length: max }, (_, i) =>
      `<span class="${i < filled ? 'filled' : ''}">★</span>`
    ).join('');
  },

  _typeIcon(type) {
    return {
      furto: '🗝️', infiltrazione: '👤', spionaggio: '🔍',
      inganno: '🃏', eliminazione: '🗡️', sabotaggio: '💣', recupero: '📦'
    }[type] || '📋';
  },

  /* ─── Modal Studio (memory game) ───────────────────────── */
  openStudyModal() {
    // Resetta HUD
    document.getElementById('memory-timer').textContent  = '90';
    document.getElementById('memory-errors').textContent = '0';
    document.getElementById('memory-pairs').textContent  = '0';
    document.getElementById('memory-grid').innerHTML     = '';
    document.getElementById('memory-result').classList.add('d-none');
    const modal = new bootstrap.Modal(document.getElementById('modal-studia'));
    modal.show();
  },

  showMemoryResult(win, timeLeft, errors, ingredients) {
    const resultEl = document.getElementById('memory-result');
    const titleEl  = document.getElementById('memory-result-title');
    const rewardEl = document.getElementById('memory-result-rewards');
    const ingEl    = document.getElementById('memory-result-ingredients');
    const isMago   = Game.getClasse().hasSpellTab;
    resultEl.classList.remove('d-none');
    if (win) {
      let tier;
      if (timeLeft > 30 && errors <= 1)       tier = '🌟 Eccellente';
      else if (timeLeft > 10 && errors <= 3)  tier = '✅ Buono';
      else                                    tier = '⚠️ Sufficiente';
      titleEl.innerHTML = `<span class="text-gold">${tier}</span>`;
      const result = Game.applyStudyReward(timeLeft, errors);
      rewardEl.textContent = `+${result.xp} PE   +${result.gold} mo`;
      let ingHtml = '';
      if (result.ingredients && result.ingredients.length > 0) {
        const label = isMago ? 'Componenti' : 'Ingredienti';
        ingHtml += label + ': ' + result.ingredients.map(i => `${i.icon} ${i.name}`).join(', ');
      }
      if (result.unlockedRecipe) {
        const label = isMago ? '📖 Incantesimo scoperto' : '📖 Ricetta scoperta';
        ingHtml += (ingHtml ? '<br>' : '') + `<span class="text-gold">${label}: ${result.unlockedRecipe.icon} ${result.unlockedRecipe.name}</span>`;
      }
      ingEl.innerHTML = ingHtml;
      this.refresh();
      if (result.levelUpResult) App._triggerLevelUp(result.levelUpResult);
    } else {
      titleEl.innerHTML = '<span class="text-danger">Fallimento!</span>';
      rewardEl.textContent = 'Nessuna ricompensa.';
      ingEl.textContent = '';
    }
  },

  /* ─── Modal confronto ───────────────────────────────────── */
  showCompareModal(marketItemId) {
    const marketItem = DB.items.find(i => i.id === marketItemId);
    if (!marketItem) return;

    const equip = Game.state.character.equipment;
    const slots = marketItem.slot === 'ring'
      ? ['ringRight', 'ringLeft']
      : [marketItem.slot];

    const equippedPanels = slots.map(slot => {
      const eqItem = equip[slot] ? DB.items.find(i => i.id === equip[slot]) : null;
      const label  = SLOT_META[slot]?.label || slot;
      return `<div class="compare-col">
        <div class="compare-col-title text-muted">${label} equipaggiato</div>
        ${eqItem ? this._renderComparePanel(eqItem) : '<div class="compare-empty"><i class="bi bi-slash-circle"></i><br>Slot vuoto</div>'}
      </div>`;
    }).join(`<div class="compare-divider text-muted"><i class="bi bi-arrow-left-right"></i></div>`);

    document.getElementById('compare-body').innerHTML = `
      <div class="compare-layout">
        <div class="compare-col">
          <div class="compare-col-title text-gold">Mercato</div>
          ${this._renderComparePanel(marketItem)}
        </div>
        <div class="compare-divider text-muted"><i class="bi bi-arrow-left-right"></i></div>
        ${equippedPanels}
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('modal-compare'));
    modal.show();

    document.getElementById('modal-compare').addEventListener('shown.bs.modal', () => {
      this._initDraggableModal('modal-compare', 'modal-compare-handle', 'modal-compare-dialog');
    }, { once: true });
  },

  _renderComparePanel(item) {
    const qd       = QUALITY[item.quality];
    const slotMeta = SLOT_META[item.slot] || SLOT_META['ringRight'];
    const allStatKeys = ['str','dex','con','int','wis','cha'];
    const activeStats = allStatKeys.filter(k => (item.stats[k] || 0) !== 0);

    const statsHtml = activeStats.length
      ? activeStats.map(k => {
          const v = item.stats[k] || 0;
          const col = v > 0 ? '#52b788' : '#e74c3c';
          return `<div class="compare-stat-row">
            <span class="text-muted small">${Game.statLabel(k)}</span>
            <span style="color:${col};font-weight:600">${v > 0 ? '+' : ''}${v}</span>
          </div>`;
        }).join('')
      : '<div class="text-muted small fst-italic">Nessun bonus stat</div>';

    const abilitiesHtml = this._abilitiesShort(item.abilities);
    const reqHtml = item.reqLevel > 1
      ? `<div class="small text-warning mt-1"><i class="bi bi-shield"></i> Lv.${item.reqLevel}+</div>` : '';

    return `<div class="compare-item-card" style="border-color:${qd.color}50;">
      <div class="d-flex align-items-center gap-2 mb-1">
        <span>${slotMeta.icon}</span>
        <span style="color:${qd.color};font-weight:600">${item.name}</span>
        ${this.qualityBadge(item.quality)}
      </div>
      <div class="small fst-italic mb-2" style="color:#888;">${item.desc}</div>
      <div class="compare-stats-block mb-1">${statsHtml}</div>
      ${abilitiesHtml ? `<div class="mt-1">${abilitiesHtml}</div>` : ''}
      ${reqHtml}
    </div>`;
  },

  _initDraggableModal(modalId, handleId, dialogId) {
    const dialog = document.getElementById(dialogId);
    const handle = document.getElementById(handleId);
    if (!dialog || !handle) return;

    // Fissa posizione attuale
    const rect = dialog.getBoundingClientRect();
    dialog.style.position = 'fixed';
    dialog.style.margin   = '0';
    dialog.style.left     = rect.left + 'px';
    dialog.style.top      = rect.top  + 'px';
    dialog.style.width    = rect.width + 'px';

    let dragging = false, ox = 0, oy = 0;

    handle.addEventListener('mousedown', e => {
      if (e.target.closest('.btn-close')) return;
      dragging = true;
      const r = dialog.getBoundingClientRect();
      ox = e.clientX - r.left;
      oy = e.clientY - r.top;
      handle.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      dialog.style.left = (e.clientX - ox) + 'px';
      dialog.style.top  = (e.clientY - oy) + 'px';
    });

    document.addEventListener('mouseup', () => {
      dragging = false;
      handle.style.cursor = 'grab';
    });

    // Reset al prossimo hide
    document.getElementById(modalId).addEventListener('hidden.bs.modal', () => {
      dialog.style.position = '';
      dialog.style.margin   = '';
      dialog.style.left     = '';
      dialog.style.top      = '';
      dialog.style.width    = '';
    }, { once: true });
  },

  _abilitiesShort(abilities) {
    if (!abilities) return '';
    const parts = [];
    if (abilities.pickpocketBonus > 0) parts.push(`<span class="item-ability-pill">+${abilities.pickpocketBonus} borseggio</span>`);
    if (abilities.rerollBonus     > 0) parts.push(`<span class="item-ability-pill">+${abilities.rerollBonus} rilancio</span>`);
    if (abilities.taxDiscount     > 0) parts.push(`<span class="item-ability-pill">-${Math.round(abilities.taxDiscount*100)}% tassa</span>`);
    if (abilities.goldBonus       > 0) parts.push(`<span class="item-ability-pill">+${Math.round(abilities.goldBonus*100)}% oro</span>`);
    if (abilities.xpBonus         > 0) parts.push(`<span class="item-ability-pill">+${Math.round(abilities.xpBonus*100)}% PE</span>`);
    if (abilities.missionBonus    > 0) parts.push(`<span class="item-ability-pill">+${abilities.missionBonus} missione/giorno</span>`);
    if (abilities.challengeBonus  > 0) parts.push(`<span class="item-ability-pill">+${abilities.challengeBonus} sfida/giorno</span>`);
    if (abilities.challengeRefresh> 0) parts.push(`<span class="item-ability-pill">🔄 ${abilities.challengeRefresh} refresh sfida</span>`);
    return parts.join(' ');
  },

  /* ─── Tab Gioca a Dadi ───────────────────────────────────── */
  renderDiceBetPhase() {
    const opts  = Game.getDiceBetOptions();
    const gold  = Game.state.character.gold;
    const max   = Game.maxDiceBet();
    const labels = ['Alta', 'Media', 'Bassa'];
    const styles = ['btn-gold', 'btn-outline-warning', 'btn-outline-secondary'];

    document.getElementById('dice-max-info').textContent =
      `Posta massima: ${max} mo  ·  Oro disponibile: ${gold} mo`;

    const warn = document.getElementById('dice-gold-warn');
    if (gold < 1) { warn.style.display = 'block'; }
    else          { warn.style.display = 'none';  }

    document.getElementById('dice-bet-options').innerHTML = opts.map((v, i) => `
      <div class="col-4">
        <button class="btn ${styles[i]} w-100 dice-bet-btn ${gold < v ? 'disabled' : ''}"
          data-bet="${v}">
          <div class="small text-muted">${labels[i]}</div>
          <div style="font-size:1.1rem;font-weight:700;">${v} mo</div>
        </button>
      </div>`).join('');
  },

  renderDiceRollingPhase(bet, players) {
    document.getElementById('dice-bet-display').textContent = `${bet} mo`;
    document.getElementById('dice-players-container').innerHTML = players.map(p => `
      <div class="dice-player-row ${p.isPlayer ? 'dice-player-hero' : ''}" id="dice-row-${p.name.replace(/\s/g,'_')}">
        <div class="dice-player-name">${p.isPlayer ? '⚔️ ' : ''}${p.name}</div>
        <div class="dice-faces">
          <div class="dice-face" id="dface-${p.name.replace(/\s/g,'_')}-1">?</div>
          <div class="dice-face" id="dface-${p.name.replace(/\s/g,'_')}-2">?</div>
        </div>
        <div class="dice-total" id="dtotal-${p.name.replace(/\s/g,'_')}">?</div>
      </div>`).join('');
  },

  renderDiceResultPhase(result) {
    const rankIcons = ['🏆', '🥈', '🥉', '💀'];
    const titles    = ['VITTORIA!', '2° POSTO', '3° POSTO', 'ULTIMO'];
    const titleColors = ['#f1c40f', '#bdc3c7', '#cd7f32', '#e74c3c'];
    const descs = [
      'Hai rastrellato il piatto!',
      'Premio di consolazione.',
      'Consolazione minima.',
      'Hai perso tutto e la tua reputazione ne risente.',
    ];

    const gi = result.playerRank - 1;
    const titleEl = document.getElementById('dice-result-title');
    titleEl.textContent = `${rankIcons[gi]} ${titles[gi]}`;
    titleEl.style.color = titleColors[gi];
    document.getElementById('dice-result-desc').textContent = descs[gi];

    document.getElementById('dice-ranking-container').innerHTML =
      result.ranked.map((p, i) => `
        <div class="dice-result-row ${p.isPlayer ? 'dice-result-player' : ''}">
          <span class="dice-rank-icon">${rankIcons[i]}</span>
          <span class="dice-result-name">${p.name}</span>
          <div class="dice-faces small">
            <div class="dice-face dice-face-sm">${p.d1}</div>
            <div class="dice-face dice-face-sm">${p.d2}</div>
          </div>
          <span class="dice-result-total">= ${p.total}</span>
        </div>`).join('');

    const rewards = [];
    if (result.goldDelta > 0)  rewards.push(`<div class="reward-row"><span class="reward-icon">💰</span> +${result.goldDelta} mo</div>`);
    if (result.goldDelta < 0)  rewards.push(`<div class="reward-row text-danger"><span class="reward-icon">💰</span> ${result.goldDelta} mo</div>`);
    if (result.xp > 0)         rewards.push(`<div class="reward-row"><span class="reward-icon">⭐</span> +${result.xp} PE</div>`);
    if (result.fameDelta < 0)  rewards.push(`<div class="reward-row text-danger"><span class="reward-icon">👁️</span> ${result.fameDelta} fama</div>`);
    document.getElementById('dice-result-rewards').innerHTML = rewards.join('');
  },

  _abilitiesLong(abilities) {
    if (!abilities) return '';
    const parts = [];
    if (abilities.pickpocketBonus > 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">Borseggi extra/giorno</span><span class="text-info">+${abilities.pickpocketBonus}</span></div>`);
    if (abilities.rerollBonus     > 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">Rilanci prova</span><span class="text-info">+${abilities.rerollBonus}</span></div>`);
    if (abilities.taxDiscount     > 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">Sconto tassa Gilda</span><span class="text-info">-${Math.round(abilities.taxDiscount*100)}%</span></div>`);
    if (abilities.goldBonus       > 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">Bonus oro guadagnato</span><span class="text-info">+${Math.round(abilities.goldBonus*100)}%</span></div>`);
    if (abilities.xpBonus         > 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">Bonus PE guadagnati</span><span class="text-info">+${Math.round(abilities.xpBonus*100)}%</span></div>`);
    if (abilities.missionBonus    > 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">Missioni extra/giorno</span><span class="text-info">+${abilities.missionBonus}</span></div>`);
    if (abilities.challengeBonus  > 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">Sfide extra/giorno</span><span class="text-info">+${abilities.challengeBonus}</span></div>`);
    if (abilities.challengeRefresh> 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">Refresh sfide/giorno</span><span class="text-info">${abilities.challengeRefresh}</span></div>`);
    if (abilities.diceRerollBonus > 0) parts.push(`<div class="d-flex justify-content-between"><span class="text-muted">🃏 Rapidità di Mano extra</span><span class="text-info">+${abilities.diceRerollBonus}</span></div>`);
    return parts.join('');
  }
};
