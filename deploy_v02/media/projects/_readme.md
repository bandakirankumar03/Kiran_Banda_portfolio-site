# Project media — `media/projects/<slug>/`

You only need to know **one rule**: open `proto/data.jsx` and add a line
to the project you want media for. That's it. Reload the page to see it.

Every project already has its own folder here (e.g. `media/projects/hollow-forest/`)
with a `_readme.md` listing the exact filenames it expects.

---

## TL;DR — three ways to fill a slot

Every project has a `hero`, a `finalImage`, and four `breakdown` slots.
Each slot can show **one** of these three things:

| What you have                | Field to add                                  | Example                                                    |
|------------------------------|-----------------------------------------------|------------------------------------------------------------|
| A **Vimeo link** (recommended for video) | `heroVimeo` / `finalVimeo` / `vimeo`          | `heroVimeo: 'https://vimeo.com/123456789'`                 |
| An **image file** (jpg / webp / png)     | `hero` / `finalImage` / `image`               | `hero: 'media/projects/xr01/hero.jpg'`                     |
| A short **local mp4** loop               | `heroVideo` / `finalVideo` / `video`          | `heroVideo: 'media/projects/xr01/loop.mp4'`                |

If you add nothing, the coloured gradient placeholder stays. You can fill
projects in one slot at a time.

---

## 1.  Adding a Vimeo video (your main project videos)

### Step 1 — get the link
On Vimeo, hit **Share** on your video. Copy any of these — all of them work:

- `https://vimeo.com/123456789`
- `https://vimeo.com/123456789/abcdef1234` (private link with hash)
- `123456789` (just the ID)

> ⚠️ In Vimeo's **Privacy** settings, allow embedding on **"Anywhere"** —
> otherwise the video shows a black box. If it's a private/unlisted video,
> use the full link **with the hash** (the part after the second `/`).

### Step 2 — paste it into `proto/data.jsx`

Find the project block (each one starts with a `slug:` line). Add the field:

```js
{
  slug: 'xr01-chinese-temple',
  // ... all the existing fields stay exactly as they are ...
  heroVimeo:  'https://vimeo.com/123456789',     // ← big hero at top of case page
  finalVimeo: 'https://vimeo.com/987654321',     // ← big "final frame" video at bottom
},
```

For the **4 breakdown clips** on the case page, add `vimeo:` inside each
breakdown object:

```js
breakdown: [
  { tone: 'studio', label: '01 · blockout',  meta: 'greybox',
    vimeo: 'https://vimeo.com/111111111' },
  { tone: 'ember',  label: '02 · materials', meta: 'PBR',
    vimeo: 'https://vimeo.com/222222222' },
  { tone: 'canyon', label: '03 · lookdev',   meta: 'lumen',
    vimeo: 'https://vimeo.com/333333333' },
  { tone: 'dusk',   label: '04 · on-set',    meta: 'live',
    vimeo: 'https://vimeo.com/444444444' },
],
```

Save the file, reload the site. Done.

---

## 2.  Adding images (for XR on-set photos, stills, etc.)

### Step 1 — drop the file into `media/projects/<slug>/`

Use the project's `slug` as the folder name. Examples:

```
media/projects/xr01-chinese-temple/onset-01.jpg
media/projects/xr01-chinese-temple/onset-02.jpg
media/projects/xr02-1920s-nyc/hero.jpg
media/projects/xr02-1920s-nyc/final.jpg
```

Recommended sizes:
- Hero / final shot: **2400 × 1350** (16:9), under **400 KB**
- Breakdown tiles:   **1600 × 900**,  under **250 KB**
- Save as `.jpg` or `.webp` (use [squoosh.app](https://squoosh.app) to compress)

### Step 2 — point to it in `proto/data.jsx`

```js
{
  slug: 'xr01-chinese-temple',
  // ...
  hero:       'media/projects/xr01-chinese-temple/hero.jpg',
  finalImage: 'media/projects/xr01-chinese-temple/final.jpg',
  breakdown: [
    { tone: 'studio', label: '01 · on set',    meta: 'LED wall',
      image: 'media/projects/xr01-chinese-temple/onset-01.jpg' },
    { tone: 'ember',  label: '02 · on set',    meta: 'crew',
      image: 'media/projects/xr01-chinese-temple/onset-02.jpg' },
    { tone: 'canyon', label: '03 · plate',     meta: 'matched',
      image: 'media/projects/xr01-chinese-temple/plate-01.jpg' },
    { tone: 'dusk',   label: '04 · final',     meta: 'comp',
      image: 'media/projects/xr01-chinese-temple/final-frame.jpg' },
  ],
},
```

---

## 3.  Mixing: Vimeo hero + image breakdowns

This is the **recommended setup for XR projects**: one Vimeo at the top
showing the cut, and 4 still photos from set below.

```js
{
  slug: 'xr01-chinese-temple',
  // ...
  heroVimeo: 'https://vimeo.com/123456789',                // ← Vimeo at top
  hero:      'media/projects/xr01-chinese-temple/hero.jpg', // ← poster while it loads (optional)

  breakdown: [
    { tone: 'studio', label: '01 · led wall',  meta: 'on set',
      image: 'media/projects/xr01-chinese-temple/set-01.jpg' },
    { tone: 'ember',  label: '02 · crew',      meta: 'shoot day',
      image: 'media/projects/xr01-chinese-temple/set-02.jpg' },
    { tone: 'canyon', label: '03 · monitors',  meta: 'brain ops',
      image: 'media/projects/xr01-chinese-temple/set-03.jpg' },
    { tone: 'dusk',   label: '04 · cast',      meta: 'in frame',
      image: 'media/projects/xr01-chinese-temple/set-04.jpg' },
  ],

  finalVimeo: 'https://vimeo.com/987654321',               // ← optional second video at bottom
},
```

---

## 4.  Field cheatsheet (the only one you need)

Inside any project in `data.jsx`:

| Where on the page                      | Field name        | What to paste                              |
|----------------------------------------|-------------------|--------------------------------------------|
| Big top of case page                   | `heroVimeo`       | Vimeo URL or ID                            |
|                                        | `heroVideo`       | path to local `.mp4`                       |
|                                        | `hero`            | path to `.jpg/.webp`                       |
| Each of the 4 breakdown tiles          | `vimeo`           | Vimeo URL or ID  *(inside the breakdown object)* |
|                                        | `video`           | path to local `.mp4`                       |
|                                        | `image`           | path to `.jpg/.webp`                       |
| Big "final frame" block before quote   | `finalVimeo`      | Vimeo URL or ID                            |
|                                        | `finalVideo`      | path to local `.mp4`                       |
|                                        | `finalImage`      | path to `.jpg/.webp`                       |

**Priority** (if you set more than one on the same slot): Vimeo wins → then local video → then image → then the gradient placeholder.

---

## 5.  Tips

- **Don't upload big mp4s here.** Netlify's free tier has a small
  bandwidth budget. Use Vimeo for anything over ~10 seconds or 8 MB.
- **Vimeo embeds autoplay muted and loop** as background video — same
  feel as a native mp4, but it streams from Vimeo's CDN.
- **For XR on-set stills**, just drop the JPGs into the project folder
  and list them in `breakdown:`. Four photos = one full row of stills.
- **Forgot a slug?** Look at the `slug:` line in each project block in
  `data.jsx`. Use that exact string as the folder name in `media/projects/`.
