/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest, just } from '@instana/observables';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import useObservable from 'in-hooks/useObservable';

export default function useApplicationEventEntity(event) {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }

      const entityId = event.get('entityId');
      const entityType = event.get('entityType');
      const metadata = event.get('metadata');
      const entityLabel = metadata.get('entityLabel');
      const applicationId = metadata.get('applicationId');

      switch (entityType) {
        case 'App20':
          return getApplicationEntity(entityId, entityLabel);
        case 'Service20':
          return getServiceEntity(applicationId, entityId, entityLabel);
        case 'Endpoint20':
          return getEndpointEntity(entityId, entityLabel);
        default:
          throw new Error('Event type unknown: ' + entityType);
      }
    },
    [event]
  );
}

function getApplicationEntity(entityId, entityLabel) {
  return just({
    applicationId: entityId,
    applicationName: entityLabel
  });
}

function getServiceEntity(applicationId, entityId, entityLabel) {
  return combineLatest([
    resolveLabel(getApplication({ id: applicationId })),
    // the entity-label for services can unfortunately be missing and needs to be resolved in such case
    entityLabel ? just(entityLabel) : resolveLabel(getServiceLabel({ id: entityId }))
  ]).map(([applicationName, serviceName]) => {
    return {
      applicationId: applicationId,
      applicationName,
      serviceId: entityId,
      serviceName
    };
  });
}

function resolveLabel(observable) {
  return observable
    .filter(response => !response.progress.loading && response.errors.length === 0)
    .map(response => response.data.label);
}

function getEndpointEntity(entityId, entityLabel) {
  // TODO Implement full handling of endpoints, as soon as we start implementing Per-Endpoint Smart Alerts.
  //      So far we just return the endpoint instead of the full App > Service > Endpoint path.
  return just({
    endpointId: entityId,
    endpointName: entityLabel
  });
}
