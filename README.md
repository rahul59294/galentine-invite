# Galentine Letter – Cute Interactive Single Page

A soft, romantic, handwritten-style **Galentine invite** built with **pure HTML, CSS, and JavaScript**.

## Features

- **Vintage envelope intro**
  - Floating pastel hearts background
  - Handwritten “For My Bestie 💕” using Google Fonts
  - Click to open: flap flips, letter slides out with a gentle bounce
- **Letter scene**
  - Cream textured letter card with dashed border and soft shadow
  - Handwritten-style message inviting your bestie to be your Galentine
  - Big pink **YES 💕** button and a tiny **no 🙈** button
- **Playful NO button logic**
  - NO button dodges the mouse cursor and jumps around the screen
  - Impossible (or extremely hard) to click
  - Shows teasing messages after several failed attempts
- **YES celebration**
  - Confetti + floating heart animation via a `<canvas>`
  - Celebration card: “YAYYY! Best Galentine secured 💕✨”
  - Respects `prefers-reduced-motion` for users who disable animations

## Tech stack

- **HTML5** – structure (`index.html`)
- **CSS3** – layout, theming, animations (`style.css`)
- **Vanilla JavaScript** – interactions and confetti (`script.js`)
- **Google Fonts only**:
  - `Dancing Script` – handwritten look
  - `Quicksand` – friendly body text

No frameworks, no external JS libraries.

## Run locally

You just need a static file server.

### Option 1 – Python (built into macOS)

```bash
cd /Users/rahulkumarsingh/Galentines
python3 -m http.server 5173
```

Then open:

- `http://localhost:5173`

### Option 2 – VS Code / any static server

Use any “Live Server” / static HTTP server pointing at the `Galentines` folder.

## How to customize

- **Change the greeting text**
  - Edit the letter content in `index.html` inside the `.letter-body` element.
- **Adjust colors**
  - All main colors are defined as CSS variables at the top of `style.css` (`--bg-1`, `--paper`, `--accent`, etc.).
- **Teasing messages**
  - Edit the `teasePhrases` array near the top of `script.js`.

## Deployment

Because it’s a static site, you can deploy it almost anywhere:

- **Vercel / Netlify**
  - Project type: *static site*
  - Build command: *(none)*
  - Output / publish directory: project root
- **GitHub Pages**
  - Push the folder to a repo
  - Enable Pages and serve from the `main` branch root

Once deployed, just share the public URL with your bestie as your Galentine invitation. 💕


