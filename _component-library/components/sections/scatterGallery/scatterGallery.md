---
_schema: default
draft: false
title: "Scattered Images Gallery"
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: "Scattered Images Gallery"
  order: 
  title: 
  parent: "Sections"
  url: 
  icon: 
pageLink: ""
metaDesc: ""
socialImage: ""
customCode:
  headCode: ""
  bodyCode: ""
tags: docs
editorial_blocks: []
---
## Overview
**Introduction**  
**Scattered Images Gallery** displays a set of photos with a playful, “polaroid-on-a-table” feel. Images are automatically scattered or aligned (based on your settings), and can open in a larger **modal** when clicked. Use it to add personality to case studies, events, portfolios, or behind-the-scenes pages.

**Key Features**
- **Scatter styles:** Scattered, Straight, Scattered 3D, or Straight 3D.
- **Clickable images (optional):** Open images in a larger modal.
- **Polaroid look:** Adjustable white border size.
- **Auto-slide (optional):** Automatically cycles through images until the user interacts.
- **Captions (optional):** Show each image’s **Alt Text** as a caption in multiple styles.
- **Brand-aware colors:** Inherits your site’s color theme.

> **Editor note:** In the live editor, the scatter effect may not appear. It **will** work on the published site.

---

## Best use cases
- **Before/after galleries** with personality (e.g., home services, detailing, restorations).  
- **Event highlights** or **team culture** moments.  
- **Travel, food, or product mood boards** where variety is part of the charm.  
- **Portfolio snippets** that feel more casual than a strict grid.

---

## How **NOT** to use this
- **Don’t overload with huge images.** Use appropriately sized images for performance.  
- **Don’t mix long captions with heavy scatter.** If you need a lot of text, consider a standard image grid.  
- **Avoid low-contrast photos without borders.** The border helps each image stand out.  
- **Don’t rely on this for product specs.** Use a structured grid for precise comparisons.

---

## FAQ, pro tips, and troubleshooting

**Why don’t I see the scatter effect while editing?**  
That’s expected; the editor shows a simplified preview. Publish or view the live site to see the scatter.

**How do I make images open bigger?**  
Enable **`imageModal: true`** to open images in a modal when clicked.

**What’s a good border size for the “polaroid” vibe?**  
Try **10–16px**. Set **`borderSize`** to **0** to remove it.

**What does `photoSize` do?**  
It sets a target long-edge size (in pixels) that the script uses to lay out images. Common range: **400–700**.

**What does `arstr` control?**  
It selects the **arrangement style**:
- `"1"` Scattered  
- `"2"` Straight (aligned)  
- `"3"` Scattered 3D (tilt/depth)  
- `"4"` Straight 3D

**How do captions work?**  
Turn on **`showInfo: true`** to show each image’s **Alt Text** as the caption. Choose **`infoStyle`**:
- `"1"` Under the image  
- `"2"` On-image (part of the image)  
- `"3"` Overlay (floating overlay)

**Auto-slide stops after I click. Is that normal?**  
Yes. **Any manual interaction disables auto-slide** (by design).

**Accessibility tips**  
- Write clear **Alt Text** (this doubles as the optional caption).  
- Keep contrast legible if you use on-image/overlay captions.

---

## Ideas
**Suggested Combinations**
- **Scattered Images Gallery + Text Block:** Add context or a short story beneath the gallery.  
- **Scattered Images Gallery + Simple CTA:** Invite viewers to “Book a Quote” after they browse.  
- **Scattered Images Gallery + Review Cards:** Pair visuals with customer testimonials.

---

## Field-by-field guide (what to fill out)

**Content**
- **Section ID (optional):** Lets you link directly to this section (e.g., `#gallery`).
- **Heading (optional):** Title/subtext above the gallery (keep it short).
- **Images (required):** Add each image.  
  - **Image**: Choose the file.  
  - **Alt Text**: Describe the image (used for accessibility and optional captions).
- **Buttons (optional):** One or two actions under the gallery (e.g., “View Portfolio”, “Get a Quote”).

**Styles → color_group**  
Uses your site’s brand color group for background/text.

**Styles → galleryStyling**
- **`imageModal` (true/false):** Open images in a larger modal when clicked.  
- **`photoSize` (number):** Target long-edge size in pixels (e.g., `500`).  
- **`borderSize` (number):** White border size in pixels; **0** removes the border.  
- **`arstr` (choice):** Arrangement style  
  - `"1"` Scattered  
  - `"2"` Straight  
  - `"3"` Scattered 3D  
  - `"4"` Straight 3D  
- **`showInfo` (true/false):** Show the Alt Text as a caption.  
- **`infoStyle` (choice):** Caption placement  
  - `"1"` Under  
  - `"2"` Part of the image  
  - `"3"` Overlay  
- **`autoSlide` (true/false):** Automatically cycle through images until the user interacts.  
- **`duration` (number):** Seconds per slide (e.g., `2`, `3`, `5`).

---

## Quick-start presets

**Polaroid wall (playful)**  
- `arstr: "1"` (Scattered)  
- `borderSize: 12–16`  
- `showInfo: false`  
- `imageModal: true`

**Minimal showcase (neat)**  
- `arstr: "2"` (Straight)  
- `borderSize: 0–6`  
- `showInfo: true`, `infoStyle: "1"` (Under)  
- `imageModal: true`

**Immersive slideshow**  
- `arstr: "3"` (Scattered 3D)  
- `autoSlide: true`, `duration: 3–5`  
- `imageModal: true`

---

## Performance tips
- Upload **appropriately sized images** (no need for multi-MB files).  
- Use **Alt Text** for accessibility and better captions.  
- Keep the total number of images reasonable for page speed.

