import { create } from 'reactive-observables';
import { createLogger } from 'instalog';

import { savePinnedItems, getPinnedItems } from 'in-cockpit/api/pinnedItems';
import { deepCopy } from 'in-services/util/object';

const logger = createLogger('in-cockpit/pinnedItems/pinnedItemsStorageHandler');

let currentPinnedItems = {};
export const pinnedItems$ = create({ emitLatestOnSubscribe: true });
pinnedItems$.emit(currentPinnedItems);

getPinnedItems().once(items => {
  currentPinnedItems = items;
  pinnedItems$.emit(items);
});

export function pin(type, id) {
  let currentStarredItems = currentPinnedItems;
  if (!currentStarredItems) {
    currentStarredItems = {};
    currentStarredItems[type] = [id];
    return save(currentStarredItems);
  }

  currentStarredItems = deepCopy(currentStarredItems);
  if (!currentStarredItems[type]) {
    currentStarredItems[type] = [];
  }
  if (currentStarredItems[type].indexOf(id) === -1) {
    currentStarredItems[type].push(id);
    return save(currentStarredItems);
  }
}

export function unpin(type, id) {
  let currentStarredItems = currentPinnedItems;
  if (!currentStarredItems[type]) {
    return;
  }
  const indexOfId = currentStarredItems[type].indexOf(id);
  if (indexOfId === -1) {
    return;
  }

  currentStarredItems = deepCopy(currentStarredItems);
  currentStarredItems[type].splice(indexOfId, 1);
  save(currentStarredItems);
}

function save(value) {
  // optimistic write
  const oldValue = currentPinnedItems;
  currentPinnedItems = value;
  pinnedItems$.emit(value);

  const result$ = savePinnedItems(value);
  result$.errors().once(error => {
    // rollback on error
    currentPinnedItems = oldValue;
    pinnedItems$.emit(oldValue);
    logger.error(`failed to save pinned items (${value}): ${error.message}`, error);
  });
}
