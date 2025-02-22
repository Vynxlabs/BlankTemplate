// Set to true for development environment, false for production.
// When true, developers can see all posts
// without having to manually change each post's front matter.
const isDevEnv = false;

function showDraft(data) {
  const isDraft = "draft" in data && data.draft !== false;

  return isDevEnv || !isDraft;
}

module.exports = {
  layout: "./layouts/page.html",
  eleventyComputed: {
    eleventyExcludeFromCollections: function (data) {
      if (showDraft(data)) {
        return data.eleventyExcludeFromCollections;
      } else {
        return true;
      }
    },
    permalink: function (data) {
      var permalinkTrue = false;
      if (showDraft(data)) {
        permalinkTrue = true;
      } else {
        permalinkTrue = false;
      }
      if (typeof data.eleventyNavigation !== "undefined") {
        if (typeof data.eleventyNavigation.url !== "undefined") {
          if (
            data.eleventyNavigation.url !== null &&
            data.eleventyNavigation.url !== ""
          ) {
			console.log("in false")
            permalinkTrue = false;
          }
        }
      }

      if (permalinkTrue) {
        return data.permalink;
      } else {
        return false;
      }
    },
    eleventyNavigation: function (data) {
      if(!showDraft(data)) {
        return false;
      }
      if ("removeFromNavigation" in data && data.removeFromNavigation === true) {
        return false;
      } else {
        return data.eleventyNavigation;
      }
    },
  },
};
