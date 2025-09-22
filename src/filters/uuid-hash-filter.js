const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

module.exports = (uuid=uuidv4(), length = 8, base = 36) => {
    const hash = crypto.createHash('sha256').update(uuid).digest('hex'); // Generate a hex hash
    const num = BigInt('0x' + hash); // Convert to BigInt
    return num.toString(base).slice(0, length); // Convert to base-36 or base-62
};
