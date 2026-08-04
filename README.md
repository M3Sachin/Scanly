# Scanly

A free QR code generator with illustrated frames. No sign-up, no watermark, no limits, no backend.

Everything runs in the browser: you type, the QR renders live, you download a PNG or SVG. There is no
server storing your codes and no account to create.

---

## Features

**23 content types** — URL, Text, Email, Phone, WiFi, vCard, SMS, WhatsApp, Calendar Event, Geo
Location, File upload, plus 12 labelled link presets (PDF, Video, MP3, Playlist, Apps, Business,
Product, Menu, Landing page, Coupon, List of links, Social, Images).

**59 illustrated frames** — the QR sits *inside* real drawn artwork: a beer mug, a coffee cup, a
scooter, a chef hat, a price tag, a speech bubble, a suitcase. 57 one-click themed presets, each
with its own shape, icon, caption and colour, plus a plain border / banner / ribbon / badge / tag /
bubble if you want to build your own.

**Styling** — foreground and background colours, gradients, six dot styles, three corner styles,
independent corner colour, centre logo upload, error-correction level, 256/512/1024px export.

**Document import** — on the Text tab, upload a `.txt`, `.md`, `.pdf` or `.docx` and its text is
extracted in the browser and encoded.

**Big files** — a QR code physically holds ~2.9KB (ISO/IEC 18004), so a real PDF can never fit
inside one. The File tab uploads your file to a public host and encodes the download link instead.
You choose the lifetime: **Temporary** (~3 hours, uguu.se) or **Permanent** (catbox.moe). Temporary
links get a live countdown and an optional expiry reminder.

**Warm light + dark themes** — follows your OS, remembers an explicit choice.

---

## Run it

It is a static site with no build step required to run:

```bash
open index.html
```

That's it. `styles.css` is committed, so the page works straight from disk.

## Deploy to Vercel

```bash
npx vercel --prod
```

No build command and no output directory to configure — Vercel serves the repo root as static
files. `vercel.json` adds a Content-Security-Policy and the usual hardening headers.

---

## Editing the CSS

Tailwind is **pre-built**, not loaded from the CDN (the CDN build ships ~120KB of JavaScript that
generates CSS at runtime and warns against production use). The committed `styles.css` is 10KB.

If you add or change any Tailwind utility class in `index.html`, regenerate it:

```bash
npm install
npm run css
```

Use `npm run css:watch` while working. There is deliberately no `build` script, so Vercel skips the
build step entirely and deploys are instant.

---

## How it works

Single file, `index.html`, holding the markup, the theme tokens and the app logic. A few things
worth knowing before changing it:

**Frame geometry is measured, not hand-written.** On startup `calibrateFrameShapes()` draws each
frame's artwork to an offscreen canvas, flood-fills from the border to find the enclosed interior,
and picks the largest square that fits — that becomes the QR rect. Authoring a frame means writing
only the `draw()` function and a viewbox; never hardcode a QR rect, it will be overwritten. This is
why the QR never pokes through a tapered shape like a wine glass.

Shrinking a frame's QR rect costs no resolution: export scales by `size / qr.width`, so the QR still
renders at the requested pixel size and only the surrounding artwork grows.

**Canvas rendering is asynchronous.** `qr-code-styling` draws on the next animation frame, so pixels
are not ready right after `.update()`. Always go through `getQRImage()`, which awaits `getRawData()`.
A generation counter discards stale renders when input changes faster than they complete.

**Fonts must be loaded before drawing.** Frame captions and icons are rasterised onto canvas, so
`ensureFontsReady()` runs before the first paint — otherwise glyphs come out blank.

**Theme never touches output.** The exported QR is byte-identical in light and dark mode.

### Dependencies

All from CDN, all doing real work:

| Library | Why |
| --- | --- |
| `qr-code-styling` | QR encoding and styled rendering |
| `pdf.js` | text extraction from uploaded PDFs |
| `mammoth` | text extraction from uploaded `.docx` |
| Font Awesome | UI icons, and the glyphs rasterised into frame captions |
| Google Fonts | Space Grotesk |

---

## Limitations

These are real constraints, not bugs:

- **A QR code cannot hold a file.** ~2.9KB is the hard ceiling at the lowest error-correction level.
  Oversized content shows a clear error, and Scanly auto-drops the error-correction level to L to
  fit borderline content before giving up.
- **Uploaded files are public.** The File tab sends your file to a third-party host
  (catbox.moe or uguu.se) and anyone who scans the code can download it. This is the only place any
  data leaves your browser, it only happens on an explicit button press, and the UI says so. Don't
  upload anything private. Swap the `FILE_HOSTS` entries for your own storage if you need control.
- **Expiry reminders need the tab open.** They use the Notification API with a timer; a reminder
  that survives closing the tab needs a service worker and a backend.
- **No dynamic QR codes.** Editing a code's destination after printing, and scan analytics, both
  require a server. Scanly has none by design.
- **Legacy `.doc` is not supported** — save as `.docx` or PDF.
- The CSP allows `'unsafe-inline'` for scripts because the app is intentionally a single file.
  Splitting the inline `<script>` into `app.js` would let you tighten that.

## License

MIT — see [LICENSE](LICENSE).
