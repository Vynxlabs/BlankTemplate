---
title: Action Bar
layout: layouts/page.html
eleventyNavigation:
  key: Action Bar
  order: 2
tags: Sections
draft: false
_schema: default
---

## Overview
**Introduction:**  
The Action Bar is a versatile call-to-action component that remains fixed at the bottom of the viewport, providing users with easy access to important actions or links. It serves as a constant prompt, encouraging visitors to engage with a desired action such as submitting a form, viewing additional content, or navigating to a specific page.

**Key Features:**  
- **Persistent Visibility:** Stays fixed at the bottom of the screen for continuous accessibility.
- **Flexible Button Types:** Supports standard linking buttons or modal-triggering buttons.
- **Modal Integration:** Can be configured to open various modals (pop ups) including forms, images, or embeds.
- **Stylable Appearance:** Customizable colors, shapes, and button arrangements.

## Best use cases
**Examples of Effective Use:**  
- Serving as a sticky call-to-action to capture leads or promote key pages.
- Displaying important offers, promotions, or alerts persistently.
- Triggering modals to collect user input via forms or display additional information without navigating away from the page.

## How **NOT** to use this
**Common Missteps:**  
- **Improper Placement:** The Action Bar should be the last section on a page for proper functionality. Placing other sections after it may cause it to lose its sticky positioning or interfere with its intended behavior.
- **Overusing Modal Buttons:** Excessive use of modals can overwhelm or confuse users. Ensure modal use is purposeful and relevant.
- **Clashing Styles:** Ensure the Action Bar’s styling is consistent with your website’s design system to maintain a cohesive user experience.

## FAQ, pro tips, and troubleshooting
- **Why is my Action Bar not sticking to the bottom?**  
  Make sure it is the last section added to the page. 

- **Can I mix normal linking buttons with modal buttons?**  
  Yes! The Action Bar supports a combination of normal linking buttons and modal buttons, allowing for diverse interaction options.

- **What if my modal doesn’t open when the button is clicked?**
  For normal buttons, make sure that you have set up a url for the button. For modal buttons, make sure the modal has been given a resource to open.

