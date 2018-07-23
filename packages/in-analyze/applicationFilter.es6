import { get } from 'lodash';

import { applicationId, serviceId, endpointId } from 'in-analyze/navigation/matrix';

export const APPLICATION = {
  id: applicationId,
  name: 'application.name',
  technicalName: 'application.name',
  label: 'Application'
};

export const SERVICE = {
  id: serviceId,
  name: 'service.name',
  technicalName: 'service.name',
  label: 'Service'
};

export const ENDPOINT = {
  id: endpointId,
  name: 'endpoint.name',
  technicalName: 'endpoint.name',
  label: 'Endpoint'
};

export const operators = {
  EQUALS: 'EQUALS',
  CONTAINS: 'CONTAINS',
  LESS_THAN: 'LESS_THAN',
  GREATER_THAN: 'GREATER_THAN',
  NOT_EMPTY: 'NOT_EMPTY'
};

export const TAG_TYPES = {
  STRING: {
    technicalName: 'STRING',
    operators: [operators.EQUALS, operators.CONTAINS, operators.NOT_EMPTY]
  },
  NUMBER: {
    technicalName: 'NUMBER',
    operators: [operators.EQUALS, operators.LESS_THAN, operators.GREATER_THAN, operators.NOT_EMPTY]
  },
  BOOLEAN: {
    technicalName: 'BOOLEAN',
    operators: [operators.EQUALS]
  },
  KEY_VALUE_PAIR: {
    technicalName: 'KEY_VALUE_PAIR',
    operators: [operators.EQUALS, operators.CONTAINS, operators.NOT_EMPTY],
    splitValue: value => {
      if (value.indexOf('=') === -1) {
        return {
          key: '',
          value
        };
      }
      const parts = value.split('=');
      const key = parts[0];

      if (parts.length > 1) {
        value = value.slice(key.length + 1); // also remove the =
      }
      return { key, value };
    }
  }
};

const operatorLabelLUT = {
  STRING: {
    EQUALS: 'equals',
    CONTAINS: 'contains',
    NOT_EMPTY: 'not empty'
  },
  NUMBER: {
    EQUALS: '=',
    LESS_THAN: '<',
    GREATER_THAN: '>',
    NOT_EMPTY: 'not empty'
  },
  BOOLEAN: {
    EQUALS: 'is'
  },
  KEY_VALUE_PAIR: {
    EQUALS: 'equals',
    CONTAINS: 'contains',
    NOT_EMPTY: 'not empty'
  }
};
export function getOperatorLabel(type, operator) {
  return get(operatorLabelLUT, [type, operator], operator);
}
