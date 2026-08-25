# Kiran Banda — Portfolio · Start Here

Everything you need to deploy the site and keep it updated — no coding required.

## 1. Deploy to Netlify

1. Go to https://app.netlify.com/drop
2. Drag the entire `site` folder onto the page
3. Your live URL appears immediately (e.g. `yoursite.netlify.app`)
4. To update later: drag the folder again, or connect a GitHub repo for auto-deploy on push (see `readme.md`)

Contact form submissions are already wired to Netlify Forms — no setup needed. You'll get an email at `bandakirankumar03@gmail.com` and can also see them under Netlify → your site → **Forms**.

Custom domain (GoDaddy etc.) steps are in `readme.md`.

## 2. Where your media lives

Everything is split into **one folder per page**, plus **one folder per project** — nothing shared, nothing to hunt for.

```
media/
├── pages/
│   ├── home/       ← homepage hero video (reel.mp4, reel-poster.jpg)
│   ├── about/      ← portrait.jpg + gallery/01.jpg..08.jpg
│   ├── work/       ← (no media — pulls from each project's own folder)
│   └── contact/    ← (no media — text + form only)
└── projects/
    ├── xr01-chinese-temple/
    ├── hollow-forest/
    ├── ...one folder per project, named by its slug
```

Every folder has its own `_readme.md` telling you exactly which filenames to drop in. Read `media/projects/_readme.md` for the full project-media guide with copy-paste examples.

## 3. Wiring media + editing Vimeo IDs / captions / text

Everything is edited in plain files under `proto/` — no build step, just save and reload.

**Media + Vimeo links → `proto/data.jsx`**
Full guide with copy-paste examples: `media/projects/_readme.md`. Quick version:
```js
heroVimeo: 'https://vimeo.com/123456789',        // or just the ID
hero:      'media/projects/my-project/hero.jpg',  // local image
heroVideo: 'media/projects/my-project/hero.mp4',  // local video
```
Same pattern for `finalVimeo`/`finalVideo`/`finalImage`, and `vimeo`/`video`/`image` inside each `breakdown` item.

**Project titles, taglines, blurbs, roles, tags** → also in `proto/data.jsx`, inside the `PROJECTS` array — each project is one `{ ... }` block, edit any field directly (`title:`, `tagline:`, `blurb:`, `role:`, `tags:`).

**Other page copy:**
- Homepage headline/intro copy → `proto/pages-home.jsx` (`HomeIntro`, `ContactTeaser`)
- About page bio, skills, hobbies → `proto/pages-about.jsx`
- Contact page copy → `proto/pages-contact.jsx`
- Nav labels, footer, email/socials → `proto/ui.jsx`

Just find the text in quotes and replace it — nothing else needs to change.

## 4. Testing before you deploy

Open `preview.html` — lets you check Mobile / Tablet / Laptop / Desktop / Full-width layouts side by side before pushing changes live.

## 5. Cheatsheet

| I want to... | Edit this file |
|---|---|
| Add/change a project video or photo | `proto/data.jsx` + drop file in `media/projects/<slug>/` |
| Change a Vimeo ID | `proto/data.jsx` — the `heroVimeo` / `finalVimeo` / `vimeo` fields |
| Fix a typo / rewrite a caption or blurb | `proto/data.jsx` (projects) or the relevant `proto/pages-*.jsx` |
| Change the homepage video | `media/pages/home/` + `proto/pages-home.jsx` (`HERO_VIDEO` / `HERO_VIMEO`) |
| Swap the portrait photo | replace `media/pages/about/portrait.jpg` |
| Update email / social links | `proto/ui.jsx` (Footer) and `proto/pages-contact.jsx` |
