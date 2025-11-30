const fs = require('fs');
const yaml = require('js-yaml');

// Cache theme so we're not rereading every time
let themeCache = null;
function loadTheme() {
  if (!themeCache) {
    themeCache = yaml.load(fs.readFileSync('src/_data/theme.yml', 'utf-8'));
  }
  return themeCache;
}

// Same normalization pattern you use in fetch-theme-variables
function normalizeId(id) {
  if (!id) return '';
  return id.toLowerCase().replace(/[\s|&;$%@'"<>()+,]/g, "_");
}

function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  const value = hex.replace('#', '');
  const bigint = parseInt(value, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function getBrightness(hex) {
  const { r, g, b } = hexToRgb(hex);
  // Same weights as your high-contrast CSS
  return (r * 299 + g * 587 + b * 114) / 1000;
}

module.exports = (colorGroupId) => {
      if (!colorGroupId) return '';

    const theme = loadTheme();

    const primary = theme.primaryColor_group || {};
    const customs = theme.customColor_groups || [];

    // Collect all groups into one list with normalized IDs
    const allGroups = [
      {
        ...primary,
        _normalizedId: 'primary', // you can also normalize primary.id if you use it
      },
      ...customs.map(g => ({
        ...g,
        _normalizedId: normalizeId(g.id || g.name),
      })),
    ];

    const normalizedInputId = normalizeId(colorGroupId);
    const group =
      allGroups.find(g => g._normalizedId === normalizedInputId) || null;

    if (!group) {
      // Unknown group; safest to treat as light mode
      return '';
    }

    const bg = group.backgroundColor || '#000000';
    const text = group.textColor || '#ffffff';

    const bgBrightness = getBrightness(bg);
    const textBrightness = getBrightness(text);

    // If background is darker than text, treat as "dark mode"
    if (bgBrightness < textBrightness) {
      return 'dark';
    }

    return '';
};