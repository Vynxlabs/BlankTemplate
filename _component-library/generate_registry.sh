#!/bin/bash

# Define the output file
OUTPUT_FILE="componentRegistry.json"

# Check if components directory exists
if [ ! -d "components" ]; then
  echo "Error: 'components' directory not found."
  exit 1
fi

# Initialize the JSON file
echo "{" > "$OUTPUT_FILE"

# Variable to track if we are processing the first item (to handle commas)
FIRST_ITEM=true

# Find all .bookshop.yml files and loop through them
while read -r file; do
  
  # 1. Extract the _componentId
  # Uses awk to find the line, remove quotes/spaces, and get the value
  id=$(awk -F: '/_componentId/ {gsub(/[ "\x27]/, "", $2); print $2}' "$file")

  # If no ID is found in the file, skip it
  if [ -z "$id" ]; then
    continue
  fi

  # 2. Extract the _bookshop_name (path)
  # Get directory of the file (e.g., components/sections/faq)
  dir_path=$(dirname "$file")
  # Remove the "components/" prefix to get "sections/faq"
  bookshop_name="${dir_path#components/}"

  # 3. Write to JSON file
  # If this is not the first item, append a comma to the previous line
  if [ "$FIRST_ITEM" = true ]; then
    FIRST_ITEM=false
  else
    echo "," >> "$OUTPUT_FILE"
  fi

  # Append the key-value pair (using printf to avoid trailing newline for now)
  printf "   \"%s\": \"%s\"" "$id" "$bookshop_name" >> "$OUTPUT_FILE"

done < <(find components -type f -name "*.bookshop.yml")

# Close the JSON object
echo "" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE"