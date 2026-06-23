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

  /* --- Chrome-Icons (Lucide-Style SVG) für die Listeneinträge & Referenten --- */
  const ICON_BM   = '<svg class="icon" viewBox="0 0 24 24"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
  const ICON_MORE = '<svg class="icon" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>';

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
      subtitle: "Datum, Uhrzeit, Raum, Video, Referenten, Dateien und Beschreibung – alles inline.",
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
      subtitle: "Datum, Uhrzeit, Raum, Video, Referenten, Dateien und Beschreibung – alles inline.",
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

  const isOn = comp => { const el = $(`[data-toggle-comp="${comp}"]`); return el ? el.checked : false; };

  /* --- Render: Liste --------------------------------------------------- */
  function renderList() {
    talkList.innerHTML = TALKS.map(t => `
      <li class="talk-item${t.id === currentTalk.id ? " is-selected" : ""}" data-id="${t.id}">
        <div class="talk-item__main">
          <span class="talk-item__meta">${t.listMeta}</span>
          <span class="talk-item__title">${t.listTitle}</span>
        </div>
        <div class="talk-item__actions">
          <span class="talk-item__bm" title="Merken">${ICON_BM}</span>
          <span class="talk-item__more" title="Mehr">${ICON_MORE}</span>
        </div>
      </li>`).join("");

    $$(".talk-item", talkList).forEach(li =>
      li.addEventListener("click", () => selectTalk(li.dataset.id)));
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
          <span class="talk-sep" data-comp="room" aria-hidden="true">|</span>
          <a class="talk-room" data-comp="room" href="#">${t.room}</a>
        </span>
        <span class="talk-meta__cta">
          <button type="button" title="Als Kalendereintrag exportieren"><i class="fa-regular fa-calendar-plus"></i></button>
          <button type="button" title="Teilen"><i class="fa-regular fa-share-from-square"></i></button>
          <button type="button" title="Merken"><i class="fa-regular fa-bookmark"></i></button>
        </span>
      </div>
      <h2 class="talk-title">${t.title}</h2>`;
  }

  /* Beitrag-Inhalt (unter dem Kopf): Subtitle + Video + Join-CTA + Referenten + ggf. Inline-Extras */
  function renderBeitrag(t) {
    const videoBlock = t.mode === "video"
      ? `<div class="talk-video"><img src="${t.videoThumb}" alt="Video-Vorschau" /></div>` : "";
    const ctaBlock = t.cta
      ? `<button class="talk-cta-join" type="button"><span>${t.cta}</span><i class="fa-solid fa-video"></i></button>` : "";
    const speakers = `<ul class="speakers" data-comp="speakers">${t.speakers.map(s => renderSpeaker(s)).join("")}</ul>`;
    return `<p class="talk-subtitle" data-comp="subtitle">${t.subtitle}</p>${videoBlock}${ctaBlock}${speakers}${renderHeroExtra(t)}`;
  }

  /* Maximal-Showcase: Dateien + Beschreibung zusätzlich INLINE im Beitrag (adaptiv) */
  function renderHeroExtra(t) {
    if (!t.demoAll && !t.inlineExtras) return "";
    let extra = "";
    if (t.files && t.files.length)
      extra += `<hr class="talk-divider" /><h3 class="talk-section-label">Dokumente</h3>` + renderFiles(t.files, t.filesVariant || "onblue");
    if (t.description && t.description.length)
      extra += `<hr class="talk-divider" /><h3 class="talk-section-label">Beschreibung</h3>` + renderDescription(t);
    return extra;
  }

  function renderDescription(t) {
    return `<div class="talk-desc">${t.description.map(p => `<p>${p}</p>`).join("")}</div>`;
  }

  function renderFiles(files, variant) {
    const items = files.map(f => `
      <li class="file">
        <i class="fa-solid fa-file-pdf file__icon"></i>
        <span class="file__name">${f.name}</span>
        <span class="file__actions">
          ${f.preview ? '<button class="file__btn" type="button" title="Vorschau"><i class="fa-solid fa-eye"></i></button>' : ""}
          <button class="file__btn" type="button" title="Download"><i class="fa-solid fa-download"></i></button>
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
    // Kopf (auf jedem Tab identisch) + Trennerlinie + Tab-Name-Überschrift + Inhalt
    const heading = t.noTabs ? "" : `<h3 class="talk-tab-heading">${TAB_NAMES[tab] || ""}</h3>`;
    card.innerHTML = `<div class="talk-card__body">${renderHeader(t)}<hr class="talk-divider" />${heading}${content}</div>`;
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
    ["date", "time", "room", "subtitle", "speakers"].forEach(comp => {
      const on = forceAll || isOn(comp);
      $$(`[data-comp="${comp}"]`, card).forEach(el => el.classList.toggle("is-hidden", !on));
    });
  }

  /* --- Settings: Modus Farbe/Bild (nur Beitrag-Hero, keine Video-Karte) --- */
  function applyBackground() {
    if (currentTab !== "beitrag" || currentTalk.mode === "video") {
      card.classList.remove("mode-image"); card.style.backgroundImage = ""; return;
    }
    if (modeSelect.value === "image") {
      card.classList.add("mode-image");
      card.style.backgroundImage = "linear-gradient(120deg, rgba(3,94,124,.55), rgba(3,94,124,.9)), url('https://picsum.photos/1280/720?grayscale')";
    } else {
      card.classList.remove("mode-image"); card.style.backgroundImage = "";
    }
  }

  /* --- Sub-Tabs klickbar --- */
  $$(".subtab").forEach(b => b.addEventListener("click", () => selectTab(b.dataset.tab)));

  /* --- Settings-Drawer öffnen/schließen --- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  const open  = () => { drawer.classList.add("is-open"); scrim.classList.add("is-open"); };
  const close = () => { drawer.classList.remove("is-open"); scrim.classList.remove("is-open"); };
  $("#openSettings").addEventListener("click", open);
  $("#closeSettings").addEventListener("click", close);
  scrim.addEventListener("click", close);

  /* --- Komponenten-Toggles: neu rendern (steuern Inline-Elemente UND Tab-Inhalte) --- */
  $$("[data-toggle-comp]").forEach(t => t.addEventListener("change", refresh));

  /* --- Farben -> Design-Tokens live (lc-color-picker) --- */
  const colorMap = { desktop: "--ui-canvas", bg: "--z-bg", primary: "--z-fg", secondary: "--z-fg-muted", tertiary: "--z-fg-tertiary", link: "--ui-accent", ctaPanel: "--z-cta", header: "--ui-header", mainnav: "--ui-mainnav", leftpanel: "--ui-leftpanel" };
  const BG_ANGLE  = 177;        // Default-Winkel des Start-Gradients (muss zu --z-bg in style.css passen)
  let bgLastSolid = "#035E7C";  // Basis-Solidfarbe für die Gradient-Vorbelegung
  let bgPrevGrad  = true;       // Prototyp startet mit Gradient-Default (body.bg-is-gradient ist gesetzt)
  $$("[data-color]").forEach(inp => {
    new lc_color_picker(inp, {
      modes: inp.dataset.color === "bg"
        ? ["solid", "linear-gradient", "radial-gradient"]
        : ["solid"],
      transparency: false,
      on_change: (val, field) => {
        if (field.dataset.color === "bg") {
          const isGrad = val.includes("gradient");
          if (!isGrad) bgLastSolid = val;
          bgPrevGrad = isGrad;
          document.body.classList.toggle("bg-is-gradient", isGrad);
        }
        root.style.setProperty(colorMap[field.dataset.color], val);
      },
    });
  });
  /* Erster Wechsel Solid → Gradient: lc-color-picker startet hart bei Weiß→Schwarz und
     reicht den Default zudem zeitverzögert (debounced) an on_change durch.
     Wir fangen den Gradient-Tab-Klick in der Capture-Phase ab und installieren
     "letzteSolid → Weiß":
       1. Wert ins Input schreiben + Picker per Close→Reopen neu einlesen lassen
          (show_picker → load_gradient_data parst input.value → korrekte Stops + Winkel).
       2. Token sofort selbst setzen (kein Flash).
       3. Winkel-Slider anstoßen: das setzt den debounce-Timer zurück und verwirft so den
          beim Mode-Switch eingereihten Default-Callback; on_change feuert stattdessen mit
          dem aktuell gerenderten Gradient. */
  window.addEventListener("click", e => {
    const mode = e.target.closest?.("[data-mode]")?.getAttribute("data-mode");
    if (!mode?.includes("gradient") || bgPrevGrad) return;
    bgPrevGrad = true;                             // kein Re-Entry bei weiteren Klicks
    const bgInp = $('[data-color="bg"]');
    const preferred = mode === "radial-gradient"
      ? `radial-gradient(circle, ${bgLastSolid} 50%, #ffffff 100%)`
      : `linear-gradient(${BG_ANGLE}deg, ${bgLastSolid} 50%, #ffffff 100%)`;
    setTimeout(() => {
      bgInp.value = preferred;
      document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));   // Picker schließen
      setTimeout(() => {
        bgInp.closest(".lccp-preview-right")?.querySelector(".lccp-preview")?.click();  // neu öffnen
        root.style.setProperty("--z-bg", preferred);
        document.body.classList.add("bg-is-gradient");
        $("#lc-color-picker .pccp_deg_f_wrap input[type='range']")
          ?.dispatchEvent(new Event("input", { bubbles: true }));   // debounce-Reset → verwirft Default
      }, 50);
    }, 100);
  }, true);

  /* --- Links unterstrichen --- */
  $("#underline").addEventListener("change", e =>
    document.body.classList.toggle("no-underline", !e.target.checked));

  /* --- Modus Hintergrundfarbe/-bild --- */
  modeSelect.addEventListener("change", applyBackground);

  /* --- Panel-Schatten an/aus --- */
  $("#panelShadow").addEventListener("change", e =>
    root.style.setProperty("--panel-shadow", e.target.checked ? "6px 6px 22px rgba(0,0,0,.22)" : "none"));

  /* --- Abgerundete Panel-Ecken an/aus --- */
  $("#panelRadius").addEventListener("change", e =>
    root.style.setProperty("--panel-corner", e.target.checked ? "6px" : "0"));

  /* --- Logo-Upload-Vorschau --- */
  $("#logoInput").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { $("#logoDrop").innerHTML = `<img src="${r.result}" alt="Logo" />`; };
    r.readAsDataURL(f);
  });

  /* --- Dock-Logik: pro Seite genau EIN Panel sichtbar (exklusiv) ------- */
  const workspace = $("#workspace");
  const dockEls = { left: $("#dockLeft"), right: $("#dockRight") };
  const dockState = { left: "programm", right: null };
  const lastPanel = { left: "programm", right: "chat" };   // zuletzt gezeigtes Panel je Seite (für Ausklappen)

  /* --- Live-Breiten-Hints je Bereich (px) ----------------------------- */
  const detail = $(".detail__inner");   // misst das Beitragspanel (inkl. 1500px-Einfrieren), nicht die ganze Spalte
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
    // Mitte zusätzlich mit Gesamt-Viewport: „Beitrag / Viewport"
    hints.center.textContent = Math.round(detail.getBoundingClientRect().width) + " / " + window.innerWidth;

    // Griffe: offen → Innenkante (Einklappen, mittig auf Kopfzeile),
    //         eingeklappt → Außenkante (Ausklappen, auf Tab-Leisten-Höhe)
    const refCenterY = dockEl => {
      const panel = dockEl.querySelector(".panel:not(.is-hidden)");
      if (!panel) return null;
      const ref = panel.querySelector(".switch") || panel.querySelector(".panel__title, .listpanel__title, .ppl-tabs");
      if (!ref) return null;
      const rr = ref.getBoundingClientRect();
      return rr.top + rr.height / 2 - ws.top - 15;   // 15 = halbe Griffhöhe (30)
    };
    const tb = $(".tabbar").getBoundingClientRect();
    ["left", "right"].forEach(side => {
      const h = collapse[side];
      const open = !!dockState[side];
      h.classList.remove("is-hidden");
      h.classList.toggle("is-collapsed", !open);
      h.querySelector(".dock-collapse-label").textContent = open ? "Einklappen" : "Ausklappen";
      if (open) {
        const r = dockEls[side].getBoundingClientRect();
        // wie zuvor: Griff überlappt die Kante, ragt nur ~14px über (kleiner Footprint)
        if (side === "left") { h.style.right = (ws.width - (r.right - ws.left) - 14) + "px"; h.style.left = ""; }
        else { h.style.left = (r.left - ws.left - 14) + "px"; h.style.right = ""; }
        const cy = refCenterY(dockEls[side]); if (cy != null) h.style.top = cy + "px";
      } else {
        if (side === "left") { h.style.left = "0px"; h.style.right = ""; }
        else { h.style.right = "0px"; h.style.left = ""; }
        h.style.top = (tb.top + tb.height / 2 - ws.top - 15) + "px";
      }
    });
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
  window.addEventListener("resize", () => { workspace.style.removeProperty("--list-w"); workspace.style.removeProperty("--right-w"); updateWidthHints(); });

  function renderDock(side) {
    const active = dockState[side];
    if (active) lastPanel[side] = active;            // zuletzt gezeigtes Panel merken
    $$(".panel", dockEls[side]).forEach(p =>
      p.classList.toggle("is-hidden", p.dataset.panel !== active));
    workspace.classList.toggle(side === "left" ? "has-left" : "has-right", !!active);
    $$(`.navitem[data-dock="${side}"]`).forEach(b =>
      b.classList.toggle("is-active", b.dataset.panel === active));
    updateWidthHints();
  }
  function toggleDock(side, panel) {
    dockState[side] = (dockState[side] === panel) ? null : panel;  // erneuter Klick schließt die Seite
    renderDock(side);
  }
  $$(".navitem[data-panel]").forEach(b =>
    b.addEventListener("click", () => toggleDock(b.dataset.dock, b.dataset.panel)));
  $$(".dock-collapse").forEach(b =>
    b.addEventListener("click", () => {
      const side = b.dataset.dock;
      dockState[side] = dockState[side] ? null : lastPanel[side];   // einklappen ↔ ausklappen (letztes Panel)
      renderDock(side);
    }));

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
          <span class="chat-msg__time">${m.time}${m.self ? ' <i class="fa-solid fa-check"></i>' : ""}</span>
        </div>
        <a class="chat-msg__reply" href="#">Antworten</a>
      </li>`).join("");
  }

  /* --- Start --- */
  renderList();
  selectTalk(TALKS[0].id);
  renderPeople();
  renderChat();
  dockState.right = window.innerWidth >= 1600 ? "chat" : null;  // Chat initial nur bei genug Platz (≥1600px)
  renderDock("left");
  renderDock("right");
  updateWidthHints();
})();
