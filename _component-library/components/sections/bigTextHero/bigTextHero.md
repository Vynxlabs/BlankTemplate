---
_schema: default
draft: false
title: "Big Text Hero"
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: "Big Text Hero"
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
**Introduction:**  
**Big Text Hero** is a bold, full-width header section designed to grab attention with an oversized headline, short supporting text, and optional buttons. You can place it over a background image/video or use a solid color background. It’s ideal for homepages, landing pages, or any page that needs a strong, simple opener.

**Key Features:**  
- **Oversized, responsive headline** with optional description, and buttons.  
- **Media background (image or video)** with an adjustable dark overlay for readability.  
- **Flexible vertical alignment** (Top / Middle / Bottom) for perfect composition.  
- **Brand-aware colors** via your site’s color group settings.  
- **Optional anchor (Section ID)** so you can link directly to this hero.

---

## Best use cases
**Examples of Effective Use:**  
- **Homepage hero:** Big promise + 1–2 buttons (e.g., “Get a Quote”, “See Services”).  
- **Campaign/offer pages:** Short headline over a themed photo/video background.  
- **Event or announcement:** Minimal text with a strong call-to-action.  
- **Service category intro:** Establishes tone before more detailed sections.

---

## How **NOT** to use this
**Common Missteps:**  
- **Too much text.** Keep it short—one headline, one brief line, and 1–2 buttons.  
- **Busy backgrounds with no overlay.** If the text feels hard to read, increase the **Background Opacity** (overlay) or switch to a solid background.  
- **Low-contrast color choices.** Don’t pick text colors that blend into the background image.  
- **Stacking too many buttons.** Two is usually enough; three+ can look cluttered.

---

## FAQ, pro tips, and troubleshooting

**My big heading isn't using the headings font.**
When you are typing out your headline, make sure you change the format from `normal` to a `heading`. Because this is the hero, you should use `Heading 1`

**Adjusting heading size with line breaks**
The size of the text placed in the headline also depends on how much text there is on a single line. For example `My very cool busienss` will be small than if you split it into two lines: `My very` and `cool busienss`. Placeing a single word on a new line will make that word VERY large. Only do this to emphasize key words.

**How do I add a background image or video?**  
In **Media**, pick an image or video. The hero will automatically become full-screen height. If you leave Media empty, the hero uses a solid background color.

**My text is hard to read over the image—what should I change?**  
Increase **Background Opacity** (this darkens the image behind the text). You can also change **Color From Group** to **White** or **Text** for higher contrast.

**What does “Color From Group” do?**  
It sets the text color using your brand palette (e.g., **White**, **Text**, **Background**, **Primary**, **Secondary**, **Accent**).  
- **White** is a safe choice over darkened images.  
- **Text** works best on solid light backgrounds.  
- **Diff (Difference)** creates an inverted look on busy images—use sparingly and test for legibility.

**How do I control where the text sits vertically?**  
Use **Vertical Alignment**: **Top**, **Middle**, or **Bottom** to position the content within the hero.

**Where do I put the headline and buttons?**  
Open **Heading** and fill in Headline (required), Description (optional), and Buttons (0–2 recommended).

**Can I link directly to this hero?**  
Yes. Set a **Section ID** (like `start`) and link to `#start`.

**The headline feels too big/small.**  
In **Heading → Styles**, adjust **Max Font Size** (if available for your theme) to fine-tune the largest text size.

**Accessibility tips:**  
Aim for a contrast ratio that’s easy to read. Use simple, descriptive button text (e.g., “Book a Call”, not “Click Here”).

---

## Ideas
**Suggested Combinations:**  
- **Big Text Hero + Simple Form Section:** Strong opener + immediate lead capture.  
- **Big Text Hero + Services Section:** High-level promise, then feature/services cards.  
- **Big Text Hero + Image Carousel:** Visual proof right after the promise.  
- **Big Text Hero + Action Bar:** Keep a persistent “Get a Quote” button visible while scrolling.

---

### Field-by-field guide

**Content**  
- **Section ID (optional):** Creates a jump link to this hero.  
- **Heading:**  
  - *Headline (recommended)* – your main promise in 5–10 words.  
  - *Description (optional)* – More information relating to the headline. This will be in normal text size.  
  - *Buttons (optional)* – 1–2 primary actions.

- **Media (optional):** Choose an image or video background. If empty, a solid color background is used.

**Styles**  
- **Color Group:** Chooses the brand palette this section uses.  
- **Color From Group:** Sets the text color from that palette (White, Diff, Text, Background, Primary, Secondary, Accent).  
- **Background Opacity:** 0–100% overlay to improve legibility over images/video (start around 40–60%).  
- **Vertical Alignment:** Top / Middle / Bottom.

**Pro setup recipe (fast):**  
1) Add **Media** (image). 
2) Set **Background Opacity** to **50–60%**.  
3) Set **Color From Group** to **White**. 
4) Add **Headline** + 1 button.  
5) Choose **Vertical Alignment: Middle**. 
6) Preview on mobile.
