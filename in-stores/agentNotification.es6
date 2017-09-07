import { combineLatest } from 'reactive-observables';

import createAgentNotificationsForHostSubscription from 'in-services/subscription/agentNotificationsForHost';
import createAgentNotificationsSubscription from 'in-services/subscription/agentNotifications';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import { debouncedQuery$ } from 'in-stores/search/query';

export function getAgentNotificationsForHost(snapshot) {
  return createAgentNotificationsForHostSubscription({ snapshot });
}

export function getAgentNotifications() {
  return combineLatest([timeframe$, focusedMoment$, debouncedQuery$])
    .nextFrame()
    .flatMap(([timeframe, focusedMoment, query]) => {
      query = query == null || query.length === 0 ? '' : query;
      query = query || '';
      return createAgentNotificationsSubscription({ query, focusedMoment, timeframe });
    });
}
