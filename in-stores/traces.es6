import {combineLatest} from 'reactive-observables';

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
  name: 'selectedTraceId',
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
  name: 'selectedTrace',
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
      delete navParams.query.spanId;
      return navParams;
    });
  }
}

export function clearTraceSelection() {
  mutateUrl(navParams => {
    delete navParams.query.traceId;
    delete navParams.query.spanId;
    return navParams;
  });
}


/**
 * ############################
 * Selected span and span id
 * ############################
 */
export const selectedSpanId$ = createTrackingStore({
  name: 'selectedSpanId',
  observable: navigationParameters$
    .map(params => {
      const query = params.query;
      if ('spanId' in query) {
        return decodeURIComponent(query.spanId);
      }

      return null;
    })
    .distinct()
}).observable;


export const selectedSpan$ = createTrackingStore({
  name: 'selectedSpan',
  observable: combineLatest([selectedSpanId$, selectedTrace])
    .map(([spanId, trace]) => {
      if (!spanId || !trace) {
        return null;
      }

      // Walk through all spans and find the correct one.
      let spansToCheck = [trace];
      while (spansToCheck.length !== 0) {
        const span = spansToCheck.shift();
        if (span.get('spanId') === spanId) {
          return span;
        }
        spansToCheck = spansToCheck.concat(span.get('childSpans').toArray());
      }
      return null;
    })
}).observable;

export function clearSpanSelection() {
  mutateUrl(navParams => {
    delete navParams.query.spanId;
    return navParams;
  });
}

export function setSelectedSpanId(id) {
  if (id == null) {
    clearSpanSelection();
  } else {
    mutateUrl(navParams => {
      navParams.query.spanId = encodeURIComponent(id);
      return navParams;
    });
  }
}
