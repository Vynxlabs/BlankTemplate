const cheerio = require('cheerio');

module.exports = (content) => {
  if (!content) return "";

  // 1. Pre-clean: Remove HTML comments (Bookshop tags)
  // We do this via Regex first because it's faster for bulk comment removal
  let cleanHtml = content.replace(/<\!--.*?-->/g, "");

  const $ = cheerio.load(cleanHtml, { 
    decodeEntities: false 
  });

  // --- COMPONENT TRANSFORMATIONS ---

  // A. Handle Images & Modals
  // Your code duplicates images: one in a button (trigger) and one in a dialog (modal).
  // Strategy: Delete the modal, unwrap the trigger button to leave just the image.
  $('dialog').remove(); 
  $('button:has(picture), button:has(img)').each(function() {
    $(this).replaceWith($(this).children());
  });
  // Remove any leftover UI buttons
  $('button').remove();

  // B. Handle Tabs
  // Strategy: Remove the tab navigation headers. Flatten content panes so they appear sequentially.
  $('.tabs-tabs-header').remove();
  $('.tabs-tabs-wrapper, .tabs-tabs-container, .tabs-tab-content').each(function() {
    // Replace the wrapper with just its inner content
    $(this).replaceWith($(this).contents());
  });

  // C. Handle Accordions & File Trees (<details>)
  // Strategy: Convert <summary> to a <strong> header. Unwrap the <details> tag.
  $('details').each(function() {
    const summary = $(this).find('> summary');
    const summaryText = summary.text().trim();
    
    // Create a visual header for the section
    summary.replaceWith(`<p><strong>${summaryText}</strong></p>`);
    
    // Unwrap the details tag, leaving the summary text + content exposed
    $(this).replaceWith($(this).contents());
  });

  // D. Handle Video Embeds (lite-vimeo / lite-youtube)
  // RSS readers cannot run the scripts needed for these custom elements.
  $('lite-vimeo').each(function() {
    const id = $(this).attr('videoid');
    // Replace with a text link
    $(this).replaceWith(`<p><em>(Video embed) <a href="https://vimeo.com/${id}">Watch on Vimeo</a></em></p>`);
  });
  // (Add similar logic for 'lite-youtube' if you use it)

  // E. Handle Callouts / Errors
  $('.error, .warning, .note').each(function() {
    // Convert to blockquote which readers render nicely
    const inner = $(this).html();
    $(this).replaceWith(`<blockquote>${inner}</blockquote>`);
  });

  // --- CLEANUP ---

  // 3. Remove all attributes that cause bloat or rely on JS
  // We keep 'src', 'href', 'alt', 'width', 'height' for images/links
  // We strip classes, ids, styles, and script handlers
  $('*').each(function() {
    this.attribs = Object.keys(this.attribs).reduce((acc, key) => {
      if (['src', 'href', 'alt', 'width', 'height', 'srcset', 'sizes'].includes(key)) {
        acc[key] = this.attribs[key];
      }
      return acc;
    }, {});
  });

  return $.html();
};