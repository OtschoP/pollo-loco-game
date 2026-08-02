# El Pollo Loco Checkliste

Codex-optimierte Markdown-Fassung der Projekt-Checkliste fuer das Jump-and-Run-Spiel **El Pollo Loco / Sharkie**.

## Projektabgabe - Jump and Run

Bitte erfuelle alle Punkte auf dieser Liste, bevor du das Projekt einreichst. Solltest du weitere Extras eingebaut haben, erwaehne das kurz, damit sich die Mentoren dies bei Bedarf anschauen koennen.

## 1. Allgemein

### Git-Workflow fuer dein Projekt

Nutze GitHub von Anfang an. Denk dran: Dein GitHub-Profil ist deine Visitenkarte fuer Arbeitgeber - nutze diese Chance.

- [ ] Committe nach jeder Coding-Session.
- [ ] Verwende klare, aussagekraeftige Commit-Messages.
- [ ] Verwende `.gitignore`, um unnoetige Dateien auszuschliessen.
- [ ] Halte dein Repository aktuell und gepflegt.

### Funktionalitaet

- [ ] Alle Links und Buttons sind funktionstuechtig.
- [ ] Es gibt keine Konsolenfehler.
- [ ] Es gibt keine `console.log`-Ausgaben.

### Design

- [ ] Setze das Design bestmoeglich um und sei dabei auch etwas kreativ.
- [ ] Die richtige Schriftart ist ausgewaehlt und lokal eingebunden.
- [ ] Ein Favicon ist vorhanden.
- [ ] Buttons haben die CSS-Eigenschaft `cursor: pointer;`.

### Responsiveness

- [ ] Die Seite funktioniert auf Desktop-Geraeten.
- [ ] Die Seite funktioniert in der mobilen Ansicht nur im Querformat.
- [ ] Im Hochformat wird eine Anzeige eingeblendet, dass man das Geraet nur im Querformat nutzen kann, z. B. `Turn your Device to play`.
- [ ] Die Mobile-Touch-Buttons sind erst sichtbar, wenn man auf Tablet- oder Handy-Groesse ist.
- [ ] Bei kleineren Aufloesungen gibt es keinen Scrollbalken.

### Technische Umsetzung

#### Dateinamen

- [ ] Dateinamen sind beschreibend und aussagekraeftig.
- [ ] Dateinamen sind konsistent.
- [ ] Die Hauptseite heisst `index.html`, damit sie standardmaessig geladen wird.

#### JavaScript-Dateistruktur / Projektstruktur

- [ ] Es gibt einen extra `classes`-Ordner, in dem alle `class.js`-Dateien liegen.

### JavaScript / Clean Code

- [ ] Eine Funktion hat nur eine Aufgabe.
- [ ] Eine Funktion ist maximal 14 Zeilen lang. HTML ist davon ausgenommen.
- [ ] Datei-, Funktions- und Variablennamen sind deutlich und konsistent geschrieben.
- [ ] Der erste Buchstabe von Funktionen und Variablen ist klein geschrieben.
- [ ] Zwischen Funktionen liegen ein oder zwei Leerzeilen.
- [ ] Eine Datei hat maximal 400 LOCs (Lines of Code).
- [ ] Dateien sind richtig benannt, z. B. `index.html`, `script.js`, `style.css`.
- [ ] HTML-Code ist gegebenenfalls in eine extra Funktion ausgelagert.
- [ ] Es gibt extra Ordner fuer Templates und Bilder, z. B. `templates` und `img`.
- [ ] Statischer HTML-Code wird nicht ueber JavaScript generiert.
- [ ] Funktionen sind nach JSDoc-Standard dokumentiert: <https://jsdoc.app/about-getting-started.html>

### Vermeide diese haeufigen Fehler

