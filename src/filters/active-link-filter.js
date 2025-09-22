module.exports = (itemUrl, pageUrl) => {
  let response = "";
  if(!itemUrl )
  {
    return response;
  }
  if (itemUrl === pageUrl) {
    response = ' aria-current="page"';
  }

  if (
    typeof pageUrl !== "undefined" &&
    pageUrl !== false &&
    pageUrl !== "false"
  ) {
    if (itemUrl.length > 1 && pageUrl.indexOf(itemUrl) === 0) {
      response += " data-state=active";
    }
  } 

  return response;
};
