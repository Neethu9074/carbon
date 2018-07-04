import { applicationId, serviceId, endpointId } from 'in-analyze/navigation/matrix';
import { createFilter } from 'in-analyze/CallsList/filterBuilder';

export const APPLICATION = {
  id: applicationId,
  name: 'application.name',
  technicalName: 'application.name',
  label: 'Application Name',
  icon: 'lib_application',
  createFilter: value => {
    return createFilter({
      id: applicationId,
      name: 'application.name',
      value
    });
  }
};

export const SERVICE = {
  id: serviceId,
  name: 'service.name',
  technicalName: 'service.name',
  label: 'Service Name',
  icon: 'lib_application_service',
  createFilter: value => {
    return createFilter({
      id: serviceId,
      name: 'service.name',
      value
    });
  }
};

export const ENDPOINT = {
  id: endpointId,
  name: 'endpoint.name',
  technicalName: 'endpoint.name',
  label: 'Endpoint Name',
  icon: 'lib_application_endpoint',
  createFilter: value => {
    return createFilter({
      id: endpointId,
      name: 'endpoint.name',
      value
    });
  }
};

export const TAG_TYPES = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  KEY_VALUE_PAIR: 'KEY_VALUE_PAIR'
};
