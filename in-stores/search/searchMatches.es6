import {combineLatest} from 'reactive-observables';

import createSearchSubscription from 'in-services/subscription/search';
import {parsedQuery$} from 'in-stores/search/parsedQuery';
import {isMapView$} from 'in-stores/navigation/view';
import {alwaysNull} from 'in-services/fixedStreams';
import {createTrackingStore} from 'in-stores/store';
import {focusedMoment$} from 'in-stores/timeline';
import {view$} from 'in-stores/view';


export const searchMatches$ = createTrackingStore({
  name: 'search/searchMatches',
  observable: combineLatest([parsedQuery$, focusedMoment$, isMapView$, view$])
    .flatMap(([parsedQuery, focusedMoment, isMapView, view]) => {
      if (!isMapView ||
          parsedQuery == null ||
          parsedQuery.luceneQuery.length === 0) {
        return alwaysNull;
      }

      return createSearchSubscription({
        query: parsedQuery.luceneQuery,
        time: focusedMoment,
        view
      });
    })
    .distinct()
}).observable;
