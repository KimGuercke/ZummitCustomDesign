/* =========================================================================
   Zummit Custom Design — Prototyp · App-Logik
   - Vortrags-Daten (Single Source) + Render der Liste & Karte
   - Funktionale Sub-Tabs: Beitrag (Hero) · Details (Beschreibung) · Downloads (Dateien)
   - Karten-Modi: 16:9-Hero (color) | mode-flow (Auto-Höhe: Video/viele Ref./andere Tabs)
   - Settings-Drawer steuert die jeweils aktive Karte live
   - Splitter (Listenbreite) mit Reset auf Auto-Breite bei Fenster-Resize
   ========================================================================= */
(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  const card       = $("#card");
  const talkList   = $("#talkList");
  const modeSelect = $("#mode");

  /* --- Icons — Lucide-Inline-SVG, Single Source (lucide.dev/icons, v1.21.0) ---
     icon(name) liefert das fertige <svg>; statische Icons in index.html werden
     über data-icon-Platzhalter aus derselben Quelle gefüllt (siehe Start). */
  const ICONS = {
    house: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    store: '<path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/>',
    award: '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
    "messages-square": '<path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"/>',
    bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    "file-text": '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
    "message-circle": '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',
    "chart-column": '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    "bot-message-square": '<path d="M12 6V2H8"/><path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"/><path d="M2 12h2"/><path d="M9 11v2"/><path d="M15 11v2"/><path d="M20 12h2"/>',
    "calendar-plus": '<path d="M16 19h6"/><path d="M16 2v4"/><path d="M19 16v6"/><path d="M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5"/><path d="M3 10h18"/><path d="M8 2v4"/>',
    "share-2": '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    bookmark: '<path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z"/>',
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
    send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    ellipsis: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    "panel-left-close":  '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
    "panel-left-open":   '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',
    "panel-right-close": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/>',
    "panel-right-open":  '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  };
  const icon = (name, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24">${ICONS[name] || ""}</svg>`;
  const ICON_BM   = icon("bookmark");   // Referenten/Liste „Merken"
  const ICON_MORE = icon("ellipsis");   // Referenten/Liste „Mehr"

  /* --- Referenten-/Personen-Control (wiederverwendbar, Beitrag + Personen) --- */
  function renderSpeaker(s, bmIcon = ICON_BM) {
    return `
      <li class="speaker">
        <img class="speaker-img" src="${s.img}" alt="" loading="lazy" />
        <div class="speaker-info">
          <a class="speaker-name" href="#">${s.name}</a>
          <span class="speaker-role">${s.role}</span>
          <span class="speaker-org">${s.org}</span>
        </div>
        <div class="speaker__actions">
          <span class="speaker__bm" title="Merken">${bmIcon}</span>
          <span class="speaker__more" title="Mehr">${ICON_MORE}</span>
        </div>
      </li>`;
  }

  /* --- Referenten (wiederverwendbar) --- */
  const SP = {
    mueller:    { img: "https://randomuser.me/api/portraits/women/65.jpg", name: "Dr. Mellanie Müller-Rügenwald", role: "Head of Marketing", org: "Glücksstadt Tourismus e.V" },
    mustermann: { img: "https://randomuser.me/api/portraits/men/32.jpg",   name: "Prof. Dr. Walter Mustermann",   role: "Direktor des Instituts für Verfahrens- und Umwelttechnik", org: "Technische Universität Dresden" },
    hambloch:   { img: "https://randomuser.me/api/portraits/women/44.jpg", name: "Sandra Hambloch-Dick",          role: "Leitung Kundenbetreuung", org: "Bündnis gegen Cybermobbing e.V." },
    beckmann:   { img: "https://randomuser.me/api/portraits/men/41.jpg",   name: "Professor Dr.-Ing. Michael Beckmann", role: "Direktor des Instituts für Verfahrenstechnik und Umwelttechnik", org: "Technische Universität Dresden" },
    edgemeister:{ img: "https://randomuser.me/api/portraits/women/12.jpg", name: "Dr. Gaby Edgemeister",          role: "CEO", org: "Meyer-Willhelm AG" },
    gries:      { img: "https://randomuser.me/api/portraits/men/76.jpg",   name: "Prof. h.c. Dr.-Ing. Thomas Gries", role: "Leiter des Instituts für Textiltechnik", org: "Rheinisch-Westfälische Technische Hochschule Aachen" },
    guercke:    { img: "https://randomuser.me/api/portraits/men/15.jpg",   name: "Kim Guercke",                   role: "Geschäftsführer", org: "ZUMMIT GmbH" },
    haeming:    { img: "https://randomuser.me/api/portraits/men/52.jpg",   name: "Dipl.-Verww. Hartmut Haeming",  role: "Vorsitzender", org: "InwesD - Interessengemeinschaft Deutsche Deponiebetreiber e. V." },
    hay:        { img: "https://randomuser.me/api/portraits/men/22.jpg",   name: "Martin Hay",                    role: "Key Account", org: "ZUMMIT GmbH" },
  };

  /* --- Sample-Dateien (preview = mit Vorschau-Icon; Download immer) --- */
  const FILES = [
    { name: "Saalplan_BKMNA26.pdf",     preview: true  },
    { name: "Programm_BKMNA_2026.pdf",  preview: false },
    { name: "Teilnehmerliste.pdf",      preview: true  },
    { name: "MNA13_E-Book.pdf",         preview: true  },
    { name: "Handout_Workshop.pdf",     preview: true  },
    { name: "Begleitmaterial_zur_Praevention_von_Mediensucht_im_Jugendalter_und_Medienerziehung_Langfassung_2026.pdf", preview: true },
  ];

  /* --- Sample-Beschreibung (wiederverwendbar) --- */
  const DESC_WORKSHOP = [
    "Heutzutage nutzen Kinder und Jugendliche ihr Smartphone ganz selbstverständlich – ob im Bus, im Café oder im Park, fast immer ist das Handy dabei. Soziale Netzwerke wie Instagram, Snapchat und TikTok ermöglichen den ständigen Kontakt zu Freund*innen. Auch das Gaming ist für viele eine sinnvolle Freizeitbeschäftigung und sorgt für gewünschte Erfolgserlebnisse. Darüber hinaus bietet das Smartphone vielfältige weitere Nutzungsmöglichkeiten.",
    "Die meisten Jugendlichen nutzen digitale Medien funktional und freizeitorientiert. Doch worauf sollten Eltern achten? Welche digitalen Angebote sind förderlich, welche Strukturen und Rahmenbedingungen sollten Eltern setzen? Wie viel Medienkonsum ist gut – und ab wann wird es zu viel? Wie können wir als Eltern Schutzfaktoren stärken und riskantes Verhalten frühzeitig erkennen?",
    "Im Workshop werden die Definition von Mediensucht, Möglichkeiten zur Stärkung von Schutzfaktoren sowie konkrete Tipps zur Medienerziehung vermittelt.",
  ];

  /* --- Vortrags-Daten — Single Source für Liste UND Karte --- */
  const TALKS = [
    {
      id: "standard", mode: "color", cardCta: true,   // In-Card-CTA (wie Demo-Vortrag)
      listMeta: "10:00–11:00 | Hauptsaal", listTitle: "Standard-Sample (Zahnrad-Einstellungen)",
      date: "Sa. 20.06.2026", time: "15:30 - 16:30", room: "Hörsaal 3",
      title: "Das ist der Titel zu dem Vortrag mit einemsehrlangenwörtchen zum testen",
      subtitle: "Das ist der Subtitel falls der vorhanden ist, kann man diesen optional mit einblenden.",
      speakers: [SP.mueller, SP.mustermann],
      files: FILES, filesVariant: "onblue",   // 5 Dateien (Showcase) — Variante A
    },
    {
      id: "bildvideo", mode: "video", videoThumb: "assets/video-thumb.jpg",
      cta: "Zum Vortrag - jetzt beitreten",
      listMeta: "10:30–11:00 | Hauptsaal", listTitle: "Iteration 1 -Vortrag mit Bild oder Video",
      date: "Sa. 20.06.2026", time: "10:30 - 11:00", room: "Hörsaal 3",
      title: "Vortrag mit Bild oder Video – Iteration 1",
      subtitle: "Erste Iteration: Hero zeigt Bild oder Video, Dokumente liegen im Downloads-Register, zusätzlich aktives Abstimmungen-Register.",
      speakers: [SP.mueller],
      files: FILES, filesVariant: "onblue",   // Downloads-Sample (alle Dateien) — nur im Downloads-Tab, nicht inline
      description: DESC_WORKSHOP, inlineDescription: true,  // Beschreibung unten inline (wie Demo-Vortrag), Dokumente bleiben im Register
      hideTabs: ["details"],                   // zeigt Beitrag · Downloads · Feedback · Abstimmungen (ohne Details)
    },
    {
      id: "video", mode: "video", videoThumb: "assets/video-thumb.jpg",
      cta: "Zum Vortrag - jetzt beitreten",
      listMeta: "11:00–12:00 | Hauptsaal", listTitle: "Vortrag mit Video on Demand",
      date: "Sa. 20.06.2026", time: "11:00 - 12:35", room: "Hörsaal 3",
      title: "Like dich selbst – Selbstbewusst & resilient gegen Cybermobbing",
      subtitle: "Aufzeichnung · Woche der Familiengesundheit · 15.–22.05.2026",
      speakers: [SP.hambloch],
      files: FILES.slice(0, 1), filesVariant: "onblue", // 1 Datei — Variante A (auf der Karte)
      inlineExtras: true,                                // häufige Variante: Datei + Beschreibung inline ganz unten
      hideTabs: ["details", "downloads", "abstimmungen"],// nur Beitrag + Feedback (Rest ist im Beitrag bzw. selten)
      description: DESC_WORKSHOP,
    },
    {
      id: "panel", mode: "color", autoHeight: true,
      listMeta: "13:00–14:00 | Hörsaal 2", listTitle: "Sample Referenten nebeneinander",
      date: "Sa. 20.06.2026", time: "13:00 - 14:00", room: "Hörsaal 2",
      title: "Podiumsdiskussion: Zukunft der Veranstaltungsbranche",
      subtitle: "Mehrere Referenten – einzeln untereinander dargestellt.",
      speakers: [SP.beckmann, SP.edgemeister, SP.gries, SP.guercke, SP.haeming, SP.hay],
      files: FILES.slice(0, 3), filesVariant: "onblue",   // 3 Dateien — Variante A
    },
    {
      id: "experiment", mode: "color",
      listMeta: "12:00–13:00 | Hauptsaal", listTitle: "Experimentier-Vortrag",
      date: "Sa. 20.06.2026", time: "12:00 - 13:00", room: "Raum 2",
      title: "Spielwiese – hier kannst du Einstellungen testen",
      subtitle: "Subtitle zum Ausprobieren.",
      speakers: [SP.mustermann],
      files: FILES.slice(0, 1), filesVariant: "panel",   // 1 Datei — Variante B
    },
    {
      id: "demo-all", mode: "video", videoThumb: "assets/video-thumb.jpg",
      cta: "Zum Vortrag - jetzt beitreten",
      demoAll: true, filesVariant: "onblue",   // Maximal-Showcase: ALLES inline im Beitrag, adaptiv
      hideTabs: ["details", "downloads"],      // alles inline → Details/Downloads aus, Abstimmungen bleibt
      cardCta: true,                           // Demo: Bookmark/„…" in den Card-Bereich (oben rechts)
      listMeta: "14:00–15:30 | Hörsaal 1", listTitle: "Vortrag, der alles zusammen demonstriert",
      date: "Sa. 20.06.2026", time: "14:00 - 15:30", room: "Hörsaal 1",
      title: "Maximal-Beispiel – alle Komponenten auf der Beitragsseite",
      subtitle: "Demonstriert Datum, Uhrzeit, Raum, Video, Referenten, Dateien und Beschreibung.",
      speakers: [SP.mueller, SP.mustermann, SP.hambloch],
      files: FILES,                            // alle 5
      description: DESC_WORKSHOP,
    },
    {
      id: "demo-notabs", mode: "video", videoThumb: "assets/video-thumb.jpg",
      cta: "Zum Vortrag - jetzt beitreten",
      demoAll: true, filesVariant: "onblue", cardCta: true,
      noTabs: true,                            // keine Tab-Leiste — nur das Panel
      listMeta: "15:30–17:00 | Hörsaal 1", listTitle: "Demo ohne Tab-Register da kein Feedback und keine Abstimmungen",
      date: "Sa. 20.06.2026", time: "15:30 - 17:00", room: "Hörsaal 1",
      title: "Maximal-Beispiel – alle Komponenten auf der Beitragsseite",
      subtitle: "Demonstriert Datum, Uhrzeit, Raum, Video, Referenten, Dateien und Beschreibung.",
      speakers: [SP.mueller, SP.mustermann, SP.hambloch],
      files: FILES,
      description: DESC_WORKSHOP,
    },
  ];

  /* --- Teilnehmende (Demo) — Kategorien für die Sub-Tabs --------------- */
  const PEOPLE = {
    vortragende: [SP.hambloch, SP.beckmann, SP.edgemeister, SP.gries, SP.mueller, SP.mustermann],
    teilnehmer: [
      { img: "https://randomuser.me/api/portraits/women/68.jpg", name: "Dipl.-Ing. Sandra Giern", role: "Geschäftsführerin", org: "BDE Bundesverband der Entsorgungswirtschaft" },
      { img: "https://randomuser.me/api/portraits/men/33.jpg",   name: "Oliver Usha",            role: "CEO", org: "Oxygenta AG", liked: true },
      { img: "https://randomuser.me/api/portraits/women/90.jpg", name: "Stina Gunnarsdottir",    role: "Geschäftsführerin", org: "INOVEXIA" },
      { img: "https://randomuser.me/api/portraits/men/45.jpg",   name: "Dr. Justus Kaufmann",    role: "Geschäftsführer", org: "INOVEXIA" },
      { img: "https://randomuser.me/api/portraits/men/60.jpg",   name: "Markus Derfflinger",     role: "Pressesprecher", org: "VIOTONIC GmbH" },
      { img: "https://randomuser.me/api/portraits/women/28.jpg", name: "Dr. Monika Jankowski",   role: "Geschäftsführerin", org: "Klimawerk gGmbH" },
      { img: "https://randomuser.me/api/portraits/men/77.jpg",   name: "Tobias Wenninger",       role: "Projektleiter", org: "Stadtwerke Dresden" },
      { img: "https://randomuser.me/api/portraits/women/52.jpg", name: "Lena Hofmann",           role: "Referentin Nachhaltigkeit", org: "GreenTech e.V." },
    ],
    aussteller: [
      { img: "https://randomuser.me/api/portraits/men/12.jpg",   name: "Reinhard Söder",         role: "Vertrieb", org: "EcoCycle Systems GmbH" },
      { img: "https://randomuser.me/api/portraits/women/36.jpg", name: "Petra Lindqvist",        role: "Marketing", org: "Oxygenta AG" },
      { img: "https://randomuser.me/api/portraits/men/8.jpg",    name: "Dr. Ferdinand Roth",     role: "CTO", org: "VIOTONIC GmbH" },
      { img: "https://randomuser.me/api/portraits/women/19.jpg", name: "Aylin Demir",            role: "Sales Lead", org: "INOVEXIA" },
    ],
  };

  /* --- Chat (Demo) — self=true: eigene Nachricht (rechts, teal) -------- */
  const CHAT = [
    { name: "Gaby Edgemeister", time: "13:54", text: "Hallo zusammen,<br>Eine Frage an die Regie: Werden die Vorträge aufgezeichnet?" },
    { self: true,               time: "13:56", text: "Hallo Gabi, ich werde nachfragen und melde mich gleich." },
    { name: "Gaby Edgemeister", time: "13:55", text: "Und falls ja, ab wann stehen diese als Videos zur Verfügung?" },
    { self: true,               time: "13:55", text: "Die Vorträge werden aufgezeichnet und stehen am Montag der kommenden Woche zur Verfügung." },
    { name: "Gaby Edgemeister", time: "13:57", text: "Super! Das freut mich sehr und gibt mir die Möglichkeit, an sämtlichen Vorträge teilzunehmen :-)" },
    { self: true,               time: "13:58", text: "Sehr schön! Das darfst Du übrigens gerne im Feedback-Formular erwähnen ;-)" },
    { name: "Gaby Edgemeister", time: "13:58", text: "Na, dann gib uns mal Mühe! Das Feedback-Formular beantworte ich nach dem Event ;-)" },
  ];

  let currentTalk = TALKS[0];
  let currentTab  = "beitrag";
  let bgImageUrl  = null;   // hochgeladenes Hintergrundbild (Modus „Hintergrundbild")

  const isOn = comp => { const el = $(`[data-toggle-comp="${comp}"]`); return el ? el.checked : false; };

  /* --- Vortrags-Tags (Demo) — Palette (Farbe + gefüllt/outline) als Single Source --- */
  const TAGS = {
    "Tutorial":       { c: "#6b7785", fill: false },
    "Aufzeichnung":   { c: "#d6336c", fill: true  },
    "Studio":         { c: "#7048e8", fill: false },
    "Nachhaltigkeit": { c: "#2f9e44", fill: false },
    "Industrie":      { c: "#7048e8", fill: false },
    "Dolmetscher":    { c: "#1c84e7", fill: false },
  };
  const TALK_TAGS = {
    standard:      ["Tutorial"],
    bildvideo:     ["Aufzeichnung", "Studio"],
    video:         ["Aufzeichnung"],
    panel:         ["Nachhaltigkeit", "Industrie"],
    experiment:    ["Tutorial"],
    "demo-all":    ["Aufzeichnung", "Dolmetscher"],
    "demo-notabs": ["Nachhaltigkeit"],
  };
  const renderTag = name => {
    const t = TAGS[name] || { c: "#6b7785", fill: false };
    return `<span class="tag${t.fill ? " tag--fill" : ""}" style="--tag-c:${t.c}">${name}</span>`;
  };

  /* --- Render: Liste --------------------------------------------------- */
  function renderList() {
    talkList.innerHTML = TALKS.map(t => `
      <li class="talk-item${t.id === currentTalk.id ? " is-selected" : ""}" data-id="${t.id}">
        <div class="talk-item__main">
          <span class="talk-item__meta">${t.listMeta}</span>
          <span class="talk-item__title">${t.listTitle}</span>
          ${(TALK_TAGS[t.id] || []).length ? `<div class="talk-item__tags">${TALK_TAGS[t.id].map(renderTag).join("")}</div>` : ""}
        </div>
        <div class="talk-item__actions">
          <span class="talk-item__bm" title="Merken">${ICON_BM}</span>
          <span class="talk-item__more" title="Mehr">${ICON_MORE}</span>
        </div>
      </li>`).join("");

    $$(".talk-item", talkList).forEach(li =>
      li.addEventListener("click", () => { selectTalk(li.dataset.id); enterDetail(); }));
  }

  /* --- Render-Bausteine ------------------------------------------------ */
  const TAB_NAMES = { beitrag: "Beitrag", details: "Details", downloads: "Downloads", feedback: "Feedback", abstimmungen: "Abstimmungen" };

  /* Kopf-Bereich — auf JEDEM Tab identisch: Meta (Datum/Zeit/Raum) + Icons + Titel */
  function renderHeader(t) {
    return `
      <div class="talk-meta">
        <span class="talk-meta__left">
          <span class="talk-date is-hidden" data-comp="date">${t.date}</span>
          <span class="talk-time" data-comp="time">${t.time}</span>
          <span class="talk-sep" aria-hidden="true">|</span>
          <a class="talk-room" data-comp="room" href="#">${t.room}</a>
        </span>
        <span class="talk-meta__cta">
          ${(TALK_TAGS[t.id] || []).includes("Aufzeichnung") ? `<button type="button" class="ai-summary" title="KI-Zusammenfassung">${icon("bot-message-square")}</button>` : ""}
          <button type="button" title="Als Kalendereintrag exportieren">${icon("calendar-plus")}</button>
          <button type="button" title="Teilen">${icon("share-2")}</button>
          <button type="button" title="Merken">${icon("bookmark")}</button>
        </span>
      </div>
      <h2 class="talk-title">${t.title}</h2>`;
  }

  /* Beitrag-Inhalt (unter dem Kopf): Subtitle + Video + Join-CTA + Referenten + ggf. Inline-Extras */
  function renderBeitrag(t) {
    const videoBlock = t.mode === "video"
      ? `<div class="talk-video"><img src="${t.videoThumb}" alt="Video-Vorschau" /></div>` : "";
    const ctaOff = $("#ctaDisabled")?.checked;
    const ctaBlock = t.cta
      ? `<button class="talk-cta-join${ctaOff ? " is-disabled" : ""}" type="button"${ctaOff ? " disabled" : ""}><span>${t.cta}</span>${icon("video")}</button><hr class="talk-divider" />` : "";
    const speakers = `<ul class="speakers" data-comp="speakers">${t.speakers.map(s => renderSpeaker(s)).join("")}</ul>`;
    // Subtitel direkt unter dem Titel, dann Trennlinie, dann der restliche Beitrags-Inhalt
    return `<p class="talk-subtitle" data-comp="subtitle">${t.subtitle}</p><hr class="talk-divider" />${videoBlock}${ctaBlock}${speakers}${renderHeroExtra(t)}`;
  }

  /* Inline-Extras im Beitrag (adaptiv): Dokumente und Beschreibung je eigenständig zuschaltbar.
     demoAll/inlineExtras = beides inline; inlineDescription = nur Beschreibung (Dokumente bleiben im Register). */
  function renderHeroExtra(t) {
    const filesInline = (t.demoAll || t.inlineExtras) && t.files && t.files.length;
    const descInline  = (t.demoAll || t.inlineExtras || t.inlineDescription) && t.description && t.description.length;
    let extra = "";
    if (filesInline)
      extra += `<hr class="talk-divider" /><h3 class="talk-section-label">Dokumente</h3>` + renderFiles(t.files, t.filesVariant || "onblue");
    if (descInline)
      extra += `<hr class="talk-divider" /><h3 class="talk-section-label">Beschreibung</h3>` + renderDescription(t);
    return extra;
  }

  function renderDescription(t) {
    return `<div class="talk-desc">${t.description.map(p => `<p>${p}</p>`).join("")}</div>`;
  }

  function renderFiles(files, variant) {
    const items = files.map(f => `
      <li class="file">
        ${icon("file-text", "icon file__icon")}
        <span class="file__name">${f.name}</span>
        <span class="file__actions">
          ${f.preview ? `<button class="file__btn" type="button" title="Vorschau">${icon("eye")}</button>` : ""}
          <button class="file__btn" type="button" title="Download">${icon("download")}</button>
        </span>
      </li>`).join("");
    const single = files.length === 1 ? " files--single" : "";   // 1 Datei: volle Zeile, Font wie Referent
    return `<div class="files files--${variant}${single}"><ul class="files__grid">${items}</ul></div>`;
  }

  const emptyTab = msg => `<div class="tab-empty">${msg}</div>`;

  /* --- Render: Karte je nach aktivem Tab ------------------------------ */
  function renderCard(t, tab) {
    card.className = "talk-card mode-flow" + (t.noTabs ? " no-tabs" : "");  // inhaltshoch: Kopf + variabler Tab-Inhalt
    card.style.backgroundImage = "";

    let content;
    if (tab === "beitrag") {
      content = renderBeitrag(t);
    } else if (tab === "details") {
      content = (isOn("description") && t.description && t.description.length)
        ? renderDescription(t) : emptyTab("Keine Detailbeschreibung vorhanden.");
    } else if (tab === "downloads") {
      content = (isOn("files") && t.files && t.files.length)
        ? renderFiles(t.files, t.filesVariant || "onblue") : emptyTab("Keine Dateien vorhanden.");
    } else {
      content = emptyTab("Inhalt folgt.");
    }
    // Beitrag = „Landingpage": Kopf → Subtitel → Trennlinie → Inhalt (Subtitel+Linie liefert renderBeitrag),
    // KEINE Tab-Überschrift. Andere Register: Kopf → Trennlinie → „Du-bist-hier"-Überschrift → Inhalt (Orientierung).
    let body;
    if (tab === "beitrag") {
      body = renderHeader(t) + content;
    } else {
      const heading = t.noTabs ? "" : `<h3 class="talk-tab-heading">${TAB_NAMES[tab] || ""}</h3>`;
      body = `${renderHeader(t)}<hr class="talk-divider" />${heading}${content}`;
    }
    card.innerHTML = `<div class="talk-card__body">${body}</div>`;
  }

  /* --- Auswahl: Vortrag (setzt Tab auf Beitrag zurück) ---------------- */
  function selectTalk(id) {
    currentTalk = TALKS.find(t => t.id === id) || TALKS[0];
    currentTab = "beitrag";
    updateTabVisibility();
    $$(".talk-item", talkList).forEach(li =>
      li.classList.toggle("is-selected", li.dataset.id === currentTalk.id));
    $$(".subtab").forEach(b => b.classList.toggle("is-active", b.dataset.tab === currentTab));
    refresh();
  }

  /* Tab-Register je Vortrag ein-/ausblenden (z.B. wenn Inhalte inline im Beitrag liegen) */
  function updateTabVisibility() {
    const noTabs = !!currentTalk.noTabs;
    $(".tabbar").classList.toggle("is-hidden", noTabs);   // gesamte Tab-Leiste weg → nur Panel
    const hide = currentTalk.hideTabs || [];
    $$(".subtab").forEach(b => b.classList.toggle("is-hidden", hide.includes(b.dataset.tab)));
  }

  /* --- Auswahl: Tab --------------------------------------------------- */
  function selectTab(tab) {
    currentTab = tab;
    $$(".subtab").forEach(b => b.classList.toggle("is-active", b.dataset.tab === tab));
    refresh();
  }

  function refresh() {
    renderCard(currentTalk, currentTab);
    applyBackground();
    applyComponentVisibility();
    $(".card-cta").classList.add("is-hidden");   // Icons liegen jetzt immer im Karten-Kopf
  }

  /* --- Settings: Komponenten-Sichtbarkeit (nur Inline-Elemente im Beitrag) --- */
  function applyComponentVisibility() {
    const forceAll = !!currentTalk.demoAll;   // Maximal-Showcase: alles fest sichtbar
    const vis = {};
    ["date", "time", "room", "subtitle", "speakers"].forEach(comp => {
      const on = forceAll || isOn(comp);
      vis[comp] = on;
      $$(`[data-comp="${comp}"]`, card).forEach(el => el.classList.toggle("is-hidden", !on));
    });
    // Trenner „|" nur zeigen, wenn Raum sichtbar UND davor etwas steht (Datum oder Zeit)
    $$(".talk-sep", card).forEach(el => el.classList.toggle("is-hidden", !(vis.room && (vis.date || vis.time))));
  }

  /* --- Settings: Modus Farbe/Bild (nur Beitrag-Hero, keine Video-Karte) --- */
  function applyBackground() {
    if (currentTab !== "beitrag" || currentTalk.mode === "video") {
      card.classList.remove("mode-image"); card.style.backgroundImage = ""; return;
    }
    if (modeSelect.value === "image") {
      card.classList.add("mode-image");
      const src = bgImageUrl ? `url('${bgImageUrl}')` : "url('https://picsum.photos/1280/720?grayscale')";
      card.style.backgroundImage = `linear-gradient(120deg, rgba(3,94,124,.55), rgba(3,94,124,.9)), ${src}`;   // Farbverlauf „überlagert" das Bild
    } else {
      card.classList.remove("mode-image"); card.style.backgroundImage = "";
    }
  }

  /* --- Sub-Tabs klickbar --- */
  $$(".subtab").forEach(b => b.addEventListener("click", () => selectTab(b.dataset.tab)));

  /* --- Tagesregister (Demo): aktiven Tag visuell umschalten (keine Filterung) --- */
  $$(".day-tab").forEach(b => b.addEventListener("click", () =>
    $$(".day-tab").forEach(x => x.classList.toggle("is-active", x === b))));

  /* --- Settings-Drawer öffnen/schließen --- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  const open  = () => { drawer.classList.add("is-open"); scrim.classList.add("is-open"); };
  const close = () => { drawer.classList.remove("is-open"); scrim.classList.remove("is-open"); };
  $("#openSettings").addEventListener("click", open);
  $("#closeSettings").addEventListener("click", close);
  scrim.addEventListener("click", close);
  /* Tastatur: Option/Alt+S togglet die Settings, Esc schließt — nicht während man in einem Feld tippt.
     e.code="KeyS" ist layout-unabhängig (Option+S erzeugt auf US-Mac-Layout sonst „ß"). */
  window.addEventListener("keydown", e => {
    const ae = document.activeElement;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(ae?.tagName || "") || ae?.isContentEditable;
    if (e.altKey && e.code === "KeyS" && !typing) {
      e.preventDefault();
      drawer.classList.contains("is-open") ? close() : open();
    } else if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      close();
    }
  });

  /* --- Komponenten-Toggles: neu rendern (steuern Inline-Elemente UND Tab-Inhalte) --- */
  $$("[data-toggle-comp]").forEach(t => t.addEventListener("change", refresh));

  /* --- Farb-Control: lc-color-picker (Popup + Verläufe) + Hex/%-Zeilenfelder (Schnell-Eingabe) ---
     Beide Wege schreiben dasselbe CSS-Token; Felder ↔ Picker bleiben synchron. --- */
  const colorMap = { desktop: "--ui-canvas", bg: "--z-bg", primary: "--z-fg", secondary: "--z-fg-muted", link: "--ui-accent", tabFg: "--tab-fg", tabBg: "--tab-bg", "cta-fg": "--cta-fg", "cta-bg": "--cta-bg", "cta-border": "--cta-border", speakerBg: "--speaker-bg", speakerBorder: "--speaker-border", header: "--ui-header", mainnav: "--ui-mainnav", leftpanel: "--ui-leftpanel" };

  /* Farbwert -> { gradient } | { hex: "rrggbb", alpha: 0–100 } */
  function parseColor(str) {
    str = (str || "").trim();
    if (/gradient/i.test(str)) {
      // erste Farb-Stufe des Verlaufs für die (deaktivierten) Felder herausziehen
      const c = str.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]+\)/i);
      const first = c ? parseColor(c[0]) : { hex: "000000", alpha: 100 };
      return { gradient: true, hex: first.hex, alpha: first.alpha };
    }
    let m = str.match(/^rgba?\(([^)]+)\)$/i);
    if (m) {
      const p = m[1].split(",").map(s => s.trim());
      const hex = p.slice(0, 3).map(n => (+n).toString(16).padStart(2, "0")).join("");
      return { hex, alpha: p[3] != null ? Math.round(parseFloat(p[3]) * 100) : 100 };
    }
    m = str.match(/^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
    if (m) {
      let h = m[1];
      if (h.length === 3) h = h.split("").map(c => c + c).join("");
      return { hex: h.slice(0, 6), alpha: h.length === 8 ? Math.round(parseInt(h.slice(6), 16) / 255 * 100) : 100 };
    }
    return { hex: "000000", alpha: 100 };
  }
  /* hex(6) + alpha(0–100) -> "#rrggbb" (deckend) | "rgba(r,g,b,a)" */
  function composeColor(hex, alpha) {
    if (alpha >= 100) return "#" + hex;
    const n = i => parseInt(hex.slice(i, i + 2), 16);
    return `rgba(${n(0)}, ${n(2)}, ${n(4)}, ${(alpha / 100).toFixed(2)})`;
  }
  function setColorToken(dc, val) {
    if (dc === "bg") document.body.classList.toggle("bg-is-gradient", /gradient/i.test(val));
    root.style.setProperty(colorMap[dc], val);
  }

  $$(".swatch[data-color]").forEach(swatch => {
    const dc = swatch.dataset.color;
    // Zeilen-Control bauen: # [hex] [alpha] %  + Swatch (lc hängt sich an den Swatch)
    const cc = document.createElement("div");
    cc.className = "cc";
    cc.innerHTML = `<span class="cc__hash">#</span><input class="cc__hex" type="text" maxlength="6" spellcheck="false" /><input class="cc__alpha" type="number" min="0" max="100" /><span class="cc__pct">%</span>`;
    swatch.parentNode.insertBefore(cc, swatch);
    cc.appendChild(swatch);
    const hexF = cc.querySelector(".cc__hex"), alphaF = cc.querySelector(".cc__alpha");

    // Token-Wert -> Felder spiegeln (Verlauf: Felder aus, Picker bleibt der Weg)
    const mirror = val => {
      const p = parseColor(val);
      hexF.disabled = alphaF.disabled = !!p.gradient;   // Verlauf: nur über Picker editierbar …
      hexF.value = (p.hex || "000000").toUpperCase();    // … aber Werte (erste Stufe) trotzdem anzeigen
      alphaF.value = p.alpha != null ? p.alpha : 100;
    };
    // Felder -> Token + Swatch-Vorschau (ohne Picker zu öffnen)
    const fromFields = () => {
      const hx = hexF.value.trim().replace(/^#/, "");
      if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hx)) return;     // ungültig: ignorieren
      const hex6 = hx.length === 3 ? hx.split("").map(c => c + c).join("") : hx;
      let a = parseInt(alphaF.value, 10); a = isNaN(a) ? 100 : Math.min(100, Math.max(0, a));
      const val = composeColor(hex6, a);
      swatch.value = val;
      setColorToken(dc, val);
      const pv = cc.querySelector(".lccp-preview"); if (pv) pv.style.background = val;   // Farbebene (über dem Checkerboard)
    };
    hexF.addEventListener("change", fromFields);
    alphaF.addEventListener("change", fromFields);

    new lc_color_picker(swatch, {
      modes: dc === "bg" ? ["solid", "linear-gradient", "radial-gradient"] : ["solid"],
      transparency: true,        // Opacity-Feld im Popup
      no_input_mode: true,       // nur der Swatch (Rechteck), kein Text-Input — Hex steht im Zeilenfeld
      on_change: (val, field) => { setColorToken(field.dataset.color, val); mirror(val); },
    });
    setColorToken(dc, swatch.value);   // Initialwert aus dem value-Attribut ist führend
    mirror(swatch.value);
  });

  /* --- Links unterstrichen --- */
  $("#underline").addEventListener("change", e =>
    document.body.classList.toggle("no-underline", !e.target.checked));

  /* --- Links fett (Default an, gespiegelt zum Underline-Pattern) --- */
  const linkBold = $("#linkBold");
  const applyLinkBold = () => document.body.classList.toggle("links-bold", linkBold.checked);
  linkBold.addEventListener("change", applyLinkBold);
  applyLinkBold();

  /* --- Vortrags-Tags in der Liste ein-/ausblenden (Default an) --- */
  const showTags = $("#showTags");
  const applyShowTags = () => document.body.classList.toggle("show-tags", showTags.checked);
  showTags.addEventListener("change", applyShowTags);
  applyShowTags();

  /* --- Vortrag-CTA Demo-Deaktivierung: rendert die Karte neu (is-disabled am Button) --- */
  $("#ctaDisabled").addEventListener("change", refresh);

  /* --- Vortragende: Karten-Eckradius live --- */
  $("#speakerRadius").addEventListener("input", e =>
    root.style.setProperty("--speaker-radius", (parseInt(e.target.value, 10) || 0) + "px"));

  /* --- Modus Hintergrundfarbe/-bild --- */
  modeSelect.addEventListener("change", applyBackground);

  /* --- Schrift: Haupt-Font (ganze UI via --font) + alternativer Titel-Font (.talk-title via --title-font).
     Eine Font-Liste als Single Source, alphabetisch, füllt beide Comboboxen. --- */
  const FONTS = [
    { name: "Arimo",       stack: `"Arimo", sans-serif` },
    { name: "Google Sans", stack: `"Google Sans Flex", sans-serif` },
    { name: "Inter",       stack: `"Inter", sans-serif` },
    { name: "Lato",        stack: `"Lato", sans-serif` },
    { name: "Montserrat",  stack: `"Montserrat", sans-serif` },
    { name: "Nunito",      stack: `"Nunito", sans-serif` },
    { name: "Open Sans",   stack: `"Open Sans", sans-serif` },
    { name: "Pliant",      stack: `"Pliant", sans-serif` },
    { name: "Poppins",     stack: `"Poppins", sans-serif` },
    { name: "Puritan",     stack: `"Puritan", sans-serif` },
    { name: "Roboto",      stack: `"Roboto", sans-serif` },
    { name: "Roboto Slab", stack: `"Roboto Slab", serif` },
    { name: "System",      stack: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` },
  ];
  const fontOptions = FONTS.map(f => `<option value='${f.stack}'>${f.name}</option>`).join("");
  const fontMainSel = $("#fontMain"), fontTitleSel = $("#fontTitle");
  fontMainSel.innerHTML = fontOptions;
  fontTitleSel.innerHTML = `<option value="">&lt; Kein abweichender Titelfont &gt;</option>` + fontOptions;
  fontMainSel.value = FONTS.find(f => f.name === "Roboto").stack;   // Default = aktuelle Hauptschrift
  fontMainSel.addEventListener("change", e => root.style.setProperty("--font", e.target.value));
  fontTitleSel.addEventListener("change", e =>
    root.style.setProperty("--title-font", e.target.value || "var(--font)"));   // leer → Titel folgt Hauptschrift

  /* --- Panel-Schatten an/aus --- */
  $("#panelShadow").addEventListener("change", e =>
    root.style.setProperty("--panel-shadow", e.target.checked ? "6px 6px 22px rgba(0,0,0,.22)" : "none"));

  /* --- Abgerundete Panel-Ecken an/aus --- */
  $("#panelRadius").addEventListener("change", e =>
    root.style.setProperty("--panel-corner", e.target.checked ? "6px" : "0"));

  /* --- Hintergrundbild-Upload: setzt das (vom Farbverlauf überlagerte) BG-Bild und schaltet in den Bild-Modus --- */
  $("#bgImgInput").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { bgImageUrl = r.result; modeSelect.value = "image"; applyBackground(); };
    r.readAsDataURL(f);
  });

  /* --- Dock-Logik: pro Seite genau EIN Panel sichtbar (exklusiv) ------- */
  const workspace = $("#workspace");
  const dockEls = { left: $("#dockLeft"), right: $("#dockRight") };
  const dockState = { left: "programm", right: null };
  const lastPanel = { left: "programm", right: "chat" };   // zuletzt gezeigtes Panel je Seite (für Ausklappen)
  const widthCollapsed = { left: false, right: false };    // true = nur breitenbedingt zu (→ bei ≥1024 zurückholen); manuelles Schließen setzt false

  /* --- Live-Breiten-Hints je Bereich (px) ----------------------------- */
  const detail = $(".detail__inner");   // Beitragspanel (Inhalt, max 1500px)
  const mainCol = $(".detail");          // gesamter mittlerer Bereich (Spalte inkl. Padding)
  const hints = {
    left:   $('.size-hint[data-hint="left"]'),
    center: $('.size-hint[data-hint="center"]'),
    right:  $('.size-hint[data-hint="right"]'),
  };
  const collapse = {
    left:  $('.dock-collapse[data-dock="left"]'),
    right: $('.dock-collapse[data-dock="right"]'),
  };
  function updateWidthHints() {
    const ws = workspace.getBoundingClientRect();
    const place = (hint, region, visible) => {
      if (!visible) { hint.classList.add("is-hidden"); return; }
      const r = region.getBoundingClientRect();
      hint.classList.remove("is-hidden");
      hint.textContent = Math.round(r.width) + " px";
      hint.style.left = (r.left - ws.left + r.width / 2) + "px";
    };
    place(hints.left,   dockEls.left,  !!dockState.left);
    place(hints.center, detail,        true);
    place(hints.right,  dockEls.right, !!dockState.right);
    // Mitte: „Mittlerer Bereich / Beitrag / Viewport"
    hints.center.textContent = Math.round(mainCol.getBoundingClientRect().width) + " / " + Math.round(detail.getBoundingClientRect().width) + " / " + window.innerWidth;

    // Nav-CTAs bündig zum Spalten-Gutter der Panels ausrichten (Icon-Kästchen = PROGRAMM/CHAT-Titelkante, 1.1rem):
    // links linksbündig, rechts spiegelbildlich rechtsbündig. Button-Padding kompensiert die vw-Nav-Polsterung.
    const RECT_OFF = 20 * 3 / 24;   // Icon-Rect beginnt/endet 3/24 innerhalb der 20px-Icon-Box → 2.5px
    const NUDGE = 2;                 // Feinabstimmung: Icon 2px nach innen (optischer Ausgleich zur Textkante)
    const brand = $(".brand__dot");
    const gutter = brand ? (brand.getBoundingClientRect().left - ws.left) : 17.6;
    if (collapse.left) {
      const bl = collapse.left.getBoundingClientRect().left - ws.left;
      collapse.left.style.paddingLeft = Math.max(0, gutter - RECT_OFF - bl + NUDGE) + "px";
    }
    if (collapse.right) {
      const br = ws.right - collapse.right.getBoundingClientRect().right;
      collapse.right.style.paddingRight = Math.max(0, gutter - RECT_OFF - br + NUDGE) + "px";
    }
  }

  /* --- Splitter: Spaltenbreite ziehen (px-Override); Resize → zurück auf clamp --- */
  let dragSide = null;
  const onMove = e => {
    if (!dragSide) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    if (dragSide === "left") workspace.style.setProperty("--list-w", Math.max(0, x) + "px");
    else workspace.style.setProperty("--right-w", Math.max(0, window.innerWidth - x) + "px");
    updateWidthHints();                 // live beim Ziehen
  };
  const stopDrag = () => { dragSide = null; document.body.style.userSelect = ""; };
  $("#splitterLeft").addEventListener("pointerdown",  () => { dragSide = "left";  document.body.style.userSelect = "none"; });
  $("#splitterRight").addEventListener("pointerdown", () => { dragSide = "right"; document.body.style.userSelect = "none"; });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", stopDrag);
  window.addEventListener("resize", () => {
    workspace.style.removeProperty("--list-w"); workspace.style.removeProperty("--right-w");
    if (window.innerWidth < 1024) {
      // beide offen → rechtes ausblenden (breitenbedingt → merken, damit es bei ≥1024 zurückkommt)
      if (dockState.left && dockState.right) { dockState.right = null; widthCollapsed.right = true; renderDock("right"); }
    } else {
      // wieder ≥1024: nur breitenbedingt geschlossene Seiten zurückholen (manuell geschlossene bleiben zu)
      ["left", "right"].forEach(side => {
        if (!dockState[side] && widthCollapsed[side]) { dockState[side] = lastPanel[side]; widthCollapsed[side] = false; renderDock(side); }
      });
    }
    updateWidthHints();
  });

  function renderDock(side) {
    const active = dockState[side];
    if (active) lastPanel[side] = active;            // zuletzt gezeigtes Panel merken
    $$(".panel", dockEls[side]).forEach(p =>
      p.classList.toggle("is-hidden", p.dataset.panel !== active));
    workspace.classList.toggle(side === "left" ? "has-left" : "has-right", !!active);
    $$(`.navitem[data-dock="${side}"]`).forEach(b =>
      b.classList.toggle("is-active", b.dataset.panel === active));
    // Ein-/Ausklapp-CTA in der Mainnav: Icon je Zustand aus der ICONS-Single-Source (offen → …-close, zu → …-open)
    const cbtn = collapse[side];
    if (cbtn) {
      cbtn.querySelector(".dock-collapse-icon").innerHTML = icon(`panel-${side}-${active ? "close" : "open"}`);
      cbtn.title = active ? "Panel einklappen" : "Panel ausklappen";
      cbtn.classList.toggle("is-collapsed", !active);
    }
    updateWidthHints();
  }
  function toggleDock(side, panel) {
    dockState[side] = (dockState[side] === panel) ? null : panel;  // erneuter Klick schließt die Seite
    widthCollapsed[side] = false;   // bewusste Nutzeraktion auf dieser Seite → nicht „breitenbedingt"
    // Schmal (<1024): Links- und Rechts-Menü verschmelzen — nur EIN Panel gesamt aktiv
    if (window.innerWidth < 1024 && dockState[side]) {
      const other = side === "left" ? "right" : "left";
      if (dockState[other]) { dockState[other] = null; widthCollapsed[other] = true; renderDock(other); }
    }
    renderDock(side);
  }
  $$(".navitem[data-panel]").forEach(b =>
    b.addEventListener("click", () =>
      document.body.classList.contains("is-mobile")
        ? selectSection(b.dataset.dock, b.dataset.panel)      // Mobile: Tab-Bar → Sektion zeigen
        : toggleDock(b.dataset.dock, b.dataset.panel)));      // Desktop: wie bisher (Toggle)
  $$(".dock-collapse").forEach(b =>
    b.addEventListener("click", () => {
      const side = b.dataset.dock;
      dockState[side] = dockState[side] ? null : lastPanel[side];   // einklappen ↔ ausklappen (letztes Panel)
      widthCollapsed[side] = false;   // manuelle Aktion → nicht „breitenbedingt"
      renderDock(side);
    }));

  /* --- Mobile-Modus (<700): Fuß-Toolbar, ein Panel pro Screen, Beitrag-Drill-in ---- */
  const body = document.body;
  const enterDetail = () => { if (body.classList.contains("is-mobile")) { body.classList.add("mobile-detail"); body.classList.remove("mobile-list"); } };
  const exitDetail  = () => { body.classList.remove("mobile-detail"); body.classList.add("mobile-list"); };
  // Mobile: Tab-Bar — Sektion immer zeigen (kein Toggle-Schließen), zurück auf Listen-Ansicht
  function selectSection(side, panel) {
    const other = side === "left" ? "right" : "left";
    dockState[side] = panel; dockState[other] = null;
    widthCollapsed[side] = false;
    body.classList.remove("nav-overflow-open");
    exitDetail();
    renderDock(other); renderDock(side);
  }
  function applyMobile() {
    const mobile = window.innerWidth < 700;
    body.classList.toggle("is-mobile", mobile);
    if (mobile) { if (!body.classList.contains("mobile-detail")) body.classList.add("mobile-list"); }
    else { body.classList.remove("mobile-list", "mobile-detail", "nav-overflow-open"); }
  }
  $("#backBtn").addEventListener("click", exitDetail);
  $("#navMore").addEventListener("click", () => body.classList.toggle("nav-overflow-open"));
  window.addEventListener("resize", applyMobile);
  applyMobile();

  /* --- Teilnehmende (Referenten-Control wiederverwendet) + Sub-Tabs ---- */
  const pplList = $("#pplList");
  let pplCat = "vortragende";
  function renderPeople() {
    pplList.innerHTML = (PEOPLE[pplCat] || []).map(p => renderSpeaker(p)).join("");
  }
  $$(".ppl-tab").forEach(b => b.addEventListener("click", () => {
    pplCat = b.dataset.pcat;
    $$(".ppl-tab").forEach(x => x.classList.toggle("is-active", x === b));
    renderPeople();
  }));

  /* --- Chat --- */
  const chatList = $("#chatList");
  function renderChat() {
    chatList.innerHTML = CHAT.map(m => `
      <li class="chat-msg${m.self ? " chat-msg--self" : ""}">
        <div class="chat-bubble">
          ${m.self ? "" : `<span class="chat-msg__name">${m.name}</span>`}
          <div class="chat-msg__text">${m.text}</div>
          <span class="chat-msg__time">${m.time}${m.self ? ` ${icon("check")}` : ""}</span>
        </div>
        <a class="chat-msg__reply" href="#">Antworten</a>
      </li>`).join("");
  }

  /* --- Start --- */
  $$("[data-icon]").forEach(el => { el.innerHTML = icon(el.dataset.icon); });  // statische Icons aus ICONS-Quelle füllen
  renderList();
  selectTalk(TALKS[0].id);
  renderPeople();
  renderChat();
  dockState.right = window.innerWidth >= 1600 ? "chat" : null;  // Chat initial nur bei genug Platz (≥1600px)
  renderDock("left");
  renderDock("right");
  updateWidthHints();
})();
