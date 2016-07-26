import createTotalTraceCountObservable from 'in-services/subscription/totalTraceCount';
import {timeframe as timeframe$, focusedMoment$} from 'in-stores/timeline';
import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import createTracesObservable from 'in-services/subscription/traces';
import createTraceObservable from 'in-services/subscription/trace';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';


export const totalTraceCount$ = timeframe$.flatMap(createTotalTraceCountObservable);


export function getTraces(maxTimestamp, minTimestamp, sortByField, sortMode) {
  return maxTimestamp ?
    createTracesObservable({maxTimestamp, minTimestamp, sortByField, sortMode}) :
    focusedMoment$.flatMap(focusedMoment => createTracesObservable(
      {maxTimstamp: focusedMoment, minTimestamp, sortByField, sortMode}
    ));
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
