# Offene Punkte zur Abnahme - El Pollo Loco

Stand: 2026-07-28

Dieses Dokument listet die noch zu erledigenden Punkte auf, damit das Projekt die Anforderungen der Developer Akademie erfuellt. Grundlage sind die bereitgestellten Review-Kriterien, die im Workspace gepruefte Projektstruktur und die Markdown-Fassung der Checkliste unter `docs/el-pollo-loco-checkliste-codex.md`.

## Entscheidende Abnahmeblocker

Das Projekt ist aktuell noch nicht abnahmefaehig. Vor einer erneuten Einreichung muessen mindestens diese Punkte erledigt werden:

- `.gitignore` um Systemdateien erweitern und bereits getrackte `.DS_Store`-Dateien aus Git entfernen.
- Alle Funktionen und Methoden auf maximal 14 Zeilen bringen.
- JSDoc fuer alle Funktionen, Methoden und Konstruktoren konsequent nachziehen.
- Sleep-Animation so umbauen, dass sie erst nach echter Inaktivitaet startet und spaetestens nach 15 Sekunden sichtbar wird.
- Mobile-Landscape-Verhalten streng pruefen: Im Hochformat muss ein eindeutiger Hinweis-Screen sichtbar sein, im Querformat duerfen keine Scrollbalken entstehen.
- Vollstaendigen Browser-Smoke-Test durchfuehren: Alle Links, Buttons, Statusbars, Sounds, Endscreen-Aktionen und Mobile-Controls muessen nachweisbar funktionieren.

## Umsetzungsregeln aus der Checkliste

Beim Beheben der offenen Punkte gelten diese Konventionen verbindlich:

- Funktionen und Variablen in camelCase schreiben und mit kleinem Buchstaben beginnen.
- Jede Funktion darf maximal 14 Zeilen lang sein. HTML ist davon ausgenommen.
- Jede Datei darf maximal 400 Lines of Code haben.
- Jede Funktion, Methode und jeder Konstruktor muss mit JSDoc dokumentiert sein.
- Zwischen Funktionen sollen 1 bis 2 Leerzeilen stehen.
- Jede Funktion soll nur eine Aufgabe haben.
- Statischer HTML-Code darf nicht per JavaScript generiert werden. Falls HTML-Fragmente dynamisch gebraucht werden, muessen sie ueber Templates geloest werden.
- Klassen-Dateien gehoeren in den `classes`-Ordner.
- Bilder gehoeren in den `img`-Ordner.
- Keine `console.log`-, `debugger`- oder Testausgaben im finalen Code.
- Buttons brauchen `cursor: pointer`.
- Schriftarten muessen lokal eingebunden werden.
- Mobile Touch-Buttons duerfen nur auf Handy-/Tabletgroesse beziehungsweise Touch-Geraeten sichtbar sein.
- Bei Mobile-Buttons muss das Kontextmenue deaktiviert bleiben.
- Der Restart im Endscreen darf keinen vollstaendigen Seiten-Reload ausloesen.
- Mute-State muss mit `localStorage` gespeichert bleiben.
- Animationen muessen fluessig wirken und duerfen nicht offensichtlich zu schnell oder zu langsam laufen.
- Hintergrundbilder duerfen im laufenden Spiel keine sichtbaren Luecken erzeugen.
- Statusbars muessen sich bei Schaden, Sammeln und Wurf korrekt aktualisieren.
- Gegnerduplikate, Gegnerstaerke und Gegnergeschwindigkeit muessen spielbar ausbalanciert sein.

## 1. Allgemein und Git

### Pruefen: Git-Workflow und Repository-Pflege

Aktueller Befund:

- Ein Git-Repository ist vorhanden.
- Die Commit-Historie und Commit-Message-Qualitaet wurden in diesem Review nicht fachlich bewertet.

Erledigen:

- Nach jeder groesseren Nachbesserung einen eigenen Commit erstellen.
- Klare Commit-Messages verwenden, z.B. `Fix idle sleep timing` statt `changes`.
- Vor Abgabe sicherstellen, dass keine generierten Systemdateien, lokalen Tooldaten oder unfertigen Planungsdateien versehentlich committed werden.

