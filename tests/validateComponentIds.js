const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Configuration
const registryPath = "./_component-library/componentRegistry.json";
const pagesDirs = ["./src/pages", "./src/services", "./src/happenings", "./src/listings"];

// 1. Load and Validate Registry
if (!fs.existsSync(registryPath)) {
  console.error(`Error: Component registry not found at "${registryPath}"`);
  process.exit(1);
}

let registry = {};
let reverseRegistry = {}; // Maps _bookshop_name -> _componentId

try {
  const rawData = fs.readFileSync(registryPath, "utf8");
  registry = JSON.parse(rawData);

  // Build reverse registry for "Case B" (Missing ID, has Name)
  // If duplicates exist, the last one processed wins
  Object.entries(registry).forEach(([id, name]) => {
    reverseRegistry[name] = id;
  });
} catch (error) {
  console.error("Error parsing componentRegistry.json:", error.message);
  process.exit(1);
}

// 2. Recursive function to fix component objects in memory
// Returns true if any change was made
const fixComponentData = (obj, filePath) => {
  let isModified = false;

  if (!obj || typeof obj !== "object") return false;

  // Check if this object looks like a component (has ID or Name)
  
  // CASE A: Component has an ID -> Ensure Name matches Registry
  if (obj._componentId) {
    const registeredName = registry[obj._componentId];
    if (registeredName) {
      if (obj._bookshop_name !== registeredName) {
        console.log(
          `[UPDATE] ${filePath}: Fixed name for ID ${obj._componentId}\n   Old: "${obj._bookshop_name}" -> New: "${registeredName}"`
        );
        obj._bookshop_name = registeredName;
        isModified = true;
      }
    } else {
      // Optional: Warn if ID exists in file but not in registry?
      // console.warn(`Warning: ID ${obj._componentId} not found in registry.`);
    }
  }
  // CASE B: Component has Name but NO ID -> specificy ID from Registry
  else if (obj._bookshop_name && !obj._componentId) {
    const registeredId = reverseRegistry[obj._bookshop_name];
    if (registeredId) {
      console.log(
        `[UPDATE] ${filePath}: Added missing ID for component "${obj._bookshop_name}"\n   ID: ${registeredId}`
      );
      obj._componentId = registeredId;
      isModified = true;
    }
  }

  // Recursive Step: Traverse deeper into arrays and objects to find nested components
  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      if (fixComponentData(item, filePath)) isModified = true;
    });
  } else {
    Object.keys(obj).forEach((key) => {
      // Avoid recursing into purely primitive keys, but always check objects
      if (typeof obj[key] === "object") {
        if (fixComponentData(obj[key], filePath)) isModified = true;
      }
    });
  }

  return isModified;
};

// 3. Process a single file
const processFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const parsed = matter(fileContent);
    const frontMatter = parsed.data;
    let fileModified = false;

    // Scan 'hero'
    if (frontMatter.hero) {
      if (fixComponentData(frontMatter.hero, filePath)) fileModified = true;
    }

    // Scan 'content_blocks'
    if (frontMatter.content_blocks) {
      if (fixComponentData(frontMatter.content_blocks, filePath)) fileModified = true;
    }

    // If changes were made, write back to file
    if (fileModified) {
      const newContent = matter.stringify(parsed.content, frontMatter);
      fs.writeFileSync(filePath, newContent);
      console.log(`Saved changes to: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err.message);
  }
};

// 4. Directory Traversal
const traverseDirectory = (dir) => {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      traverseDirectory(filePath);
    } else if (file.endsWith(".md")) {
      processFile(filePath);
    }
  });
};

// 5. Execution
console.log("Starting component validation and update...");
pagesDirs.forEach((dir) => traverseDirectory(dir));
console.log("Process complete.");