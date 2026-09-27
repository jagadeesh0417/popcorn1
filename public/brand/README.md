# Blue Dino brand assets — drop-in slots

Place the supplied artwork in this folder using **exactly** these filenames.
Nothing here is generated; the app detects each file at build time.

| File | Used for |
| --- | --- |
| `blue-dino-logo-header.png` | Header / navbar logo (light background) |
| `blue-dino-logo-footer.png` | Footer + admin sidebar logo (on blue background) |
| `blue-dino-favicon.png` | Browser tab, mobile home screen, PWA icon |
| `blue-dino-apple-touch-icon.png` | iOS home screen icon (180×180 recommended) |
| `blue-dino-og-image.png` | Open Graph / Twitter share image (1200×630 recommended) |

Notes

- Export the logos as **transparent PNG**. Use the header variant for the
  header and the footer variant (light/white artwork) for the footer and admin
  sidebar. Both are rendered with a fixed height and intrinsic width, so any
  aspect ratio scales without distortion on desktop, tablet and mobile.
- Favicon: 32×32 or 48×48 PNG. Apple touch icon: 180×180 PNG.
- After adding files, rebuild: `npm run build` (existence is resolved at build
  time). Until then the site renders a typographic "Blue Dino" wordmark and
  omits icon tags rather than pointing at missing files.
- Until the files above exist, the site renders a typographic "Blue Dino"
  wordmark in the header/footer/admin sidebar and emits no icon tags.
- Remote/CDN overrides (`https://…`) are accepted as-is; local overrides are
  only used when the file actually exists under `public/`.
- The previous brand's logo files (`public/logo.png`, `public/logonavbar.png`,
  `public/logo.pdf`, `public/navbar.pdf`) and `public/banner.jpeg` were removed
  during the rebrand and nothing references them.
- Still to replace: `public/insta-1.png`, `public/insta-2.png`,
  `public/insta-3.png` are the old account's Instagram screenshots and are
  still shown by the homepage gallery until new post images are supplied.
