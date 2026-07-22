Original prompt: kannst Du mir dabei helfen einen offset für die jeweiligen moveableObjects zu bauen, damit die Kollisionsabfrage wirklich erst anspringt, wenn das Objekt berührt wird und nicht schon bei dem Rahmen wie er jetzt ist? In der Art wie das im angehängten Bildschirmfoto passiert.

2026-03-11
- Added `offset` support to `MoveableObject`.
- Switched collision check to hitbox-based AABB (`getHitbox()` + `isColliding()`).
- Updated debug frame rendering to show the effective hitbox.
- Added initial offsets for `Character`, `Chicken`, `Endboss`, and `Coin`.
- TODO: Fine-tune offsets visually in runtime; values are initial approximations.
- Validation status:
- `node --check` passed for all edited files.
- Playwright validation currently blocked in this environment (missing browser deps initially, then local browser/server execution required elevated permissions that were not granted).

2026-04-15
- Implemented staged idle animation for `Character` in `models/moveable-object/character.class.js`.
- Added `IMAGES_IDLE` (`I-1` ... `I-10`) and `IMAGES_LONG_IDLE` (`I-11` ... `I-20`) preload + playback logic.
- Behavior now: while standing still on ground, play `IMAGES_IDLE` once, then loop `IMAGES_LONG_IDLE` until movement resumes.
- On walk/jump/hurt/dead transitions, idle state resets so idle intro starts fresh on next standstill.
- Validation status:
- `node --check` passed for edited files (`character.class.js`, `world.class.js`).
- Playwright/web-game client validation blocked due missing `playwright` package and restricted network (npm registry unreachable; escalated retry not approved).
- Added a 2000ms inactivity delay before idle animation starts (`idleDelayMs`, `lastActiveAt`, `markActivity()` in `Character`).
- Updated game-over rendering in `World`: game over image now fills the full canvas (`drawImage(..., 0, 0, canvas.width, canvas.height)`).
- Refactored `World.draw()` to meet max-line guideline by extracting rendering steps into `prepareFrame`, `drawScrollableWorld`, `drawFixedUi`, `drawCharacterIfVisible`, and `drawGameOverIfReady`.
- Added bottle throw rotation loop in `ThrowableObject` using `IMAGES_ROTATION` (`1_bottle_rotation` to `4_bottle_rotation`) while the bottle is in flight.
- Rotation interval stops when splash starts; splash animation behavior remains unchanged.
- Changed enemy render layering: Endboss is now drawn in a dedicated foreground pass after status bars, so UI no longer covers the boss.
- Added new enemy class `ChickenSmall` with chicken-small walk/dead animations and movement behavior similar to `Chicken`.
- Registered `chicken-small.class.js` in `index.html` so the class is available before `level1.js` runs.
- Extended `level1` enemy setup with `createSmallChickens()` to spawn small chickens alongside normal chickens.
- Updated bottle collision handling so throwable bottles defeat both `Chicken` and `ChickenSmall`.
- Implemented Endboss MVP behavior: proximity activation (450px), once-activated permanent chase, and chase speed set to 2.2.
- Endboss now uses `1_walk` animation before activation and `2_alert` while activated/chasing.
- Wired world reference for all endboss instances in `World.setWorld()` to enable player-distance checks and chase logic.
- Boss movement/activation now pauses when `isGameOver` is true.
- Adjusted Endboss chase: direction is now re-evaluated only every 6000ms (`chaseDirectionChangeIntervalMs`), causing delayed turn response.

2026-04-28
- Added Endboss collision attack behavior: `World.checkCollisions()` now calls `Endboss.startAttack()` when character and Endboss collide.
- Endboss now plays `IMAGES_ATTACK` once, stands still during the attack, and remains movement-locked for 1000ms after the attack animation finishes.

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

2026-07-06
- Adjusted responsive CSS for short landscape viewports such as iPhone SE DevTools size 667x375.
- `.game-stage` now keeps the 3:2 canvas ratio by deriving displayed width from available `100dvh` height; internal canvas dimensions remain 720x480.
- In `max-height: 480px`, header/buttons/touch controls/start/end overlays are compacted so the full play area stays within the viewport.
- Avoided CSS calc multiplication by using equivalent `calc(150dvh - ...)` formulas for browser compatibility.

2026-07-14
- Review Issue 2 documented: no `templates/` folder is created because the project currently has no dynamically generated HTML templates.
- Static UI fragments such as dialogs, endscreen, start button, and mobile controls intentionally remain in `index.html`.
- A `templates/` folder should only be added when reusable HTML fragments or actual template files are introduced.

2026-07-22
- Review Issue 6a implemented: renamed `camera_x` to `cameraX` in `World`, `WorldRenderer`, and `Character`.
- Validation status: `node --check` passed for `classes/world.class.js`, `classes/world-renderer.class.js`, and `classes/moveable-object/character.class.js`.
- Playwright validation was attempted via the develop-web-game client, but the environment is missing the `playwright` package.
- Review Issue 6b implemented: renamed `level_end_x` to `levelEndX` in `Level` and `Character`.
- Validation status: `node --check` passed for `classes/level.class.js` and `classes/moveable-object/character.class.js`.

2026-07-21
- Review Issue 5 implemented: mobile controls default to `display: none` and no longer rely on `!important`.
- `init()` marks coarse touch devices with `.is-touch-device`; `startGame()` adds `.game-started` and reveals the controls, while `backToHome()` removes the state class and restores `[hidden]`.
- The touch media query now shows controls only through `.is-touch-device.game-started .mobile-controls:not([hidden])`.
- Validation: `node --check js/game.js`, `git diff --check`, selector checks, and an isolated DOM state-flow test for touch detection, game start, and return to home passed.
- Visual Playwright validation could not run because the skill's `playwright` package is missing and installation approval was declined.
