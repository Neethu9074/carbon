import {combineLatest} from 'reactive-observables';

import createTotalTraceCountObservable from 'in-services/subscription/totalTraceCount';
import {mutateUrl, navigationParameters} from 'in-stores/navigation';
import createTracesObservable from 'in-services/subscription/traces';
import createTraceObservable from 'in-services/subscription/trace';
import {createStore, createTrackingStore} from 'in-stores/store';
import {timeframe as timeframe$} from 'in-stores/timeline';
import {alwaysNull} from 'in-services/fixedStreams';

export const totalTraceCount$ = timeframe$.flatMap(createTotalTraceCountObservable);


export function getTraces(maxTimestamp, minTimestamp, sortByField, sortMode) {
  if (maxTimestamp) {
    return createTracesObservable({maxTimestamp, minTimestamp, sortByField, sortMode});
  }

  return timeframe$.flatMap(timeframe => createTracesObservable(
    {maxTimstamp: timeframe.to, minTimestamp, sortByField, sortMode}
  ));
}


/**
 * ############################
 * Selected trace and trace id
 * ############################
 */
const selectedTraceIdStore = createStore({
  name: 'selectedTraceId',
  initialValue: null
});
export const selectedTraceId = selectedTraceIdStore.observable.distinct();

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
const selectedSpanIdStore = createStore({
  name: 'selectedSpanId',
  initialValue: null
});
export const selectedSpanId$ = selectedSpanIdStore.observable.distinct();

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


/**
 * ############################
 * Handling URI changes
 * ############################
 */
navigationParameters.subscribe(navParams => {
  const query = navParams.query;
  if ('traceId' in query) {
    const traceId = decodeURIComponent(query.traceId);
    selectedTraceIdStore.applyStateMutation(() => traceId);
  } else {
    selectedTraceIdStore.applyStateMutation(() => null);
  }

  if ('spanId' in query) {
    const spanId = decodeURIComponent(query.spanId);
    selectedSpanIdStore.applyStateMutation(() => spanId);
  } else {
    selectedSpanIdStore.applyStateMutation(() => null);
  }
});
