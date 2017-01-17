import {combineLatest} from 'reactive-observables';

import createTotalTraceCountObservable from 'in-services/subscription/totalTraceCount';
import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import createTraceObservable from 'in-services/subscription/trace';
import {timeframe as timeframe$} from 'in-stores/timeline';
import {createTrackingStore} from 'in-stores/store';
import {buildLuceneQuery} from 'in-services/search';
import {alwaysNull} from 'in-services/fixedStreams';
import {luceneQuery$} from 'in-stores/search';


export const totalTraceCountNoFiltering$ = timeframe$
  .flatMap(timeframe => createTotalTraceCountObservable({timeframe, query: ''}));

export const totalTraceCountOnlyEum$ = timeframe$
  .flatMap(timeframe => createTotalTraceCountObservable({timeframe, query: '(n:page.err OR n:page.xhr OR n:page)'}));

// Avoid user visible inconsistencies between counts by calculating the third number.
// We are calculating it this way because finding EUM traces is cheaper than calculating
// non-EUM traces.
export const totalTraceCountWithoutEum$ = combineLatest([totalTraceCountNoFiltering$, totalTraceCountOnlyEum$])
  .map(([total, eum]) => total - eum);

export const totalTraceCountActiveFilter$ = combineLatest([timeframe$, luceneQuery$.debounce(200)])
  .flatMap(([timeframe, luceneQuery]) => createTotalTraceCountObservable({timeframe, query: luceneQuery || ''}));

export function getNumberOfTracesStartingAtService(serviceId) {
  const query = buildLuceneQuery('starting_logical_service', '=', serviceId);
  return timeframe$.flatMap(timeframe => createTotalTraceCountObservable({timeframe, query}));
}

export function getNumberOfTracesTouchingService(serviceId) {
  const query = buildLuceneQuery('touched_logical_service', '=', serviceId);
  return timeframe$.flatMap(timeframe => createTotalTraceCountObservable({timeframe, query}));
}

export function getNumberOfTracesStartingAtServiceInstance(serviceId) {
  const query = buildLuceneQuery('starting_service_instance', '=', serviceId);
  return timeframe$.flatMap(timeframe => createTotalTraceCountObservable({timeframe, query}));
}

export function getNumberOfTracesTouchingServiceInstance(serviceId) {
  const query = buildLuceneQuery('touched_service_instance', '=', serviceId);
  return timeframe$.flatMap(timeframe => createTotalTraceCountObservable({timeframe, query}));
}


/**
 * ############################
 * Selected trace and trace id
 * ############################
 */
export const selectedTraceId$ = createTrackingStore({
  name: 'traces/selectedTraceId',
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
  name: 'traces/selectedTrace',
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