Akzeptanzkriterium:

- Repository ist sauber, nachvollziehbar und enthaelt nur projektbezogene Dateien.
- Git-Historie zeigt sinnvolle Arbeitsschritte.

### Offen: `.gitignore` vervollstaendigen

Aktueller Befund:

- `.gitignore` enthaelt nur `.vscode/settings.json` und `.kilo/`.
- `.DS_Store` ist nicht ignoriert.
- Mehrere `.DS_Store`-Dateien sind bereits in Git getrackt.

Betroffene Dateien:

- `.gitignore`
- `.DS_Store`
- `audio/.DS_Store`
- `img/7_statusbars/.DS_Store`
- `img/7_statusbars/1_statusbar/.DS_Store`
- `img/7_statusbars/2_statusbar_endboss/.DS_Store`
- `img/9_intro_outro_screens/.DS_Store`

Erledigen:

- `.gitignore` mindestens um `.DS_Store` und optional typische OS-/Editor-Dateien erweitern.
- Bereits getrackte `.DS_Store`-Dateien aus dem Git-Index entfernen, ohne lokale Arbeitsdateien unnoetig zu loeschen.
- Danach mit `git ls-files .DS_Store '**/.DS_Store'` pruefen, dass keine `.DS_Store`-Dateien mehr versioniert sind.

Akzeptanzkriterium:

- `.DS_Store` taucht in `git ls-files` nicht mehr auf.
- `.gitignore` verhindert neue `.DS_Store`-Commits.

### Bereits erfuellt: Keine aktiven Konsolenausgaben

Aktueller Befund:

- In produktiven JS-Dateien wurden keine aktiven `console.log`- oder `debugger`-Aufrufe gefunden.
- Treffer existieren nur in Review- und Plan-Dokumenten.

Erledigen:

- Vor Abgabe erneut pruefen:
  `rg -n "console\\.|debugger" js classes levels`
- Browser-Konsole einmal im laufenden Spiel pruefen, inklusive Start, Bewegung, Wurf, Mute, Win/Lose und Restart.

Akzeptanzkriterium:

- Keine produktiven Konsolenausgaben.
- Keine sichtbaren Browser-Konsolenfehler.

### Pruefen: Alle Links und Buttons funktionieren

Aktueller Befund:

- Relevante Buttons sind im HTML vorhanden: Help, Mute, Fullscreen, Impressum, Start, Restart, Home, Dialog-Schliessen und Touch-Buttons.
- Eine automatisierte Browser-Pruefung wurde noch nicht durchgefuehrt.

Erledigen:

- Jeden Button einmal manuell im Browser testen.
- Fullscreen nur als optionales Feature bewerten, aber wenn der Button vorhanden ist, muss er ohne Fehler funktionieren.
- Pruefen, dass Dialoge nicht in einem nicht schliessbaren Zustand haengen bleiben.

Akzeptanzkriterium:

- Jeder sichtbare Button hat eine erkennbare und funktionierende Aktion.
- Keine Button-Aktion erzeugt Konsolenfehler.

## 2. Design und Responsiveness

### Pruefen: Hintergrundbild und visuelle Grundlage

Aktueller Befund:

- `style.css:22` verwendet ein Hintergrundbild fuer die Seite.
- Der Startscreen wird auf das Canvas gezeichnet.

Erledigen:

- Im Browser pruefen, dass das Hintergrundbild auf Desktop und Mobile zum Thema passt und korrekt geladen wird.
- Sicherstellen, dass Landingpage/Startscreen nicht leer oder unpassend wirkt.

Akzeptanzkriterium:

- Die Seite hat ein thematisch passendes Hintergrundbild.
- Hintergrund und Startscreen laden ohne sichtbare Bildfehler.

### Bereits erfuellt: Favicon

Aktueller Befund:

- `index.html:7` bindet ein Favicon ein.

Akzeptanzkriterium:

- Favicon bleibt im `head` vorhanden und verweist auf eine existierende lokale Datei.

### Bereits erfuellt: Lokale Schriftart

Aktueller Befund:

- `style.css:1` bindet `fonts/zabars.ttf` per `@font-face` ein.

Akzeptanzkriterium:

