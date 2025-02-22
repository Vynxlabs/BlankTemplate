module.exports = (id) => {
  if (id[0] === "#") {
    return id.substring(1);
  }
  return id;
};
