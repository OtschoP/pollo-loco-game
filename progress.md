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
