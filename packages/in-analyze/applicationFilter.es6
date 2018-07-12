import { get } from 'lodash';

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

const operators = {
  EQUALS: 'EQUALS',
  CONTAINS: 'CONTAINS',
  LESS_THAN: 'LESS_THAN',
  GREATER_THAN: 'GREATER_THAN'
};

export const TAG_TYPES = {
  STRING: {
    technicalName: 'STRING',
    operators: [operators.EQUALS, operators.CONTAINS]
  },
  NUMBER: {
    technicalName: 'NUMBER',
    operators: [operators.EQUALS, operators.LESS_THAN, operators.GREATER_THAN]
  },
  BOOLEAN: {
    technicalName: 'BOOLEAN',
    operators: [operators.EQUALS]
  },
  KEY_VALUE_PAIR: {
    technicalName: 'KEY_VALUE_PAIR',
    operators: [operators.EQUALS, operators.CONTAINS]
  }
};

const operatorLabelLUT = {
  STRING: {
    EQUALS: 'equals',
    CONTAINS: 'contains'
  },
  NUMBER: {
    EQUALS: '=',
    LESS_THAN: '<',
    GREATER_THAN: '>'
  },
  BOOLEAN: {
    EQUALS: 'is'
  },
  KEY_VALUE_PAIR: {
    EQUALS: 'equals',
    CONTAINS: 'contains'
  }
};
export function getOperatorLabel(type, operator) {
  return get(operatorLabelLUT, [type, operator], operator);
}
