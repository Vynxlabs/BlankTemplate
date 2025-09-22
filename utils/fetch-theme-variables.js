const fs = require('fs');
const yaml = require('js-yaml')
const path = require('path');

// read theme colors and fonts from _data/theme.yml
let dataFile = yaml.load(fs.readFileSync('src/_data/theme.yml','utf-8'))
    
/* 
    color_groups get processed differently than other user variables - so
    extract the color_groups and then delete them from the dataFile object so
    they don't get twice processed when we iterate through the dataFile object
*/
let color_groups = dataFile["customColor_groups"]
let primary_color = dataFile["primaryColor_group"]
delete dataFile["custom_color_groups"]
delete dataFile["primary_color_group"]

const configFileLocation = './cloudcannon.config.yml'

// load the cloudcannon config and reset the color_group values
let config = yaml.load(fs.readFileSync(configFileLocation,'utf-8'))
config['_inputs']['nav_color_group']['options']['values'] = []
config['_inputs']['color_group']['options']['values'] = []
config['_inputs']['footer_color_group']['options']['values'] = []
config['_inputs']['card_color_group']['options']['values'] = []
config['_inputs']['form_color_group']['options']['values'] = []

/* 
    remove any existing color_groups.scss file and create a new one
    easier to overwrite the file entirely each time than figure out
    what changed and update only those parts
*/
const colorsFileLocation = './src/assets/styles/color_groups.scss'
if(fs.existsSync(colorsFileLocation))
    fs.unlinkSync(colorsFileLocation)
fs.writeFileSync(colorsFileLocation, "")

/*
    We have to do a few things to make the user colors usable and show up in the 
    CloudCannon config. 
    
    - We need to define all the variables in the :root element of the CSS (css_string_root)
    - We need to assign background, text and interaction colors to components (css_string_component)
    - We need to assign the background, text and interaction colors to the nav (css_string_nav)
    - We need to assign the background, text and interaction colors to the footer (css_string_footer)
*/
let css_string_root = `:root {\n`
let css_string_component = `.component {\n`
let css_string_nav = `.c-navigation {\n`
let css_string_footer = `.c-footer {\n`
let css_string_utilities = ``
console.log(color_groups)
// css_string_utilities += `.text-primary-textcolor { color: ${primary_color.textColor}; }\n`
// css_string_utilities += `.text-primary-primarycolor { color: ${primary_color.primaryColor}; }\n`
// css_string_utilities += `.text-primary-secondarycolor { color: ${primary_color.secondaryColor}; }\n`
// css_string_utilities += `.text-primary-accentcolor { color: ${primary_color.accentColor}; }\n`
// css_string_utilities += `.bg-primary-backgroundcolor { background-color: ${primary_color.backgroundColor}; }\n`
// css_string_utilities += `.bg-primary-primarycolor { background-color: ${primary_color.primaryColor}; }\n`
// css_string_utilities += `.bg-primary-secondarycolor { background-color: ${primary_color.secondaryColor}; }\n`
// css_string_utilities += `.bg-primary-accentcolor { background-color: ${primary_color.accentColor}; }\n\n`

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    hex = hex == null ? '#ffffff' : hex;
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  function hexToRgbCss(hex) {
    hex = hex == null ? '#ffffff' : hex;
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r} ${g} ${b}`;
  }

  function appendHighContrastClasses(colorSet, id) {
    let backgroundRgb = hexToRgb(colorSet.primaryColor);
  let type = '';
  let cssString = '';

  for( colortype in colorSet){
    if(colortype == 'name')
      continue;
    let rgb = hexToRgb(colorSet[colortype]);
    type = colortype.toLowerCase();
    cssString += `

      --${id}-red-${type}: ${rgb.r};
      --${id}-green-${type}: ${rgb.g};
      --${id}-blue-${type}: ${rgb.b};

    .text-${id}-highcontrast-${type} {
      --${id}-accessible-color-${type}: calc((
        (
          (
            (var(--${id}-red-${type}) * 299) +
            (var(--${id}-green-${type}) * 587) +
            (var(--${id}-blue-${type}) * 114)
          ) / 1000
        ) - 128
      ) * -1000);

      color: rgb(
        var(--${id}-accessible-color-${type}),
        var(--${id}-accessible-color-${type}),
        var(--${id}-accessible-color-${type})
      );
    }
      .fill-${id}-highcontrast-${type} {
      --${id}-accessible-color-${type}: calc((
        (
          (
            (var(--${id}-red-${type}) * 299) +
            (var(--${id}-green-${type}) * 587) +
            (var(--${id}-blue-${type}) * 114)
          ) / 1000
        ) - 128
      ) * -1000);

      fill: rgb(
        var(--${id}-accessible-color-${type}),
        var(--${id}-accessible-color-${type}),
        var(--${id}-accessible-color-${type})
      );
    }
      .stroke-${id}-highcontrast-${type} {
      --${id}-accessible-color-${type}: calc((
        (
          (
            (var(--${id}-red-${type}) * 299) +
            (var(--${id}-green-${type}) * 587) +
            (var(--${id}-blue-${type}) * 114)
          ) / 1000
        ) - 128
      ) * -1000);

      stroke: rgb(
        var(--${id}-accessible-color-${type}),
        var(--${id}-accessible-color-${type}),
        var(--${id}-accessible-color-${type})
      );
      
    }
  `;
  }
  

    return cssString;
  }

  function generateHighContrastClasses(color_groups) {
    let cssString = '';
    if (color_groups && Array.isArray(color_groups)) {
      color_groups.forEach((colorSet, index) => {
        let id = `${colorSet.name.toLowerCase().replace(/[\s|&;$%@'"<>()+,]/g, "_")}${index}`;
        cssString += appendHighContrastClasses(colorSet, id);
      });
    }
    return cssString;
  }

