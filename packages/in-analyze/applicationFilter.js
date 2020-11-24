import { get } from 'lodash';

import { applicationId, serviceId, endpointId } from 'in-analyze/navigation/matrix';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';

export const APPLICATION = {
  id: applicationId,
  name: 'application.name',
  technicalName: 'application.name',
  label: 'Application'
};

export const APPLICATION_INBOUND = {
  id: applicationId,
  name: 'call.inbound_of_application',
  technicalName: 'call.inbound_of_application',
  label: 'Application Inbound'
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
  NOT_CONTAIN: 'NOT_CONTAIN',
  NOT_BLANK: 'NOT_BLANK',
  IS_BLANK: 'IS_BLANK',
  STARTS_WITH: 'STARTS_WITH',
  ENDS_WITH: 'ENDS_WITH',
  NOT_STARTS_WITH: 'NOT_STARTS_WITH',
  NOT_ENDS_WITH: 'NOT_ENDS_WITH',
  GREATER_OR_EQUAL_THAN: 'GREATER_OR_EQUAL_THAN',
  LESS_OR_EQUAL_THAN: 'LESS_OR_EQUAL_THAN'
};

export const entityTypes = {
  SOURCE_AND_DESTINATION: 'SOURCE_AND_DESTINATION',
  DESTINATION: 'DESTINATION',
  SOURCE: 'SOURCE',
  NOT_APPLICABLE: 'NOT_APPLICABLE'
};

export const entityTypesLUT = {
  SOURCE_AND_DESTINATION: 'Source & Destination',
  DESTINATION: 'Destination',
  SOURCE: 'Source',
  NOT_APPLICABLE: ''
};

export const disabledOperators = {
  syntheticEndpointConfig: [operators.NOT_EQUAL, operators.NOT_CONTAIN, operators.NOT_EMPTY, operators.IS_EMPTY]
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
      operators.IS_EMPTY,
      operators.STARTS_WITH,
      operators.ENDS_WITH,
      operators.NOT_STARTS_WITH,
      operators.NOT_ENDS_WITH
    ]
  },
  NUMBER: {
    technicalName: 'NUMBER',
    operators: [
      operators.EQUALS,
      operators.NOT_EQUAL,
      operators.LESS_THAN,
      operators.GREATER_THAN,
      operators.NOT_EMPTY,
      operators.IS_EMPTY,
      operators.LESS_OR_EQUAL_THAN,
      operators.GREATER_OR_EQUAL_THAN
    ]
  },
  BOOLEAN: {
    technicalName: 'BOOLEAN',
    operators: [operators.EQUALS]
  },
  KEY_VALUE_PAIR: {
    technicalName: 'KEY_VALUE_PAIR',
    operators: [
      operators.EQUALS,
      operators.NOT_EQUAL,
      operators.CONTAINS,
      operators.NOT_CONTAIN,
      operators.NOT_EMPTY,
      operators.IS_EMPTY,
      operators.STARTS_WITH,
      operators.ENDS_WITH,
      operators.NOT_BLANK,
      operators.IS_BLANK
    ],
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
    IS_EMPTY: 'is not present',
    STARTS_WITH: 'starts with',
    ENDS_WITH: 'ends with',
    NOT_STARTS_WITH: 'does not start with',
    NOT_ENDS_WITH: 'does not end with'
  },
  NUMBER: {
    EQUALS: '=',
    NOT_EQUAL: '!=',
    LESS_THAN: '<',
    GREATER_THAN: '>',
    NOT_EMPTY: 'is present',
    IS_EMPTY: 'is not present',
    LESS_OR_EQUAL_THAN: '<=',
    GREATER_OR_EQUAL_THAN: '>=',
    // support string operators, currently used only for the 'call.http.status' tag
    CONTAINS: 'contains',
    NOT_CONTAIN: 'does not contain',
    STARTS_WITH: 'starts with',
    ENDS_WITH: 'ends with',
    NOT_STARTS_WITH: 'does not start with',
    NOT_ENDS_WITH: 'does not end with'
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
    IS_EMPTY: 'is not present',
    IS_BLANK: 'does not have value',
    NOT_BLANK: 'has value',
    STARTS_WITH: 'starts with',
    ENDS_WITH: 'ends with'
  }
};

export function getEntityLabel(entity) {
  return get(entityTypes, [entity]);
}

export function getEntityLabelLUT(entity) {
  return get(entityTypesLUT, [entity]);
}

export function getOperatorLabel(type, operator) {
  return get(operatorLabelLUT, [type, operator], operator);
}

export function getTagFilterListForBackendSubscription(tagFilters = [], defaultFilters = []) {
  if (!tagFilters) tagFilters = [];
  const tagFilterKeys = tagFilters.map(tagFilter => tagFilter.name);
  // user provided tag filters will override default ones
  const defaultFiltersToAdd = defaultFilters.filter(defaultFilter => !tagFilterKeys.includes(defaultFilter.name));

  return tagFilters.concat(defaultFiltersToAdd).map(tag => {
    const backendTagFilter = { name: tag.name || tag.key, operator: tag.operator, entity: tag.entity };
    addValue(backendTagFilter, tag);
    return backendTagFilter;
  });
}

function addValue(backendTagFilter, tag) {
  const node = findSubTreeByFullyQualifiedName(backendTagFilter.name);
  const type = node ? node.type : TAG_TYPES.STRING.technicalName;

  if (type === TAG_TYPES.NUMBER.technicalName) {
    backendTagFilter.numberValue = tag.value ?? tag.numberValue;
  } else if (type === TAG_TYPES.BOOLEAN.technicalName) {
    backendTagFilter.booleanValue = tag.value ?? tag.booleanValue;
  } else {
    backendTagFilter.stringValue = tag.secondLevelName
      ? `${tag.secondLevelName}=${tag.value}`
      : tag.value || tag.stringValue;
  }
}

export function convertToApplicationAreaSpecificTagFilter(tagFilters) {
  return tagFilters.map(({ name, operator, entity, stringValue, booleanValue, numberValue }) => {
    const node = findSubTreeByFullyQualifiedName(name);
    let value = stringValue ?? booleanValue ?? numberValue;
    let secondLevelName;
    if (node?.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName && value) {
      const parts = stringValue.split('=', 2);
      if (parts.length === 2) {
        value = parts[1];
        secondLevelName = parts[0];
      }
    }
    return {
      name,
      secondLevelName,
      operator,
      value,
      entity
    };
  });
}
