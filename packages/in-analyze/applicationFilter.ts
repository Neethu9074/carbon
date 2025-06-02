/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

// eslint-disable-next-line no-restricted-imports
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { applicationId, serviceId, endpointId, subtraceId } from 'in-analyze/navigation/matrix';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { TagFilter } from 'in-types';
import { t } from 'in-i18n';

export const APPLICATION = {
  id: applicationId,
  name: 'application.name',
  technicalName: 'application.name',
  label: t('in-analyze:applicationFilter.labelApplication')
} as const;

export const APPLICATION_INBOUND = {
  id: applicationId,
  name: 'call.inbound_of_application',
  technicalName: 'call.inbound_of_application',
  label: t('in-analyze:applicationFilter.labelApplicationInbound')
} as const;

export const SERVICE = {
  id: serviceId,
  name: 'service.name',
  technicalName: 'service.name',
  label: t('in-analyze:applicationFilter.labelService')
} as const;

export const ENDPOINT = {
  id: endpointId,
  name: 'endpoint.name',
  technicalName: 'endpoint.name',
  label: t('in-analyze:applicationFilter.labelEndpoint')
} as const;
export const SUBTRACE = {
  id: subtraceId,
  name: 'subtrace.name',
  technicalName: 'subtrace.name',
  label: t('in-applications:subtraces.labelSubtrace')
} as const;

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
} as const;
export type Operator = keyof typeof operators;

export const entityTypes = {
  SOURCE_AND_DESTINATION: 'SOURCE_AND_DESTINATION',
  DESTINATION: 'DESTINATION',
  SOURCE: 'SOURCE',
  NOT_APPLICABLE: 'NOT_APPLICABLE'
} as const;
export type EntityType = keyof typeof entityTypes;

export const entityTypesLUT: Record<EntityType, string> = {
  SOURCE_AND_DESTINATION: t('in-analyze:applicationFilter.labelSOURCE_AND_DESTINATION'),
  DESTINATION: t('in-analyze:applicationFilter.labelDESTINATION'),
  SOURCE: t('in-analyze:applicationFilter.labelSOURCE'),
  NOT_APPLICABLE: t('in-analyze:applicationFilter.labelNOTAPPLICABLE')
} as const;

export const disabledOperators = {
  syntheticEndpointConfig: [operators.NOT_EQUAL, operators.NOT_CONTAIN, operators.NOT_EMPTY, operators.IS_EMPTY]
} as const;

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
    splitValue: (value: string) => {
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
} as const;
export type TagType = keyof typeof TAG_TYPES;

const operatorLabelLUT = {
  STRING: {
    EQUALS: t('in-analyze:applicationFilter.labelStringEQUALS'),
    NOT_EQUAL: t('in-analyze:applicationFilter.labelStringNOT_EQUAL'),
    CONTAINS: t('in-analyze:applicationFilter.labelStringCONTAINS'),
    NOT_CONTAIN: t('in-analyze:applicationFilter.labelStringNOT_CONTAIN'),
    NOT_EMPTY: t('in-analyze:applicationFilter.labelStringNOT_EMPTY'),
    IS_EMPTY: t('in-analyze:applicationFilter.labelStringIS_EMPTY'),
    STARTS_WITH: t('in-analyze:applicationFilter.labelStringSTARTS_WITH'),
    ENDS_WITH: t('in-analyze:applicationFilter.labelStringENDS_WITH'),
    NOT_STARTS_WITH: t('in-analyze:applicationFilter.labelStringNOT_STARTS_WITH'),
    NOT_ENDS_WITH: t('in-analyze:applicationFilter.labelStringNOT_ENDS_WITH')
  },
  NUMBER: {
    EQUALS: t('in-analyze:applicationFilter.labelNumberEQUALS'),
    NOT_EQUAL: t('in-analyze:applicationFilter.labelNumberNOT_EQUAL'),
    LESS_THAN: t('in-analyze:applicationFilter.labelNumberLESS_THAN'),
    GREATER_THAN: t('in-analyze:applicationFilter.labelNumberGREATER_THAN'),
    NOT_EMPTY: t('in-analyze:applicationFilter.labelNumberNOT_EMPTY'),
    IS_EMPTY: t('in-analyze:applicationFilter.labelNumberIS_EMPTY'),
    LESS_OR_EQUAL_THAN: t('in-analyze:applicationFilter.labelNumberLESS_OR_EQUAL_THAN'),
    GREATER_OR_EQUAL_THAN: t('in-analyze:applicationFilter.labelNumberGREATER_OR_EQUAL_THAN'),
    // support string operators, currently used only for the 'call.http.status' tag
    CONTAINS: t('in-analyze:applicationFilter.labelNumberCONTAINS'),
    NOT_CONTAIN: t('in-analyze:applicationFilter.labelNumberNOT_CONTAIN'),
    STARTS_WITH: t('in-analyze:applicationFilter.labelNumberSTARTS_WITH'),
    ENDS_WITH: t('in-analyze:applicationFilter.labelNumberENDS_WITH'),
    NOT_STARTS_WITH: t('in-analyze:applicationFilter.labelNumberNOT_STARTS_WITH'),
    NOT_ENDS_WITH: t('in-analyze:applicationFilter.labelNumberNOT_ENDS_WITH')
  },
  BOOLEAN: {
    EQUALS: t('in-analyze:applicationFilter.labelBooleanEQUALS')
  },
  KEY_VALUE_PAIR: {
    EQUALS: t('in-analyze:applicationFilter.labelKeyPairEQUALS'),
    NOT_EQUAL: t('in-analyze:applicationFilter.labelKeyPairNOT_EQUAL'),
    CONTAINS: t('in-analyze:applicationFilter.labelKeyPairCONTAINS'),
    NOT_CONTAIN: t('in-analyze:applicationFilter.labelKeyPairNOT_CONTAIN'),
    NOT_EMPTY: t('in-analyze:applicationFilter.labelKeyPairNOT_EMPTY'),
    IS_EMPTY: t('in-analyze:applicationFilter.labelKeyPairIS_EMPTY'),
    IS_BLANK: t('in-analyze:applicationFilter.labelKeyPairIS_BLANK'),
    NOT_BLANK: t('in-analyze:applicationFilter.labelKeyPairNOT_BLANK'),
    STARTS_WITH: t('in-analyze:applicationFilter.labelKeyPairSTARTS_WITH'),
    ENDS_WITH: t('in-analyze:applicationFilter.labelKeyPairENDS_WITH')
  }
} as const;

