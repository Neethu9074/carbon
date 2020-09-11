import { createLogger } from 'instalog';
import { pick } from 'lodash';

import { KEY_VALUE_PAIR } from 'in-new-components/QueryBuilder/tagFilter/types';
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

  if (tagFilter.stringValue == null && tagFilter.booleanValue == null && tagFilter.numberValue == null) {
    // Nothing to do here - probably a tag filter in the new format
    return tagFilter;
  }

  let key;
  let value;

  if (tagFilter.booleanValue != null) {
    value = tagFilter.booleanValue;
  } else if (tagFilter.numberValue != null) {
    value = tagFilter.numberValue;
  } else if (tagFilter.stringValue != null) {
    const transformationResult = transformStringValue(tagCatalog, tagFilter);
    key = transformationResult.key;
    value = transformationResult.value;
  }

  return {
    ...toTagFilter(tagFilter),

    key,
    value
  };
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
