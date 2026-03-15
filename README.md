# Lyric Miniplayer (fork)

A Spicetify extension that creates a **floating Picture-in-Picture lyrics window** that stays on top of other applications - like YouTube's mini-player, but for lyrics!

![Preview](preview.png)

## Features

- **Floating Window** - Opens lyrics in a separate always-on-top window
- **Synced Lyrics** - Automatically highlights and scrolls to the current line
- **Bilingual Highlight** - If NetEase lyrics include translations, Chinese/English lines are shown together and highlighted in sync
- **Playback Controls** - Previous, Play/Pause, Next, Shuffle, Repeat buttons
- **Like Button** - Save songs to your Liked Songs directly from the miniplayer
- **Shuffle Button** - Toggle shuffle mode
- **Repeat (Loop) Button** - Toggle repeat off/all/one
- **Volume Control** - Adjust volume with slider, click speaker to mute
- **Adjustable Font Size** - Slider to make lyrics larger or smaller
- **12 Beautiful Themes** - Spotify, Pink Pop, Kawaii, Ocean Blue, Racing Red, Sunset, Galaxy, Mint Fresh, Luxury Gold, Cyberpunk, Frost, Rose Gold
- **Light/Dark Mode** - Switch between light and dark UI
- **Center/Left Align** - Toggle between centered or left-aligned lyrics
- **Click to Seek** - Click any lyric line to jump to that part of the song
- **Progress Bar** - Track progress with click-to-seek
- **Controls Auto-hide** - Idle fade for a cleaner view
- **Full Settings Panel** - Customize everything to your liking
- **Remembers Preferences** - All settings are saved automatically

## Installation

### Manual Installation

1. Download `lyrics-overlay.js`
2. Copy to your Spicetify Extensions folder:
   - **Windows:** `%appdata%\spicetify\Extensions\`
   - **macOS/Linux:** `~/.config/spicetify/Extensions/`
3. Run:
   ```bash
   spicetify config extensions lyrics-overlay.js
   spicetify apply
   ```
4. Restart Spotify

## Usage

1. **Click the music note icon** in Spotify's top bar

2. A floating window will appear with your lyrics!

3. **Click the ⠿ dots** in the header to open settings

## Themes

Choose from **12 beautiful themes**:

| Theme | Preview |
|-------|---------|
| Spotify | Classic green accent |
| Pink Pop | Vibrant pink |
| Kawaii | Soft pastel pink |
| Ocean Blue | Cool blue tones |
| Racing Red | Bold red |
| Sunset | Warm orange |
| Galaxy | Purple magic |
| Mint Fresh | Fresh teal |
| Luxury Gold | Elegant gold |
| Cyberpunk | Neon magenta |
| Frost | Icy light blue |
| Rose Gold | Romantic rose |

**To change theme:** Settings → Click the theme button → Choose your theme

## Settings & Display Options

Click the **⠿** in the header to access settings:

### Theme
- Click to open the theme picker
- Choose from 12 themes
- Changes apply instantly

### Display Options
| Toggle | Description |
|--------|-------------|
| **Show Lyrics** | Show/hide the lyrics section |
| **Light Mode** | Toggle light/dark UI |
| **Idle Fade** | Auto-hide controls after a short idle delay |
| **Center Lyrics** | Toggle centered or left-aligned lyrics |
| **Shuffle Button** | Show/hide shuffle button in controls |
| **Repeat Button** | Show/hide repeat button in controls |
| **Like Button** | Show/hide the heart button |
| **Close Button** | Show/hide the close button |
| **Font Size Slider** | Show/hide the font size control |
| **Volume Slider** | Show/hide the volume control |

All preferences are saved and persist between sessions.

## Controls

| Control | Action |
|---------|--------|
| Previous | Previous track |
| Play/Pause | Play/Pause |
| Next | Next track |
| Shuffle | Toggle shuffle |
| Repeat | Repeat off/all/one |
| Heart | Like/Unlike song |
| Progress Bar | Seek within track |
| Close | Close miniplayer |

## Troubleshooting

### Lyrics not showing?
- Some tracks don't have lyrics available on Spotify
- Lyrics are a Spotify feature (availability varies by region)
- If Spotify lyrics fail, the extension falls back to external providers (More Lyrics API, LRC.cx, NetEase Official, QQ Music, NetEase, QQ Music (oiapi))

## Lyrics Sources

The extension first tries Spotify's native lyrics endpoints. If those fail, it will automatically query third-party providers:

1. **More Lyrics API** (`https://lyrics.kamiloo13.me/api`)
2. **LRC.cx API** (`https://api.lrc.cx/api/v1/lyrics`)
3. **NetEase Official API** (`https://music.163.com/api`)
4. **QQ Music API** (`https://api.vkeys.cn/v2/music/tencent`)
5. **NetEase API** (`https://api.vkeys.cn/v2/music/netease`)
6. **QQ Music API (oiapi.net)** (`https://oiapi.net/api/QQMusicLyric`)

Note: Third-party providers can be slower to respond than Spotify's native lyrics.

### Window not appearing?
- Click the music note icon in Spotify's top bar
- Check if popups are blocked in your system

### Extension not loading?
1. Verify the file is in the correct Extensions folder
2. Run `spicetify config extensions lyrics-overlay.js`
3. Run `spicetify apply`
4. Restart Spotify completely

## Uninstall

```bash
spicetify config extensions lyrics-overlay.js-
spicetify apply
```

## License

MIT License - Feel free to modify and share!

## Credits

- Built for [Spicetify](https://spicetify.app/)
- Uses Spotify's lyrics API
- Font: [DM Sans](https://fonts.google.com/specimen/DM+Sans)
