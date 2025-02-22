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
layout: "layouts/page.html"
hero:
content_blocks: []
_inputs:
  eleventyNavigation:
    hidden: 'removeFromNavigation'
  headCode:
    type: "code"
    comment: "Add code at the end of the <head> tag"
  bodyCode:
    type: "code"
    comment: "Add code before the </body> tag"
---
