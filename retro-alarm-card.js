/**
 * Retro Alarm Clock Card for Home Assistant
 * Version: 2026.9.1
 * 
 * An authentic 7-segment digital LED/VFD alarm clock card with direct-touch controls,
 * single input_text day storage, multilingual visual editor, and full HACS compatibility.
 */

const CARD_VERSION = '2026.9.1';
console.info(
  `%c RETRO-ALARM-CARD %c v${CARD_VERSION} `,
  'color: #121212; background: #ff9100; font-weight: bold; border-radius: 4px 0 0 4px;',
  'color: #ffffff; background: #252830; font-weight: bold; border-radius: 0 4px 4px 0;'
);

const SEGMENTS_MAP = {
  '0': ['a', 'b', 'c', 'd', 'e', 'f'],
  '1': ['b', 'c'],
  '2': ['a', 'b', 'g', 'e', 'd'],
  '3': ['a', 'b', 'g', 'c', 'd'],
  '4': ['f', 'g', 'b', 'c'],
  '5': ['a', 'f', 'g', 'c', 'd'],
  '6': ['a', 'f', 'g', 'e', 'c', 'd'],
  '7': ['a', 'b', 'c'],
  '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  '9': ['a', 'b', 'c', 'd', 'f', 'g']
};

/**
 * Aliases reconnus pour chaque jour (0 = Lundi ... 6 = Dimanche)
 * Permet de reconnaÃ®tre n'importe quel code de jour dans l'entitÃ© input_text.
 */
const DAY_ALIASES = [
  ['1', 'mon', 'monday', 'lun', 'lundi', 'mo', 'ma', 'pn', 'pon', 'seg', 'Ð¿Ð½', 'mÃ¥n', 'man'],
  ['2', 'tue', 'tuesday', 'mar', 'mardi', 'di', 'wt', 'ter', 'Ð²Ñ‚', 'tis'],
  ['3', 'wed', 'wednesday', 'mer', 'mercredi', 'mi', 'wo', 'Å›r', 'sr', 'qua', 'ÑÑ€', 'ons'],
  ['4', 'thu', 'thursday', 'jeu', 'jeudi', 'do', 'cz', 'czw', 'qui', 'Ñ‡Ñ‚', 'tor'],
  ['5', 'fri', 'friday', 'ven', 'vendredi', 'fr', 'vr', 'pt', 'sex', 'Ð¿Ñ‚', 'fre'],
  ['6', 'sat', 'saturday', 'sam', 'samedi', 'sa', 'za', 'sÃ¡b', 'sab', 'sb', 'sob', 'ÑÐ±', 'lÃ¶r', 'lor'],
  ['7', 'sun', 'sunday', 'dim', 'dimanche', 'so', 'zo', 'dom', 'nd', 'nie', 'Ð²Ñ', 'sÃ¶n', 'son']
];

const CODES_MAP = {
  fr: ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'],
  en: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  de: ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'],
  nl: ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
  es: ['lun', 'mar', 'miÃ©', 'jue', 'vie', 'sÃ¡b', 'dom'],
  it: ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'],
  pl: ['pn', 'wt', 'Å›r', 'cz', 'pt', 'sb', 'nd'],
  pt: ['seg', 'ter', 'qua', 'qui', 'sex', 'sÃ¡b', 'dom'],
  ru: ['Ð¿Ð½', 'Ð²Ñ‚', 'ÑÑ€', 'Ñ‡Ñ‚', 'Ð¿Ñ‚', 'ÑÐ±', 'Ð²Ñ'],
  sv: ['mÃ¥n', 'tis', 'ons', 'tor', 'fre', 'lÃ¶r', 'sÃ¶n']
};

/**
 * Dictionnaire multilingue 10 langues (les plus populaires sur Home Assistant)
 */
