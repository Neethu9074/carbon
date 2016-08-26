import {combineLatest} from 'reactive-observables';

import createTotalTraceCountObservable from 'in-services/subscription/totalTraceCount';
import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import createTraceObservable from 'in-services/subscription/trace';
import {timeframe as timeframe$} from 'in-stores/timeline';
import {buildLuceneQuery} from 'in-services/search';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import {luceneQuery$} from 'in-stores/search';


export const totalTraceCount$ = combineLatest([timeframe$, luceneQuery$])
  .flatMap(([timeframe, query]) => createTotalTraceCountObservable({timeframe, query}));


export function getNumberOfTracesStartingAtService(serviceId) {
  const query = buildLuceneQuery('logical_destination_service_id', '=', serviceId);
  return timeframe$.flatMap(timeframe => createTotalTraceCountObservable({timeframe, query}));
}


/**
 * ############################
 * Selected trace and trace id
 * ############################
 */
const selectedTraceId$ = createTrackingStore({
  name: 'in-stores/traces/selectedTraceId',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('traceId' in query) {
        return decodeURIComponent(query.traceId);
      }
      return null;
    })
    .distinct()
}).observable;
export const selectedTraceId = selectedTraceId$;

export const selectedTrace = createTrackingStore({
  name: 'in-stores/traces/selectedTrace',
  observable: selectedTraceId.flatMap(traceId => {
    if (traceId) {
      return createTraceObservable(traceId);
    }
    return alwaysNull;
  })
}).observable;
export const selectedTrace$ = selectedTrace;

export function setSelectedTraceId(id) {
  if (id == null) {
    clearTraceSelection();
  } else {
    mutateUrl(navParams => {
      navParams.query.traceId = encodeURIComponent(id);
      return navParams;
    });
  }
}

export function clearTraceSelection() {
  mutateUrl(navParams => {
    delete navParams.query.traceId;
    return navParams;
  });
}
