# Review-Umsetzungsplan

Basierend auf `review.md` — Mängel gezielt beheben.

---

## Issue 1: Projektstruktur — `classes`-Ordner fehlt

- **Status:** Erledigt — `models/` wurde in `classes/` umbenannt und `index.html` lädt die Klassendateien aus `classes/`.
- **Betroffen:** Alle `*.class.js`-Dateien liegen in `models/` statt in `classes/`
- **Lösung:** Ordner `models/` umbenennen in `classes/` oder neuen Ordner `classes/` anlegen und Dateien verschieben
- **Aufwand:** Niedrig — reine Umbenennung, dann Pfade in allen `<script>`-Tags in `index.html` und allen `import`-artigen Referenzen anpassen
- **Check:** 18 `<script>`-Tags in `index.html` plus alle `world.class.js`-Referenzen (z.B. `new Character()`, `new Level()` etc.)

---

## Issue 2: Projektstruktur — `templates`-Ordner fehlt

- **Status:** Erledigt — dokumentiert in `progress.md`; kein leerer `templates/`-Ordner, weil aktuell keine dynamischen Templates existieren.
- **Betroffen:** Kein `templates/`-Ordner vorhanden
- **Bewertung:** Aktuell gibt es keine Templates im Code. Dialoge, Endscreen, Startbutton und Mobile-Controls sind statisch in `index.html` geschrieben.
- **Lösung:** Keinen künstlichen `templates/`-Ordner anlegen. Stattdessen im Review/README begründen: "Es gibt keine dynamisch generierten HTML-Templates; statischer HTML-Code liegt bewusst in `index.html`."
- **Aufwand:** Minimal
- **Hinweis:** Ein `templates/`-Ordner wäre erst sinnvoll, wenn echte Template-Dateien oder wiederverwendbare HTML-Fragmente eingeführt werden.

---

## Issue 3: `style.css` — über 400 LOC (465 Zeilen)

- **Status:** Erledigt — Basis-Styles bleiben in `style.css`; Media Queries, Mobile-, Touch- und Portrait-Regeln liegen in `style-responsive.css`.
- **Betroffen:** `style.css` (465 Zeilen)
- **Lösung:** CSS auf mehrere Dateien aufteilen:
  - `style.css` → Basis-Styles (< 400 Zeilen)
  - `style-responsive.css` → Media Queries, Mobile, Touch, Portrait-Warning
  - oder thematisch: `style-base.css`, `style-mobile.css`, `style-modal.css`
- **Check:** Jede einzelne CSS-Datei muss unter 400 LOC bleiben; `index.html` muss alle neuen `<link>`-Tags enthalten

---

## Issue 4: `style.css:3` — Absoluter Font-Pfad

- **Status:** Erledigt — Font-Pfad auf `url('./fonts/zabars.ttf')` geändert.
- **Betroffen:** `style.css` Zeile 3: `url(/fonts/zabars.ttf)`
- **Lösung:** Ändern zu `url(./fonts/zabars.ttf)` oder `url('../fonts/zabars.ttf')`
- **Aufwand:** Minimal (1 Zeile)

---

## Issue 5: `style.css:454` — Fragiles `display: flex !important` für Mobile Controls

- **Status:** Erledigt — Touch- und Spielzustand steuern die Controls über `.is-touch-device.game-started`; `[hidden]` bleibt wirksam und `!important` entfällt.
- **Betroffen:** `@media (hover: none) and (pointer: coarse)` → `.mobile-controls { display: flex !important; }`
- **Lösung:** Statt `!important` mit gezielter Steuerung via CSS-Klassen und Spielzustand arbeiten:
  - Controls standardmäßig `display: none`
  - `[hidden]` muss weiterhin respektiert werden
  - Auf Touch-Geräten via JS eine Klasse `.is-touch-device` setzen
  - Beim Spielstart zusätzlich `.game-started` setzen und beim Zurück-ins-Hauptmenü entfernen
  - CSS-Selektor z.B.: `.is-touch-device.game-started .mobile-controls:not([hidden]) { display: flex; }`
  - Mobile-Controls weiterhin nur per Touch-/Mobile-Media-Query anzeigen, nicht auf Desktop
