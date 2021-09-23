/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';

// eslint-disable-next-line no-restricted-imports
import { view$ } from 'in-infrastructure/perspectives';
import { physicalPath, containerPath } from 'in-stores/navigation/paths/mainPaths';
import createSearchSubscription from 'in-subscription/search';
import { isView } from 'in-stores/navigation/navigation';
import { debouncedQuery$ } from 'in-stores/search/query';
import { alwaysNull } from 'in-services/fixedStreams';
import { createTrackingStore } from 'in-stores/store';
import { timeConfig$ } from 'in-stores/time/config';

export const searchMatches$ = createTrackingStore({
  name: 'search/searchMatches',
  observable: combineLatest([debouncedQuery$, isView(physicalPath), isView(containerPath), view$, timeConfig$])
    .flatMap(([query, isPhysicalView, isContainerView, view, timeConfig]) => {
      const isMapView = isPhysicalView || isContainerView;
      if (!isMapView || query == null || query.length === 0) {
        return alwaysNull;
      }

      return createSearchSubscription({
        query: filterEntitiesWithMonitoringEvents(query),
        view,
        timeConfig
      });
    })
    .distinct()
}).observable;

export function search({ query }) {
  return timeConfig$.flatMap(timeConfig => {
    return createSearchSubscription({
      query,
      timeConfig,
      view: 'TABLE'
    });
  });
}

function filterEntitiesWithMonitoringEvents(query) {
  if (!query) {
    return '';
  } else if (
    (query.includes('event.severity') || query.includes('event.state')) &&
    !query.includes('monitoringIssue')
  ) {
    // For now if not explicitly filtering on Monitoring Issues, leave them out from the Infra map
    return `(!event.type:agent_monitoring_issue) AND (${query.trim()})`;
  }
  return query;
}