- Keine externen Font-CDNs.
- Font-Datei bleibt lokal im Repository.

### Bereits erfuellt: `cursor: pointer` bei Buttons

Aktueller Befund:

- Relevante Button-Klassen haben `cursor: pointer`, z.B. `.icon-button`, `.start-button`, `.endscreen-button`, `.touch-button`, `.modal-close`.

Akzeptanzkriterium:

- Neue Buttons muessen ebenfalls `cursor: pointer` erhalten.

### Offen: Landscape- und Portrait-Verhalten streng testen

Aktueller Befund:

- `index.html:93` enthaelt einen `turn-device`-Hinweis.
- `style-responsive.css:116` zeigt den Hinweis bei `orientation: portrait` auf Touch-Geraeten.
- Das Querformat wird nicht aktiv per Browser-API erzwungen, sondern ueber einen Hinweis-Screen behandelt.

Erledigen:

- Entscheiden, ob die Akademie den Hinweis-Screen als "Landscape erzwingen" akzeptiert.
- Sicherstellen, dass der Hinweis-Screen im Hochformat die Spielflaeche vollstaendig ueberdeckt.
- Sicherstellen, dass im Querformat kein Hinweis-Screen sichtbar ist.
- Auf mobilen Viewports pruefen, dass keine horizontalen oder vertikalen Scrollbalken entstehen.
- Falls strenger gefordert: beim Fullscreen-Start `screen.orientation.lock('landscape')` als progressive Enhancement einsetzen, aber nur mit Feature-Check und Fallback auf den Hinweis-Screen.

Akzeptanzkriterium:

- Hochformat auf Touch-Geraeten zeigt eindeutig nur den Dreh-Hinweis.
- Querformat zeigt das Spiel ohne Scrollbalken.
- Desktop wird nicht faelschlich blockiert.

### Pruefen: Kleine Aufloesungen ohne Scrollbalken

Aktueller Befund:

- `html` und `body` verwenden `overflow: hidden`.
- Die Checkliste verlangt ausdruecklich, dass bei kleineren Aufloesungen kein Scrollbalken entsteht.

Erledigen:

- Mobile Landscape mit typischen Groessen testen, z.B. 667x375, 740x360, 844x390 und Tablet-Landscape.
- Pruefen, ob Header, Canvas, Endscreen und Touch-Buttons gleichzeitig sichtbar bleiben.
- Falls Inhalte abgeschnitten werden, Layout nicht durch Scrollen retten, sondern Groessen responsiv anpassen.

Akzeptanzkriterium:

- Keine horizontalen oder vertikalen Scrollbalken auf kleinen Landscape-Aufloesungen.
- Spiel bleibt trotzdem bedienbar.

### Bereits erfuellt, aber erneut pruefen: Mobile Touch-Buttons

Aktueller Befund:

- `style.css:212` versteckt `.mobile-controls` standardmaessig.
- `style-responsive.css:109` zeigt Touch-Buttons nur auf Touch-Geraeten nach Spielstart.
- `js/game.js:211` verhindert das Kontextmenue auf Touch-Buttons.

Erledigen:

- Auf Desktop pruefen, dass Touch-Buttons nicht sichtbar sind.
- Auf Handy/Tablet im Querformat pruefen, dass Touch-Buttons sichtbar und bedienbar sind.
- Sicherstellen, dass Touch-Buttons keine Scrollbalken oder Layoutspruenge erzeugen.

Akzeptanzkriterium:

- Desktop: keine Touch-Buttons.
- Mobile Landscape: Touch-Buttons sichtbar.
- Mobile Portrait: nur Dreh-Hinweis, keine stoerenden Controls.

## 3. Architektur und Clean Code

### Pruefen: Dateinamen sind beschreibend und konsistent

Aktueller Befund:

- Die Hauptseite heisst korrekt `index.html`.
- Die meisten Projektdateien sind sinnvoll benannt.
- Einige Asset-Dateien haben Leerzeichen, Sonderzeichen oder inkonsistente Gross-/Kleinschreibung, z.B. in `img/You won, you lost/` und `img/1_editables/`.

Erledigen:

