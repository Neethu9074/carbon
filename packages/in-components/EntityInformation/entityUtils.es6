import { just } from 'reactive-observables';

import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import getEndpoint from 'in-subscription/application/getEndpoint';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';

export const loadingPlaceholder = {};
export const alwaysLoadingPlaceholder$ = always(loadingPlaceholder);

export function getEntityOfType(entityId, entityType, timeConfig) {
  if (entityType === 'App20') {
    return {
      entity: getApplication({ id: entityId }).startWith(null)
    };
  } else if (entityType === 'Service20') {
    if (!timeConfig) {
      //  Can't render 2.0 service information without a time config.
      return {
        entity: just(null)
      };
    }
    return {
      entity: getServiceLabel({
        id: entityId
      }).startWith(null)
    };
  } else if (entityType === 'Endpoint20') {
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
