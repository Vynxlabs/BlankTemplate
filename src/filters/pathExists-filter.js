const fs = require("fs");
const path = require("path");

module.exports = (filePath) => {
  try {
    // Resolve the full path based on the current working directory
    let fullPath = path.join("src",filePath);
    if(filePath.includes("https://") || filePath.includes("http://")){ 
      return filePath
    }

    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      return filePath; // Return the original path if the file exists
    } else {
      return ""; // Return an empty string if the file does not exist
    }
  } catch (error) {
    console.error(`Error checking file existence for path: ${filePath}`, error);
    return ""; // Return empty string on any error
  }
};