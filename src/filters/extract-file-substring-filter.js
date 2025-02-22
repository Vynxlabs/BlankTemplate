module.exports = (filepath) => {
    // Split the filepath into parts
    const parts = filepath.split('/');
  console.log(parts)
    // Remove the first empty element (from leading slash) and the last element if needed
    parts.shift(); // Remove the first part which is always empty due to the leading '/'
    parts.shift()
    if (parts.length > 0) {
      parts.pop(); // Remove the last part to exclude the final segment
    }
    console.log(parts)
    // Join the remaining parts into the substring
    return parts.join('/')+"/";
  };
  