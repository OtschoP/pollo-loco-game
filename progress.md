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
