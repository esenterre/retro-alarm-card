# Changelog

All notable changes to **Retro Alarm Card** are documented in this file.

## v2026.9.2

1. **English Entity Defaults**:
   - The built-in default entity IDs are now English: `input_datetime.alarm_time` (time), `input_text.alarm_days` (days), `automation.bedroom_wake_up` (alarm toggle).
   - Existing dashboards are **unaffected**: the card keeps using whatever `entity_time` / `entity_days` / `entity_alarm` you already configured.

2. **Documentation Consistency**:
   - README, technical docs, and the preview page are now entirely in English, with matching example entity names throughout (see the "How to Use" section).

3. **Preview Page Cleanup**:
   - `preview.html` now uses the English example entities and labels.

## v2026.9.1

1. **Numeric Day Storage (`1..7`)**:
   - `entity_days` now stores active days as comma-separated numbers, `Monday = 1` ... `Sunday = 7` (e.g. `1, 2, 3, 4, 5`).
   - Completely language-independent storage: no more day-abbreviation aliases to maintain.
   - Even simpler automation condition: `{{ (now().weekday() + 1) | string in states('...') }}`.

2. **Legacy 7-Boolean Code Removed**:
   - Dropped the old `days: [{entity, label}]` backward-compatibility fallback and the default per-day `input_boolean` helper entities entirely.

3. **Unchanged on screen**: the retro day labels (`MON TUE WED ...`) are still shown in the current UI language — only the stored format changed.

4. **Fixes an encoding bug**: repaired the UTF-8 mojibake that corrupted accented characters and non-Latin text in `retro-alarm-card.js`.

## v2026.9.0

1. **Single `input_text` Day Management**:
   - Replaces 7 separate `input_boolean` helpers with a single text entity (e.g., `input_text.alarm_days`).
   - Tapping any day on the card updates the text entity automatically.

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