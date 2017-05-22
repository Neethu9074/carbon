import { on as reactiveOn } from 'reactive-observables';
import invariant from 'invariant';

import { getDataEvent } from 'in-services/subscription/dataEvent';
import { on, off, emit } from 'in-services/persistentConnection';

// {
//   <id>: {
//     subscriptionId
//     event: 'event to send to establish subscription'
//     payload: 'payload to be send to establish subscription'
//     lastData: 'last retrieved data point',
//     dataListener: 'function used to read data from socket'
//   }
// }
export const activeSubscriptions = new Map();

// How long it takes until the subscriptions are disposed backend wise when the
// browser tab is no longer visible.
const timeUntilDisposingSubscriptionsForHiddenUi = 1000 * 60;

// Whether or not the backend is currently informed aboute active subscriptions.
let isSubscriptionsActive = false;

export function subscribe(subscriptionId, event, payload, disposeSubscriptionOnDocumentHidden = true) {
  if (__DEV__) {
    invariant(!activeSubscriptions.has(subscriptionId), 'Multiple subscriptions with the same id are not possible!');
  }

  const subscription = activeSubscriptions.set(subscriptionId, {
    subscriptionId,
    event,
    payload,
    lastData: undefined,
    disposeSubscriptionOnDocumentHidden,
    dataListener
  });

  if (payload.subscriptionId === subscriptionId) {
    on(getDataEvent(subscriptionId), dataListener);
  }

  if (isSubscriptionsActive || !subscription.disposeSubscriptionOnDocumentHidden) {
    emit(event, payload);
  }

  function dataListener(data) {
    subscription.lastData = data;
  }
}

export function unsubscribe(subscriptionId) {
  if (isSubscriptionsActive) {
    emit('unsubscribe', { subscriptionId });
  }

  const subscription = activeSubscriptions.get(subscriptionId);
  off(getDataEvent(subscriptionId), subscription.dataListener);
  activeSubscriptions.delete(subscriptionId);
}

export function init() {
  on('server-initialized', () => {
    if (!isSubscriptionsActive) {
      isSubscriptionsActive = true;
      activeSubscriptions.forEach(activeSubscription => emit(activeSubscription.event, activeSubscription.payload));
    }
  });

  on('reconnect', () => (isSubscriptionsActive = false));

  // We dispose all subscriptions server side when the window is hidden for a few
  // minutes. We do this to avoid buffering a large amount of data in the UI
  const documentVisibility$ = reactiveOn(document, 'visibilitychange').map(() => document.hidden);

  documentVisibility$.debounce(timeUntilDisposingSubscriptionsForHiddenUi).filter(hidden => hidden).subscribe(() => {
    if (isSubscriptionsActive) {
      isSubscriptionsActive = false;
      unsubscribeAllFromBackendWhichCanBeAutoDisposed();
    }
  });

  documentVisibility$.filter(hidden => !hidden).subscribe(() => {
    if (!isSubscriptionsActive) {
      isSubscriptionsActive = true;
      subscribeAllToBackendWhichCanBeAutoDisposed();
    }
  });
}

// We want to reduce the overhead of channels on the network. Example: A metric
// subscription would need to include the hostId, plugin, steadyId, metric
// name and possibly other pieces of information in order to route messages.
// This is way too much overhead. We want to route messages based on a single
// numeric value. This is what these IDs are for. We include a single ID in
// server responses to reduce the overhead.
let idCounter = 0;

export function getNewSubscriptionId() {
  return idCounter++;
}

function subscribeAllToBackendWhichCanBeAutoDisposed() {
  activeSubscriptions.forEach(activeSubscription => {
    if (activeSubscription.disposeSubscriptionOnDocumentHidden) {
      emit(activeSubscription.event, activeSubscription.payload);
    }
  });
}

function unsubscribeAllFromBackendWhichCanBeAutoDisposed() {
  activeSubscriptions.forEach(activeSubscription => {
    if (activeSubscription.disposeSubscriptionOnDocumentHidden) {
      emit('unsubscribe', { subscriptionId: activeSubscription.subscriptionId });
    }
  });
}