- **Aufwand:** Gering — CSS + JS-Änderung

---

## Issue 6: CamelCase-Verstöße

### 6a: `camera_x` in `world.class.js:19`

- **Status:** Erledigt — `camera_x` wurde in `cameraX` umbenannt und alle Code-Referenzen wurden angepasst.
- **Betroffen:** `classes/world.class.js` Zeile 19: `camera_x`
- **Lösung:** Umbenennen zu `cameraX` — alle Referenzen anpassen:
  - `world.class.js` interne Nutzung
  - `world-renderer.class.js` (Zugriff auf `world.cameraX`)
  - `character.class.js` (Zugriff auf `world.cameraX`)
- **Aufwand:** Mittel — 3 Dateien, Suchen/Ersetzen

### 6b: `level_end_x` in `level.class.js:18`

- **Status:** Erledigt — `level_end_x` wurde in `levelEndX` umbenannt und alle Code-Referenzen wurden angepasst.
- **Betroffen:** `classes/level.class.js` Zeile 18: `level_end_x`
- **Lösung:** Umbenennen zu `levelEndX` — alle Referenzen anpassen:
  - `level.class.js` (Setter/Getter)
  - `world.class.js` (kein Zugriff vorhanden)
  - `character.class.js` (Zugriff `this.world.level.levelEndX`)
  - `endboss.class.js` (ggf. Zugriff)
  - `moveable-object.class.js` (ggf. Zugriff)
- **Aufwand:** Mittel — Suchen/Ersetzen über mehrere Dateien

---

## Issue 7: Doppeltes `isDead()` in `moveable-object.class.js`

- **Betroffen:** `classes/moveable-object/moveable-object.class.js`
  - Zeile 116: `isDead() { return this.energy == 0; }`
  - Zeile 139: `isDead() { return this.energy <= 0; }`
- **Lösung:** Die erste Definition (Zeile 116) entfernen, die zweite (Zeile 139, korrekte Logik `<=`) behalten
- **Aufwand:** Minimal (1 Zeile löschen)

---

## Issue 8: Funktionen über 14 Zeilen — Refactoring

Alle betroffenen Funktionen und deren Aufteilung:

| Datei | Funktion | Zeilen | Vorschlag zur Aufteilung |
|-------|----------|--------|--------------------------|
| `js/game.js:190` | `wireTouchControls` | 19 | `setupTouchButton()` auslagern (wird 4x aufgerufen) |
| `js/game.js:222` | `keydown`-Callback | 28 | Key-Map auslagern, Event-Wiring in eigene Funktion |
| `js/game.js:251` | `keyup`-Callback | 28 | Wie keydown |
| `levels/level1.js:28` | `createLevel1` | 61 | `createClouds()`, `createBackgroundObjects()`, `createCoins()`, `createBottles()` auslagern |
| `classes/world.class.js:67` | `constructor` | 15 | Initialisierung in `initCanvas()` und `initRenderer()` auslagern |
| `classes/world.class.js:139` | `reset` | 19 | `resetActors()` und `resetGameState()` auslagern |
| `classes/world.class.js:160` | `checkThrowableObjects` | 21 | `canThrow()` und `spawnBottle()` auslagern |
| `classes/world.class.js:195` | `checkGameWon` | 15 | Prüfung + UI-Aufruf trennen |
| `classes/world-collisions.class.js:40` | `handleEnemyCollision` | 22 | `handleStomp()`, `handleDamage()`, `handleEndbossAttack()` auslagern |
| `classes/moveable-object/character.class.js:162` | `updateAnimation` | 29 | `handleDeadState()`, `handleHurtState()`, `handleAirborneState()`, `handleGroundState()` |
| `classes/moveable-object/character.class.js:229` | `playIdleAnimationOnce` | 17 | Animation-Logik + Zustandsübergang trennen |
| `classes/moveable-object/character.class.js:260` | `playDeathAnimationOnce` | 20 | Frame-Iteration und World-Removal trennen |
| `classes/moveable-object/endboss.class.js:82` | `animate` | 34 | `handleMovement()`, `handleAnimationState()` auslagern |
| `classes/moveable-object/endboss.class.js:184` | `updateChaseMovement` | 16 | Richtungslogik und Bewegung trennen |
| `classes/throwable-object.class.js:54` | `throw` | 23 | `startFlight()`, `startSplashCheck()`, `startRotationAnimation()` auslagern |
| `classes/throwable-object.class.js:79` | `startSplashAnimation` | 24 | Frame-Iteration und Cleanup trennen |
| `classes/sound-manager.class.js:17` | `constructor` | 20 | Sound-Definitionen in Konstante oder `initSounds()` auslagern |
| `classes/status-bar.class.js:96` | `resolveImageIndex` | 15 | Über if/else-if-Kette → evtl. kompakter via `Math.min(Math.floor(percentage / 20), 5)` |

