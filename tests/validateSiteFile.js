const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { stringToSvg } = require("@realfavicongenerator/generate-favicon");

// Dictionary with reference file paths as keys and client file paths as values
const fileDictionary = {
  "./src/_data-ref/site.json": "./src/_data/site.json",
  "./src/_data-ref/theme.yml": "./src/_data/theme.yml",
  "./src/_data-ref/listings.yml": "./src/_data/listings.yml",
  "./src/_data-ref/happenings.yml": "./src/_data/happenings.yml",
  "./src/_data-ref/pageCollections.yml": "./src/_data/pageCollections.yml",
};

// Function to validate and sync _inputs key
function syncInputs(referenceInputs, clientInputs) {
  const updatedInputs = {};

  // Add missing keys from reference to client
  for (const [key, value] of Object.entries(referenceInputs)) {
    if (!(key in clientInputs)) {
      updatedInputs[key] = value;
      warnings.push(`Added missing key '${key}' to _inputs.`);
    } else {
      updatedInputs[key] = clientInputs[key];
    }
  }

  // Remove extra keys in client that are not in reference
  for (const key of Object.keys(clientInputs)) {
    if (!(key in referenceInputs)) {
      warnings.push(`Removed extra key '${key}' from _inputs.`);
    }
  }

  return { updatedInputs, warnings };
}

// Function to validate and sync arrays
function validateArray(referenceArray, clientArray, key) {
  const referenceStructure = referenceArray[0];
  const validatedArray = clientArray.map((item, index) => {
    if (item === null) {
      return null; // Preserve null values
    }
    if (typeof item === "string" || item instanceof String) {
      return item; // Preserve undefined values
    }

    const newItem = {};
    for (const refKey in referenceStructure) {
      // Add this code here
      if (
        typeof referenceStructure === "string" ||
        referenceStructure instanceof String
      ) {
        continue;
      }
      if (
        Array.isArray(referenceStructure[refKey]) &&
        referenceStructure[refKey].every((item) => typeof item !== "object")
      ) {
        if (item[refKey] && item[refKey].length > 0) {
          // Client file has at least one array item, skip this key
          continue;
        } else {
          // Client file is empty, add array items from reference file
          item[refKey] = referenceStructure[refKey];
        }
      } else {
        // Existing code here...
        if (!(refKey in item)) {
          newItem[refKey] = referenceStructure[refKey];
          warnings.push(
            `Array '${key}' index ${index}: Added missing key '${refKey}'.`,
          );
        } else {
          newItem[refKey] = item[refKey];
        }
      }
    }

    // Remove extra keys not in reference
    for (const itemKey of Object.keys(item)) {
      if (!(itemKey in referenceStructure)) {
        warnings.push(
          `Array '${key}' index ${index}: Removed extra key '${itemKey}'.`,
        );
      }
    }

    return newItem;
  });

  return { validatedArray, warnings };
}

// Recursive function to reorder and clean keys in objects
function reorderKeys(referenceData, clientData) {
  if (clientData === null || clientData === undefined) {
    return clientData; // Preserve null or undefined values
  }

  if (Array.isArray(referenceData) && Array.isArray(clientData)) {
    return clientData.map((item) => reorderKeys(referenceData[0], item));
  } else if (
    typeof referenceData === "object" &&
    typeof clientData === "object" &&
    referenceData !== null &&
    clientData !== null
  ) {
    const reorderedClientData = {};
    // Ensure keys match the reference order
    Object.keys(referenceData).forEach((key) => {
      if (key in clientData) {
        reorderedClientData[key] = reorderKeys(
          referenceData[key],
          clientData[key],
        );
      } else {
        reorderedClientData[key] = referenceData[key]; // Add missing keys
        warnings.push(`Added missing key '${key}' to client data.`);
      }
    });
    // Remove extra keys not in reference
    Object.keys(clientData).forEach((key) => {
      if (!(key in referenceData)) {
        warnings.push(`Removed extra key '${key}' from client data.`);
      }
    });
    return reorderedClientData;
  }
  return clientData; // Primitive values are returned as-is
}

// Function to sync the client file with the reference file
function syncFiles(referenceFilePath, clientFilePath) {
  const referenceData = parseFile(referenceFilePath);
  const clientData = parseFile(clientFilePath);

  // Sync _inputs key
  if (referenceData._inputs && clientData._inputs) {
    const { updatedInputs, warnings: inputWarnings } = syncInputs(
      referenceData._inputs,
      clientData._inputs,
    );
    clientData._inputs = updatedInputs;
    warnings.push(...inputWarnings);
  }

  // Traverse and sync top-level keys
  for (const key of Object.keys(referenceData)) {
    if (!(key in clientData)) {
      clientData[key] = referenceData[key];
      warnings.push(`Added missing key '${key}' to client file.`);
    } else if (
      Array.isArray(referenceData[key]) &&
      Array.isArray(clientData[key])
    ) {
      const { validatedArray, warnings: arrayWarnings } = validateArray(
        referenceData[key],
        clientData[key],
        key,
      );
      clientData[key] = validatedArray;
      warnings.push(...arrayWarnings);
    } else if (
      typeof referenceData[key] === "object" &&
      typeof clientData[key] === "object"
    ) {
      for (const refKey of Object.keys(referenceData[key])) {
        if (!(refKey in clientData[key])) {
          clientData[key][refKey] = referenceData[key][refKey];
          warnings.push(`Added missing key '${key}.${refKey}' to client file.`);
        }
      }
    }
  }

  // Remove extra keys not in reference
  for (const key of Object.keys(clientData)) {
    if (!(key in referenceData)) {
      delete clientData[key];
      warnings.push(`Removed extra key '${key}' from client file.`);
    }
  }

  // Reorder and clean nested keys
  const reorderedClientData = reorderKeys(referenceData, clientData);

  // Write the updated client file
  const fileExt = path.extname(clientFilePath);
  if (fileExt === ".json") {
    fs.writeFileSync(
      clientFilePath,
      JSON.stringify(reorderedClientData, null, 2),
    );
  } else if (fileExt === ".yml") {
    fs.writeFileSync(clientFilePath, yaml.dump(reorderedClientData));
  }
}

// Helper function to parse a file, whether it's JSON or YAML
function parseFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const fileExtension = filePath.split(".").pop().toLowerCase();

  if (fileExtension === "json") {
    return JSON.parse(fileContent);
  } else if (fileExtension === "yml" || fileExtension === "yaml") {
    return yaml.load(fileContent);
  } else {
    throw new Error(`Unsupported file format: ${fileExtension}`);
  }
}

// Execute the script
let warnings = [];
Object.entries(fileDictionary).forEach(
  ([referenceFilePath, clientFilePath]) => {
    syncFiles(referenceFilePath, clientFilePath);
  },
);

// Validation loop
if (warnings.length > 0) {
  console.warn("Warnings:\n", warnings.join("\n"));
  warnings = [];
  console.log("Rechecking for warnings...");
  Object.entries(fileDictionary).forEach(
    ([referenceFilePath, clientFilePath]) => {
      syncFiles(referenceFilePath, clientFilePath);
    },
  );
}

// Final warnings check
if (warnings.length > 0) {
  console.warn("Warnings:\n", warnings.join("\n"));
  process.exit(1);
} else {
  console.log("Client files are up to date. No warnings.");
}
