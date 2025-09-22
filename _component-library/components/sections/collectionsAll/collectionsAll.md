---
title: Collections
layout: layouts/page.html
eleventyNavigation:
  key: Collections
  order: 0
tags: Sections
draft: false
_schema: default
---
## Overview
**Introduction:**  
The Collections section dynamically displays a grid or list of pages that share common tags. It's a flexible content aggregation tool that automatically surfaces relevant content based on a specified set of tags.

Simple explanation: This section will retrieve pages based on the tags that you want.

**Key Features:**  
- Automatically filters and displays pages with matching tags  
- Multiple card display styles available (e.g., default, member, vertical)  
- Optionally includes a heading section and fallback text when no results are found  
- Supports image fallback logic for missing collection images
	- If a page retrieved doesn't have an image set, the default will be used. Refer to the "Page Collections" data file for more information

## Best use cases
**Examples of Effective Use:**  
- **Category pages:** Group related pages such as team member bios, service areas, portfolio, etc
- **Landing pages:** Group special pages to highlight such as case studies. 
- **Anything you want to group and manage easily:** This section can pull up any collection (grouping) of pages that you want. Don't let the examples above limit the uses for your business.

## How **NOT** to use this
**Common Missteps:**  
- **Mismatched or missing tags:** If you select a tag, but no pages show up, it means that you forgot to add the tag to the page.   
- **Using incorrect card style for content type:** For example, using a "member" style for listings without people or profiles can confuse users. Explore the card  styles to see which works best for your collection of pages. 
- **Relying on it for manual sorting:** This section is driven by tags and not intended for manual sorting or custom ordering.

## FAQ, pro tips, and troubleshooting

**Q: Why are my pages not showing up?**  
Make sure each page you want included has at least one tag that matches the tags set in the section settings.

**Q: What image is shown if a page doesn’t have a `collectionImage`?**  
A default image is used. You can change the default image in the "Page Collections" data file.

**Q: Can I use multiple Collection sections on one page?**  
Yes. You can configure each one with different tag filters and card styles.