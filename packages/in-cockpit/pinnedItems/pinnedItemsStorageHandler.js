import { settings$, setSingle, getSingle } from 'in-services/settings/settings';
import { deepCopy } from 'in-services/util/object';

const settingsKey = 'starred_items';

export const getPinnedItems$ = settings$.map(settings => settings[settingsKey] || {});

export function pin(type, id) {
  let currentStarredItems = getSingle(settingsKey);
  if (!currentStarredItems) {
    currentStarredItems = {};
    currentStarredItems[type] = [id];
    return setSingle(settingsKey, currentStarredItems);
  }

  currentStarredItems = deepCopy(currentStarredItems);
  if (!currentStarredItems[type]) {
    currentStarredItems[type] = [];
  }
  if (currentStarredItems[type].indexOf(id) === -1) {
    currentStarredItems[type].push(id);
    return setSingle(settingsKey, currentStarredItems);
  }
}

export function unpin(type, id) {
  let currentStarredItems = getSingle(settingsKey, {});
  if (!currentStarredItems[type]) {
    return;
  }
  const indexOfId = currentStarredItems[type].indexOf(id);
  if (indexOfId === -1) {
    return;
  }

  currentStarredItems = deepCopy(currentStarredItems);
  currentStarredItems[type].splice(indexOfId, 1);
  setSingle(settingsKey, currentStarredItems);
}
