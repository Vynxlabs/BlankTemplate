---
draft: true
eleventyExcludeFromCollections: false
disableNav: false
disableSitemap: false
title: 
metaDesc: 
customCode:
  headCode: ""
  bodyCode: ""
date:
happening: false
cancelled: false
happeningDate:
summary:
author:
tags: 
blogImage: 
imageAltText: 
image: >-
    {% if blogImage %}{{blogImage}}{% else %}{{blog.defaultImage}}{% endif %}
permalink: >-
    /blog/{% assign title = title | slugify %}{{ page.filePathStem | fileSubstringFilter | append: title | downcase }}/index.html
socialImage: >- 
    {{ image }}
_inputs:
  headCode:
    type: "code"
    comment: "Add code at the end of the <head> tag"
  bodyCode:
    type: "code"
    comment: "Add code before the </body> tag"
---
## Once upon a time...
There was a...