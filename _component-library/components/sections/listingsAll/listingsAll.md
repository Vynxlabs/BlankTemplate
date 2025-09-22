---
title: Listings Section
layout: layouts/page.html
eleventyNavigation:
  key: Listings
  order: 24
tags: Sections
draft: false
_schema: default
---

## Overview
**Introduction:** The Listings Section is designed to display a collection of items, posts, or listings with various filtering and display options. This component allows you to manage and showcase content dynamically, including filtering by tags, expiration, and availability.

**Key Features:**
- Supports various listing styles (grid or list format).
- Dynamically filters items based on tags, availability, or expiration status.
- Ability to display items with images, key information, tags, and more.
- Customizable layout and styling options.
- Works seamlessly with pagination for large datasets.
- Alternative heading will be shown if no listings are found

## Best use cases
**Examples of Effective Use:** 
- Displaying items for sale that require a conversation, like real estate, vehicles, large sheds, ponies, etc.
- Showcasing portfolios or case studies with tags for categorization.
- Job post listings with filtering by location, experience level, and more.

## How **NOT** to use this
**Common Missteps:** 
- Using expired items without proper filtering, which can cause outdated content to be displayed.
- Displaying disqualified items without setting the `showDisqualified` flag to `true`.
- Improperly configuring tags, resulting in incorrect filtering behavior.

## FAQ, pro tips, and troubleshooting
- **Why aren't my listings displaying?**
  - Ensure the tags match your filtering criteria.
  - Confirm that items are not expired or disqualified without the relevant settings enabled.
  - Check that the `listingCount` parameter is correctly configured if using pagination.

- **How can I customize the look of my listings?**
  - Adjust the `Listing Card Style`in the styles tab. 

- **Can I use pagination with Listings?**
  - Yes, the Listings Section supports pagination, but ONLY on a page with a "page location" of "listings".

- **What if I only want to show certain listings?**
  - Use the `tags` parameter to filter your content based on specific tags.
  - Consider items into their own separate folders for better organization.