const I18N = {
  fr: {
    days: ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'],
    h_up_tip: 'Heures : cliquer pour augmenter (+1h)',
    h_down_tip: 'Heures : cliquer pour diminuer (-1h)',
    m_up_tip: (step) => `Minutes : cliquer pour augmenter (+${step}m)`,
    m_down_tip: (step) => `Minutes : cliquer pour diminuer (-${step}m)`,
    alarm_tip: 'Activer / DÃ©sactiver le rÃ©veil',
    title_label: 'Titre de la carte (optionnel)',
    title_helper: "Texte d'en-tÃªte affichÃ© au-dessus de l'Ã©cran",
    entity_time_label: 'Heure de rÃ©veil programmÃ©e',
    entity_time_helper: "EntitÃ© input_datetime contenant l'heure programmÃ©e",
    entity_alarm_label: "Automatisation ou commutateur d'alarme",
    entity_alarm_helper: 'Automatisation ou switch dÃ©clenchant la sonnerie du rÃ©veil',
    entity_days_label: "Jours d'alarme actifs (input_text)",
    entity_days_helper: "EntitÃ© texte unique contenant les jours actifs (ex: lun, mar, mer, jeu, ven)",
    time_format_label: "Format de l'heure",
    time_format_helper: 'Affichage 24 Heures Ã©purÃ© ou 12 Heures avec tÃ©moins AM / PM',
    format_24h: '24 Heures (ex: 19:15 - sans AM/PM)',
    format_12h: '12 Heures (ex: 07:15 pm - avec AM/PM)',
    color_label: 'Couleur des segments LED',
    color_helper: 'Couleur nÃ©on rÃ©tro des chiffres et des tÃ©moins',
    color_amber: 'ðŸŸ  Ambre Vintage (DÃ©faut)',
    color_red: 'ðŸ”´ Rouge LED',
    color_green: 'ðŸŸ¢ Vert RÃ©tro',
    color_blue: 'ðŸ”µ Bleu / Cyan VFD',
    color_white: 'âšª Blanc Froid',
    minute_step_label: 'IncrÃ©ment des minutes par clic',
    minute_step_helper: 'Nombre de minutes ajoutÃ©es ou retirÃ©es Ã  chaque clic (ex: 1 ou 5)',
    slant_label: 'Inclinaison des chiffres (degrÃ©s)',
    slant_helper: '0 pour droit, 5 pour une inclinaison naturelle vers la droite (style italique)',
    alarm_label_label: 'Texte du tÃ©moin alarme',
    alarm_label_helper: "Mot affichÃ© Ã  cÃ´tÃ© de l'icÃ´ne sonore (dÃ©faut : alarm)"
  },
  en: {
    days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    h_up_tip: 'Hours: click to increase (+1h)',
    h_down_tip: 'Hours: click to decrease (-1h)',
    m_up_tip: (step) => `Minutes: click to increase (+${step}m)`,
    m_down_tip: (step) => `Minutes: click to decrease (-${step}m)`,
    alarm_tip: 'Toggle alarm on / off',
    title_label: 'Card title (optional)',
    title_helper: 'Header text displayed above the clock screen',
    entity_time_label: 'Alarm Time Entity',
    entity_time_helper: 'input_datetime entity holding the scheduled alarm time',
    entity_alarm_label: 'Alarm Automation or Switch',
    entity_alarm_helper: 'Automation or switch that triggers the alarm sound',
    entity_days_label: 'Active Alarm Days Entity (input_text)',
    entity_days_helper: 'Single text entity storing active days as a comma-separated string (e.g. mon, tue, wed, thu, fri)',
    time_format_label: 'Time Format',
    time_format_helper: 'Clean 24-hour display or 12-hour display with AM/PM tags',
    format_24h: '24 Hours (e.g. 19:15 - without AM/PM)',
    format_12h: '12 Hours (e.g. 07:15 pm - with AM/PM)',
    color_label: 'LED Segment Color',
    color_helper: 'Neon retro glow color for digits and indicators',
    color_amber: 'ðŸŸ  Vintage Amber (Default)',
    color_red: 'ðŸ”´ LED Red',
    color_green: 'ðŸŸ¢ Retro Green',
    color_blue: 'ðŸ”µ VFD Blue / Cyan',
    color_white: 'âšª Cool White',
    minute_step_label: 'Minute step per click',
    minute_step_helper: 'Number of minutes added or subtracted on each click (e.g. 1 or 5)',
    slant_label: 'Digit slant (degrees)',
    slant_helper: '0 for upright straight, 5 for natural tilt to the right (italic)',
    alarm_label_label: 'Alarm indicator label',
    alarm_label_helper: 'Word next to soundwave icon (default: alarm)'
  },
  de: {
    days: ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'],
    h_up_tip: 'Stunden: Klicken zum ErhÃ¶hen (+1h)',
    h_down_tip: 'Stunden: Klicken zum Verringern (-1h)',
    m_up_tip: (step) => `Minuten: Klicken zum ErhÃ¶hen (+${step}m)`,
    m_down_tip: (step) => `Minuten: Klicken zum Verringern (-${step}m)`,
    alarm_tip: 'Wecker ein- / ausschalten',
    title_label: 'Kartentitel (optional)',
    title_helper: 'Kopfzeilentext Ã¼ber der Weckeranzeige',
    entity_time_label: 'Weckzeit-EntitÃ¤t',
    entity_time_helper: 'input_datetime-EntitÃ¤t fÃ¼r die eingestellte Weckzeit',
    entity_alarm_label: 'Wecker-Automation oder Schalter',
    entity_alarm_helper: 'Automation oder Schalter, der den Wecker auslÃ¶st',
    entity_days_label: 'Aktive Wecktage (input_text)',
    entity_days_helper: 'Text-EntitÃ¤t mit aktiven Tagen kommagetrennt (z.B. mo, di, mi, do, fr)',
    time_format_label: 'Zeitformat',
    time_format_helper: 'Kompaktes 24h-Format oder 12h mit AM/PM',
    format_24h: '24 Stunden (z.B. 19:15 - ohne AM/PM)',
    format_12h: '12 Stunden (z.B. 07:15 pm - mit AM/PM)',
    color_label: 'LED-Segmentfarbe',
    color_helper: 'Retro-Leuchtfarbe fÃ¼r Ziffern und Symbole',
    color_amber: 'ðŸŸ  Vintage Bernstein (Standard)',
    color_red: 'ðŸ”´ LED Rot',
    color_green: 'ðŸŸ¢ Retro GrÃ¼n',
    color_blue: 'ðŸ”µ VFD Blau / Cyan',
    color_white: 'âšª KaltweiÃŸ',
    minute_step_label: 'Minutenschritt pro Klick',
    minute_step_helper: 'Anzahl der Minuten pro Klick (z.B. 1 oder 5)',
    slant_label: 'Ziffernneigung (Grad)',
    slant_helper: '0 fÃ¼r gerade, 5 fÃ¼r Neigung nach rechts (kursiv)',
    alarm_label_label: 'Text der Alarmanzeige',
    alarm_label_helper: 'Text neben dem Tonsymbol (Standard: alarm)'
  },
  nl: {
    days: ['MA', 'DI', 'WO', 'DO', 'VR', 'ZA', 'ZO'],
    h_up_tip: 'Uren: klik om te verhogen (+1u)',
    h_down_tip: 'Uren: klik om te verlagen (-1u)',
    m_up_tip: (step) => `Minuten: klik om te verhogen (+${step}m)`,
    m_down_tip: (step) => `Minuten: klik om te verlagen (-${step}m)`,
    alarm_tip: 'Wekker in- / uitschakelen',
    title_label: 'Kaarttitel (optioneel)',
    title_helper: 'Koptekst weergegeven boven de klok',
    entity_time_label: 'Wektijd-entiteit',
    entity_time_helper: 'input_datetime-entiteit met de ingestelde wektijd',
    entity_alarm_label: 'Wekkerautomatisering of schakelaar',
    entity_alarm_helper: 'Automatisering of schakelaar die het alarm activeert',
    entity_days_label: 'Actieve wekdagen (input_text)',
    entity_days_helper: 'Tekst-entiteit met actieve dagen door komma\'s gescheiden (bijv. ma, di, wo, do, vr)',
    time_format_label: 'Tijdnotatie',
    time_format_helper: 'Strakke 24-uursweergave of 12-uurs met AM/PM',
    format_24h: '24 Uur (bijv. 19:15 - zonder AM/PM)',
    format_12h: '12 Uur (bijv. 07:15 pm - met AM/PM)',
    color_label: 'LED-segmentkleur',
    color_helper: 'Retro-gloedkleur voor cijfers en indicatoren',
    color_amber: 'ðŸŸ  Vintage Barnsteen (Standaard)',
    color_red: 'ðŸ”´ LED Rood',
    color_green: 'ðŸŸ¢ Retro Groen',
    color_blue: 'ðŸ”µ VFD Blauw / Cyaan',
    color_white: 'âšª Koel Wit',
    minute_step_label: 'Minutenstap per klik',
    minute_step_helper: 'Aantal minuten toegevoegd of afgetrokken per klik',
    slant_label: 'Cijferhelling (graden)',
    slant_helper: '0 voor rechtop, 5 voor schuin naar rechts (cursief)',
    alarm_label_label: 'Tekst van wekkerindicator',
    alarm_label_helper: 'Tekst naast het geluidspictogram (standaard: alarm)'
  },
  es: {
    days: ['LUN', 'MAR', 'MIÃ‰', 'JUE', 'VIE', 'SÃB', 'DOM'],
    h_up_tip: 'Horas: clic para aumentar (+1h)',
    h_down_tip: 'Horas: clic para disminuir (-1h)',
    m_up_tip: (step) => `Minutos: clic para aumentar (+${step}m)`,
    m_down_tip: (step) => `Minutos: clic para disminuir (-${step}m)`,
    alarm_tip: 'Activar / desactivar alarma',
    title_label: 'TÃ­tulo de la tarjeta (opcional)',
    title_helper: 'Texto de cabecera mostrado encima del reloj',
    entity_time_label: 'Entidad de hora de alarma',
    entity_time_helper: 'Entidad input_datetime con la hora programada',
    entity_alarm_label: 'AutomatizaciÃ³n o interruptor de alarma',
    entity_alarm_helper: 'AutomatizaciÃ³n o interruptor que activa el sonido de la alarma',
    entity_days_label: 'DÃ­as de alarma activos (input_text)',
    entity_days_helper: 'Entidad de texto con dÃ­as activos separados por comas (ej: lun, mar, miÃ©, jue, vie)',
    time_format_label: 'Formato de hora',
    time_format_helper: 'VisualizaciÃ³n 24h limpia o 12h con AM/PM',
    format_24h: '24 Horas (ej: 19:15 - sin AM/PM)',
    format_12h: '12 Horas (ej: 07:15 pm - con AM/PM)',
    color_label: 'Color de segmentos LED',
    color_helper: 'Color de brillo retro para dÃ­gitos e indicadores',
    color_amber: 'ðŸŸ  Ãmbar Vintage (Predeterminado)',
    color_red: 'ðŸ”´ LED Rojo',
    color_green: 'ðŸŸ¢ Verde Retro',
    color_blue: 'ðŸ”µ VFD Azul / Cian',
    color_white: 'âšª Blanco FrÃ­o',
    minute_step_label: 'Paso de minutos por clic',
    minute_step_helper: 'Minutos que se aÃ±aden o restan en cada clic',
    slant_label: 'InclinaciÃ³n de dÃ­gitos (grados)',
    slant_helper: '0 para vertical, 5 para inclinaciÃ³n a la derecha (cursiva)',
    alarm_label_label: 'Etiqueta del indicador de alarma',
    alarm_label_helper: 'Texto junto al icono de sonido (predeterminado: alarm)'
  },
  it: {
    days: ['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'],
    h_up_tip: 'Ore: clicca per aumentare (+1h)',
    h_down_tip: 'Ore: clicca per diminuire (-1h)',
    m_up_tip: (step) => `Minuti: clicca per aumentare (+${step}m)`,
    m_down_tip: (step) => `Minuti: clicca per diminuire (-${step}m)`,
    alarm_tip: 'Attiva / Disattiva la sveglia',
    title_label: 'Titolo scheda (opzionale)',
    title_helper: "Testo dell'intestazione sopra l'orologio",
    entity_time_label: 'EntitÃ  ora sveglia',
    entity_time_helper: "EntitÃ  input_datetime contenente l'ora programmata",
    entity_alarm_label: 'Automazione o interruttore sveglia',
    entity_alarm_helper: 'Automazione o interruttore che fa suonare la sveglia',
    entity_days_label: 'Giorni di sveglia attivi (input_text)',
    entity_days_helper: 'EntitÃ  di testo con giorni attivi separati da virgola (es: lun, mar, mer, gio, ven)',
    time_format_label: 'Formato ora',
    time_format_helper: 'Visualizzazione pulita a 24 ore o a 12 ore con AM/PM',
    format_24h: '24 Ore (es: 19:15 - senza AM/PM)',
    format_12h: '12 Ore (es: 07:15 pm - con AM/PM)',
    color_label: 'Colore dei segmenti LED',
    color_helper: 'Colore fluorescente retrÃ² per cifre e icone',
    color_amber: 'ðŸŸ  Ambra Vintage (Predefinito)',
    color_red: 'ðŸ”´ LED Rosso',
    color_green: 'ðŸŸ¢ Verde RetrÃ²',
    color_blue: 'ðŸ”µ VFD Blu / Ciano',
    color_white: 'âšª Bianco Freddo',
    minute_step_label: 'Passo minuti per clic',
    minute_step_helper: 'Minuti aggiunti o sottratti a ogni clic',
    slant_label: 'Inclinazione cifre (gradi)',
    slant_helper: '0 per dritto, 5 per inclinazione verso destra (corsivo)',
    alarm_label_label: 'Etichetta indicatore allarme',
    alarm_label_helper: "Testo accanto all'icona del suono (predefinito: alarm)"
  },
  pl: {
    days: ['PN', 'WT', 'ÅšR', 'CZ', 'PT', 'SB', 'ND'],
    h_up_tip: 'Godziny: kliknij, aby zwiÄ™kszyÄ‡ (+1h)',
    h_down_tip: 'Godziny: kliknij, aby zmniejszyÄ‡ (-1h)',
    m_up_tip: (step) => `Minuty: kliknij, aby zwiÄ™kszyÄ‡ (+${step}m)`,
    m_down_tip: (step) => `Minuty: kliknij, aby zmniejszyÄ‡ (-${step}m)`,
    alarm_tip: 'WÅ‚Ä…cz / WyÅ‚Ä…cz budzik',
    title_label: 'TytuÅ‚ karty (opcjonalny)',
    title_helper: 'Tekst nagÅ‚Ã³wka wyÅ›wietlany nad ekranem budzika',
    entity_time_label: 'Encja czasu budzika',
    entity_time_helper: 'Encja input_datetime zawierajÄ…ca czas budzika',
    entity_alarm_label: 'Automatyzacja lub przeÅ‚Ä…cznik budzika',
    entity_alarm_helper: 'Automatyzacja lub przeÅ‚Ä…cznik uruchamiajÄ…cy budzik',
    entity_days_label: 'Aktywne dni budzika (input_text)',
    entity_days_helper: 'Encja tekstowa z aktywnymi dniami oddzielonymi przecinkami (np. pn, wt, Å›r, cz, pt)',
    time_format_label: 'Format czasu',
    time_format_helper: 'Czysty format 24h lub 12h ze wskaÅºnikami AM/PM',
    format_24h: '24 Godziny (np. 19:15 - bez AM/PM)',
    format_12h: '12 Godzin (np. 07:15 pm - z AM/PM)',
    color_label: 'Kolor segmentÃ³w LED',
    color_helper: 'Kolor Å›wiecenia cyfr i wskaÅºnikÃ³w retro',
    color_amber: 'ðŸŸ  Bursztyn Vintage (DomyÅ›lny)',
    color_red: 'ðŸ”´ Czerwony LED',
    color_green: 'ðŸŸ¢ Zielony Retro',
    color_blue: 'ðŸ”µ VFD Niebieski / Cyjan',
    color_white: 'âšª Zimny BiaÅ‚y',
    minute_step_label: 'Krok minut na klikniÄ™cie',
    minute_step_helper: 'Liczba minut dodawanych lub odejmowanych przy klikniÄ™ciu',
    slant_label: 'Pochylenie cyfr (stopnie)',
    slant_helper: '0 dla prostych cyfr, 5 dla pochylenia w prawo (kursywa)',
    alarm_label_label: 'Etykieta wskaÅºnika budzika',
    alarm_label_helper: 'Tekst obok ikony dÅºwiÄ™ku (domyÅ›lnie: alarm)'
  },
  pt: {
    days: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÃB', 'DOM'],
    h_up_tip: 'Horas: clique para aumentar (+1h)',
    h_down_tip: 'Horas: clique para diminuir (-1h)',
    m_up_tip: (step) => `Minutos: clique para aumentar (+${step}m)`,
    m_down_tip: (step) => `Minutos: clique para diminuir (-${step}m)`,
    alarm_tip: 'Ligar / Desligar alarme',
    title_label: 'TÃ­tulo do cartÃ£o (opcional)',
    title_helper: 'Texto de cabeÃ§alho acima do ecrÃ£',
    entity_time_label: 'Entidade de hora do alarme',
    entity_time_helper: 'Entidade input_datetime com a hora definida',
    entity_alarm_label: 'AutomaÃ§Ã£o ou interruptor do alarme',
    entity_alarm_helper: 'AutomaÃ§Ã£o ou interruptor que dispara o alarme',
    entity_days_label: 'Dias de alarme ativos (input_text)',
    entity_days_helper: 'Entidade de texto com os dias ativos separados por vÃ­rgulas (ex: seg, ter, qua, qui, sex)',
    time_format_label: 'Formato da hora',
    time_format_helper: 'ExibiÃ§Ã£o limpa de 24h ou 12h com AM/PM',
    format_24h: '24 Horas (ex: 19:15 - sem AM/PM)',
    format_12h: '12 Horas (ex: 07:15 pm - com AM/PM)',
    color_label: 'Cor dos segmentos LED',
    color_helper: 'Cor de brilho retro para dÃ­gitos e indicadores',
    color_amber: 'ðŸŸ  Ã‚mbar Vintage (PadrÃ£o)',
    color_red: 'ðŸ”´ LED Vermelho',
    color_green: 'ðŸŸ¢ Verde Retro',
    color_blue: 'ðŸ”µ VFD Azul / Ciano',
    color_white: 'âšª Branco Frio',
    minute_step_label: 'Passo de minutos por clique',
    minute_step_helper: 'Minutos adicionados ou subtraÃ­dos por clique',
    slant_label: 'InclinaÃ§Ã£o dos dÃ­gitos (graus)',
    slant_helper: '0 para vertical, 5 para inclinaÃ§Ã£o para a direita (itÃ¡lico)',
    alarm_label_label: 'RÃ³tulo do indicador de alarme',
    alarm_label_helper: 'Texto ao lado do Ã­cone sonoro (padrÃ£o: alarm)'
  },
  ru: {
    days: ['ÐŸÐ', 'Ð’Ð¢', 'Ð¡Ð ', 'Ð§Ð¢', 'ÐŸÐ¢', 'Ð¡Ð‘', 'Ð’Ð¡'],
    h_up_tip: 'Ð§Ð°ÑÑ‹: Ð½Ð°Ð¶Ð¼Ð¸Ñ‚Ðµ Ð´Ð»Ñ ÑƒÐ²ÐµÐ»Ð¸Ñ‡ÐµÐ½Ð¸Ñ (+1Ñ‡)',
    h_down_tip: 'Ð§Ð°ÑÑ‹: Ð½Ð°Ð¶Ð¼Ð¸Ñ‚Ðµ Ð´Ð»Ñ ÑƒÐ¼ÐµÐ½ÑŒÑˆÐµÐ½Ð¸Ñ (-1Ñ‡)',
    m_up_tip: (step) => `ÐœÐ¸Ð½ÑƒÑ‚Ñ‹: Ð½Ð°Ð¶Ð¼Ð¸Ñ‚Ðµ Ð´Ð»Ñ ÑƒÐ²ÐµÐ»Ð¸Ñ‡ÐµÐ½Ð¸Ñ (+${step}Ð¼)`,
    m_down_tip: (step) => `ÐœÐ¸Ð½ÑƒÑ‚Ñ‹: Ð½Ð°Ð¶Ð¼Ð¸Ñ‚Ðµ Ð´Ð»Ñ ÑƒÐ¼ÐµÐ½ÑŒÑˆÐµÐ½Ð¸Ñ (-${step}Ð¼)`,
    alarm_tip: 'Ð’ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ / Ð’Ñ‹ÐºÐ»ÑŽÑ‡Ð¸Ñ‚ÑŒ Ð±ÑƒÐ´Ð¸Ð»ÑŒÐ½Ð¸Ðº',
    title_label: 'Ð—Ð°Ð³Ð¾Ð»Ð¾Ð²Ð¾Ðº ÐºÐ°Ñ€Ñ‚Ð¾Ñ‡ÐºÐ¸ (Ð½ÐµÐ¾Ð±ÑÐ·Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð¾)',
    title_helper: 'Ð¢ÐµÐºÑÑ‚ Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ° Ð½Ð°Ð´ ÑÐºÑ€Ð°Ð½Ð¾Ð¼ Ð±ÑƒÐ´Ð¸Ð»ÑŒÐ½Ð¸ÐºÐ°',
    entity_time_label: 'ÐžÐ±ÑŠÐµÐºÑ‚ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸ Ð±ÑƒÐ´Ð¸Ð»ÑŒÐ½Ð¸ÐºÐ°',
    entity_time_helper: 'ÐžÐ±ÑŠÐµÐºÑ‚ input_datetime Ñ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ‹Ð¼ Ð²Ñ€ÐµÐ¼ÐµÐ½ÐµÐ¼',
    entity_alarm_label: 'ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¸Ð»Ð¸ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°Ñ‚ÐµÐ»ÑŒ Ð±ÑƒÐ´Ð¸Ð»ÑŒÐ½Ð¸ÐºÐ°',
    entity_alarm_helper: 'ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð¸Ð»Ð¸ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°Ñ‚ÐµÐ»ÑŒ, Ð·Ð°Ð¿ÑƒÑÐºÐ°ÑŽÑ‰Ð¸Ð¹ ÑÐ¸Ð³Ð½Ð°Ð»',
    entity_days_label: 'ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ðµ Ð´Ð½Ð¸ Ð±ÑƒÐ´Ð¸Ð»ÑŒÐ½Ð¸ÐºÐ° (input_text)',
    entity_days_helper: 'Ð¢ÐµÐºÑÑ‚Ð¾Ð²Ñ‹Ð¹ Ð¾Ð±ÑŠÐµÐºÑ‚ ÑÐ¾ ÑÐ¿Ð¸ÑÐºÐ¾Ð¼ Ð°ÐºÑ‚Ð¸Ð²Ð½Ñ‹Ñ… Ð´Ð½ÐµÐ¹ Ñ‡ÐµÑ€ÐµÐ· Ð·Ð°Ð¿ÑÑ‚ÑƒÑŽ (Ð½Ð°Ð¿Ñ€. Ð¿Ð½, Ð²Ñ‚, ÑÑ€, Ñ‡Ñ‚, Ð¿Ñ‚)',
    time_format_label: 'Ð¤Ð¾Ñ€Ð¼Ð°Ñ‚ Ð²Ñ€ÐµÐ¼ÐµÐ½Ð¸',
    time_format_helper: 'Ð§Ð¸ÑÑ‚Ñ‹Ð¹ 24-Ñ‡Ð°ÑÐ¾Ð²Ð¾Ð¹ Ñ„Ð¾Ñ€Ð¼Ð°Ñ‚ Ð¸Ð»Ð¸ 12-Ñ‡Ð°ÑÐ¾Ð²Ð¾Ð¹ Ñ Ð¸Ð½Ð´Ð¸ÐºÐ°Ñ‚Ð¾Ñ€Ð°Ð¼Ð¸ AM/PM',
    format_24h: '24 Ð§Ð°ÑÐ° (Ð½Ð°Ð¿Ñ€. 19:15 - Ð±ÐµÐ· AM/PM)',
    format_12h: '12 Ð§Ð°ÑÐ¾Ð² (Ð½Ð°Ð¿Ñ€. 07:15 pm - Ñ AM/PM)',
    color_label: 'Ð¦Ð²ÐµÑ‚ ÑÐµÐ³Ð¼ÐµÐ½Ñ‚Ð¾Ð² LED',
    color_helper: 'Ð ÐµÑ‚Ñ€Ð¾-Ñ†Ð²ÐµÑ‚ ÑÐ²ÐµÑ‡ÐµÐ½Ð¸Ñ Ñ†Ð¸Ñ„Ñ€ Ð¸ Ð¸Ð½Ð´Ð¸ÐºÐ°Ñ‚Ð¾Ñ€Ð¾Ð²',
    color_amber: 'ðŸŸ  Ð’Ð¸Ð½Ñ‚Ð°Ð¶Ð½Ñ‹Ð¹ ÑÐ½Ñ‚Ð°Ñ€ÑŒ (ÐŸÐ¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ)',
    color_red: 'ðŸ”´ ÐšÑ€Ð°ÑÐ½Ñ‹Ð¹ LED',
    color_green: 'ðŸŸ¢ Ð ÐµÑ‚Ñ€Ð¾ Ð·ÐµÐ»ÐµÐ½Ñ‹Ð¹',
    color_blue: 'ðŸ”µ VFD Ð¡Ð¸Ð½Ð¸Ð¹ / Ð“Ð¾Ð»ÑƒÐ±Ð¾Ð¹',
    color_white: 'âšª Ð¥Ð¾Ð»Ð¾Ð´Ð½Ñ‹Ð¹ Ð±ÐµÐ»Ñ‹Ð¹',
    minute_step_label: 'Ð¨Ð°Ð³ Ð¼Ð¸Ð½ÑƒÑ‚ Ð·Ð° ÐºÐ»Ð¸Ðº',
    minute_step_helper: 'ÐšÐ¾Ð»Ð¸Ñ‡ÐµÑÑ‚Ð²Ð¾ Ð¼Ð¸Ð½ÑƒÑ‚, Ð´Ð¾Ð±Ð°Ð²Ð»ÑÐµÐ¼Ñ‹Ñ… Ð¸Ð»Ð¸ ÑƒÐ±Ð°Ð²Ð»ÑÐµÐ¼Ñ‹Ñ… Ð·Ð° ÐºÐ»Ð¸Ðº',
    slant_label: 'ÐÐ°ÐºÐ»Ð¾Ð½ Ñ†Ð¸Ñ„Ñ€ (Ð² Ð³Ñ€Ð°Ð´ÑƒÑÐ°Ñ…)',
    slant_helper: '0 - Ð¿Ñ€ÑÐ¼Ð¾, 5 - Ð½Ð°ÐºÐ»Ð¾Ð½ Ð²Ð¿Ñ€Ð°Ð²Ð¾ (ÐºÑƒÑ€ÑÐ¸Ð²)',
    alarm_label_label: 'Ð¢ÐµÐºÑÑ‚ Ð¸Ð½Ð´Ð¸ÐºÐ°Ñ‚Ð¾Ñ€Ð° Ð±ÑƒÐ´Ð¸Ð»ÑŒÐ½Ð¸ÐºÐ°',
    alarm_label_helper: 'Ð¡Ð»Ð¾Ð²Ð¾ Ñ€ÑÐ´Ð¾Ð¼ ÑÐ¾ Ð·Ð½Ð°Ñ‡ÐºÐ¾Ð¼ Ð·Ð²ÑƒÐºÐ° (Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡.: alarm)'
  },
  sv: {
    days: ['MÃ…N', 'TIS', 'ONS', 'TOR', 'FRE', 'LÃ–R', 'SÃ–N'],
    h_up_tip: 'Timmar: klicka fÃ¶r att Ã¶ka (+1h)',
    h_down_tip: 'Timmar: klicka fÃ¶r att minska (-1h)',
    m_up_tip: (step) => `Minuter: klicka fÃ¶r att Ã¶ka (+${step}m)`,
    m_down_tip: (step) => `Minuter: klicka fÃ¶r att minska (-${step}m)`,
    alarm_tip: 'SlÃ¥ pÃ¥ / av larm',
    title_label: 'Korttitel (valfritt)',
    title_helper: 'Rubriktext som visas ovanfÃ¶r klockskÃ¤rmen',
    entity_time_label: 'Larmtidsentitet',
    entity_time_helper: 'input_datetime-entitet med instÃ¤lld larmtid',
    entity_alarm_label: 'Larmautomatisering eller brytare',
    entity_alarm_helper: 'Automatisering eller brytare som utlÃ¶ser larmet',
    entity_days_label: 'Aktiva larmdagar (input_text)',
    entity_days_helper: 'Textentitet som sparar aktiva dagar separerade med kommatecken (t.ex. mÃ¥n, tis, ons, tor, fre)',
    time_format_label: 'Tidsformat',
    time_format_helper: 'StÃ¤dad 24h-visning eller 12h med AM/PM-taggar',
    format_24h: '24 Timmar (t.ex. 19:15 - utan AM/PM)',
    format_12h: '12 Timmar (t.ex. 07:15 pm - med AM/PM)',
    color_label: 'LED-segmentfÃ¤rg',
    color_helper: 'Retro-glÃ¶dfÃ¤rg fÃ¶r siffror och indikatorer',
    color_amber: 'ðŸŸ  Vintage BÃ¤rnsten (Standard)',
    color_red: 'ðŸ”´ LED RÃ¶d',
    color_green: 'ðŸŸ¢ Retro GrÃ¶n',
    color_blue: 'ðŸ”µ VFD BlÃ¥ / Cyan',
    color_white: 'âšª Kallvit',
    minute_step_label: 'Minutsteg per klick',
    minute_step_helper: 'Antal minuter som lÃ¤ggs till eller dras ifrÃ¥n per klick',
    slant_label: 'Sifferlutning (grader)',
    slant_helper: '0 fÃ¶r rakt, 5 fÃ¶r lutning Ã¥t hÃ¶ger (kursiv)',
    alarm_label_label: 'Larmindikatorns text',
    alarm_label_helper: 'Text bredvid ljudikonen (standard: alarm)'
  }
};

