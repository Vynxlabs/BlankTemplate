module.exports = function (Liquid) {
  this.registerFilter(
    "happeningsFilter",
    (collection, item, happeningsConfig, tags = [], limit = 3) => {
      let filteredItems = collection.filter((x) => x.data.draft === false);
      filteredItems = filteredItems.filter((x) => x.url !== item.url);
      filteredItems = filteredItems.filter((x) => {
        return (
          x.url.includes("happenings/") ||
          (x.data.happeningDate !== null &&
            (x.data.happening === null || x.data.happening === true) &&
            (happeningsConfig.tags === null ||
              happeningsConfig.tags.some(
                (tag) => x.data.tags && x.data.tags.includes(tag),
              )))
        );
      });
      const today = new Date();
      filteredItems = filteredItems.filter((x) => {
        const happeningDate = new Date(x.data.happeningDate);
        return happeningDate >= today;
      });

      if (tags !== null && tags.length > 0) {
        if (happeningsConfig.tags === null) {
          filteredItems = filteredItems.filter(
            (x) => x.data.tags && x.data.tags.some((tag) => tags.includes(tag)),
          );
        } else {
          tags = tags.filter((tag) => happeningsConfig.tags.includes(tag));
          if (tags.length > 0) {
            filteredItems = filteredItems.filter(
              (x) =>
                x.data.tags && x.data.tags.some((tag) => tags.includes(tag)),
            );
          }
        }
      }

      filteredItems.sort((a, b) => {
        const dateA = new Date(a.data.happeningDate);
        const dateB = new Date(b.data.happeningDate);
        return dateA - dateB;
      });

      if (limit > 0) {
        filteredItems = filteredItems.slice(0, limit);
      }

      return filteredItems;
    },
  );
};
