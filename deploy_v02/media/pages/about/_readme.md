# About page — `media/pages/about/`

- `portrait.jpg` — your headshot, shown next to the bio (already styled black & white, high contrast — upload a normal color photo, the site does the rest)
- `gallery/01.jpg` … `08.jpg` — the photo strip further down the About page

## Wiring the gallery

Open `proto/data.jsx`, find `const GALLERY = [`, and add an `image:` path to each entry:

```js
{ tone: 'forest', cap: 'sanctuary / 02:41:13', tag: 'UE5',
  image: 'media/pages/about/gallery/01.jpg' },
```

Missing images just show the gradient placeholder — fill in one at a time.
