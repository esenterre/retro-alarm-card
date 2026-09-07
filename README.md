# Retro Alarm Card for Home Assistant

An elegant, minimalist Lovelace card that faithfully recreates the retro look of an 80s/90s digital clock radio with an amber 7-segment LED/VFD display.

![GitHub release (latest by date)](https://img.shields.io/github/v/release/esenterre/retro-alarm-card)
![GitHub](https://img.shields.io/github/license/esenterre/retro-alarm-card)

---

## Preview

![Retro Alarm Card Preview](images/preview.png)

---

## Features

- **Retro 7-segment display** — authentic amber LED/VFD clock-radio look.
- **Direct touch controls** — click or scroll directly on the digits to set the alarm time.
- **Interactive weekday selection** — toggle `MON` … `SUN` right on the display.
- **Alarm indicator** — tap the speaker icon to enable/disable the alarm.
- **12h / 24h formats** — configurable via `time_format`.
- **Configurable minute step** — `minute_step` (e.g. `1` or `5`).
- **Customizable looks** — digit `color` and italic `slant`.
- **Multilingual** — day labels in 10 languages.
- **Built-in visual editor** — configure the card from the Lovelace UI.
- **Native Home Assistant** — stores time and days in helpers, fires a standard automation.
- **Easy installation** — HACS or manual file.

---

## Motivation

I created this card because I was looking for a clean, straightforward way to manage my alarm clock directly from my Home Assistant dashboards (web & mobile). Existing options either relied on generic drop-down pickers or required separate controls for times and days.

The retro clock radio concept emerged naturally as the most intuitive interface for this: a self-contained card where you click or scroll directly on the digits to adjust time and toggle active days right on the display, making alarm management fast, simple, and functional.

---

## How It Works & Core Concept

The **Retro Alarm Card** offers a classic digital clock radio interface while leveraging native Home Assistant components:

- **Time Setting:** Uses an `input_datetime` entity to set and display your alarm time.
- **Day Selection:** Uses a single `input_text` entity (e.g. `input_text.alarm_days`) storing active days as comma-separated numbers (`1..7`, Monday=1, e.g. `1, 2, 3, 4, 5`). Tapping any day on the card toggles it in the text entity automatically!
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

## Requirements

- **Home Assistant** (2024.1.0 or later)
- **HACS** (recommended) or manual file installation
- An **`input_datetime`** helper for the alarm time
- An **`input_text`** helper for the active days (`1..7`)
- An **automation, switch or `input_boolean`** that actually fires the alarm

See the [How to Use](#how-to-use-getting-started) section for the full setup.

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
   - **Url**: `/local/retro-alarm-card.js?v=2026.9.2`
   - **Resource Type**: `JavaScript Module`
5. Save and refresh your browser (F5 or clear cache).

---

## How to Use (Getting Started)

The card is the **interface**: it stores the alarm time and the active days in helper entities, and it toggles an existing automation (or switch) that does the actual waking-up. The card alone does nothing — you need **two helpers and one automation**.

### Step 1 — Create the two helper entities

**Settings → Devices & Services → Helpers → + Create helper**:

| Helper | Settings | Example entity | Example value |
| --- | --- | --- | --- |
| **Date and time** (time only) | Name: `Alarm time` | `input_datetime.alarm_time` | `07:00` |
| **Text** | Name: `Alarm days` — text: `1, 2, 3, 4, 5` | `input_text.alarm_days` | `1, 2, 3, 4, 5` |

- **`input_datetime`** holds the alarm time that the card displays and lets you adjust.
- **`input_text`** holds the active days as comma-separated numbers where **Monday = 1 … Sunday = 7** (e.g. `1, 2, 3, 4, 5` = Monday to Friday). Tapping a day abbreviation on the card updates this value automatically.

> You can use whichever names/IDs you like — just copy your real entity IDs into the card config and the automation below.

### Step 2 — Add the card to your dashboard

Edit your dashboard → **Add card** → paste:

```yaml
type: custom:retro-alarm-card
entity_time: input_datetime.alarm_time
entity_alarm: automation.bedroom_wake_up
entity_days: input_text.alarm_days
```

`entity_alarm` can be an **automation**, **switch**, or **input_boolean** — the card turns it ON/OFF when you tap the alarm status indicator.

### Step 3 — Create the alarm automation

The automation gives the alarm its meaning: it fires each day at the time stored in the helper, and the condition makes sure it only runs on active days.

```yaml
alias: Bedroom :: Wake up
description: "Fires the alarm on active days only"
triggers:
  # Fires every day, at whatever time is stored in input_datetime.alarm_time
  - trigger: time
    at: input_datetime.alarm_time
conditions:
  # Only continue if today is an active day in input_text.alarm_days
  - condition: template
    value_template: >-
      {{ (now().weekday() + 1) | string in states('input_text.alarm_days') }}
actions:
  # Example action: play a radio stream. Replace with whatever you want to happen.
  - action: media_player.play_media
    target:
      entity_id: media_player.example_player
    data:
      media_content_id: https://playerservices.streamtheworld.com/api/livestream-redirect/CHMPFMAAC.aac
      media_content_type: music
mode: single
```

**How it works:**

- **Trigger** — `trigger: time` bound to the helper: the automation fires *every* day at the alarm time stored in `input_datetime.alarm_time`.
- **Condition** — `now().weekday()` returns `0` for Monday, so `+1` maps directly onto our `1..7` storage. The template checks whether today's number is present in `input_text.alarm_days`; if not, the automation stops right there.
- **Net effect** — the automation runs only on the days you enabled on the card, at the exact time you set.
- Tapping the alarm indicator (speaker icon) turns the `entity_alarm` automation/switch OFF, so nothing fires at all until you re-enable it.

---

## Example YAML Configuration

```yaml
type: custom:retro-alarm-card
entity_time: input_datetime.alarm_time
entity_alarm: automation.bedroom_wake_up
entity_days: input_text.alarm_days
alarm_label: alarm
color: '#ff9100'
time_format: '24h'
minute_step: 1
```

### Automation Trigger & Condition (Quick Reference)

`trigger: time` bound to the alarm-time helper fires every day; the template condition below filters out inactive days. See the [How to Use](#how-to-use-getting-started) section for the full walkthrough.

```yaml
triggers:
  - trigger: time
    at: input_datetime.alarm_time
conditions:
  - condition: template
    value_template: >-
      {{ (now().weekday() + 1) | string in states('input_text.alarm_days') }}
```

`now().weekday()` returns `0` for Monday, so `+1` maps directly onto our `1..7` storage (Monday = `1` … Sunday = `7`).

---

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entity_time` | string | `input_datetime.alarm_time` | Entity storing the alarm time |
| `entity_alarm` | string | `automation.bedroom_wake_up` | Alarm entity or automation switch |
| `entity_days` | string | `input_text.alarm_days` | Single `input_text` entity storing active day numbers (`1..7`, Monday=1) |
| `alarm_label` | string | `alarm` | Text displayed next to the sound icon |
| `color` | string | `#ff9100` | Digit color (amber `#ff9100`, green `#00ff66`, red `#ff3333`, etc.) |
| `time_format` | string | `24h` | Display format (`24h` or `12h`) |
| `minute_step` | number | `1` | Minute adjustment step per click (e.g., `1`, `5`) |
| `slant` | number | `0` | Slant angle in degrees (`0` for straight, `5` for natural right tilt) |
| `title` | string | `""` | Optional card title |

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for the complete version history (v2026.9.2, v2026.9.1, v2026.9.0, ...).

---

## Credits & Acknowledgments

- **Community Inspiration:** The underlying concept of combining `input_datetime` with boolean switches for alarm scheduling stems from various ideas and discussions across the [Home Assistant Community Forums](https://community.home-assistant.io/).
- **AI-Assisted Development:** The custom Lovelace JavaScript implementation, CSS styling, and retro LED 7-segment design were developed with the assistance of Google's Gemini AI. 
- **Project Direction:** Designed, directed, tested, and maintained by Éric Senterre.
