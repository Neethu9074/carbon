import { just } from 'reactive-observables';

import {
  pin as saveItem,
  unpin as deleteItem,
  getPinnedItems$
} from 'in-cockpit/pinnedItems/pinnedItemsStorageHandler';

export const types = {
  WEBSITES: 'website',
  APPLCATIONS: 'applications',
  HOSTS: 'hosts',
  CONTAINER: 'containers',
  PROCESSES: 'processes',
  MOBILE_APPS: 'mobileApplications'
};

// export for test
export function getPinnedItems(itemTypes) {
  return getPinnedItems$.map(items => {
    const ids = {};
    itemTypes.forEach(type => (ids[type] = items[type] || []));
    return ids;
  });
}

export function getgetPinnedItems({ timeConfig, getgetPinnedItems$, idsByType }) {
  const subscription = getgetPinnedItems$(idsByType, timeConfig);
  if (!subscription) {
    return just(createResult([]));
  }
  return subscription.map(createResult);
}

export function pin(type, id) {
  saveItem(type, id);
}

export function unpin(type, id) {
  deleteItem(type, id);
}

function createResult(items) {
  return {
    data: {
      items
    }
  };
}
