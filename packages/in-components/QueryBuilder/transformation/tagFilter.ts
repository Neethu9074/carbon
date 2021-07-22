/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { pick } from 'lodash';

import { createLogger } from '@instana/logger';

import {
  EQUALS,
  NOT_EQUAL,
  NOT_STARTS_WITH,
  STARTS_WITH,
  ENDS_WITH,
  NOT_ENDS_WITH
} from 'in-components/QueryBuilder/tagFilter/operators';
import { KEY_VALUE_PAIR, BOOLEAN, NUMBER } from 'in-components/QueryBuilder/tagFilter/types';
import { STRING_MAX_LENGTH } from 'in-components/QueryBuilder/tagFilter/constraints';
import { TagCatalog, TagFilter, TagFilterOperator } from 'in-types';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';
import { isNotBlank } from 'in-services/util/string';

const logger = createLogger('in-components/QueryBuilder/transformation/tagFilter');

export const type = 'TAG_FILTER';

const tagFilterFields = ['type', 'name', 'key', 'value', 'operator', 'entity'];

export function toTagFilter(tagFilterLike: Object): TagFilter {
  return {
    ...pick(tagFilterLike, tagFilterFields),
    // Enforce valid type
    type
  } as TagFilter;
}

// A tag filter with a string value exceeding the max length is invalid, to fix that
// shorten the value and change the operator if needed.
export function sanitizeTagFilter(tagFilter: TagFilter): TagFilter {
  if (typeof tagFilter.value !== 'string' || tagFilter.value.length <= STRING_MAX_LENGTH) {
    return tagFilter;
  }

  if (tagFilter.operator === EQUALS) {
    return { ...tagFilter, value: tagFilter.value.substring(0, STRING_MAX_LENGTH), operator: STARTS_WITH };
  }
  if (tagFilter.operator === NOT_EQUAL) {
    return { ...tagFilter, value: tagFilter.value.substring(0, STRING_MAX_LENGTH), operator: NOT_STARTS_WITH };
  }
  if (tagFilter.operator === ENDS_WITH || tagFilter.operator === NOT_ENDS_WITH) {
    return {
      ...tagFilter,
      value: tagFilter.value.substring(tagFilter.value.length - STRING_MAX_LENGTH)
    };
  }

  return { ...tagFilter, value: tagFilter.value.substring(0, STRING_MAX_LENGTH) };
}

export function toNewTagFilterFormat(tagFilter: TagFilter, tagCatalog: TagCatalog): TagFilter {
  let key;
  let value = tagFilter.value;
  // In some cases the operator is in lower case or missing, which is no longer supported
  let operator = (tagFilter.operator?.toUpperCase() || EQUALS) as TagFilterOperator;

  if (tagFilter.booleanValue != null) {
    value = transformBooleanValue(tagFilter.booleanValue);
  } else if (tagFilter.numberValue != null) {
    value = transformNumberValue(tagFilter.numberValue);
  } else if (tagFilter.stringValue != null) {
    const transformationResult = transformStringValue(tagCatalog, tagFilter.name, tagFilter.stringValue);
    key = transformationResult.key;
    value = transformationResult.value;
  } else {
    value = transformValue(tagCatalog, tagFilter);
  }

  return {
    ...toTagFilter(tagFilter),
    type,
    key,
    value,
    operator
  };
}

function transformBooleanValue(value: any): boolean {
  return value === 'true' || value === true;
}

function transformNumberValue(value: any): number {
  return Number(value);
}

function transformValue(tagCatalog: TagCatalog | undefined, tagFilter: TagFilter) {
  let value = tagFilter.value;

  const tagDefinition = tagCatalog && enrichTagCatalog(tagCatalog).tagsByName[tagFilter.name];
  if (tagDefinition) {
    if (tagDefinition.type === NUMBER) {
      if (value != null) {
        // In some cases the numeric value is a string
        value = transformNumberValue(value);
      }
    } else if (tagDefinition.type === BOOLEAN) {
      if (value != null) {
        // In some cases the boolean value is a string
        value = transformBooleanValue(value);
      }
    }
  }
  return value;
}

function transformStringValue(tagCatalog: TagCatalog, tagName: string, stringValue: string) {
  let key;
  let value;

  const enrichedTagCatalog = enrichTagCatalog(tagCatalog);
  const tagDefinition = enrichedTagCatalog.tagsByName[tagName];

  if (tagDefinition) {
    if (tagDefinition.type === KEY_VALUE_PAIR) {
      const splitResult = stringValue.split('=', 2);
      if (isNotBlank(splitResult[0])) {
        key = splitResult[0];
      }
      if (isNotBlank(splitResult[1])) {
        value = splitResult[1];
      }
    } else {
      value = stringValue;
    }
  } else {
    logger.warn('Failed to tag find definition for tag name "%s"', tagName);
    // We can only guess that this is most likely a regular value. This situation
    // is highly unlikely to happen.
    value = stringValue;
  }

  return { key, value };
}

export function tagFilter(name: string, operator: TagFilterOperator, value?: any, key?: string) {
  return { type, name, operator, ...(value != null && { value }), ...(key != null && { key }) };
}
