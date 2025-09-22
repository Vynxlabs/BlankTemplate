module.exports = function (Liquid) {
  this.registerFilter("tagColorFilter", (tagName, blacklist = []) => {
    const tailwindColors = [
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
    ];
    const hash = hashTag(tagName);
    const color = getTailwindColor(hash, blacklist);
    const shade = 100;
    const textShade = 700;
    const hoverShade = 200;
    return `bg-${color}-${shade} text-${color}-${textShade} hover:bg-${color}-${hoverShade} border-${color}-${shade}`;

    function hashTag(tagName) {
      let hash = 0;
      for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    }

    function getTailwindColor(hash, blacklist = []) {
      const availableColors = tailwindColors.filter(
        (color) => !blacklist.includes(color),
      );
      const colorIndex = hash % availableColors.length;
      return availableColors[colorIndex];
    }
  });
};
