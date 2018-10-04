import { just } from 'reactive-observables';

import getApplication from 'in-subscription/application/getApplication';
import getService from 'in-subscription/application/getService';
import { getSnapshot } from 'in-stores/snapshot';

const entityIdSeparator = '<|>';

export function parseEndpointEntityId(entityId) {
  // we will read the serviceId/endpointName out of the entityId, because these
  // informations are not provided in the event model, and because there is no
  // need to call the getEndpoint gRPC right now, since endpointId==endpontName.
  // these infos will be provided in the getEndpoint gRPC with the new
  // ServiceCatalogV2, which will introduce a proper endpointId, and where there
  // parent-serviceId (or even the parent-service-label) of this endpoint can be
  // easily retrieved.
  const separatorLength = entityIdSeparator.length;
  const separatorLastIndex = entityId.lastIndexOf(entityIdSeparator);
  const endOfServiceId = entityId.indexOf(entityIdSeparator);
  const endpointName = entityId.substring(endOfServiceId + entityIdSeparator.length, separatorLastIndex);
  const endpointType = entityId.substring(separatorLastIndex + separatorLength, entityId.length);
  return {
    serviceId: entityId.substring(0, endOfServiceId),
    name: endpointName ? endpointName : 'Unspecified',
    type: endpointType
  };
}

export function combineEndpointEntityId(serviceId, endpointName, endpointType) {
  if (!serviceId || !endpointName || !endpointType) {
    return undefined;
  }
  return serviceId + '<|>' + endpointName + '<|>' + endpointType;
}

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
      entity: getService({
        id: entityId,
        filter: {
          timeConfig: timeConfig
        }
      }).startWith(null)
    };
  } else if (entityType === 'Endpoint20') {
    const endpoint = parseEndpointEntityId(entityId);
    return {
      entity: just({
        data: {
          label: endpoint.name
        }
      })
    };
  } else {
    return {
      entity: getSnapshot(entityId, timeConfig).startWith(null)
    };
  }
}