export function getEntityLabel(entity: EntityType): string {
  return get(entityTypes, [entity]);
}

export function getEntityLabelLUT(entity: EntityType): string {
  return get(entityTypesLUT, [entity]);
}

export function getOperatorLabel(type: TagType, operator: Operator): string {
  return get(operatorLabelLUT, [type, operator], operator);
}

export interface ApplicationTagFilter extends Omit<TagFilter, 'name'> {
  secondLevelName?: string;
  name?: string; // Usage suggests that name is actually optional here
} // TODO: remove this once better typing is available
export function getTagFilterListForBackendSubscription(
  tagFilters: ApplicationTagFilter[] = [],
  defaultFilters: ApplicationTagFilter[] = []
): TagFilter[] {
  if (!tagFilters) tagFilters = [];
  const tagFilterKeys = tagFilters.map(tagFilter => tagFilter.name);
  // user provided tag filters will override default ones
  const defaultFiltersToAdd = defaultFilters.filter(defaultFilter => !tagFilterKeys.includes(defaultFilter.name));

  return tagFilters.concat(defaultFiltersToAdd).map(tag => {
    const backendTagFilter = tagFilter(
      tag.name || tag.key!, // TODO: clean this up, for now it can be assumed that either name or key will be present
      tag.operator,
      undefined,
      undefined,
      tag.entity
    );
    return addValue(backendTagFilter, tag);
  });
}

function addValue(backendTagFilter: TagFilter, tag: ApplicationTagFilter): TagFilter {
  const node = findSubTreeByFullyQualifiedName(backendTagFilter.name);
  const type = node ? node.type : TAG_TYPES.STRING.technicalName;

  if (type === TAG_TYPES.NUMBER.technicalName) {
    return { ...backendTagFilter, numberValue: tag.value ?? tag.numberValue };
  } else if (type === TAG_TYPES.BOOLEAN.technicalName) {
    return { ...backendTagFilter, booleanValue: tag.value ?? tag.booleanValue };
  } else {
    return {
      ...backendTagFilter,
      stringValue: tag.secondLevelName ? `${tag.secondLevelName}=${tag.value}` : tag.value || tag.stringValue
    };
  }
}

export function convertToApplicationAreaSpecificTagFilter(tagFilters: TagFilter[]): ApplicationTagFilter[] {
  return tagFilters.map(({ name, operator, entity, stringValue, booleanValue, numberValue, type }) => {
    const node = findSubTreeByFullyQualifiedName(name);
    let value = stringValue ?? booleanValue ?? numberValue;
    let secondLevelName;
    if (node?.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName && value) {
      const parts = stringValue?.split('=', 2) ?? [];
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
      entity,
      type
    };
  });
}
