import { just } from 'reactive-observables';

import getApplication from 'in-subscription/application/getApplication';
import getEndpoint from 'in-subscription/application/getEndpoint';
import getService from 'in-subscription/application/getService';
import { successObservable } from 'in-services/util/result';
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
          timeConfig: timeConfig
        }
      }).startWith(null)
    };
  } else if (is20Endpoint(entityType)) {
    return {
      entity: getEndpoint({
        id: entityId,
        filter: {
          timeConfig: timeConfig
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

export function canCreate20EntitySurrogateFromEventMetadata(entityType, metadata) {
  return is20Type(entityType) && metadata && metadata.has('entityLabel');
}

export function create20EntityResultSurrogateFromEventMetadata(entityType, entityId, metadata) {
  if (!canCreate20EntitySurrogateFromEventMetadata(entityType, metadata)) {
    return successObservable(null);
  }

  const entitySurrogate = {
    id: entityId,
    label: metadata.get('entityLabel')
  };

  if (is20Endpoint(entityType)) {
    entitySurrogate.serviceId = metadata.get('app20ServiceId');
  }

  return successObservable(entitySurrogate);
}
