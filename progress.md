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
