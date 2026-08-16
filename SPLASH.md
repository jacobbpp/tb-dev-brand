# TB Dev — splash sting

The animated `~/tb-dev` logo that opens a game. Cursor blinks in an empty
prompt, the wordmark types itself, Tommy drops in, GAMES tracks out under a
violet rule. 1.6s, plays once, holds.

Colors, type and easing all come from `tokens.css`, so it themes with
everything else and flips light/dark on its own.

## Add it to the brand repo

Drop these next to `tokens.css` and `components.css`:

```
tb-dev-brand/
├─ tokens.css
├─ components.css
├─ splash.css        ← new
├─ tb-splash.js      ← new (optional, one-tag version)
└─ assets/
```

Then add a line to the repo README under the file tree:
`splash.css` — the animated logo sting (see SPLASH.md).

## Use it in a game (one tag)

```html
<link rel="stylesheet" href="/brand/tokens.css">
<link rel="stylesheet" href="/brand/splash.css">
<script src="/brand/tb-splash.js" defer></script>

<tb-splash dismiss></tb-splash>
```

`dismiss` fades it out and removes it when it's done. Start the game off the
event:

```js
document.addEventListener('tb-splash-done', () => startGame());
```

Attributes: `tagline="games"` (`tagline=""` hides it), `icon="/brand/assets/icon-512.png"`,
`hold="700"` (ms on the finished logo), `inline` (boxed in the page instead of
full screen), `no-scanlines`, `dismiss`.
Methods: `el.replay()`, `el.finish()` (skip on tap, or call it once your
assets have loaded).

## Use it in React / Vite

```jsx
import './brand/tokens.css';
import './brand/splash.css';
import './brand/tb-splash.js';

function Splash({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const done = () => onDone();
    el.addEventListener('tb-splash-done', done);
    return () => el.removeEventListener('tb-splash-done', done);
  }, [onDone]);
  return <tb-splash ref={ref} dismiss />;
}
```

## Plain markup (no JS)

If you'd rather own the DOM, `tb-splash.js` is skippable. This is all it builds:

```html
<div class="tb-splash">
  <div class="tb-splash__lockup">
    <img class="tb-splash__tile" src="/brand/assets/icon-512.png" alt="">
    <div class="tb-splash__type">
      <div class="tb-splash__word">
        <span><i class="t">~/</i>tb<i class="d">-dev</i></span>
        <div class="tb-splash__caret"></div>
      </div>
      <div class="tb-splash__rule"></div>
      <div class="tb-splash__tag">games</div>
    </div>
  </div>
  <div class="tb-splash__scan"></div>
  <div class="tb-splash__sweep"></div>
  <div class="tb-splash__vignette"></div>
</div>
```

`<i class="t">` and `<i class="d">` need `font-style: normal` if your reset
doesn't already do it.

## Sizing

Two knobs, set on `.tb-splash` (or per game, in your own CSS):

```css
.tb-splash { --tb-splash-word: 62px; --tb-splash-tile: 136px; }
```

Defaults are fluid (`clamp`), so it fits a phone splash and a desktop window
without changes.

## Rules

- One per game, on first load. It's a greeting, not a loading screen. If your
  assets need longer, keep your own loading state after it and call `finish()`.
- Don't recolor it. Orange `~/`, violet `-dev` — same as the wordmark rule in
  `components.css`.
- Let people skip it. Wire tap or any key to `finish()`.
- Reduced motion is handled: the animation is skipped and the finished lockup
  shows straight away.

_TB Dev · splash v1.0_
