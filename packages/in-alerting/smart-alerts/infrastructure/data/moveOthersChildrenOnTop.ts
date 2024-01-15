/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagCatalog, TagTreeLevel } from '@instana/types';

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