function getLang(hass) {
  const l = (hass && (hass.locale?.language || hass.language)) || 'en';
  const prefix = l.split('-')[0].toLowerCase();
  return I18N[prefix] ? prefix : 'en';
}

function getTranslation(hass, key, arg) {
  const lang = getLang(hass);
  const dict = I18N[lang] || I18N.en;
  const val = dict[key] !== undefined ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
  return typeof val === 'function' ? val(arg) : val;
}

const DEFAULT_ENTITIES_DAYS = [
  'input_boolean.reveil_lundi',
  'input_boolean.reveil_mardi',
  'input_boolean.reveil_mercredi',
  'input_boolean.reveil_jeudi',
  'input_boolean.reveil_vendredi',
  'input_boolean.reveil_samedi',
  'input_boolean.reveil_dimanche'
];

class RetroAlarmCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._rendered = false;
    this._hours = 7;
    this._minutes = 0;
    this._alarmOn = false;
  }

  static async getConfigElement() {
    return document.createElement('retro-alarm-card-editor');
  }

  static getStubConfig() {
    return {
      entity_time: 'input_datetime.reveil_matin_heure',
      entity_alarm: 'automation.chambre_reveil_matin',
      entity_days: 'input_text.reveil_matin_jours',
      alarm_label: 'alarm',
      time_format: '24h',
      color: '#ff9100',
      minute_step: 1
    };
  }

  static getLayoutOptions() {
    return {
      grid_columns: 12,
      grid_min_columns: 12,
      grid_rows: 'auto',
      grid_min_rows: 3
    };
  }

  setConfig(config) {
    this._config = {
      title: config.title || '',
      entity_time: config.entity_time || 'input_datetime.reveil_matin_heure',
      entity_alarm: config.entity_alarm || 'automation.chambre_reveil_matin',
      entity_days: config.entity_days !== undefined ? config.entity_days : 'input_text.reveil_matin_jours',
      alarm_label: config.alarm_label || 'alarm',
      time_format: config.time_format || '24h',
      color: config.color || '#ff9100',
      slant: config.slant !== undefined ? Number(config.slant) : 0,
      minute_step: Number(config.minute_step) || 1,
      hour_step: Number(config.hour_step) || 1,
      days: config.days,
      ...config
    };

    if (this._rendered) {
      this._updateContent();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this._renderCard();
      this._rendered = true;
    }
    this._updateContent();
  }

  getCardSize() {
    return 3;
  }

  _renderDigitSvg(id, title) {
    return `
      <svg class="segment-digit" id="${id}" viewBox="0 0 50 88" title="${title || ''}">
        <polygon id="${id}_a" class="seg" points="9,6 41,6 35,12 15,12" />
        <polygon id="${id}_b" class="seg" points="38,14 44,8 44,41 38,36" />
        <polygon id="${id}_c" class="seg" points="38,52 44,47 44,80 38,74" />
        <polygon id="${id}_d" class="seg" points="15,76 35,76 41,82 9,82" />
        <polygon id="${id}_e" class="seg" points="6,47 12,52 12,74 6,80" />
        <polygon id="${id}_f" class="seg" points="6,8 12,14 12,36 6,41" />
        <polygon id="${id}_g" class="seg" points="10,44 14,41 36,41 40,44 36,47 14,47" />
      </svg>
    `;
  }

  _renderCard() {
    const hUpTip = getTranslation(this._hass, 'h_up_tip');
    const hDownTip = getTranslation(this._hass, 'h_down_tip');
    const mStep = this._config.minute_step || 1;
    const mUpTip = getTranslation(this._hass, 'm_up_tip', mStep);
    const mDownTip = getTranslation(this._hass, 'm_down_tip', mStep);
    const alarmTip = getTranslation(this._hass, 'alarm_tip');

    // Inversion du slant : une valeur positive (ex: 5) fait pencher vers la droite (italique standard)
    const slantDeg = this._config.slant ? -Number(this._config.slant) : 0;
    const slantTransform = slantDeg ? `skewX(${slantDeg}deg)` : 'none';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --clock-color: ${this._config.color || '#ff9100'};
          --clock-dim: rgba(255, 145, 0, 0.08);
          --clock-glow: rgba(255, 145, 0, 0.55);
          --clock-red: #ff3b30;
          --clock-red-dim: rgba(255, 59, 48, 0.15);
          --clock-red-glow: rgba(255, 59, 48, 0.6);
          --card-bg: var(--ha-card-background, #101216);
          user-select: none;
          -webkit-user-select: none;
          width: 100%;
          box-sizing: border-box;
        }

        .card-container {
          background: #181b22;
          border-radius: 20px;
          padding: 12px;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
          width: 100%;
          position: relative;
        }

        .card-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #8c93a0;
          margin-bottom: 8px;
          padding-left: 6px;
        }

        .retro-screen {
          background: radial-gradient(circle at 50% 30%, #11141a 0%, #050608 100%);
          border-radius: 14px;
          padding: 18px clamp(8px, 2.5vw, 18px) 14px;
          border: 2px solid #232732;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 4px 16px rgba(0, 0, 0, 0.9);
          box-sizing: border-box;
        }

        /* Effet de reflet de vitre subtil */
        .retro-screen::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 46%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 65%);
          pointer-events: none;
          z-index: 5;
        }

        /* RangÃ©e principale d'affichage de l'heure */
        .time-display-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(3px, 1.5vw, 6px);
          position: relative;
          padding: 6px 0 12px;
          z-index: 2;
        }

        .digit-pair {
          display: flex;
          align-items: center;
          gap: clamp(2px, 1vw, 4px);
        }

        /* 7-segments SVG - Grands, Cliquables et Responsive */
        .segment-digit {
          width: clamp(38px, 12vw, 62px);
          height: clamp(66px, 21vw, 106px);
          transform: ${slantTransform};
          display: inline-block;
          cursor: pointer;
          border-radius: 8px;
          padding: 2px;
          box-sizing: border-box;
          transition: transform 0.1s ease, filter 0.15s ease, background 0.2s ease;
        }

        .segment-digit:hover {
          background: rgba(255, 145, 0, 0.07);
          filter: brightness(1.2);
        }

        .segment-digit:active {
          transform: scale(0.94);
        }

        .seg {
          fill: var(--clock-dim);
          transition: fill 0.1s, filter 0.1s;
        }

        .seg.on {
          fill: var(--clock-color);
          filter: drop-shadow(0 0 3px var(--clock-color)) drop-shadow(0 0 10px var(--clock-glow));
        }

        /* SÃ©parateur deux points - Fixe */
        .colon-separator {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: clamp(14px, 4vw, 22px);
          width: clamp(14px, 4vw, 22px);
          height: clamp(66px, 21vw, 106px);
          transform: ${slantTransform};
        }

        .colon-dot {
          width: clamp(6px, 1.8vw, 8px);
          height: clamp(6px, 1.8vw, 8px);
          border-radius: 2px;
          background: var(--clock-color);
          box-shadow: 0 0 3px var(--clock-color), 0 0 8px var(--clock-color);
        }

        /* Indicateurs Ã  droite (AM/PM) */
        .right-indicators {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          margin-left: clamp(4px, 1.5vw, 8px);
          height: clamp(60px, 20vw, 100px);
          gap: clamp(4px, 1.5vw, 8px);
          font-family: 'Courier New', Courier, monospace;
          font-weight: 700;
          font-size: clamp(11px, 2.8vw, 14px);
          padding-top: 4px;
          transition: opacity 0.2s;
        }

        .right-indicators.hidden {
          display: none;
        }

        .ampm-tag {
          color: var(--clock-dim);
          text-transform: lowercase;
          letter-spacing: 1px;
        }

        .ampm-tag.on {
          color: var(--clock-color);
          text-shadow: 0 0 6px var(--clock-color);
        }

        /* RangÃ©e infÃ©rieure : Jours de semaine en Majuscules + Alarme (jamais coupÃ©e) */
        .footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          padding-top: 12px;
          padding-left: clamp(2px, 0.8vw, 6px);
          padding-right: clamp(2px, 0.8vw, 6px);
          margin-top: 6px;
          z-index: 2;
          position: relative;
          gap: 4px;
          box-sizing: border-box;
        }

        .days-list {
          display: flex;
          gap: clamp(1px, 0.8vw, 3px);
          flex-wrap: nowrap;
          align-items: center;
          flex-shrink: 1;
          min-width: 0;
        }

        .day-item {
          font-size: clamp(9px, 2.3vw, 10.5px);
          font-weight: 700;
          letter-spacing: 0.5px;
          color: rgba(255, 145, 0, 0.2);
          cursor: pointer;
          padding: 3px clamp(2px, 0.8vw, 4px);
          border-radius: 4px;
          transition: all 0.2s;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .day-item:hover {
          color: rgba(255, 145, 0, 0.5);
          background: rgba(255, 145, 0, 0.05);
        }

        .day-item.active {
          color: var(--clock-color);
          text-shadow: 0 0 5px var(--clock-color), 0 0 12px var(--clock-color);
        }

        /* Bouton Alarme */
        .alarm-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 3px clamp(3px, 1vw, 6px);
          border-radius: 6px;
          font-size: clamp(10px, 2.4vw, 12px);
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          color: var(--clock-red-dim);
          white-space: nowrap;
          flex-shrink: 0;
          margin-left: auto;
        }

        .alarm-indicator svg {
          width: clamp(12px, 2.8vw, 15px);
          height: clamp(12px, 2.8vw, 15px);
          fill: currentColor;
          transition: fill 0.2s;
        }

        .alarm-indicator:hover {
          background: rgba(255, 59, 48, 0.1);
        }

        .alarm-indicator.active {
          color: var(--clock-red);
          text-shadow: 0 0 6px var(--clock-red), 0 0 14px var(--clock-red-glow);
        }

        .alarm-indicator.active svg {
          filter: drop-shadow(0 0 4px var(--clock-red));
        }
      </style>

      <div class="card-container">
        ${this._config.title ? `<div class="card-title">${this._config.title}</div>` : ''}
        
        <div class="retro-screen">
          
          <div class="time-display-row">
            
            <!-- Paire Heures (Gauche: +1h, Droite: -1h) -->
            <div class="digit-pair" id="hourPair">
              ${this._renderDigitSvg('h1', hUpTip)}
              ${this._renderDigitSvg('h2', hDownTip)}
            </div>

            <!-- SÃ©parateur : (fixe) -->
            <div class="colon-separator">
              <div class="colon-dot"></div>
              <div class="colon-dot"></div>
            </div>

            <!-- Paire Minutes (Gauche: +1m, Droite: -1m) -->
            <div class="digit-pair" id="minPair">
              ${this._renderDigitSvg('m1', mUpTip)}
              ${this._renderDigitSvg('m2', mDownTip)}
            </div>

            <!-- Indicateurs AM / PM -->
            <div class="right-indicators" id="rightIndicators">
              <span class="ampm-tag" id="tagAm">am</span>
              <span class="ampm-tag" id="tagPm">pm</span>
            </div>

          </div>

          <!-- Jours de semaine et bouton alarme -->
          <div class="footer-row">
            <div class="days-list" id="daysList"></div>

            <div class="alarm-indicator" id="alarmToggle" title="${alarmTip}">
              <!-- IcÃ´ne d'ondes sonores rÃ©tro -->
              <svg viewBox="0 0 24 24">
                <path d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20.07,3.93L18.66,5.34C19.97,7.03 20.78,9.15 20.78,11.45C20.78,13.75 19.97,15.87 18.66,17.56L20.07,18.97C21.75,16.89 22.78,14.28 22.78,11.45C22.78,8.62 21.75,6.01 20.07,3.93M3.93,3.93C2.25,6.01 1.22,8.62 1.22,11.45C1.22,14.28 2.25,16.89 3.93,18.97L5.34,17.56C4.03,15.87 3.22,13.75 3.22,11.45C3.22,9.15 4.03,7.03 5.34,5.34L3.93,3.93Z" />
              </svg>
              <span id="alarmLabel">${this._config.alarm_label || 'alarm'}</span>
            </div>
          </div>

        </div>

      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const root = this.shadowRoot;

    const hStep = this._config.hour_step || 1;
    const mStep = this._config.minute_step || 1;

    // Heure Gauche = +1h
    root.getElementById('h1').addEventListener('click', (e) => {
      e.stopPropagation();
      this._stepTime(hStep, 0);
    });

    // Heure Droite = -1h
    root.getElementById('h2').addEventListener('click', (e) => {
      e.stopPropagation();
      this._stepTime(-hStep, 0);
    });

    // Minute Gauche = +minute_step
    root.getElementById('m1').addEventListener('click', (e) => {
      e.stopPropagation();
      this._stepTime(0, mStep);
    });

    // Minute Droite = -minute_step
    root.getElementById('m2').addEventListener('click', (e) => {
      e.stopPropagation();
      this._stepTime(0, -mStep);
    });

    // Support molette de la souris sur PC Desktop
    root.getElementById('hourPair').addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) this._stepTime(hStep, 0);
      else this._stepTime(-hStep, 0);
    }, { passive: false });

    root.getElementById('minPair').addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) this._stepTime(0, mStep);
      else this._stepTime(0, -mStep);
    }, { passive: false });

    // Alarme Toggle
    root.getElementById('alarmToggle').addEventListener('click', () => {
      this._toggleEntity(this._config.entity_alarm);
    });
  }

  _updateContent() {
    if (!this._hass || !this._config) return;

    // RÃ©cupÃ©rer l'heure
    const timeEntity = this._hass.states[this._config.entity_time];
    if (timeEntity && timeEntity.state) {
      const parts = timeEntity.state.split(':');
      if (parts.length >= 2) {
        this._hours = parseInt(parts[0], 10) || 0;
        this._minutes = parseInt(parts[1], 10) || 0;
      }
    }

    // RÃ©cupÃ©rer l'Ã©tat de l'alarme
    const alarmEntity = this._hass.states[this._config.entity_alarm];
    this._alarmOn = alarmEntity ? alarmEntity.state === 'on' : false;

    // Format 12h vs 24h
    let displayHour = this._hours;
    const is12h = this._config.time_format === '12h';
    const isPm = this._hours >= 12;

    const rightIndicators = this.shadowRoot.getElementById('rightIndicators');
    const tagAm = this.shadowRoot.getElementById('tagAm');
    const tagPm = this.shadowRoot.getElementById('tagPm');

    if (is12h) {
      if (rightIndicators) rightIndicators.classList.remove('hidden');
      displayHour = this._hours % 12;
      if (displayHour === 0) displayHour = 12;

      if (tagAm && tagPm) {
        if (isPm) {
          tagAm.classList.remove('on');
          tagPm.classList.add('on');
        } else {
          tagAm.classList.add('on');
          tagPm.classList.remove('on');
        }
      }
    } else {
      // En mode 24h, on masque AM/PM pour aÃ©rer et centrer
      if (rightIndicators) rightIndicators.classList.add('hidden');
    }

    // Mettre Ã  jour l'affichage des chiffres 7 segments
    const hStr = String(displayHour).padStart(2, '0');
    const mStr = String(this._minutes).padStart(2, '0');

    this._drawDigit('h1', hStr[0]);
    this._drawDigit('h2', hStr[1]);
    this._drawDigit('m1', mStr[0]);
    this._drawDigit('m2', mStr[1]);

    // Mettre Ã  jour l'indicateur d'alarme
    const alarmToggle = this.shadowRoot.getElementById('alarmToggle');
    if (alarmToggle) {
      alarmToggle.classList.toggle('active', this._alarmOn);
    }

    // Mettre Ã  jour les jours de la semaine
    this._updateDays();
  }

  _drawDigit(prefix, char) {
    const activeSegs = SEGMENTS_MAP[char] || [];
    ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach((seg) => {
      const el = this.shadowRoot.getElementById(`${prefix}_${seg}`);
      if (el) {
        if (activeSegs.includes(seg)) {
          el.classList.add('on');
        } else {
          el.classList.remove('on');
        }
      }
    });
  }

  /**
   * VÃ©rifie si un jour (0 = Lundi ... 6 = Dimanche) est actif
   */
  _isDayActive(dayIndex) {
    // Mode rÃ©tro-compatible 1 : liste explicite d'entitÃ©s 'days'
    if (this._config.days && Array.isArray(this._config.days) && this._config.days[dayIndex]) {
      const entityId = this._config.days[dayIndex].entity;
      return this._hass?.states[entityId]?.state === 'on';
    }

    // Mode moderne 2 : entitÃ© unique input_text
    if (this._config.entity_days && this._hass?.states[this._config.entity_days]) {
      const raw = (this._hass.states[this._config.entity_days].state || '').toLowerCase();
      const tokens = raw.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
      const aliases = DAY_ALIASES[dayIndex] || [];
      return tokens.some(tok => aliases.includes(tok));
    }

    // Mode rÃ©tro-compatible 3 : 7 entitÃ©s boolÃ©ennes par dÃ©faut
    const defaultEntity = DEFAULT_ENTITIES_DAYS[dayIndex];
    if (defaultEntity && this._hass?.states[defaultEntity]) {
      return this._hass.states[defaultEntity].state === 'on';
    }

    return false;
  }

  /**
   * Bascule l'Ã©tat d'un jour (0..6)
   */
  _toggleDay(dayIndex) {
    if (!this._hass) return;

    // Si l'usager a dÃ©fini explicitement 'days' avec des entitÃ©s boolÃ©ennes
    if (this._config.days && Array.isArray(this._config.days) && this._config.days[dayIndex]) {
      this._toggleEntity(this._config.days[dayIndex].entity);
      return;
    }

    // Si une entitÃ© unique input_text est configurÃ©e (mode moderne)
    if (this._config.entity_days) {
      const activeIndices = [];
      for (let i = 0; i < 7; i++) {
        const isActive = this._isDayActive(i);
        if (i === dayIndex) {
          if (!isActive) activeIndices.push(i);
        } else {
          if (isActive) activeIndices.push(i);
        }
      }
      activeIndices.sort((a, b) => a - b);

      const lang = getLang(this._hass);
      const codes = CODES_MAP[lang] || CODES_MAP.en;
      const newString = activeIndices.map(i => codes[i]).join(', ');

      this._hass.callService('input_text', 'set_value', {
        entity_id: this._config.entity_days,
        value: newString
      });
      return;
    }

    // Fallback boolÃ©en par dÃ©faut
    if (DEFAULT_ENTITIES_DAYS[dayIndex]) {
      this._toggleEntity(DEFAULT_ENTITIES_DAYS[dayIndex]);
    }
  }

  _updateDays() {
    const daysContainer = this.shadowRoot.getElementById('daysList');
    if (!daysContainer) return;

    daysContainer.innerHTML = '';
    const dayLabels = getTranslation(this._hass, 'days');

    for (let idx = 0; idx < 7; idx++) {
      let label = dayLabels[idx] || `J${idx + 1}`;
      if (this._config.days && Array.isArray(this._config.days) && this._config.days[idx]?.label) {
        label = this._config.days[idx].label;
      }

      const isActive = this._isDayActive(idx);

      const span = document.createElement('span');
      span.className = `day-item ${isActive ? 'active' : ''}`;
      span.textContent = String(label).toUpperCase();
      span.title = `${label} : ${isActive ? 'ON' : 'OFF'}`;
      span.addEventListener('click', () => {
        this._toggleDay(idx);
      });

      daysContainer.appendChild(span);
    }
  }

  _toggleEntity(entityId) {
    if (!this._hass || !entityId) return;
    const domain = entityId.split('.')[0];
    const serviceDomain = ['input_boolean', 'automation', 'switch', 'light'].includes(domain) ? domain : 'homeassistant';
    this._hass.callService(serviceDomain, 'toggle', { entity_id: entityId });
  }

  _stepTime(deltaH, deltaM) {
    let h = (this._hours + deltaH + 24) % 24;
    let m = (this._minutes + deltaM + 60) % 60;
    this._setTime(h, m);
  }

  _setTime(h, m) {
    if (!this._hass || !this._config.entity_time) return;

    this._hours = h;
    this._minutes = m;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;

    this._hass.callService('input_datetime', 'set_datetime', {
      entity_id: this._config.entity_time,
      time: timeStr
    });
  }
}

