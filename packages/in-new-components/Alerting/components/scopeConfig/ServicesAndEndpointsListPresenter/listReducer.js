import { isEmpty } from 'lodash';

import { deepCopy } from 'in-services/util/object';

export const actionType = {
  ADD_APPLICATION: 'ADD_APPLICATION',
  ADD_SERVICE: 'ADD_SERVICE',
  ADD_ENDPOINT: 'ADD_ENDPOINT',
  REMOVE_APPLICATION: 'REMOVE_APPLICATION',
  REMOVE_SERVICE: 'REMOVE_SERVICE',
  REMOVE_ENDPOINT: 'REMOVE_ENDPOINT'
};

export function listReducer(state, action) {
  const { type, applicationId, serviceId, endpointId } = action;

  switch (type) {
    case actionType.ADD_APPLICATION: {
      return addApplicationIfNotContained(state, action) ?? state;
    }
    case actionType.ADD_SERVICE: {
      const stateWithApplication = addApplicationIfNotContained(state, action);
      return addServiceIfNotContained(stateWithApplication ?? state, action, stateWithApplication == null) ?? state;
    }
    case actionType.ADD_ENDPOINT: {
      const stateWithApplication = addApplicationIfNotContained(state, action);
      const stateWithService = addServiceIfNotContained(
        stateWithApplication ?? state,
        action,
        stateWithApplication == null
      );
      return addEndpointIfNotContained(stateWithService ?? state, action, stateWithService == null) ?? state;
    }
    case actionType.REMOVE_APPLICATION: {
      const itemTreeCopy = deepCopy(state);
      delete itemTreeCopy[applicationId];
      return itemTreeCopy;
    }
    case actionType.REMOVE_SERVICE: {
      const itemTreeCopy = deepCopy(state);
      delete itemTreeCopy[applicationId].services[serviceId];
      return itemTreeCopy;
    }
    case actionType.REMOVE_ENDPOINT: {
      const itemTreeCopy = deepCopy(state);
      delete itemTreeCopy[applicationId].services[serviceId].endpoints[endpointId];
      return itemTreeCopy;
    }
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

function addApplicationIfNotContained(state, { applicationId }) {
  if (isEmpty(state?.[applicationId])) {
    const itemTreeCopy = deepCopy(state);
    itemTreeCopy[applicationId] = { applicationId, services: {} };
    return itemTreeCopy;
  }
  return null;
}

function addServiceIfNotContained(state, { applicationId, serviceId }, useCopy) {
  if (isEmpty(state[applicationId]?.services[serviceId])) {
    const itemTreeCopy = useCopy ? deepCopy(state) : state;
    itemTreeCopy[applicationId].services[serviceId] = { serviceId, endpoints: {} };
    return itemTreeCopy;
  }
  return null;
}

function addEndpointIfNotContained(state, { applicationId, serviceId, endpointId }, useCopy) {
  if (isEmpty(state[applicationId]?.services[serviceId]?.endpoints?.[endpointId])) {
    const itemTreeCopy = useCopy ? deepCopy(state) : state;
    itemTreeCopy[applicationId].services[serviceId].endpoints[endpointId] = {
      serviceId,
      endpoints: {}
    };

    return itemTreeCopy;
  }
  return null;
}
