/**
 * Retro Alarm Clock Card pour Home Assistant
 * Carte de réveil rétro avec affichage 7 segments LED lumineux ambre.
 * Support multilingue 10 langues (EN, DE, FR, NL, ES, IT, PL, PT, RU, SV).
 */

const CARD_VERSION = '1.0.6';
console.info(
  `%c RETRO-ALARM-CARD %c v${CARD_VERSION} (Uppercase Days & Natural Slant) `,
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
 * Dictionnaire complet 10 langues (les plus populaires sur Home Assistant)
 * Les jours de semaine sont en majuscules pour un style VFD / LED authentique.
 */
const I18N = {
  fr: {
    days: ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'],
    h_up_tip: 'Heures : cliquer pour augmenter (+1h)',
    h_down_tip: 'Heures : cliquer pour diminuer (-1h)',
    m_up_tip: (step) => `Minutes : cliquer pour augmenter (+${step}m)`,
    m_down_tip: (step) => `Minutes : cliquer pour diminuer (-${step}m)`,
    alarm_tip: 'Activer / Désactiver le réveil',
    title_label: 'Titre de la carte (optionnel)',
    title_helper: "Texte d'en-tête affiché au-dessus de l'écran",
    entity_time_label: 'Heure de réveil programmée',
    entity_time_helper: "Entité input_datetime contenant l'heure programmée",
    entity_alarm_label: "Automatisation ou commutateur d'alarme",
    entity_alarm_helper: 'Automatisation ou switch déclenchant la sonnerie du réveil',
    time_format_label: "Format de l'heure",
    time_format_helper: 'Affichage 24 Heures épuré ou 12 Heures avec témoins AM / PM',
    format_24h: '24 Heures (ex: 19:15 - sans AM/PM)',
    format_12h: '12 Heures (ex: 07:15 pm - avec AM/PM)',
    color_label: 'Couleur des segments LED',
    color_helper: 'Couleur néon rétro des chiffres et des témoins',
    color_amber: '🟠 Ambre Vintage (Défaut)',
    color_red: '🔴 Rouge LED',
    color_green: '🟢 Vert Rétro',
    color_blue: '🔵 Bleu / Cyan VFD',
    color_white: '⚪ Blanc Froid',
    minute_step_label: 'Incrément des minutes par clic',
    minute_step_helper: 'Nombre de minutes ajoutées ou retirées à chaque clic (ex: 1 ou 5)',
    slant_label: 'Inclinaison des chiffres (degrés)',
    slant_helper: '0 pour droit, 5 pour une inclinaison naturelle vers la droite (style italique)',
    alarm_label_label: 'Texte du témoin alarme',
    alarm_label_helper: "Mot affiché à côté de l'icône sonore (défaut : alarm)"
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
    time_format_label: 'Time Format',
    time_format_helper: 'Clean 24-hour display or 12-hour display with AM/PM tags',
    format_24h: '24 Hours (e.g. 19:15 - without AM/PM)',
    format_12h: '12 Hours (e.g. 07:15 pm - with AM/PM)',
    color_label: 'LED Segment Color',
    color_helper: 'Neon retro glow color for digits and indicators',
    color_amber: '🟠 Vintage Amber (Default)',
    color_red: '🔴 LED Red',
    color_green: '🟢 Retro Green',
    color_blue: '🔵 VFD Blue / Cyan',
    color_white: '⚪ Cool White',
    minute_step_label: 'Minute step per click',
    minute_step_helper: 'Number of minutes added or subtracted on each click (e.g. 1 or 5)',
    slant_label: 'Digit slant (degrees)',
    slant_helper: '0 for upright straight, 5 for natural tilt to the right (italic)',
    alarm_label_label: 'Alarm indicator label',
    alarm_label_helper: 'Word next to soundwave icon (default: alarm)'
  },
  de: {
    days: ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'],
    h_up_tip: 'Stunden: Klicken zum Erhöhen (+1h)',
    h_down_tip: 'Stunden: Klicken zum Verringern (-1h)',
    m_up_tip: (step) => `Minuten: Klicken zum Erhöhen (+${step}m)`,
    m_down_tip: (step) => `Minuten: Klicken zum Verringern (-${step}m)`,
    alarm_tip: 'Wecker ein- / ausschalten',
    title_label: 'Kartentitel (optional)',
    title_helper: 'Kopfzeilentext über der Weckeranzeige',
    entity_time_label: 'Weckzeit-Entität',
    entity_time_helper: 'input_datetime-Entität für die eingestellte Weckzeit',
    entity_alarm_label: 'Wecker-Automation oder Schalter',
    entity_alarm_helper: 'Automation oder Schalter, der den Wecker auslöst',
    time_format_label: 'Zeitformat',
    time_format_helper: 'Kompaktes 24h-Format oder 12h mit AM/PM',
    format_24h: '24 Stunden (z.B. 19:15 - ohne AM/PM)',
    format_12h: '12 Stunden (z.B. 07:15 pm - mit AM/PM)',
    color_label: 'LED-Segmentfarbe',
    color_helper: 'Retro-Leuchtfarbe für Ziffern und Symbole',
    color_amber: '🟠 Vintage Bernstein (Standard)',
    color_red: '🔴 LED Rot',
    color_green: '🟢 Retro Grün',
    color_blue: '🔵 VFD Blau / Cyan',
    color_white: '⚪ Kaltweiß',
    minute_step_label: 'Minutenschritt pro Klick',
    minute_step_helper: 'Anzahl der Minuten pro Klick (z.B. 1 oder 5)',
    slant_label: 'Ziffernneigung (Grad)',
    slant_helper: '0 für gerade, 5 für Neigung nach rechts (kursiv)',
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
    time_format_label: 'Tijdnotatie',
    time_format_helper: 'Strakke 24-uursweergave of 12-uurs met AM/PM',
    format_24h: '24 Uur (bijv. 19:15 - zonder AM/PM)',
    format_12h: '12 Uur (bijv. 07:15 pm - met AM/PM)',
    color_label: 'LED-segmentkleur',
    color_helper: 'Retro-gloedkleur voor cijfers en indicatoren',
    color_amber: '🟠 Vintage Barnsteen (Standaard)',
    color_red: '🔴 LED Rood',
    color_green: '🟢 Retro Groen',
    color_blue: '🔵 VFD Blauw / Cyaan',
    color_white: '⚪ Koel Wit',
    minute_step_label: 'Minutenstap per klik',
    minute_step_helper: 'Aantal minuten toegevoegd of afgetrokken per klik',
    slant_label: 'Cijferhelling (graden)',
    slant_helper: '0 voor rechtop, 5 voor schuin naar rechts (cursief)',
    alarm_label_label: 'Tekst van wekkerindicator',
    alarm_label_helper: 'Tekst naast het geluidspictogram (standaard: alarm)'
  },
  es: {
    days: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'],
    h_up_tip: 'Horas: clic para aumentar (+1h)',
    h_down_tip: 'Horas: clic para disminuir (-1h)',
    m_up_tip: (step) => `Minutos: clic para aumentar (+${step}m)`,
    m_down_tip: (step) => `Minutos: clic para disminuir (-${step}m)`,
    alarm_tip: 'Activar / desactivar alarma',
    title_label: 'Título de la tarjeta (opcional)',
    title_helper: 'Texto de cabecera mostrado encima del reloj',
    entity_time_label: 'Entidad de hora de alarma',
    entity_time_helper: 'Entidad input_datetime con la hora programada',
    entity_alarm_label: 'Automatización o interruptor de alarma',
    entity_alarm_helper: 'Automatización o interruptor que activa el sonido de la alarma',
    time_format_label: 'Formato de hora',
    time_format_helper: 'Visualización 24h limpia o 12h con AM/PM',
    format_24h: '24 Horas (ej: 19:15 - sin AM/PM)',
    format_12h: '12 Horas (ej: 07:15 pm - con AM/PM)',
    color_label: 'Color de segmentos LED',
    color_helper: 'Color de brillo retro para dígitos e indicadores',
    color_amber: '🟠 Ámbar Vintage (Predeterminado)',
    color_red: '🔴 LED Rojo',
    color_green: '🟢 Verde Retro',
    color_blue: '🔵 VFD Azul / Cian',
    color_white: '⚪ Blanco Frío',
    minute_step_label: 'Paso de minutos por clic',
    minute_step_helper: 'Minutos que se añaden o restan en cada clic',
    slant_label: 'Inclinación de dígitos (grados)',
    slant_helper: '0 para vertical, 5 para inclinación a la derecha (cursiva)',
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
    entity_time_label: 'Entità ora sveglia',
    entity_time_helper: "Entità input_datetime contenente l'ora programmata",
    entity_alarm_label: 'Automazione o interruttore sveglia',
    entity_alarm_helper: 'Automazione o interruttore che fa suonare la sveglia',
    time_format_label: 'Formato ora',
    time_format_helper: 'Visualizzazione pulita a 24 ore o a 12 ore con AM/PM',
    format_24h: '24 Ore (es: 19:15 - senza AM/PM)',
    format_12h: '12 Ore (es: 07:15 pm - con AM/PM)',
    color_label: 'Colore dei segmenti LED',
    color_helper: 'Colore fluorescente retrò per cifre e icone',
    color_amber: '🟠 Ambra Vintage (Predefinito)',
    color_red: '🔴 LED Rosso',
    color_green: '🟢 Verde Retrò',
    color_blue: '🔵 VFD Blu / Ciano',
    color_white: '⚪ Bianco Freddo',
    minute_step_label: 'Passo minuti per clic',
    minute_step_helper: 'Minuti aggiunti o sottratti a ogni clic',
    slant_label: 'Inclinazione cifre (gradi)',
    slant_helper: '0 per dritto, 5 per inclinazione verso destra (corsivo)',
    alarm_label_label: 'Etichetta indicatore allarme',
    alarm_label_helper: "Testo accanto all'icona del suono (predefinito: alarm)"
  },
  pl: {
    days: ['PN', 'WT', 'ŚR', 'CZ', 'PT', 'SB', 'ND'],
    h_up_tip: 'Godziny: kliknij, aby zwiększyć (+1h)',
    h_down_tip: 'Godziny: kliknij, aby zmniejszyć (-1h)',
    m_up_tip: (step) => `Minuty: kliknij, aby zwiększyć (+${step}m)`,
    m_down_tip: (step) => `Minuty: kliknij, aby zmniejszyć (-${step}m)`,
    alarm_tip: 'Włącz / Wyłącz budzik',
    title_label: 'Tytuł karty (opcjonalny)',
    title_helper: 'Tekst nagłówka wyświetlany nad ekranem budzika',
    entity_time_label: 'Encja czasu budzika',
    entity_time_helper: 'Encja input_datetime zawierająca czas budzika',
    entity_alarm_label: 'Automatyzacja lub przełącznik budzika',
    entity_alarm_helper: 'Automatyzacja lub przełącznik uruchamiający budzik',
    time_format_label: 'Format czasu',
    time_format_helper: 'Czysty format 24h lub 12h ze wskaźnikami AM/PM',
    format_24h: '24 Godziny (np. 19:15 - bez AM/PM)',
    format_12h: '12 Godzin (np. 07:15 pm - z AM/PM)',
    color_label: 'Kolor segmentów LED',
    color_helper: 'Kolor świecenia cyfr i wskaźników retro',
    color_amber: '🟠 Bursztyn Vintage (Domyślny)',
    color_red: '🔴 Czerwony LED',
    color_green: '🟢 Zielony Retro',
    color_blue: '🔵 VFD Niebieski / Cyjan',
    color_white: '⚪ Zimny Biały',
    minute_step_label: 'Krok minut na kliknięcie',
    minute_step_helper: 'Liczba minut dodawanych lub odejmowanych przy kliknięciu',
    slant_label: 'Pochylenie cyfr (stopnie)',
    slant_helper: '0 dla prostych cyfr, 5 dla pochylenia w prawo (kursywa)',
    alarm_label_label: 'Etykieta wskaźnika budzika',
    alarm_label_helper: 'Tekst obok ikony dźwięku (domyślnie: alarm)'
  },
  pt: {
    days: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'],
    h_up_tip: 'Horas: clique para aumentar (+1h)',
    h_down_tip: 'Horas: clique para diminuir (-1h)',
    m_up_tip: (step) => `Minutos: clique para aumentar (+${step}m)`,
    m_down_tip: (step) => `Minutos: clique para diminuir (-${step}m)`,
    alarm_tip: 'Ligar / Desligar alarme',
    title_label: 'Título do cartão (opcional)',
    title_helper: 'Texto de cabeçalho acima do ecrã',
    entity_time_label: 'Entidade de hora do alarme',
    entity_time_helper: 'Entidade input_datetime com a hora definida',
    entity_alarm_label: 'Automação ou interruptor do alarme',
    entity_alarm_helper: 'Automação ou interruptor que dispara o alarme',
    time_format_label: 'Formato da hora',
    time_format_helper: 'Exibição limpa de 24h ou 12h com AM/PM',
    format_24h: '24 Horas (ex: 19:15 - sem AM/PM)',
    format_12h: '12 Horas (ex: 07:15 pm - com AM/PM)',
    color_label: 'Cor dos segmentos LED',
    color_helper: 'Cor de brilho retro para dígitos e indicadores',
    color_amber: '🟠 Âmbar Vintage (Padrão)',
    color_red: '🔴 LED Vermelho',
    color_green: '🟢 Verde Retro',
    color_blue: '🔵 VFD Azul / Ciano',
    color_white: '⚪ Branco Frio',
    minute_step_label: 'Passo de minutos por clique',
    minute_step_helper: 'Minutos adicionados ou subtraídos por clique',
    slant_label: 'Inclinação dos dígitos (graus)',
    slant_helper: '0 para vertical, 5 para inclinação para a direita (itálico)',
    alarm_label_label: 'Rótulo do indicador de alarme',
    alarm_label_helper: 'Texto ao lado do ícone sonoro (padrão: alarm)'
  },
  ru: {
    days: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
    h_up_tip: 'Часы: нажмите для увеличения (+1ч)',
    h_down_tip: 'Часы: нажмите для уменьшения (-1ч)',
    m_up_tip: (step) => `Минуты: нажмите для увеличения (+${step}м)`,
    m_down_tip: (step) => `Минуты: нажмите для уменьшения (-${step}м)`,
    alarm_tip: 'Включить / Выключить будильник',
    title_label: 'Заголовок карточки (необязательно)',
    title_helper: 'Текст заголовка над экраном будильника',
    entity_time_label: 'Объект времени будильника',
    entity_time_helper: 'Объект input_datetime с установленным временем',
    entity_alarm_label: 'Автоматизация или переключатель будильника',
    entity_alarm_helper: 'Автоматизация или переключатель, запускающий сигнал',
    time_format_label: 'Формат времени',
    time_format_helper: 'Чистый 24-часовой формат или 12-часовой с индикаторами AM/PM',
    format_24h: '24 Часа (напр. 19:15 - без AM/PM)',
    format_12h: '12 Часов (напр. 07:15 pm - с AM/PM)',
    color_label: 'Цвет сегментов LED',
    color_helper: 'Ретро-цвет свечения цифр и индикаторов',
    color_amber: '🟠 Винтажный янтарь (По умолчанию)',
    color_red: '🔴 Красный LED',
    color_green: '🟢 Ретро зеленый',
    color_blue: '🔵 VFD Синий / Голубой',
    color_white: '⚪ Холодный белый',
    minute_step_label: 'Шаг минут за клик',
    minute_step_helper: 'Количество минут, добавляемых или убавляемых за клик',
    slant_label: 'Наклон цифр (в градусах)',
    slant_helper: '0 - прямо, 5 - наклон вправо (курсив)',
    alarm_label_label: 'Текст индикатора будильника',
    alarm_label_helper: 'Слово рядом со значком звука (по умолч.: alarm)'
  },
  sv: {
    days: ['MÅN', 'TIS', 'ONS', 'TOR', 'FRE', 'LÖR', 'SÖN'],
    h_up_tip: 'Timmar: klicka för att öka (+1h)',
    h_down_tip: 'Timmar: klicka för att minska (-1h)',
    m_up_tip: (step) => `Minuter: klicka för att öka (+${step}m)`,
    m_down_tip: (step) => `Minuter: klicka för att minska (-${step}m)`,
    alarm_tip: 'Slå på / av larm',
    title_label: 'Korttitel (valfritt)',
    title_helper: 'Rubriktext som visas ovanför klockskärmen',
    entity_time_label: 'Larmtidsentitet',
    entity_time_helper: 'input_datetime-entitet med inställd larmtid',
    entity_alarm_label: 'Larmautomatisering eller brytare',
    entity_alarm_helper: 'Automatisering eller brytare som utlöser larmet',
    time_format_label: 'Tidsformat',
    time_format_helper: 'Städad 24h-visning eller 12h med AM/PM-taggar',
    format_24h: '24 Timmar (t.ex. 19:15 - utan AM/PM)',
    format_12h: '12 Timmar (t.ex. 07:15 pm - med AM/PM)',
    color_label: 'LED-segmentfärg',
    color_helper: 'Retro-glödfärg för siffror och indikatorer',
    color_amber: '🟠 Vintage Bärnsten (Standard)',
    color_red: '🔴 LED Röd',
    color_green: '🟢 Retro Grön',
    color_blue: '🔵 VFD Blå / Cyan',
    color_white: '⚪ Kallvit',
    minute_step_label: 'Minutsteg per klick',
    minute_step_helper: 'Antal minuter som läggs till eller dras ifrån per klick',
    slant_label: 'Sifferlutning (grader)',
    slant_helper: '0 för rakt, 5 för lutning åt höger (kursiv)',
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

    // Inversion du slant : une valeur positive (ex: 5) fait pencher vers la droite (italique naturel)
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

        /* Effet de reflet de vitre */
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

        /* Rangée principale d'affichage de l'heure */
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

        /* Séparateur deux points - Fixe */
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

        /* Indicateurs à droite (AM/PM) */
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

        /* Rangée inférieure : Jours de semaine en Majuscules + Alarme */
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

            <!-- Séparateur : (fixe) -->
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
              <!-- Icône d'ondes sonores rétro -->
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

    // Récupérer l'heure
    const timeEntity = this._hass.states[this._config.entity_time];
    if (timeEntity && timeEntity.state) {
      const parts = timeEntity.state.split(':');
      if (parts.length >= 2) {
        this._hours = parseInt(parts[0], 10) || 0;
        this._minutes = parseInt(parts[1], 10) || 0;
      }
    }

    // Récupérer l'état de l'alarme
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
      // En mode 24h, on masque AM/PM pour aérer et centrer
      if (rightIndicators) rightIndicators.classList.add('hidden');
    }

    // Mettre à jour l'affichage des chiffres 7 segments
    const hStr = String(displayHour).padStart(2, '0');
    const mStr = String(this._minutes).padStart(2, '0');

    this._drawDigit('h1', hStr[0]);
    this._drawDigit('h2', hStr[1]);
    this._drawDigit('m1', mStr[0]);
    this._drawDigit('m2', mStr[1]);

    // Mettre à jour l'indicateur d'alarme
    const alarmToggle = this.shadowRoot.getElementById('alarmToggle');
    if (alarmToggle) {
      alarmToggle.classList.toggle('active', this._alarmOn);
    }

    // Mettre à jour les jours de la semaine
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

  _updateDays() {
    const daysContainer = this.shadowRoot.getElementById('daysList');
    if (!daysContainer) return;

    daysContainer.innerHTML = '';
    const dayLabels = getTranslation(this._hass, 'days');

    let daysToRender = [];
    if (this._config.days && Array.isArray(this._config.days) && this._config.days.length > 0) {
      daysToRender = this._config.days;
    } else {
      daysToRender = DEFAULT_ENTITIES_DAYS.map((entity, idx) => ({
        entity,
        label: dayLabels[idx] || `J${idx + 1}`
      }));
    }

    daysToRender.forEach((dayCfg) => {
      const stateObj = this._hass.states[dayCfg.entity];
      const isActive = stateObj ? stateObj.state === 'on' : false;

      const span = document.createElement('span');
      span.className = `day-item ${isActive ? 'active' : ''}`;
      span.textContent = (dayCfg.label || dayCfg.entity.split('.').pop()).toUpperCase();
      span.title = `${dayCfg.label} : ${isActive ? 'ON' : 'OFF'}`;
      span.addEventListener('click', () => {
        this._toggleEntity(dayCfg.entity);
      });

      daysContainer.appendChild(span);
    });
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
 * Éditeur Visuel Lovelace Multilingue pour RetroAlarmCard
 */
class RetroAlarmCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._hass) return;

    const t = (key, arg) => getTranslation(this._hass, key, arg);

    const schema = [
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

    const data = {
      title: this._config.title || '',
      entity_time: this._config.entity_time || 'input_datetime.reveil_matin_heure',
      entity_alarm: this._config.entity_alarm || 'automation.chambre_reveil_matin',
      time_format: this._config.time_format || '24h',
      color: this._config.color || '#ff9100',
      minute_step: this._config.minute_step || 1,
      slant: this._config.slant !== undefined ? this._config.slant : 0,
      alarm_label: this._config.alarm_label || 'alarm'
    };

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
        <ha-form
          id="haForm"
          .hass=${this._hass}
          .data=${data}
          .schema=${schema}
          .computeLabel=${(s) => s.label || s.name}
          .computeHelper=${(s) => s.helper || ''}
        ></ha-form>
      </div>
    `;

    const form = this.shadowRoot.getElementById('haForm');
    if (form) {
      form.hass = this._hass;
      form.data = data;
      form.schema = schema;
      form.computeLabel = (s) => s.label || s.name;
      form.computeHelper = (s) => s.helper || '';
      form.addEventListener('value-changed', (ev) => {
        this._valueChanged(ev);
      });
    }
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
  description: 'Carte réveil rétro style 7-segments ambre avec éditeur visuel multilingue (10 langues)',
  preview: true
});
