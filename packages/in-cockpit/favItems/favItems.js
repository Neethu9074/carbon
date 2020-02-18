import { just } from 'reactive-observables';

import { set, unset, favItems$ } from 'in-cockpit/favItems/favItemsStorageHandler';

export const types = {
  WEBSITES: 'website',
  APPLCATIONS: 'applications',
  INFRASTRUCTURE: 'infrastructure',
  MOBILE_APPS: 'mobileApplications'
};

// export for test
export function getFavItemIds(favItemTypes) {
  return favItems$.map(items => {
    const ids = {};
    favItemTypes.forEach(type => (ids[type] = items[type] || []));
    return ids;
  });
}

export function getFavItems({ timeConfig, getFavItems$, idsByType }) {
  const subscription = getFavItems$(idsByType, timeConfig);
  if (!subscription) {
    return just(createResult([]));
  }
  return subscription.map(createResult);
}

export function favoriseItem(type, id) {
  set(type, id);
}

export function unfavoriseItem(type, id) {
  unset(type, id);
}

function createResult(items) {
  return {
    data: {
      items
    }
  };
}