---

## Issue 9: Inaktivitäts-Timer für Sleep-/Long-Idle (character.class.js:218)

- **Betroffen:** `classes/moveable-object/character.class.js` — `playIdleAnimation()` / `playIdleAnimationOnce()`
- **Problem:** Kein expliziter Timer; Long-Idle startet nach der Idle-Sequenz, nicht nach einer festen Inaktivitätsdauer
- **Lösung:**
  - `lastActivityTime`-Property in Character einführen
  - `lastActivityTime` im Constructor mit `Date.now()` initialisieren
  - `markActivity()` aktualisiert `lastActivityTime = Date.now()`
  - In `updateAnimation()`: wenn `Date.now() - lastActivityTime > 15000` → Long-Idle starten
  - Normale Idle-Animation und Long-Idle/Snore sauber trennen: Long-Idle und Schnarch-Sound erst nach Ablauf der 15 Sekunden starten
  - `markActivity()` wird bei jeder Bewegung (LEFT/RIGHT/SPACE/JUMP) aufgerufen
- **Aufwand:** Mittel — neue Property + Logik-Änderung in `updateAnimation()`

---

## Issue 10: JSDoc-Lücken

- **Betroffen:**
  - `js/game.js:222` — keydown-Callback undokumentiert
  - `js/game.js:251` — keyup-Callback undokumentiert
  - `classes/world-collisions.class.js:8` — kein Constructor-JSDoc
  - Allgemein: Events, Callbacks und Event-Handler
- **Lösung:** JSDoc-Blöcke für alle öffentlichen Methoden, Event-Handler und Constructor nachtragen
- **Check:** Keine undokumentierten öffentlichen Methoden mehr

---

## Reihenfolge der Bearbeitung

```
Issue 7 (1 Zeile) → Issue 4 (1 Zeile) → Issue 2 (Begründung dokumentieren)
→ Issue 6 (CamelCase) → Issue 8 (Funktionen refactoren)
→ Issue 9 (Inaktivitäts-Timer) → Issue 5 (CSS-Klasse statt !important)
→ Issue 3 (CSS aufteilen) → Issue 1 (Ordner umbenennen)
→ Issue 10 (JSDoc)
```

Empfohlen: **Von einfach/riskikolos zu komplex**. Issues 7, 4, 2 sind sehr kleine Änderungen. Issue 8 (Refactoring) ist der größte Brocken. Issue 1 (Ordnerumbenennung) sollte eher spät passieren, weil der Rename viele Pfade betrifft und spätere Diffs sonst schwerer nachzuverfolgen sind.
