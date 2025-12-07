const jsonpath = require('jsonpath');

module.exports = (data, path) => {
    return jsonpath.query(data, path);
};