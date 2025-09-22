---
id:
draft: true
eleventyExcludeFromCollections: false
disableNav: false
disableSitemap: false
title:
metaDesc:
customCode:
  headCode: ""
  bodyCode: ""
pageLink:
tags:
canExpire: false
expireDate:
permalink: >-
  /listings/{% assign id = id | uuidHashFilter%}{% capture varPagePath %}{% if pageLink%}{% assign pageLink = pageLink | slugify%}{{  page.filePathStem |fileSubstringFilter | append: pageLink | append: "-" | append: id  }}{% else %}{{  page.filePathStem |fileSubstringFilter | append: id }}{% endif %}{% endcapture %}/{{varPagePath | strip}}/index.html
layout: "layouts/listing.html"
listingImage:
imageAltText:
keyInformation:
hero:
content_blocks:
  - _bookshop_name: generic/tags
  - _bookshop_name: sections/imageCarousel
  - _bookshop_name: sections/informationCards
  - _bookshop_name: sections/simpleTextBlock
  - _bookshop_name: sections/actionBar
_inputs:
  headCode:
    type: "code"
    comment: "Add code at the end of the <head> tag"
  bodyCode:
    type: "code"
    comment: "Add code before the </body> tag"
  tags:
    type: multiselect
    options:
      values: data.listingTags
  expireDate:
    hidden: "!canExpire"
    comment: "The date the listing will expire. Time must be entered in UTC time."
    type: datetime
  keyInformation:
    label: Key information
    comment: "Short description of the listing. Will be shown on the listing cards. Should be a few sentences long"
    type: markdown
    options:
      link: true
      blockquote: false
      bold: true
      italic: true
      strike: true
      subscript: true
      superscript: true
      underline: true
      bulletedlist: true
      numberedlist: true
      indent: false
      outdent: false
      code: false
      embed: false
      horizontalrule: false
      image: false
      table: false
      undo: true
      redo: true
      removeformat: true
      copyformatting: true
---
