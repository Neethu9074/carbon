import { just } from 'reactive-observables';
import { fromJS } from 'immutable';

import subscribeToPhysicalEndpointImplementation from 'in-subscription/physicalEndpointImplementation';
import { loadingPlaceholder, alwaysLoadingPlaceholder$ } from 'in-components/EntityInformation/entityUtils';
import createTotalTraceCountObservable from 'in-subscription/totalTraceCount';
import { getTimeConfigAtMoment, timeConfig$ } from 'in-stores/time/config';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';
import { alwaysNull } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import { query$ } from 'in-stores/search/query';
import getTrace from 'in-subscription/getTrace';

export const totalTraceCountActiveFilter$ = query$
  // increasing debounce to have fewer db queries
  .debounce(1000)
  .flatMap((luceneQuery = '') => {
    luceneQuery = luceneQuery.trim();
    if (luceneQuery.length > 0 && luceneQuery.length < 4) {
      return just(fromJS({ count: -1 }));
    }
    return getTraceCount(luceneQuery);
  });

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

export function getNumberOfTracesTouchingServiceOrServiceInstance(id, timeConfig) {
  return getTraceCount(`trace.touching:"${id}"`, timeConfig);
}

export function getTraceCount(query, timeConfig) {
  if (timeConfig) {
    return createTotalTraceCountObservable({ timeConfig, query });
  }

  return timeConfig$.flatMap(_timeConfig => createTotalTraceCountObservable({ timeConfig: _timeConfig, query }));
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
        return query.traceId;
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
      return getTrace(traceId);
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
      navParams.query.traceId = id;
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

export function getEntitySnapshot$BySpan(span, connectionEndpointType, { useLoadingPlaceholder = true } = {}) {
  const physicalEndpoint = span.getIn(['rels', connectionEndpointType + 'PhysicalEndpoint']);

  let snapshot$ = alwaysNull;
  if (physicalEndpoint) {
    const time = span.get('start');
    snapshot$ = subscribeToPhysicalEndpointImplementation({
      timeConfig: getTimeConfigAtMoment(time),
      physicalEndpoint
    })
      .startWith(useLoadingPlaceholder ? loadingPlaceholder : null)
      .flatMap(physicalEndpointImplementationSnapshotId => {
        if (!physicalEndpointImplementationSnapshotId) {
          return alwaysNull;
        } else if (physicalEndpointImplementationSnapshotId === loadingPlaceholder) {
          if (useLoadingPlaceholder) {
            return alwaysLoadingPlaceholder$;
          }
          return alwaysNull;
        }

        return getSnapshot(physicalEndpointImplementationSnapshotId, getTimeConfigAtMoment(time)).startWith(
          useLoadingPlaceholder ? loadingPlaceholder : null
        );
      });
  }

  return snapshot$;
}
