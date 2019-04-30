import { combineLatest } from 'reactive-observables';

import { physicalPath, containerPath } from 'in-stores/navigation/paths/mainPaths';
import createSearchSubscription from 'in-subscription/search';
import { isView } from 'in-stores/navigation/navigation';
import { debouncedQuery$ } from 'in-stores/search/query';
import { alwaysNull } from 'in-services/fixedStreams';
import { createTrackingStore } from 'in-stores/store';
import { timeConfig$ } from 'in-stores/time/config';
import { view$ } from 'in-stores/view';
import { role } from 'in-stores/user';

export const searchMatches$ = createTrackingStore({
  name: 'search/searchMatches',
  observable: combineLatest([debouncedQuery$, isView(physicalPath), isView(containerPath), view$, timeConfig$])
    .flatMap(([query, isPhysicalView, isContainerView, view, timeConfig]) => {
      const isMapView = isPhysicalView || isContainerView;
      if (
        !isMapView ||
        ((query == null || query.length === 0) &&
          (role.implicitViewFilter == null || role.implicitViewFilter.length === 0))
      ) {
        return alwaysNull;
      }

      return createSearchSubscription({
        query: query || '',
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