- Entscheiden, ob nur Code-Dateien oder auch Asset-Dateien streng bereinigt werden sollen.
- Fuer selbst referenzierte Assets sprechende, konsistente Dateinamen bevorzugen.
- Pfade nach Umbenennung sofort in HTML/CSS/JS aktualisieren.
- Nicht benoetigte editierbare Quelldateien wie `.ai` nur behalten, wenn sie fuer die Abgabe wirklich relevant sind.

Akzeptanzkriterium:

- Code-Dateien sind eindeutig, konsistent und beschreibend benannt.
- Referenzierte Assets laden nach eventuellen Umbenennungen fehlerfrei.

### Bereits erfuellt: Grundstruktur

Aktueller Befund:

- Klassen liegen unter `classes/`.
- Bilder liegen unter `img/`.
- Level-Setup liegt unter `levels/`.
- Es gibt eine sichtbare Trennung zwischen `World`, `WorldRenderer`, `WorldCollisions`, `SoundManager` und Objektklassen.

Akzeptanzkriterium:

- Neue Klassen weiterhin unter `classes/` ablegen.
- Neue Bilder weiterhin unter `img/` ablegen.
- Falls Templates eingefuehrt werden, diese in einem eigenen Template-Bereich ablegen.

### Offen: Funktionslimit von 14 Zeilen einhalten

Aktueller sicherer Verstoss:

- `classes/moveable-object/character.class.js:162`, `updateAnimation()` hat 18 Zeilen.

Erledigen:

- `updateAnimation()` weiter zerlegen, z.B. in klar benannte State-Handler oder eine kleine Entscheidungsfunktion.
- Nach dem Umbau alle JS-Funktionen erneut automatisiert pruefen.

Akzeptanzkriterium:

- Keine Funktion und keine Methode hat mehr als 14 Zeilen.
- Die Lesbarkeit wird durch das Zerlegen verbessert, nicht verschlechtert.

### Bereits erfuellt: Dateilimit von 400 LOC

Aktueller Befund:

- Keine relevante Datei ueberschreitet 400 LOC.
- Groessere Dateien bleiben aber beobachtenswert: `style.css` 344 LOC, `character.class.js` 313 LOC, `world.class.js` 306 LOC.

Erledigen:

- Bei weiteren Aenderungen besonders `style.css`, `character.class.js` und `world.class.js` im Blick behalten.
- Falls eine Datei Richtung 400 LOC waechst, rechtzeitig sauber aufteilen.

Akzeptanzkriterium:

- Jede Datei bleibt unter oder bei 400 LOC.

### Offen: JSDoc vollstaendig nachziehen

Aktueller Befund:

Mehrere Funktionen, Methoden oder Konstruktoren haben keinen direkten JSDoc-Kommentar. Beispiele:

- `classes/background/air.class.js:3`, `constructor()`
- `classes/background/background-object.class.js:15`, `constructor(imagePath, x)`
- `classes/bottle.class.js:27`, `constructor(x, y, variant)`
- `classes/coin.class.js:27`, `constructor(x, y, variant)`
- `classes/level.class.js:28`, `constructor(...)`
- `classes/moveable-object/chicken.class.js:28`, `constructor(x, speed)`
- `classes/moveable-object/chicken-small.class.js:29`, `constructor(x, speed)`
- `classes/moveable-object/cloud.class.js:17`, `constructor(x, y, speed)`
- `classes/moveable-object/endboss.class.js:158`, `isMovementLocked()`
- `classes/moveable-object/moveable-object.class.js:37`, `_registerInterval(callback, ms)`
- `classes/moveable-object/moveable-object.class.js:64`, `isAboveGround()`
- `classes/moveable-object/moveable-object.class.js:92`, `isColliding(mo)`
- `classes/sound-manager.class.js:55`, `createAudio(src, volume, loop)`
- `classes/status-bar.class.js:53`, `constructor(type, x, y, percentage)`
- `classes/status-bar.class.js:70`, `getImagesByType(type)`
- `classes/throwable-object.class.js:40`, `constructor(x, y, otherDirection, soundManager)`
- `classes/world-collisions.class.js:8`, `constructor(world)`
- `classes/world-collisions.class.js:40`, `handleEnemyCollision(...)`
- `classes/world-collisions.class.js:110`, `findBottleHitEnemy(bottle)`
- `classes/world-collisions.class.js:128`, `applyBottleHit(bottle, enemy)`
- `classes/world-collisions.class.js:158`, `collectItems(items, type)`
- `classes/world-collisions.class.js:194`, `isStompCollision(...)`
- `classes/world.class.js:67`, `constructor(canvas, keyboard, soundManager)`
- `js/game.js:143`, `wireDialog(triggerId, dialogId)`
- `js/game.js:225`, `setKey(key, value)`
- `levels/level1.js:72`, `createLevel1()`

