/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { pick } from 'lodash';

import { createLogger } from '@instana/logger';

import { EQUALS, NOT_EQUAL, NOT_STARTS_WITH, STARTS_WITH } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { KEY_VALUE_PAIR, BOOLEAN, NUMBER } from 'in-new-components/QueryBuilder/tagFilter/types';
import { STRING_MAX_LENGTH } from 'in-new-components/QueryBuilder/tagFilter/constraints';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';
import { isNotBlank } from 'in-services/util/string';

const logger = createLogger('in-new-components/QueryBuilder/transformation/tagFilter');

export const type = 'TAG_FILTER';

const tagFilterFields = ['type', 'name', 'key', 'value', 'operator', 'entity'];

export function toTagFilter(tagFilterLike) {
  return {
    ...pick(tagFilterLike, tagFilterFields),
    // Enforce valid type
    type
  };
}

// A tag filter with a string value exceeding the max length is invalid, to fix that
// shorten the value and change the operator if needed.
export function sanitizeTagFilter(tagFilter) {
  if (typeof tagFilter.value === 'string' && tagFilter.value.length > STRING_MAX_LENGTH) {
    // If a string value exceeds the max length, shorten the value and change the operator if needed.
    const value = tagFilter.value.substring(0, 512);
    let operator = tagFilter.operator;
    if (operator === EQUALS) {
      operator = STARTS_WITH;
    } else if (operator === NOT_EQUAL) {
      operator = NOT_STARTS_WITH;
    }
    tagFilter = { ...tagFilter, value };
    if (operator != null) {
      tagFilter.operator = operator;
    }
  }
  return tagFilter;
}

export function toNewTagFilterFormat(tagFilter, tagCatalog) {
  if (!tagFilter.type) {
    tagFilter = {
      ...tagFilter,
      type
    };
  }

  // In some cases the operator is in lower cases, which is no longer supported
  tagFilter.operator = tagFilter.operator?.toUpperCase();

  let key;
  let value = tagFilter.value;
  let operator = tagFilter.operator;

  if (tagFilter.booleanValue != null) {
    value = transformBooleanValue(tagFilter.booleanValue);
  } else if (tagFilter.numberValue != null) {
    value = transformNumberValue(tagFilter.numberValue);
  } else if (tagFilter.stringValue != null) {
    const transformationResult = transformStringValue(tagCatalog, tagFilter);
    key = transformationResult.key;
    value = transformationResult.value;
  } else {
    const transformationResult = transformValue(tagCatalog, tagFilter);
    value = transformationResult.value;
    operator = transformationResult.operator;
  }

  return {
    ...toTagFilter(tagFilter),
    key,
    value,
    operator
  };
}

function transformBooleanValue(value) {
  return value === 'true' || value === true;
}

function transformNumberValue(value) {
  return Number(value);
}

function transformValue(tagCatalog, tagFilter) {
  let value = tagFilter.value;
  // In some cases the operator is missing
  const operator = tagFilter.operator || EQUALS;

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
  return { value, operator };
}

function transformStringValue(tagCatalog, tagFilter) {
  let key;
  let value;

  tagCatalog = enrichTagCatalog(tagCatalog);
  const tagDefinition = tagCatalog.tagsByName[tagFilter.name];

  if (tagDefinition) {
    if (tagDefinition.type === KEY_VALUE_PAIR) {
      const splitResult = tagFilter.stringValue.split('=', 2);
      if (isNotBlank(splitResult[0])) {
        key = splitResult[0];
      }
      if (isNotBlank(splitResult[1])) {
        value = splitResult[1];
      }
    } else {
      value = tagFilter.stringValue;
    }
  } else {
    logger.warn('Failed to tag find definition for tag name "%s"', tagFilter.name);
    // We can only guess that this is most likely a regular value. This situation
    // is highly unlikely to happen.
    value = tagFilter.stringValue;
  }

  return { key, value };
}

export function tagFilter(name, operator, value, key) {
  return { type, name, operator, ...(value != null && { value }), ...(key != null && { key }) };
}
