import {combineLatest} from 'reactive-observables';

import subscribeToPhysicalEndpointImplementation from 'in-services/subscription/physicalEndpointImplementation';
import {loadingPlaceholder, alwaysLoadingPlaceholder$} from 'in-components/EntityInformation';
import createTotalTraceCountObservable from 'in-services/subscription/totalTraceCount';
import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import createTraceObservable from 'in-services/subscription/trace';
import {timeframe as timeframe$} from 'in-stores/timeline';
import {debouncedQuery$} from 'in-stores/search/query';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';


export const totalTraceCountNoFiltering$ = timeframe$
  .flatMap(timeframe => createTotalTraceCountObservable({timeframe, query: ''}));

export const totalTraceCountOnlyEum$ = timeframe$
  .flatMap(timeframe => createTotalTraceCountObservable({timeframe, query: ' spanType:eum'}));

// Avoid user visible inconsistencies between counts by calculating the third number.
// We are calculating it this way because finding EUM traces is cheaper than calculating
// non-EUM traces.
export const totalTraceCountWithoutEum$ = combineLatest([totalTraceCountNoFiltering$, totalTraceCountOnlyEum$])
  .map(([total, eum]) => total - eum);

export const totalTraceCountActiveFilter$ = combineLatest([timeframe$, debouncedQuery$])
  .flatMap(([timeframe, luceneQuery]) => createTotalTraceCountObservable({timeframe, query: luceneQuery || ''}));

export function getNumberOfTracesStartingAtService(serviceId) {
  return timeframe$.flatMap(timeframe =>
    createTotalTraceCountObservable({
      timeframe,
      query: `starting_logical_service:${serviceId}`
    })
  );
}

export function getNumberOfTracesTouchingService(serviceId) {
  return timeframe$.flatMap(timeframe =>
    createTotalTraceCountObservable({
      timeframe,
      query: `touched_logical_service:${serviceId}`
    })
  );
}

export function getNumberOfTracesStartingAtServiceInstance(serviceId) {
  return timeframe$.flatMap(timeframe =>
    createTotalTraceCountObservable({
      timeframe,
      query: `starting_service_instance:${serviceId}`
    })
  );
}

export function getNumberOfTracesTouchingServiceInstance(serviceId) {
  return timeframe$.flatMap(timeframe =>
    createTotalTraceCountObservable({
      timeframe,
      query: `touched_service_instance:${serviceId}`
    })
  );
}

export function getNumberOfTracesTouchingServiceOrServiceInstance(id, timeframe) {
  const query = `touched_logical_service:${id} OR touched_service_instance:${id}`;
  return timeframe
    ? createTotalTraceCountObservable({timeframe, query})
    : timeframe$.flatMap(_timeframe => createTotalTraceCountObservable({timeframe: _timeframe, query}));
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

        return getSnapshot(physicalEndpointImplementationSnapshotId, time)
          .startWith(loadingPlaceholder);
      });
  }

  return snapshot$;
}
