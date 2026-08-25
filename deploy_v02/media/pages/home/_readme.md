# Homepage — `media/pages/home/`

Drop your showreel here:

- `reel.mp4` — the fullscreen looping video on the homepage (keep it under ~8MB, 10-15s, no audio needed — it auto-mutes)
- `reel-poster.jpg` — optional still frame shown while the video loads

Then open `proto/pages-home.jsx`, find `function ReelHero()` near the top, and set:

```js
const HERO_VIDEO  = 'media/pages/home/reel.mp4';
const HERO_POSTER = 'media/pages/home/reel-poster.jpg';   // optional
```

Prefer Vimeo instead? Set `HERO_VIMEO = 'https://vimeo.com/123456789'` and leave `HERO_VIDEO` empty — Vimeo wins if both are set.

If neither is set, the homepage shows an animated gradient placeholder — safe to leave until you have a reel ready.
