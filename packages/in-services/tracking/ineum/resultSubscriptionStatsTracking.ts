/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { SubscriptionDescription } from 'in-connection/types';
import { timeConfig$ } from 'in-stores/time/config';
import { ineum } from 'in-services/tracking/ineum';
import { TimeConfig } from 'in-types/time';
import { Result } from 'in-types/backend';

interface PendingSubscription {
  event: string;
  payload: any;
  start: number;
  timeTillLoadingState?: number;
}

let globalTimeConfig: TimeConfig;
const pendingSubscriptions = new Map<number, PendingSubscription>();

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

export function onStart({ subscriptionId, event, payload }: SubscriptionDescription<any>) {
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
}

export function onStop({ subscriptionId }: SubscriptionDescription<any>) {
  pendingSubscriptions.delete(subscriptionId);
}

export function onData({ subscriptionId }: SubscriptionDescription<any>, data: Result<any>) {
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
  const meta: {
    [key: string]: any;
  } = {
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
}