Hinweis:

- Teilweise gibt es Kommentare, aber sie sind nicht direkt oder nicht vollstaendig als JSDoc fuer die jeweilige Funktion erkannt.
- Konstruktoren mit Parametern sollten `@param`-Tags haben.
- Funktionen mit Rueckgabewerten sollten `@returns` erhalten.

Akzeptanzkriterium:

- Jede Funktion, Methode und jeder Konstruktor hat einen direkten JSDoc-Block.
- Parameter und Rueckgaben sind dokumentiert.
- Kommentare beschreiben Zweck und Vertrag, nicht nur offensichtliche Implementierung.

### Offen: Formatierung konsequent vereinheitlichen

Aktueller Befund:

- Es gibt vereinzelt Stilabweichungen wie `checkCollisions(){` statt `checkCollisions() {`.
- Leerzeilen sind ueberwiegend vorhanden, sollten aber nach jeder Anpassung erneut konsistent bleiben.

Erledigen:

- Einheitlich Leerzeichen vor `{` setzen.
- Zwischen Funktionen 1 bis 2 Leerzeilen lassen.
- Keine unnoetigen Leerzeilen innerhalb kurzer Funktionen einfuegen, wenn dadurch das 14-Zeilen-Limit gerissen wird.

Akzeptanzkriterium:

- Einheitlicher Stil ueber alle JS-Dateien.

### Pruefen: Statisches HTML nicht per JavaScript generieren

Aktueller Befund:

- Die geprueften UI-Bestandteile wie Startbutton, Endscreen, Hilfedialog, Impressum und Touch-Controls stehen statisch in `index.html`.

Erledigen:

- Bei neuen UI-Erweiterungen statisches Markup direkt in HTML oder in echten Templates pflegen.
- Kein grosses `innerHTML` fuer statische UI-Strukturen verwenden.

Akzeptanzkriterium:

- Statische UI wird nicht imperativ in JS zusammengebaut.

### Pruefen: Templates-Ordner nur bei Bedarf

Aktueller Befund:

- Es gibt aktuell keinen `templates`-Ordner.
- Die Checkliste nennt extra Ordner fuer Templates und Bilder, z.B. `templates` und `img`.
- Da die statischen UI-Elemente direkt in `index.html` stehen, ist ein Template-Ordner aktuell nicht zwingend erforderlich.

Erledigen:

- Falls dynamische HTML-Templates eingefuehrt werden, einen eigenen `templates`-Ordner anlegen.
- Keine Template-Struktur nur pro forma anlegen, wenn sie ungenutzt bleibt.

Akzeptanzkriterium:

- Dynamisch benoetigtes HTML liegt in einer nachvollziehbaren Template-Struktur.
- Statische Inhalte bleiben statisch im HTML.

## 4. Gameplay-Logik und User Stories

### Bereits erfuellt: Landingpage / Startscreen / Startbutton

Aktueller Befund:

- Startscreen wird in `js/game.js:34` auf Canvas gezeichnet.
- Startbutton startet das Spiel ueber `startGame()`.

Erledigen:

- Im Browser testen, dass Startscreen und Startbutton nach Reload/Home korrekt sichtbar sind.

Akzeptanzkriterium:

- Spiel startet erst nach Klick auf Start.
- Startbutton verschwindet nach Spielstart.
- Spieler wird beim Start nicht direkt von Gegnern ueberrannt.

### Pruefen: Hintergrund im Spiel ohne Luecken

Aktueller Befund:

