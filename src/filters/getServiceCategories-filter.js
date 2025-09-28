const slugify = require('slugify');

module.exports = (collection) => {
    if (!collection || !collection[Symbol.iterator]) {
      return [];
    }
    const CATEGORIES = new Map();
    for (const item of collection) {
      if (item.data.draft) continue;
      const slug = slugify(item.data.category ? item.data.category : 'Services', { lower: true });
      if (!CATEGORIES.has(slug)) {
        CATEGORIES.set(slug, item.data.category ? item.data.category : 'Services');
      }
    }
    return Array.from(CATEGORIES.values());
  };
  