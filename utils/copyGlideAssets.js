// utils/copy-glide-assets.js

const fs = require("fs");
const path = require("path");

const glideSource = path.resolve("node_modules/@glidejs/glide/dist/glide.min.js");
const glideTarget = path.resolve("src/assets/js/glide.js");

fs.mkdirSync(path.dirname(glideTarget), { recursive: true });

fs.copyFile(glideSource, glideTarget, (err) => {
  if (err) {
    console.error("❌ Failed to copy Glide JS:", err);
  } else {
    console.log("✅ Glide JS copied to:", glideTarget);
  }
});
