import { just } from 'reactive-observables';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { mapDataHO, successObservable } from 'in-services/util/result';
import getEndpoint from 'in-subscription/application/getEndpoint';
import getService from 'in-subscription/application/getService';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';

export const loadingPlaceholder = {};
export const alwaysLoadingPlaceholder$ = always(loadingPlaceholder);

export function getEntityOfType(entityId, entityType, timeConfig) {
  if (is20Application(entityType)) {
    return {
      entity: getApplication({ id: entityId }).startWith(null)
    };
  } else if (is20Service(entityType)) {
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
  } else if (is20Endpoint(entityType)) {
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

export function is10Type(entityType) {
  return !is20Type(entityType);
}

export function is20Type(entityType) {
  return is20Endpoint(entityType) || is20Service(entityType) || is20Application(entityType);
}

export function is20Application(entityType) {
  return entityType === 'App20';
}

export function is20Service(entityType) {
  return entityType === 'Service20';
}

export function is20Endpoint(entityType) {
  return entityType === 'Endpoint20';
}

export function create20EntityConnectToMapFromEvent(entityType, entityId, metadata, timeConfig) {
  if (is20Application(entityType)) {
    return create20ApplicationConnectToMapFromEvent(entityType, entityId, metadata);
  } else if (is20Service(entityType)) {
    return create20ServiceConnectToMapFromEvent(entityType, entityId, metadata, timeConfig);
  } else if (is20Endpoint(entityType)) {
    return create20EndpointConnectToMapFromEvent(entityType, entityId, metadata, timeConfig);
  }
}

function create20ApplicationConnectToMapFromEvent(entityType, entityId, metadata) {
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

function create20ServiceConnectToMapFromEvent(entityType, entityId, metadata, timeConfig) {
  if (metadata && metadata.get('entityLabel')) {
    return createSurrogateConnectToMapFromMetadata(entityType, entityId, metadata);
  } else {
    return wrapInConnectToMap(
      getServiceLabel({
        id: entityId,
        filter: {
          timeConfig
        }
      }).map(
        mapDataHO(serviceLabel => {
          return createEntitySurrogate(entityType, entityId, serviceLabel.label);
        })
      )
    );
  }
}

function create20EndpointConnectToMapFromEvent(entityType, entityId, metadata, timeConfig) {
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
      getEndpoint({
        id: entityId,
        filter: {
          timeConfig
        }
      }).flatMap(result => {
        if (!result.data) {
          return just(result);
        } else if (!result.data.serviceId) {
          // getEndpoint has returned data, but no serviceId, so at least return the endpoint label
          return successObservable(createEntitySurrogate(entityType, entityId, result.data.label));
        } else {
          // getEndpoint yielded a service ID, use that to load the service label
          return getServiceLabel({ id: result.data.serviceId }).map(
            mapDataHO(serviceLabel => {
              return createEntitySurrogate(
                entityType,
                entityId,
                result.data.label,
                result.data.serviceId,
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

  if (is20Endpoint(entityType)) {
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
