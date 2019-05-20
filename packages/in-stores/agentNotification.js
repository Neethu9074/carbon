import { combineLatest } from 'reactive-observables';

import createAgentNotificationsForHostSubscription from 'in-subscription/agentNotificationsForHost';
import createAgentNotificationsSubscription from 'in-subscription/agentNotifications';
import { debouncedQuery$ } from 'in-stores/search/query';
import { timeConfig$ } from 'in-stores/time/config';

export function getAgentNotificationsForHost(snapshot) {
  return createAgentNotificationsForHostSubscription({ snapshot });
}

export function getAgentNotifications() {
  return combineLatest([timeConfig$, debouncedQuery$])
    .nextFrame()
    .flatMap(([timeConfig, query]) => {
      query = query == null || query.length === 0 ? '' : query;
      query = query || '';
      return createAgentNotificationsSubscription({ query, timeConfig });
    });
}