- [ ] Animationen sehen nicht gut aus, weil sie zu schnell oder zu langsam abgespielt werden.
- [ ] Es gibt Luecken zwischen den Hintergrundbildern.
- [ ] Es gibt zu wenige oder zu viele Gegner.
- [ ] Gegner sind zu stark oder zu schwach.
- [ ] Ein Gegner stirbt auch, wenn ich neben ihn springe.
- [ ] Die Statusbars werden nicht korrekt aktualisiert.
- [ ] Der Charakter ist nach dem Ableben noch beweglich.
- [ ] Sounds starten oder stoppen nicht richtig.
- [ ] Der Mute-Button stoppt nicht alle Sounds.
- [ ] Sounds sind zu laut.
- [ ] Es gibt keine Moeglichkeit zum Neustart nach Game Over.
- [ ] Der Restart ist ueber einen Reload der Seite geloest.
- [ ] Mobile Buttons funktionieren nicht auf dem Tablet.
- [ ] Im Impressum werden echte Daten verwendet.

## 2. Funktionalitaeten - User Stories (WIP)

Es ist soweit: **El Pollo Loco** / **Sharkie** wartet darauf, von dir zum Leben erweckt zu werden.

El Pollo Loco ist etwas einfacher als Sharkie. Das sollte dich jedoch nicht davon abhalten, das Spiel zu waehlen, welches du erstellen moechtest. Auch eigene Grafiken sind moeglich. Achte jedoch darauf, dass alles vorhanden ist, was du benoetigst.

Aus den folgenden User Storys kannst du kleine Tasks ableiten, die du z. B. in deinem Kanban-Board auflisten kannst, um sie gezielt zu bearbeiten.

### Spielerklärung

**User Story:** Als Benutzer moechte ich eine ansprechende Landingpage haben, die mir auch erklaert, wie das Spiel funktionieren soll. Dafuer kann ich z. B. einen Button anklicken und es oeffnet sich ein Dialog, in dem alles erklaert wird. Der Dialog schliesst sich wieder, wenn ich neben ihn oder auf ein X klicke.

#### Akzeptanzkriterien

- [ ] Die Seite hat ein Hintergrundbild, welches zum Thema passt.
- [ ] Die Schriftart ist angepasst.
- [ ] Es gibt eine Moeglichkeit, die Tastenbelegung des Spiels nachzuschauen.
- [ ] Optional: Es gibt eine Story-Erklaerung.
- [ ] Optional: Man kann das Spiel in den Fullscreen-Modus schalten.

### Spiel

**User Story:** Als Benutzer moechte ich das Spiel ueber einen Start-Button starten koennen, um dann ein schoenes funktionierendes Spiel zu sehen. Hierbei sollte auf einiges geachtet werden, damit man als Benutzer eine gute Spielerfahrung hat.

#### Akzeptanzkriterien

- [ ] Es gibt einen Button, der das Spiel startet.
- [ ] Wenn das Spiel startet, wird man nicht direkt von Gegnern ueberrannt.
- [ ] Der Hintergrund des Spiels ist gleichmaessig und hat keine Luecken.
- [ ] Das Spiel verfuegt ueber Hintergrundmusik und zusaetzliche Soundeffekte.
- [ ] Alle Sounds koennen jederzeit ueber einen Button stummgeschaltet werden.
- [ ] Der Status des Mute-Buttons wird im Local Storage gespeichert.
- [ ] Wenn das Spiel gewonnen oder verloren ist, wird ein Endscreen gezeigt.
- [ ] Im Endscreen gibt es die Moeglichkeit zum Restart des Spiels.
- [ ] Im Endscreen gibt es die Moeglichkeit, das Spiel zu verlassen und zum Home Screen zurueckzukehren.

### Charakter

**User Story:** Als Benutzer moechte ich einen Charakter spielen, welcher durchgehend animiert ist und Spass bringt.

#### Akzeptanzkriterien

