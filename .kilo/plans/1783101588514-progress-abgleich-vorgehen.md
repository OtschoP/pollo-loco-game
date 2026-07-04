# El Pollo Loco – Fortschrittsabgleich & Vorgehensplan (finalisiert)

## Kontext & Abgleich-Ergebnis

`progress.md` dokumentiert Technik-Arbeit bis 2026-04-28 (Offsets, Idle, ThrowableObject-
Rotation, ChickenSmall, Endboss-MVP + Attack) und stoppt vor allen Anforderungs-Arbeiten.
Der ältere Plan `plans/checkliste-abarbeitung.md` ist **veraltet**: Paket A (Quick Wins) ist
de facto bereits erledigt, obwohl dort teils ❌ steht.

Verifizierter Ist-Stand (grep/Read, nicht nur Plan-Aussage):

| Punkt | Plan sagt | Ist-Stand | Beleg |
|---|---|---|---|
| Kein `console.log` | ❌ | ✅ | grep über `js/ models/ levels/` leer |
| Favicon | ❌ | ✅ | `index.html:7` (`coin_1.png`) |
| `overflow: hidden` | ❌ | ✅ | `style.css` html+body |
| `lang="de"` | Todo | ✅ | `index.html:2` |
| Endscreen Restart/Home | ❌ | ❌ offen | `game.js:32-35` nur `reload()` |

## Entschiedene Richtlinien (vom Nutzer bestätigt)

1. **Sound-System (Paket B) vollständig aus Scope.** `audio/` ist leer, keine Assets.
   `progress.md` entsprechend anpassen (Sound als nicht umgesetzt markieren).
2. **Restart = `World.reset()` in-place** (gleiche World-Instanz weiterverwenden).
3. **Paket E (Clean Code) vollständig**: alle >14-Zeilen-Funktionen aufteilen + JSDoc für
   alle Klassen/öffentlichen Methoden.

## Wichtige technische Randbedingung (Timer-Leak)

Unabhängig von der Reset-Variante gelten diese Fakten aus dem Code:
- `World.run()` → `setInterval` OHNE Handle (`world.class.js:48`).
- `World.draw()` → rAF-Loop via `scheduleNextFrame()` (`world.class.js:221`), nie stoppend.
- `Character.animate()` → ZWEI `setInterval` ohne Handle (`character.class.js:95,117`).
- `MoveableObject.applyGravity()` → ein `setInterval` ohne Handle (`moveable-object.class.js:17`).
- `level1` ist ein `const` zur Ladezeit; `World` mutiert `level.coins`/`level.bottles`
  per `filter` (`world.class.js:136,146`) → Level ist nach Spiel leer.
- Gegner-State wird mutiert (`isDefeated`, `energy`, Position) → nicht trivial rücksetzbar.

**Folgerung für `reset()`:** Reines Zurücksetzen einzelner Flags ist fehleranfällig
(Gegner-Position/Tod/Energy). Korrekte in-place-Umsetzung = gleiche World-Instanz behalten,
aber `this.level` und `this.character` durch frische Instanzen ersetzen. Dafür MUSS
vorher jeder alte Timer gestoppt werden, sonst häufen sich pro Restart duplizierte
Intervalle (CPU-Leak, doppelte Frames/Gravity). Timer-Handle-Speicherung ist also
zwingend, nicht optional.

## Aufgabenplan (Reihenfolge verbindlich)

### Schritt 0 – Doku anpassen
- [ ] `progress.md`: erledigte Quick-Wins nachtragen (console.log, Favicon, overflow,
      lang) + Vermerk, dass `checkliste-abarbeitung.md` für Paket A veraltet ist.
- [ ] `progress.md`: Sound-System als bewusst nicht umgesetzt (Assets fehlen) kennzeichnen.

### Schritt 1 – Paket C: UI/UX
1.1 Restart ohne Reload:
- [ ] `World`: `run()`-Interval + rAF-Handle als Felder speichern (`runIntervalId`,
      `rafId`); `stop()`-Methode mit `clearInterval`/`cancelAnimationFrame`.
- [ ] `MoveableObject.applyGravity()` & `Character.animate()`: Interval-Handles auf
      Instanz speichern; `stopTimers()` bereitstellen.
- [ ] `levels/level1.js`: `const level1 = new Level(...)` umwandeln in Factory
      `createLevel1()`, die ein frisches `Level` zurückgibt. (`index.html`-Ladereihenfolge
      bleibt; `world.class.js` ruft `createLevel1()` statt `level1` auf.)
- [ ] `World.reset()`: alte Timer stoppen; `this.level = createLevel1()`;
      `this.character = new Character()`; `setWorld()`; Status-Bar-Prozente + Counter
      (`collectedCoins/Bottles`, `maxCoins/maxBottles`) neu setzen; `isGameOver`/
      `isGameWon = false`; `throwableObjects = []`; `camera_x = 0`; `previousCharacterBottom
      = null`; dann `run()`+`draw()` neu starten.
- [ ] Endscreen-Buttons (Restart + "Zurück zum Home") im Canvas oder als HTML-Overlay;
      Restart ruft `world.reset()`, Home zerstört World + zeigt Startscreen.
1.2 How-to-Play-Overlay:
- [ ] Dialog mit Tastenbelegung; öffnet/schließt per Button + Klick außerhalb.
- [ ] Statische `controls-hint` durch Button "Steuerung" ersetzen (Dialog bei Bedarf).
1.3 Fullscreen-Toggle:
- [ ] Button mit Fullscreen API (`requestFullscreen`/`exitFullscreen`).
1.4 Impressum:
- [ ] Modal/Seite mit **fiktiven** Daten (keine echten Personen/Adressen).

