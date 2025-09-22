module.exports = function (Liquid) {
  this.registerFilter(
    "listingsFilter",
    (collection, item, listingTags, tags = [], limit = 50) => {
      let filteredItems = collection.filter((x) => x.data.draft === false);
      filteredItems = filteredItems.filter((x) => x.url !== item.url);

      if (tags !== null && tags.length > 0) {
        if (listingTags === null) {
          filteredItems = filteredItems.filter(
            (x) => x.data.tags && x.data.tags.some((tag) => tags.includes(tag)),
          );
        } else {
          tags = tags.filter((tag) => listingTags.includes(tag));
          if (tags.length > 0) {
            filteredItems = filteredItems.filter(
              (x) =>
                x.data.tags && x.data.tags.some((tag) => tags.includes(tag)),
            );
          }
        }
      }

      if (limit === null || limit <= 0) {
        limit = 50;
      }

      if (limit > 0) {
        filteredItems = filteredItems.slice(0, limit);
      }

      return filteredItems.sort((a, b) => {
    a.data.title.localeCompare(b.data.title);
  });
    },
  );
};
