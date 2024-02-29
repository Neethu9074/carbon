/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagCatalog, TagTreeLevel } from '@instana/types';

import { EnrichedTagCatalog, enrichTagCatalog } from 'in-services/tags/tagCatalog';

function isParentWithOthersLabel(n: TagTreeLevel) {
  return n.label === 'Others' && n.type === 'LEVEL';
}

export const moveOthersChildrenOnTop = (tagCat: TagCatalog) => {
  const { tagTree } = tagCat;

  const others = tagTree.find(isParentWithOthersLabel);
  if (others) {
    const { children } = others;
    return {
      ...tagCat,
      tagTree: [...(children ?? []), ...tagTree.filter(n => !isParentWithOthersLabel(n))]
    };
  }
  return tagCat;
};

export const groupbyTag = (groupBy: string[]) => {
  return groupBy.map(tag => {
    return { groupbyTag: tag, tagType: 'STRING' };
  });
};

export function getGroupByTagCatalog(tagCatalog: TagCatalog): EnrichedTagCatalog {
  const tagCatalogWithoutOthers = moveOthersChildrenOnTop(tagCatalog);
  return enrichTagCatalog({
    tagTree: tagCatalogWithoutOthers.tagTree as TagTreeLevel[],
    tags: tagCatalogWithoutOthers.tags
  });
}
