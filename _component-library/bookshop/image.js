// This filter doesn't actually do anything but is needed so that the site will successfully build (otherwise if the image component is included in the page liquid cannot register the image filter and there will be no output in bookshop)
module.exports = function (Liquid) {
  class ImageTag {
    parse(tagToken) {
      // Store the arguments passed to the tag
      this.args = tagToken.args;
    }

    async render(ctx) {
      // Here, you would implement the logic to render the tag's content
      // For this example, we simply return a placeholder
      return true;
    }
  }
    this.registerTag('image', ImageTag);
}