---
_schema: default
draft: false
title: "Editorial Content "
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: "Editorial Content"
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
**Editorial Content** lets you build rich, article-style pages using a mix of small content blocks—things like paragraphs, callouts, accordions, tabs, task lists, code/diagrams, and more. Think “mini editor” blocks you can stack, reorder, and nest to create guides, docs, policies, or long-form posts.

**Key Features:**  
- **Mix & match blocks:** Add any editorial block (Text, Call Out, Accordion, Tabs, Task List, Mermaid diagram, File Tree) in any order.  
- **Nesting:** Some blocks (like Accordions and Tabs) can contain other editorial blocks inside.  
- **Optional page heading:** Add a section heading at the top if you want a title/intro.  
- **Color theme aware:** Uses your site’s color group so the content matches your brand.  
- **Anchor support:** Set a “Section ID” to create a linkable anchor on the page.

---

## Best use cases
**Examples of Effective Use:**  
- **Documentation & how-to guides** (step-by-step, with callouts and code/diagrams).  
- **FAQs** (use Accordions; split topics with Tabs if needed).  
- **Policies & terms** (long-form text with occasional callouts for “Important” or “Warning”).  
- **Release notes / changelogs** (dates as headings, bullet lists, and collapsible detail).  
- **Product/service pages with depth** (sections of text, feature callouts, comparison tabs).

---

## How **NOT** to use this
**Common Missteps:**  
- **As a single big wall of text.** Break it up with headings, lists, or blocks.  
- **Too many block types at once.** Pick 2–3 patterns to keep it scannable.  
- **Deep nesting overload.** Nest only when it improves clarity (e.g., tabs → text + callout).  
- **Interactive expectations.** Task list checkboxes are for display; they aren’t clickable.  
- **Pasting scripts.** Add maps/forms/videos with the **Custom Embed** block.

---

## FAQ, pro tips, and troubleshooting

**How do I start?**  
Add the **Editorial Content** section. In the **Editorials** list, click **Add** and choose a block (Text, Call Out, Accordion, Tabs, Task List, Mermaid, File Tree). Reorder by dragging.

**Can I nest content?**  
Yes. **Accordion** items and **Tabs** accept editorial blocks inside each item/tab. Add Text, Call Outs, etc. inside them.

**What does each block do?**  
- **Text Block:** Write normal text with basic formatting (headings, bold, lists, links).  
- **Call Out:** Highlight info with a style: **Information**, **Warning**, or **Error**.  
- **Accordion:** Collapsible Q&A or detail. Optionally set some to start **open**.  
- **Tabs:** Organize related content into tabbed sections. Give each tab a short title.  
- **Task List:** Show a checklist; **checked** items appear checked but are not interactive.  
- **Mermaid Graph:** Paste Mermaid diagram code (flowcharts, sequence diagrams).  
- **File Tree:** Paste file-tree code; it renders as a tree view.
- **Custom Embed:** Embed videos, maps, forms, and more.

**Where do I add a title/intro for the section?**  
Use the optional **Heading** at the top of the section for an eyebrow/headline/description and buttons.

**Can I link directly to this section?**  
Yes. Set **Section ID** (for example, `faq`), then link to `#faq`.

**My diagram isn’t rendering.**  
Check your Mermaid code syntax. Try a simple example first. If it still fails, remove extra indentation or special characters added by copy/paste.

**Tabs aren’t switching.**  
Ensure each tab has a **Title** and at least one editorial block inside.

**Accordion won’t open/close as expected.**  
Confirm each item has a **Title** and content.

**Text formatting looks off.**  
Use headings (H2/H3), short paragraphs, and lists. Avoid pasting from Word/Docs with odd styling; paste as plain text, then format.

**Color contrast is low.**  
If your page background and text look too close in color, switch the section’s **Color Group** or adjust site theme colors.

**Performance tip:**  
Lots of nested tabs/accordions on a single page can feel heavy. Split into multiple sections/pages if it gets long.

---

## Ideas
**Suggested Combinations:**  
- **Editorial Content + Simple Hero:** Set the context up top, then dive into the details.  
- **Editorial Content + Simple Form:** End long docs with a “Still need help?” contact form.  
- **Editorial Content + Image Gallery/Carousel:** Use visuals for steps, portfolios, or examples.  
- **Editorial Content + Action Bar:** Keep a “Book a Call” or “Get a Quote” button visible as readers scroll.  
- **Editorial Content + Large Embed:** For videos, maps, or custom embeds you want full-width.

---

## Related components
**Sections**  
- **Large Embed:** Add videos or custom embeds cleanly (YouTube/Vimeo, map, calendar).  
- **Simple Form Section:** Collect questions/requests after your doc or guide.  
- **Image Gallery / Carousel:** Show examples alongside instructions.  
- **Action Bar:** Persistent bottom CTA while reading long pages.

**Elements used inside Editorial Content**  
- **Text Block** – basic rich text.  
- **Call Out** – Information / Warning / Error highlight.  
- **Accordion** – collapsible groups.  
- **Tabs** – switchable content areas.  
- **Task List** – static checkboxes for checklists.  
- **Mermaid Graph** – diagrams via Mermaid syntax.  
- **File Tree** – render a folder/file structure.
- **Custom Embed** – embed videos, maps, forms, and more.

---

### Quick setup checklist
1. Add **Editorial Content** to your page.  
2. (Optional) Add a **Heading** with a headline and short description.  
3. Add your first **Text Block** and write a few sentences.  
4. Add a **Call Out** for key info (pick Information/Warning/Error).  
5. Add an **Accordion** for FAQs or details, or **Tabs** to compare options.  
6. (Optional) Add a **Mermaid Graph** or **File Tree** if you need those visuals.  
7. Give the section a **Section ID** if you want direct links.  
8. Review on mobile and desktop; trim or split if it’s getting too long.
