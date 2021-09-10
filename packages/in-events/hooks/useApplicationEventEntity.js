/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getApplication from 'in-applications/subscriptions/getApplication';

export default function useApplicationEventEntity(event) {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }

      const entityId = event.get('entityId');
      const entityType = event.get('entityType');
      const metadata = event.get('metadata');
      const serviceId = event.get('endpointServiceId');
      const entityLabel = metadata.get('entityLabel');
      const applicationId = metadata.get('applicationId');

      switch (entityType) {
        case 'App20':
          return getApplicationEntity(entityId, entityLabel);
        case 'Service20':
          return getServiceEntity(applicationId, entityId, entityLabel);
        case 'Endpoint20':
          return getEndpointEntity(applicationId, serviceId, entityId, entityLabel);
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

function getEndpointEntity(applicationId, serviceId, entityId, entityLabel) {
  return combineLatest([
    resolveLabel(getApplication({ id: applicationId })),
    serviceId ? resolveLabel(getServiceLabel({ id: serviceId })) : just(null),
    entityLabel ? just(entityLabel) : resolveLabel(getEndpointInfo({ id: entityId }))
  ]).map(([applicationName, serviceName, endpointName]) => {
    return {
      applicationId: applicationId,
      applicationName,
      serviceId,
      serviceName,
      endpointId: entityId,
      endpointName
    };
  });
}
