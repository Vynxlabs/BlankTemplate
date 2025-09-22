---
draft: true
title: ""
eleventyExcludeFromCollections: false
disableNav: false
disableSitemap: false
removeFromNavigation: false
eleventyNavigation:
  key: page
  order: 1
  title:
  parent:
  url:
pageLink: 
permalink: >-
  {% capture varPagePath %}{% if pageLink%}{% assign pageLink = pageLink | slugify%}{{  page.filePathStem |fileSubstringFilter | append: pageLink }}{% else %}{% assign title = title | slugify%}{{  page.filePathStem |fileSubstringFilter | append: title }}{% endif %}{% endcapture %}{% if pagination.pageNumber > 0 %}/{{varPagePath | strip}}{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}{% else %}/{{varPagePath | strip}}{% endif %}/index.html
metaDesc: ""
customCode:
  headCode: ""
  bodyCode: ""
addToCollections: false
tags:
collectionImage:
imageAltText:
keyInformation:
layout: "layouts/page.html"
hero:
content_blocks: []
_inputs:
  removeFromNavigation:
    hidden: true
  eleventyNavigation:
    hidden: true
  headCode:
    type: "code"
    comment: "Add code at the end of the <head> tag"
  bodyCode:
    type: "code"
    comment: "Add code before the </body> tag"
  addToCollections:
    type: switch
    comment: "Enabling this allows this page to be added to collections of your choosing"
  tags:
    hidden: "!addToCollections"
    type: multiselect
    options:
      values: data.pageCollections.tags[*]
  collectionImage:
    hidden: "!addToCollections"
  imageAltText:
    hidden: "!addToCollections"
  keyInformation:
    hidden: "!addToCollections"
    label: Key information
    comment: "Short description or summary for this page. Will be shown on the collection cards"
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
