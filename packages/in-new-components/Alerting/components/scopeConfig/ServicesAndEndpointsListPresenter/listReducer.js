/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';

import {
  selectApplication,
  selectEndpoint,
  selectService
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/selectors';

export const actionType = {
  ADD_APPLICATION: 'ADD_APPLICATION',
  ADD_SERVICE: 'ADD_SERVICE',
  ADD_ENDPOINT: 'ADD_ENDPOINT',
  REMOVE_APPLICATION: 'REMOVE_APPLICATION',
  REMOVE_SERVICE: 'REMOVE_SERVICE',
  REMOVE_ENDPOINT: 'REMOVE_ENDPOINT'
};

export function listReducer(state, action) {
  const { type, applicationId, serviceId, endpointId, inclusive = true } = action;

  switch (type) {
    case actionType.ADD_APPLICATION: {
      const stateWithApplication = addApplicationIfNotContained(state, action);
      const applicationWithInclusiveValueToggled = toggleInclusiveValueForApplication(
        stateWithApplication,
        { applicationId },
        inclusive
      );
      applicationWithInclusiveValueToggled.inExplicitSelectionMode.delete(applicationId);
      return { ...applicationWithInclusiveValueToggled };
    }
    case actionType.ADD_SERVICE: {
      const stateWithApplication = addApplicationIfNotContained(state, action);
      const stateWithService = addServiceIfNotContained(stateWithApplication, action);
      return toggleInclusiveValueForService(stateWithService, { applicationId, serviceId }, inclusive);
    }
    case actionType.ADD_ENDPOINT: {
      const stateWithApplication = addApplicationIfNotContained(state, action);
      const stateWithService = addServiceIfNotContained(stateWithApplication, action);
      const stateWithEndpoint = addEndpointIfNotContained(stateWithService, action);
      return toggleInclusiveValueForEndpoint(stateWithEndpoint, { applicationId, serviceId, endpointId }, inclusive);
    }
    case actionType.REMOVE_APPLICATION: {
      const stateCopy = { ...state };
      stateCopy.inExplicitSelectionMode.add(applicationId);
      delete stateCopy.userSelectionModel[applicationId];
      return stateCopy;
    }
    case actionType.REMOVE_SERVICE: {
      const application = selectApplication(state, { applicationId }) ?? {};
      const servicesItemTreeCopy = { ...application?.services };
      delete servicesItemTreeCopy[serviceId];

      if (isEmpty(servicesItemTreeCopy)) {
        state.inExplicitSelectionMode.delete(applicationId);
      }

      return {
        ...state,
        userSelectionModel: {
          ...state.userSelectionModel,
          [applicationId]: {
            ...application,
            services: servicesItemTreeCopy
          }
        }
      };
    }
    case actionType.REMOVE_ENDPOINT: {
      const application = selectApplication(state, { applicationId }) ?? {};
      const service = selectService(state, { applicationId, serviceId }) ?? {};

      const endpointsItemTreeCopy = { ...service.endpoints };
      delete endpointsItemTreeCopy[endpointId];

      const endpointsCopyEmpty = isEmpty(endpointsItemTreeCopy);

      let servicesItemTreeCopy = null;
      if (endpointsCopyEmpty) {
        servicesItemTreeCopy = { ...application.services };
        delete servicesItemTreeCopy[serviceId];
      }

      if (isEmpty(servicesItemTreeCopy)) {
        state.inExplicitSelectionMode.delete(applicationId);
      }

      if (endpointsCopyEmpty) {
        return {
          ...state,
          userSelectionModel: {
            ...state.userSelectionModel,
            [applicationId]: {
              ...application,
              services: servicesItemTreeCopy
            }
          }
        };
      }

      return {
        ...state,
        userSelectionModel: {
          ...state.userSelectionModel,
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
        }
      };
    }
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

function addApplicationIfNotContained(state, { applicationId }) {
  const application = selectApplication(state, { applicationId });
  if (isEmpty(application)) {
    return cloneNewStateWithApplication(state, applicationId, { inclusive: true, services: {} });
  }
  return state;
}

function addServiceIfNotContained(state, { applicationId, serviceId }) {
  const service = selectService(state, { applicationId, serviceId });
  if (isEmpty(service)) {
    return cloneNewStateWithService(state, applicationId, { serviceId, inclusive: true, endpoints: {} });
  }
  return state;
}

function addEndpointIfNotContained(state, { applicationId, serviceId, endpointId }) {
  const endpoint = selectEndpoint(state, { applicationId, serviceId, endpointId });
  if (isEmpty(endpoint)) {
    return cloneNewStateWithEndpoint(state, applicationId, serviceId, { endpointId, inclusive: true });
  }
  return state;
}

export function cloneNewStateWithApplication(state, applicationId, applicationConfig) {
  const { inclusive, services } = applicationConfig;
  return {
    ...state,
    userSelectionModel: {
      ...state.userSelectionModel,
      [applicationId]: {
        applicationId,
        inclusive,
        services: inclusive ? services : {}
      }
    }
  };
}

function cloneNewStateWithService(state, applicationId, serviceConfig) {
  const { serviceId, inclusive, endpoints } = serviceConfig;
  const application = selectApplication(state, { applicationId });

  return {
    ...state,
    userSelectionModel: {
      ...state.userSelectionModel,
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
    }
  };
}

function cloneNewStateWithEndpoint(state, applicationId, serviceId, endpointConfig) {
  const { endpointId, inclusive } = endpointConfig;
  const application = selectApplication(state, { applicationId });
  const service = selectService(state, { applicationId, serviceId });

  return {
    ...state,
    userSelectionModel: {
      ...state.userSelectionModel,
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
    }
  };
}

function toggleInclusiveValueForApplication(state, itemTreeIds, inclusive) {
  const { applicationId } = itemTreeIds;
  const application = selectApplication(state, { applicationId });
  if (application.inclusive !== inclusive) {
    return cloneNewStateWithApplication(state, applicationId, { ...application, inclusive });
  }
  return state;
}

function toggleInclusiveValueForService(state, itemTreeIds, inclusive) {
  const { applicationId } = itemTreeIds;
  const service = selectService(state, itemTreeIds);
  if (service.inclusive !== inclusive) {
    return cloneNewStateWithService(state, applicationId, { ...service, inclusive });
  }
  return state;
}

function toggleInclusiveValueForEndpoint(state, itemTreeIds, inclusive) {
  const { applicationId, serviceId, endpointId } = itemTreeIds;
  const endpoint = selectEndpoint(state, itemTreeIds);
  if (endpoint.inclusive !== inclusive) {
    return cloneNewStateWithEndpoint(state, applicationId, serviceId, { endpointId, inclusive });
  }
  return state;
}
