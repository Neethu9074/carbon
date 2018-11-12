import { get } from 'lodash';

import { applicationId, serviceId, endpointId } from 'in-analyze/navigation/matrix';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';

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
  NOT_EMPTY: 'NOT_EMPTY',
  IS_EMPTY: 'IS_EMPTY',
  NOT_EQUAL: 'NOT_EQUAL',
  NOT_CONTAIN: 'NOT_CONTAIN'
};

export const TAG_TYPES = {
  STRING: {
    technicalName: 'STRING',
    operators: [
      operators.EQUALS,
      operators.NOT_EQUAL,
      operators.CONTAINS,
      operators.NOT_CONTAIN,
      operators.NOT_EMPTY,
      operators.IS_EMPTY
    ],
    appConfigOperators: [operators.EQUALS, operators.CONTAINS, operators.NOT_EMPTY]
  },
  NUMBER: {
    technicalName: 'NUMBER',
    operators: [operators.EQUALS, operators.NOT_EQUAL, operators.LESS_THAN, operators.GREATER_THAN, operators.IS_EMPTY],
    appConfigOperators: [operators.EQUALS, operators.LESS_THAN, operators.GREATER_THAN]
  },
  BOOLEAN: {
    technicalName: 'BOOLEAN',
    operators: [operators.EQUALS],
    appConfigOperators: [operators.EQUALS]
  },
  KEY_VALUE_PAIR: {
    technicalName: 'KEY_VALUE_PAIR',
    operators: [
      operators.EQUALS,
      operators.NOT_EQUAL,
      operators.CONTAINS,
      operators.NOT_CONTAIN,
      operators.NOT_EMPTY,
      operators.IS_EMPTY
    ],
    appConfigOperators: [operators.EQUALS, operators.CONTAINS, operators.NOT_EMPTY],
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
    NOT_EQUAL: 'does not equal',
    CONTAINS: 'contains',
    NOT_CONTAIN: 'does not contain',
    NOT_EMPTY: 'is present',
    IS_EMPTY: 'is not present'
  },
  NUMBER: {
    EQUALS: '=',
    NOT_EQUAL: '!=',
    LESS_THAN: '<',
    GREATER_THAN: '>',
    NOT_EMPTY: 'is present',
    IS_EMPTY: 'is not present'
  },
  BOOLEAN: {
    EQUALS: 'is'
  },
  KEY_VALUE_PAIR: {
    EQUALS: 'equals',
    NOT_EQUAL: 'does not equal',
    CONTAINS: 'contains',
    NOT_CONTAIN: 'does not contain',
    NOT_EMPTY: 'is present',
    IS_EMPTY: 'is not present'
  }
};

export function getOperatorLabel(type, operator) {
  return get(operatorLabelLUT, [type, operator], operator);
}

export function getTagFilterListForBackendSubscription(tagFilters) {
  return tagFilters.map(tag => {
    const backendTagFilter = { name: tag.name || tag.key, operator: tag.operator };
    getValueByTag(backendTagFilter, tag);
    return backendTagFilter;
  });
}

function getValueByTag(backendTagFilter, tag) {
  const node = findSubTreeByFullyQualifiedName(backendTagFilter.name);
  const type = node ? node.type : TAG_TYPES.STRING.technicalName;

  if (type === TAG_TYPES.NUMBER.technicalName) {
    backendTagFilter.numberValue = tag.value;
  } else if (type === TAG_TYPES.BOOLEAN.technicalName) {
    backendTagFilter.booleanValue = tag.value;
  } else {
    backendTagFilter.stringValue = tag.secondLevelName ? `${tag.secondLevelName}=${tag.value}` : tag.value;
  }
}