- `levels/level1.js:35` erzeugt mehrere Background-Sets.
- Die Checkliste nennt sichtbare Luecken zwischen Hintergrundbildern als haeufigen Fehler.

Erledigen:

- Beim Laufen durch das gesamte Level visuell pruefen, ob zwischen Background-Layern Luecken entstehen.
- Besonders die Uebergaenge bei `x = -719`, `0`, `719`, `1438`, `2157` pruefen.
- Falls Luecken sichtbar sind, Positionierung und Breite der Background-Objekte angleichen.

Akzeptanzkriterium:

- Beim Scrollen durch das Level sind keine Luecken im Hintergrund sichtbar.

### Pruefen: Animationstempo und Fluessigkeit

Aktueller Befund:

- Charakter-, Gegner-, Endboss- und Bottle-Animationen sind implementiert.
- Die optische Fluessigkeit wurde noch nicht per Browser-Test bewertet.

Erledigen:

- Sprung, Lauf, Hurt, Death, Idle, Sleep, Gegnerlauf, Gegnersterben und Endboss-Zustaende im Spiel beobachten.
- Zu schnelle oder zu langsame Intervallwerte anpassen.
- Sicherstellen, dass Animationen nicht nach Restart doppelt laufen.

Akzeptanzkriterium:

- Animationen wirken fluessig und passend zum Spieltempo.
- Nach Restart gibt es keine beschleunigten oder doppelt laufenden Animationen.

### Bereits erfuellt: Einsehbare Tastenbelegung

Aktueller Befund:

- `index.html:68` enthaelt den Hilfedialog mit Tastenbelegung.
- `js/game.js:131` verdrahtet den Help-Button.

Akzeptanzkriterium:

- Hilfedialog oeffnet und schliesst zuverlaessig.
- Tastenbelegung ist vollstaendig und korrekt.

### Bereits erfuellt: Schliessen-Dialoge

Aktueller Befund:

- Help-Dialog und Impressum-Dialog haben Schliessen-Buttons mit `data-close`.
- Backdrop-Click wird in `wireDialog()` behandelt.

Akzeptanzkriterium:

- Dialoge lassen sich ueber Button und Backdrop schliessen.

### Offen: Sleep-Animation nach maximal 15 Sekunden

Aktueller Befund:

- `character.class.js:229`, `playIdleAnimation()` startet nach kurzer Idle-Sequenz die Long-Idle-Animation und `snore`.
- Es gibt keine klare Zeitmessung der letzten Spieleraktivitaet.
- Damit ist nicht nachweisbar, dass die Sleep-Animation erst durch Inaktivitaet und spaetestens nach 15 Sekunden startet.

Erledigen:

- Ein Feld wie `lastActivityAt` einfuehren.
- Bei Bewegung, Sprung, Wurf, Schaden, Tod oder aktiver Eingabe Aktivitaet markieren.
- Sleep/Long-Idle erst starten, wenn `Date.now() - lastActivityAt >= 15000`.
- Vor Ablauf der 15 Sekunden normale Idle-Animation abspielen.
- Beim erneuten Bewegen `snore` stoppen und Sleep-State zuruecksetzen.

Akzeptanzkriterium:

- Nach maximal 15 Sekunden ohne Eingabe startet die Sleep-/Long-Idle-Animation.
- Vorher startet sie nicht dauerhaft.
- Jede neue Eingabe beendet Sleep/Snore sauber.
- Der Charakter bleibt grundsaetzlich in Idle, wenn er nichts anderes tut und noch nicht schlaeft.

### Pruefen: Collectibles, Wurf und Statusbars

Aktueller Befund:

- Coins und Flaschen sind im Level vorhanden.
- `WorldCollisions.collectItems()` aktualisiert Sammelzaehler und Statusbars.
- `World.spawnBottle()` reduziert die Flaschenanzahl und aktualisiert die Bottle-Statusbar.

Erledigen:

- Coins sammeln und pruefen, ob die Coin-Statusbar korrekt steigt.
- Flaschen sammeln und pruefen, ob die Bottle-Statusbar korrekt steigt.
- Flasche werfen und pruefen, ob die Bottle-Statusbar korrekt sinkt.
- Schaden nehmen und pruefen, ob die Health-Statusbar korrekt sinkt.
- Endboss treffen und pruefen, ob die Endboss-Statusbar korrekt sinkt.

