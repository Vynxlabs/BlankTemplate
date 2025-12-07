const cheerio = require("cheerio");

module.exports = (content) => {
  if (!content) return "";

  // 1. Pre-clean: Remove HTML comments (Bookshop tags / other comments)
  // Use [\s\S] so it matches across newlines.
  let cleanHtml = content.replace(/<!--[\s\S]*?-->/g, "");

  const $ = cheerio.load(cleanHtml, {
    decodeEntities: false,
  });

  // ---------- COMPONENT TRANSFORMATIONS ----------

  // A. Images & Modals
  // - Remove <dialog> modals
  // - Unwrap image-trigger buttons to leave only the <picture>/<img>
  $("dialog").remove();

  $("button:has(picture), button:has(img)").each(function () {
    $(this).replaceWith($(this).contents());
  });

  // Remove any leftover buttons (nav, icons) that don't carry content value
  $("button").remove();

  // B. Tabs
  // Strategy:
  // - For each .tabs-tabs-wrapper:
  //   * Build a map from tab data-id -> button text
  //   * Prepend a heading to each tab-pane based on its title
  //   * Then remove headers and unwrap wrappers/containers
  $(".tabs-tabs-wrapper").each(function () {
    const wrapper = $(this);
    const titleById = {};

    wrapper.find(".tabs-tabs-header .tabs-tab-button").each(function () {
      const id = $(this).attr("data-id");
      if (!id) return;
      const title = $(this).text().trim();
      if (title) {
        titleById[id] = title;
      }
    });

    // For each tab content, inject a heading if we have a title
    wrapper.find(".tabs-tab-content").each(function () {
      const id = $(this).attr("data-id");
      const title = id && titleById[id];
      if (title) {
        $(this).prepend(`<p><strong>${title}</strong></p>`);
      }
    });
  });

  // Now flatten all tab-related wrappers
  $(".tabs-tabs-header").remove();
  $(".tabs-tabs-wrapper, .tabs-tabs-container, .tabs-tab-content").each(
    function () {
      $(this).replaceWith($(this).contents());
    }
  );

  // C. Accordions & File Trees (<details>)
  // Strategy: summary -> <p><strong>...</strong></p>, unwrap <details>
  $("details").each(function () {
    const $details = $(this);
    const $summary = $details.children("summary").first();
    const summaryText = $summary.text().trim();

    if (summaryText) {
      $summary.replaceWith(`<p><strong>${summaryText}</strong></p>`);
    } else {
      $summary.remove();
    }

    $details.replaceWith($details.contents());
  });

  // D. Task Lists (GitHub-style)
  // <ul class="task-list-container"> with <input type="checkbox">
  $("ul.task-list-container").each(function () {
    const $ul = $(this);
    $ul.removeClass("task-list-container");

    $ul.find("li").each(function () {
      const $li = $(this);
      const $checkbox = $li.find('input[type="checkbox"]').first();
      const checked = $checkbox.is(":checked");
      const prefix = checked ? "[x] " : "[ ] ";

      // Choose a primary text node container
      const $textTarget =
        $li.find("p").first().length
          ? $li.find("p").first()
          : $li.find("label").first().length
          ? $li.find("label").first()
          : $li;

      $textTarget.prepend(prefix);

      // Remove interactive elements
      $li.find("input, label").remove();
    });
  });

  // E. Unwrap content-only editorial wrappers
  // These are just layout shells; content inside is already valid HTML.
  $(".c-textBlock, .details-content, .c-videoEmbed").each(function () {
    $(this).replaceWith($(this).contents());
  });

  // F. Generic Embeds (.c-customEmbed)
  // Could be maps, iframes, widgets, etc.
  // Strategy:
  // - Look for iframe/embed/video/audio or first <a href>
  // - Replace with a descriptive link if possible
  $(".c-customEmbed").each(function () {
    const $embed = $(this);

    let url =
      $embed.find("iframe[src]").attr("src") ||
      $embed.find("embed[src]").attr("src") ||
      $embed.find("video[src]").attr("src") ||
      $embed.find("audio[src]").attr("src") ||
      $embed.find("a[href]").attr("href");

    if (url) {
      $embed.replaceWith(
        `<p><em>(Embedded content) <a href="${url}">View content</a></em></p>`
      );
    } else {
      // No usable URL – leave a placeholder note
      $embed.replaceWith(
        `<p><em>(Embedded content not shown in RSS. Visit the website to view.)</em></p>`
      );
    }
  });

  // G. Video Embeds (lite-vimeo / lite-youtube)
  // Convert to plain links
  $("lite-vimeo").each(function () {
    const id = $(this).attr("videoid");
    if (id) {
      $(this).replaceWith(
        `<p><em>(Video embed) <a href="https://vimeo.com/${id}">Watch on Vimeo</a></em></p>`
      );
    } else {
      $(this).remove();
    }
  });

  $("lite-youtube").each(function () {
    const id = $(this).attr("videoid");
    if (id) {
      $(this).replaceWith(
        `<p><em>(Video embed) <a href="https://youtube.com/watch?v=${id}">Watch on YouTube</a></em></p>`
      );
    } else {
      $(this).remove();
    }
  });

  // H. Callouts / Errors / Info
  // Convert to <blockquote> for nicer rendering
  $(".error, .warning, .info").each(function () {
    const innerHtml = $(this).html();
    $(this).replaceWith(`<blockquote>${innerHtml}</blockquote>`);
  });

  // I. Mermaid graphs: treat as code
  $("pre.mermaid").each(function () {
    const text = $(this).text();
    $(this)
      .empty()
      .removeClass("mermaid")
      .append(`<code class="language-mermaid">${text}</code>`);
  });

  // ---------- CLEANUP ----------

  // Remove <script> and <style> outright
  $("script, style").remove();

  // Strip "JS-y" attributes & classes, but keep essentials.
  $("*").each(function () {
    const el = this;
    const tag = el.tagName && el.tagName.toLowerCase();

    const allowedGlobal = ["src", "href", "alt", "width", "height", "srcset", "sizes"];
    const allowedPerTag = {
      img: ["src", "srcset", "sizes", "alt", "width", "height"],
      a: ["href"],
      code: ["class"], // preserve language-* for syntax highlighting
      table: ["summary"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    };

    const allowed = new Set([
      ...allowedGlobal,
      ...(allowedPerTag[tag] || []),
    ]);

    const newAttribs = {};
    for (const [key, value] of Object.entries(el.attribs || {})) {
      if (allowed.has(key)) {
        newAttribs[key] = value;
      }
    }
    el.attribs = newAttribs;
  });

  // Return only the body HTML (not full <html><head><body> wrapper)
  return $("body").html().trim();
};
