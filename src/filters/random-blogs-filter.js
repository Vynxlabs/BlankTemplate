module.exports=(collection, item, limit = 3, random = true)=> {
    let filteredItems = collection.filter((x) => x.url !== item.url);

    if (random) {
      let counter = filteredItems.length;

      while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        counter--;

        let temp = filteredItems[counter];

        // Swap the last element with the random one
        filteredItems[counter] = filteredItems[index];
        filteredItems[index] = temp;
      }
    }

    // Lastly, trim to length
    if (limit > 0) {
      filteredItems = filteredItems.slice(0, limit);
    }

    return filteredItems;
  }