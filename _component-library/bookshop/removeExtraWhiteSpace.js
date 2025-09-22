module.exports = function (Liquid) {
    this.registerFilter('removeExtraWhitespace', (text) => {
        return text.replace(/\s+/g, ' ').trim();
    });
}