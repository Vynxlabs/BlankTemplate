const { JSDOM } = require("jsdom");
// optional: const sanitizeHtml = require("sanitize-html");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("sanitizeForRss", function (html) {
    if (!html) return "";

    // Wrap in <body> so we always have a root.
    const dom = new JSDOM(`<body>${html}</body>`);
    const document = dom.window.document;

    // 1) Remove bookshop comments
    const walker = document.createTreeWalker(
      document,
      dom.window.NodeFilter.SHOW_COMMENT
    );
    const commentsToRemove = [];
    let n;
    while ((n = walker.nextNode())) {
      if (n.data.includes("bookshop-live")) {
        commentsToRemove.push(n);
      }
    }
    commentsToRemove.forEach((c) => c.parentNode.removeChild(c));

    // helper: unwrap elements (move children up, delete wrapper)
    function unwrapAll(selector) {
      document.querySelectorAll(selector).forEach((el) => {
        while (el.firstChild) {
          el.parentNode.insertBefore(el.firstChild, el);
        }
        el.remove();
      });
    }

    // 2) Accordions: <details> -> <h3>Summary</h3> + content
    document.querySelectorAll("details").forEach((details) => {
      const replacement = document.createElement("div");
      const summary = details.querySelector("summary");

      if (summary) {
        const heading = document.createElement("h3");
        heading.textContent = summary.textContent.trim();
        replacement.appendChild(heading);
      }

      // All siblings after the summary
      const children = Array.from(details.childNodes);
      let afterSummary = !summary;
      for (const child of children) {
        if (!afterSummary && child === summary) {
          afterSummary = true;
          continue;
        }
        if (afterSummary) {
          replacement.appendChild(child.cloneNode(true));
        }
      }

      details.replaceWith(replacement);
    });

    // 3) Tabs: .tabs-tabs-wrapper -> headings + content
    document.querySelectorAll(".tabs-tabs-wrapper").forEach((wrapper) => {
      const container = document.createElement("div");
      const buttons = wrapper.querySelectorAll(".tabs-tab-button");

      buttons.forEach((btn) => {
        const tabId = btn.getAttribute("data-id");
        const title = btn.textContent.trim();
        const heading = document.createElement("h3");
        heading.textContent = title;
        container.appendChild(heading);

        if (tabId) {
          const pane = wrapper.querySelector(
            `.tabs-tab-content[data-id="${tabId}"]`
          );
          if (pane) {
            Array.from(pane.childNodes).forEach((child) =>
              container.appendChild(child.cloneNode(true))
            );
          }
        }
      });

      wrapper.replaceWith(container);
    });

    // 4) Task list: convert checkboxes to [x]/[ ]
    document.querySelectorAll("ul.task-list-container").forEach((ul) => {
      ul.classList.remove("task-list-container");
      ul.querySelectorAll("li").forEach((li) => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const checked = checkbox && checkbox.checked;
        const prefix = checked ? "[x] " : "[ ] ";

        // choose a node to insert text into
        const textTarget =
          li.querySelector("p") || li.querySelector("label") || li;
        if (textTarget) {
          textTarget.insertBefore(
            document.createTextNode(prefix),
            textTarget.firstChild
          );
        }

        // remove interactive elements
        li.querySelectorAll("input, label").forEach((node) => node.remove());
      });
    });

    // 5) File tree: keep nested <ul>, drop .ultree wrapper & <details>
    document.querySelectorAll(".ultree").forEach((tree) => {
      // unwrap <details> but keep summary text
      tree.querySelectorAll("details").forEach((d) => {
        const summary = d.querySelector("summary");
        const nestedUl = d.querySelector("ul");
        const li = document.createElement("li");
        if (summary) {
          li.textContent = summary.textContent.trim();
        }
        if (nestedUl) {
          li.appendChild(nestedUl.cloneNode(true));
        }
        d.replaceWith(li);
      });

      const firstUl = tree.querySelector("ul");
      if (firstUl) {
        tree.replaceWith(firstUl);
      } else {
        tree.remove();
      }
    });

    // 6) Callouts: .error (etc) -> <blockquote>
    document.querySelectorAll(".error, .warning, .info").forEach((div) => {
      const bq = document.createElement("blockquote");
      Array.from(div.childNodes).forEach((child) =>
        bq.appendChild(child.cloneNode(true))
      );
      div.replaceWith(bq);
    });

    // 7) customEmbed (Google Maps): iframe -> link
    document.querySelectorAll(".c-customEmbed iframe").forEach((iframe) => {
      const src = iframe.getAttribute("src");
      if (!src) {
        iframe.remove();
        return;
      }
      const p = document.createElement("p");
      p.appendChild(document.createTextNode("Map: "));
      const a = document.createElement("a");
      a.href = src;
      a.textContent = "View map";
      p.appendChild(a);

      const wrapper = iframe.closest(".c-customEmbed") || iframe;
      wrapper.replaceWith(p);
    });

    // 8) Video embeds -> simple link
    function replaceVideoNode(node) {
      let url = null;

      // existing link, if any
      const existingLink = node.querySelector("a[href]");
      if (existingLink) {
        url = existingLink.getAttribute("href");
      }

      const liteYt = node.tagName === "LITE-YOUTUBE" ? node : node.querySelector("lite-youtube");
      const liteVimeo = node.tagName === "LITE-VIMEO" ? node : node.querySelector("lite-vimeo");

      if (!url && liteYt) {
        const id = liteYt.getAttribute("videoid");
        if (id) url = `https://youtube.com/watch?v=${id}`;
      }

      if (!url && liteVimeo) {
        const id = liteVimeo.getAttribute("videoid");
        if (id) url = `https://vimeo.com/${id}`;
      }

      if (!url) {
        node.remove();
        return;
      }

      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = url;
      a.textContent = "Watch video";
      p.appendChild(a);
      node.replaceWith(p);
    }

    document.querySelectorAll("lite-youtube, lite-vimeo, .c-videoEmbed").forEach(replaceVideoNode);

    // 9) Image modal: keep <img> only
    document.querySelectorAll("button.c-snippetImageModal").forEach((btn) => {
      const img = btn.querySelector("img");
      if (img) {
        btn.replaceWith(img);
      } else {
        btn.remove();
      }
    });
    document.querySelectorAll("dialog").forEach((d) => d.remove());

    // 10) Mermaid graphs: wrap text in <code>
    document.querySelectorAll("pre.mermaid").forEach((pre) => {
      const text = pre.textContent;
      pre.textContent = "";
      pre.className = "";
      const code = document.createElement("code");
      code.className = "language-mermaid";
      code.textContent = text;
      pre.appendChild(code);
    });

    // 11) Unwrap common structural wrappers
    unwrapAll(".c-textBlock");
    unwrapAll(".details-content");

    // 12) Strip prism token markup in <pre><code>
    document.querySelectorAll("pre code").forEach((code) => {
      code.textContent = code.textContent; // nukes inner spans, keeps text
    });

    // 13) Strip “JS-y” attributes
    const attrToStrip = ["tabindex", "style", "_", "data-id", "data-tab", "data-active"];
    attrToStrip.forEach((attr) => {
      document.querySelectorAll(`[${attr}]`).forEach((el) =>
        el.removeAttribute(attr)
      );
    });

    // 14) Optional: sanitize / whitelist tags & attrs
    let result = document.body.innerHTML.trim();

    /*
    result = sanitizeHtml(result, {
      allowedTags: [
        "p", "h1", "h2", "h3", "h4",
        "ul", "ol", "li",
        "em", "strong", "a",
        "img", "pre", "code", "blockquote",
        "hr", "table", "thead", "tbody", "tr", "th", "td"
      ],
      allowedAttributes: {
        a: ["href"],
        img: ["src", "alt"],
        code: ["class"]
      },
      allowedSchemes: ["http", "https", "mailto"]
    });
    */

    return result;
  });
};
