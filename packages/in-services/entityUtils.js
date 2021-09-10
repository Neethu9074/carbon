/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable no-restricted-imports */

import { just } from '@instana/observables';

import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getApplication from 'in-applications/subscriptions/getApplication';
import { mapDataHO, successObservable } from 'in-services/util/result';
import getEndpoint from 'in-applications/subscriptions/getEndpoint';
import getService from 'in-applications/subscriptions/getService';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';

export const loadingPlaceholder = {};
export const alwaysLoadingPlaceholder$ = always(loadingPlaceholder);

export function getEntityOfType(entityId, entityType, timeConfig) {
  if (isApplicationEntity(entityType)) {
    return {
      entity: getApplication({ id: entityId }).startWith(null)
    };
  } else if (isServiceEntity(entityType)) {
    if (!timeConfig) {
      //  Can't render 2.0 service information without a time config.
      return {
        entity: just(null)
      };
    }
    return {
      entity: getService({
        id: entityId,
        filter: {
          timeConfig
        }
      }).startWith(null)
    };
  } else if (isEndpointEntity(entityType)) {
    return {
      entity: getEndpoint({
        id: entityId,
        filter: {
          timeConfig
        }
      }).startWith(null)
    };
  } else {
    return {
      entity: getSnapshot(entityId, timeConfig).startWith(null)
    };
  }
}

export function isLoading(entity) {
  return entity === loadingPlaceholder || (entity.progress && entity.progress.loading);
}

export function hasErrors(entity) {
  return entity.errors && entity.errors.length > 0;
}

export function isInfraEntityType(entityType) {
  return !isAppDataEntityType(entityType) && !isWebsiteEntityType(entityType);
}

export function isWebsiteEntityType(entityType) {
  return entityType === 'Website';
}

export function isAppDataEntityType(entityType) {
  return isEndpointEntity(entityType) || isServiceEntity(entityType) || isApplicationEntity(entityType);
}

export function isApplicationEntity(entityType) {
  return entityType === 'App20';
}

export function isServiceEntity(entityType) {
  return entityType === 'Service20';
}

export function isEndpointEntity(entityType) {
  return entityType === 'Endpoint20';
}

export function createAppDataEntityConnectToMapFromEvent(entityType, entityId, metadata) {
  if (isApplicationEntity(entityType)) {
    return createApplicationConnectToMapFromEvent(entityType, entityId, metadata);
  } else if (isServiceEntity(entityType)) {
    return createServiceConnectToMapFromEvent(entityType, entityId, metadata);
  } else if (isEndpointEntity(entityType)) {
    return createEndpointConnectToMapFromEvent(entityType, entityId, metadata);
  }
}

function createApplicationConnectToMapFromEvent(entityType, entityId, metadata) {
  if (metadata && metadata.get('entityLabel')) {
    return createSurrogateConnectToMapFromMetadata(entityType, entityId, metadata);
  } else {
    return wrapInConnectToMap(
      getApplication({ id: entityId }).map(
        mapDataHO(application => {
          return createEntitySurrogate(entityType, entityId, application.label);
        })
      )
    );
  }
}

function createServiceConnectToMapFromEvent(entityType, entityId, metadata) {
  if (metadata && metadata.get('entityLabel')) {
    return createSurrogateConnectToMapFromMetadata(entityType, entityId, metadata);
  }

  if (!entityId) {
    return wrapInConnectToMap(
      getEndpointInfo({
        id: metadata.get('app20EndpointId')
      }).flatMap(endpointInfo => {
        if (!endpointInfo.data) {
          return just(endpointInfo);
        }
        return getServiceLabel({
          id: endpointInfo.data.serviceId
        }).map(
          mapDataHO(serviceLabel => {
            return createEntitySurrogate(entityType, endpointInfo.data.serviceId, serviceLabel.label);
          })
        );
      })
    );
  }
  return wrapInConnectToMap(
    getServiceLabel({
      id: entityId
    }).map(
      mapDataHO(serviceLabel => {
        return createEntitySurrogate(entityType, entityId, serviceLabel.label);
      })
    )
  );
}

function createEndpointConnectToMapFromEvent(entityType, entityId, metadata) {
  if (
    metadata &&
    metadata.get('entityLabel') &&
    metadata.get('app20ServiceId') &&
    metadata.get('app20EndpointServiceLabel')
  ) {
    // all required data (endpoint label, service id, service label) is present, no need to load anything else
    return createSurrogateConnectToMapFromMetadata(entityType, entityId, metadata);
  } else if (metadata && metadata.get('entityLabel') && metadata.get('app20ServiceId')) {
    // only the service label is missing, just load that
    return wrapInConnectToMap(
      getServiceLabel({ id: metadata.get('app20ServiceId') }).map(
        mapDataHO(serviceLabel => {
          return createEntitySurrogate(
            entityType,
            entityId,
            metadata.get('entityLabel'),
            metadata.get('app20ServiceId'),
            serviceLabel.label
          );
        })
      )
    );
  } else {
    // more than the service label is missing - load endpoint and then the service label
    return wrapInConnectToMap(
      getEndpointInfo({
        id: entityId
      }).flatMap(endpointInfo => {
        if (!endpointInfo.data) {
          return just(endpointInfo);
        } else if (!endpointInfo.data.serviceId) {
          // getEndpoint has returned data, but no serviceId, so at least return the endpoint label
          return successObservable(createEntitySurrogate(entityType, entityId, endpointInfo.data.label));
        } else {
          // getEndpoint yielded a service ID, use that to load the service label
          return getServiceLabel({ id: endpointInfo.data.serviceId }).map(
            mapDataHO(serviceLabel => {
              return createEntitySurrogate(
                entityType,
                entityId,
                endpointInfo.data.label,
                endpointInfo.data.serviceId,
                serviceLabel.label
              );
            })
          );
        }
      })
    );
  }
}

function createSurrogateConnectToMapFromMetadata(entityType, entityId, metadata) {
  return createSurrogateConnectToMap(
    entityType,
    entityId,
    metadata.get('entityLabel'),
    metadata.get('app20ServiceId'),
    metadata.get('app20EndpointServiceLabel')
  );
}

function createSurrogateConnectToMap(entityType, entityId, label, serviceIdForEndpoint, serviceLabelForEndpoint) {
  return wrapInConnectToMap(
    successObservable(createEntitySurrogate(entityType, entityId, label, serviceIdForEndpoint, serviceLabelForEndpoint))
  );
}

function createEntitySurrogate(entityType, entityId, label, serviceIdForEndpoint, serviceLabelForEndpoint) {
  const entitySurrogate = {
    id: entityId,
    label
  };

  if (isEndpointEntity(entityType)) {
    entitySurrogate.serviceId = serviceIdForEndpoint;
    entitySurrogate.serviceLabel = serviceLabelForEndpoint;
  }
  return entitySurrogate;
}

function wrapInConnectToMap(observable$) {
  return {
    entity: observable$
  };
}
