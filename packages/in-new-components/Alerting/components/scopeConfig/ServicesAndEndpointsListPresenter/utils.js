/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export const DEFAULT_PAGE_SIZE = 5;

export function enrichListWithStaleSelectionData(entitySelection, listData) {
  const list = [...listData];
  entitySelection.forEach(([key, value]) => {
    if (!list.some(it => it.item.id == key)) {
      list.push({ item: { ...value, label: key, isStaleItem: true } });
    }
  });
  return list;
}

export function createNoMatchingEntityText(entityType) {
  return `No matching ${entityType}`;
}

export function getFilteredListBySelectionState(listData, enhanceParentIdsWithChildId, hasUserInteractedWithItem) {
  const itemsUserInteractedWith = listData.filter(({ item: { id, isStaleItem } }) => {
    const itemTreeIds = enhanceParentIdsWithChildId(id);
    return hasUserInteractedWithItem(itemTreeIds) || isStaleItem; // a stale item is an item the user has interacted with, so it's also sorted to the top of the list
  });
  return itemsUserInteractedWith;
}
