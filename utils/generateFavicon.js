const {
  FaviconSettings,
  generateFaviconFiles,
  generateFaviconHtml,
} = require("@realfavicongenerator/generate-favicon");
const {
  getNodeImageAdapter,
  loadAndConvertToSvg,
} = require("@realfavicongenerator/image-adapter-node");
const fs = require("fs");
const path = require("path");

function checkFileExists(filePath) {
  try {
    if (!filePath || typeof filePath !== 'string') return ""; // Check for null or empty string
    if (filePath.includes("https://") || filePath.includes("http://")) {
      return filePath; // Return URL directly
    }
    const fullPath = path.resolve(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      return filePath; // File exists
    }
  } catch (error) {
    console.error(`Error checking file existence for path: ${filePath}`, error);
  }
  return ""; // Return empty string if file does not exist or on error
}

async function generateFavicon() {
  const imageAdapter = await getNodeImageAdapter();

  // Load site.json
  const siteConfigPath = path.join(process.cwd(), "src/_data/site.json");
  const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, "utf8"));

  // Check faviconPath and fallback logic
  let faviconPath = siteConfig.faviconPath ?checkFileExists(path.join("src",siteConfig.faviconPath)) : "";
  if (!faviconPath) {
    console.warn("Favicon path invalid or missing, falling back to logo.");
    faviconPath = siteConfig.logoPath ? checkFileExists(path.join("src",siteConfig.logoPath)) : "";
  }
  if (!faviconPath) {
    console.warn("Logo path invalid or missing, using default favicon.");
    faviconPath = "src/images/default-favicon.png";
  }

  console.log(`Using favicon path: ${faviconPath}`);

  // Load the master icon
  const masterIcon = {
    icon: await loadAndConvertToSvg(faviconPath),
  };

  const faviconSettings = {
    icon: {
      desktop: {
        regularIconTransformation: {
          type: "none",
        },
        darkIconType: "none",
      },
      touch: {
        transformation: {
          type: "none",
        },
        appTitle: null,
      },
      webAppManifest: {
        transformation: {
          type: "none",
        },
        backgroundColor: "#ffffff",
        themeColor: "#ffffff",
        name: "MyWebSite",
        shortName: "MySite",
      },
    },
    path: "/",
  };

  const faviconFolder = path.join(process.cwd(), "src/images/favicon");
  fs.rmSync(faviconFolder, { recursive: true, force: true });
  fs.mkdirSync(faviconFolder);

  // Generate files
  const files = await generateFaviconFiles(
    masterIcon,
    faviconSettings,
    imageAdapter,
  );

  for (const fileName in files) {
    const filePath = path.join(faviconFolder, fileName);
    const fileContents = files[fileName];

    if (Buffer.isBuffer(fileContents) || typeof fileContents === "string") {
      fs.writeFileSync(filePath, fileContents);
    } else if (typeof fileContents === "object") {
      fs.writeFileSync(filePath, JSON.stringify(fileContents, null, 2));
    } else {
      console.warn(`Unsupported file type for ${fileName}`);
    }
  }

  const html = await generateFaviconHtml(faviconSettings);

  // Extract markups and join them into a single HTML string
  const htmlContent = html.markups.join("\n");
  console.log(htmlContent);

  const htmlFilePath = path.join(
    process.cwd(),
    "src/_includes/partials/favicon.html",
  );

  fs.writeFileSync(htmlFilePath, htmlContent);
}

generateFavicon();