function appendTailwindUtilityClasses(colorSet,id){
    let cssString=''
    //text
    cssString += `.text-${id}-textcolor { color: ${colorSet.textColor}; }\n`;
    cssString += `.text-${id}-primarycolor { color: ${colorSet.primaryColor}; }\n`;
    cssString += `.text-${id}-secondarycolor { color: ${colorSet.secondaryColor}; }\n`;
    cssString += `.text-${id}-accentcolor { color: ${colorSet.accentColor}; }\n`;
    cssString += `.text-${id}-backgroundcolor { color: ${colorSet.backgroundColor}; }\n`;

    //decoration
    cssString += `.decoration-${id}-textcolor { text-decoration-color: ${colorSet.textColor}; }\n`;
    cssString += `.decoration-${id}-primarycolor { text-decoration-color: ${colorSet.primaryColor}; }\n`;
    cssString += `.decoration-${id}-secondarycolor { text-decoration-color: ${colorSet.secondaryColor}; }\n`;
    cssString += `.decoration-${id}-accentcolor { text-decoration-color: ${colorSet.accentColor}; }\n`;

    //decoration active state
    cssString += `.data-\\[state\\=active\\]\\:decoration-${id}-textcolor[data-state=active] { text-decoration-color: ${colorSet.textColor}; }\n`;
    cssString += `.data-\\[state\\=active\\]\\:decoration-${id}-primarycolor[data-state=active] { text-decoration-color: ${colorSet.primaryColor}; }\n`;
    cssString += `.data-\\[state\\=active\\]\\:decoration-${id}-secondarycolor[data-state=active] { text-decoration-color: ${colorSet.secondaryColor}; }\n`;
    cssString += `.data-\\[state\\=active\\]\\:decoration-${id}-accentcolor[data-state=active] { text-decoration-color: ${colorSet.accentColor}; }\n`;

    //to-color - for gradients
    cssString += `:root .to-${id}-textcolor { --tw-gradient-to: ${colorSet.textColor} var(--tw-gradient-to-position); }\n`;
    cssString += `:root .to-${id}-backgroundcolor { --tw-gradient-to: ${colorSet.backgroundColor} var(--tw-gradient-to-position); }\n`;
    cssString += `:root .to-${id}-primarycolor { --tw-gradient-to: ${colorSet.primaryColor} var(--tw-gradient-to-position); }\n`;
    cssString += `:root .to-${id}-secondarycolor { --tw-gradient-to: ${colorSet.secondaryColor} var(--tw-gradient-to-position); }\n`;
    cssString += `:root .to-${id}-accentcolor { --tw-gradient-to: ${colorSet.accentColor} var(--tw-gradient-to-position); }\n`;


    //background
    cssString += `.bg-${id}-backgroundcolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.backgroundColor)} / var(--tw-bg-opacity)); }\n`;
    cssString += `.bg-${id}-primarycolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.primaryColor)} / var(--tw-bg-opacity)); }\n`;
    cssString += `.bg-${id}-secondarycolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.secondaryColor)} / var(--tw-bg-opacity)); }\n`;
    cssString += `.bg-${id}-accentcolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.accentColor)} / var(--tw-bg-opacity)); }\n`;
    cssString += `.bg-${id}-textcolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.textColor)} / var(--tw-bg-opacity)); }\n`;

     //background media
     cssString += `@media (min-width: 768px) { .md\\:bg-${id}-backgroundcolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.backgroundColor)} / var(--tw-bg-opacity)); } }\n`;
     cssString += `@media (min-width: 768px) { .md\\:bg-${id}-primarycolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.primaryColor)} / var(--tw-bg-opacity)); } }\n`;
     cssString += `@media (min-width: 768px) { .md\\:bg-${id}-secondarycolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.secondaryColor)} / var(--tw-bg-opacity)); } }\n`;
     cssString += `@media (min-width: 768px) { .md\\:bg-${id}-accentcolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.accentColor)} / var(--tw-bg-opacity)); } }\n`;
     cssString += `@media (min-width: 768px) { .md\\:bg-${id}-textcolor { --tw-bg-opacity:1; background-color: rgb( ${hexToRgbCss(colorSet.textColor)} / var(--tw-bg-opacity)); } }\n`;

    //background hover
    cssString += `.hover\\:bg-${id}-backgroundcolor:hover { background-color: ${colorSet.backgroundColor}; }\n`;
    cssString += `.hover\\:bg-${id}-primarycolor:hover { background-color: ${colorSet.primaryColor}; }\n`;
    cssString += `.hover\\:bg-${id}-secondarycolor:hover { background-color: ${colorSet.secondaryColor}; }\n`;
    cssString += `.hover\\:bg-${id}-accentcolor:hover { background-color: ${colorSet.accentColor}; }\n`;

  
    
    //border color
    cssString += `.border-${id}-textcolor { border-color: ${colorSet.textColor}; }\n`;
    cssString += `.border-${id}-backgroundcolor { border-color: ${colorSet.backgroundColor}; }\n`;
    cssString += `.border-${id}-primarycolor { border-color: ${colorSet.primaryColor}; }\n`;
    cssString += `.border-${id}-secondarycolor { border-color: ${colorSet.secondaryColor}; }\n`;
    cssString += `.border-${id}-accentcolor { border-color: ${colorSet.accentColor}; }\n`;
    //border color hover
    cssString += `.hover\\:border-${id}-textcolor:hover { border-color: ${colorSet.textColor}; }\n`;
    cssString += `.hover\\:border-${id}-backgroundcolor:hover { border-color: ${colorSet.backgroundColor}; }\n`;
    cssString += `.hover\\:border-${id}-primarycolor:hover { border-color: ${colorSet.primaryColor}; }\n`;
    cssString += `.hover\\:border-${id}-secondarycolor:hover { border-color: ${colorSet.secondaryColor}; }\n`;
    cssString += `.hover\\:border-${id}-accentcolor:hover { border-color: ${colorSet.accentColor}; }\n`;

    //stroke
    cssString += `.stroke-${id}-textcolor { stroke: ${colorSet.textColor}; }\n`;
    cssString += `.stroke-${id}-backgroundcolor { stroke: ${colorSet.backgroundColor}; }\n`;
    cssString += `.stroke-${id}-primarycolor { stroke: ${colorSet.primaryColor}; }\n`;
    cssString += `.stroke-${id}-secondarycolor { stroke: ${colorSet.secondaryColor}; }\n`;
    cssString += `.stroke-${id}-accentcolor { stroke: ${colorSet.accentColor}; }\n`;

    //fill
    cssString += `.fill-${id}-textcolor { fill: ${colorSet.textColor}; }\n`;
    cssString += `.fill-${id}-backgroundcolor { fill: ${colorSet.backgroundColor}; }\n`;
    cssString += `.fill-${id}-primarycolor { fill: ${colorSet.primaryColor}; }\n`;
    cssString += `.fill-${id}-secondarycolor { fill: ${colorSet.secondaryColor}; }\n`;
    cssString += `.fill-${id}-accentcolor { fill: ${colorSet.accentColor}; }\n`;

    


    cssString += '\n'; // Add a newline for readability
    return cssString
}

