import { STATUS_TEXT } from "jsr:@std/http@1.0.25/status";

type LyricsLine = {
    startTimeMs: string;
    words: string;
    syllables: string[];
    endTimeMs: string;
    transliteratedWords: string;
};

type ProviderLine = {
    startTimeMs: number;
    words: string;
    syllables?: string[];
    endTimeMs?: number;
};

type ProviderResult = {
    lines: LyricsLine[];
    provider: string;
    providerLyricsDisplayName: string;
    providerLyricsId: string;
    syncType: "LINE_SYNCED" | "UNSYNCED";
    isSynced: boolean;
};

type ProviderFetchResult = {
    provider: string;
    providerLyricsDisplayName: string;
    providerLyricsId: string | number | null;
    isSynced: boolean;
    lines: ProviderLine[];
};

type QueryParams = {
    artist: string;
    track: string;
    duration: number | null;
    album: string;
    username: string;
    country: string;
};

const KV_TTL_MS = 7 * 24 * 60 * 60 * 1000;
let kvInstance: Deno.Kv | null = null;

const CLEANUP_RE = /[\s\-–—_]+/g;
const TRAILING_RE = /[\s.,!?:;"'()\[\]{}]+$/g;
const LEADING_RE = /^[\s.,!?:;"'()\[\]{}]+/g;
const TIME_TAG = /\[(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;
const META_TAG = /^\s*\[(ti|ar|al|by|offset):/i;

const CORS_HEADERS: HeadersInit = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "authorization, content-type",
};

const PROVIDER_ORDER = [
    "lrcCx",
    "neteaseOfficial",
    "vkeysQQ",
    "vkeysNetease",
    "oiapiQQ",
];

function getProviderOrder(provider: string): number {
    const index = PROVIDER_ORDER.indexOf(provider);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

async function getKv(): Promise<Deno.Kv> {
    if (!kvInstance) {
        kvInstance = await Deno.openKv();
    }
    return kvInstance;
}

async function getCached<T>(key: Deno.KvKey): Promise<T | null> {
    const kv = await getKv();
    const result = await kv.get<T>(key);
    return result?.value ?? null;
}

async function setCached<T>(key: Deno.KvKey, value: T): Promise<void> {
    const kv = await getKv();
    await kv.set(key, value, { expireIn: KV_TTL_MS });
}

async function clearCachedLyrics(): Promise<number> {
    const kv = await getKv();
    let cleared = 0;
    for await (const entry of kv.list({ prefix: ["lyrics"] })) {
        await kv.delete(entry.key);
        cleared += 1;
    }
    return cleared;
}

function normalizeQueryPart(value: string): string {
    if (!value) return "";
    return value
        .normalize("NFKC")
        .replace(CLEANUP_RE, " ")
        .replace(LEADING_RE, "")
        .replace(TRAILING_RE, "")
        .trim()
        .toLowerCase();
}

function buildQueryParams(url: URL): QueryParams {
    const artist = (url.searchParams.get("artist") || "").trim();
    const track = (url.searchParams.get("track") || "").trim();
    const durationRaw = (url.searchParams.get("duration") || "").trim();
    const album = (url.searchParams.get("album") || "").trim();
    const username = (url.searchParams.get("username") || "").trim();
    const country = (url.searchParams.get("country") || "").trim();
    const duration = durationRaw ? Number.parseFloat(durationRaw) : null;

    return {
        artist,
        track,
        duration: Number.isFinite(duration) ? duration : null,
        album,
        username,
        country,
    };
}

function buildCacheKey(params: QueryParams): Deno.KvKey {
    const artistKey = normalizeQueryPart(params.artist) || "_";
    const trackKey = normalizeQueryPart(params.track) || "_";
    const albumKey = normalizeQueryPart(params.album) || "_";
    const durationKey = params.duration !== null ? String(Math.round(params.duration)) : "_";
    const countryKey = normalizeQueryPart(params.country) || "_";
    return ["lyrics", artistKey, trackKey, albumKey, durationKey, countryKey];
}

function isAuthorized(request: Request): boolean {
    const token = Deno.env.get("TOKEN");
    if (!token) return true;

    const header = request.headers.get("authorization") || request.headers.get("Authorization");
    if (!header) return false;

    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) return false;

    return match[1] === token;
}

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            ...CORS_HEADERS,
        },
    });
}

