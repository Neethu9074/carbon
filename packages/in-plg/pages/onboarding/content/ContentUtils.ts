/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import ContentProps, { SubTechnology } from 'in-plg/pages/onboarding/content/ContentProps';

export function scoreSubTechnology(item: SubTechnology, query: string): SubTechnology {
  const parts = query
    ? query
        .toLowerCase()
        .split(' ')
        .filter(part => part.length > 0)
    : [''];

  const hits = parts.reduce((count, queryPart) => {
    return count + (getKeyWords(item).includes(queryPart) ? 1 : 0);
  }, 0);

  item.__score = hits / parts.length;
  return item;
}

export function scoreItem(item: ContentProps, query: string): ContentProps {
  const parts = query
    ? query
        .toLowerCase()
        .split(' ')
        .filter(part => part.length > 0)
    : [''];

  if (item.subTechnology) {
    scoreSubTechnology(item.subTechnology, query);
    item.__score = item.subTechnology.__score;
  } else {
    const hits = parts.reduce((count, queryPart) => {
      return count + (getKeyWords(item).includes(queryPart) ? 1 : 0);
    }, 0);

    item.__score = hits / parts.length;
  }

  return item;
}

export function score(items: ContentProps[], query: string): Array<ContentProps> {
  return items.map(item => scoreItem(item, query));
}

export function filter(items: ContentProps[]): Array<ContentProps> {
  return items.filter(entry => entry.__score ?? 0 > 0);
}

function getKeyWords(item: SubTechnology): string {
  return item.keyWords ?? '';
}
