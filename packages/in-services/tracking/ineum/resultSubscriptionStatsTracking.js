/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { timeConfig$ } from 'in-stores/time/config';
import { ineum } from 'in-services/tracking/ineum';

let globalTimeConfig;
const pendingSubscriptions = new Map();

timeConfig$.subscribe(timeConfig => (globalTimeConfig = timeConfig));

// To support execution as part of tests
if (typeof document !== 'undefined') {
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.visibilityState !== 'visible') {
        pendingSubscriptions.clear();
      }
    },
    false
  );
}

// This tracker observes the side-effects our subscription system supports.
// See: packages/in-subscription/subscription.js
export const tracker = {
  onStart: ({ subscriptionId, event, payload }) => {
    if (document && document.visibilityState !== 'visible') {
      // Tracking does not make sense when the document is hidden. In these cases the
      // optimizations in the subscription system will not result in reliable data.
      return;
    }

    pendingSubscriptions.set(subscriptionId, {
      event,
      payload,
      start: Date.now()
    });
  },

  onData: ({ subscriptionId }, data) => {
    const subscription = pendingSubscriptions.get(subscriptionId);
    if (!subscription) {
      return;
    }

    if (data.progress.loading) {
      if (subscription.timeTillLoadingState == null) {
        subscription.timeTillLoadingState = Date.now() - subscription.start;
      }
      return;
    }

    pendingSubscriptions.delete(subscriptionId);
    const eventName = `subscription.${subscription.event}`;
    const timeTillFirstData = Date.now() - subscription.start;
    const meta = {
      subscriptionId,
      subscribeEvent: subscription.event,
      subscriptionPayload: subscription.payload,
      autoRefresh: globalTimeConfig.autoRefresh,
      windowSize: globalTimeConfig.windowSize
    };

    if (subscription.timeTillLoadingState) {
      meta.timeTillLoadingState = subscription.timeTillLoadingState;
    }

    if (data.errors.length > 0) {
      meta.backendErrors = data.errors;
      ineum('reportEvent', eventName, {
        duration: timeTillFirstData,
        error: new Error('Received failing result from backend'),
        meta
      });
    } else {
      ineum('reportEvent', eventName, {
        duration: timeTillFirstData,
        meta
      });
    }
  },

  onStop: ({ subscriptionId }) => {
    pendingSubscriptions.delete(subscriptionId);
  }
};
