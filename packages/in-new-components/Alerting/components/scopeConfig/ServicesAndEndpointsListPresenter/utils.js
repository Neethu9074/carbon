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

export function sortListBySelectionState(listData, enhanceParentIdsWithChildId, hasUserInteractedWithItem) {
  return [...listData].sort((a, b) => {
    const aInteractedState = Boolean(
      hasUserInteractedWithItem(enhanceParentIdsWithChildId(a.item.id)) || a.item.isStaleItem
    );
    const bInteractedState = Boolean(
      hasUserInteractedWithItem(enhanceParentIdsWithChildId(b.item.id)) || b.item.isStaleItem
    );
    return bInteractedState - aInteractedState;
  });
}
