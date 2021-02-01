/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isEmpty } from 'lodash';

import { getApplication, getEndpoint, getService } from './utils';

export const actionType = {
  ADD_APPLICATION: 'ADD_APPLICATION',
  ADD_SERVICE: 'ADD_SERVICE',
  ADD_ENDPOINT: 'ADD_ENDPOINT',
  REMOVE_APPLICATION: 'REMOVE_APPLICATION',
  REMOVE_SERVICE: 'REMOVE_SERVICE',
  REMOVE_ENDPOINT: 'REMOVE_ENDPOINT'
};

export function listReducer(state, action) {
  const { type, applicationId, serviceId, endpointId, inclusive = true, explicitSelectionOnly } = action;

  switch (type) {
    case actionType.ADD_APPLICATION: {
      const stateWithApplication = addApplicationIfNotContained(state, action);
      return toggleInclusiveValueForApplication(stateWithApplication, { applicationId }, inclusive);
    }
    case actionType.ADD_SERVICE: {
      const stateWithApplication = addApplicationIfNotContained(state, action, explicitSelectionOnly);
      const stateWithService = addServiceIfNotContained(stateWithApplication, action);
      return toggleInclusiveValueForService(stateWithService, { applicationId, serviceId }, inclusive);
    }
    case actionType.ADD_ENDPOINT: {
      const stateWithApplication = addApplicationIfNotContained(state, action, explicitSelectionOnly);
      const stateWithService = addServiceIfNotContained(stateWithApplication, action);
      const stateWithEndpoint = addEndpointIfNotContained(stateWithService, action);
      return toggleInclusiveValueForEndpoint(stateWithEndpoint, { applicationId, serviceId, endpointId }, inclusive);
    }
    case actionType.REMOVE_APPLICATION: {
      const itemTreeCopy = { ...state };
      delete itemTreeCopy[applicationId];
      return itemTreeCopy;
    }
    case actionType.REMOVE_SERVICE: {
      const application = getApplication(state, applicationId) ?? {};
      const servicesItemTreeCopy = { ...application?.services };
      delete servicesItemTreeCopy[serviceId];

      return {
        ...state,
        [applicationId]: { ...application, services: servicesItemTreeCopy }
      };
    }
    case actionType.REMOVE_ENDPOINT: {
      const application = getApplication(state, applicationId) ?? {};
      const service = getService(application, serviceId) ?? {};

      const endpointsItemTreeCopy = { ...service.endpoints };
      delete endpointsItemTreeCopy[endpointId];

      const endpointsCopyEmpty = isEmpty(endpointsItemTreeCopy);

      let servicesItemTreeCopy = null;
      if (endpointsCopyEmpty) {
        servicesItemTreeCopy = { ...application.services };
        delete servicesItemTreeCopy[serviceId];
      }

      if (endpointsCopyEmpty) {
        return {
          ...state,
          [applicationId]: { ...application, services: servicesItemTreeCopy }
        };
      }

      return {
        ...state,
        [applicationId]: {
          ...application,
          services: {
            ...application.services,
            [serviceId]: {
              ...service,
              endpoints: endpointsItemTreeCopy
            }
          }
        }
      };
    }
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

function addApplicationIfNotContained(state, { applicationId }, explicitSelectionOnly = false) {
  const application = getApplication(state, applicationId);
  if (isEmpty(application)) {
    return getNewStateWithApplication(state, applicationId, { inclusive: true, services: {}, explicitSelectionOnly });
  }
  return state;
}

function addServiceIfNotContained(state, { applicationId, serviceId }) {
  const service = getService(getApplication(state, applicationId), serviceId);
  if (isEmpty(service)) {
    return getNewStateWithService(state, applicationId, { serviceId, inclusive: true, endpoints: {} });
  }
  return state;
}

function addEndpointIfNotContained(state, { applicationId, serviceId, endpointId }) {
  const endpoint = getEndpoint(getService(getApplication(state, applicationId), serviceId), endpointId);
  if (isEmpty(endpoint)) {
    return getNewStateWithEndpoint(state, applicationId, serviceId, { endpointId, inclusive: true });
  }
  return state;
}

export function getNewStateWithApplication(state, applicationId, applicationConfig) {
  const { inclusive, services, explicitSelectionOnly } = applicationConfig;
  return {
    ...state,
    [applicationId]: {
      applicationId,
      inclusive,
      explicitSelectionOnly,
      services: inclusive ? services : {}
    }
  };
}

function getNewStateWithService(state, applicationId, serviceConfig) {
  const { serviceId, inclusive, endpoints } = serviceConfig;
  const application = getApplication(state, applicationId);

  return {
    ...state,
    [applicationId]: {
      ...application,
      services: {
        ...application?.services,
        [serviceId]: {
          serviceId,
          inclusive,
          endpoints: inclusive ? endpoints : {}
        }
      }
    }
  };
}

function getNewStateWithEndpoint(state, applicationId, serviceId, endpointConfig) {
  const { endpointId, inclusive } = endpointConfig;
  const application = getApplication(state, applicationId);
  const service = getService(application, serviceId);

  return {
    ...state,
    [applicationId]: {
      ...application,
      services: {
        ...application.services,
        [serviceId]: {
          ...service,
          endpoints: {
            ...service.endpoints,
            [endpointId]: {
              endpointId,
              inclusive
            }
          }
        }
      }
    }
  };
}

function toggleInclusiveValueForApplication(state, itemTreeIds, inclusive) {
  const { applicationId } = itemTreeIds;
  const application = getApplication(state, applicationId);
  if (application.inclusive !== inclusive) {
    return getNewStateWithApplication(state, applicationId, { ...application, inclusive });
  }
  return state;
}

function toggleInclusiveValueForService(state, itemTreeIds, inclusive) {
  const { applicationId, serviceId } = itemTreeIds;
  const service = getService(getApplication(state, applicationId), serviceId);
  if (service.inclusive !== inclusive) {
    return getNewStateWithService(state, applicationId, { ...service, inclusive });
  }
  return state;
}

function toggleInclusiveValueForEndpoint(state, itemTreeIds, inclusive) {
  const { applicationId, serviceId, endpointId } = itemTreeIds;
  const endpoint = getEndpoint(getService(getApplication(state, applicationId), serviceId), endpointId);
  if (endpoint.inclusive !== inclusive) {
    return getNewStateWithEndpoint(state, applicationId, serviceId, { endpointId, inclusive });
  }
  return state;
}
