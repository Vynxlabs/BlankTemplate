const Image = require("@11ty/eleventy-img");
const { Liquid } = require("liquidjs");
const path = require("path");
const bookshopRenderer = require("@bookshop/eleventy-bookshop/lib/eleventy-one-bookshop");
const svgContents = require("eleventy-plugin-svg-contents");
const GetSVGContents = require("eleventy-plugin-svg-contents/src/getSvgContents");
const { v4: uuidv4 } = require('uuid');

const fs = require("fs");

// Define the image shortcode as a LiquidJS tag handler
const imageTagHandler = (liquidEngine) => {
  return {
    parse: function (tagToken, remainingTokens) {
      // Split the arguments based on spaces
      this.args = tagToken.args.split(",").map(arg => arg.trim());
    },
    render: async function (ctx) {
      // Evaluate each argument within the context
      const [src, alt, cls = "", sizes = "100vw"] = await Promise.all(
        this.args.map(arg => liquidEngine.evalValue(arg, ctx))
      );

      let inputFilePath = src == null ? src : path.join("src", src);
      if (src.includes("http://") || src.includes("https://")) {
        inputFilePath = src;
      }

      const imageMetadata = await Image(inputFilePath, {
        widths: [200, 400, 850, 1280, 1600],
        formats: ["avif", "webp", "jpeg"],
        outputDir: "dist/assets/images",
        urlPath: "/assets/images",
      });

      const imageAttributes = {
        class: cls,
        alt,
        sizes: sizes || "100vw",
        loading: "lazy",
        decoding: "async",
      };

      return Image.generateHTML(imageMetadata, imageAttributes).replace(/\s+/g, ' ').trim();
    },
  };
};

// Define the svgContents filter
const svgContentsFilter = ('svgContents', (file, className, extractTag = 'svg') => {
  const getSVGContents = new GetSVGContents(file, className, extractTag);

  return getSVGContents.getSvg();
})
const uuiFilter = ('uuid', (value) => {
  return value+uuidv4();
})
module.exports = async (input, context) => {
  // Create a new Liquid engine
  const engine = new Liquid();

  // Setup Bookshop tag rendering
  const bookshopConfig = {
    bookshopLocations: ["_component-library"],
    pathPrefix: "",
  }; // Add your bookshop configuration here if needed
  const locations = bookshopConfig.bookshopLocations || [];
  const baseLocation = path.dirname(module.parent.filename);
  const renderBookshopTag = bookshopRenderer('component', locations, baseLocation, bookshopConfig)(engine);

  // Register the Bookshop and Image tags with the engine
  engine.registerTag('bookshop', renderBookshopTag);
  engine.registerTag('image', imageTagHandler(engine));

  // Register the uuid filter with the engine
  engine.registerFilter('uuidFilter', uuiFilter);

  // Register the svgContents filter with the engine
  engine.registerFilter('svgContents', svgContentsFilter);

  // Render the input string with the provided context
  return await engine.parseAndRender(input, context);
};
