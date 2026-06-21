/* =========================================================================
   Zummit Custom Design — Prototyp · App-Logik
   - Vortrags-Daten (Single Source) + Render der Liste & Karte
   - Karten-Modi: color (16:9, Zahnrad-gesteuert) | image | video (16:9 entfällt)
   - Settings-Drawer steuert die jeweils aktive Karte live
   - Splitter (Listenbreite ziehen) mit Reset auf Auto-Breite bei Fenster-Resize
   ========================================================================= */
(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  const card       = $("#card");
  const talkList   = $("#talkList");
  const modeSelect = $("#mode");

  /* --- Chrome-Icons (Lucide-Style SVG) für die Listeneinträge --- */
  const ICON_BM   = '<svg class="icon" viewBox="0 0 24 24"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
  const ICON_MORE = '<svg class="icon" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>';

  /* --- Referenten (wiederverwendbar) --- */
  const SP = {
    mueller:    { img: "https://randomuser.me/api/portraits/women/65.jpg", name: "Dr. Mellanie Müller-Rügenwald", role: "Head of Marketing", org: "Glücksstadt Tourismus e.V" },
    mustermann: { img: "https://randomuser.me/api/portraits/men/32.jpg",   name: "Prof. Dr. Walter Mustermann",   role: "Direktor des Instituts für Verfahrens- und Umwelttechnik", org: "Technische Universität Dresden" },
    hambloch:   { img: "https://randomuser.me/api/portraits/women/44.jpg", name: "Sandra Hambloch-Dick",          role: "Referentin", org: "Bündnis gegen Cybermobbing e.V." },
  };

  /* --- Vortrags-Daten — Single Source für Liste UND Karte --- */
  const TALKS = [
    {
      id: "standard", mode: "color",
      listMeta: "10:00–11:00 | Hauptsaal", listTitle: "Standard-Sample (Zahnrad-Einstellungen)",
      date: "Sa. 20.06.2026", time: "15:30 - 16:30", room: "Hörsaal 3",
      title: "Das ist der Titel zu dem Vortrag mit einemsehrlangenwörtchen zum testen",
      subtitle: "Das ist der Subtitel falls der vorhanden ist, kann man diesen optional mit einblenden.",
      speakers: [SP.mueller, SP.mustermann],
    },
    {
      id: "video", mode: "video", videoThumb: "assets/video-thumb.jpg",
      cta: "Zum Vortrag - jetzt beitreten",
      listMeta: "11:00–12:00 | Hauptsaal", listTitle: "Vortrag mit Video on Demand",
      date: "Sa. 20.06.2026", time: "11:00 - 12:35", room: "Hörsaal 3",
      title: "Like dich selbst – Selbstbewusst & resilient gegen Cybermobbing",
      subtitle: "Aufzeichnung · Woche der Familiengesundheit · 15.–22.05.2026",
      speakers: [SP.hambloch],
      description: [
        "Heutzutage nutzen Kinder und Jugendliche ihr Smartphone ganz selbstverständlich – ob im Bus, im Café oder im Park, fast immer ist das Handy dabei. Soziale Netzwerke wie Instagram, Snapchat und TikTok ermöglichen den ständigen Kontakt zu Freund*innen. Auch das Gaming ist für viele eine sinnvolle Freizeitbeschäftigung und sorgt für gewünschte Erfolgserlebnisse. Darüber hinaus bietet das Smartphone vielfältige weitere Nutzungsmöglichkeiten.",
        "Die meisten Jugendlichen nutzen digitale Medien funktional und freizeitorientiert. Doch worauf sollten Eltern achten? Welche digitalen Angebote sind förderlich, welche Strukturen und Rahmenbedingungen sollten Eltern setzen? Wie viel Medienkonsum ist gut – und ab wann wird es zu viel? Wie können wir als Eltern Schutzfaktoren stärken und riskantes Verhalten frühzeitig erkennen?",
        "Im Workshop werden die Definition von Mediensucht, Möglichkeiten zur Stärkung von Schutzfaktoren sowie konkrete Tipps zur Medienerziehung vermittelt.",
      ],
    },
    {
      id: "experiment", mode: "color",
      listMeta: "12:00–13:00 | Hauptsaal", listTitle: "Experimentier-Vortrag",
      date: "Sa. 20.06.2026", time: "12:00 - 13:00", room: "Raum 2",
      title: "Spielwiese – hier kannst du Einstellungen testen",
      subtitle: "Subtitle zum Ausprobieren.",
      speakers: [SP.mustermann],
    },
  ];

  let currentTalk = TALKS[0];

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

  /* --- Render: Karte --------------------------------------------------- */
  function renderCard(t) {
    const speakers = t.speakers.map(s => `
      <li class="speaker">
        <img class="speaker-img" src="${s.img}" alt="" loading="lazy" />
        <div class="speaker-info">
          <a class="speaker-name" href="#">${s.name}</a>
          <span class="speaker-role">${s.role}</span>
          <span class="speaker-org">${s.org}</span>
        </div>
      </li>`).join("");

    const videoBlock = t.mode === "video"
      ? `<div class="talk-video"><img src="${t.videoThumb}" alt="Video-Vorschau" /></div>`
      : "";

    const ctaBlock = t.cta
      ? `<button class="talk-cta-join" type="button">${t.cta}</button>`
      : "";

    const descBlock = (t.description && t.description.length)
      ? `<hr class="talk-divider" /><div class="talk-desc">${t.description.map(p => `<p>${p}</p>`).join("")}</div>`
      : "";

    card.className = "talk-card" + (t.mode === "video" ? " mode-video" : "");
    card.style.backgroundImage = "";   // Reset; applyBackground() setzt ggf. neu
    card.innerHTML = `
      <div class="talk-card__body">
        <div class="talk-meta">
          <span class="talk-meta__left">
            <span class="talk-date is-hidden" data-comp="date">${t.date}</span>
            <span class="talk-time" data-comp="time">${t.time}</span>
            <span class="talk-sep" data-comp="room" aria-hidden="true">|</span>
            <a class="talk-room" data-comp="room" href="#">${t.room}</a>
          </span>
        </div>
        <h2 class="talk-title">${t.title}</h2>
        <p class="talk-subtitle" data-comp="subtitle">${t.subtitle}</p>
        ${videoBlock}
        ${ctaBlock}
        <hr class="talk-divider" data-comp="speakers" />
        <ul class="speakers" data-comp="speakers">${speakers}</ul>
        ${descBlock}
      </div>`;
  }

  /* --- Auswahl: Liste -> Karte ---------------------------------------- */
  function selectTalk(id) {
    currentTalk = TALKS.find(t => t.id === id) || TALKS[0];
    $$(".talk-item", talkList).forEach(li =>
      li.classList.toggle("is-selected", li.dataset.id === currentTalk.id));
    renderCard(currentTalk);
    applyBackground();
    applyComponentVisibility();
  }

  /* --- Settings: Komponenten-Sichtbarkeit auf aktive Karte anwenden --- */
  function applyComponentVisibility() {
    $$("[data-toggle-comp]").forEach(t => {
      const comp = t.dataset.toggleComp;
      $$(`[data-comp="${comp}"]`, card).forEach(el => el.classList.toggle("is-hidden", !t.checked));
    });
  }

  /* --- Settings: Modus Farbe/Bild (nur Nicht-Video-Karten) ------------ */
  function applyBackground() {
    if (currentTalk.mode === "video") return;   // Video-Karte ignoriert Farb-/Bild-Modus
    if (modeSelect.value === "image") {
      card.classList.add("mode-image");
      card.style.backgroundImage = "linear-gradient(120deg, rgba(3,94,124,.55), rgba(3,94,124,.9)), url('https://picsum.photos/1280/720?grayscale')";
    } else {
      card.classList.remove("mode-image");
      card.style.backgroundImage = "";
    }
  }

  /* --- Settings-Drawer öffnen/schließen --- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  const open  = () => { drawer.classList.add("is-open"); scrim.classList.add("is-open"); };
  const close = () => { drawer.classList.remove("is-open"); scrim.classList.remove("is-open"); };
  $("#openSettings").addEventListener("click", open);
  $("#closeSettings").addEventListener("click", close);
  scrim.addEventListener("click", close);

  /* --- Komponenten-Toggles --- */
  $$("[data-toggle-comp]").forEach(t => t.addEventListener("change", applyComponentVisibility));

  /* --- Farben -> Design-Tokens live --- */
  const colorMap = { bg: "--z-bg", primary: "--z-fg", secondary: "--z-fg-muted", tertiary: "--z-fg-tertiary", link: "--ui-accent" };
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

  /* --- Liste ein-/ausklappen --- */
  $("#collapse").addEventListener("click", () => $("#workspace").classList.toggle("is-collapsed"));

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
