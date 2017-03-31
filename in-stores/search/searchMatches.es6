import { combineLatest } from 'reactive-observables';

import createSearchSubscription from 'in-services/subscription/search';
import { debouncedQuery$ } from 'in-stores/search/query';
import { isMapView$ } from 'in-stores/navigation/view';
import { alwaysNull } from 'in-services/fixedStreams';
import { createTrackingStore } from 'in-stores/store';
import { focusedMoment$ } from 'in-stores/timeline';
import { view$ } from 'in-stores/view';
import { role } from 'in-stores/user';

export const searchMatches$ = createTrackingStore({
  name: 'search/searchMatches',
  observable: combineLatest([debouncedQuery$, focusedMoment$, isMapView$, view$])
    .flatMap(([query, focusedMoment, isMapView, view]) => {
      if (
        !isMapView ||
        ((query == null || query.length === 0) &&
          (role.implicitViewFilter == null || role.implicitViewFilter.length === 0))
      ) {
        return alwaysNull;
      }

      return createSearchSubscription({
        query: query || '',
        time: focusedMoment,
        view
      });
    })
    .distinct()
}).observable;
