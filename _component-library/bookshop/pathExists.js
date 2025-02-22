module.exports = function (Liquid) {
    this.registerFilter('pathExists', (filePath) => {
        return filePath;
    });
}