---
_schema: default
draft: false
title: "Menu"
eleventyExcludeFromCollections: false
eleventyNavigation:
  key: "Menu"
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
**Introduction:** The **Menu** component is designed to present a collection of items, typically food, products, or services, organized by **categories**. It uses a **tabbed navigation** interface, allowing visitors to quickly switch between menu sections without leaving the page. Each menu item can include a **label**, **price**, **description**, and an optional **image**.

**Key Features:**
* **Category-Based Navigation:** Uses clickable category buttons to display relevant menu items, improving user experience on large menus.
* **Flexible Structure:** Supports a main heading and multiple groups, where each group represents a category and contains its list of items.
* **Rich Item Detail:** Each item supports a name (`label`), an optional price (`price`), a descriptive paragraph (`description`), and an image.
* **Styling:** Inherits color schemes (`color_group`) for background, text, borders, and accenting the active category tab.

---

## Best use cases
**Examples of Effective Use:**
* **Restaurant/Cafe Menus:** Perfect for showcasing food and drink items, organizing them into categories like "Appetizers," "Entrees," "Desserts," and "Beverages."
* **Service & Pricing Pages:** Excellent for presenting tiered services or product packages with clear descriptions, prices, and optional visual examples.
* **Course Catalogs/Workshops:** Ideal for listing available educational offerings, categorized by topic, difficulty level, or duration.
* **E-commerce Product Features:** Can be adapted to highlight core features of a main product, using categories for different aspects (e.g., "Tech Specs," "Accessories," "Reviews").

---

## How **NOT** to use this
**Common Missteps:**
* **Using for General Navigation:** This component is for **content presentation**, not for site-wide navigation links. It shouldn't replace a primary header or footer menu.
* **Overloading Categories:** Avoid creating so many categories that the category buttons wrap or become too small on mobile. **Limit categories** to keep the navigation usable and clear.
* **Items Without Descriptions or Prices:** The layout is designed to accommodate multiple pieces of information. Leaving descriptions or prices blank for most items results in a lot of empty visual space and reduces the component's informational value.
* **Inserting an Image for Every Item:** While images are supported, adding a unique image for *every single menu item* is not necessary. Use images judiciously to highlight signature or premium items.

---

## FAQ, pro tips, and troubleshooting

| Area | Detail |
| :--- | :--- |
| **Active Category** | The first category tab is selected by default on page load. |
| **Pro Tip: Prices** | Use the `price` field to include currency symbols or range indicators (e.g., "$12.00" or "from $50"). |
| **Pro Tip: Grouping** | Keep the number of items within each category manageable (e.g., 5-15 items) to prevent excessively long scrolling sections. |
| **Troubleshooting: Styling** | If colors aren't displaying correctly, ensure the `color group` value (e.g., `primary`) is correctly defined in your theme's configuration. |
| **Accessibility** | The category tabs are implemented as `<button>` elements, making them keyboard-focusable and accessible for navigation. |
