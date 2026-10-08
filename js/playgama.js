/* ============================================================
   playgama.js — Playgama Bridge SDK integration
   Required steps per Playgama submission requirements:
   1. Initialize bridge before any API use
   2. Read platform.language for localization
   3. Save/load through bridge.storage (cloud saves)
   4. Pause/audio state events
   5. game_ready message on first playable frame
   6. Interstitial ads at natural pauses
   ============================================================ */

const Playgama = {
  _ready:  false,
  _muted:  false,
  _paused: false,

  /* ── Initialize bridge ────────────────────────────────── */
  async init() {
    // If bridge SDK is not loaded (local dev without CDN), skip gracefully
    if (typeof bridge === 'undefined') {
      console.info('[Playgama] Bridge SDK not loaded — running in local mode.');
      return;
    }

    try {
      await bridge.initialize();
      this._ready = true;

      /* 1 — Language: read once, apply to I18n (only if no manual pref) */
      const platformLang = bridge.platform.language;
      if (platformLang && !localStorage.getItem('bhs_lang')) {
        const mapped = platformLang.startsWith('it') ? 'it' : 'en';
        I18n.lang = mapped;
      }

      /* 2 — Audio: check initial state, mute if disabled */
      if (!bridge.platform.isAudioEnabled) {
        this._muted = true;
      }

      /* 3 — Pause/audio change events */
      bridge.platform.on(bridge.EVENT_NAME.PAUSE_STATE_CHANGED, (isPaused) => {
        this._paused = isPaused;
        if (typeof App !== 'undefined') App._onPlatformPause(isPaused);
      });

      bridge.platform.on(bridge.EVENT_NAME.AUDIO_STATE_CHANGED, (isEnabled) => {
        this._muted = !isEnabled;
        // BadHeroSimulator has no continuous audio — nothing extra needed
      });

      /* 4 — Try to restore cloud save into localStorage before game loads */
      await this._syncCloudToLocal();

    } catch (e) {
      console.warn('[Playgama] Init error, using local fallback.', e);
    }
  },

  /* ── Sync cloud → localStorage before game init ────────── */
  async _syncCloudToLocal() {
    if (!this._ready) return;
    try {
      const [cloudSave] = await bridge.storage.get(['badhero_save_v2']);
      if (cloudSave) {
        // Cloud save wins — push it into localStorage so Game.init() picks it up
        localStorage.setItem('badhero_save_v2', cloudSave);
      }
    } catch (e) {
      // Fall through; localStorage save will be used as-is
    }
  },

  /* ── Sync localStorage → cloud on every Game.save() ────── */
  cloudSave(key, value) {
    if (!this._ready) return;
    bridge.storage.set([key], [value]).catch(() => {});
  },

  /* ── Delete save from cloud ─────────────────────────────── */
  cloudDelete(key) {
    if (!this._ready) return;
    bridge.storage.delete([key]).catch(() => {});
  },

  /* ── game_ready — call once the first UI frame is visible ── */
  gameReady() {
    if (!this._ready) return;
    try { bridge.platform.sendMessage('game_ready'); } catch (e) {}
  },

  /* ── Lifecycle messages ──────────────────────────────────── */
  sendMessage(msg, params) {
    if (!this._ready) return;
    try { bridge.platform.sendMessage(msg, params); } catch (e) {}
  },

  /* ── Interstitial ad at natural pause (game over, new day) ── */
  showInterstitial(placement = 'game_over') {
    if (!this._ready) return;
    try { bridge.advertisement.showInterstitial(placement); } catch (e) {}
  },
};

window.Playgama = Playgama;
