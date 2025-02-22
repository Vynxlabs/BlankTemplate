module.exports = function (Liquid) {
  this.registerFilter("stringifyFilter", (obj) => {
    const objString = JSON.stringify(obj);
    return objString;
  });
};
