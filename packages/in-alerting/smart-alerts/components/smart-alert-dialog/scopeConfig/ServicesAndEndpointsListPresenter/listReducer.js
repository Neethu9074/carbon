/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';

import {
  selectApplication,
  selectEndpoint,
  selectService
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/selectors';

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

  const applicationInclusive = Boolean(selectApplication(state, { applicationId })?.inclusive);
  const serviceInclusive = Boolean(selectService(state, { applicationId, serviceId })?.inclusive);
  const endpointInclusive = Boolean(selectEndpoint(state, { applicationId, serviceId, endpointId })?.inclusive);

  switch (type) {
    case actionType.ADD_APPLICATION: {
      return addApplicationIfNotContained(state, action, !applicationInclusive);
    }
    case actionType.ADD_SERVICE: {
      const stateWithApplication = addApplicationIfNotContained(state, action, applicationInclusive);
      const stateWithService = addServiceIfNotContained(stateWithApplication, action, !applicationInclusive);
      return stateWithService;
    }
    case actionType.ADD_ENDPOINT: {
      const stateWithApplication = addApplicationIfNotContained(state, action, applicationInclusive);
      const stateWithService = addServiceIfNotContained(stateWithApplication, action, applicationInclusive);

      const newServiceInclusiveValue = selectService(stateWithService, { applicationId, serviceId })?.inclusive;
      const stateWithEndpoint = addEndpointIfNotContained(
        stateWithService,
        action,
        !newServiceInclusiveValue || endpointInclusive
      );

      return stateWithEndpoint;
    }
    case actionType.REMOVE_APPLICATION: {
      const stateCopy = { ...state };
      delete stateCopy[applicationId];
      return stateCopy;
    }
    case actionType.REMOVE_SERVICE: {
      const application = selectApplication(state, { applicationId }) ?? {};
      const servicesItemTreeCopy = { ...application?.services };
      delete servicesItemTreeCopy[serviceId];

      if (!applicationInclusive && isEmpty(servicesItemTreeCopy)) {
        const applicationsCopy = { ...state };
        delete applicationsCopy[applicationId];

        return applicationsCopy;
      }

      return {
        ...state,
        [applicationId]: {
          ...application,
          services: servicesItemTreeCopy
        }
      };
    }
    case actionType.REMOVE_ENDPOINT: {
      const application = selectApplication(state, { applicationId }) ?? {};
      const service = selectService(state, { applicationId, serviceId }) ?? {};

      const endpointsItemTreeCopy = { ...service.endpoints };
      delete endpointsItemTreeCopy[endpointId];

      if (applicationInclusive && serviceInclusive && isEmpty(endpointsItemTreeCopy)) {
        const servicesCopy = { ...application.services };
        delete servicesCopy[serviceId];

        return {
          ...state,
          [applicationId]: {
            ...application,
            services: {
              ...servicesCopy
            }
          }
        };
      }

      if (!applicationInclusive && !serviceInclusive && isEmpty(endpointsItemTreeCopy)) {
        const applicationsCopy = { ...state };
        const servicesCopy = { ...application.services };
        delete servicesCopy[serviceId];
        if (isEmpty(servicesCopy)) {
          delete applicationsCopy[applicationId];
          return applicationsCopy;
        }

        return {
          ...state,
          [applicationId]: {
            ...application,
            services: {
              ...servicesCopy
            }
          }
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

function addApplicationIfNotContained(state, { applicationId }, inclusive) {
  const application = selectApplication(state, { applicationId });
  if (isEmpty(application) || application?.inclusive !== inclusive) {
    return cloneNewStateWithApplication(state, applicationId, { inclusive, services: {} });
  }

  return state;
}

function addServiceIfNotContained(state, { applicationId, serviceId }, inclusive) {
  const service = selectService(state, { applicationId, serviceId });
  if (isEmpty(service)) {
    return cloneNewStateWithService(state, applicationId, { serviceId, inclusive, endpoints: {} });
  }
  return state;
}

function addEndpointIfNotContained(state, { applicationId, serviceId, endpointId }, inclusive) {
  const endpoint = selectEndpoint(state, { applicationId, serviceId, endpointId });
  if (isEmpty(endpoint)) {
    return cloneNewStateWithEndpoint(state, applicationId, serviceId, { endpointId, inclusive });
  }
  return state;
}

export function cloneNewStateWithApplication(state, applicationId, applicationConfig) {
  const { inclusive, services } = applicationConfig;
  return {
    ...state,
    [applicationId]: {
      applicationId,
      inclusive,
      services: inclusive ? services : {}
    }
  };
}

function cloneNewStateWithService(state, applicationId, serviceConfig) {
  const { serviceId, inclusive, endpoints } = serviceConfig;
  const application = selectApplication(state, { applicationId });

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

function cloneNewStateWithEndpoint(state, applicationId, serviceId, endpointConfig) {
  const { endpointId, inclusive } = endpointConfig;
  const application = selectApplication(state, { applicationId });
  const service = selectService(state, { applicationId, serviceId });

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
