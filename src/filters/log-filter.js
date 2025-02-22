module.exports = (obj) => {
    const objString = JSON.stringify(obj, null, 4);
    console.log(objString)
    return objString
};