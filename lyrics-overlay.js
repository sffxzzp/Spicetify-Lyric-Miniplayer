// Lyric Miniplayer - Spicetify Extension
// Creates a floating Picture-in-Picture lyrics window that stays on top of all apps

(async function LyricsOverlay() {
    // Wait for Spicetify to be fully loaded
    while (!Spicetify?.Player?.data || !Spicetify?.Platform || !Spicetify?.CosmosAsync) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // ==================== CONFIG ====================
    const CONFIG = {
        pipWidth: 280,
        pipHeight: 360,
        updateInterval: 100,
        defaultFontSize: 14,
        maxFontSize: 28,
        minFontSize: 10,
    };

    // ==================== THEMES ====================
    const THEMES = {
        spotify: {
            name: 'Spotify',
            emoji: 'SP',
            bg: 'linear-gradient(160deg, #0a0a0a 0%, #1a1a2e 40%, #0f0f23 100%)',
            accent: '#1ed760',
            accentHover: '#1fdf64',
            headerBg: 'rgba(0, 0, 0, 0.5)',
            controlsBg: 'rgba(0, 0, 0, 0.35)',
            footerBg: 'rgba(0, 0, 0, 0.45)',
            textGlow: 'rgba(30, 215, 96, 0.3)',
        },
        pink: {
            name: 'Pink Pop',
            emoji: 'PK',
            bg: 'linear-gradient(160deg, #1a0a14 0%, #2d1f2b 40%, #1f0f1a 100%)',
            accent: '#ff69b4',
            accentHover: '#ff85c2',
            headerBg: 'rgba(40, 10, 30, 0.6)',
            controlsBg: 'rgba(40, 10, 30, 0.4)',
            footerBg: 'rgba(40, 10, 30, 0.5)',
            textGlow: 'rgba(255, 105, 180, 0.4)',
        },
        kawaii: {
            name: 'Kawaii',
            emoji: 'KW',
            bg: 'linear-gradient(160deg, #2d1f2f 0%, #1f1a2e 40%, #2a1f35 100%)',
            accent: '#ffb7dd',
            accentHover: '#ffc9e5',
            headerBg: 'rgba(50, 30, 50, 0.6)',
            controlsBg: 'rgba(50, 30, 50, 0.4)',
            footerBg: 'rgba(50, 30, 50, 0.5)',
            textGlow: 'rgba(255, 183, 221, 0.4)',
        },
        ocean: {
            name: 'Ocean Blue',
            emoji: 'OC',
            bg: 'linear-gradient(160deg, #0a1628 0%, #0d253f 40%, #0a1a30 100%)',
            accent: '#00bfff',
            accentHover: '#33ccff',
            headerBg: 'rgba(10, 30, 50, 0.6)',
            controlsBg: 'rgba(10, 30, 50, 0.4)',
            footerBg: 'rgba(10, 30, 50, 0.5)',
            textGlow: 'rgba(0, 191, 255, 0.4)',
        },
        racing: {
            name: 'Racing Red',
            emoji: 'RC',
            bg: 'linear-gradient(160deg, #0a0a0a 0%, #1a0a0a 40%, #150505 100%)',
            accent: '#ff3333',
            accentHover: '#ff5555',
            headerBg: 'rgba(30, 5, 5, 0.7)',
            controlsBg: 'rgba(30, 5, 5, 0.5)',
            footerBg: 'rgba(30, 5, 5, 0.6)',
            textGlow: 'rgba(255, 51, 51, 0.4)',
        },
        sunset: {
            name: 'Sunset',
            emoji: 'SS',
            bg: 'linear-gradient(160deg, #1a0f0a 0%, #2d1a0f 40%, #1f1408 100%)',
            accent: '#ff6b35',
            accentHover: '#ff8555',
            headerBg: 'rgba(40, 20, 10, 0.6)',
            controlsBg: 'rgba(40, 20, 10, 0.4)',
            footerBg: 'rgba(40, 20, 10, 0.5)',
            textGlow: 'rgba(255, 107, 53, 0.4)',
        },
        purple: {
            name: 'Galaxy',
            emoji: 'GX',
            bg: 'linear-gradient(160deg, #0f0a1a 0%, #1a1030 40%, #150d25 100%)',
            accent: '#a855f7',
            accentHover: '#b975f9',
            headerBg: 'rgba(25, 15, 40, 0.6)',
            controlsBg: 'rgba(25, 15, 40, 0.4)',
            footerBg: 'rgba(25, 15, 40, 0.5)',
            textGlow: 'rgba(168, 85, 247, 0.4)',
        },
        mint: {
            name: 'Mint Fresh',
            emoji: 'MN',
            bg: 'linear-gradient(160deg, #0a1a14 0%, #0f2a20 40%, #081810 100%)',
            accent: '#2dd4bf',
            accentHover: '#4ee0cd',
            headerBg: 'rgba(10, 35, 28, 0.6)',
            controlsBg: 'rgba(10, 35, 28, 0.4)',
            footerBg: 'rgba(10, 35, 28, 0.5)',
            textGlow: 'rgba(45, 212, 191, 0.4)',
        },
        gold: {
            name: 'Luxury Gold',
            emoji: 'GD',
            bg: 'linear-gradient(160deg, #0f0d08 0%, #1a1508 40%, #12100a 100%)',
            accent: '#fbbf24',
            accentHover: '#fcd34d',
            headerBg: 'rgba(30, 25, 15, 0.6)',
            controlsBg: 'rgba(30, 25, 15, 0.4)',
            footerBg: 'rgba(30, 25, 15, 0.5)',
            textGlow: 'rgba(251, 191, 36, 0.4)',
        },
        cyberpunk: {
            name: 'Cyberpunk',
            emoji: 'CP',
            bg: 'linear-gradient(160deg, #0a0a12 0%, #12081f 40%, #0f0a18 100%)',
            accent: '#f0f',
            accentHover: '#ff44ff',
            headerBg: 'rgba(20, 10, 35, 0.7)',
            controlsBg: 'rgba(20, 10, 35, 0.5)',
            footerBg: 'rgba(20, 10, 35, 0.6)',
            textGlow: 'rgba(255, 0, 255, 0.5)',
        },
        snow: {
            name: 'Frost',
            emoji: 'FR',
            bg: 'linear-gradient(160deg, #0d1520 0%, #1a2535 40%, #0f1825 100%)',
            accent: '#7dd3fc',
            accentHover: '#a5e1fd',
            headerBg: 'rgba(15, 25, 40, 0.6)',
            controlsBg: 'rgba(15, 25, 40, 0.4)',
            footerBg: 'rgba(15, 25, 40, 0.5)',
            textGlow: 'rgba(125, 211, 252, 0.4)',
        },
        rose: {
            name: 'Rose Gold',
            emoji: 'RG',
            bg: 'linear-gradient(160deg, #1a1015 0%, #251820 40%, #1d1318 100%)',
            accent: '#f43f5e',
            accentHover: '#fb7185',
            headerBg: 'rgba(35, 20, 25, 0.6)',
            controlsBg: 'rgba(35, 20, 25, 0.4)',
            footerBg: 'rgba(35, 20, 25, 0.5)',
            textGlow: 'rgba(244, 63, 94, 0.4)',
        },
    };

    // ==================== STATE ====================
    let pipWindow = null;
    let currentLyrics = null;
    let currentTrackUri = null;
    let updateIntervalId = null;
    let fontSize = CONFIG.defaultFontSize;
    let showFontSlider = false;
    let showVolumeSlider = true;
    let showLyrics = true;
    let showShuffleBtn = true;
    let showRepeatBtn = true;
    let showLikeBtn = true;
    let showCloseBtn = true;
    let centerLyrics = true;
    let currentTheme = 'spotify';
    let colorMode = 'dark';
    let idleDelayMs = 2000;
    let pendingRepeatMode = null;
    let pendingRepeatAt = 0;
    const REPEAT_PENDING_MS = 1000;

    // Load saved settings
    try {
        const savedSize = localStorage.getItem('lyrics-overlay-fontsize');
        if (savedSize) fontSize = parseInt(savedSize);
        const savedShowFont = localStorage.getItem('lyrics-overlay-showfont');
        if (savedShowFont !== null) showFontSlider = savedShowFont === 'true';
        const savedShowVol = localStorage.getItem('lyrics-overlay-showvol');
        if (savedShowVol !== null) showVolumeSlider = savedShowVol === 'true';
        const savedShowLyrics = localStorage.getItem('lyrics-overlay-showlyrics');
        if (savedShowLyrics !== null) showLyrics = savedShowLyrics === 'true';
        const savedShowShuffle = localStorage.getItem('lyrics-overlay-showshuffle');
        if (savedShowShuffle !== null) showShuffleBtn = savedShowShuffle === 'true';
        const savedShowRepeat = localStorage.getItem('lyrics-overlay-showrepeat');
        if (savedShowRepeat !== null) showRepeatBtn = savedShowRepeat === 'true';
        const savedShowLike = localStorage.getItem('lyrics-overlay-showlike');
        if (savedShowLike !== null) showLikeBtn = savedShowLike === 'true';
        const savedShowClose = localStorage.getItem('lyrics-overlay-showclose');
        if (savedShowClose !== null) showCloseBtn = savedShowClose === 'true';
        const savedCenterLyrics = localStorage.getItem('lyrics-overlay-centerlyrics');
        if (savedCenterLyrics !== null) centerLyrics = savedCenterLyrics === 'true';
        const savedIdleDelay = localStorage.getItem('lyrics-overlay-idledelay');
        if (savedIdleDelay) {
            const parsedIdle = parseInt(savedIdleDelay, 10);
            if (!Number.isNaN(parsedIdle)) idleDelayMs = Math.min(30000, Math.max(500, parsedIdle));
        }
        const savedColorMode = localStorage.getItem('lyrics-overlay-colormode');
        if (savedColorMode === 'light' || savedColorMode === 'dark') colorMode = savedColorMode;
        const savedTheme = localStorage.getItem('lyrics-overlay-theme');
        if (savedTheme && THEMES[savedTheme]) currentTheme = savedTheme;
    } catch (e) {}

    // ==================== GENERATE CSS WITH THEME ====================
    function resolveTheme(theme, mode) {
        const base = THEMES[theme] || THEMES.spotify;
        if (mode !== 'light') return base;

        return {
            ...base,
            bg: base.lightBg || 'linear-gradient(160deg, #f7f7fb 0%, #f3f6fb 40%, #eef1f7 100%)',
            headerBg: base.lightHeaderBg || 'rgba(255, 255, 255, 0.85)',
            controlsBg: base.lightControlsBg || 'rgba(255, 255, 255, 0.78)',
            footerBg: base.lightFooterBg || 'rgba(255, 255, 255, 0.85)',
            textGlow: base.lightTextGlow || base.textGlow,
            text: base.lightText || '#1a1a1a',
            textMuted: base.lightTextMuted || 'rgba(0, 0, 0, 0.55)',
            textDim: base.lightTextDim || 'rgba(0, 0, 0, 0.4)',
            textFaint: base.lightTextFaint || 'rgba(0, 0, 0, 0.3)',
            iconMuted: base.lightIconMuted || 'rgba(0, 0, 0, 0.5)',
            border: base.lightBorder || 'rgba(0, 0, 0, 0.08)',
            borderStrong: base.lightBorderStrong || 'rgba(0, 0, 0, 0.12)',
            surface1: base.lightSurface1 || 'rgba(0, 0, 0, 0.06)',
            surface2: base.lightSurface2 || 'rgba(0, 0, 0, 0.12)',
            surface3: base.lightSurface3 || 'rgba(0, 0, 0, 0.04)',
            surface4: base.lightSurface4 || 'rgba(0, 0, 0, 0.08)',
            surface5: base.lightSurface5 || 'rgba(0, 0, 0, 0.15)',
            settingsBg: base.lightSettingsBg || 'rgba(248, 248, 251, 0.98)',
            themePickerBg: base.lightThemePickerBg || 'rgba(248, 248, 251, 0.98)',
            toggleKnob: base.lightToggleKnob || '#ffffff',
            menuBtnOpacity: base.lightMenuBtnOpacity || 0.6,
            menuBtnHoverOpacity: base.lightMenuBtnHoverOpacity || 0.9,
            lyricBaseOpacity: base.lightLyricBaseOpacity || 0.85,
            lyricHoverOpacity: base.lightLyricHoverOpacity || 0.95,
            lyricPastOpacity: base.lightLyricPastOpacity || 0.7,
            statusOpacity: base.lightStatusOpacity || 0.85,
            subtextOpacity: base.lightSubtextOpacity || 0.8,
        };
    }

    function generateStyles(theme, mode) {
        const t = resolveTheme(theme, mode);
        return `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        
        :root {
            --accent: ${t.accent};
            --accent-hover: ${t.accentHover};
            --text-glow: ${t.textGlow};
            --text: ${t.text || '#ffffff'};
            --text-muted: ${t.textMuted || 'rgba(255, 255, 255, 0.55)'};
            --text-dim: ${t.textDim || 'rgba(255, 255, 255, 0.4)'};
            --text-faint: ${t.textFaint || 'rgba(255, 255, 255, 0.3)'};
            --icon-muted: ${t.iconMuted || 'rgba(255, 255, 255, 0.5)'};
            --border: ${t.border || 'rgba(255, 255, 255, 0.06)'};
            --border-strong: ${t.borderStrong || 'rgba(255, 255, 255, 0.08)'};
            --surface-1: ${t.surface1 || 'rgba(255, 255, 255, 0.08)'};
            --surface-2: ${t.surface2 || 'rgba(255, 255, 255, 0.15)'};
            --surface-3: ${t.surface3 || 'rgba(255, 255, 255, 0.03)'};
            --surface-4: ${t.surface4 || 'rgba(255, 255, 255, 0.1)'};
            --surface-5: ${t.surface5 || 'rgba(255, 255, 255, 0.2)'};
            --settings-bg: ${t.settingsBg || 'rgba(10, 10, 15, 0.98)'};
            --theme-picker-bg: ${t.themePickerBg || 'rgba(8, 8, 12, 0.98)'};
            --toggle-knob: ${t.toggleKnob || '#ffffff'};
            --menu-btn-opacity: ${t.menuBtnOpacity ?? 0.4};
            --menu-btn-hover-opacity: ${t.menuBtnHoverOpacity ?? 0.8};
            --lyric-base-opacity: ${t.lyricBaseOpacity ?? 0.3};
            --lyric-hover-opacity: ${t.lyricHoverOpacity ?? 0.5};
            --lyric-past-opacity: ${t.lyricPastOpacity ?? 0.4};
            --status-opacity: ${t.statusOpacity ?? 0.6};
            --subtext-opacity: ${t.subtextOpacity ?? 0.6};
        }
        
        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
            overflow: hidden;
        }

        body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: ${t.bg};
            color: var(--text);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        /* Overlay chrome */
        .overlay {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            z-index: 2;
            pointer-events: none;
            opacity: 1;
            will-change: opacity;
            transition: opacity 0.5s ease;
        }

        .overlay > * {
            pointer-events: auto;
        }

        .overlay-spacer {
            flex: 1 1 auto;
            pointer-events: none;
        }

        .overlay.idle-hidden {
            pointer-events: none;
        }

        /* Resize Handle at Top - Subtle */
        .resize-handle {
            height: 4px;
            cursor: ns-resize;
            flex-shrink: 0;
        }

        .resize-handle:hover {
            background: var(--surface-3);
        }

        /* Header - Draggable */
        .header {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 2px 6px;
            min-height: 24px;
            background: ${t.headerBg};
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
            flex-shrink: 0;
            cursor: grab;
            user-select: none;
            -webkit-app-region: drag;
            app-region: drag;
        }

        .header:active {
            cursor: grabbing;
        }

        .track-info {
            flex: 1;
            min-width: 0;
        }

        .track-line {
            font-size: 10.5px;
            font-weight: 600;
            color: var(--text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.1;
        }

        /* Header Buttons */
        .header-btns {
            display: flex;
            align-items: center;
            gap: 0;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        .menu-btn {
            display: flex;
            flex-direction: column;
            gap: 1px;
            padding: 3px 3px;
            cursor: pointer;
            opacity: var(--menu-btn-opacity);
            transition: opacity 0.15s;
            background: none;
            border: none;
        }

        .menu-btn:hover {
            opacity: var(--menu-btn-hover-opacity);
        }

        .menu-row {
            display: flex;
            gap: 1px;
        }

        .menu-dot {
            width: 2px;
            height: 2px;
            background: var(--text);
            border-radius: 50%;
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--text-dim);
            font-size: 14px;
            cursor: pointer;
            padding: 2px 4px;
            transition: all 0.15s;
            line-height: 1;
        }

        .close-btn:hover {
            color: #ff5f5f;
        }

        .close-btn.hidden {
            display: none;
        }

        /* Settings Panel - Full Overlay */
        .settings-panel {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--settings-bg);
            z-index: 1000;
            display: none;
            flex-direction: column;
            -webkit-app-region: no-drag;
            app-region: no-drag;
            overflow-y: auto;
        }

        .settings-panel.open {
            display: flex;
            animation: panelSlide 0.2s ease;
        }

        @keyframes panelSlide {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .settings-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid var(--border-strong);
            flex-shrink: 0;
        }

        .settings-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text);
        }

        .settings-close {
            background: var(--surface-4);
            border: none;
            color: var(--text);
            width: 32px;
            height: 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
        }

        .settings-close:hover {
            background: var(--surface-5);
        }

        .settings-content {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
        }

        .menu-section-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            margin-top: 8px;
        }

        .menu-section-title:first-child {
            margin-top: 0;
        }

        .menu-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            cursor: pointer;
            transition: background 0.1s;
            background: var(--surface-3);
            border-radius: 10px;
            margin-bottom: 8px;
        }

        .menu-item:hover {
            background: var(--surface-2);
        }

        .menu-item-label {
            font-size: 14px;
            color: var(--text);
        }

        .menu-toggle {
            width: 44px;
            height: 24px;
            background: var(--surface-2);
            border-radius: 12px;
            position: relative;
            transition: background 0.2s;
        }

        .menu-toggle.on {
            background: var(--accent);
        }

        .menu-toggle::after {
            content: '';
            position: absolute;
            top: 3px;
            left: 3px;
            width: 18px;
            height: 18px;
            background: var(--toggle-knob);
            border-radius: 50%;
            transition: transform 0.2s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .menu-toggle.on::after {
            transform: translateX(20px);
        }

        .menu-divider {
            height: 1px;
            background: var(--border-strong);
            margin: 16px 0;
        }

        /* Theme Button */
        .theme-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 14px;
            background: var(--surface-3);
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.15s;
        }

        .theme-btn:hover {
            background: var(--surface-2);
        }

        .theme-btn-preview {
            font-size: 20px;
        }

        .theme-btn-info {
            flex: 1;
            text-align: left;
        }

        .theme-btn-label {
            font-size: 10px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .theme-btn-name {
            font-size: 13px;
            font-weight: 500;
            color: var(--text);
        }

        .theme-btn-arrow {
            color: var(--text-dim);
            font-size: 18px;
        }

        /* Theme Picker Panel */
        .theme-picker {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--theme-picker-bg);
            z-index: 1001;
            display: none;
            flex-direction: column;
        }

        .theme-picker.open {
            display: flex;
            animation: panelSlide 0.2s ease;
        }

        .theme-picker-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 14px;
            border-bottom: 1px solid var(--border-strong);
            flex-shrink: 0;
        }

        .theme-picker-back {
            background: var(--surface-4);
            border: none;
            color: var(--text);
            width: 28px;
            height: 28px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
        }

        .theme-picker-back:hover {
            background: var(--surface-5);
        }

        .theme-picker-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text);
        }

        .theme-grid {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            align-content: start;
        }

        .theme-grid::-webkit-scrollbar { width: 4px; }
        .theme-grid::-webkit-scrollbar-thumb { 
            background: var(--surface-2);
            border-radius: 2px; 
        }

        .theme-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 10px 4px;
            cursor: pointer;
            transition: all 0.15s;
            font-size: 10px;
            color: var(--text-muted);
            border-radius: 8px;
            background: var(--surface-3);
            border: 2px solid transparent;
        }

        .theme-item:hover {
            background: var(--surface-2);
            color: var(--text);
        }

        .theme-item.active {
            background: var(--surface-4);
            border-color: var(--accent);
            color: var(--text);
        }

        .theme-emoji { font-size: 20px; }
        .theme-name { 
            font-weight: 500; 
            text-align: center;
            line-height: 1.2;
        }



        /* Controls */
        .controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 8px;
            background: ${t.controlsBg};
            flex-shrink: 0;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        .controls-group {
            display: flex;
            align-items: center;
            gap: 3px;
        }

        .controls-group.center {
            flex: 1;
            justify-content: center;
        }

        .controls-group.side {
            width: 28px;
            flex: 0 0 28px;
        }

        .controls-group.right {
            justify-content: flex-end;
        }

        .ctrl-btn {
            background: var(--surface-1);
            border: none;
            color: var(--text);
            width: 28px;
            height: 28px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transition: all 0.15s ease;
        }

        .ctrl-btn:hover {
            background: var(--surface-2);
            transform: scale(1.05);
        }

        .ctrl-btn:active {
            transform: scale(0.95);
        }

        .ctrl-btn svg {
            width: 12px;
            height: 12px;
            fill: currentColor;
        }

        .ctrl-btn.play-btn {
            width: 34px;
            height: 34px;
            background: var(--accent);
            color: #000;
        }

        .ctrl-btn.play-btn:hover {
            background: var(--accent-hover);
            transform: scale(1.06);
        }

        .ctrl-btn.play-btn svg {
            width: 14px;
            height: 14px;
        }

        .ctrl-btn.shuffle-on {
            color: var(--accent);
        }

        .ctrl-btn.repeat-on,
        .ctrl-btn.repeat-one {
            color: var(--accent);
        }

        .ctrl-btn.repeat-one::after {
            content: '1';
            position: absolute;
            right: 6px;
            top: 6px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--accent);
            color: #000;
            font-size: 7px;
            font-weight: 700;
            line-height: 10px;
            text-align: center;
        }

        .ctrl-btn.liked {
            color: var(--accent);
        }

        .ctrl-btn.liked svg {
            fill: var(--accent);
        }

        .ctrl-btn.hidden {
            display: none;
        }

        /* Lyrics Container */
        .lyrics-wrap {
            flex: 1 1 auto;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 12px;
            scroll-behavior: smooth;
            -webkit-app-region: no-drag;
            app-region: no-drag;
            min-height: 0;
            position: relative;
            z-index: 1;
        }

        .lyrics-wrap.centered {
            text-align: center;
        }

        .lyrics-wrap.centered .lyric {
            transform-origin: center center;
        }

        .lyrics-wrap.collapsed {
            display: none;
        }

        .lyrics-wrap::-webkit-scrollbar {
            display: none;
        }

        .lyrics-wrap {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
        }

        .lyric {
            padding: 5px 0;
            color: var(--text);
            opacity: var(--lyric-base-opacity);
            transition: all 0.2s ease;
            cursor: pointer;
            line-height: 1.35;
            transform-origin: left center;
        }

        .lyric-translation {
            display: block;
            font-size: 0.92em;
            opacity: 0.78;
            margin-top: 2px;
        }

        .lyric.active .lyric-translation {
            color: var(--accent);
            opacity: 0.9;
        }

        .lyric.past .lyric-translation {
            opacity: var(--lyric-past-opacity);
        }

        .lyric:hover {
            opacity: var(--lyric-hover-opacity);
        }

        .lyric.active {
            opacity: 1;
            color: var(--accent);
            font-weight: 500;
            transform: scale(1.02);
            text-shadow: 0 0 20px var(--text-glow);
        }

        .lyric.past {
            opacity: var(--lyric-past-opacity);
        }

        /* No Lyrics / Loading */
        .status-msg {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            text-align: center;
            padding: 20px;
            opacity: var(--status-opacity);
        }

        .status-msg .icon {
            font-size: 40px;
            margin-bottom: 12px;
        }

        .status-msg .text {
            font-size: 15px;
            font-weight: 500;
        }

        .status-msg .subtext {
            font-size: 12px;
            opacity: var(--subtext-opacity);
            margin-top: 4px;
        }

        .spinner {
            width: 32px;
            height: 32px;
            border: 3px solid var(--surface-2);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Progress */
        .progress-row {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px 2px 8px;
            background: ${t.footerBg};
            border-top: 1px solid var(--border);
            max-height: 40px;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        .idle-row {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .idle-row .slider {
            height: 3px;
        }

        .progress-time {
            font-size: 10px;
            color: var(--text-muted);
            min-width: 28px;
            text-align: right;
            font-variant-numeric: tabular-nums;
        }

        .progress-bar {
            position: relative;
            height: 3px;
            flex: 1;
            background: var(--surface-2);
            border-radius: 999px;
            cursor: pointer;
        }

        .progress-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 0%;
            background: var(--accent);
            border-radius: 999px;
        }

        /* Footer */
        .footer {
            background: ${t.footerBg};
            border-top: 1px solid var(--border);
            flex-shrink: 0;
            padding: 4px 8px;
            -webkit-app-region: no-drag;
            app-region: no-drag;
        }

        /* Hide footer when all rows are collapsed */
        .footer:not(:has(.footer-row:not(.collapsed))) {
            display: none;
        }

        .footer-row {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .footer-row.collapsed {
            display: none;
        }

        .footer-row.collapsed + .footer-row:not(.collapsed) {
            /* No extra spacing when previous row is collapsed */
        }

        .footer-row:not(.collapsed) + .footer-row:not(.collapsed) {
            margin-top: 4px;
            padding-top: 4px;
            border-top: 1px solid var(--border);
        }

        .control-label {
            font-size: 9px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            min-width: 24px;
        }

        .control-label,
        #fontValue {
            font-size: 10px;
            color: var(--text-muted);
        }

        #fontValue {
            min-width: 28px;
            text-align: right;
        }

        .slider {
            -webkit-appearance: none;
            flex: 1;
            height: 3px;
            background: var(--surface-2);
            border-radius: 2px;
            outline: none;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 10px;
            height: 10px;
            background: var(--accent);
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.1s;
        }

        .slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }

        .volume-icon {
            width: 14px;
            height: 14px;
            fill: var(--icon-muted);
            flex-shrink: 0;
            cursor: pointer;
            transition: fill 0.15s;
        }

        .volume-icon:hover {
            fill: var(--text);
        }

        .value-display {
            font-size: 10px;
            color: var(--text-muted);
            min-width: 28px;
            text-align: right;
        }
    `;
    }

    // ==================== LYRICS FETCHING ====================
    const FALLBACK_LYRICS_APIS = {
        lrcCxBase: 'https://api.lrc.cx/api/v1/lyrics',
        moreLyricsBase: 'https://lyrics.kamiloo13.me/api',
        vkeysBase: 'https://api.vkeys.cn',
        neteaseOfficialBase: 'https://music.163.com/api',
        qq1Base: 'https://oiapi.net/api/QQMusicLyric',
    };

    function getTrackMetadata() {
        const item = Spicetify.Player.data?.item;
        if (!item) return null;

        const title = item.name || '';
        const artist = item.artists?.map(a => a.name).filter(Boolean).join(', ') || '';
        const album = item.album?.name || item.album?.title || '';
        const durationMs = getTrackDurationMs();

        return { title, artist, album, durationMs };
    }

    function parseLrcLines(lrcText) {
        if (!lrcText || typeof lrcText !== 'string') return null;

        const lines = [];
        let hasTime = false;
        const timeTag = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
        const metaTag = /^\s*\[(ti|ar|al|by|offset):/i;

        for (const rawLine of lrcText.split(/\r?\n/)) {
            const line = rawLine.trim();
            if (!line) continue;
            if (metaTag.test(line)) continue;

            const matches = [...line.matchAll(timeTag)];
            const text = line.replace(timeTag, '').trim();

            if (matches.length === 0) {
                if (text) lines.push({ startTime: 0, text });
                continue;
            }

            hasTime = true;
            for (const match of matches) {
                const min = parseInt(match[1], 10);
                const sec = parseInt(match[2], 10);
                const frac = match[3] || '0';
                let ms = 0;
                if (frac.length === 1) ms = parseInt(frac, 10) * 100;
                else if (frac.length === 2) ms = parseInt(frac, 10) * 10;
                else ms = parseInt(frac.slice(0, 3), 10);

                const startTime = (min * 60 + sec) * 1000 + ms;
                lines.push({ startTime, text });
            }
        }

        const filtered = lines.filter(line => line.text && line.text.trim());
        if (!filtered.length) return null;

        if (hasTime) {
            filtered.sort((a, b) => a.startTime - b.startTime);
        }

        return { lines: filtered, hasTime };
    }

    function parseLrcToLyrics(lrcText) {
        const parsed = parseLrcLines(lrcText);
        if (!parsed?.lines?.length) return null;
        return {
            synced: parsed.hasTime,
            lines: parsed.lines
        };
    }

    function mergeBilingualLyrics(baseLyrics, translationLyrics) {
        if (!baseLyrics?.lines?.length || !translationLyrics?.lines?.length) return baseLyrics;
        if (!translationLyrics.synced) return baseLyrics;

        const merged = [];
        const baseLines = baseLyrics.lines.slice().sort((a, b) => a.startTime - b.startTime);
        const transLines = translationLyrics.lines.slice().sort((a, b) => a.startTime - b.startTime);
        const toleranceMs = 500;

        let tIndex = 0;
        for (const line of baseLines) {
            while (tIndex < transLines.length && transLines[tIndex].startTime < line.startTime - toleranceMs) {
                tIndex += 1;
            }

            let translation = '';
            if (tIndex < transLines.length) {
                const candidate = transLines[tIndex];
                if (Math.abs(candidate.startTime - line.startTime) <= toleranceMs) {
                    translation = candidate.text;
                    tIndex += 1;
                }
            }

            if (translation) merged.push({ ...line, translation });
            else merged.push(line);
        }

        return { ...baseLyrics, lines: merged };
    }

    function mapMoreLyricsResult(data) {
        if (!data || !Array.isArray(data.lines)) return null;

        const lines = data.lines
            .map(line => ({
                startTime: parseInt(line.startTimeMs || 0, 10) || 0,
                text: line.words || ''
            }))
            .filter(line => line.text && line.text.trim());

        if (!lines.length) return null;

        return {
            synced: data.isSynced === true,
            lines
        };
    }

    async function fetchLrcCxLyrics(meta) {
        if (!meta || (!meta.title && !meta.artist && !meta.album)) return null;

        const params = new URLSearchParams();
        if (meta.title) params.set('title', meta.title);
        if (meta.album) params.set('album', meta.album);
        if (meta.artist) params.set('artist', meta.artist);
        const query = params.toString();
        if (!query) return null;

        try {
            const advanceUrl = `${FALLBACK_LYRICS_APIS.lrcCxBase}/advance?${query}`;
            const advanceResp = await fetch(advanceUrl);
            if (advanceResp.ok) {
                const data = await advanceResp.json();
                if (Array.isArray(data)) {
                    const itemWithLyrics = data.find(item => item?.lyrics && typeof item.lyrics === 'string');
                    if (itemWithLyrics) {
                        const parsed = parseLrcToLyrics(itemWithLyrics.lyrics);
                        if (parsed) return parsed;
                    }
                }
            }
        } catch (e) {}

        try {
            const singleUrl = `${FALLBACK_LYRICS_APIS.lrcCxBase}/single?${query}`;
            const singleResp = await fetch(singleUrl);
            if (singleResp.ok) {
                const text = await singleResp.text();
                const parsed = parseLrcToLyrics(text);
                if (parsed) return parsed;
            }
        } catch (e) {}

        return null;
    }

    async function fetchMoreLyrics(meta) {
        if (!meta || (!meta.title && !meta.artist)) return null;

        const params = new URLSearchParams();
        if (meta.artist) params.set('artist', meta.artist);
        if (meta.title) params.set('track', meta.title);
        if (meta.durationMs) params.set('duration', Math.round(meta.durationMs / 1000).toString());
        if (meta.album) params.set('album', meta.album);

        const query = params.toString();
        if (!query) return null;

        try {
            const url = `${FALLBACK_LYRICS_APIS.moreLyricsBase}/get?${query}`;
            const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
            if (!resp.ok) return null;
            const data = await resp.json();
            return mapMoreLyricsResult(data);
        } catch (e) {
            return null;
        }
    }

    async function fetchVkeysQqLyrics(meta) {
        if (!meta?.title) return null;

        const searchParams = new URLSearchParams();
        searchParams.set('word', meta.artist ? `${meta.title} ${meta.artist}` : meta.title);
        searchParams.set('page', '1');
        searchParams.set('num', '10');

        try {
            const searchUrl = `${FALLBACK_LYRICS_APIS.vkeysBase}/v2/music/tencent/search/song?${searchParams.toString()}`;
            const searchResp = await fetch(searchUrl);
            if (!searchResp.ok) return null;
            const searchJson = await searchResp.json();
            const list = Array.isArray(searchJson?.data) ? searchJson.data : [];
            if (!list.length) return null;

            const pick = list.find(item => item?.mid || item?.id) || list[0];
            if (!pick) return null;

            const lyricParams = new URLSearchParams();
            if (pick.mid) lyricParams.set('mid', pick.mid);
            else if (pick.id) lyricParams.set('id', String(pick.id));

            if (!lyricParams.toString()) return null;

            const lyricUrl = `${FALLBACK_LYRICS_APIS.vkeysBase}/v2/music/tencent/lyric?${lyricParams.toString()}`;
            const lyricResp = await fetch(lyricUrl);
            if (!lyricResp.ok) return null;
            const lyricJson = await lyricResp.json();
            const lrc = lyricJson?.data?.lrc;
            return parseLrcToLyrics(lrc);
        } catch (e) {
            return null;
        }
    }

    async function fetchVkeysNeteaseLyrics(meta) {
        if (!meta?.title) return null;

        const searchParams = new URLSearchParams();
        searchParams.set('word', meta.artist ? `${meta.title} ${meta.artist}` : meta.title);
        searchParams.set('page', '1');
        searchParams.set('num', '10');

        try {
            const searchUrl = `${FALLBACK_LYRICS_APIS.vkeysBase}/v2/music/netease?${searchParams.toString()}`;
            const searchResp = await fetch(searchUrl);
            if (!searchResp.ok) return null;
            const searchJson = await searchResp.json();
            const id = searchJson?.data?.id;
            if (!id) return null;

            const lyricUrl = `${FALLBACK_LYRICS_APIS.vkeysBase}/v2/music/netease/lyric?id=${encodeURIComponent(
                id
            )}`;
            const lyricResp = await fetch(lyricUrl);
            if (!lyricResp.ok) return null;
            const lyricJson = await lyricResp.json();
            const lrc = lyricJson?.data?.lrc;
            return parseLrcToLyrics(lrc);
        } catch (e) {
            return null;
        }
    }

    async function fetchNeteaseOfficialLyrics(meta) {
        if (!meta?.title) return null;

        const keyword = meta.artist ? `${meta.title} ${meta.artist}` : meta.title;
        const searchParams = new URLSearchParams();
        searchParams.set('s', keyword);
        searchParams.set('type', '1');
        searchParams.set('offset', '0');
        searchParams.set('limit', '5');

        try {
            const searchUrl = `${FALLBACK_LYRICS_APIS.neteaseOfficialBase}/search/get?${searchParams.toString()}`;
            const searchResp = await fetch(searchUrl, { headers: { 'Accept': 'application/json' } });
            if (!searchResp.ok) return null;
            const searchJson = await searchResp.json();
            const songs = searchJson?.result?.songs;
            const pick = Array.isArray(songs) ? songs[0] : null;
            const id = pick?.id;
            if (!id) return null;

            const lyricUrl = `${FALLBACK_LYRICS_APIS.neteaseOfficialBase}/song/lyric?os=pc&id=${encodeURIComponent(
                id
            )}&lv=-1&tv=-1`;
            const lyricResp = await fetch(lyricUrl, { headers: { 'Accept': 'application/json' } });
            if (!lyricResp.ok) return null;
            const lyricJson = await lyricResp.json();
            const lrc = lyricJson?.lrc?.lyric || lyricJson?.lrc;
            const tlyric = lyricJson?.tlyric?.lyric || lyricJson?.tlyric;
            const mainLyrics = parseLrcToLyrics(lrc);
            const transLyrics = parseLrcToLyrics(tlyric);
            return mergeBilingualLyrics(mainLyrics, transLyrics);
        } catch (e) {
            return null;
        }
    }

    function extractQq1Lyrics(data) {
        if (!data) return null;
        const content = data.conteng || data.content || '';
        if (typeof content === 'string' && content.trim()) return content;
        if (typeof data.base64 === 'string' && data.base64.trim()) {
            try {
                return atob(data.base64.trim());
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    async function fetchQq1Lyrics(meta) {
        if (!meta?.title) return null;

        const keyword = meta.artist ? `${meta.title} ${meta.artist}` : meta.title;
        const searchParams = new URLSearchParams();
        searchParams.set('keyword', keyword);
        searchParams.set('page', '1');
        searchParams.set('limit', '10');
        searchParams.set('format', 'lrc');
        searchParams.set('type', 'json');
        searchParams.set('n', '1');

        try {
            const searchUrl = `${FALLBACK_LYRICS_APIS.qq1Base}?${searchParams.toString()}`;
            const searchResp = await fetch(searchUrl);
            if (!searchResp.ok) return null;
            const searchJson = await searchResp.json();

            if (Array.isArray(searchJson?.data) && searchJson.data.length) {
                const pick = searchJson.data[0];
                const id = pick?.mid || pick?.id;
                if (!id) return null;

                const lyricParams = new URLSearchParams();
                lyricParams.set('id', String(id));
                lyricParams.set('format', 'lrc');
                lyricParams.set('type', 'json');

                const lyricUrl = `${FALLBACK_LYRICS_APIS.qq1Base}?${lyricParams.toString()}`;
                const lyricResp = await fetch(lyricUrl);
                if (!lyricResp.ok) return null;
                const lyricJson = await lyricResp.json();
                const lrc = extractQq1Lyrics(lyricJson?.data);
                return parseLrcToLyrics(lrc);
            }

            const lrc = extractQq1Lyrics(searchJson?.data);
            return parseLrcToLyrics(lrc);
        } catch (e) {
            return null;
        }
    }

    async function fetchLyrics(trackUri) {
        try {
            const trackId = trackUri.split(':').pop();
            
            // Method 1: Color Lyrics API
            try {
                const response = await Spicetify.CosmosAsync.get(
                    `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&market=from_token`
                );
                if (response?.lyrics?.lines) {
                    return {
                        synced: response.lyrics.syncType === 'LINE_SYNCED',
                        lines: response.lyrics.lines.map(line => ({
                            startTime: parseInt(line.startTimeMs),
                            text: line.words || ''
                        }))
                    };
                }
            } catch (e) {}

            // Method 2: Platform Lyrics API
            if (Spicetify.Platform?.Lyrics) {
                try {
                    const lyrics = await Spicetify.Platform.Lyrics.getLyrics(trackUri);
                    if (lyrics?.lines) {
                        return {
                            synced: true,
                            lines: lyrics.lines.map(line => ({
                                startTime: line.startTimeMs || 0,
                                text: line.words || line.text || ''
                            }))
                        };
                    }
                } catch (e) {}
            }

            // Method 3: Legacy endpoint
            try {
                const altResponse = await Spicetify.CosmosAsync.get(
                    `wg://lyrics/v1/track/${trackId}?format=json&market=from_token`
                );
                if (altResponse?.lines) {
                    return {
                        synced: true,
                        lines: altResponse.lines.map(line => ({
                            startTime: parseInt(line.startTimeMs || line.time || 0),
                            text: line.words || line.text || ''
                        }))
                    };
                }
            } catch (e) {}

            const meta = getTrackMetadata();

            // Method 4: More Lyrics API
            const moreLyrics = await fetchMoreLyrics(meta);
            if (moreLyrics?.lines?.length) return moreLyrics;

            // Method 5: LRC.cx API
            const lrcCxLyrics = await fetchLrcCxLyrics(meta);
            if (lrcCxLyrics?.lines?.length) return lrcCxLyrics;

            // Method 6: NetEase Official API
            const neteaseOfficialLyrics = await fetchNeteaseOfficialLyrics(meta);
            if (neteaseOfficialLyrics?.lines?.length) return neteaseOfficialLyrics;

            // Method 7: QQ Music (vkeys.cn)
            const qqLyrics = await fetchVkeysQqLyrics(meta);
            if (qqLyrics?.lines?.length) return qqLyrics;

            // Method 8: NetEase (vkeys.cn)
            const neteaseLyrics = await fetchVkeysNeteaseLyrics(meta);
            if (neteaseLyrics?.lines?.length) return neteaseLyrics;

            // Method 9: QQ Music (oiapi.net)
            const qq1Lyrics = await fetchQq1Lyrics(meta);
            if (qq1Lyrics?.lines?.length) return qq1Lyrics;

            return null;
        } catch (error) {
            console.error('[Lyric Miniplayer] Error fetching lyrics:', error);
            return null;
        }
    }

    // ==================== PIP WINDOW CREATION ====================
    async function openPictureInPicture() {
        // Close existing PiP window if open
        if (pipWindow && !pipWindow.closed) {
            pipWindow.close();
            pipWindow = null;
            return;
        }

        // Reset track URI to force fresh lyrics load
        currentTrackUri = null;

        // Check for Document Picture-in-Picture API (Chrome 116+)
        if ('documentPictureInPicture' in window) {
            try {
                pipWindow = await window.documentPictureInPicture.requestWindow({
                    width: CONFIG.pipWidth,
                    height: CONFIG.pipHeight,
                });

                setupPipWindow(pipWindow);
                return;
            } catch (err) {
                console.log('[Lyric Miniplayer] Document PiP failed, trying fallback:', err);
            }
        }

        // Fallback: Regular popup window
        try {
            const left = window.screen.width - CONFIG.pipWidth - 30;
            const top = 30;

            pipWindow = window.open(
                'about:blank',
                'LyricsOverlayPiP',
                `width=${CONFIG.pipWidth},height=${CONFIG.pipHeight},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
            );

            if (pipWindow) {
                setupPipWindow(pipWindow);
            } else {
                Spicetify.showNotification('Could not open lyrics window.', true);
            }
        } catch (err) {
            console.error('[Lyric Miniplayer] Fallback popup failed:', err);
            Spicetify.showNotification('Could not open lyrics window', true);
        }
    }

    function getVolumeIconSvg(volume) {
        if (volume === 0) {
            return `<svg viewBox="0 0 16 16" class="volume-icon" id="volumeIcon">
                <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"/>
                <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"/>
            </svg>`;
        } else if (volume < 50) {
            return `<svg viewBox="0 0 16 16" class="volume-icon" id="volumeIcon">
                <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"/>
            </svg>`;
        } else {
            return `<svg viewBox="0 0 16 16" class="volume-icon" id="volumeIcon">
                <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"/>
            </svg>`;
        }
    }

    function generateThemeMenuItems() {
        return Object.entries(THEMES).map(([key, theme]) => 
            `<div class="theme-item ${key === currentTheme ? 'active' : ''}" data-theme="${key}">
                <span class="theme-emoji">${theme.emoji}</span>
                <span class="theme-name">${theme.name}</span>
            </div>`
        ).join('');
    }

    function setupPipWindow(win) {
        const doc = win.document;
        const currentVolume = Math.round((Spicetify.Player.getVolume() || 0) * 100);

        // Build the HTML
        doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lyrics</title>
    <style id="themeStyles">${generateStyles(currentTheme, colorMode)}</style>
</head>
<body>
    <div class="lyrics-wrap ${showLyrics ? '' : 'collapsed'} ${centerLyrics ? 'centered' : ''}" id="lyricsContainer">
        <div class="status-msg">
            <div class="spinner"></div>
        </div>
    </div>

    <div class="overlay" id="chrome">
        <div class="resize-handle" id="resizeHandle" title="Drag to resize"></div>
    <div class="header" id="dragHeader" title="Drag to move window">
        <div class="track-info">
            <div class="track-line" id="trackLine">Loading...</div>
        </div>
        <div class="header-btns">
            <button class="menu-btn" id="menuBtn" title="Settings">
                <div class="menu-row">
                    <div class="menu-dot"></div>
                    <div class="menu-dot"></div>
                </div>
                <div class="menu-row">
                    <div class="menu-dot"></div>
                    <div class="menu-dot"></div>
                </div>
                <div class="menu-row">
                    <div class="menu-dot"></div>
                    <div class="menu-dot"></div>
                </div>
            </button>
            <button class="close-btn ${showCloseBtn ? '' : 'hidden'}" id="closeBtn" title="Close">x</button>
        </div>
    </div>

    <!-- Settings Panel - Full Screen -->
    <div class="settings-panel" id="settingsPanel">
        <div class="settings-header">
            <span class="settings-title">Settings</span>
            <button class="settings-close" id="settingsClose">x</button>
        </div>
        <div class="settings-content">
            <button class="theme-btn" id="openThemePicker">
                <span class="theme-btn-preview" id="currentThemeEmoji">${THEMES[currentTheme].emoji}</span>
                <div class="theme-btn-info">
                    <div class="theme-btn-label">Theme</div>
                    <div class="theme-btn-name" id="currentThemeName">${THEMES[currentTheme].name}</div>
                </div>
                <span class="theme-btn-arrow">></span>
            </button>
            
            <div class="menu-divider"></div>

            <div class="menu-section-title">Appearance</div>
            <div class="menu-item" id="toggleModeItem">
                <span class="menu-item-label">Light Mode</span>
                <div class="menu-toggle ${colorMode === 'light' ? 'on' : ''}" id="toggleMode"></div>
            </div>
            <div class="menu-item" id="idleDelayItem">
                <span class="menu-item-label">Idle Fade</span>
                <div class="idle-row">
                    <input type="range" class="slider" id="idleDelaySlider" min="500" max="10000" step="250" value="${idleDelayMs}">
                    <span class="value-display" id="idleDelayValue">${(idleDelayMs / 1000).toFixed(1)}s</span>
                </div>
            </div>
            
            <div class="menu-section-title">Display</div>
            <div class="menu-item" id="toggleLyricsItem">
                <span class="menu-item-label">Show Lyrics</span>
                <div class="menu-toggle ${showLyrics ? 'on' : ''}" id="toggleLyrics"></div>
            </div>
            <div class="menu-item" id="toggleCenterItem">
                <span class="menu-item-label">Center Lyrics</span>
                <div class="menu-toggle ${centerLyrics ? 'on' : ''}" id="toggleCenter"></div>
            </div>
            <div class="menu-item" id="toggleShuffleItem">
                <span class="menu-item-label">Shuffle Button</span>
                <div class="menu-toggle ${showShuffleBtn ? 'on' : ''}" id="toggleShuffle"></div>
            </div>
            <div class="menu-item" id="toggleRepeatItem">
                <span class="menu-item-label">Repeat Button</span>
                <div class="menu-toggle ${showRepeatBtn ? 'on' : ''}" id="toggleRepeat"></div>
            </div>
            <div class="menu-item" id="toggleLikeItem">
                <span class="menu-item-label">Like Button</span>
                <div class="menu-toggle ${showLikeBtn ? 'on' : ''}" id="toggleLike"></div>
            </div>
            <div class="menu-item" id="toggleCloseItem">
                <span class="menu-item-label">Close Button</span>
                <div class="menu-toggle ${showCloseBtn ? 'on' : ''}" id="toggleClose"></div>
            </div>
            <div class="menu-item" id="toggleFontItem">
                <span class="menu-item-label">Font Size Slider</span>
                <div class="menu-toggle ${showFontSlider ? 'on' : ''}" id="toggleFont"></div>
            </div>
            <div class="menu-item" id="toggleVolItem">
                <span class="menu-item-label">Volume Slider</span>
                <div class="menu-toggle ${showVolumeSlider ? 'on' : ''}" id="toggleVol"></div>
            </div>
        </div>
    </div>

    <!-- Theme Picker Panel -->
    <div class="theme-picker" id="themePicker">
        <div class="theme-picker-header">
            <button class="theme-picker-back" id="themePickerBack"><</button>
            <span class="theme-picker-title">Choose Theme</span>
        </div>
        <div class="theme-grid" id="themeGrid">
            ${generateThemeMenuItems()}
        </div>
    </div>

    <div class="overlay-spacer"></div>

    <div class="footer" id="footer">
        <div class="footer-row ${showFontSlider ? '' : 'collapsed'}" id="fontRow">
            <span class="control-label">Size</span>
            <input type="range" class="slider" id="fontSlider" min="${CONFIG.minFontSize}" max="${CONFIG.maxFontSize}" value="${fontSize}">
            <span class="value-display" id="fontValue">${fontSize}px</span>
        </div>
        <div class="footer-row ${showVolumeSlider ? '' : 'collapsed'}" id="volumeRow">
            <div id="volumeIconWrap">
                ${getVolumeIconSvg(currentVolume)}
            </div>
            <input type="range" class="slider" id="volumeSlider" min="0" max="100" value="${currentVolume}">
            <span class="value-display" id="volumePercent">${currentVolume}%</span>
        </div>
    </div>

    <div class="progress-row" id="progressRow">
        <span class="progress-time" id="elapsedTime">0:00</span>
        <div class="progress-bar" id="progressBar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        <span class="progress-time" id="totalTime">0:00</span>
    </div>

    <div class="controls">
        <div class="controls-group side left"></div>
        <div class="controls-group center">
            <button class="ctrl-btn ${showShuffleBtn ? '' : 'hidden'}" id="shuffleBtn" title="Shuffle">
                <svg viewBox="0 0 16 16" id="shuffleIcon"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06l2.306-2.306a.75.75 0 0 0 0-1.06L13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"/><path d="m7.5 10.723.98-1.167 1.796 2.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.306 2.306a.75.75 0 0 1 0 1.06l-2.306 2.306a.75.75 0 1 1-1.06-1.06L14.109 14H12.16a3.75 3.75 0 0 1-2.873-1.34l-1.787-2.14z"/></svg>
            </button>
            <button class="ctrl-btn" id="prevBtn" title="Previous">
                <svg viewBox="0 0 16 16"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/></svg>
            </button>
            <button class="ctrl-btn play-btn" id="playBtn" title="Play/Pause">
                <svg viewBox="0 0 16 16" id="playIcon"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>
            </button>
            <button class="ctrl-btn" id="nextBtn" title="Next">
                <svg viewBox="0 0 16 16"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/></svg>
            </button>
            <button class="ctrl-btn ${showRepeatBtn ? '' : 'hidden'}" id="repeatBtn" title="Repeat Off">
                <svg viewBox="0 0 16 16" id="repeatIcon"><path d="M11.17 3.5H5.5A2.5 2.5 0 0 0 3 6v1.25a.75.75 0 0 1-1.5 0V6A4 4 0 0 1 5.5 2h5.67l-.9-.9a.75.75 0 1 1 1.06-1.06l2.18 2.18a.75.75 0 0 1 0 1.06l-2.18 2.18a.75.75 0 1 1-1.06-1.06l.9-.9zM4.83 12.5H10.5A2.5 2.5 0 0 0 13 10V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-4 4H4.83l.9.9a.75.75 0 1 1-1.06 1.06L2.5 13.78a.75.75 0 0 1 0-1.06l2.18-2.18a.75.75 0 1 1 1.06 1.06l-.9.9z"/></svg>
            </button>
        </div>
        <div class="controls-group side right">
            <button class="ctrl-btn ${showLikeBtn ? '' : 'hidden'}" id="likeBtn" title="Save to Liked Songs">
                <svg viewBox="0 0 16 16" id="likeIcon"><path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"/></svg>
            </button>
        </div>
    </div>
</div>
</body>
</html>`);
        doc.close();

        // Get elements
        const menuBtn = doc.getElementById('menuBtn');
        const settingsPanel = doc.getElementById('settingsPanel');
        const settingsClose = doc.getElementById('settingsClose');
        const prevBtn = doc.getElementById('prevBtn');
        const playBtn = doc.getElementById('playBtn');
        const nextBtn = doc.getElementById('nextBtn');
        const shuffleBtn = doc.getElementById('shuffleBtn');
        const repeatBtn = doc.getElementById('repeatBtn');
        const likeBtn = doc.getElementById('likeBtn');
        const fontSlider = doc.getElementById('fontSlider');
        const fontValue = doc.getElementById('fontValue');
        const fontRow = doc.getElementById('fontRow');
        const volumeRow = doc.getElementById('volumeRow');
        const volumeSlider = doc.getElementById('volumeSlider');
        const volumePercent = doc.getElementById('volumePercent');
        const volumeIconWrap = doc.getElementById('volumeIconWrap');
        const progressRow = doc.getElementById('progressRow');
        const progressBar = doc.getElementById('progressBar');
        const progressFill = doc.getElementById('progressFill');
        const elapsedTime = doc.getElementById('elapsedTime');
        const totalTime = doc.getElementById('totalTime');
        const lyricsContainer = doc.getElementById('lyricsContainer');
        const toggleLyricsItem = doc.getElementById('toggleLyricsItem');
        const toggleLyrics = doc.getElementById('toggleLyrics');
        const toggleCenterItem = doc.getElementById('toggleCenterItem');
        const toggleCenter = doc.getElementById('toggleCenter');
        const toggleModeItem = doc.getElementById('toggleModeItem');
        const toggleMode = doc.getElementById('toggleMode');
        const idleDelaySlider = doc.getElementById('idleDelaySlider');
        const idleDelayValue = doc.getElementById('idleDelayValue');
        const toggleShuffleItem = doc.getElementById('toggleShuffleItem');
        const toggleShuffle = doc.getElementById('toggleShuffle');
        const toggleRepeatItem = doc.getElementById('toggleRepeatItem');
        const toggleRepeat = doc.getElementById('toggleRepeat');
        const toggleLikeItem = doc.getElementById('toggleLikeItem');
        const toggleLike = doc.getElementById('toggleLike');
        const toggleCloseItem = doc.getElementById('toggleCloseItem');
        const toggleClose = doc.getElementById('toggleClose');
        const toggleFontItem = doc.getElementById('toggleFontItem');
        const toggleFont = doc.getElementById('toggleFont');
        const toggleVolItem = doc.getElementById('toggleVolItem');
        const toggleVol = doc.getElementById('toggleVol');
        const themeStyles = doc.getElementById('themeStyles');
        const openThemePickerBtn = doc.getElementById('openThemePicker');
        const currentThemeEmoji = doc.getElementById('currentThemeEmoji');
        const currentThemeName = doc.getElementById('currentThemeName');
        const themePicker = doc.getElementById('themePicker');
        const themePickerBack = doc.getElementById('themePickerBack');
        const themeGrid = doc.getElementById('themeGrid');
        const closeBtn = doc.getElementById('closeBtn');
        const chrome = doc.getElementById('chrome');
        let idleTimer = null;

        // Close miniplayer
        closeBtn.onclick = () => {
            win.close();
        };

        // Settings panel toggle
        menuBtn.onclick = (e) => {
            e.stopPropagation();
            settingsPanel.classList.add('open');
            setChromeHidden(false);
        };

        // Close settings panel
        settingsClose.onclick = () => {
            settingsPanel.classList.remove('open');
        };

        // Open theme picker panel
        openThemePickerBtn.onclick = () => {
            themePicker.classList.add('open');
            setChromeHidden(false);
        };

        // Close theme picker (back to settings)
        themePickerBack.onclick = () => {
            themePicker.classList.remove('open');
        };

        let chromeFadeAnim = null;
        let chromeHidden = false;

        function setChromeHidden(hidden) {
            if (!chrome) return;
            if (hidden === chromeHidden) return;
            chromeHidden = hidden;
            chrome.classList.toggle('idle-hidden', hidden);

            const targetOpacity = hidden ? 0 : 1;
            const computedOpacity = parseFloat(getComputedStyle(chrome).opacity);
            const startOpacity = Number.isFinite(computedOpacity) ? computedOpacity : (hidden ? 1 : 0);

            if (chromeFadeAnim) chromeFadeAnim.cancel();
            if (chrome.animate) {
                chromeFadeAnim = chrome.animate(
                    [{ opacity: startOpacity }, { opacity: targetOpacity }],
                    { duration: 500, easing: 'ease', fill: 'forwards' }
                );
            } else {
                chrome.style.opacity = String(targetOpacity);
            }
        }

        function resetIdleTimer() {
            if (idleTimer) clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                if (settingsPanel.classList.contains('open')) return;
                if (themePicker.classList.contains('open')) return;
                setChromeHidden(true);
            }, idleDelayMs);
        }

        function handleActivity() {
            if (chromeHidden) setChromeHidden(false);
            resetIdleTimer();
        }

        doc.addEventListener('mousemove', handleActivity);
        doc.addEventListener('mousedown', handleActivity);
        doc.addEventListener('keydown', handleActivity);
        doc.addEventListener('wheel', handleActivity);
        doc.addEventListener('touchstart', handleActivity);

        // Theme selection
        themeGrid.onclick = (e) => {
            const themeItem = e.target.closest('.theme-item');
            if (themeItem) {
                const newTheme = themeItem.dataset.theme;
                if (newTheme && THEMES[newTheme]) {
                    currentTheme = newTheme;
                    localStorage.setItem('lyrics-overlay-theme', currentTheme);
                    
                    // Update styles
                    themeStyles.textContent = generateStyles(currentTheme, colorMode);
                    
                    // Update theme button
                    currentThemeEmoji.textContent = THEMES[currentTheme].emoji;
                    currentThemeName.textContent = THEMES[currentTheme].name;
                    
                    // Update active state
                    doc.querySelectorAll('.theme-item').forEach(item => {
                        item.classList.toggle('active', item.dataset.theme === currentTheme);
                    });
                    
                    // Close picker after selection
                    themePicker.classList.remove('open');
                }
            }
        };


        // Toggle handlers
        toggleLyricsItem.onclick = () => {
            showLyrics = !showLyrics;
            toggleLyrics.classList.toggle('on', showLyrics);
            lyricsContainer.classList.toggle('collapsed', !showLyrics);
            localStorage.setItem('lyrics-overlay-showlyrics', showLyrics);
        };

        toggleCenterItem.onclick = () => {
            centerLyrics = !centerLyrics;
            toggleCenter.classList.toggle('on', centerLyrics);
            lyricsContainer.classList.toggle('centered', centerLyrics);
            localStorage.setItem('lyrics-overlay-centerlyrics', centerLyrics);
        };

        toggleModeItem.onclick = () => {
            colorMode = colorMode === 'light' ? 'dark' : 'light';
            toggleMode.classList.toggle('on', colorMode === 'light');
            localStorage.setItem('lyrics-overlay-colormode', colorMode);
            themeStyles.textContent = generateStyles(currentTheme, colorMode);
        };

        idleDelaySlider.oninput = (e) => {
            idleDelayMs = parseInt(e.target.value, 10);
            if (Number.isNaN(idleDelayMs)) return;
            idleDelayValue.textContent = `${(idleDelayMs / 1000).toFixed(1)}s`;
            localStorage.setItem('lyrics-overlay-idledelay', idleDelayMs);
            resetIdleTimer();
        };

        toggleShuffleItem.onclick = () => {
            showShuffleBtn = !showShuffleBtn;
            toggleShuffle.classList.toggle('on', showShuffleBtn);
            shuffleBtn.classList.toggle('hidden', !showShuffleBtn);
            localStorage.setItem('lyrics-overlay-showshuffle', showShuffleBtn);
        };

        toggleRepeatItem.onclick = () => {
            showRepeatBtn = !showRepeatBtn;
            toggleRepeat.classList.toggle('on', showRepeatBtn);
            repeatBtn.classList.toggle('hidden', !showRepeatBtn);
            localStorage.setItem('lyrics-overlay-showrepeat', showRepeatBtn);
        };

        toggleLikeItem.onclick = () => {
            showLikeBtn = !showLikeBtn;
            toggleLike.classList.toggle('on', showLikeBtn);
            likeBtn.classList.toggle('hidden', !showLikeBtn);
            localStorage.setItem('lyrics-overlay-showlike', showLikeBtn);
        };

        toggleCloseItem.onclick = () => {
            showCloseBtn = !showCloseBtn;
            toggleClose.classList.toggle('on', showCloseBtn);
            closeBtn.classList.toggle('hidden', !showCloseBtn);
            localStorage.setItem('lyrics-overlay-showclose', showCloseBtn);
        };

        toggleFontItem.onclick = () => {
            showFontSlider = !showFontSlider;
            toggleFont.classList.toggle('on', showFontSlider);
            fontRow.classList.toggle('collapsed', !showFontSlider);
            localStorage.setItem('lyrics-overlay-showfont', showFontSlider);
        };

        toggleVolItem.onclick = () => {
            showVolumeSlider = !showVolumeSlider;
            toggleVol.classList.toggle('on', showVolumeSlider);
            volumeRow.classList.toggle('collapsed', !showVolumeSlider);
            localStorage.setItem('lyrics-overlay-showvol', showVolumeSlider);
        };

        // Control handlers
        prevBtn.onclick = () => Spicetify.Player.back();
        playBtn.onclick = () => Spicetify.Player.togglePlay();
        nextBtn.onclick = () => Spicetify.Player.next();
        shuffleBtn.onclick = () => {
            Spicetify.Player.toggleShuffle();
            updateShuffleState();
        };
        repeatBtn.onclick = () => {
            const current = resolveRepeatMode();
            const next = current === 'off' ? 'context' : current === 'context' ? 'track' : 'off';
            setRepeatMode(next);
            pendingRepeatMode = next;
            pendingRepeatAt = Date.now();
            applyRepeatUi(next);
            setTimeout(updateRepeatState, 120);
        };

        likeBtn.onclick = () => {
            Spicetify.Player.toggleHeart();
        };

        // Update shuffle button state
        function updateShuffleState() {
            const isShuffled = Spicetify.Player.getShuffle();
            shuffleBtn.classList.toggle('shuffle-on', isShuffled);
        }
        updateShuffleState();

        function setRepeatMode(mode) {
            if (!Spicetify.Player.setRepeat) return;
            const rawMode = getRepeatRawState();
            if (typeof rawMode === 'string') {
                Spicetify.Player.setRepeat(mode);
                return;
            }
            if (typeof rawMode === 'number') {
                const mapped = mode === 'track' ? 2 : mode === 'context' ? 1 : 0;
                Spicetify.Player.setRepeat(mapped);
                return;
            }
            if (typeof rawMode === 'boolean') {
                Spicetify.Player.setRepeat(mode !== 'off');
                return;
            }
            Spicetify.Player.setRepeat(mode);
        }

        function updateRepeatState() {
            const mode = resolveRepeatMode();
            applyRepeatUi(mode);
        }

        function applyRepeatUi(mode) {
            repeatBtn.classList.toggle('repeat-on', mode === 'context');
            repeatBtn.classList.toggle('repeat-one', mode === 'track');
            repeatBtn.title = mode === 'track' ? 'Repeat One' : mode === 'context' ? 'Repeat All' : 'Repeat Off';
        }
        updateRepeatState();

        // Update like icon (filled vs outline)
        function updateLikeIcon(isLiked) {
            const likeIcon = doc.getElementById('likeIcon');
            if (!likeIcon) return;
            
            likeBtn.classList.toggle('liked', isLiked);
            
            if (isLiked) {
                // Filled heart
                likeIcon.innerHTML = '<path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"/>';
            } else {
                // Outline heart
                likeIcon.innerHTML = '<path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"/>';
            }
        }

        // Check and update like state
        function updateLikeState() {
            const isLiked = Spicetify.Player.getHeart();
            updateLikeIcon(isLiked);
        }
        
        // Initial update
        updateLikeState();

        // Font size handler
        fontSlider.oninput = (e) => {
            fontSize = parseInt(e.target.value);
            fontValue.textContent = `${fontSize}px`;
            localStorage.setItem('lyrics-overlay-fontsize', fontSize);
            updatePipFontSize();
        };

        // Volume handlers
        volumeSlider.oninput = (e) => {
            const vol = parseInt(e.target.value);
            Spicetify.Player.setVolume(vol / 100);
            volumePercent.textContent = `${vol}%`;
            volumeIconWrap.innerHTML = getVolumeIconSvg(vol);
        };

        // Click volume icon to mute/unmute
        volumeIconWrap.onclick = () => {
            const currentVol = Math.round((Spicetify.Player.getVolume() || 0) * 100);
            if (currentVol > 0) {
                volumeSlider.dataset.prevVolume = currentVol;
                Spicetify.Player.setVolume(0);
                volumeSlider.value = 0;
                volumePercent.textContent = '0%';
                volumeIconWrap.innerHTML = getVolumeIconSvg(0);
            } else {
                const prevVol = parseInt(volumeSlider.dataset.prevVolume) || 50;
                Spicetify.Player.setVolume(prevVol / 100);
                volumeSlider.value = prevVol;
                volumePercent.textContent = `${prevVol}%`;
                volumeIconWrap.innerHTML = getVolumeIconSvg(prevVol);
            }
        };

        // Lyrics click to seek
        lyricsContainer.onclick = (e) => {
            if (e.target.classList.contains('lyric')) {
                const time = e.target.dataset.time;
                if (time) Spicetify.Player.seek(parseInt(time));
            }
        };

        // Progress bar seek
        if (progressBar) {
            progressBar.onclick = (e) => {
                const durationMs = getTrackDurationMs();
                if (!durationMs) return;
                const rect = progressBar.getBoundingClientRect();
                const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                Spicetify.Player.seek(Math.round(durationMs * ratio));
                updatePipProgress();
            };
        }

        // Handle window close
        win.addEventListener('pagehide', () => {
            pipWindow = null;
        });

        // Initial update - force load lyrics for current track
        async function initialLoad() {
            const track = Spicetify.Player.data?.item;
            if (track?.uri) {
                currentTrackUri = track.uri;
                await loadLyrics(track.uri);
                updatePipLikeState();
            } else {
                // Retry after a short delay if track data not ready
                setTimeout(initialLoad, 200);
            }
        }
        
        updatePipContent();
        updatePipProgress();
        handleActivity();
        initialLoad();
        startUpdateLoop();
    }

    // ==================== PIP CONTENT UPDATES ====================
    function updatePipContent() {
        if (!pipWindow || pipWindow.closed) return;

        const doc = pipWindow.document;
        const data = Spicetify.Player.data;
        
        if (!data?.item) return;

        const track = data.item;

        // Update track info
        const trackLineEl = doc.getElementById('trackLine');
        if (trackLineEl) {
            const title = track.name || 'Unknown';
            const artist = track.artists?.map(a => a.name).join(', ') || 'Unknown';
            trackLineEl.textContent = `${title} - ${artist}`;
        }

        // Update play button
        updatePipPlayButton();

        // Update volume
        updatePipVolume();

        // Update progress
        updatePipProgress();

        // Check if track changed
        if (track.uri !== currentTrackUri) {
            currentTrackUri = track.uri;
            loadLyrics(track.uri);
            updatePipLikeState();
        }
    }

    function updatePipLikeState() {
        if (!pipWindow || pipWindow.closed) return;
        
        const doc = pipWindow.document;
        const likeBtn = doc.getElementById('likeBtn');
        const likeIcon = doc.getElementById('likeIcon');
        if (!likeBtn || !likeIcon) return;
        
        const isLiked = Spicetify.Player.getHeart();
        
        likeBtn.classList.toggle('liked', isLiked);
        if (isLiked) {
            likeIcon.innerHTML = '<path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"/>';
        } else {
            likeIcon.innerHTML = '<path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"/>';
        }
    }

    function getRepeatRawState() {
        const dataRepeat = Spicetify.Player?.data?.repeat;
        if (dataRepeat !== undefined && dataRepeat !== null) return dataRepeat;
        return Spicetify.Player.getRepeat?.();
    }

    function resolveRepeatMode() {
        const mode = normalizeRepeatModeValue(getRepeatRawState());
        if (pendingRepeatMode) {
            if (mode === pendingRepeatMode) {
                pendingRepeatMode = null;
                pendingRepeatAt = 0;
                return mode;
            }
            if (Date.now() - pendingRepeatAt < REPEAT_PENDING_MS) {
                return pendingRepeatMode;
            }
            pendingRepeatMode = null;
            pendingRepeatAt = 0;
        }
        return mode;
    }

    function normalizeRepeatModeValue(rawMode) {
        if (typeof rawMode === 'string') {
            const normalized = rawMode.toLowerCase();
            if (normalized === 'context' || normalized === 'track' || normalized === 'off') return normalized;
            return 'off';
        }
        if (typeof rawMode === 'number') {
            if (rawMode === 2) return 'track';
            if (rawMode === 1) return 'context';
            return 'off';
        }
        if (typeof rawMode === 'boolean') return rawMode ? 'context' : 'off';
        return 'off';
    }

    function updatePipShuffleState() {
        if (!pipWindow || pipWindow.closed) return;

        const doc = pipWindow.document;
        const shuffleBtn = doc.getElementById('shuffleBtn');
        if (!shuffleBtn) return;

        const isShuffled = Spicetify.Player.getShuffle();
        shuffleBtn.classList.toggle('shuffle-on', isShuffled);
    }

    function updatePipRepeatState() {
        if (!pipWindow || pipWindow.closed) return;

        const doc = pipWindow.document;
        const repeatBtn = doc.getElementById('repeatBtn');
        if (!repeatBtn) return;

        const mode = resolveRepeatMode();
        repeatBtn.classList.toggle('repeat-on', mode === 'context');
        repeatBtn.classList.toggle('repeat-one', mode === 'track');
        repeatBtn.title = mode === 'track' ? 'Repeat One' : mode === 'context' ? 'Repeat All' : 'Repeat Off';
    }

    function updatePipPlayButton() {
        if (!pipWindow || pipWindow.closed) return;

        const playIcon = pipWindow.document.getElementById('playIcon');
        if (!playIcon) return;

        const isPlaying = Spicetify.Player.isPlaying();
        playIcon.innerHTML = isPlaying
            ? '<path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>'
            : '<path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>';
    }

    function updatePipVolume() {
        if (!pipWindow || pipWindow.closed) return;

        const doc = pipWindow.document;
        const volumeSlider = doc.getElementById('volumeSlider');
        const volumePercent = doc.getElementById('volumePercent');
        const volumeIconWrap = doc.getElementById('volumeIconWrap');
        
        if (!volumeSlider || !volumePercent || !volumeIconWrap) return;

        // Only update if slider is not being dragged
        if (doc.activeElement !== volumeSlider) {
            const vol = Math.round((Spicetify.Player.getVolume() || 0) * 100);
            volumeSlider.value = vol;
            volumePercent.textContent = `${vol}%`;
            volumeIconWrap.innerHTML = getVolumeIconSvg(vol);
        }
    }

    function updatePipProgress() {
        if (!pipWindow || pipWindow.closed) return;

        const doc = pipWindow.document;
        const progressFill = doc.getElementById('progressFill');
        const elapsedTime = doc.getElementById('elapsedTime');
        const totalTime = doc.getElementById('totalTime');
        const progressBar = doc.getElementById('progressBar');
        if (!progressFill || !elapsedTime || !totalTime || !progressBar) return;

        const durationMs = getTrackDurationMs();
        const progressMs = Spicetify.Player.getProgress() || 0;

        if (!durationMs) {
            progressFill.style.width = '0%';
            elapsedTime.textContent = '0:00';
            totalTime.textContent = '0:00';
            return;
        }

        const ratio = Math.min(1, Math.max(0, progressMs / durationMs));
        progressFill.style.width = `${(ratio * 100).toFixed(2)}%`;
        elapsedTime.textContent = formatTime(progressMs);
        totalTime.textContent = formatTime(durationMs);
    }

    async function loadLyrics(uri) {
        if (!pipWindow || pipWindow.closed) return;

        const container = pipWindow.document.getElementById('lyricsContainer');
        if (!container) return;

        // Show loading
        container.innerHTML = '<div class="status-msg"><div class="spinner"></div></div>';

        // Fetch lyrics
        currentLyrics = await fetchLyrics(uri);

        if (!currentLyrics || !currentLyrics.lines?.length) {
            container.innerHTML = `
                <div class="status-msg">
                    <div class="icon">!</div>
                    <div class="text">No lyrics available</div>
                    <div class="subtext">Lyrics not found for this track</div>
                </div>
            `;
            return;
        }

        // Render lyrics
        const lyricsHtml = currentLyrics.lines
            .filter(line => line.text && line.text.trim())
            .map((line, idx) => 
                `<div class="lyric" data-time="${line.startTime}" data-idx="${idx}" style="font-size:${fontSize}px">${formatLyricHtml(line)}</div>`
            ).join('');

        container.innerHTML = lyricsHtml || `
            <div class="status-msg">
                <div class="icon">i</div>
                <div class="text">Instrumental</div>
            </div>
        `;
    }

    function updateCurrentLyric() {
        if (!pipWindow || pipWindow.closed || !currentLyrics?.synced) return;

        const doc = pipWindow.document;
        const currentTime = Spicetify.Player.getProgress();
        
        // Find active line
        let activeIdx = -1;
        const filteredLines = currentLyrics.lines.filter(l => l.text && l.text.trim());
        
        for (let i = filteredLines.length - 1; i >= 0; i--) {
            if (currentTime >= filteredLines[i].startTime) {
                activeIdx = i;
                break;
            }
        }

        // Update classes
        const lyrics = doc.querySelectorAll('.lyric');
        const isPlaying = Spicetify.Player.isPlaying();
        
        lyrics.forEach((el, idx) => {
            el.classList.remove('active', 'past');
            
            if (idx === activeIdx) {
                el.classList.add('active');
                // Only auto-scroll when playing, allow free scroll when paused
                if (isPlaying) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else if (idx < activeIdx) {
                el.classList.add('past');
            }
        });
    }

    function updatePipFontSize() {
        if (!pipWindow || pipWindow.closed) return;

        const lyrics = pipWindow.document.querySelectorAll('.lyric');
        lyrics.forEach(el => {
            el.style.fontSize = `${fontSize}px`;
        });
    }

    function startUpdateLoop() {
        if (updateIntervalId) clearInterval(updateIntervalId);
        
        updateIntervalId = setInterval(() => {
            if (!pipWindow || pipWindow.closed) {
                clearInterval(updateIntervalId);
                updateIntervalId = null;
                return;
            }
            
            updateCurrentLyric();
            updatePipPlayButton();
            updatePipLikeState();
            updatePipShuffleState();
            updatePipRepeatState();
            updatePipProgress();
        }, CONFIG.updateInterval);
    }

    // ==================== UTILITIES ====================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatLyricHtml(line) {
        if (!line?.translation) return escapeHtml(line?.text || '');
        const base = escapeHtml(line.text || '');
        const trans = escapeHtml(line.translation || '');
        return `${base}<br><span class="lyric-translation">${trans}</span>`;
    }

    function getTrackDurationMs() {
        const item = Spicetify.Player.data?.item;
        return (
            item?.duration?.milliseconds ??
            item?.duration_ms ??
            item?.duration ??
            Spicetify.Player.getDuration?.() ??
            0
        );
    }

    function formatTime(ms) {
        if (!ms || ms < 0) return '0:00';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // ==================== TOPBAR BUTTON ====================
    function createButton() {
        if (Spicetify.Topbar?.Button) {
            new Spicetify.Topbar.Button(
                'Lyric Miniplayer',
                `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    <path d="M19 3h-2v2h2v2h2V5h-2V3z" opacity="0.6"/>
                </svg>`,
                openPictureInPicture,
                false
            );
        }

    }

    // ==================== EVENT LISTENERS ====================
    Spicetify.Player.addEventListener('songchange', () => {
        updatePipContent();
    });

    Spicetify.Player.addEventListener('onplaypause', () => {
        updatePipPlayButton();
    });

    // ==================== INIT ====================
    createButton();
    
    console.log('[Lyric Miniplayer] Ready!');

})();