function generateTailwindUtilityClasses(color_groups,id) {
    let cssString = ''; // Initialize an empty string to store CSS rules

    // Check if custom color groups exist in the data file
    if (color_groups && Array.isArray(color_groups)) {
        // Iterate over each custom color group
        color_groups.forEach((colorSet, index) => {
            // Generate CSS classes for text color and background color
            cssString += appendTailwindUtilityClasses(colorSet,id)
            
        });
    }
    console.log(`🎨 Tailwind utility classes generated`);
    // Write the generated CSS to the output file
    return cssString

    
}

css_string_utilities+=appendTailwindUtilityClasses(primary_color,'primary')
css_string_root += appendHighContrastClasses(primary_color, 'primary');


css_string_component += `--main-background-color: #3B3B3D;\n`
css_string_component += `--main-text-color: #F9F9FB;\n`
css_string_component += `--interaction-color: #2566f2;\n`
css_string_component += `background-color: var(--main-background-color);\n`
css_string_component += `color: var(--main-text-color);\n`

css_string_nav += `--main-background-color: #1B1B1D;\n`
css_string_nav += `--main-text-color: #D9D9DC;\n`

css_string_footer += `--main-background-color: #1B1B1D;\n`
css_string_footer += `--main-text-color: #D9D9DC;\n`

