/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function categorise(items) {
  const categories = {};

  for (let i = 0; i < items.length; i++) {
    const entry = items[i];
    if (!categories[entry.category]) {
      categories[entry.category] = [entry];
    } else {
      categories[entry.category].push(entry);
    }
  }

  return Object.keys(categories).reduce(
    (agg, category) => agg.concat({ title: category, items: categories[category] }),
    []
  );
}

export function score(items, query) {
  const parts = query
    ? query
        .toLowerCase()
        .split(' ')
        .filter(part => part.length > 0)
    : [''];

  for (let iE = 0; iE < items.length; iE++) {
    let hits = 0;
    const item = items[iE];

    if (item.subTechnologies) {
      score(item.subTechnologies, query);
      item.__score = item.subTechnologies.map(sub => sub.__score).reduce((agg, current) => Math.max(agg, current), 0);
    } else {
      for (let iP = 0; iP < parts.length; iP++) {
        const queryPart = parts[iP];
        if (getKeyWords(item).indexOf(queryPart) >= 0) {
          hits++;
        }
      }

      item.__score = hits / parts.length;
    }
  }
  return items;
}

function getKeyWords(item) {
  return item.keyWords || '';
}

export function filter(items) {
  return items
    .filter(entry => entry.__score > 0)
    .map(item => {
      if (item.subTechnologies) {
        item.subTechnologies = filter(item.subTechnologies);
      }
      return item;
    });
}