Akzeptanzkriterium:

- Alle Statusbars zeigen nach jeder relevanten Aktion den korrekten Zustand.
- Keine Statusbar bleibt nach Restart auf einem alten Wert stehen.

### Pruefen: Lose-State und Beweglichkeit nach Tod

Aktueller Befund:

- `world.class.js:214` setzt `isGameOver`, wenn der Charakter tot ist.
- `character.class.js:116` verhindert Movement bei `isDead()`.
- `world.class.js:248` setzt gedrueckte Keys zurueck.

Erledigen:

- Im Browser testen, dass der Charakter nach leerer Health-Bar nicht mehr steuerbar ist.
- Pruefen, dass Touch- und Keyboard-Eingaben nach Game Over keinen Effekt mehr haben.
- Pruefen, dass der Endscreen gezeigt wird.

Akzeptanzkriterium:

- Charakter ist nach dem Ableben nicht mehr beweglich.
- Game Over fuehrt zu Endscreen und sauberem Eingabestopp.

### Bereits erfuellt: Gegner und Endboss

Aktueller Befund:

- `levels/level1.js:73` erzeugt normale Hühner, kleine Hühner und einen Endboss.

Akzeptanzkriterium:

- Mindestens 2 Gegnertypen plus 1 staerkerer Endboss bleiben vorhanden.
- Groesse, Geschwindigkeit und Verhalten der Gegnertypen unterscheiden sich erkennbar.
- Endboss ist staerker als normale Gegner.

### Pruefen: Gegner-Balancing

Aktueller Befund:

- Normale und kleine Hühner werden in fester Anzahl mit randomisiertem Offset und Speed erzeugt.
- Die Checkliste warnt vor zu wenigen/zu vielen Gegnern und zu starken/zu schwachen Gegnern.

Erledigen:

- Einmal das gesamte Level spielen und pruefen, ob Anzahl und Platzierung fair sind.
- Sicherstellen, dass der Spieler beim Start nicht sofort getroffen wird.
- Pruefen, ob der Endboss besiegbar ist, ohne trivial zu sein.

Akzeptanzkriterium:

- Gegneranzahl und Schwierigkeit fuehlen sich spielbar und fair an.
- Der Endboss ist klar staerker, aber nicht unmoeglich.

### Bereits erfuellt: Kollisions-Offsets / Stomp auf Gegner

Aktueller Befund:

- `DrawableObject.getHitbox()` und Objekt-Offsets werden verwendet.
- `world-collisions.class.js:194` prueft Stomp-Kollisionen ueber Hitbox, vorherige Character-Unterkante und Toleranz.

Erledigen:

- Im Spiel visuell testen, ob Spruenge auf normale und kleine Hühner fair funktionieren.
- Sicherstellen, dass seitliche Kollisionen weiterhin Schaden verursachen.

Akzeptanzkriterium:

- Von oben springen besiegt normale Gegner.
- Seitlich beruehren verletzt den Charakter.
- Endboss wird nicht versehentlich per Stomp besiegt.
- Ein Gegner stirbt nicht, wenn der Charakter nur neben ihn springt.

### Bereits erfuellt: Mute-Button mit LocalStorage

Aktueller Befund:

- `sound-manager.class.js:170` speichert den Mute-State.
- `sound-manager.class.js:182` liest ihn wieder aus.

Erledigen:

- Browser-Test: muten, Seite neu laden, Status muss erhalten bleiben.

Akzeptanzkriterium:

- Mute bleibt nach Reload erhalten.
- Button-Icon und `aria-label` passen zum Zustand.

### Pruefen: Soundverhalten und Lautstaerke

Aktueller Befund:

- Hintergrundmusik und mehrere Soundeffekte sind vorhanden.
- Mute setzt den globalen Zustand und stoppt/pausiert aktive Sounds.
- Die Checkliste nennt fehlerhaft startende/stoppende Sounds, unvollstaendiges Mute und zu laute Sounds als haeufige Fehler.

Erledigen:

