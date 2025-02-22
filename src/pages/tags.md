---
title: 'Tag Archive'
layout: 'layouts/feed.html'
pagination:
  data: collections
  size: 1
  alias: tag
  filter: ['blog', 'work', 'featuredWork', 'people', 'rss']
paginationNextText: Next Tag
paginationPrevText: Previous Tag
permalink: '/tag/{{ tag | slug }}/'
eleventyExcludeFromCollections: true
---