/**
 * Ã‰diteur Visuel Lovelace Multilingue pour RetroAlarmCard
 */
class RetroAlarmCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._formEl = null;
    this._initDom();
  }

  _initDom() {
    this.shadowRoot.innerHTML = `
      <style>
        .editor-container {
          padding: 8px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      </style>
      <div class="editor-container">
        <ha-form id="haForm"></ha-form>
      </div>
    `;
    this._formEl = this.shadowRoot.getElementById('haForm');
    this._formEl.computeLabel = (s) => s.label || s.name;
    this._formEl.computeHelper = (s) => s.helper || '';
    this._formEl.addEventListener('value-changed', (ev) => {
      this._valueChanged(ev);
    });
  }

  setConfig(config) {
    this._config = { ...config };
    this._updateForm();
  }

  set hass(hass) {
    this._hass = hass;
    this._updateForm();
  }

  _getSchema() {
    const t = (key, arg) => getTranslation(this._hass, key, arg);
    return [
      {
        name: 'title',
        label: t('title_label'),
        helper: t('title_helper'),
        selector: { text: {} }
      },
      {
        name: 'entity_time',
        label: t('entity_time_label'),
        helper: t('entity_time_helper'),
        selector: { entity: { domain: 'input_datetime' } }
      },
      {
        name: 'entity_alarm',
        label: t('entity_alarm_label'),
        helper: t('entity_alarm_helper'),
        selector: { entity: { domain: ['automation', 'switch', 'input_boolean'] } }
      },
      {
        name: 'entity_days',
        label: t('entity_days_label'),
        helper: t('entity_days_helper'),
        selector: { entity: { domain: ['input_text', 'text'] } }
      },
      {
        name: 'time_format',
        label: t('time_format_label'),
        helper: t('time_format_helper'),
        selector: {
          select: {
            options: [
              { value: '24h', label: t('format_24h') },
              { value: '12h', label: t('format_12h') }
            ]
          }
        }
      },
      {
        name: 'color',
        label: t('color_label'),
        helper: t('color_helper'),
        selector: {
          select: {
            options: [
              { value: '#ff9100', label: t('color_amber') },
              { value: '#ff3b30', label: t('color_red') },
              { value: '#00e676', label: t('color_green') },
              { value: '#00e5ff', label: t('color_blue') },
              { value: '#ffffff', label: t('color_white') }
            ]
          }
        }
      },
      {
        name: 'minute_step',
        label: t('minute_step_label'),
        helper: t('minute_step_helper'),
        selector: {
          number: {
            min: 1,
            max: 30,
            step: 1,
            mode: 'box'
          }
        }
      },
      {
        name: 'slant',
        label: t('slant_label'),
        helper: t('slant_helper'),
        selector: {
          number: {
            min: -10,
            max: 10,
            step: 1,
            mode: 'box'
          }
        }
      },
      {
        name: 'alarm_label',
        label: t('alarm_label_label'),
        helper: t('alarm_label_helper'),
        selector: { text: {} }
      }
    ];
  }

  _updateForm() {
    if (!this._formEl || !this._hass) return;

    const data = {
      title: this._config.title || '',
      entity_time: this._config.entity_time || 'input_datetime.reveil_matin_heure',
      entity_alarm: this._config.entity_alarm || 'automation.chambre_reveil_matin',
      entity_days: this._config.entity_days !== undefined ? this._config.entity_days : 'input_text.reveil_matin_jours',
      time_format: this._config.time_format || '24h',
      color: this._config.color || '#ff9100',
      minute_step: this._config.minute_step || 1,
      slant: this._config.slant !== undefined ? this._config.slant : 0,
      alarm_label: this._config.alarm_label || 'alarm'
    };

    this._formEl.hass = this._hass;
    this._formEl.schema = this._getSchema();
    this._formEl.data = data;
  }

  _valueChanged(ev) {
    const newConfig = {
      ...this._config,
      ...ev.detail.value
    };

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define('retro-alarm-card', RetroAlarmCard);
customElements.define('retro-alarm-card-editor', RetroAlarmCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'retro-alarm-card',
  name: 'Retro Alarm Card',
  description: 'Retro 7-segment digital LED/VFD alarm clock card with visual editor (10 languages)',
  preview: true
});
