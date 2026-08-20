# Powerstar4 Clearing & Forwarding Agent — Website

A modern, animated, single-page website for **Powerstar4 Trading CC**, a customs
clearing & forwarding agent at the Port of Walvis Bay, Namibia.
Pure **HTML + CSS + JavaScript** — no build step, no dependencies, deploys anywhere.

Brand colours are drawn straight from the logo: deep green ring, lime highlight,
red star, blue wave.

## Project structure

```
powerstar4-website/
├── index.html          # the whole site (single page, sectioned)
├── css/
│   └── style.css       # all styling, responsive + animations
├── js/
│   └── main.js         # interactivity (see feature list below)
├── assets/
│   └── logo.jpg        # Powerstar4 logo
└── README.md
```

## Features

- Animated preloader, scroll-progress bar, glass navbar with active-link highlighting
- Hero with particle canvas, aurora glow, typing effect, animated counters,
  3D-tilt logo card and a blue SVG wave (from the logo)
- Scrolling destination ticker (SADC corridors)
- Services grid (8 services) with hover effects
- 5-step process timeline
- **Interactive quote estimator** — sliders & options compute a live estimate and
  build a prefilled WhatsApp message
- Auto-playing testimonial slider with swipe support
- FAQ accordion, contact form (opens the visitor's email app, prefilled)
- Floating WhatsApp button, back-to-top, fully responsive, reduced-motion friendly

## Preview locally

Just open `index.html` in a browser, or from VS Code use the **Live Server**
extension (Right-click `index.html` → *Open with Live Server*).

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `powerstar4-website`).
2. From this folder run:

   ```bash
   git init
   git add .
   git commit -m "Powerstar4 website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/powerstar4-website.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / root → Save**.
4. Your site goes live at `https://YOUR-USERNAME.github.io/powerstar4-website/` within a minute or two.

## Before going live — replace the placeholders

| Item | Where | Currently |
|---|---|---|
| Phone / WhatsApp number | `index.html` + `js/main.js` (search for `264810000000` and `+264 81 000 0000`) | placeholder |
| Social media links | footer `<a href="#">` tags | placeholders |
| Google Maps link | contact section | generic search link |
| Privacy / Terms pages | footer | placeholders |

## Contact details used on the site

- **Powerstar4 Trading CC** — Shop 18, Pelican Mall, Walvis Bay · P.O. Box 1883, Walvis Bay, Namibia
- powerstarfourtradingcc2026@gmail.com
