// Lyric Miniplayer - Spicetify Extension
// Creates a floating Picture-in-Picture lyrics window that stays on top of all apps

(async function LyricsOverlay() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Wait for Spicetify to be fully loaded
    while (!Spicetify?.Player?.data || !Spicetify?.Platform || !Spicetify?.CosmosAsync) {
        await sleep(100);
    }

    // ==================== CONFIG ====================
    const CONFIG = {
        pipWidth: 280,
        pipHeight: 360,
        updateInterval: 100,
        fetchTimeoutMs: 8000,
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
            lightBg: 'linear-gradient(160deg, #f2f7f4 0%, #ecf6ef 40%, #e6f2ea 100%)',
            lightHeaderBg: 'rgba(232, 244, 236, 0.9)',
            lightControlsBg: 'rgba(232, 244, 236, 0.75)',
            lightFooterBg: 'rgba(232, 244, 236, 0.85)',
            lightSettingsBg: 'rgba(246, 250, 247, 0.98)',
            lightThemePickerBg: 'rgba(246, 250, 247, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #fff1f7 0%, #ffe7f1 40%, #ffddea 100%)',
            lightHeaderBg: 'rgba(255, 230, 242, 0.9)',
            lightControlsBg: 'rgba(255, 230, 242, 0.75)',
            lightFooterBg: 'rgba(255, 230, 242, 0.85)',
            lightSettingsBg: 'rgba(255, 244, 249, 0.98)',
            lightThemePickerBg: 'rgba(255, 244, 249, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #f7eef7 0%, #efe6f5 40%, #e9e0f0 100%)',
            lightHeaderBg: 'rgba(240, 228, 244, 0.9)',
            lightControlsBg: 'rgba(240, 228, 244, 0.75)',
            lightFooterBg: 'rgba(240, 228, 244, 0.85)',
            lightSettingsBg: 'rgba(248, 243, 250, 0.98)',
            lightThemePickerBg: 'rgba(248, 243, 250, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #eef6ff 0%, #e2f1ff 40%, #d6ebff 100%)',
            lightHeaderBg: 'rgba(224, 241, 255, 0.9)',
            lightControlsBg: 'rgba(224, 241, 255, 0.75)',
            lightFooterBg: 'rgba(224, 241, 255, 0.85)',
            lightSettingsBg: 'rgba(242, 249, 255, 0.98)',
            lightThemePickerBg: 'rgba(242, 249, 255, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #fff0f0 0%, #ffe5e5 40%, #ffdada 100%)',
            lightHeaderBg: 'rgba(255, 228, 228, 0.9)',
            lightControlsBg: 'rgba(255, 228, 228, 0.75)',
            lightFooterBg: 'rgba(255, 228, 228, 0.85)',
            lightSettingsBg: 'rgba(255, 246, 246, 0.98)',
            lightThemePickerBg: 'rgba(255, 246, 246, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #fff3ea 0%, #ffe8d8 40%, #ffdfc8 100%)',
            lightHeaderBg: 'rgba(255, 231, 216, 0.9)',
            lightControlsBg: 'rgba(255, 231, 216, 0.75)',
            lightFooterBg: 'rgba(255, 231, 216, 0.85)',
            lightSettingsBg: 'rgba(255, 247, 241, 0.98)',
            lightThemePickerBg: 'rgba(255, 247, 241, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #f3f0ff 0%, #ebe5ff 40%, #e2dcff 100%)',
            lightHeaderBg: 'rgba(234, 228, 255, 0.9)',
            lightControlsBg: 'rgba(234, 228, 255, 0.75)',
            lightFooterBg: 'rgba(234, 228, 255, 0.85)',
            lightSettingsBg: 'rgba(247, 244, 255, 0.98)',
            lightThemePickerBg: 'rgba(247, 244, 255, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #eefaf6 0%, #e2f7f0 40%, #d7f3ea 100%)',
            lightHeaderBg: 'rgba(226, 245, 239, 0.9)',
            lightControlsBg: 'rgba(226, 245, 239, 0.75)',
            lightFooterBg: 'rgba(226, 245, 239, 0.85)',
            lightSettingsBg: 'rgba(244, 252, 248, 0.98)',
            lightThemePickerBg: 'rgba(244, 252, 248, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #fff8ec 0%, #fff1d9 40%, #ffe9c5 100%)',
            lightHeaderBg: 'rgba(255, 239, 213, 0.9)',
            lightControlsBg: 'rgba(255, 239, 213, 0.75)',
            lightFooterBg: 'rgba(255, 239, 213, 0.85)',
            lightSettingsBg: 'rgba(255, 249, 238, 0.98)',
            lightThemePickerBg: 'rgba(255, 249, 238, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #fff0ff 0%, #ffe1ff 40%, #ffd4ff 100%)',
            lightHeaderBg: 'rgba(255, 224, 255, 0.9)',
            lightControlsBg: 'rgba(255, 224, 255, 0.75)',
            lightFooterBg: 'rgba(255, 224, 255, 0.85)',
            lightSettingsBg: 'rgba(255, 245, 255, 0.98)',
            lightThemePickerBg: 'rgba(255, 245, 255, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #f2f7ff 0%, #e7f0ff 40%, #dde8ff 100%)',
            lightHeaderBg: 'rgba(229, 240, 255, 0.9)',
            lightControlsBg: 'rgba(229, 240, 255, 0.75)',
            lightFooterBg: 'rgba(229, 240, 255, 0.85)',
            lightSettingsBg: 'rgba(246, 250, 255, 0.98)',
            lightThemePickerBg: 'rgba(246, 250, 255, 0.98)',
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
            lightBg: 'linear-gradient(160deg, #fff1f4 0%, #ffe3ea 40%, #ffd6e0 100%)',
            lightHeaderBg: 'rgba(255, 229, 236, 0.9)',
            lightControlsBg: 'rgba(255, 229, 236, 0.75)',
            lightFooterBg: 'rgba(255, 229, 236, 0.85)',
            lightSettingsBg: 'rgba(255, 246, 249, 0.98)',
            lightThemePickerBg: 'rgba(255, 246, 249, 0.98)',
        },
    };

    // ==================== I18N ====================
    const I18N = {
        en: {
            appTitle: 'Lyrics',
            settings: 'Settings',
            theme: 'Theme',
            appearance: 'Appearance',
            display: 'Display',
            general: 'General',
            lightMode: 'Light Mode',
            idleFade: 'Idle Fade',
            showLyrics: 'Show Lyrics',
            centerLyrics: 'Center Lyrics',
            progressBar: 'Progress Bar',
            controlsBar: 'Controls',
            shuffleButton: 'Shuffle Button',
            repeatButton: 'Repeat Button',
            likeButton: 'Like Button',
            closeButton: 'Close Button',
            fontSizeSlider: 'Font Size Slider',
            volumeSlider: 'Volume Slider',
            chooseTheme: 'Choose Theme',
            sizeLabel: 'Size',
            loading: 'Loading...',
            language: 'Language',
            languageAuto: 'Auto',
            languageEnglish: 'English',
            languageChinese: 'Chinese (Simplified)',
            languageChineseTraditional: 'Chinese (Traditional)',
            dragResize: 'Drag to resize',
            dragMove: 'Drag to move window',
            close: 'Close',
            shuffle: 'Shuffle',
            previous: 'Previous',
            playPause: 'Play/Pause',
            next: 'Next',
            repeatOff: 'Repeat Off',
            repeatAll: 'Repeat All',
            repeatOne: 'Repeat One',
            saveLiked: 'Save to Liked Songs',
            back: 'Back',
            noLyrics: 'No lyrics available',
            lyricsNotFound: 'Lyrics not found for this track',
            instrumental: 'Instrumental',
            openFail: 'Could not open lyrics window.',
            unknown: 'Unknown',
        },
        zh: {
            appTitle: '歌词',
            settings: '设置',
            theme: '主题',
            appearance: '外观',
            display: '显示',
            general: '通用',
            lightMode: '浅色模式',
            idleFade: '空闲淡出',
            showLyrics: '显示歌词',
            centerLyrics: '居中歌词',
            progressBar: '进度条',
            controlsBar: '控制区',
            shuffleButton: '随机播放按钮',
            repeatButton: '循环按钮',
            likeButton: '喜欢按钮',
            closeButton: '关闭按钮',
            fontSizeSlider: '字号滑块',
            volumeSlider: '音量滑块',
            chooseTheme: '选择主题',
            sizeLabel: '大小',
            loading: '加载中...',
            language: '语言',
            languageAuto: '自动',
            languageEnglish: '英语',
            languageChinese: '简体中文',
            languageChineseTraditional: '繁体中文',
            dragResize: '拖拽调整大小',
            dragMove: '拖拽移动窗口',
            close: '关闭',
            shuffle: '随机播放',
            previous: '上一首',
            playPause: '播放/暂停',
            next: '下一首',
            repeatOff: '关闭循环',
            repeatAll: '列表循环',
            repeatOne: '单曲循环',
            saveLiked: '保存到喜欢的歌曲',
            back: '返回',
            noLyrics: '暂无歌词',
            lyricsNotFound: '未找到该曲目歌词',
            instrumental: '纯音乐',
            openFail: '无法打开歌词窗口。',
            unknown: '未知',
        },
        'zh-TW': {
            appTitle: '歌詞',
            settings: '設定',
            theme: '主題',
            appearance: '外觀',
            display: '顯示',
            general: '一般',
            lightMode: '淺色模式',
            idleFade: '閒置淡出',
            showLyrics: '顯示歌詞',
            centerLyrics: '置中歌詞',
            progressBar: '進度條',
            controlsBar: '控制列',
            shuffleButton: '隨機播放按鈕',
            repeatButton: '循環按鈕',
            likeButton: '喜歡按鈕',
            closeButton: '關閉按鈕',
            fontSizeSlider: '字體大小滑桿',
            volumeSlider: '音量滑桿',
            chooseTheme: '選擇主題',
            sizeLabel: '大小',
            loading: '載入中...',
            language: '語言',
            languageAuto: '自動',
            languageEnglish: '英文',
            languageChinese: '簡體中文',
            languageChineseTraditional: '繁體中文',
            dragResize: '拖曳調整大小',
            dragMove: '拖曳移動視窗',
            close: '關閉',
            shuffle: '隨機播放',
            previous: '上一首',
            playPause: '播放/暫停',
            next: '下一首',
            repeatOff: '關閉循環',
            repeatAll: '清單循環',
            repeatOne: '單曲循環',
            saveLiked: '儲存到喜歡的歌曲',
            back: '返回',
            noLyrics: '暫無歌詞',
            lyricsNotFound: '未找到該曲目歌詞',
            instrumental: '純音樂',
            openFail: '無法打開歌詞視窗。',
            unknown: '未知',
        },
    };

    const LANGUAGE_OPTIONS = [
        { value: 'auto', labelKey: 'languageAuto' },
        { value: 'en', labelKey: 'languageEnglish' },
        { value: 'zh', labelKey: 'languageChinese' },
        { value: 'zh-TW', labelKey: 'languageChineseTraditional' },
    ];

    const STORAGE_KEYS = {
        language: 'lyrics-overlay-language',
        fontSize: 'lyrics-overlay-fontsize',
        showFont: 'lyrics-overlay-showfont',
        showVol: 'lyrics-overlay-showvol',
        showLyrics: 'lyrics-overlay-showlyrics',
        showShuffle: 'lyrics-overlay-showshuffle',
        showRepeat: 'lyrics-overlay-showrepeat',
        showLike: 'lyrics-overlay-showlike',
        showClose: 'lyrics-overlay-showclose',
        showProgress: 'lyrics-overlay-showprogress',
        showControls: 'lyrics-overlay-showcontrols',
        centerLyrics: 'lyrics-overlay-centerlyrics',
        idleDelay: 'lyrics-overlay-idledelay',
        colorMode: 'lyrics-overlay-colormode',
        theme: 'lyrics-overlay-theme',
    };

    const storage = createStorage();

    function createStorage() {
        const api = Spicetify?.LocalStorage;
        if (api && typeof api.get === 'function' && typeof api.set === 'function') {
            return {
                get: api.get.bind(api),
                set: api.set.bind(api),
                remove: api.remove ? api.remove.bind(api) : () => {},
            };
        }
        return {
            get: (key) => localStorage.getItem(key),
            set: (key, value) => localStorage.setItem(key, value),
            remove: (key) => localStorage.removeItem(key),
        };
    }

    function safeGet(key) {
        try {
            return storage.get(key);
        } catch (e) {
            return null;
        }
    }

    function safeSet(key, value) {
        try {
            storage.set(key, String(value));
        } catch (e) {}
    }

    function getStoredBool(key, fallback) {
        const raw = safeGet(key);
        if (raw === null || raw === undefined) return fallback;
        if (typeof raw === 'boolean') return raw;
        return raw === 'true';
    }

    function getStoredInt(key, fallback) {
        const raw = safeGet(key);
        const parsed = parseInt(raw, 10);
        return Number.isNaN(parsed) ? fallback : parsed;
    }

    function withIds(doc, ids) {
        return Object.fromEntries(ids.map((id) => [id, doc.getElementById(id)]));
    }

    function setHidden(el, hidden) {
        if (!el) return;
        el.classList.toggle('hidden', hidden);
    }

    function setCollapsed(el, collapsed) {
        if (!el) return;
        el.classList.toggle('collapsed', collapsed);
    }

    function setToggleState(toggle, on) {
        if (!toggle) return;
        toggle.classList.toggle('on', on);
        toggle.setAttribute('aria-checked', on ? 'true' : 'false');
    }

    function setAriaExpanded(el, expanded) {
        if (!el) return;
        el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    function setAriaHidden(el, hidden) {
        if (!el) return;
        el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    }

    function bindToggle({ item, toggle, get, set, apply, storageKey }) {
        if (!item || !toggle) return;
        item.onclick = () => {
            const next = !get();
            set(next);
            setToggleState(toggle, next);
            if (apply) apply(next);
            if (storageKey) safeSet(storageKey, next);
        };
    }

    function getPipUi() {
        if (!pipWindow || pipWindow.closed || !pipUi) return null;
        return pipUi;
    }

    function on(el, event, handler) {
        if (!el) return;
        el.addEventListener(event, handler);
    }

    function onClick(el, handler) {
        if (!el) return;
        el.onclick = handler;
    }

    function bindDragScroll(container, doc, options = {}) {
        if (!container || !doc) return;
        const { ignoreSelector } = options;
        let active = false;
        let startY = 0;
        let startScroll = 0;
        let prevUserSelect = '';

        on(container, 'mousedown', (e) => {
            if (e.button !== 0) return;
            if (ignoreSelector && e.target.closest(ignoreSelector)) return;
            active = true;
            startY = e.clientY;
            startScroll = container.scrollTop;
            prevUserSelect = doc.body.style.userSelect || '';
            doc.body.style.userSelect = 'none';
        });

        on(doc, 'mousemove', (e) => {
            if (!active) return;
            const delta = e.clientY - startY;
            container.scrollTop = startScroll - delta;
        });

        const stop = () => {
            if (!active) return;
            active = false;
            doc.body.style.userSelect = prevUserSelect;
        };

        on(doc, 'mouseup', stop);
        on(container, 'mouseleave', stop);
    }

    function resolveLanguage(raw) {
        const normalized = (raw || '').toLowerCase();
        if (normalized === 'zh-tw' || normalized.startsWith('zh-tw')) return 'zh-TW';
        if (normalized === 'zh-hant' || normalized.startsWith('zh-hant')) return 'zh-TW';
        if (normalized === 'zh-hk' || normalized.startsWith('zh-hk')) return 'zh-TW';
        if (normalized === 'zh-mo' || normalized.startsWith('zh-mo')) return 'zh-TW';
        if (normalized.startsWith('zh')) return 'zh';
        return 'en';
    }

    function detectLanguage() {
        const sessionLocale = Spicetify?.Platform?.Session?.locale;
        if (sessionLocale) return resolveLanguage(sessionLocale);
        if (typeof navigator !== 'undefined' && navigator.language) {
            return resolveLanguage(navigator.language);
        }
        return 'en';
    }

    let languageSetting = 'auto';
    let language = 'en';
    try {
        const savedLanguage = safeGet(STORAGE_KEYS.language);
        if (savedLanguage) languageSetting = savedLanguage;
    } catch (e) {}

    function applyLanguageSetting(setting) {
        languageSetting = setting;
        const resolved = setting === 'auto' ? detectLanguage() : resolveLanguage(setting);
        language = I18N[resolved] ? resolved : 'en';
    }

    applyLanguageSetting(languageSetting);

    function t(key) {
        return (I18N[language] && I18N[language][key]) || I18N.en[key] || key;
    }

    // ==================== STATE ====================
    let pipWindow = null;
    let pipUi = null;
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
    let showProgressBar = true;
    let showControls = true;
    let centerLyrics = true;
    let currentTheme = 'spotify';
    let colorMode = 'dark';
    let idleDelayMs = 2000;
    let pendingRepeatMode = null;
    let pendingRepeatAt = 0;
    const REPEAT_PENDING_MS = 1000;
    let lyricsStatus = null;
    let spinnerActive = false;
    let initialScrollPending = false;
    let lyricsRequestId = 0;
    let currentLyricsFilteredLines = [];
    let currentLyricElements = [];
    let lastActiveLyricIndex = -1;
    let lastIsPlaying = null;
    let lastShuffle = null;
    let lastRepeatMode = null;
    let lastIsLiked = null;
    let lastVolume = null;
    let lastProgressSecond = null;
    let lastProgressRatio = null;

    // Load saved settings
    try {
        const savedSize = getStoredInt(STORAGE_KEYS.fontSize, fontSize);
        fontSize = savedSize;

        showFontSlider = getStoredBool(STORAGE_KEYS.showFont, showFontSlider);
        showVolumeSlider = getStoredBool(STORAGE_KEYS.showVol, showVolumeSlider);
        showLyrics = getStoredBool(STORAGE_KEYS.showLyrics, showLyrics);
        showShuffleBtn = getStoredBool(STORAGE_KEYS.showShuffle, showShuffleBtn);
        showRepeatBtn = getStoredBool(STORAGE_KEYS.showRepeat, showRepeatBtn);
        showLikeBtn = getStoredBool(STORAGE_KEYS.showLike, showLikeBtn);
        showCloseBtn = getStoredBool(STORAGE_KEYS.showClose, showCloseBtn);
        showProgressBar = getStoredBool(STORAGE_KEYS.showProgress, showProgressBar);
        showControls = getStoredBool(STORAGE_KEYS.showControls, showControls);
        centerLyrics = getStoredBool(STORAGE_KEYS.centerLyrics, centerLyrics);

        const parsedIdle = getStoredInt(STORAGE_KEYS.idleDelay, idleDelayMs);
        if (!Number.isNaN(parsedIdle)) idleDelayMs = Math.min(30000, Math.max(500, parsedIdle));

        const savedColorMode = safeGet(STORAGE_KEYS.colorMode);
        if (savedColorMode === 'light' || savedColorMode === 'dark') colorMode = savedColorMode;
        const savedTheme = safeGet(STORAGE_KEYS.theme);
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
            settingsBg: base.lightBg || base.lightSettingsBg || 'rgba(248, 248, 251, 0.98)',
            themePickerBg: base.lightBg || base.lightThemePickerBg || 'rgba(248, 248, 251, 0.98)',
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
            --settings-bg: ${t.settingsBg || t.bg || 'rgba(10, 10, 15, 0.98)'};
            --theme-picker-bg: ${t.themePickerBg || t.bg || 'rgba(8, 8, 12, 0.98)'};
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
            cursor: default;
        }

        button, select, option, input, textarea {
            cursor: default;
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

        .overlay.settings-open {
            pointer-events: auto;
        }

        .overlay.settings-open .header,
        .overlay.settings-open .resize-handle {
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        /* Resize Handle at Top - Subtle */
        .resize-handle {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            cursor: default;
            z-index: 3;
            -webkit-app-region: drag !important;
            app-region: drag !important;
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
            cursor: default;
            user-select: none;
            -webkit-app-region: drag !important;
            app-region: drag !important;
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
            cursor: default;
            opacity: var(--menu-btn-opacity);
            transition: opacity 0.15s;
            background: none;
            border: none;
        }

        .menu-btn svg {
            width: 12px;
            height: 12px;
            fill: currentColor;
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
            cursor: default;
            padding: 2px 4px;
            transition: all 0.15s;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .close-btn svg {
            width: 12px;
            height: 12px;
            fill: currentColor;
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
            overflow: hidden;
            overscroll-behavior: contain;
        }

        .settings-content,
        .settings-content * {
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        .settings-content::-webkit-scrollbar,
        .theme-grid::-webkit-scrollbar {
            width: 0;
            height: 0;
            display: none;
        }

        .settings-content::-webkit-scrollbar-track,
        .theme-grid::-webkit-scrollbar-track {
            background: transparent;
        }

        .settings-content::-webkit-scrollbar-thumb,
        .theme-grid::-webkit-scrollbar-thumb {
            background: var(--surface-2);
            border-radius: 999px;
            border: 2px solid transparent;
            background-clip: padding-box;
        }

        .settings-content::-webkit-scrollbar-thumb:hover,
        .theme-grid::-webkit-scrollbar-thumb:hover {
            background: var(--surface-4);
            background-clip: padding-box;
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
            padding: 10px 12px;
            border-bottom: 1px solid var(--border-strong);
            flex-shrink: 0;
            position: sticky;
            top: 0;
            z-index: 2;
            background: var(--settings-bg);
            cursor: default;
        }

        .settings-drag-handle {
            position: sticky;
            top: 0;
            height: 10px;
            cursor: default;
            z-index: 3;
        }

        .settings-header,
        .settings-header * {
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        .settings-header:active {
            cursor: default;
        }

        .settings-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text);
        }

        .settings-close {
            background: var(--surface-4);
            border: none;
            color: var(--text);
            width: 26px;
            height: 26px;
            border-radius: 6px;
            cursor: default;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        .settings-close svg {
            width: 12px;
            height: 12px;
            fill: currentColor;
        }

        .settings-close:hover {
            background: var(--surface-5);
        }

        .settings-content {
            flex: 1;
            padding: 12px;
            overflow-y: auto;
            scrollbar-gutter: stable;
            scrollbar-width: none;
            pointer-events: auto;
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        .theme-grid {
            scrollbar-width: none;
        }

        .menu-section-title {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 6px;
            margin-top: 10px;
        }

        .menu-section-title:first-child {
            margin-top: 0;
        }

        .menu-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            cursor: default;
            transition: background 0.1s;
            background: var(--surface-3);
            border-radius: 8px;
            margin-bottom: 6px;
        }

        .menu-item:hover {
            background: var(--surface-2);
        }

        .menu-item-label {
            font-size: 12px;
            color: var(--text);
        }

        .menu-toggle {
            width: 36px;
            height: 20px;
            background: var(--surface-2);
            border-radius: 10px;
            position: relative;
            transition: background 0.2s;
            cursor: default;
        }

        .menu-toggle.on {
            background: var(--accent);
        }

        .menu-toggle::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: var(--toggle-knob);
            border-radius: 50%;
            transition: transform 0.2s;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .menu-toggle.on::after {
            transform: translateX(16px);
        }

        .menu-divider {
            height: 1px;
            background: var(--border-strong);
            margin: 10px 0;
        }

        /* Theme Button */
        .theme-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 8px 10px;
            background: var(--surface-3);
            border: none;
            border-radius: 8px;
            cursor: default;
            transition: background 0.15s;
        }

        .theme-btn:hover {
            background: var(--surface-2);
        }

        .theme-btn-info {
            flex: 1;
            text-align: left;
        }

        .theme-btn-label {
            font-size: 9px;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .theme-btn-name {
            font-size: 12px;
            font-weight: 500;
            color: var(--text);
        }

        .theme-btn-arrow {
            color: var(--text-dim);
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .theme-btn-arrow svg {
            width: 12px;
            height: 12px;
            fill: currentColor;
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
            overflow: hidden;
            overscroll-behavior: contain;
        }

        .theme-grid,
        .theme-grid * {
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        .theme-picker-header,
        .theme-picker-header * {
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        .theme-picker-back {
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        .theme-picker.open {
            display: flex;
            animation: panelSlide 0.2s ease;
        }

        .theme-picker-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 10px;
            border-bottom: 1px solid var(--border-strong);
            flex-shrink: 0;
            position: sticky;
            top: 0;
            z-index: 2;
            background: var(--theme-picker-bg);
        }

        .theme-drag-handle {
            position: sticky;
            top: 0;
            height: 10px;
            cursor: default;
            z-index: 3;
        }

        .theme-picker-back {
            background: var(--surface-4);
            border: none;
            color: var(--text);
            width: 24px;
            height: 24px;
            border-radius: 6px;
            cursor: default;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
        }

        .theme-picker-back svg {
            width: 12px;
            height: 12px;
            fill: currentColor;
        }

        .theme-picker-back:hover {
            background: var(--surface-5);
        }

        .theme-picker-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--text);
        }

        .theme-grid {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            align-content: start;
            scrollbar-gutter: stable;
            scrollbar-width: none;
            pointer-events: auto;
            -webkit-app-region: no-drag !important;
            app-region: no-drag !important;
        }

        body[data-color-mode="dark"] .theme-grid {
            scrollbar-width: none;
        }

        .theme-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
            padding: 8px 10px;
            cursor: default;
            transition: all 0.15s;
            font-size: 12px;
            color: var(--text-muted);
            border-radius: 6px;
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

        .theme-swatch {
            position: relative;
            width: 36px;
            height: 20px;
            border-radius: 6px;
            border: 1px solid var(--border-strong);
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
            overflow: hidden;
            flex-shrink: 0;
        }

        .theme-swatch-light {
            position: absolute;
            right: 0;
            top: 0;
            width: 50%;
            height: 100%;
            border-left: 1px solid rgba(0, 0, 0, 0.08);
            opacity: 0.95;
        }

        .theme-accent {
            position: absolute;
            right: 3px;
            bottom: 3px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
        }

        .theme-name { 
            font-weight: 500; 
            text-align: left;
            line-height: 1.2;
            flex: 1;
        }

        .menu-item-select {
            cursor: default;
        }

        .menu-select {
            background: var(--surface-2);
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 4px 8px;
            font-size: 12px;
            min-width: 120px;
            outline: none;
        }

        .menu-select:focus {
            border-color: var(--accent);
        }

        .menu-action {
            display: none;
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

        .controls.hidden {
            display: none;
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
            cursor: default;
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

        .lyrics-wrap.centered::before,
        .lyrics-wrap.centered::after {
            content: '';
            display: block;
            height: 35%;
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
            cursor: default;
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
            min-height: 0;
            text-align: center;
            padding: 20px;
            opacity: var(--status-opacity);
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;
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
            display: inline-block;
            width: 32px;
            height: 32px;
            border: 3px solid var(--surface-2);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: none;
            transform-origin: 50% 50%;
            will-change: transform;
        }

        .spinner.spinning {
            animation: spin 0.7s linear infinite;
        }

        @-webkit-keyframes spin {
            to { transform: rotate(360deg); }
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

        .progress-row.hidden {
            display: none;
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
            cursor: default;
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
            cursor: default;
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
            cursor: default;
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

    function yieldToUi() {
        return new Promise(resolve => {
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(() => setTimeout(resolve, 0));
            } else {
                setTimeout(resolve, 0);
            }
        });
    }

    async function fetchWithTimeout(url, options = {}, timeoutMs = CONFIG.fetchTimeoutMs) {
        const controller = new AbortController();
        const { signal: _signal, ...rest } = options || {};
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            return await fetch(url, { ...rest, signal: controller.signal });
        } finally {
            clearTimeout(timer);
        }
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
            const advanceResp = await fetchWithTimeout(advanceUrl);
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
            const singleResp = await fetchWithTimeout(singleUrl);
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
            const resp = await fetchWithTimeout(url, { headers: { 'Accept': 'application/json' } });
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
            const searchResp = await fetchWithTimeout(searchUrl);
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
            const lyricResp = await fetchWithTimeout(lyricUrl);
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
            const searchResp = await fetchWithTimeout(searchUrl);
            if (!searchResp.ok) return null;
            const searchJson = await searchResp.json();
            const id = searchJson?.data?.id;
            if (!id) return null;

            const lyricUrl = `${FALLBACK_LYRICS_APIS.vkeysBase}/v2/music/netease/lyric?id=${encodeURIComponent(
                id
            )}`;
            const lyricResp = await fetchWithTimeout(lyricUrl);
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
            const searchResp = await fetchWithTimeout(searchUrl, { headers: { 'Accept': 'application/json' } });
            if (!searchResp.ok) return null;
            const searchJson = await searchResp.json();
            const songs = searchJson?.result?.songs;
            const pick = Array.isArray(songs) ? songs[0] : null;
            const id = pick?.id;
            if (!id) return null;

            const lyricUrl = `${FALLBACK_LYRICS_APIS.neteaseOfficialBase}/song/lyric?os=pc&id=${encodeURIComponent(
                id
            )}&lv=-1&tv=-1`;
            const lyricResp = await fetchWithTimeout(lyricUrl, { headers: { 'Accept': 'application/json' } });
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
            const searchResp = await fetchWithTimeout(searchUrl);
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
                const lyricResp = await fetchWithTimeout(lyricUrl);
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

            await yieldToUi();
            // Method 4: More Lyrics API
            const moreLyrics = await fetchMoreLyrics(meta);
            if (moreLyrics?.lines?.length) return moreLyrics;

            await yieldToUi();
            // Method 5: LRC.cx API
            const lrcCxLyrics = await fetchLrcCxLyrics(meta);
            if (lrcCxLyrics?.lines?.length) return lrcCxLyrics;

            await yieldToUi();
            // Method 6: NetEase Official API
            const neteaseOfficialLyrics = await fetchNeteaseOfficialLyrics(meta);
            if (neteaseOfficialLyrics?.lines?.length) return neteaseOfficialLyrics;

            await yieldToUi();
            // Method 7: QQ Music (vkeys.cn)
            const qqLyrics = await fetchVkeysQqLyrics(meta);
            if (qqLyrics?.lines?.length) return qqLyrics;

            await yieldToUi();
            // Method 8: NetEase (vkeys.cn)
            const neteaseLyrics = await fetchVkeysNeteaseLyrics(meta);
            if (neteaseLyrics?.lines?.length) return neteaseLyrics;

            await yieldToUi();
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
            pipUi = null;
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
                Spicetify.showNotification(t('openFail'), true);
            }
        } catch (err) {
            console.error('[Lyric Miniplayer] Fallback popup failed:', err);
            Spicetify.showNotification(t('openFail'), true);
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
                <span class="theme-swatch" style="background: ${theme.bg};">
                    <span class="theme-swatch-light" style="background: ${theme.lightBg || theme.bg};"></span>
                    <span class="theme-accent" style="background: ${theme.accent};"></span>
                </span>
                <span class="theme-name">${theme.name}</span>
            </div>`
        ).join('');
    }

    function generateLanguageOptions() {
        return LANGUAGE_OPTIONS.map(option => {
            const label = t(option.labelKey);
            const selected = option.value === languageSetting ? 'selected' : '';
            return `<option value="${option.value}" ${selected}>${label}</option>`;
        }).join('');
    }

    const ICONS = {
        shuffle: `<svg viewBox="0 0 16 16" id="shuffleIcon"><path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06l2.306-2.306a.75.75 0 0 0 0-1.06L13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"/><path d="m7.5 10.723.98-1.167 1.796 2.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.306 2.306a.75.75 0 0 1 0 1.06l-2.306 2.306a.75.75 0 1 1-1.06-1.06L14.109 14H12.16a3.75 3.75 0 0 1-2.873-1.34l-1.787-2.14z"/></svg>`,
        prev: `<svg viewBox="0 0 16 16"><path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"/></svg>`,
        play: `<svg viewBox="0 0 16 16" id="playIcon"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/></svg>`,
        next: `<svg viewBox="0 0 16 16"><path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"/></svg>`,
        repeat: `<svg viewBox="0 0 16 16" id="repeatIcon"><path d="M11.17 3.5H5.5A2.5 2.5 0 0 0 3 6v1.25a.75.75 0 0 1-1.5 0V6A4 4 0 0 1 5.5 2h5.67l-.9-.9a.75.75 0 1 1 1.06-1.06l2.18 2.18a.75.75 0 0 1 0 1.06l-2.18 2.18a.75.75 0 1 1-1.06-1.06l.9-.9zM4.83 12.5H10.5A2.5 2.5 0 0 0 13 10V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-4 4H4.83l.9.9a.75.75 0 1 1-1.06 1.06L2.5 13.78a.75.75 0 0 1 0-1.06l2.18-2.18a.75.75 0 1 1 1.06 1.06l-.9.9z"/></svg>`,
        like: `<svg viewBox="0 0 16 16" id="likeIcon"><path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"/></svg>`,
        close: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 0 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/></svg>`,
        back: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.9 3.3a.75.75 0 0 1 1.06 0l.53.53-2.6 2.6H13a.75.75 0 0 1 0 1.5H5.89l2.6 2.6-.53.53a.75.75 0 1 1-1.06-1.06L2.5 8l4.4-4.7z"/></svg>`,
        chevron: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06L9.44 8 6 4.56a.75.75 0 0 1 0-1.06z"/></svg>`,
        menu: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3.5h12a.75.75 0 0 1 0 1.5H2a.75.75 0 1 1 0-1.5zm0 4h12a.75.75 0 0 1 0 1.5H2a.75.75 0 1 1 0-1.5zm0 4h12a.75.75 0 0 1 0 1.5H2a.75.75 0 1 1 0-1.5z"/></svg>`,
    };

    function setupPipWindow(win) {
        const doc = win.document;
        const currentVolume = Math.round((Spicetify.Player.getVolume() || 0) * 100);

        const hiddenClass = (visible) => (visible ? '' : 'hidden');
        const collapsedClass = (expanded) => (expanded ? '' : 'collapsed');
        const toggleItem = (itemId, labelId, labelKey, toggleId, isOn) => `
            <div class="menu-item" id="${itemId}" aria-label="${t(labelKey)}">
                <span class="menu-item-label" id="${labelId}">${t(labelKey)}</span>
                <div class="menu-toggle ${isOn ? 'on' : ''}" id="${toggleId}" role="switch" aria-checked="${isOn ? 'true' : 'false'}"></div>
            </div>
        `;
        const controlButton = (id, titleKey, svg, extraClass = '') => `
            <button class="ctrl-btn ${extraClass}" id="${id}" title="${t(titleKey)}" aria-label="${t(titleKey)}">
                ${svg}
            </button>
        `;


        const buildHeader = () => `
        <div class="resize-handle" id="resizeHandle" title="${t('dragResize')}" aria-label="${t('dragResize')}"></div>
        <div class="header" id="dragHeader" title="${t('dragMove')}" aria-label="${t('dragMove')}">
            <div class="track-info">
                <div class="track-line" id="trackLine" data-loading="true">${t('loading')}</div>
            </div>
            <div class="header-btns">
                <button class="menu-btn" id="menuBtn" title="${t('settings')}" aria-label="${t('settings')}" aria-expanded="false">
                    ${ICONS.menu}
                </button>
                <button class="close-btn ${hiddenClass(showCloseBtn)}" id="closeBtn" title="${t('close')}" aria-label="${t('close')}">${ICONS.close}</button>
            </div>
        </div>
        `;

        const buildSettingsPanel = () => `
        <div class="settings-panel" id="settingsPanel" role="dialog" aria-label="${t('settings')}" aria-hidden="true">
            <div class="settings-drag-handle" id="settingsDragHandle"></div>
            <div class="settings-header" id="settingsHeader">
                <span class="settings-title" id="settingsTitle">${t('settings')}</span>
                <button class="settings-close" id="settingsClose" title="${t('close')}" aria-label="${t('close')}">${ICONS.close}</button>
            </div>
            <div class="settings-content">
                <button class="theme-btn" id="openThemePicker" title="${t('chooseTheme')}" aria-label="${t('chooseTheme')}">
                    <div class="theme-btn-info">
                        <div class="theme-btn-label" id="themeBtnLabel">${t('theme')}</div>
                        <div class="theme-btn-name" id="currentThemeName">${THEMES[currentTheme].name}</div>
                    </div>
                    <span class="theme-btn-arrow">${ICONS.chevron}</span>
                </button>

                <div class="menu-section-title" id="generalTitle">${t('general')}</div>
                <div class="menu-item menu-item-select" id="languageItem">
                    <span class="menu-item-label" id="languageLabel">${t('language')}</span>
                    <select class="menu-select" id="languageSelect" aria-label="${t('language')}">
                        ${generateLanguageOptions()}
                    </select>
                </div>

                <div class="menu-divider"></div>

                <div class="menu-section-title" id="appearanceTitle">${t('appearance')}</div>
                <div class="menu-item" id="toggleModeItem" aria-label="${t('lightMode')}">
                    <span class="menu-item-label" id="toggleModeLabel">${t('lightMode')}</span>
                    <div class="menu-toggle ${colorMode === 'light' ? 'on' : ''}" id="toggleMode" role="switch" aria-checked="${colorMode === 'light' ? 'true' : 'false'}"></div>
                </div>
                <div class="menu-item" id="idleDelayItem">
                    <span class="menu-item-label" id="idleDelayLabel">${t('idleFade')}</span>
                    <div class="idle-row">
                        <input type="range" class="slider" id="idleDelaySlider" min="500" max="10000" step="250" value="${idleDelayMs}" aria-label="${t('idleFade')}">
                        <span class="value-display" id="idleDelayValue">${(idleDelayMs / 1000).toFixed(1)}s</span>
                    </div>
                </div>

                <div class="menu-section-title" id="displayTitle">${t('display')}</div>
                ${toggleItem('toggleLyricsItem', 'toggleLyricsLabel', 'showLyrics', 'toggleLyrics', showLyrics)}
                ${toggleItem('toggleCenterItem', 'toggleCenterLabel', 'centerLyrics', 'toggleCenter', centerLyrics)}
                ${toggleItem('toggleShuffleItem', 'toggleShuffleLabel', 'shuffleButton', 'toggleShuffle', showShuffleBtn)}
                ${toggleItem('toggleRepeatItem', 'toggleRepeatLabel', 'repeatButton', 'toggleRepeat', showRepeatBtn)}
                ${toggleItem('toggleLikeItem', 'toggleLikeLabel', 'likeButton', 'toggleLike', showLikeBtn)}
                ${toggleItem('toggleCloseItem', 'toggleCloseLabel', 'closeButton', 'toggleClose', showCloseBtn)}
                ${toggleItem('toggleFontItem', 'toggleFontLabel', 'fontSizeSlider', 'toggleFont', showFontSlider)}
                ${toggleItem('toggleVolItem', 'toggleVolLabel', 'volumeSlider', 'toggleVol', showVolumeSlider)}
                ${toggleItem('toggleProgressItem', 'toggleProgressLabel', 'progressBar', 'toggleProgress', showProgressBar)}
                ${toggleItem('toggleControlsItem', 'toggleControlsLabel', 'controlsBar', 'toggleControls', showControls)}
            </div>
        </div>
        `;

        const buildThemePicker = () => `
        <div class="theme-picker" id="themePicker" role="dialog" aria-label="${t('chooseTheme')}" aria-hidden="true">
            <div class="theme-drag-handle" id="themePickerDragHandle"></div>
            <div class="theme-picker-header" id="themePickerHeader">
                <button class="theme-picker-back" id="themePickerBack" title="${t('back')}" aria-label="${t('back')}">${ICONS.back}</button>
                <span class="theme-picker-title" id="themePickerTitle">${t('chooseTheme')}</span>
            </div>
            <div class="theme-grid" id="themeGrid">
                ${generateThemeMenuItems()}
            </div>
        </div>
        `;

        const buildFooter = () => `
        <div class="footer" id="footer">
            <div class="footer-row ${collapsedClass(showFontSlider)}" id="fontRow">
                <span class="control-label" id="fontSizeLabel">${t('sizeLabel')}</span>
                <input type="range" class="slider" id="fontSlider" min="${CONFIG.minFontSize}" max="${CONFIG.maxFontSize}" value="${fontSize}" aria-label="${t('fontSizeSlider')}">
                <span class="value-display" id="fontValue">${fontSize}px</span>
            </div>
            <div class="footer-row ${collapsedClass(showVolumeSlider)}" id="volumeRow">
                <div id="volumeIconWrap" aria-label="${t('volumeSlider')}">
                    ${getVolumeIconSvg(currentVolume)}
                </div>
                <input type="range" class="slider" id="volumeSlider" min="0" max="100" value="${currentVolume}" aria-label="${t('volumeSlider')}">
                <span class="value-display" id="volumePercent">${currentVolume}%</span>
            </div>
        </div>
        `;

        const buildProgressRow = () => `
        <div class="progress-row ${hiddenClass(showProgressBar)}" id="progressRow">
            <span class="progress-time" id="elapsedTime">0:00</span>
            <div class="progress-bar" id="progressBar" aria-label="${t('progressBar')}">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <span class="progress-time" id="totalTime">0:00</span>
        </div>
        `;

        const buildControls = () => `
        <div class="controls ${hiddenClass(showControls)}">
            <div class="controls-group side left"></div>
            <div class="controls-group center">
                ${controlButton('shuffleBtn', 'shuffle', ICONS.shuffle, hiddenClass(showShuffleBtn))}
                ${controlButton('prevBtn', 'previous', ICONS.prev)}
                ${controlButton('playBtn', 'playPause', ICONS.play, 'play-btn')}
                ${controlButton('nextBtn', 'next', ICONS.next)}
                ${controlButton('repeatBtn', 'repeatOff', ICONS.repeat, hiddenClass(showRepeatBtn))}
            </div>
            <div class="controls-group side right">
                ${controlButton('likeBtn', 'saveLiked', ICONS.like, hiddenClass(showLikeBtn))}
            </div>
        </div>
        `;

        const buildHtml = () => `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t('appTitle')}</title>
    <style id="themeStyles">${generateStyles(currentTheme, colorMode)}</style>
</head>
<body data-color-mode="${colorMode}">
    <div class="lyrics-wrap ${showLyrics ? '' : 'collapsed'} ${centerLyrics ? 'centered' : ''}" id="lyricsContainer" role="list">
        <div class="status-msg">
            <div class="spinner"></div>
        </div>
    </div>

    <div class="overlay" id="chrome">
        ${buildHeader()}
        ${buildSettingsPanel()}
        ${buildThemePicker()}
        <div class="overlay-spacer"></div>
        ${buildFooter()}
        ${buildProgressRow()}
        ${buildControls()}
    </div>
</body>
</html>`;

        // Build the HTML
        const Templates = {
            header: buildHeader,
            settingsPanel: buildSettingsPanel,
            themePicker: buildThemePicker,
            footer: buildFooter,
            progressRow: buildProgressRow,
            controls: buildControls,
            html: buildHtml,
        };

        doc.write(Templates.html());
        doc.close();

        // Get elements
        const ui = {
            doc,
            ...withIds(doc, [
                'menuBtn',
                'settingsPanel',
                'settingsDragHandle',
                'settingsHeader',
                'settingsClose',
                'settingsTitle',
                'themeBtnLabel',
                'generalTitle',
                'languageLabel',
                'languageSelect',
                'appearanceTitle',
                'displayTitle',
                'toggleModeLabel',
                'idleDelayLabel',
                'toggleLyricsLabel',
                'toggleCenterLabel',
                'toggleProgressLabel',
                'toggleControlsLabel',
                'toggleShuffleLabel',
                'toggleRepeatLabel',
                'toggleLikeLabel',
                'toggleCloseLabel',
                'toggleFontLabel',
                'toggleVolLabel',
                'prevBtn',
                'playBtn',
                'playIcon',
                'nextBtn',
                'shuffleBtn',
                'repeatBtn',
                'likeBtn',
                'fontSlider',
                'fontValue',
                'fontRow',
                'volumeRow',
                'volumeSlider',
                'volumePercent',
                'volumeIconWrap',
                'progressRow',
                'progressBar',
                'progressFill',
                'elapsedTime',
                'totalTime',
                'lyricsContainer',
                'toggleLyricsItem',
                'toggleLyrics',
                'toggleCenterItem',
                'toggleCenter',
                'toggleProgressItem',
                'toggleProgress',
                'toggleControlsItem',
                'toggleControls',
                'toggleModeItem',
                'toggleMode',
                'idleDelaySlider',
                'idleDelayValue',
                'toggleShuffleItem',
                'toggleShuffle',
                'toggleRepeatItem',
                'toggleRepeat',
                'toggleLikeItem',
                'toggleLike',
                'toggleCloseItem',
                'toggleClose',
                'toggleFontItem',
                'toggleFont',
                'toggleVolItem',
                'toggleVol',
                'themeStyles',
                'openThemePicker',
                'currentThemeName',
                'themePicker',
                'themePickerDragHandle',
                'themePickerHeader',
                'themePickerBack',
                'themePickerTitle',
                'themeGrid',
                'closeBtn',
                'resizeHandle',
                'dragHeader',
                'fontSizeLabel',
                'chrome',
                'trackLine',
            ]),
            controls: doc.querySelector('.controls'),
            settingsContent: doc.querySelector('.settings-content'),
            menuItems: Array.from(doc.querySelectorAll('.menu-item')),
            win,
        };

        pipUi = ui;

        const {
            menuBtn,
            settingsPanel,
            settingsDragHandle,
            settingsHeader,
            settingsClose,
            settingsTitle,
            themeBtnLabel,
            generalTitle,
            languageLabel,
            languageSelect,
            appearanceTitle,
            displayTitle,
            toggleModeLabel,
            idleDelayLabel,
            toggleLyricsLabel,
            toggleCenterLabel,
            toggleProgressLabel,
            toggleControlsLabel,
            toggleShuffleLabel,
            toggleRepeatLabel,
            toggleLikeLabel,
            toggleCloseLabel,
            toggleFontLabel,
            toggleVolLabel,
            prevBtn,
            playBtn,
            nextBtn,
            shuffleBtn,
            repeatBtn,
            likeBtn,
            fontSlider,
            fontValue,
            fontRow,
            volumeRow,
            volumeSlider,
            volumePercent,
            volumeIconWrap,
            progressRow,
            progressBar,
            progressFill,
            elapsedTime,
            totalTime,
            lyricsContainer,
            toggleLyricsItem,
            toggleLyrics,
            toggleCenterItem,
            toggleCenter,
            toggleProgressItem,
            toggleProgress,
            toggleControlsItem,
            toggleControls,
            toggleModeItem,
            toggleMode,
            idleDelaySlider,
            idleDelayValue,
            toggleShuffleItem,
            toggleShuffle,
            toggleRepeatItem,
            toggleRepeat,
            toggleLikeItem,
            toggleLike,
            toggleCloseItem,
            toggleClose,
            toggleFontItem,
            toggleFont,
            toggleVolItem,
            toggleVol,
            themeStyles,
            openThemePicker: openThemePickerBtn,
            currentThemeName,
            themePicker,
            themePickerDragHandle,
            themePickerHeader,
            themePickerBack,
            themePickerTitle,
            themeGrid,
            closeBtn,
            resizeHandle,
            dragHeader,
            fontSizeLabel,
            chrome,
            trackLine,
            settingsContent,
            menuItems,
        } = ui;
        let idleTimer = null;

        function renderLanguageOptions() {
            if (!languageSelect) return;
            languageSelect.innerHTML = generateLanguageOptions();
            languageSelect.value = languageSetting;
        }

        function applyTranslations() {
            if (doc?.documentElement) doc.documentElement.lang = language;
            doc.title = t('appTitle');

            const textBindings = [
                [settingsTitle, 'settings'],
                [themeBtnLabel, 'theme'],
                [generalTitle, 'general'],
                [languageLabel, 'language'],
                [appearanceTitle, 'appearance'],
                [displayTitle, 'display'],
                [toggleModeLabel, 'lightMode'],
                [idleDelayLabel, 'idleFade'],
                [toggleLyricsLabel, 'showLyrics'],
                [toggleCenterLabel, 'centerLyrics'],
                [toggleProgressLabel, 'progressBar'],
                [toggleControlsLabel, 'controlsBar'],
                [toggleShuffleLabel, 'shuffleButton'],
                [toggleRepeatLabel, 'repeatButton'],
                [toggleLikeLabel, 'likeButton'],
                [toggleCloseLabel, 'closeButton'],
                [toggleFontLabel, 'fontSizeSlider'],
                [toggleVolLabel, 'volumeSlider'],
                [themePickerTitle, 'chooseTheme'],
                [fontSizeLabel, 'sizeLabel'],
            ];

            textBindings.forEach(([el, key]) => {
                if (el) el.textContent = t(key);
            });

            const titleBindings = [
                [menuBtn, 'settings'],
                [settingsClose, 'close'],
                [closeBtn, 'close'],
                [resizeHandle, 'dragResize'],
                [dragHeader, 'dragMove'],
                [openThemePickerBtn, 'chooseTheme'],
                [themePickerBack, 'back'],
                [shuffleBtn, 'shuffle'],
                [prevBtn, 'previous'],
                [playBtn, 'playPause'],
                [nextBtn, 'next'],
                [likeBtn, 'saveLiked'],
            ];

            titleBindings.forEach(([el, key]) => {
                if (el) el.title = t(key);
            });

            if (menuBtn) menuBtn.setAttribute('aria-label', t('settings'));
            if (settingsClose) settingsClose.setAttribute('aria-label', t('close'));
            if (closeBtn) closeBtn.setAttribute('aria-label', t('close'));
            if (resizeHandle) resizeHandle.setAttribute('aria-label', t('dragResize'));
            if (dragHeader) dragHeader.setAttribute('aria-label', t('dragMove'));
            if (openThemePickerBtn) openThemePickerBtn.setAttribute('aria-label', t('chooseTheme'));
            if (themePickerBack) themePickerBack.setAttribute('aria-label', t('back'));
            if (shuffleBtn) shuffleBtn.setAttribute('aria-label', t('shuffle'));
            if (prevBtn) prevBtn.setAttribute('aria-label', t('previous'));
            if (playBtn) playBtn.setAttribute('aria-label', t('playPause'));
            if (nextBtn) nextBtn.setAttribute('aria-label', t('next'));
            if (likeBtn) likeBtn.setAttribute('aria-label', t('saveLiked'));
            if (settingsPanel) settingsPanel.setAttribute('aria-label', t('settings'));
            if (themePicker) themePicker.setAttribute('aria-label', t('chooseTheme'));
            if (languageSelect) languageSelect.setAttribute('aria-label', t('language'));
            if (idleDelaySlider) idleDelaySlider.setAttribute('aria-label', t('idleFade'));
            if (progressBar) progressBar.setAttribute('aria-label', t('progressBar'));
            if (fontSlider) fontSlider.setAttribute('aria-label', t('fontSizeSlider'));
            if (volumeSlider) volumeSlider.setAttribute('aria-label', t('volumeSlider'));
            if (volumeIconWrap) volumeIconWrap.setAttribute('aria-label', t('volumeSlider'));

            if (trackLine?.dataset?.loading === 'true') {
                trackLine.textContent = t('loading');
            }

            renderLanguageOptions();
            renderRepeatButton(repeatBtn, resolveRepeatMode());
            refreshLyricsStatus();
        }

        let chromeFadeAnim = null;
        let chromeHidden = false;

        function bindWindowDrag(handle, ignoreSelector) {
            if (!handle) return;
            let dragging = false;
            let lastX = 0;
            let lastY = 0;
            let prevUserSelect = '';

            on(handle, 'mousedown', (e) => {
                if (e.button !== 0) return;
                if (ignoreSelector && e.target.closest(ignoreSelector)) return;
                dragging = true;
                lastX = e.screenX;
                lastY = e.screenY;
                prevUserSelect = doc.body.style.userSelect || '';
                doc.body.style.userSelect = 'none';
            });

            on(doc, 'mousemove', (e) => {
                if (!dragging) return;
                const dx = e.screenX - lastX;
                const dy = e.screenY - lastY;
                lastX = e.screenX;
                lastY = e.screenY;
                try {
                    win.moveBy(dx, dy);
                } catch (err) {}
            });

            const stopDrag = () => {
                if (!dragging) return;
                dragging = false;
                doc.body.style.userSelect = prevUserSelect;
            };

            on(doc, 'mouseup', stopDrag);
            on(doc, 'mouseleave', stopDrag);
        }

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

        function initI18n() {
            on(languageSelect, 'change', (e) => {
                const selected = e.target.value;
                if (selected !== 'auto' && !I18N[selected]) return;
                applyLanguageSetting(selected);
                safeSet(STORAGE_KEYS.language, languageSetting);
                applyTranslations();
            });
            applyTranslations();
        }

        function initPanels() {
            const setPanelState = ({ settingsOpen, themeOpen }) => {
                if (settingsPanel) {
                    settingsPanel.classList.toggle('open', settingsOpen);
                    setAriaHidden(settingsPanel, !settingsOpen);
                }
                if (themePicker) {
                    themePicker.classList.toggle('open', themeOpen);
                    setAriaHidden(themePicker, !themeOpen);
                }
                if (menuBtn) setAriaExpanded(menuBtn, settingsOpen || themeOpen);
                chrome.classList.toggle('settings-open', settingsOpen || themeOpen);
            };

            onClick(closeBtn, () => win.close());

            onClick(menuBtn, (e) => {
                e.stopPropagation();
                setChromeHidden(false);
                setPanelState({ settingsOpen: true, themeOpen: themePicker?.classList.contains('open') || false });
            });

            onClick(settingsClose, () => {
                setPanelState({ settingsOpen: false, themeOpen: false });
                if (menuBtn) menuBtn.focus();
            });

            onClick(settingsPanel, (e) => e.stopPropagation());
            onClick(themePicker, (e) => e.stopPropagation());

            onClick(openThemePickerBtn, () => {
                setChromeHidden(false);
                setPanelState({ settingsOpen: true, themeOpen: true });
            });

            onClick(themePickerBack, () => {
                setPanelState({ settingsOpen: true, themeOpen: false });
            });

            bindWindowDrag(settingsHeader, '.settings-close');
            bindWindowDrag(themePickerHeader, '.theme-picker-back');
            bindWindowDrag(settingsDragHandle);
            bindWindowDrag(themePickerDragHandle);

            bindDragScroll(settingsContent, doc, {
                ignoreSelector: 'button, input, select, option, textarea, label, .menu-item, .theme-btn',
            });
        }

        function initIdle() {
            ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart'].forEach((evt) => {
                doc.addEventListener(evt, handleActivity);
            });
        }

        function initThemePicker() {
            const selectTheme = (themeItem) => {
                if (!themeItem) return;
                const newTheme = themeItem.dataset.theme;
                if (newTheme && THEMES[newTheme]) {
                    currentTheme = newTheme;
                    safeSet(STORAGE_KEYS.theme, currentTheme);

                    // Update styles
                    themeStyles.textContent = generateStyles(currentTheme, colorMode);

                    // Update theme button
                    currentThemeName.textContent = THEMES[currentTheme].name;

                    // Update active state
                    doc.querySelectorAll('.theme-item').forEach(item => {
                        item.classList.toggle('active', item.dataset.theme === currentTheme);
                    });

                    // Close picker after selection
                    themePicker.classList.remove('open');
                    setAriaHidden(themePicker, true);
                    setAriaExpanded(menuBtn, true);
                }
            };

            on(themeGrid, 'click', (e) => {
                const themeItem = e.target.closest('.theme-item');
                selectTheme(themeItem);
            });

            bindDragScroll(themeGrid, doc, {
                ignoreSelector: 'button, input, select, option, textarea, label, .theme-item',
            });
        }

        function initToggles() {
            const bindings = [
                {
                    item: toggleLyricsItem,
                    toggle: toggleLyrics,
                    get: () => showLyrics,
                    set: (value) => { showLyrics = value; },
                    apply: (value) => setCollapsed(lyricsContainer, !value),
                    storageKey: STORAGE_KEYS.showLyrics,
                },
                {
                    item: toggleCenterItem,
                    toggle: toggleCenter,
                    get: () => centerLyrics,
                    set: (value) => { centerLyrics = value; },
                    apply: (value) => {
                        if (lyricsContainer) lyricsContainer.classList.toggle('centered', value);
                    },
                    storageKey: STORAGE_KEYS.centerLyrics,
                },
                {
                    item: toggleProgressItem,
                    toggle: toggleProgress,
                    get: () => showProgressBar,
                    set: (value) => { showProgressBar = value; },
                    apply: (value) => setHidden(progressRow, !value),
                    storageKey: STORAGE_KEYS.showProgress,
                },
                {
                    item: toggleControlsItem,
                    toggle: toggleControls,
                    get: () => showControls,
                    set: (value) => { showControls = value; },
                    apply: (value) => setHidden(ui.controls, !value),
                    storageKey: STORAGE_KEYS.showControls,
                },
                {
                    item: toggleShuffleItem,
                    toggle: toggleShuffle,
                    get: () => showShuffleBtn,
                    set: (value) => { showShuffleBtn = value; },
                    apply: (value) => setHidden(shuffleBtn, !value),
                    storageKey: STORAGE_KEYS.showShuffle,
                },
                {
                    item: toggleRepeatItem,
                    toggle: toggleRepeat,
                    get: () => showRepeatBtn,
                    set: (value) => { showRepeatBtn = value; },
                    apply: (value) => setHidden(repeatBtn, !value),
                    storageKey: STORAGE_KEYS.showRepeat,
                },
                {
                    item: toggleLikeItem,
                    toggle: toggleLike,
                    get: () => showLikeBtn,
                    set: (value) => { showLikeBtn = value; },
                    apply: (value) => setHidden(likeBtn, !value),
                    storageKey: STORAGE_KEYS.showLike,
                },
                {
                    item: toggleCloseItem,
                    toggle: toggleClose,
                    get: () => showCloseBtn,
                    set: (value) => { showCloseBtn = value; },
                    apply: (value) => setHidden(closeBtn, !value),
                    storageKey: STORAGE_KEYS.showClose,
                },
                {
                    item: toggleFontItem,
                    toggle: toggleFont,
                    get: () => showFontSlider,
                    set: (value) => { showFontSlider = value; },
                    apply: (value) => setCollapsed(fontRow, !value),
                    storageKey: STORAGE_KEYS.showFont,
                },
                {
                    item: toggleVolItem,
                    toggle: toggleVol,
                    get: () => showVolumeSlider,
                    set: (value) => { showVolumeSlider = value; },
                    apply: (value) => setCollapsed(volumeRow, !value),
                    storageKey: STORAGE_KEYS.showVol,
                },
            ];

            bindings.forEach(bindToggle);

            onClick(toggleModeItem, () => {
                colorMode = colorMode === 'light' ? 'dark' : 'light';
                setToggleState(toggleMode, colorMode === 'light');
                safeSet(STORAGE_KEYS.colorMode, colorMode);
                themeStyles.textContent = generateStyles(currentTheme, colorMode);
                if (doc?.body) doc.body.dataset.colorMode = colorMode;
            });

            on(idleDelaySlider, 'input', (e) => {
                idleDelayMs = parseInt(e.target.value, 10);
                if (Number.isNaN(idleDelayMs)) return;
                idleDelayValue.textContent = `${(idleDelayMs / 1000).toFixed(1)}s`;
                safeSet(STORAGE_KEYS.idleDelay, idleDelayMs);
                resetIdleTimer();
            });
        }

        function initControls() {
            onClick(prevBtn, () => Spicetify.Player.back());
            onClick(playBtn, () => Spicetify.Player.togglePlay());
            onClick(nextBtn, () => Spicetify.Player.next());
            onClick(shuffleBtn, () => {
                Spicetify.Player.toggleShuffle();
                lastShuffle = null;
                updatePipShuffleState();
            });
            onClick(repeatBtn, () => {
                const current = resolveRepeatMode();
                const next = current === 'off' ? 'context' : current === 'context' ? 'track' : 'off';
                setRepeatMode(next);
                pendingRepeatMode = next;
                pendingRepeatAt = Date.now();
                lastRepeatMode = null;
                renderRepeatButton(repeatBtn, next);
                setTimeout(updatePipRepeatState, 120);
            });
            onClick(likeBtn, () => {
                Spicetify.Player.toggleHeart();
                lastIsLiked = null;
                updatePipLikeState();
            });

            lastShuffle = null;
            lastRepeatMode = null;
            lastIsLiked = null;
            updatePipShuffleState();
            updatePipRepeatState();
            updatePipLikeState();
        }

        const lyricsDrag = {
            active: false,
            moved: false,
            startY: 0,
            startScroll: 0,
        };

        function initSliders() {
            on(fontSlider, 'input', (e) => {
                fontSize = parseInt(e.target.value);
                fontValue.textContent = `${fontSize}px`;
                safeSet(STORAGE_KEYS.fontSize, fontSize);
                updatePipFontSize();
            });

            on(volumeSlider, 'input', (e) => {
                const vol = parseInt(e.target.value);
                Spicetify.Player.setVolume(vol / 100);
                lastVolume = vol;
                volumePercent.textContent = `${vol}%`;
                volumeIconWrap.innerHTML = getVolumeIconSvg(vol);
            });

            onClick(volumeIconWrap, () => {
                const currentVol = Math.round((Spicetify.Player.getVolume() || 0) * 100);
                if (currentVol > 0) {
                    volumeSlider.dataset.prevVolume = currentVol;
                    Spicetify.Player.setVolume(0);
                    lastVolume = 0;
                    volumeSlider.value = 0;
                    volumePercent.textContent = '0%';
                    volumeIconWrap.innerHTML = getVolumeIconSvg(0);
                } else {
                    const prevVol = parseInt(volumeSlider.dataset.prevVolume) || 50;
                    Spicetify.Player.setVolume(prevVol / 100);
                    lastVolume = prevVol;
                    volumeSlider.value = prevVol;
                    volumePercent.textContent = `${prevVol}%`;
                    volumeIconWrap.innerHTML = getVolumeIconSvg(prevVol);
                }
            });

            on(lyricsContainer, 'mousedown', (e) => {
                if (e.button !== 0) return;
                lyricsDrag.active = true;
                lyricsDrag.moved = false;
                lyricsDrag.startY = e.clientY;
                lyricsDrag.startScroll = lyricsContainer.scrollTop;
            });

            on(doc, 'mousemove', (e) => {
                if (!lyricsDrag.active) return;
                const delta = e.clientY - lyricsDrag.startY;
                if (Math.abs(delta) > 3) lyricsDrag.moved = true;
                lyricsContainer.scrollTop = lyricsDrag.startScroll - delta;
            });

            const endLyricsDrag = () => {
                if (!lyricsDrag.active) return;
                lyricsDrag.active = false;
                setTimeout(() => {
                    lyricsDrag.moved = false;
                }, 0);
            };

            on(doc, 'mouseup', endLyricsDrag);
            on(lyricsContainer, 'mouseleave', endLyricsDrag);

            on(lyricsContainer, 'click', (e) => {
                if (lyricsDrag.moved) return;
                if (e.target.classList.contains('lyric')) {
                    const time = e.target.dataset.time;
                    if (time) Spicetify.Player.seek(parseInt(time));
                }
            });

            if (progressBar) {
                onClick(progressBar, (e) => {
                    const durationMs = getTrackDurationMs();
                    if (!durationMs) return;
                    const rect = progressBar.getBoundingClientRect();
                    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                    Spicetify.Player.seek(Math.round(durationMs * ratio));
                    lastProgressSecond = null;
                    lastProgressRatio = null;
                    updatePipProgress();
                });

            }
        }

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

        const controller = {
            initI18n,
            initPanels,
            initIdle,
            initThemePicker,
            initToggles,
            initControls,
            initSliders,
            initAll() {
                this.initI18n();
                this.initPanels();
                this.initIdle();
                this.initThemePicker();
                this.initToggles();
                this.initControls();
                this.initSliders();
            },
        };

        controller.initAll();

        // Handle window close
        win.addEventListener('pagehide', () => {
            pipWindow = null;
            pipUi = null;
        });

        // Initial update - force load lyrics for current track
        async function initialLoad() {
            const track = Spicetify.Player.data?.item;
            if (track?.uri) {
                currentTrackUri = track.uri;
                lastIsLiked = null;
                lastProgressSecond = null;
                lastProgressRatio = null;
                lastActiveLyricIndex = -1;
                await loadLyrics(track.uri);
                updatePipLikeState();
            } else {
                // Retry after a short delay if track data not ready
                setTimeout(initialLoad, 200);
            }
        }
        
        updatePipContent();
        lastProgressSecond = null;
        lastProgressRatio = null;
        updatePipProgress();
        handleActivity();
        initialLoad();
        startUpdateLoop();
    }

    // ==================== PIP CONTENT UPDATES ====================
    function updatePipContent() {
        const ui = getPipUi();
        if (!ui) return;

        const { doc, trackLine } = ui;
        const data = Spicetify.Player.data;
        
        if (!data?.item) return;

        const track = data.item;

        // Update track info
        if (trackLine) {
            const title = track.name || t('unknown');
            const artist = track.artists?.map(a => a.name).join(', ') || t('unknown');
            trackLine.textContent = `${title} - ${artist}`;
            trackLine.dataset.loading = 'false';
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
            lastIsLiked = null;
            lastProgressSecond = null;
            lastProgressRatio = null;
            lastActiveLyricIndex = -1;
            loadLyrics(track.uri);
            updatePipLikeState();
        }
    }

    function renderLikeButton(doc, isLiked) {
        if (!doc) return;
        const likeBtn = doc.getElementById('likeBtn');
        const likeIcon = doc.getElementById('likeIcon');
        if (!likeBtn || !likeIcon) return;

        likeBtn.classList.toggle('liked', isLiked);
        if (isLiked) {
            likeIcon.innerHTML = '<path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"/>';
        } else {
            likeIcon.innerHTML = '<path d="M1.69 2A4.582 4.582 0 0 1 8 2.023 4.583 4.583 0 0 1 11.88.817h.002a4.618 4.618 0 0 1 3.782 3.65v.003a4.543 4.543 0 0 1-1.011 3.84L9.35 14.629a1.765 1.765 0 0 1-2.093.464 1.762 1.762 0 0 1-.605-.463L1.348 8.309A4.582 4.582 0 0 1 1.689 2zm3.158.252A3.082 3.082 0 0 0 2.49 7.337l.005.005L7.8 13.664a.264.264 0 0 0 .311.069.262.262 0 0 0 .09-.069l5.312-6.33a3.043 3.043 0 0 0 .68-2.573 3.118 3.118 0 0 0-2.551-2.463 3.079 3.079 0 0 0-2.612.816l-.007.007a1.501 1.501 0 0 1-2.045 0l-.009-.008a3.082 3.082 0 0 0-2.121-.861z"/>';
        }
    }

    function updatePipLikeState() {
        const ui = getPipUi();
        if (!ui) return;
        const isLiked = Spicetify.Player.getHeart();
        if (isLiked === lastIsLiked) return;
        lastIsLiked = isLiked;
        renderLikeButton(ui.doc, isLiked);
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

    function renderRepeatButton(repeatBtn, mode) {
        if (!repeatBtn) return;
        repeatBtn.classList.toggle('repeat-on', mode === 'context');
        repeatBtn.classList.toggle('repeat-one', mode === 'track');
        repeatBtn.title = mode === 'track' ? t('repeatOne') : mode === 'context' ? t('repeatAll') : t('repeatOff');
        repeatBtn.setAttribute('aria-label', repeatBtn.title);
    }

    function updatePipShuffleState() {
        const ui = getPipUi();
        if (!ui || !ui.shuffleBtn) return;
        const shuffle = Spicetify.Player.getShuffle();
        if (shuffle === lastShuffle) return;
        lastShuffle = shuffle;
        ui.shuffleBtn.classList.toggle('shuffle-on', shuffle);
    }

    function updatePipRepeatState() {
        const ui = getPipUi();
        if (!ui || !ui.repeatBtn) return;
        const mode = resolveRepeatMode();
        if (mode === lastRepeatMode) return;
        lastRepeatMode = mode;
        renderRepeatButton(ui.repeatBtn, mode);
    }

    function updatePipPlayButton() {
        const ui = getPipUi();
        if (!ui || !ui.playIcon) return;

        const isPlaying = Spicetify.Player.isPlaying();
        if (isPlaying === lastIsPlaying) return;
        lastIsPlaying = isPlaying;
        ui.playIcon.innerHTML = isPlaying
            ? '<path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>'
            : '<path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>';
    }

    function updatePipVolume() {
        const ui = getPipUi();
        if (!ui || !ui.volumeSlider || !ui.volumePercent || !ui.volumeIconWrap) return;

        // Only update if slider is not being dragged
        if (ui.doc.activeElement !== ui.volumeSlider) {
            const vol = Math.round((Spicetify.Player.getVolume() || 0) * 100);
            if (vol === lastVolume) return;
            lastVolume = vol;
            ui.volumeSlider.value = vol;
            ui.volumePercent.textContent = `${vol}%`;
            ui.volumeIconWrap.innerHTML = getVolumeIconSvg(vol);
        }
    }

    function updatePipProgress() {
        const ui = getPipUi();
        if (!ui || !ui.progressFill || !ui.elapsedTime || !ui.totalTime || !ui.progressBar) return;

        const durationMs = getTrackDurationMs();
        const progressMs = Spicetify.Player.getProgress() || 0;

        if (!durationMs) {
            if (lastProgressRatio !== 0) {
                ui.progressFill.style.width = '0%';
                lastProgressRatio = 0;
            }
            if (lastProgressSecond !== 0) {
                ui.elapsedTime.textContent = '0:00';
                ui.totalTime.textContent = '0:00';
                lastProgressSecond = 0;
            }
            return;
        }

        const ratio = Math.min(1, Math.max(0, progressMs / durationMs));
        const second = Math.floor(progressMs / 1000);
        if (ratio !== lastProgressRatio) {
            ui.progressFill.style.width = `${(ratio * 100).toFixed(2)}%`;
            lastProgressRatio = ratio;
        }
        if (second !== lastProgressSecond) {
            ui.elapsedTime.textContent = formatTime(progressMs);
            ui.totalTime.textContent = formatTime(durationMs);
            lastProgressSecond = second;
        }
    }

    function setLyricsStatus(status) {
        lyricsStatus = status;
        const ui = getPipUi();
        if (!ui || !ui.lyricsContainer) return;

        if (status === 'loading') {
            ui.lyricsContainer.innerHTML = '<div class="status-msg"><div class="spinner"></div></div>';
            startSpinnerAnimation();
            return;
        }

        if (status === 'no-lyrics') {
            stopSpinnerAnimation();
            ui.lyricsContainer.innerHTML = `
                <div class="status-msg">
                    <div class="icon">!</div>
                    <div class="text">${t('noLyrics')}</div>
                    <div class="subtext">${t('lyricsNotFound')}</div>
                </div>
            `;
            return;
        }

        if (status === 'instrumental') {
            stopSpinnerAnimation();
            ui.lyricsContainer.innerHTML = `
                <div class="status-msg">
                    <div class="icon">i</div>
                    <div class="text">${t('instrumental')}</div>
                </div>
            `;
        }
    }

    function refreshLyricsStatus() {
        if (!lyricsStatus) return;
        setLyricsStatus(lyricsStatus);
    }

    function startSpinnerAnimation() {
        const ui = getPipUi();
        if (!ui) return;
        spinnerActive = true;
        const spinner = ui.doc.querySelector('.spinner');
        if (!spinner) return;
        spinner.classList.remove('spinning');
        void spinner.offsetWidth;
        spinner.classList.add('spinning');
    }

    function stopSpinnerAnimation() {
        spinnerActive = false;
        const ui = getPipUi();
        const spinner = ui?.doc?.querySelector('.spinner');
        if (spinner) spinner.classList.remove('spinning');
    }

    async function loadLyrics(uri) {
        const ui = getPipUi();
        if (!ui || !ui.lyricsContainer) return;

        const requestId = ++lyricsRequestId;

        // Show loading
        setLyricsStatus('loading');
        await yieldToUi();

        // Fetch lyrics
        const lyrics = await fetchLyrics(uri);
        if (requestId !== lyricsRequestId) return;
        currentLyrics = lyrics;

        if (!currentLyrics || !currentLyrics.lines?.length) {
            setLyricsStatus('no-lyrics');
            return;
        }

        currentLyricsFilteredLines = currentLyrics.lines.filter(line => line.text && line.text.trim());
        if (!currentLyricsFilteredLines.length) {
            setLyricsStatus('instrumental');
            return;
        }

        // Render lyrics
        const lyricsHtml = currentLyricsFilteredLines
            .map((line, idx) =>
                `<div class="lyric" role="listitem" data-time="${line.startTime}" data-idx="${idx}" style="font-size:${fontSize}px">${formatLyricHtml(line)}</div>`
            ).join('');

        lyricsStatus = null;
        stopSpinnerAnimation();
        ui.lyricsContainer.innerHTML = lyricsHtml;
        currentLyricElements = Array.from(ui.lyricsContainer.querySelectorAll('.lyric'));
        lastActiveLyricIndex = -1;
        initialScrollPending = true;
        updateCurrentLyric(true);
    }

    function updateCurrentLyric(forceScroll = false) {
        const ui = getPipUi();
        if (!ui || !currentLyrics?.synced) return;

        const currentTime = Spicetify.Player.getProgress();
        const lines = currentLyricsFilteredLines;
        const lyrics = currentLyricElements;
        if (!lines || !lyrics?.length) return;

        // Find active line
        let activeIdx = -1;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (currentTime >= lines[i].startTime) {
                activeIdx = i;
                break;
            }
        }

        if (activeIdx !== lastActiveLyricIndex) {
            const prevIdx = lastActiveLyricIndex;
            const prevValid = Number.isFinite(prevIdx) && prevIdx >= 0;
            const minIdx = prevValid ? Math.min(prevIdx, activeIdx) : Math.max(0, activeIdx);
            const maxIdx = prevValid ? Math.max(prevIdx, activeIdx) : activeIdx;

            if (activeIdx < 0) {
                for (let i = 0; i < lyrics.length; i++) {
                    const el = lyrics[i];
                    if (!el) continue;
                    el.classList.remove('active', 'past');
                }
            } else {
                for (let i = minIdx; i <= maxIdx; i++) {
                    const el = lyrics[i];
                    if (!el) continue;
                    el.classList.toggle('active', i === activeIdx);
                    el.classList.toggle('past', i < activeIdx);
                }
            }

            lastActiveLyricIndex = activeIdx;
        }

        const isPlaying = Spicetify.Player.isPlaying();
        const shouldScroll = isPlaying || forceScroll || initialScrollPending;
        if (shouldScroll && lyrics.length) {
            const scrollIdx = activeIdx >= 0 ? activeIdx : 0;
            const target = lyrics[scrollIdx];
            if (target) {
                target.scrollIntoView({ behavior: isPlaying ? 'smooth' : 'auto', block: 'center' });
                initialScrollPending = false;
            }
        }
    }

    function updatePipFontSize() {
        const ui = getPipUi();
        if (!ui) return;

        const lyrics = ui.doc.querySelectorAll('.lyric');
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