### Schritt 2 – Paket D: Mobile
- [ ] `Keyboard` um Touch-Methoden erweitern (`setKey(name, bool)` o.ä.); in `game.js`
      `touchstart`/`touchend` an Touch-Buttons binden (setzen gleiche Flags wie Keydown).
- [ ] Touch-Buttons (links/rechts/springen/werfen) in `index.html`; nur sichtbar via
      `@media (hover: none) and (pointer: coarse)`.
- [ ] `touch-action: none` + `oncontextmenu="return false"` auf Touch-Buttons.
- [ ] Portrait-Erkennung (`@media (orientation: portrait)` + JS-Class) + "Turn your
      Device"-Overlay.
- [ ] Canvas-Skalierung/kein Scrollbalken auf kleinen Auflösungen prüfen.

### Schritt 3 – Paket E: Clean Code (vollständig)
- [ ] `World.checkCollisions()` (~80 Zeilen, `world.class.js:76-156`) aufteilen in
      `checkEnemyCollisions()`, `checkBottleCollisions()`, `checkCollectibleCollisions()`
      (jeweils ≤14 Zeilen).
- [ ] `Character.animate()` (2 Intervalle, je >14 Zeilen) auslagern in kleine Helfer.
- [ ] Alle weiteren Funktionen auf ≤14 Zeilen prüfen/aufteilen.
- [ ] Alle Dateien < 400 LOC prüfen (`world.class.js` = 351, grenzwertig).
- [ ] JSDoc für alle Klassen + öffentlichen Methoden projektweit.

### Schritt 4 – Paket F: Testing & Qualität
- [ ] Manueller Durchlauf aller User Stories (Desktop + Mobile-Emulation).
- [ ] DevTools-Konsole: keine Fehler.
- [ ] Restart mehrfach hintereinander: kein Leistungsabfall (Timer-Leak-Check).
- [ ] Kollisions-Offsets visuell verifizieren (Debug-Frame).
- [ ] Idle/Sleep-Timing & Animationstempi prüfen.

## Abhängigkeiten / Reihenfolge-Begründung
```
0 (Doku) → 1 (C: UI/Restart) → 2 (D: Mobile) → 3 (E: Clean Code) → 4 (F: Test)
```
- C vor D: Restart/Endscreen sind zentral für spielbaren Mobile-Flow; Touch-Buttons bauen
  auf bestehender UI-Struktur auf.
- E nach Features: Refactor erst nach Feature-Freeze (vermeidet Konflikte).
- F zuletzt.

## Risiken
- **Timer-Leak bei Restart:** größtes Risiko. Mit Test in Schritt 4 abgedeckt
  (mehrfacher Restart → Performance-Check). Wenn `reset()` korrekt alle alten Handles
  cleart, kein Problem.
- **Gegner-State-Restore:** gelöst durch frische Level-Instanz (Factory); keine
  Feld-Rücksetzung nötig.
- **Level-Factory-Änderung:** berührt `index.html`-Ladereihenfolge nicht, da nur
  Funktionsdefinition statt `const`-Zuweisung; `World` muss Aufruf anpassen.

## Validierung (pro Schritt)
- `node --check` auf jede geänderte JS-Datei.
- Spiel im Browser starten + jeweilige Funktion prüfen.
- DevTools-Konsole fehlerfrei.
- Mobile: DevTools-Device-Emulation (Portrait/Landscape).

## Out of Scope
- Sound-System (Paket B): keine Assets vorhanden; bewusst nicht umgesetzt.

---

## Schritt 0 – Ausführungsspezifikation (für umsetzungsfähigen Agent)

Schritt 0 = reine Doku-Arbeit an `progress.md` (kein Code). Im Plan-Modus nicht direkt
ausführbar; folgender Block wird ans Ende von `progress.md` angehängt (nach Zeile 39,
direkt nach dem letzten 2026-04-28-Eintrag, ohne den Original-Prompt-Header zu ändern):

```markdown
2026-07-04
- Abgleich progress.md vs. aktuellem Codestand erstellt (Plan: .kilo/plans/1783101588514-progress-abgleich-vorgehen.md).
- Festgestellt: Paket A (Quick Wins) bereits erledigt – entgegen plans/checkliste-abarbeitung.md:
  - Keine console.log-Aufrufe mehr in js/ models/ levels/ (bereits entfernt).
  - Favicon vorhanden (index.html:7, img/8_coin/coin_1.png).
  - overflow: hidden gesetzt (style.css, html+body).
  - HTML lang="de" (index.html:2).
- plans/checkliste-abarbeitung.md ist für Paket A veraltet; weiterhin gültig für C, D, E, F.
- Sound-System (Paket B) bewusst aus Scope: audio/-Ordner leer, keine Assets vorhanden.
- Verbleibende Arbeit: C (UI/Restart), D (Mobile), E (Clean Code vollständig), F (Testing).
- Restart-Entscheidung: World.reset() in-place; zwingend Timer-Handle-Speicherung gegen Intervall-Leaks + Level-Factory (createLevel1()).
- Clean-Code-Entscheidung: vollständig (alle >14-Zeilen-Funktionen + JSDoc).
- Validation status:
  - Dieser Schritt enthält keine Code-Änderungen (nur Doku).
```

Validierung Schritt 0:
- [ ] Block korrekt am Ende von `progress.md` eingefügt.
- [ ] Keine bestehenden Einträge verändert (nur Anhang).
- [ ] `plans/checkliste-abarbeitung.md` unangetastet lassen (wird in späteren Schritten evtl. gepflegt).

Hinweis: Für die Ausführung von Schritt 0 (und aller Folgeschritte mit Code-Änderungen)
muss auf einen umsetzungsfähigen Agent gewechselt werden – der Plan-Modus darf keine
Quell- oder Doku-Dateien editieren.