function homePageResponse(): Response {
    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lyrics API</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; padding: 24px; line-height: 1.5; }
    code, pre { background: #f4f4f6; padding: 2px 6px; border-radius: 4px; }
    pre { padding: 12px; overflow: auto; }
  </style>
</head>
<body>
  <h1>Lyrics API</h1>
  <p>Endpoint: <code>GET /get</code></p>
  <p>Query params:</p>
  <ul>
    <li><code>artist</code></li>
    <li><code>track</code></li>
    <li><code>duration</code> (seconds)</li>
    <li><code>album</code></li>
    <li><code>username</code></li>
    <li><code>country</code></li>
  </ul>
  <p>Optional auth header (when <code>TOKEN</code> is set):</p>
  <pre>Authorization: Bearer &lt;token&gt;</pre>
  <p>Example:</p>
  <pre>/get?artist=Adele&amp;track=Hello&amp;duration=295&amp;album=25&amp;country=US</pre>
  <p>Response format matches More Lyrics:</p>
  <pre>{
  "lines": [
    { "startTimeMs": "15088", "words": "...", "syllables": [], "endTimeMs": "0", "transliteratedWords": "" }
  ],
  "provider": "lrcCx",
  "providerLyricsDisplayName": "LRC.cx",
  "providerLyricsId": "12345",
  "syncType": "LINE_SYNCED",
  "isSynced": true
}</pre>
</body>
</html>`;

    return new Response(html, {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8", ...CORS_HEADERS },
    });
}

function timeoutFetch(url: string, init: RequestInit = {}, timeoutMs = 4500): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function calcSimilarity(a: string, b: string): number {
    const aClean = normalizeQueryPart(a);
    const bClean = normalizeQueryPart(b);
    if (!aClean || !bClean) return 0;
    if (aClean === bClean) return 1;

    const aTokens = new Set(aClean.split(" ").filter(Boolean));
    const bTokens = new Set(bClean.split(" ").filter(Boolean));
    if (!aTokens.size || !bTokens.size) return 0;

    let intersect = 0;
    for (const token of aTokens) {
        if (bTokens.has(token)) intersect += 1;
    }
    const union = aTokens.size + bTokens.size - intersect;
    return union ? intersect / union : 0;
}

function parseLrcLines(lrcText: string | null | undefined): { lines: ProviderLine[]; hasTime: boolean } | null {
    if (!lrcText || typeof lrcText !== "string") return null;

    const lines: ProviderLine[] = [];
    let hasTime = false;

    for (const rawLine of lrcText.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line) continue;
        if (META_TAG.test(line)) continue;

        const matches = [...line.matchAll(TIME_TAG)];
        const text = line.replace(TIME_TAG, "").trim();

        if (!matches.length) {
            if (text) lines.push({ startTimeMs: 0, words: text, syllables: [] });
            continue;
        }

        hasTime = true;
        for (const match of matches) {
            const hour = match[1] ? Number.parseInt(match[1], 10) : 0;
            const min = Number.parseInt(match[2], 10);
            const sec = Number.parseInt(match[3], 10);
            const frac = match[4] || "0";
            let ms = 0;
            if (frac.length === 1) ms = Number.parseInt(frac, 10) * 100;
            else if (frac.length === 2) ms = Number.parseInt(frac, 10) * 10;
            else ms = Number.parseInt(frac.slice(0, 3), 10);

            const startTimeMs = (hour * 3600 + min * 60 + sec) * 1000 + ms;
            lines.push({ startTimeMs, words: text, syllables: [] });
        }
    }

    const filtered = lines.filter(line => line.words && line.words.trim());
    if (!filtered.length) return null;

    if (hasTime) {
        filtered.sort((a, b) => a.startTimeMs - b.startTimeMs);
    }

    return { lines: filtered, hasTime };
}

function parseLrcToProvider(lrcText: string | null | undefined): { lines: ProviderLine[]; isSynced: boolean } | null {
    const parsed = parseLrcLines(lrcText);
    if (!parsed?.lines?.length) return null;

    return {
        lines: parsed.lines,
        isSynced: parsed.hasTime,
    };
}

async function fetchLrcCx(params: QueryParams): Promise<ProviderFetchResult | null> {
    if (!params.track && !params.artist && !params.album) return null;

    const search = new URLSearchParams();
    if (params.track) search.set("title", params.track);
    if (params.album) search.set("album", params.album);
    if (params.artist) search.set("artist", params.artist);
    const query = search.toString();
    if (!query) return null;

    const baseUrl = "https://api.lrc.cx/api/v1/lyrics";

    try {
        const advanceUrl = `${baseUrl}/advance?${query}`;
        const advanceResp = await timeoutFetch(advanceUrl);
        if (advanceResp.ok) {
            const data = await advanceResp.json();
            if (Array.isArray(data)) {
                const itemWithLyrics = data.find((item: { lyrics?: string }) => typeof item?.lyrics === "string");
                if (itemWithLyrics?.lyrics) {
                    const parsed = parseLrcToProvider(itemWithLyrics.lyrics);
                    if (parsed) {
                        return {
                            provider: "lrcCx",
                            providerLyricsDisplayName: "LRC.cx",
                            providerLyricsId: itemWithLyrics.id ?? null,
                            isSynced: parsed.isSynced,
                            lines: parsed.lines,
                        };
                    }
                }
            }
        }
    } catch {
        // ignore
    }

    try {
        const singleUrl = `${baseUrl}/single?${query}`;
        const singleResp = await timeoutFetch(singleUrl);
        if (singleResp.ok) {
            const text = await singleResp.text();
            const parsed = parseLrcToProvider(text);
            if (parsed) {
                return {
                    provider: "lrcCx",
                    providerLyricsDisplayName: "LRC.cx",
                    providerLyricsId: null,
                    isSynced: parsed.isSynced,
                    lines: parsed.lines,
                };
            }
        }
    } catch {
        // ignore
    }

    return null;
}

async function fetchVkeysQQ(params: QueryParams): Promise<ProviderFetchResult | null> {
    if (!params.track) return null;

    const searchParams = new URLSearchParams();
    searchParams.set("word", params.artist ? `${params.track} ${params.artist}` : params.track);
    searchParams.set("page", "1");
    searchParams.set("num", "10");

    const baseUrl = "https://api.vkeys.cn";

    try {
        const searchUrl = `${baseUrl}/v2/music/tencent/search/song?${searchParams.toString()}`;
        const searchResp = await timeoutFetch(searchUrl);
        if (!searchResp.ok) return null;
        const searchJson = await searchResp.json();
        const list = Array.isArray(searchJson?.data) ? searchJson.data : [];
        if (!list.length) return null;

        const pick = list.find((item: { mid?: string; id?: number }) => item?.mid || item?.id) || list[0];
        if (!pick) return null;

        const lyricParams = new URLSearchParams();
        if (pick.mid) lyricParams.set("mid", pick.mid);
        else if (pick.id) lyricParams.set("id", String(pick.id));

        if (!lyricParams.toString()) return null;

        const lyricUrl = `${baseUrl}/v2/music/tencent/lyric?${lyricParams.toString()}`;
        const lyricResp = await timeoutFetch(lyricUrl);
        if (!lyricResp.ok) return null;
        const lyricJson = await lyricResp.json();
        const lrc = lyricJson?.data?.lrc;
        const parsed = parseLrcToProvider(lrc);
        if (!parsed) return null;

        return {
            provider: "vkeysQQ",
            providerLyricsDisplayName: "QQ Music (vkeys)",
            providerLyricsId: pick.mid ?? pick.id ?? null,
            isSynced: parsed.isSynced,
            lines: parsed.lines,
        };
    } catch {
        return null;
    }
}

async function fetchVkeysNetease(params: QueryParams): Promise<ProviderFetchResult | null> {
    if (!params.track) return null;

    const searchParams = new URLSearchParams();
    searchParams.set("word", params.artist ? `${params.track} ${params.artist}` : params.track);
    searchParams.set("page", "1");
    searchParams.set("num", "10");

    const baseUrl = "https://api.vkeys.cn";

    try {
        const searchUrl = `${baseUrl}/v2/music/netease?${searchParams.toString()}`;
        const searchResp = await timeoutFetch(searchUrl);
        if (!searchResp.ok) return null;
        const searchJson = await searchResp.json();
        const id = searchJson?.data?.id;
        if (!id) return null;

        const lyricUrl = `${baseUrl}/v2/music/netease/lyric?id=${encodeURIComponent(String(id))}`;
        const lyricResp = await timeoutFetch(lyricUrl);
        if (!lyricResp.ok) return null;
        const lyricJson = await lyricResp.json();
        const lrc = lyricJson?.data?.lrc;
        const parsed = parseLrcToProvider(lrc);
        if (!parsed) return null;

        return {
            provider: "vkeysNetease",
            providerLyricsDisplayName: "NetEase (vkeys)",
            providerLyricsId: id,
            isSynced: parsed.isSynced,
            lines: parsed.lines,
        };
    } catch {
        return null;
    }
}

async function fetchNeteaseOfficial(params: QueryParams): Promise<ProviderFetchResult | null> {
    if (!params.track) return null;

    const keyword = params.artist ? `${params.track} ${params.artist}` : params.track;
    const searchParams = new URLSearchParams();
    searchParams.set("s", keyword);
    searchParams.set("type", "1");
    searchParams.set("offset", "0");
    searchParams.set("limit", "5");

    const baseUrl = "https://music.163.com/api";

    try {
        const searchUrl = `${baseUrl}/search/get?${searchParams.toString()}`;
        const searchResp = await timeoutFetch(searchUrl, { headers: { Accept: "application/json" } });
        if (!searchResp.ok) return null;
        const searchJson = await searchResp.json();
        const songs = searchJson?.result?.songs;
        const pick = Array.isArray(songs) ? songs[0] : null;
        const id = pick?.id;
        if (!id) return null;

        const lyricUrl = `${baseUrl}/song/lyric?os=pc&id=${encodeURIComponent(String(id))}&lv=-1&tv=-1`;
        const lyricResp = await timeoutFetch(lyricUrl, { headers: { Accept: "application/json" } });
        if (!lyricResp.ok) return null;
        const lyricJson = await lyricResp.json();
        const lrc = lyricJson?.lrc?.lyric || lyricJson?.lrc;
        const parsed = parseLrcToProvider(lrc);
        if (!parsed) return null;

        return {
            provider: "neteaseOfficial",
            providerLyricsDisplayName: "NetEase Official",
            providerLyricsId: id,
            isSynced: parsed.isSynced,
            lines: parsed.lines,
        };
    } catch {
        return null;
    }
}

function extractOiapiLyrics(data: { conteng?: string; content?: string; base64?: string } | null | undefined): string | null {
    if (!data) return null;
    const content = data.conteng || data.content;
    if (typeof content === "string" && content.trim()) return content;
    if (typeof data.base64 === "string" && data.base64.trim()) {
        try {
            return atob(data.base64.trim());
        } catch {
            return null;
        }
    }
    return null;
}

async function fetchOiapiQQ(params: QueryParams): Promise<ProviderFetchResult | null> {
    if (!params.track) return null;

    const keyword = params.artist ? `${params.track} ${params.artist}` : params.track;

    const searchParams = new URLSearchParams();
    searchParams.set("keyword", keyword);
    searchParams.set("page", "1");
    searchParams.set("limit", "10");
    searchParams.set("format", "lrc");
    searchParams.set("type", "json");
    searchParams.set("n", "1");

    const baseUrl = "https://oiapi.net/api/QQMusicLyric";

    try {
        const searchUrl = `${baseUrl}?${searchParams.toString()}`;
        const searchResp = await timeoutFetch(searchUrl);
        if (!searchResp.ok) return null;
        const searchJson = await searchResp.json();

        if (Array.isArray(searchJson?.data) && searchJson.data.length) {
            const pick = searchJson.data[0];
            const id = pick?.mid || pick?.id;
            if (!id) return null;

            const lyricParams = new URLSearchParams();
            lyricParams.set("id", String(id));
            lyricParams.set("format", "lrc");
            lyricParams.set("type", "json");

            const lyricUrl = `${baseUrl}?${lyricParams.toString()}`;
            const lyricResp = await timeoutFetch(lyricUrl);
            if (!lyricResp.ok) return null;
            const lyricJson = await lyricResp.json();
            const lrc = extractOiapiLyrics(lyricJson?.data ?? null);
            const parsed = parseLrcToProvider(lrc);
            if (!parsed) return null;

            return {
                provider: "oiapiQQ",
                providerLyricsDisplayName: "QQ Music (oiapi)",
                providerLyricsId: id,
                isSynced: parsed.isSynced,
                lines: parsed.lines,
            };
        }

        const fallbackLyrics = extractOiapiLyrics(searchJson?.data ?? null);
        const parsed = parseLrcToProvider(fallbackLyrics);
        if (!parsed) return null;

        return {
            provider: "oiapiQQ",
            providerLyricsDisplayName: "QQ Music (oiapi)",
            providerLyricsId: null,
            isSynced: parsed.isSynced,
            lines: parsed.lines,
        };
    } catch {
        return null;
    }
}

function syncedScore(result: ProviderFetchResult): number {
    const hasSyllables = result.lines.some(line => line.syllables && line.syllables.length > 0);
    if (hasSyllables) return 4;
    return result.isSynced ? 3 : 1;
}

function textScore(result: ProviderFetchResult): number {
    const words = result.lines.map(line => line.words).join(" ");
    return normalizeQueryPart(words).length > 0 ? 1 : 0;
}

function rankProviders(results: ProviderFetchResult[], params: QueryParams): ProviderFetchResult[] {
    const trackScore = (result: ProviderFetchResult) => {
        const combinedText = result.lines.map(line => line.words).join(" ");
        return calcSimilarity(params.track, combinedText);
    };

    return results
        .slice()
        .sort((a, b) => {
            const scoreA = syncedScore(a) * 10 + textScore(a) + trackScore(a);
            const scoreB = syncedScore(b) * 10 + textScore(b) + trackScore(b);
            if (scoreA !== scoreB) return scoreB - scoreA;
            return getProviderOrder(a.provider) - getProviderOrder(b.provider);
        });
}

function normalizeLine(line: ProviderLine): LyricsLine {
    return {
        startTimeMs: String(Math.max(0, Math.round(line.startTimeMs ?? 0))),
        words: line.words ?? "",
        syllables: Array.isArray(line.syllables) ? line.syllables : [],
        endTimeMs: String(Math.max(0, Math.round(line.endTimeMs ?? 0))),
        transliteratedWords: "",
    };
}

function formatResult(result: ProviderFetchResult): ProviderResult {
    const providerLyricsId = result.providerLyricsId ?? "";
    return {
        lines: result.lines.map(normalizeLine).filter(line => line.words && line.words.trim()),
        provider: result.provider,
        providerLyricsDisplayName: result.providerLyricsDisplayName,
        providerLyricsId: String(providerLyricsId),
        syncType: result.isSynced ? "LINE_SYNCED" : "UNSYNCED",
        isSynced: result.isSynced === true,
    };
}

async function handleGet(request: Request): Promise<Response> {
    if (!isAuthorized(request)) {
        return jsonResponse({ error: STATUS_TEXT[401] ?? "Unauthorized" }, 401);
    }

    const url = new URL(request.url);
    const params = buildQueryParams(url);

    if (!params.track && !params.artist && !params.album) {
        return jsonResponse({ error: "Missing query" }, 400);
    }

    const cacheKey = buildCacheKey(params);
    const cached = await getCached<ProviderResult>(cacheKey);
    if (cached) {
        return jsonResponse(cached, 200);
    }

    const providers = [
        fetchLrcCx(params),
        fetchVkeysQQ(params),
        fetchVkeysNetease(params),
        fetchNeteaseOfficial(params),
        fetchOiapiQQ(params),
    ];

    const settled = await Promise.allSettled(providers);
    const results: ProviderFetchResult[] = [];
    for (const entry of settled) {
        if (entry.status === "fulfilled" && entry.value?.lines?.length) {
            results.push(entry.value);
        }
    }

    if (!results.length) {
        return jsonResponse({ error: "No lyrics found" }, 404);
    }

    const ranked = rankProviders(results, params);
    const best = ranked[0];
    const formatted = formatResult(best);

    await setCached(cacheKey, formatted);

    return jsonResponse(formatted, 200);
}

async function handleClear(request: Request): Promise<Response> {
    if (!isAuthorized(request)) {
        return jsonResponse({ error: STATUS_TEXT[401] ?? "Unauthorized" }, 401);
    }

    const cleared = await clearCachedLyrics();
    return jsonResponse({ cleared }, 200);
}

Deno.serve((request) => {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method === "GET" && url.pathname === "/") {
        return homePageResponse();
    }
    if (request.method === "GET" && url.pathname === "/get") {
        return handleGet(request);
    }
    if (request.method === "GET" && url.pathname === "/clear") {
        return handleClear(request);
    }

    return jsonResponse({ error: STATUS_TEXT[404] ?? "Not Found" }, 404);
});
