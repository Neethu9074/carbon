/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createLogger } from '@instana/logger';
import { pick } from 'lodash';

import { KEY_VALUE_PAIR, BOOLEAN, NUMBER } from 'in-new-components/QueryBuilder/tagFilter/types';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
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
    value = tagFilter.booleanValue;
  } else if (tagFilter.numberValue != null) {
    value = tagFilter.numberValue;
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

function transformValue(tagCatalog, tagFilter) {
  let value = tagFilter.value;
  // In some cases the operator is missing
  const operator = tagFilter.operator || EQUALS;

  const tagDefinition = tagCatalog && enrichTagCatalog(tagCatalog).tagsByName[tagFilter.name];
  if (tagDefinition) {
    if (tagDefinition.type === NUMBER) {
      if (value != null) {
        // In some cases the numeric value is a string
        value = Number(value);
      }
    } else if (tagDefinition.type === BOOLEAN) {
      if (value != null) {
        // In some cases the boolean value is a string
        value = value === 'true' || value === true;
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
