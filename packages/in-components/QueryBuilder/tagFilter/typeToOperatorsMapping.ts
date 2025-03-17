/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ApiTag, TagFilterOperator } from '@instana/types';

import {
  EQUALS,
  CONTAINS,
  LESS_THAN,
  GREATER_THAN,
  NOT_EMPTY,
  IS_EMPTY,
  NOT_EQUAL,
  NOT_CONTAIN,
  NOT_BLANK,
  IS_BLANK,
  STARTS_WITH,
  ENDS_WITH,
  NOT_STARTS_WITH,
  NOT_ENDS_WITH,
  GREATER_OR_EQUAL_THAN,
  LESS_OR_EQUAL_THAN
} from 'in-components/QueryBuilder/tagFilter/operators';
import { emptyArray } from 'in-services/fixedObjects';

// "ID" is not an actual tag TYPE. It can be seen as a subtype. It's based on tag's "idTag" property.
export const ID = [EQUALS, NOT_EQUAL, NOT_EMPTY, IS_EMPTY];

export const BOOLEAN = [EQUALS];

export const STRING = [
  EQUALS,
  NOT_EQUAL,
  CONTAINS,
  NOT_CONTAIN,
  NOT_EMPTY,
  IS_EMPTY,
  STARTS_WITH,
  ENDS_WITH,
  NOT_STARTS_WITH,
  NOT_ENDS_WITH
];
export const STRING_SET = STRING;
export const STRING_LIST = STRING_SET;

export const NUMBER = [
  EQUALS,
  NOT_EQUAL,
  LESS_THAN,
  GREATER_THAN,
  NOT_EMPTY,
  IS_EMPTY,
  LESS_OR_EQUAL_THAN,
  GREATER_OR_EQUAL_THAN
];

export const KEY_VALUE_PAIR = [
  EQUALS,
  NOT_EQUAL,
  CONTAINS,
  NOT_CONTAIN,
  NOT_EMPTY,
  IS_EMPTY,
  STARTS_WITH,
  ENDS_WITH,
  NOT_BLANK,
  IS_BLANK
];

export const KEY_NUMBER_PAIR = NUMBER;

export const FLOAT_LIST = NUMBER;

const ADDITIONAL_OPERATORS_BY_SOURCE_AND_TYPE: { [source: string]: { [type: string]: TagFilterOperator[] } } = {
  infrastructure: {
    STRING: [NOT_BLANK, IS_BLANK],
    STRING_SET: [NOT_BLANK, IS_BLANK],
    STRING_LIST: [NOT_BLANK, IS_BLANK]
  }
};

export function getAllowedOperators(tagDefinition: ApiTag, source?: string): Readonly<string[]> {
  return [...getDefaultOperators(tagDefinition), ...getAdditionalAllowedOperatorsBySource(tagDefinition, source)];
}

export function getAdditionalAllowedOperatorsBySource({ type }: { type: string }, source?: string): Readonly<string[]> {
  if (!source) {
    return [];
  }
  return ADDITIONAL_OPERATORS_BY_SOURCE_AND_TYPE[source]?.[type] ?? [];
}

export function getDefaultOperators({ type, idTag = false }: { type: string; idTag?: boolean }): Readonly<string[]> {
  if (idTag) {
    return ID;
  }
  if (type === 'BOOLEAN') {
    return BOOLEAN;
  }
  if (type === 'STRING' || type === 'STRING_SET' || type === 'STRING_LIST') {
    return STRING;
  }
  if (type === 'NUMBER') {
    return NUMBER;
  }
  if (type === 'KEY_VALUE_PAIR') {
    return KEY_VALUE_PAIR;
  }
  if (type === 'KEY_NUMBER_PAIR') {
    return KEY_NUMBER_PAIR;
  }
  if (type === 'FLOAT_LIST') {
    return FLOAT_LIST;
  }
  return emptyArray;
}
