module.exports = function (Liquid) {
    this.registerFilter('removeExtraWhitespace', (text) => {
        return str.replace(/\s+/g, ' ').trim();
    });
}