const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const glob = require('glob');
const { Liquid } = require('liquidjs');

// Import the custom filter
const fileSubstringFilter = require(path.join(process.cwd(), 'src/filters/extract-file-substring-filter'));
const uuidHashFilter = require(path.join(process.cwd(),"./src/filters/uuid-hash-filter.js"));

// Directories to scan for Markdown files
const directories = ['./src/pages', './src/posts', './src/services', './src/happenings', './src/listings'];

// Initialize LiquidJS engine and register the custom filter
const engine = new Liquid();
engine.registerFilter('fileSubstringFilter', fileSubstringFilter);
engine.registerFilter('uuidHashFilter', uuidHashFilter);

// Function to calculate the permalink using LiquidJS
async function calculatePermalink(frontMatter, filePath) {
    const fileStem = filePath.replace(/^\.?\/src/, '').replace(/\.mdx?$/, '');
    const context = {
        id: frontMatter.id || null,
        page: { filePathStem: fileStem },
        title: frontMatter.title || null,
        pageLink: frontMatter.pageLink || null
    };

    let permalinkTemplate = frontMatter.permalink;
    
    try {
        // Render the LiquidJS permalink template
        const permalink = await engine.parseAndRender(permalinkTemplate, context);
        return permalink.trim();
    } catch (error) {
        console.error(`Error evaluating permalink for ${filePath}: ${error.message}`);
        return null;
    }
}

// Main function to update permalinks and handle duplicates
async function updatePermalinks() {
    const seenPermalinks = {}; // To track existing permalinks

    for (const dir of directories) {
        const files = glob.sync(`${dir}/**/*.md`);

        for (const filePath of files) {
            let fileContent = fs.readFileSync(filePath, 'utf8');
            const frontMatterMatch = fileContent.match(/^---\n([\s\S]+?)\n---/);

            if (frontMatterMatch) {
                let frontMatter = yaml.load(frontMatterMatch[1]);
                let originalPermalink = await calculatePermalink(frontMatter, filePath);
                //Yes this is a hack, but this is a quick fix
                originalPermalink = originalPermalink.replace('//', '/');
                originalPermalink = originalPermalink.replace('//', '/');
                if (originalPermalink) {
                    let permalink = originalPermalink;
                    console.log(permalink);
                    // Check if the permalink already exists in the tracking object
                    if (seenPermalinks[permalink]) {
                        // Append a duplicate identifier
                        let count = seenPermalinks[permalink];
                        permalink = permalink.replace('/index.html', `-duplicate${count}/index.html`);
                        seenPermalinks[originalPermalink] = count + 1;
                    } else {
                        seenPermalinks[permalink] = 1;
                    }

                    // If the permalink was modified, update the front matter
                    if (permalink !== originalPermalink) {
                        frontMatter.permalink = permalink;
                        const updatedFrontMatter = `---\n${yaml.dump(frontMatter)}---`;
                        fileContent = fileContent.replace(frontMatterMatch[0], updatedFrontMatter);
                        fs.writeFileSync(filePath, fileContent, 'utf8');
                        console.log(`Updated duplicate permalink in: ${filePath}`);
                    }
                }
            }
        }
    }

    console.log("Permalink update process completed.");
}

updatePermalinks();
