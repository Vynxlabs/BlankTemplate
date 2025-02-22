const { Liquid } = require("liquidjs");

module.exports = function (Liquid) {
    this.registerFilter("evalLiquid", (input, context) => {
        return true;
    });
}