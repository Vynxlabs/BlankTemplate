const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const glob = require('glob');

// Define schema folder path
const schemaFolder = './.cloudcannon/schemas/';
const schemaFiles = glob.sync(`${schemaFolder}*.md`);

// Iterate over each schema file
schemaFiles.forEach(schemaFile => {
    const schemaContent = fs.readFileSync(schemaFile, 'utf8');
    const frontMatterMatch = schemaContent.match(/^---\n([\s\S]+?)\n---/);
    
    // Load schema front matter
    if (frontMatterMatch) {
        const schema = yaml.load(frontMatterMatch[1]);
        const schemaName = path.basename(schemaFile, '.md');

        // Determine file paths based on schema name
        let files;
        switch (schemaName) {
            case 'page':
                files = glob.sync('./src/pages/**/*.md');
                break;
            case 'happening':
                files = glob.sync('./src/happenings/**/*.md');
                break;
            case 'post':
                files = glob.sync('./src/posts/**/*.md');
                break;
            case 'service':
                files = glob.sync('./src/services/**/*.md');
                break;
            case 'listing':
                files = glob.sync('./src/listings/**/*.md');
                break;
            default:
                console.log(`Schema ${schemaName} not supported`);
                return;
        }

        // Update the permalink for each file
        files.forEach(file => updatePermalink(file, schema));
    } else {
        console.error(`Failed to load front matter from schema file: ${schemaFile}`);
    }
});

// Function to update the permalink in front matter
function updatePermalink(filePath, schema) {
    if(filePath === 'src/pages/404.md' || filePath === 'src/pages/tags.md') {
        return
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const frontMatterMatch = fileContent.match(/^---\n([\s\S]+?)\n---/);

    if (frontMatterMatch) {
        let frontMatter = yaml.load(frontMatterMatch[1]);
        
        // Check if permalink needs to be updated
        if (frontMatter.permalink !== schema.permalink) {
            frontMatter.permalink = schema.permalink;
            
            // Dump updated front matter to YAML
            const updatedFrontMatter = `---\n${yaml.dump(frontMatter)}---`;
            
            // Replace old front matter with updated front matter
            const updatedContent = fileContent.replace(frontMatterMatch[0], updatedFrontMatter);

            // Write changes to file
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } else {
        console.error(`Failed to read front matter from file: ${filePath}`);
    }
}
