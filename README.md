# Zummit Custom Design — Prototyp

Prototyp für das **Stylen & Konfigurieren von Entitäten** der Zummit EventSuite
mit Schwerpunkt **Fluid-Design**. Der blaue Beitrags-/Vortrags-Frame ist **immer
16:9** (video-tauglich) und skaliert wie ein gerendertes Bild.

## Starten

Einfach **`index.html` doppelklicken** — alles ist in einer Datei (CSS+JS inline),
kein Server nötig. (Profilbilder/Logo-Demo laden Bilder aus dem Netz.)

## Aufbau (eine Datei: `index.html`)

- **Sticky Header** mit Logo, Titel, User + Settings-Zahnrad
- **Hauptmenü**: Event · Programm · Aussteller · Personen · Infos
- **Liste links** (Programm, Datum, Vorträge) — Breite per Splitter ziehbar, einklappbar
- **Detail rechts**: Sub-Tabs + der **blaue 16:9-Frame** mit Zeit/Raum, Titel,
  optionalem **Subtitle**, Trennlinie und Referenten
- **Settings-Drawer** (Zahnrad oben rechts): „Farben Designvorgaben" — steuert
  die Karte **live**

## Technik

- **Vanilla HTML/CSS/JS**, eine self-contained Datei.
- **16:9 hart** über `aspect-ratio: 16/9` + `overflow:hidden`.
- **Skalierung: PUR `cqi`, kein `clamp`** — ein Master-Faktor `--scale = 2.4cqi`
  steuert alle Maße (Fonts, Paddings, Gaps, Bilder). Dadurch ist das Layout bei
  jeder Breite identisch (gleicher Umbruch) → der Inhalt passt bei *jeder* Breite
  ins 16:9. Das ist das „gerendertes-Bild/Video"-Verhalten.
- **Design-Tokens** (`--z-bg`, `--z-fg`, `--z-fg-muted`, …) → vom Settings-Dialog
  zur Laufzeit gesetzt.

Verifiziert: Frame exakt `ratio 1.778` (16:9), `content_overflow = 0` bei breiter
und schmaler Ansicht; Settings-Toggles/Farben wirken live.

## Bewusste Annahmen / offene Punkte

- **Format-Dropdowns** (5:2, 1600×400) im Settings sind aktuell **visuell** — die
  Karte bleibt hart 16:9 (deine Vorgabe „immer 16:9"). Bei Bedarf verdrahtbar.
- **„CTAs / Links"**-Farbe → auf die App-Chrome-Links gemappt; Links *im* blauen
  Frame bleiben weiß (Kontrast).
- **Sub-Tabs** (Beitrag/Details/…), **Bookmark** und **„…"-Menüs** sind visuell.
- **Logo-Upload** zeigt eine Vorschau im Dialog, wird (noch) nicht auf der Karte
  platziert.

## Nächste Schritte (Idee)

- Logo auf der Karte platzieren · Format-Dropdowns ggf. an Karte koppeln ·
  pro Listeneintrag eigene Inhalte · für den echten Aufbau: saubere Trennung
  HTML/CSS/JS + TypeScript (Ziel-Sprache, noch zu entscheiden).
