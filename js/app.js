/* =========================================================================
   Zummit Custom Design — Prototyp · App-Logik
   Settings-Drawer, Komponenten-Toggles, Farben-Live, Modus, Logo-Upload,
   Listenauswahl, Liste ein-/ausklappen, Splitter (Listenbreite ziehen).
   ========================================================================= */
(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const card = $("#card");

  /* --- Settings-Drawer öffnen/schließen --- */
  const drawer = $("#drawer"), scrim = $("#scrim");
  const open  = () => { drawer.classList.add("is-open"); scrim.classList.add("is-open"); };
  const close = () => { drawer.classList.remove("is-open"); scrim.classList.remove("is-open"); };
  $("#openSettings").addEventListener("click", open);
  $("#closeSettings").addEventListener("click", close);
  scrim.addEventListener("click", close);

  /* --- Komponenten-Toggles steuern Karte live --- */
  $$("[data-toggle-comp]").forEach(t => t.addEventListener("change", () => {
    const comp = t.dataset.toggleComp;
    $$(`[data-comp="${comp}"]`, card).forEach(el => el.classList.toggle("is-hidden", !t.checked));
  }));

  /* --- Farben -> Design-Tokens live --- */
  const colorMap = { bg: "--z-bg", primary: "--z-fg", secondary: "--z-fg-muted", tertiary: "--z-fg-tertiary", link: "--ui-accent" };
  $$("[data-color]").forEach(inp => inp.addEventListener("input", () =>
    root.style.setProperty(colorMap[inp.dataset.color], inp.value)));

  /* --- Links unterstrichen --- */
  $("#underline").addEventListener("change", e =>
    document.body.classList.toggle("no-underline", !e.target.checked));

  /* --- Modus Hintergrundfarbe/-bild --- */
  $("#mode").addEventListener("change", e => {
    if (e.target.value === "image") {
      card.classList.add("mode-image");
      card.style.backgroundImage = "linear-gradient(120deg, rgba(3,94,124,.55), rgba(3,94,124,.9)), url('https://picsum.photos/1280/720?grayscale')";
    } else {
      card.classList.remove("mode-image");
      card.style.backgroundImage = "";
    }
  });

  /* --- Logo-Upload-Vorschau --- */
  $("#logoInput").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { $("#logoDrop").innerHTML = `<img src="${r.result}" alt="Logo" />`; };
    r.readAsDataURL(f);
  });

  /* --- Listenauswahl --- */
  $$(".talk-item").forEach(it => it.addEventListener("click", () => {
    $$(".talk-item").forEach(x => x.classList.remove("is-selected"));
    it.classList.add("is-selected");
  }));

  /* --- Liste ein-/ausklappen --- */
  $("#collapse").addEventListener("click", () => $("#workspace").classList.toggle("is-collapsed"));

  /* --- Splitter: Listenbreite dynamisch ziehen --- */
  const splitter = $("#splitter"); let dragging = false;
  const onMove = e => {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const w = Math.max(220, Math.min(560, x));
    root.style.setProperty("--list-w", w + "px");
  };
  const stop = () => { dragging = false; document.body.style.userSelect = ""; };
  splitter.addEventListener("pointerdown", () => { dragging = true; document.body.style.userSelect = "none"; });
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", stop);
})();
