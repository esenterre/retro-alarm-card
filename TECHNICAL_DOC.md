# Retro Alarm Card — Technical Architecture & Developer Guide

> **Document Version:** 2026.9.1  
> **Author & Project Lead:** Éric Senterre  
> **Target Audience:** Future AI coding assistants, open-source contributors, and Home Assistant developers maintaining or extending this repository.

---

## 1. Project Overview & Vision

**Retro Alarm Card** is an authentic, standalone custom Lovelace card for [Home Assistant](https://www.home-assistant.io/) that recreates the physical aesthetic of an 1980s/1990s digital clock radio with an amber 7-segment LED/VFD display.

Key architectural goals:
- **Zero External Dependencies:** 100% vector SVG rendering. No external web fonts (like Orbitron or DSEG) to download, eliminating network latency and ensuring 100% offline LAN reliability.
- **Single-File Distribution:** All component logic, CSS, SVG geometry, multilingual translations, and visual editor live in `retro-alarm-card.js`. This guarantees bulletproof installation via HACS or manual copy without 404 missing asset errors.
- **Direct-Touch Ergonomics:** Tap left/right digits directly to increment/decrement hours or minutes, or use mouse wheel scrolling on desktop.
- **Single `input_text` Day Management:** Replaces 7 cumbersome `input_boolean` helper entities with a single text entity storing comma-separated numeric active days `1..7` (e.g., `"1, 2, 3, 4, 5"` for Mon-Fri). Language-independent storage, no aliases required.

---

## 2. File Structure

```text
retro-alarm-card/
├── .git/                      # Git repository
├── hacs.json                  # HACS distribution configuration
├── icon.png                   # Custom icon used automatically by HACS (root placement)
├── LICENSE                    # Standard MIT open-source license
├── README.md                  # User-facing installation and usage guide
├── TECHNICAL_DOC.md           # This document (technical specification for developers & AIs)
├── preview.html               # Standalone browser test harness for UI/CSS/interactive testing
├── images/
│   └── preview.png            # Visual preview screenshot for README and HACS
└── retro-alarm-card.js        # Main bundled custom card + visual editor component
```

---

## 3. Core Architecture & Web Components

The card is implemented as two native Web Components extending `HTMLElement`:

1. **`RetroAlarmCard` (`<retro-alarm-card>`)**:
   - The user-facing dashboard card.
   - Renders inside an isolated **Shadow DOM** (`this.attachShadow({ mode: 'open' })`) to prevent Home Assistant theme style leakage.
   - Implements standard Home Assistant card lifecycle methods: `setConfig(config)`, `set hass(hass)`, `getCardSize()`, `static getLayoutOptions()`, and `static getConfigElement()`.

2. **`RetroAlarmCardEditor` (`<retro-alarm-card-editor>`)**:
   - The GUI configuration editor rendered when editing the card in Lovelace.
   - Leverages Home Assistant's native `<ha-form>` component with schema-driven validation, entity selectors, and dropdowns.
   - Emits `config-changed` custom events with bubbling and composed flags to update the YAML and live preview in real time.

---

## 4. State Management & Data Flow

### 4.1. Entities & Data Binding

| Config Parameter | Default Value | Target HA Domain | Purpose |
| :--- | :--- | :--- | :--- |
| `entity_time` | `input_datetime.reveil_matin_heure` | `input_datetime` | Stores alarm time in `HH:MM:SS` or `HH:MM`. |
| `entity_alarm` | `automation.chambre_reveil_matin` | `automation`, `switch`, `input_boolean` | Master alarm switch/automation toggled on/off. |
| `entity_days` | `input_text.reveil_matin_jours` | `input_text`, `text` | Comma-separated list of active day numbers (`1..7`, Monday=1). |

### 4.2. Time Parsing & 12h/24h Conversion

- **Time Extraction:** `states[entity_time].state` is split by `:` into integers `_hours` (0–23) and `_minutes` (0–59).
- **Format Toggle (`time_format`):**
  - `'24h'` (Default): Hours display directly `00`–`23`. The right-side `.right-indicators` (`am`/`pm`) element receives CSS class `hidden` (`display: none;`), perfectly centering the digits on screen.
  - `'12h'`: `displayHour = _hours % 12 || 12`. If `_hours >= 12`, `#tagPm` is illuminated (`.on`), otherwise `#tagAm` is illuminated.
- **Time Stepping:**
  - `_stepTime(deltaH, deltaM)` recalculates `h = (hours + deltaH + 24) % 24` and `m = (minutes + deltaM + 60) % 60`.
  - Sends a service call:
    ```javascript
    this._hass.callService('input_datetime', 'set_datetime', {
      entity_id: this._config.entity_time,
      time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
    });
    ```

### 4.3. Single `input_text` Numeric Day Storage Engine

To eliminate the need for 7 separate `input_boolean` entities, `entity_days` stores active days as a clean numeric string, completely independent of the user's display language:
- **String Format:** Comma-separated ISO 8601 day numbers, `Monday = 1` .. `Sunday = 7`, sorted ascending: e.g., `"1, 2, 3, 4, 5"` for a Mon-Fri schedule.
- **Numeric Parsing:** When evaluating active days, `_isDayActive(dayIndex)` splits `states[entity_days].state` on `[,\s]+` and checks whether token `String(dayIndex + 1)` is present.
- **Language-Independent:** Because the storage is purely numeric, no aliases or per-language translation maps are needed. The UI *display* labels (e.g., `LUN`, `MAR`, `MER`) still come from `I18N[lang].days` and are purely cosmetic.
- **Toggling & Serialization:**
  When day `idx` is tapped:
  1. Gathers all active indices (0..6) with day `idx` toggled.
  2. Sorts indices ascending (e.g., `[0, 1, 2, 4]`).
  3. Maps indices to numbers (`i + 1`).
  4. Calls `input_text.set_value`:
     ```javascript
     this._hass.callService('input_text', 'set_value', {
       entity_id: this._config.entity_days,
       value: activeIndices.map(i => i + 1).join(', ')
     });
     ```
- **Jinja2 Automation Template Example (for HA Users):**
  ```jinja2
  condition:
    - condition: template
      value_template: >-
        {{ (now().weekday() + 1) | string in states('input_text.reveil_matin_jours') }}
  ```
  `now().weekday()` returns `0` for Monday, so adding `1` maps directly onto our `1..7` storage.

---

## 5. Visual Rendering & SVG 7-Segment Geometry

### 5.1. Polygon Coordinates (`viewBox="0 0 50 88"`)

Each digital digit renders all 7 segments permanently. Inactive segments have `fill: rgba(255, 145, 0, 0.08)` to simulate the authentic unlit physical segment shadow. Active segments have `.seg.on` with neon glow filters.

```
      ── a ──
   │           │
   f           b
   │           │
      ── g ──
   │           │
   e           c
   │           │
      ── d ──
```

- **Segment a (top horizontal):** `points="9,6 41,6 35,12 15,12"`
- **Segment b (top-right vertical):** `points="38,14 44,8 44,41 38,36"`
- **Segment c (bottom-right vertical):** `points="38,52 44,47 44,80 38,74"`
- **Segment d (bottom horizontal):** `points="15,76 35,76 41,82 9,82"`
- **Segment e (bottom-left vertical):** `points="6,47 12,52 12,74 6,80"`
- **Segment f (top-left vertical):** `points="6,8 12,14 12,36 6,41"`
- **Segment g (middle horizontal):** `points="10,44 14,41 36,41 40,44 36,47 14,47"`

### 5.2. Slant Transformation Inversion

In CSS, positive `skewX(+5deg)` leans elements to the left, which is unintuitive for users expecting standard italic tilt (leaning to the right).
- The card inverts the config value:
  ```javascript
  const slantDeg = this._config.slant ? -Number(this._config.slant) : 0;
  const slantTransform = slantDeg ? `skewX(${slantDeg}deg)` : 'none';
  ```
- Result:
  - `slant: 0` = Perfectly vertical upright digits (default).
  - `slant: 5` = Natural italic tilt leaning to the **right**.

### 5.3. Colon Dots `:`

Rendered as static, non-blinking 8px square dots with 2px corner radius and amber glow. Blinking was intentionally removed because this card displays a static scheduled alarm time, not a live ticking clock.

### 5.4. Responsive Design (`clamp()`)

To ensure flawless display across compact mobile screens (320px–360px), multi-column grids, and wide desktop views:
- Digits: `width: clamp(38px, 12vw, 62px); height: clamp(66px, 21vw, 106px);`
- Colon: `width: clamp(14px, 4vw, 22px); gap: clamp(14px, 4vw, 22px);`
- Footer Days: `font-size: clamp(9px, 2.3vw, 10.5px); padding: 3px clamp(2px, 0.8vw, 4px);`
- `overflow: hidden` is omitted from `.days-list` to prevent clipping the 7th day (Dimanche/Sunday).

---

## 6. Internationalization (i18n) Engine

The card automatically detects the user's active Home Assistant interface language via:
```javascript
function getLang(hass) {
  const l = (hass && (hass.locale?.language || hass.language)) || 'en';
  const prefix = l.split('-')[0].toLowerCase();
  return I18N[prefix] ? prefix : 'en';
}
```

### Supported Languages (10 Most Popular in Home Assistant)

1. `en` — English
2. `de` — Deutsch
3. `fr` — Français
4. `nl` — Nederlands
5. `es` — Español
6. `it` — Italiano
7. `pl` — Polski
8. `pt` — Português
9. `ru` — Русский
10. `sv` — Svenska

### Adding an 11th Language

To add a new language (e.g., Norwegian `no` or Danish `da`):
1. Open `retro-alarm-card.js`.
2. In `const I18N = { ... }`, add a new key with `days`, tooltips, editor labels, and helpers.

*No storage-code map is required: since `2026.9.1`, day storage is numeric (`1..7`), so translations only affect the on-screen labels.*

---

## 7. Visual Editor (`RetroAlarmCardEditor`)

The visual editor uses Home Assistant's native `<ha-form>` component:
```javascript
static async getConfigElement() {
  return document.createElement('retro-alarm-card-editor');
}
```

The editor provides:
- Title input
- Entity selector for `entity_time` (`domain: 'input_datetime'`)
- Entity selector for `entity_alarm` (`domain: ['automation', 'switch', 'input_boolean']`)
- Entity selector for `entity_days` (`domain: ['input_text', 'text']`)
- Select dropdown for `time_format` (`24h` vs `12h`)
- Select dropdown for `color` with 5 neon presets (Amber, Red, Green, Blue/Cyan, White)
- Number box for `minute_step` (1–30)
- Number box for `slant` (-10 to 10)
- Text input for `alarm_label`

Dynamic labels and helper text are dispatched via:
```javascript
form.computeLabel = (s) => s.label || s.name;
form.computeHelper = (s) => s.helper || '';
```

### 7.1. Critical Pattern: `_initDom()` + `_updateForm()` (No `innerHTML` Recreation)

> **⚠️ Known Pitfall for HA Card Editors:** Never call `this.shadowRoot.innerHTML = ...` inside `set hass(hass)`. Home Assistant calls `set hass()` on **every state change** across the entire dashboard. Recreating `innerHTML` destroys and re-creates the `<ha-form>` element each time, which:
> - Kills focus on any active input field
> - Closes any open dropdown immediately after the user clicks it
> - Results in the editor appearing unresponsive (click, dropdown opens, dropdown closes instantly)

**Solution implemented in `RetroAlarmCardEditor`:**

```javascript
constructor() {
  super();
  this.attachShadow({ mode: 'open' });
  this._initDom(); // Write DOM exactly ONCE
}

_initDom() {
  this.shadowRoot.innerHTML = `<ha-form></ha-form>`;
  this._formEl = this.shadowRoot.querySelector('ha-form');
  this._formEl.computeLabel = (s) => s.label || s.name;
  this._formEl.computeHelper = (s) => s.helper || '';
  this._formEl.addEventListener('value-changed', (e) => {
    this._config = { ...this._config, ...e.detail.value };
    this.dispatchEvent(new CustomEvent('config-changed',
      { detail: { config: this._config }, bubbles: true, composed: true }));
  });
}

set hass(hass) {
  this._hass = hass;
  this._updateForm(); // Only update properties on the EXISTING <ha-form>
}

setConfig(config) {
  this._config = config;
  this._updateForm();
}

_updateForm() {
  if (!this._formEl || !this._hass) return;
  this._formEl.hass   = this._hass;
  this._formEl.schema = this._buildSchema();
  this._formEl.data   = { ...this._config };
}
```

**Rule of thumb:** The `<ha-form>` element must be created **once** and kept alive. Only its `.hass`, `.schema`, and `.data` properties should be updated on subsequent calls.

---

## 8. Dashboard Layout & Sections Mode Compatibility

In modern Home Assistant dashboard **Sections view**:
```javascript
static getLayoutOptions() {
  return {
    grid_columns: 12,
    grid_min_columns: 12,
    grid_rows: 'auto',
    grid_min_rows: 3
  };
}
```
This forces the card to take the full width of a section (12 columns) when dropped into a Sections layout, preventing it from being accidentally squeezed into an unreadable 3-column sub-slot.

---

## 9. HACS & Release Management Guide

### 9.1. Avoiding Hexadecimal Version Strings in HACS

> **Crucial Rule:** If you push commits to GitHub without creating a Git Release/Tag, HACS falls back to showing the **Git Commit Hash** (e.g., `a7b3c9e`).

To release a clean version (e.g., `2026.9.0`):
1. Ensure `CARD_VERSION = '2026.9.0'` in `retro-alarm-card.js`.
2. Commit and push all changes to the `main` branch.
3. On GitHub, navigate to **Releases** > **Draft a new release**.
4. Set **Tag version** to `2026.9.0` (or `v2026.9.0`).
5. Set **Release title** to `2026.9.0`.
6. Click **Publish release**.
7. HACS will immediately recognize the release tag and display `2026.9.0` to all users.

### 9.2. `hacs.json` Structure
```json
{
  "name": "Retro Alarm Card",
  "filename": "retro-alarm-card.js",
  "render_readme": true,
  "content_in_root": true,
  "homeassistant": "2024.1.0"
}
```
- `content_in_root: true`: Informs HACS that the distribution `.js` file is located at the repository root.
- `icon.png`: Placed in the repository root; automatically picked up by HACS as the repository avatar icon.

### 9.3. Automated Versioning with `bump-version.ps1`

The repository includes a PowerShell helper script to automate the full versioning workflow:

```
bump-version.ps1
```

**Usage:**
```powershell
# Auto-increment patch number (2026.9.0 → 2026.9.1)
.\bump-version.ps1

# Set an explicit version
.\bump-version.ps1 -Version 2026.9.2

# Bump + immediately push to GitHub
.\bump-version.ps1 -Version 2026.9.1 -Push
```

**What it does:**
1. Reads `CARD_VERSION` from `retro-alarm-card.js`
2. Updates the version string in both the JSDoc header comment and the `const CARD_VERSION` line
3. Runs `git add retro-alarm-card.js` and `git commit -m "chore: bump version to X"`
4. Creates an annotated Git tag (`git tag -a X -m "Release X"`)
5. Optionally runs `git push origin main && git push origin X`

**After running (without `-Push`):**
```powershell
git push origin main && git push origin 2026.9.1
```
Then go to **GitHub › Releases › Draft a new release**, pick the new tag, and click **Publish release** so HACS shows a clean version number.

