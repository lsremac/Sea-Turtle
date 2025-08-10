# Sea Turtle Cleanup

Arcade-style HTML5 canvas game: swim as a sea turtle and collect 24+ unusual trash items to clean the reef. Kid-friendly “iconic” art, chill movement, and a simple win state.

## Requirements
- Any modern desktop or mobile browser (Chrome, Edge, Firefox, Safari)
- No build tools needed (pure HTML/CSS/JS)

## How to run
1. Download or clone the repository
2. Open `index.html` directly in your browser
3. Controls:
   - Move: Arrow Keys or WASD
   - Reset: R
   - Mute: M
   - Help: H
4. Goal: Collect all items to win. A victory overlay will appear.

## Project structure
- `index.html` — page shell and UI overlays
- `styles.css` — ocean theme and UI
- `game.js` — gameplay, drawing, audio, input
- `LICENSE` — MIT license

## Deploy (GitHub Pages)
1. Push these files to a GitHub repository
2. In GitHub: Settings → Pages → Build and deployment → Deploy from branch
3. Select `main` and `/ (root)`, then Save
4. Your site will be published at a `github.io` URL

## Development notes
- Canvas is scaled for device pixel ratios up to 2x for crisp art
- World uses a simple camera follow and floaty physics with drag
- 26 collectible items with simple glowing “iconic” shapes

## License
MIT — see `LICENSE`.