/*
    Function to build the CSS rules:
    - str - the css_string to append values to
    - id - the id value of the color_group
*/
let addColorDefinitions = (str, id) => {
    str += `&--${id} {\n`
    str += `--main-background-color: var(--${id}__background);\n`
    str += `--main-text-color: var(--${id}__foreground);\n`
    str += `--interaction-color: var(--${id}__interaction);\n`
    str += `}\n`    
    return str
}

// these are hardcoded default themes so the user always has at least these color_groups
css_string_component += `&--primary{`
css_string_component += `--main-background-color : ${primary_color.background_color};\n`
css_string_component += `--main-text-color : ${primary_color.foreground_color};\n`
css_string_component += `--interaction-color : ${primary_color.interaction_color};\n`
css_string_component += `}\n`

css_string_nav = addColorDefinitions(css_string_nav, 'primary')      
css_string_footer = addColorDefinitions(css_string_footer, 'primary') 

config['_inputs']['nav_color_group']['options']['values'].push({id: 'primary', name: primary_color.name})
config['_inputs']['color_group']['options']['values'].push({id: 'primary', name: primary_color.name})
config['_inputs']['footer_color_group']['options']['values'].push({id: 'primary', name: primary_color.name})
config['_inputs']['card_color_group']['options']['values'].push({id: 'primary', name: primary_color.name})
config['_inputs']['form_color_group']['options']['values'].push({id: 'primary', name: primary_color.name})

/* 
    iterate through all the user defined color_groups and:
    - create CSS variables for them
    - add them into the cloudcannon config as options for the dropdowns
*/
color_groups = color_groups.forEach((color_set, i) => {
    /* 
        generate an id for the user defined color_group to be used in CSS class and variable names
        - replace illegal characters
        - append index to end for auto-increment unique ids
    */
   
    let id = `${color_set.id.toLowerCase().replace(/[\s|&;$%@'"<>()+,]/g, "_")}`
    let name = color_set.name
    let background = color_set.background_color
    let foreground = color_set.foreground_color
    let interaction = color_set.interaction_color
    
    let obj = { name, id }
    config['_inputs']['nav_color_group']['options']['values'].push(obj)
    config['_inputs']['color_group']['options']['values'].push(obj)
    config['_inputs']['footer_color_group']['options']['values'].push(obj)
    config['_inputs']['card_color_group']['options']['values'].push(obj)
    config['_inputs']['form_color_group']['options']['values'].push(obj)
    
    css_string_root += `--${id}__background : ${background};\n`
    css_string_root += `--${id}__foreground : ${foreground};\n`
    css_string_root += `--${id}__interaction : ${interaction};\n`

    color_set.textColor = color_set.textColor == null || color_set.textColor == "" ? "#ffffff" : color_set.textColor
    color_set.primaryColor = color_set.primaryColor == null || color_set.primaryColor == "" ? "#ffffff" : color_set.primaryColor
    color_set.secondaryColor = color_set.secondaryColor == null || color_set.secondaryColor == "" ? "#ffffff" : color_set.secondaryColor
    color_set.accentColor = color_set.accentColor == null || color_set.accentColor == "" ? "#ffffff" : color_set.accentColor
    color_set.backgroundColor = color_set.backgroundColor == null || color_set.backgroundColor == "" ? "#ffffff" : color_set.backgroundColor
    
    css_string_utilities+=appendTailwindUtilityClasses(color_set,id)
    css_string_root += appendHighContrastClasses(color_set, id);
    css_string_component = addColorDefinitions(css_string_component, id)      
    css_string_nav = addColorDefinitions(css_string_nav, id)      
    css_string_footer = addColorDefinitions(css_string_footer, id)        
})
css_string_root += `}\n\n`
css_string_component += `}\n\n`
css_string_nav += `}\n\n`
css_string_footer += `}\n\n`

