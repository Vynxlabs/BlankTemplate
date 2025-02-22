const { v4: uuidv4 } = require('uuid');

module.exports = value => {
 
  return value+uuidv4();
};