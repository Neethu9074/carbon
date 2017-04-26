import { combineLatest } from 'reactive-observables';

import subscribeToPhysicalEndpointImplementation from 'in-services/subscription/physicalEndpointImplementation';
import { loadingPlaceholder, alwaysLoadingPlaceholder$ } from 'in-components/EntityInformation';
import createTotalTraceCountObservable from 'in-services/subscription/totalTraceCount';
import { timeframe as timeframe$, focusedMoment$ } from 'in-stores/timeline';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import createTraceObservable from 'in-services/subscription/trace';
import { debouncedQuery$ } from 'in-stores/search/query';
import { createTrackingStore } from 'in-stores/store';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';

export const totalTraceCountNoFiltering$ = getTraceCount('');

export const totalTraceCountOnlyEum$ = getTraceCount(' trace.type:eum');

// Avoid user visible inconsistencies between counts by calculating the third number.
// We are calculating it this way because finding EUM traces is cheaper than calculating
// non-EUM traces.
export const totalTraceCountWithoutEum$ = combineLatest([totalTraceCountNoFiltering$, totalTraceCountOnlyEum$]).map(
  ([total, eum]) => total - eum
);

export const totalTraceCountActiveFilter$ = debouncedQuery$.flatMap(luceneQuery => getTraceCount(luceneQuery || ''));

export function getNumberOfTracesStartingAtService(serviceId) {
  return getTraceCount(`trace.startingAt:"${serviceId}"`);
}

export function getNumberOfTracesTouchingService(serviceId) {
  return getTraceCount(`trace.touchedLogicalService:"${serviceId}"`);
}

export function getNumberOfTracesStartingAtServiceInstance(serviceId) {
  return getTraceCount(`trace.startingAtInstance:"${serviceId}"`);
}

export function getNumberOfTracesTouchingServiceInstance(serviceId) {
  return getTraceCount(`trace.touchedServiceInstance:"${serviceId}"`);
}

export function getNumberOfTracesTouchingServiceOrServiceInstance(id, timeframe) {
  return getTraceCount(`trace.touching:"${id}"`, timeframe);
}

export function getTraceCount(query, timeframe) {
  if (timeframe) {
    return focusedMoment$.flatMap(_focusedMoment =>
      createTotalTraceCountObservable({ timeframe, focusedMoment: _focusedMoment, query })
    );
  }

  return combineLatest([timeframe$, focusedMoment$]).flatMap(([_timeframe, _focusedMoment]) =>
    createTotalTraceCountObservable({ timeframe: _timeframe, focusedMoment: _focusedMoment, query })
  );
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

export function getEntitySnapshot$BySpan(span, connectionEndpointType) {
  const physicalEndpoint = span.getIn(['rels', connectionEndpointType + 'PhysicalEndpoint']);

  let snapshot$ = alwaysNull;
  if (physicalEndpoint) {
    const time = span.get('start');
    snapshot$ = subscribeToPhysicalEndpointImplementation({
      time,
      physicalEndpoint
    })
      .startWith(loadingPlaceholder)
      .flatMap(physicalEndpointImplementationSnapshotId => {
        if (!physicalEndpointImplementationSnapshotId) {
          return alwaysNull;
        } else if (physicalEndpointImplementationSnapshotId === loadingPlaceholder) {
          return alwaysLoadingPlaceholder$;
        }

        return getSnapshot(physicalEndpointImplementationSnapshotId, time).startWith(loadingPlaceholder);
      });
  }

  return snapshot$;
}
