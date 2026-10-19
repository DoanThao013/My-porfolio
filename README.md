# Doan Thanh Thao: Portfolio

A single-page, fairytale-style portfolio about cloud infrastructure, Kubernetes, Terraform and DevSecOps work.

- Twilight hero with drifting paper lanterns
- Tap the castle for a wish and fireworks
- Sticky chapter tabs with a reading-progress bar
- Spellbook: tap a skill to highlight the quests and notes where it was used
- Day and night theme toggle (remembers your choice)

Plain HTML, CSS and JavaScript. No build step and no dependencies. Fonts load from Google Fonts.

## Project structure

```
thao-portfolio/
├── index.html        Page content and markup
├── css/
│   └── style.css     Colours, layout, lanterns, tabs, responsive rules
├── js/
│   └── main.js       Theme toggle, lanterns, fireworks, skill highlight, tab tracking, copy buttons
├── assets/
│   └── favicon.svg   Browser tab icon
├── README.md
└── .gitignore
```

## Run locally

Open `index.html` in a browser. To serve it instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy with GitHub Pages

1. Push this folder to a public repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute or two the site is live at `https://<username>.github.io/<repository>/`.

## Edit the content

| What | File | Where to look |
| --- | --- | --- |
| Name, tagline, chips | `index.html` | `<header class="hero">` |
| About text and facts | `index.html` | `<section id="about">` |
| Internships and volunteering | `index.html` | `<section id="chapters">` |
| Projects | `index.html` | `<section id="quests">` (each `<article class="quest">`) |
| Skills | `index.html` | `<section id="spellbook">` (each `<button class="skill">`) |
| Email, phone, profile links | `index.html` | `<section id="contact">` |
| Colours and fonts | `css/style.css` | the `:root` block at the top |
| Wish messages | `js/main.js` | the `wishes` array |
| Number of lanterns | `js/main.js` | `seedLanterns()` |

### Skill highlighting

Each project or note carries a `data-skills` attribute with space-separated skill keys, for example `data-skills="gcp kubernetes terraform ansible"`. A skill button uses the same key in `data-skill`, for example `data-skill="terraform"`. Add the key to both sides to connect a new skill to a project.

## Before you publish

A public repository shows everything in these files, including the email and phone number in the Contact section. Remove anything you do not want to share. Never commit tokens, passwords or `.env` files.
