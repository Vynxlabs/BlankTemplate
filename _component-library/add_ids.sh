#!/bin/bash

# 1. Loop through all files ending in .bookshop.yml recursively
find . -type f -name "*.bookshop.yml" | while read -r file; do
    
    # 2. Extract the component name
    # Get the filename (e.g., 'faq.bookshop.yml')
    filename=$(basename "$file")
    # Remove the extension to get 'faq'
    component_name="${filename%.bookshop.yml}"

    # 3. Check if _componentId already exists to prevent duplicates
    if grep -q "_componentId:" "$file"; then
        echo "Skipping $filename: _componentId already exists."
        continue
    fi

    # 4. Generate a UUID
    if command -v uuidgen &> /dev/null; then
        # macOS/Linux standard
        uuid=$(uuidgen | tr '[:upper:]' '[:lower:]')
    else
        # Fallback if uuidgen is missing
        uuid=$(cat /proc/sys/kernel/random/uuid)
    fi

    # Create the full ID string
    full_id="${component_name}-${uuid}"

    # 5. Insert the new key using Perl
    # Looks for 'blueprint:' at the start of a line and appends the new key on the next line
    # Assumes 2-space indentation based on your example
    perl -i -pe "s/^blueprint:\s*$/blueprint:\n  _componentId: $full_id\n/" "$file"

    echo "Updated $filename with ID: $full_id"

done