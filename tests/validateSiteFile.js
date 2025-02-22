const fs = require("fs");
const path = require("path");

// Paths to the reference and client files
const referenceFilePath = path.resolve("./src/_data-ref/site.json");
const clientFilePath = path.resolve("./src/_data/site.json");

let warnings = [];

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
    const newItem = {};
    for (const refKey in referenceStructure) {
      if (!(refKey in item)) {
        newItem[refKey] = referenceStructure[refKey];
        warnings.push(
          `Array '${key}' index ${index}: Added missing key '${refKey}'.`
        );
      } else {
        newItem[refKey] = item[refKey];
      }
    }

    // Remove extra keys not in reference
    for (const itemKey of Object.keys(item)) {
      if (!(itemKey in referenceStructure)) {
        warnings.push(
          `Array '${key}' index ${index}: Removed extra key '${itemKey}'.`
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
          clientData[key]
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
  const referenceData = JSON.parse(fs.readFileSync(referenceFilePath, "utf-8"));
  const clientData = JSON.parse(fs.readFileSync(clientFilePath, "utf-8"));

  // Sync _inputs key
  if (referenceData._inputs && clientData._inputs) {
    const { updatedInputs, warnings: inputWarnings } = syncInputs(
      referenceData._inputs,
      clientData._inputs
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
        key
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
  fs.writeFileSync(clientFilePath, JSON.stringify(reorderedClientData, null, 2));
}

// Execute the script
syncFiles(referenceFilePath, clientFilePath);

// Validation loop
if (warnings.length > 0) {
  console.warn("Warnings:\n", warnings.join("\n"));
  warnings = [];
  console.log("Rechecking for warnings...");
  syncFiles(referenceFilePath, clientFilePath);
}

// Final warnings check
if (warnings.length > 0) {
  console.warn("Warnings:\n", warnings.join("\n"));
  process.exit(1);
} else {
  console.log("Client file is up to date. No warnings.");
}