// adjust options for card_color_group, nav_color_group and footer_color_group
//config['_inputs']['card_color_group']['options']['values'] = Array.from(config['_inputs']['color_group']['options']['values'])
//config['_inputs']['nav_color_group']['options']['values'] = Array.from(config['_inputs']['color_group']['options']['values'])
//config['_inputs']['footer_color_group']['options']['values'] = Array.from(config['_inputs']['color_group']['options']['values'])

// write the config file with the new options
fs.writeFileSync(configFileLocation, yaml.dump(config))

// write the css strings into a single file
let css_string = `${css_string_root}${css_string_utilities}${css_string_component}${css_string_nav}${css_string_footer}`
fs.appendFileSync(colorsFileLocation, css_string)


// Process all other user defined varaibles, such as fonts
const variableFileLocation = './src/assets/styles/variables.scss'
fs.readFile(variableFileLocation, 'utf-8', (err, cssFile) => {

    if(err){
        console.log(err);
        return;
    }

    let replaced = cssFile;

    // Change the variables to whatever was set in the data file
    Object.entries(dataFile).forEach(([k,v]) => {
        k = k.split("_").join("-");
        const re = new RegExp(`--${k}: .*`, 'g')
        replaced = replaced.replace(re,`--${k}: ${v};`)
    })

    // Write result back to variables.scss
    fs.writeFile(variableFileLocation, replaced, 'utf-8', err => {
        if(err)
            console.log(err);
        
        console.log(`📚 Writing variables to ${variableFileLocation}`)
    });
});

////////////////////////////
// TAILWDIN CONFIG UPDATE //
///////////////////////////
// Why? Becuase I don't to use scss and Tailwind at the same time.

// Read theme file (e.g., theme.json)
// const themeFilePath = path.join(__dirname, '..', 'src', '_data', 'theme.yml');
// const theme = JSON.parse(fs.readFileSync(themeFilePath, 'utf-8'));

// // Read Tailwind configuration template
// const tailwindConfigPath = path.join(__dirname, '..', 'tailwind.config.js');
// const tailwindConfigTemplate = require(tailwindConfigPath);

// // Populate Tailwind configuration with theme colors
// const tailwindConfig = {
//   ...tailwindConfigTemplate,
//   theme: {
//     ...tailwindConfigTemplate.theme,
//     extend: {
//       ...tailwindConfigTemplate.theme.extend,
//       colors: {
//         ...tailwindConfigTemplate.theme.extend.colors,
//       },
//     },
//   },
// };

// const primaryColorGroup = theme.primaryColor_group;
// const customColorGroups = theme.customColor_groups;

// tailwindConfig.theme.extend.colors[primaryColorGroup.name] = {
//     textColor: primaryColorGroup.textColor,
//     backgroundColor: primaryColorGroup.backgroundColor,
//     primaryColor: primaryColorGroup.primaryColor,
//     secondaryColor: primaryColorGroup.secondaryColor,
//     accentColor: primaryColorGroup.accentColor,
// };

// customColorGroups.forEach(colorGroup => {
//   tailwindConfig.theme.extend.colors[colorGroup.name] = {
//     backgroundColor: colorGroup.backgroundColor,
//     foregroundColor: colorGroup.foregroundColor,
//     interactionColor: colorGroup.interactionColor,
//   };
// });

// // Write updated Tailwind configuration to file
// fs.writeFileSync(tailwindConfigPath, `module.exports = ${JSON.stringify(tailwindConfig, null, 2)};`);