- Pruefen, dass Musik erst nach Spielstart sinnvoll startet.
- Pruefen, dass Footsteps beim Stehen, Springen, Schaden, Tod und Endscreen stoppen.
- Pruefen, dass Snore nur waehrend Sleep laeuft und bei Aktivitaet stoppt.
- Mute waehrend aktiver Musik/Sounds testen: alle Sounds muessen stumm sein.
- Lautstaerke subjektiv pruefen und bei unangenehm lauten Effekten reduzieren.
- Optional: Endboss-Hit-Sound ergaenzen, falls die Trefferreaktion deutlicher werden soll.

Akzeptanzkriterium:

- Sounds starten und stoppen passend zur Spielsituation.
- Mute schaltet alle Sounds zuverlaessig stumm.
- Keine Sounds laufen nach Game Over, Home oder Restart unpassend weiter.

### Bereits erfuellt: Restart ohne Seiten-Reload

Aktueller Befund:

- `js/game.js:74` ruft `restartGame()`.
- `world.class.js:154` fuehrt `reset()` aus.
- Es wurde kein `location.reload` gefunden.

Erledigen:

- Browser-Test: Spiel verlieren oder gewinnen, Restart klicken, Spielzustand muss sauber neu starten.
- Pruefen, dass keine alten Intervalle weiterlaufen.

Akzeptanzkriterium:

- Restart funktioniert ohne kompletten Seiten-Reload.
- Character, Gegner, Collectibles, Statusbars, Kamera und Sounds sind zurueckgesetzt.
- Der Endscreen bietet Restart und Rueckkehr zum Home Screen.

### Pruefen: Impressum ohne echte Daten und gemaess Checkliste erreichbar

Aktueller Befund:

- `index.html:82` enthaelt ein Impressum mit fiktiven Angaben und Demo-Hinweis.
- Die Markdown-Checkliste spricht von einem Link, der zu einer Seite mit Anbieterinformationen und rechtlichen Hinweisen weiterleitet. Dieses Projekt loest das Impressum aktuell als Dialog.

Erledigen:

- Entscheiden, ob der Impressum-Dialog fuer die Abnahme akzeptiert wird oder eine eigene Impressum-Seite erforderlich ist.
- Falls eine eigene Seite gefordert wird: `impressum.html` anlegen, Button/Link dorthin fuehren und Ruecknavigation anbieten.
- Keine echten privaten Daten eintragen.

Akzeptanzkriterium:

- Keine echten privaten Daten verwenden.
- Impressum bleibt einsehbar.
- Falls streng nach Checkliste bewertet wird, fuehrt ein Link zu einer separaten Impressum-Seite.

## Empfohlene Reihenfolge der Nachbesserung

1. `.gitignore` korrigieren und `.DS_Store` aus Git entfernen.
2. `updateAnimation()` auf maximal 14 Zeilen refactoren.
3. Sleep-Animation mit echter Inaktivitaetsmessung umbauen.
4. JSDoc-Abdeckung fuer alle Funktionen/Konstruktoren nachziehen.
5. Formatierung vereinheitlichen.
6. Statusbar-, Sound- und Restart-Verhalten im Code und Browser pruefen.
7. Mobile Portrait/Landscape manuell testen.
8. Vollstaendigen Browser-Smoke-Test durchfuehren: Start, Help, Impressum, Fullscreen, Mute, Bewegung, Sprung, Wurf, Collectibles, Gegner, Endboss, Win/Lose, Restart, Home.
9. Abschlusspruefung mit `rg` und `wc -l` wiederholen.

## Abschluss-Check vor erneuter Einreichung

Vor der naechsten Abgabe sollten diese Befehle ohne kritische Treffer beziehungsweise Grenzwertverletzungen laufen:

```bash
rg -n "console\\.|debugger|location\\.reload|location\\.href" js classes levels
wc -l index.html style.css style-responsive.css js/game.js levels/level1.js classes/**/*.js classes/*.js
git ls-files .DS_Store '**/.DS_Store'
```

Zusaetzlich sollte ein manueller Browser-Test auf Desktop und Mobile-Landscape erfolgen. Die Browser-Konsole muss waehrend der wichtigsten Spielablaeufe fehlerfrei bleiben.
