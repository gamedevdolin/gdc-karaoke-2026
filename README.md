# Game Dev Karaoke 2026 - Ticketing Site

## Quick Start

This site is ready to deploy on Vercel or Netlify. Just connect your GitHub repo and it'll go live.

---

## How to Edit Text

All the text content is in `app.jsx`. Here's where to find things:

### Header (lines ~1300-1330)
- "Sing your troubles away" - top tagline
- "GAME DEV KARAOKE 2026" - main title
- "WEDNESDAY, MARCH 11TH" - date
- "Want to attend the largest karaoke party..." - subtitle

### Room Descriptions (lines ~1350-1400)
- Main Room description: search for "Due to the laws of time"
- Private Room description: search for "noraebang"

### Room Names & Pricing (lines ~50-100)
Look for `INITIAL_ROOMS` - this is where all room names and prices are configured:
```javascript
mainStage: {
  name: 'Main Stage',
  price: 30,
  capacity: 120,
  ...
}
```

### Bottom Info Cards (lines ~1880-1920)
- Venue info
- "Want to Sponsor?" text
- "Safety First" text
- "This space for rent" sponsor box

### Footer (lines ~1930-1945)
- Event details
- Host names and emails

---

## How to Replace Images

### Mascot Images (Jigglypuff & Cait Sith)

1. Save your images to the `public/images/` folder:
   - `jigglypuff.png` (recommended: ~200x240px, transparent background)
   - `caitsith.png` (recommended: ~200x240px, transparent background)

2. In `app.jsx`, find the header section (~line 1315) and replace:
```jsx
// Change this:
<div className="mascot-placeholder">
  <span className="icon">🎀</span>
  <span className="label">Jigglypuff</span>
</div>

// To this:
<img src="/images/jigglypuff.png" alt="Jigglypuff" style={{ width: 100, height: 'auto' }} />
```

### Hero Slides

1. Export your Google Slides as PNG files and save to `public/images/`:
   - `slide1.png` (the "rough year" slide)
   - `slide2.png` (the Pandora Karaoke slide)

2. In `app.jsx`, find the hero-slides section (~line 1340) and replace the placeholder divs with:
```jsx
<div className="hero-slide">
  <img src="/images/slide1.png" alt="It's been a rough year" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</div>
```

---

## Configuration

### Admin Password
Find this line (~line 1226):
```javascript
const ADMIN_PASSWORD = 'zombiespiderwebs';
```

### Event Details
Find the `CONFIG` object at the top (~line 20):
```javascript
const CONFIG = {
  eventDate: "Wednesday, March 11th, 2026",
  eventTime: "9:00 PM - 12:00 AM",
  venueName: "Pandora Karaoke",
  venueAddress: "50 Mason St, San Francisco, CA 94102",
  drinkTicketsIncluded: 2,
};
```

---

## Deployment

### Vercel (Recommended)
1. Push this repo to GitHub
2. Go to vercel.com and sign in with GitHub
3. Click "Import Project" and select this repo
4. Click "Deploy"
5. Your site will be live at `your-project.vercel.app`

### Custom Domain
In Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add your domain (e.g., `karaoke.gamedevdolin.com`)
3. Update your DNS settings as instructed

---

## File Structure

```
gdc-karaoke/
├── index.html      # Main HTML file (don't edit unless you know what you're doing)
├── app.jsx         # All the React code - THIS IS WHERE YOU EDIT
├── README.md       # This file
└── public/
    └── images/     # Put your images here
        ├── jigglypuff.png
        ├── caitsith.png
        ├── slide1.png
        └── slide2.png
```

---

## Need Help?

Come back to Claude and we can keep iterating!
