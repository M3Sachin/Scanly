<div align="center">

# ▦ &nbsp;Scanly

### Free QR codes with frames that actually look like something.

No sign-up. No watermark. No limits. No backend.

<img src="docs/frames.png" alt="Illustrated QR frames: coffee cup, beer mug, delivery scooter, spa flower, graduation cap, t-shirt" width="100%">

<br>

[![License: MIT](https://img.shields.io/badge/License-MIT-C9451B.svg?style=flat-square)](LICENSE)
[![No backend](https://img.shields.io/badge/backend-none-2A9D8F?style=flat-square)](#-how-it-works)
[![Static site](https://img.shields.io/badge/build-not%20required-457B9D?style=flat-square)](#-run-it)
[![Frames](https://img.shields.io/badge/frames-59-FF5C39?style=flat-square)](#-frames)
[![Types](https://img.shields.io/badge/QR%20types-23-6A4C93?style=flat-square)](#-content-types)

[**Deploy to Vercel**](https://vercel.com/new) · [Run locally](#-run-it) · [How it works](#-how-it-works) · [Limitations](#-limitations)

</div>

---

Most free QR generators give you a black square and a watermark. Scanly puts the code **inside real
artwork** — a beer mug, a coffee cup, a delivery scooter — and hands you the PNG or SVG with nothing
attached.

Everything runs in your browser. There is no server storing your codes, no account, and nothing to pay.

## ✨ Highlights

|  |  |
| :-- | :-- |
| 🎨 **59 illustrated frames** | The QR sits *inside* drawn artwork, not next to it. 57 one-click themed presets, each with its own shape, icon, caption and colour. |
| ⚡ **Live preview** | Type and watch it render. No "generate" button. |
| 🌗 **Warm light + dark** | A real cream-and-terracotta palette, not an inverted dark theme. Follows your OS. |
| 📄 **Document import** | Drop a `.txt`, `.md`, `.pdf` or `.docx` — the text is extracted in-browser and encoded. |
| 📦 **Big file support** | A QR can't hold a PDF, so Scanly uploads it (up to 100MB) and encodes the link, with a lifetime you pick. |
| 🚫 **Zero tracking** | No analytics, no cookies, no account. |

## 🖼 Frames

Pick a preset and the shape, icon, caption and colour are set for you — then edit any of it.

| Category | Presets |
| :-- | :-- |
| **Food & drink** | Coffee · Café Menu · Beer · Wine · Pizza · Burger · Restaurant · Bakery · Ice Cream · Cake · Hot Dog · Cocktail · Food Bowl |
| **Retail** | Shopping · Cart · Sale · Discount · Gift · Gifts · Jewelry · Fashion · Coupon |
| **Delivery & travel** | Delivery · Fast Delivery · Takeout · Hotel · Travel · Flight · Beach · Ticket · Party |
| **Media & social** | Music · Video · Camera · Review · Follow · Favorite |
| **Business** | Contact · Services · Website · Booking · Directions · Real Estate |
| **Health & lifestyle** | Fitness · Spa · Salon · Medical · Pet · Eco |
| **Other** | Education · Reading · Art · Congrats · Find Us · WiFi · Feedback · Classic |

Prefer to build your own? There are plain **Border**, **Top/Bottom banner**, **Ribbon**, **Badge**,
**Tag** and **Speech bubble** shapes too.

## 🔤 Content types

**Static** — encoded directly in the code, works forever, works offline:

`URL` `Text` `Email` `Phone` `WiFi` `vCard` `SMS` `WhatsApp` `Calendar Event` `Geo Location`

**File** — uploads and encodes the download link:

`File upload`

**Link presets** — the URL type with fitting copy and icons:

`PDF` `Video` `MP3` `Playlist` `Apps` `Business` `Product` `Menu` `Landing page` `Coupon` `List of links` `Social` `Images`

## 🎛 Styling

| Control | Options |
| :-- | :-- |
| Colours | Foreground, background, corner colour, linear gradient with rotation |
| Dots | Square · Dots · Rounded · Extra rounded · Classy · Classy rounded |
| Corners | Square · Dot · Rounded |
| Logo | Upload any image into the centre |
| Error correction | L / M / Q / H, with a live capacity meter |
| Export | PNG or SVG at 256 / 512 / 1024 px |

## 🚀 Run it

It is a static site. No build step, no install:

```bash
open index.html
```

`styles.css` is committed, so the page works straight from disk.

## ▲ Deploy

```bash
npx vercel --prod
```

No build command and no output directory to configure — Vercel serves the repo root as static files.
[`vercel.json`](vercel.json) ships a Content-Security-Policy plus the usual hardening headers.

<details>
<summary><b>Editing the CSS</b></summary>

<br>

Tailwind is **pre-built**, not loaded from the CDN — the CDN build ships ~120KB of JavaScript that
generates CSS at runtime and warns against production use. The committed `styles.css` is **10KB**.

If you add or change a Tailwind utility class in `index.html`, regenerate it:

```bash
npm install
npm run css        # or: npm run css:watch
```

There is deliberately no `build` script, so Vercel skips the build step and deploys are instant.

</details>

## 🔍 How it works

One file, [`index.html`](index.html), holding the markup, theme tokens and app logic.

<details>
<summary><b>Frame geometry is measured, not hand-written</b></summary>

<br>

On startup, `calibrateFrameShapes()` draws each frame's artwork to an offscreen canvas, flood-fills
from the border to find the enclosed interior, and picks the **largest square that fits**. That
becomes the QR rect.

Authoring a frame means writing only a `draw()` function and a viewbox — never hardcode a QR rect,
it will be overwritten. This is why the code never pokes through a tapered shape like a wine glass,
and why open shapes (a burger's two buns) still find the gap between them.

Shrinking a frame's QR rect costs no resolution: export scales by `size / qr.width`, so the QR still
renders at the requested pixel size and only the surrounding artwork grows.

</details>

<details>
<summary><b>Canvas rendering is asynchronous</b></summary>

<br>

`qr-code-styling` draws on the next animation frame, so pixels are **not** ready right after
`.update()`. Always go through `getQRImage()`, which awaits `getRawData()`. A generation counter
discards stale renders when input changes faster than they complete.

Frame captions and icons are rasterised onto canvas, so `ensureFontsReady()` runs before the first
paint — otherwise glyphs come out blank.

</details>

<details>
<summary><b>Theme never touches output</b></summary>

<br>

Light and dark share one set of CSS custom properties, consumed by both the hand-written rules and
the Tailwind utilities so the two can't drift. The exported QR is **byte-identical** in either theme.

</details>

<details>
<summary><b>Dependencies</b></summary>

<br>

| Library | Why |
| :-- | :-- |
| [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) | QR encoding and styled rendering |
| [`pdf.js`](https://mozilla.github.io/pdf.js/) | text extraction from uploaded PDFs |
| [`mammoth`](https://github.com/mwilliamson/mammoth.js) | text extraction from uploaded `.docx` |
| Font Awesome | UI icons, and the glyphs rasterised into frame captions |
| Google Fonts | Space Grotesk |

</details>

## ⚠️ Limitations

These are real constraints, not bugs:

- **A QR code cannot hold a file.** ~2.9KB is the hard ceiling at the lowest error-correction level
  (ISO/IEC 18004). Oversized content shows a clear error, and Scanly first drops the error-correction
  level to `L` to fit borderline content before giving up.
- **Uploaded files are public.** The File tab sends your file to a third-party host
  ([tmpfiles.org](https://tmpfiles.org) for ~1 hour, or [gofile.io](https://gofile.io) for no fixed
  expiry) and anyone who scans the code can download it. This is the **only** place any data leaves
  your browser, it happens only on an explicit button press, and the UI says so. Don't upload
  anything private — swap the `FILE_HOSTS` entries for your own storage if you need control.
- **A replacement host must send CORS headers.** Browsers block reading a cross-origin response
  without `Access-Control-Allow-Origin`, so an otherwise fine host will fail with a network error
  from any real origin. Verify with:
  `curl -sD- -o/dev/null -X POST <url> -H 'Origin: https://you.vercel.app' -F file=@x.txt | grep -i access-control`
- **Expiry reminders need the tab open.** They use the Notification API with a timer; a reminder that
  survives closing the tab needs a service worker and a backend.
- **No dynamic QR codes.** Editing a code's destination after printing, and scan analytics, both
  require a server. Scanly has none by design.
- **Legacy `.doc` is unsupported** — save as `.docx` or PDF.
- The CSP allows `'unsafe-inline'` for scripts because the app is intentionally a single file.
  Splitting the inline `<script>` into `app.js` would let you tighten that.

## 📄 License

[MIT](LICENSE) — do what you like with it.

<div align="center">
<br>
Made with ❤️ by <a href="https://portfolio-m3sachin.vercel.app">Sachin</a>
</div>
