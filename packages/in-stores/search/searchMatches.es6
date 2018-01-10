import { combineLatest } from 'reactive-observables';

import { physicalPath, logicalPath, containerPath } from 'in-stores/navigation/paths/mainPaths';
import createSearchSubscription from 'in-subscription/search';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import { isView } from 'in-stores/navigation/navigation';
import { debouncedQuery$ } from 'in-stores/search/query';
import { alwaysNull } from 'in-services/fixedStreams';
import { createTrackingStore } from 'in-stores/store';
import { view$ } from 'in-stores/view';
import { role } from 'in-stores/user';

export const searchMatches$ = createTrackingStore({
  name: 'search/searchMatches',
  observable: combineLatest([
    debouncedQuery$,
    focusedMoment$,
    isView(physicalPath),
    isView(logicalPath),
    isView(containerPath),
    view$,
    timeframe$
  ])
    .flatMap(([query, focusedMoment, isPhysicalView, isLogicalView, isContainerView, view, timeframe]) => {
      const isMapView = isPhysicalView || isLogicalView || isContainerView;
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
        view,
        timeframe
      });
    })
    .distinct()
}).observable;

export function search({ query }) {
  return combineLatest([focusedMoment$, timeframe$]).flatMap(([focusedMoment, timeframe]) => {
    return createSearchSubscription({
      query,
      time: focusedMoment,
      timeframe,
      view: 'TABLE'
    });
  });
}