- [ ] Wenn der Charakter springt, wird eine fluessige Sprunganimation ausgefuehrt.
- [ ] Die Animationen des Charakters sind grundsaetzlich fluessig, auch wenn er verletzt wird oder springt.
- [ ] Die Idle-Animation ist vorhanden.
- [ ] Die Sleep-Animation tritt nach spaetestens 15 Sekunden ein.
- [ ] Der Charakter ist grundsaetzlich immer in der Idle-Animation, wenn er nichts anderes tut.
- [ ] Der Charakter kann Coins und Flaschen / Blubberblasen einsammeln.
- [ ] Beim Einsammeln von Coins und Flaschen / Blubberblasen aktualisiert sich die Statusbar.
- [ ] Pollo Loco: Der Charakter kann Flaschen werfen.
- [ ] Pollo Loco: Normale Gegner werden bei einem Treffer mit einer Flasche getoetet.
- [ ] Pollo Loco: Dem Endboss wird durch einen Flaschentreffer Schaden zugefuegt.
- [ ] Pollo Loco: Die Statusbar reduziert sich nach einem Wurf.
- [ ] Sharkie: Mit der Schwanzflosse / Blubberblase kann der Charakter bestimmte Gegner toeten.
- [ ] Sharkie: Mit der Schwanzflosse / Blubberblase kann der Charakter dem Endboss Schaden zufuegen, um ihn zu toeten.
- [ ] Der Charakter hat zu seinen verschiedenen Animationen passende Sounds, z. B. Schnarchen, wenn er schlaeft.
- [ ] Wenn der Charakter Schaden erleidet, passt sich seine Statusbar an.
- [ ] Wenn die Statusbar leer ist, ist das Spiel verloren.

### Gegner

**User Story:** Als Benutzer moechte ich herausfordernde verschiedene Gegner haben. Sie sollten jedoch nicht unmoeglich zu besiegen sein.

**Hinweis:** Im Entwicklungsmodus ist es ratsam, dem Charakter mehr Leben zu geben, damit man besser herumexperimentieren kann.

#### Akzeptanzkriterien

- [ ] Es gibt mindestens zwei verschiedene Gegnertypen plus den Endboss im Spiel.
- [ ] Groesse, Geschwindigkeit und Angriffe der Gegner variieren moeglichst.
- [ ] Es gibt einen Endboss, der staerker ist als die normalen Gegner.
- [ ] Die Animationen der Gegner sind fluessig, auch wenn sie verletzt oder getoetet werden.
- [ ] Gegner, die man z. B. durch Springen besiegen kann, sterben nur, wenn man von oben auf sie springt.
- [ ] Die Offsets der Gegner passen.
- [ ] Wenn ich auf einen Gegner springe, stirbt dieser nur, wenn ich ihn auch treffe.
- [ ] Die Gegner haben zu ihren verschiedenen Animationen passende Sounds.
- [ ] Beispiel: Der Endboss in El Pollo Loco koennte laut gackern, wenn er getroffen wird und Schaden erleidet.

## 3. Sonstiges

### User Story 1 - Mobile Nutzung

**User Story:** Als Benutzer moechte ich das Spiel auch auf Mobilgeraeten spielen.

#### Akzeptanzkriterien

- [ ] Es gibt die Moeglichkeit, im Querformat auf einem Mobilgeraet zu spielen.
- [ ] Es gibt nur in der Mobilansicht extra Buttons, um auf dem Mobilgeraet, Smartphone oder Tablet zu spielen.
- [ ] Das Kontextmenue, also Rechtsklick / Touch-and-Hold, ist bei den Mobile-Touch-Buttons deaktiviert.
- [ ] Wenn das Geraet hochkant gehalten wird, zeigt eine Meldung an, dass das Geraet gedreht werden muss, um spielen zu koennen.

### User Story 2 - Impressum

**User Story:** Als Benutzer moechte ich das Impressum von El Pollo Loco einsehen koennen, um Informationen ueber den Anbieter und die Nutzungsbedingungen zu erhalten.

#### Akzeptanzkriterien

- [ ] Durch Anklicken des Links werde ich zu einer Seite weitergeleitet, die alle notwendigen Informationen ueber den Anbieter und rechtliche Hinweise enthaelt.
