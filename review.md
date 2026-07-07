# Code-Review Developer Akademie

## 1. Begruessung

Hallo im Namen der Developer Akademie, ich habe dein El-Pollo-Loco-Projekt gegen die Checkliste geprueft.

## 2. Lob

Positiv umgesetzt sind Favicon, lokale Assets, Startscreen, Start-/Restart-Flow ohne `location.reload`, Help-/Impressum-Dialoge, Mute-State mit `localStorage`, zwei Gegnertypen plus Endboss, Kollisions-Offsets und eine separate Aufteilung in `World`, Renderer, Collision-Handling und Objektklassen.

Ausserdem wurden keine `console.log`-, `debugger`- oder Syntaxfehler in den JS-Dateien gefunden.

## 3. Maengel / Korrekturhinweise

- `style.css:465`: Datei hat 465 LOC und ueberschreitet das 400-Zeilen-Limit.
- Projektstruktur: Es gibt keinen dedizierten `classes`-Ordner. Die Klassen liegen unter `models/`, z.B. `models/world.class.js:5`. Laut Checkliste muessen alle `class.js`-Dateien in einen `classes`-Ordner.
- Projektstruktur: Ein `templates`-Ordner fehlt. `img` ist vorhanden.
- `style.css:3`: Font-Pfad ist absolut (`/fonts/...`). Lokal robuster waere `./fonts/zabars.ttf`, sonst kann es bei Deployment in Unterordnern brechen.
- `style.css:454`: Mobile Controls werden per `display: flex !important` auf Touch-Geraeten erzwungen, obwohl `index.html:55` `hidden` gesetzt ist. Das ist fragil und kann Controls vor dem eigentlichen Spielstart sichtbar machen.
- `models/world.class.js:19` und `models/level.class.js:18`: `camera_x` und `level_end_x` verletzen CamelCase.
- `models/moveable-object/moveable-object.class.js:116`: `isDead()` ist doppelt definiert, nochmals bei Zeile 139. Das ist ein Clean-Code-Verstoss.

### Funktionen ueber 14 Zeilen

- `js/game.js:190`: `wireTouchControls` = 19 Zeilen.
- `js/game.js:222`: `keydown`-Callback = 28 Zeilen.
- `js/game.js:251`: `keyup`-Callback = 28 Zeilen.
- `levels/level1.js:28`: `createLevel1` = 61 Zeilen.
- `models/world.class.js:67`: `constructor` = 15 Zeilen.
- `models/world.class.js:139`: `reset` = 19 Zeilen.
- `models/world.class.js:160`: `checkThrowableObjects` = 21 Zeilen.
- `models/world.class.js:195`: `checkGameWon` = 15 Zeilen.
- `models/world-collisions.class.js:40`: `handleEnemyCollision` = 22 Zeilen.
- `models/moveable-object/character.class.js:162`: `updateAnimation` = 29 Zeilen.
- `models/moveable-object/character.class.js:229`: `playIdleAnimationOnce` = 17 Zeilen.
- `models/moveable-object/character.class.js:260`: `playDeathAnimationOnce` = 20 Zeilen.
- `models/moveable-object/endboss.class.js:82`: `animate` = 34 Zeilen.
- `models/moveable-object/endboss.class.js:184`: `updateChaseMovement` = 16 Zeilen.
- `models/throwable-object.class.js:54`: `throw` = 23 Zeilen.
- `models/throwable-object.class.js:79`: `startSplashAnimation` = 24 Zeilen.
- `models/sound-manager.class.js:17`: `constructor` = 20 Zeilen.
- `models/status-bar.class.js:96`: `resolveImageIndex` = 15 Zeilen.

### Weitere Hinweise

- `models/moveable-object/character.class.js:218`: Sleep-/Long-Idle startet nach der Idle-Sequenz, aber es gibt keinen klaren Inaktivitaets-Timer bis maximal 15 Sekunden. Das sollte explizit ueber Zeitmessung geloest werden.
- JSDoc ist vorhanden, aber nicht konsequent im Standard: mehrere Callbacks/Event-Handler sind undokumentiert, z.B. `js/game.js:222`, und `models/world-collisions.class.js:8` hat keinen eigenen Constructor-JSDoc.

## 4. Abschluss-Urteil

**Nachbessern (Request Changes)**.

Das Projekt ist spielerisch schon weit, aber wegen Strukturvorgabe, 400-LOC-Verstoss, vielen 14-Zeilen-Verstoessen, Namensgebung und einigen Clean-Code-Punkten kann ich es nach Developer-Akademie-Checkliste noch nicht abnehmen.
