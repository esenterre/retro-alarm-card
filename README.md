# Retro Alarm Card for Home Assistant

An elegant, minimalist Lovelace card that faithfully recreates the retro look of an 80s/90s digital clock radio with an amber 7-segment LED/VFD display.

---

## Preview

![Retro Alarm Card Preview](images/preview.png)

---

## Motivation

I created this card because I was looking for a clean, straightforward way to manage my alarm clock directly from my Home Assistant dashboards (web & mobile). Existing options either relied on generic drop-down pickers or required separate controls for times and days.

The retro clock radio concept emerged naturally as the most intuitive interface for this: a self-contained card where you click or scroll directly on the digits to adjust time and toggle active days right on the display, making alarm management fast, simple, and functional.

---

## How It Works & Core Concept

The **Retro Alarm Card** offers a classic digital clock radio interface while leveraging native Home Assistant components:

- **Time Setting:** Uses an `input_datetime` entity to set and display your alarm time.
- **Day Selection:** Uses a single `input_text` entity (e.g. `input_text.reveil_matin_jours`) storing active days as a clean comma-separated string (e.g. `lun, mar, mer, jeu, ven` or `mon, tue, wed, thu, fri`). Tapping any day on the card toggles it in the text entity automatically! *(Legacy 7-boolean setups are also backward-compatible).*
- **Flexible Automation:** When the alarm triggers, it executes a standard Home Assistant **Automation**. This leaves total freedom on what happens when you wake up (play music, fade in lights, turn on the coffee maker, trigger TTS announcements, etc.).

---

## Interactive Controls

The card provides intuitive touch, click, and scroll controls directly on the display:

- **Setting the Alarm Time:**
  - **Hours:**
    - Click/tap the **Left Hour digit** to **increase** (+1 hour).
    - Click/tap the **Right Hour digit** to **decrease** (-1 hour).
  - **Minutes:**
    - Click/tap the **Left Minute digit** to **increase** by `minute_step`.
    - Click/tap the **Right Minute digit** to **decrease** by `minute_step`.
  - **Mouse Wheel (Desktop):** Scroll up or down directly over the hour or minute digits to adjust the time quickly.

- **Selecting Alarm Days:**
  - Click/tap on any **day abbreviation** (e.g., `MON`, `TUE`, `WED`) at the bottom of the display to toggle that day ON or OFF.
  - Active days appear bright, while inactive days are dimmed.
  - Changes are instantly saved into your `entity_days` (`input_text`) entity.

- **Enabling / Disabling the Alarm:**
  - Click/tap on the **Alarm status indicator** (the speaker icon and `alarm` label).
  - Toggling this turns the entire alarm automation/switch (`entity_alarm`) ON or OFF.

---

## Installation

### Method 1: Via HACS (Recommended)

1. Open **HACS** in your Home Assistant instance.
2. Click on the three dots in the top-right corner and select **Custom repositories**.
3. Add the repository URL:
   `https://github.com/esenterre/retro-alarm-card`
4. Set the category to **Dashboard** (or **Lovelace**) and click **Add**.
5. Search for **Retro Alarm Card** in HACS and click **Download**.
6. Restart Home Assistant or refresh your dashboard resources if prompted.

---

### Method 2: Manual Installation

1. Download the `retro-alarm-card.js` file from the [latest release](https://github.com/esenterre/retro-alarm-card/releases) or directly from this repository.
2. Copy `retro-alarm-card.js` into your Home Assistant `/config/www/` folder.
3. Go to **Settings** > **Dashboards** > **Three dots menu (top right)** > **Resources**.
4. Click **Add Resource** and configure:
   - **Url**: `/local/retro-alarm-card.js?v=2026.9.0`
   - **Resource Type**: `JavaScript Module`
5. Save and refresh your browser (F5 or clear cache).

---

## Example YAML Configuration

```yaml
type: custom:retro-alarm-card
entity_time: input_datetime.reveil_matin_heure
entity_alarm: automation.chambre_reveil_matin
entity_days: input_text.reveil_matin_jours
alarm_label: alarm
color: '#ff9100'
time_format: '24h'
minute_step: 1
```

### Automation Condition Example (Jinja2)

To check if today is an active alarm day in your Home Assistant automation, use this simple template condition:

```yaml
condition:
  - condition: template
    value_template: >-
      {{ ['lun','mar','mer','jeu','ven','sam','dim'][now().weekday()] in states('input_text.reveil_matin_jours') }}
```
*(Or in English: `{{ now().strftime('%a') | lower in states('input_text.reveil_matin_jours') }}`)*.

---

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entity_time` | string | `input_datetime.reveil_matin_heure` | Entity storing the alarm time |
| `entity_alarm` | string | `automation.chambre_reveil_matin` | Alarm entity or automation switch |
| `entity_days` | string | `input_text.reveil_matin_jours` | Single `input_text` entity storing active days |
| `alarm_label` | string | `alarm` | Text displayed next to the sound icon |
| `color` | string | `#ff9100` | Digit color (amber `#ff9100`, green `#00ff66`, red `#ff3333`, etc.) |
| `time_format` | string | `24h` | Display format (`24h` or `12h`) |
| `minute_step` | number | `1` | Minute adjustment step per click (e.g., `1`, `5`) |
| `slant` | number | `0` | Slant angle in degrees (`0` for straight, `5` for natural right tilt) |
| `title` | string | `""` | Optional card title |
| `days` | list | *(optional)* | Legacy fallback list of boolean entities |

---

## What's New in v2026.9.0

1. **Single `input_text` Day Management**:
   - Replaces 7 separate `input_boolean` helpers with a single text entity (e.g., `input_text.reveil_matin_jours`).
   - Stores active days as a clean, human-readable string (e.g. `lun, mar, mer, jeu, ven`).
   - Tapping any day on the card updates the text entity automatically. Full backward compatibility with 7-boolean setups is maintained.

2. **CalVer Versioning (Home Assistant Style)**:
   - Migrated to `YYYY.M.X` format (`2026.9.0`) matching Home Assistant standards.

3. **Uppercase Days of the Week**:
   - `MON  TUE  WED  THU  FRI  SAT  SUN` (and equivalents across 10 languages) for an authentic retro LED/VFD display style.
   - Optimized spacing to ensure no day name gets clipped on any screen width.

4. **Natural Slant (`slant`)**:
   - Positive values (e.g., `slant: 5`) tilt numbers naturally to the **right** (standard italic).

5. **Full Multilingual Support (10 Languages)**:
   - 🇬🇧 EN, 🇩🇪 DE, 🇫🇷 FR, 🇳🇱 NL, 🇪🇸 ES, 🇮🇹 IT, 🇵🇱 PL, 🇵🇹 PT, 🇷🇺 RU, 🇸🇪 SV.

6. **Sections Dashboard 12-Column Constraint**:
   - Automatically takes full 12-column width in Home Assistant Section layouts.

---

## Credits & Acknowledgments

- **Community Inspiration:** The underlying concept of combining `input_datetime` with boolean switches for alarm scheduling stems from various ideas and discussions across the [Home Assistant Community Forums](https://community.home-assistant.io/).
- **AI-Assisted Development:** The custom Lovelace JavaScript implementation, CSS styling, and retro LED 7-segment design were developed with the assistance of Google's Gemini AI. 
- **Project Direction:** Designed, directed, tested, and maintained by Éric Senterre.
