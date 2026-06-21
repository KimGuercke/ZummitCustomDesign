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
  function renderHero(t) {
    const speakers = t.speakers.map(s => `
      <li class="speaker">
        <img class="speaker-img" src="${s.img}" alt="" loading="lazy" />
        <div class="speaker-info">
          <a class="speaker-name" href="#">${s.name}</a>
          <span class="speaker-role">${s.role}</span>
          <span class="speaker-org">${s.org}</span>
        </div>
        <div class="speaker__actions">
          <span class="speaker__bm" title="Merken">${ICON_BM}</span>
          <span class="speaker__more" title="Mehr">${ICON_MORE}</span>
        </div>
      </li>`).join("");

    const videoBlock = t.mode === "video"
      ? `<div class="talk-video"><img src="${t.videoThumb}" alt="Video-Vorschau" /></div>` : "";
    const ctaBlock = t.cta
      ? `<button class="talk-cta-join" type="button"><span>${t.cta}</span><i class="fa-solid fa-video"></i></button>` : "";

    return `
      <div class="talk-meta">
        <span class="talk-meta__left">
          <span class="talk-date is-hidden" data-comp="date">${t.date}</span>
          <span class="talk-time" data-comp="time">${t.time}</span>
          <span class="talk-sep" data-comp="room" aria-hidden="true">|</span>
          <a class="talk-room" data-comp="room" href="#">${t.room}</a>
        </span>
        ${t.cardCta ? `<span class="talk-meta__cta">
          <button type="button" title="Als Kalendereintrag exportieren"><i class="fa-regular fa-calendar-plus"></i></button>
          <button type="button" title="Teilen"><i class="fa-regular fa-share-from-square"></i></button>
          <button type="button" title="Merken"><i class="fa-regular fa-bookmark"></i></button>
        </span>` : ""}
      </div>
      <h2 class="talk-title">${t.title}</h2>
      <p class="talk-subtitle" data-comp="subtitle">${t.subtitle}</p>
      ${videoBlock}
      ${ctaBlock}
      <hr class="talk-divider" data-comp="speakers" />
      <ul class="speakers" data-comp="speakers">${speakers}</ul>
      ${renderHeroExtra(t)}`;
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
    const isHero = tab === "beitrag";
    const flow = !isHero || t.mode === "video" || t.autoHeight;  // 16:9 nur im Beitrag-Hero (color)
    card.className = "talk-card" + (flow ? " mode-flow" : "");
    card.style.backgroundImage = "";

    let inner;
    if (tab === "beitrag") {
      inner = renderHero(t);
    } else if (tab === "details") {
      inner = (isOn("description") && t.description && t.description.length)
        ? renderDescription(t) : emptyTab("Keine Detailbeschreibung vorhanden.");
    } else if (tab === "downloads") {
      inner = (isOn("files") && t.files && t.files.length)
        ? renderFiles(t.files, t.filesVariant || "onblue") : emptyTab("Keine Dateien vorhanden.");
    } else {
      inner = emptyTab("Inhalt folgt.");
    }
    card.innerHTML = `<div class="talk-card__body">${inner}</div>`;
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
    // Externe CTA (Tab-Leiste) ausblenden, wenn die Icons im Card-Bereich liegen (nur Beitrag)
    const inCard = !!currentTalk.cardCta && currentTab === "beitrag";
    $(".card-cta").classList.toggle("is-hidden", inCard);
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

  /* --- Farben -> Design-Tokens live --- */
  const colorMap = { desktop: "--ui-canvas", bg: "--z-bg", primary: "--z-fg", secondary: "--z-fg-muted", tertiary: "--z-fg-tertiary", link: "--ui-accent", ctaPanel: "--z-cta" };
  $$("[data-color]").forEach(inp => inp.addEventListener("input", () =>
    root.style.setProperty(colorMap[inp.dataset.color], inp.value)));

  /* --- Links unterstrichen --- */
  $("#underline").addEventListener("change", e =>
    document.body.classList.toggle("no-underline", !e.target.checked));

  /* --- Modus Hintergrundfarbe/-bild --- */
  modeSelect.addEventListener("change", applyBackground);

  /* --- Logo-Upload-Vorschau --- */
  $("#logoInput").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { $("#logoDrop").innerHTML = `<img src="${r.result}" alt="Logo" />`; };
    r.readAsDataURL(f);
  });

  /* --- Splitter: Listenbreite ziehen (Override 320–520),
         Fenster-Resize setzt zurück auf Auto-Breite (CSS clamp) --- */
  const splitter = $("#splitter"); let dragging = false;
  const onMove = e => {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const w = Math.max(320, Math.min(520, x));
    root.style.setProperty("--list-w", w + "px");
  };
  const stop = () => { dragging = false; document.body.style.userSelect = ""; };
  splitter.addEventListener("pointerdown", () => { dragging = true; document.body.style.userSelect = "none"; });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", stop);
  window.addEventListener("resize", () => root.style.removeProperty("--list-w"));

  /* --- Start --- */
  renderList();
  selectTalk(TALKS[0].id);
})();
