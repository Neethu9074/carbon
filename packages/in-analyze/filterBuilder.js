import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';

const jsonSerializer = buildJsonSerializer();
const jsonParser = buildJsonParser(null);

export function getTagFilterFromUrlString(urlString) {
  const parsedTagFilter = parsedUrlOrDefault(urlString, []);

  const tagFilter = [];
  for (let i = 0; i < parsedTagFilter.length; i++) {
    tagFilter.push(createFilter(parsedTagFilter[i]));
  }

  return tagFilter;
}

export function getGroupFromUrlString(urlString) {
  return parsedUrlOrDefault(urlString, null);
}

export function getTagFilterToUrlString(tagFilter) {
  let urlReadyTagFilter = tagFilter.map(tag => ({
    name: tag.name,
    value: tag.value,
    operator: tag.operator,
    secondLevelName: tag.secondLevelName
  }));

  return stringifyIfTrue(urlReadyTagFilter, urlReadyTagFilter.length > 0);
}

export function getGroupToUrlString(group) {
  return stringifyIfTrue(group, group);
}

function parsedUrlOrDefault(urlString, defaultValue) {
  try {
    return JSON.parse(urlString);
  } catch (e) {
    // ignore
  }

  try {
    return jsonParser(urlString) || defaultValue;
  } catch (e) {
    // ignore
  }

  return defaultValue;
}

function stringifyIfTrue(value, condition) {
  if (condition) {
    return jsonSerializer(value);
  }
  return null;
}

export function createFilter(config = {}) {
  return {
    name: config.name || '',
    secondLevelName: config.secondLevelName,
    value: config.value || config.stringValue || '',
    operator: config.operator || 'EQUALS'
  };
}

export function addGroupToTagFilter(tagFilters, groupingDefinition, subGroupName) {
  const newTagFilter = {
    name: groupingDefinition.groupbyTag,
    operator: 'EQUALS'
  };
  const node = findSubTreeByFullyQualifiedName(groupingDefinition.groupbyTag);
  const type = (node && node.type) || 'STRING';

  if (type === 'STRING') {
    newTagFilter.stringValue = subGroupName;
  } else if (type === 'NUMBER') {
    newTagFilter.numberValue = parseInt(subGroupName, 10);
  } else if (type === 'BOOLEAN') {
    newTagFilter.booleanValue = 'true' === subGroupName;
  } else if (type === 'KEY_VALUE_PAIR') {
    let value = subGroupName;
    if (groupingDefinition.groupbyTagSecondLevelKey) {
      value = `${groupingDefinition.groupbyTagSecondLevelKey}=${value}`;
    }
    newTagFilter.stringValue = value;
  }

  return tagFilters.concat(newTagFilter);
}
