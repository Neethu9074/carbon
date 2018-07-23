import { generateUniqueShortId } from 'in-services/util/id';

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
  let urlReadyTagFilter = tagFilter.map(tag => ({ name: tag.name, value: tag.value, operator: tag.operator }));

  return stringifyIfTrue(urlReadyTagFilter, urlReadyTagFilter.length > 0);
}

export function getGroupToUrlString(group) {
  return stringifyIfTrue(group, group);
}

function parsedUrlOrDefault(urlString, defaultValue) {
  let parsedValue;
  try {
    parsedValue = JSON.parse(urlString);
  } catch (error) {
    parsedValue = defaultValue;
  }
  return parsedValue;
}

function stringifyIfTrue(value, condition) {
  if (condition) {
    return JSON.stringify(value);
  }
  return null;
}

export function createFilter(config = {}) {
  const id = config.id || generateUniqueShortId();
  return {
    id,
    name: config.name || '',
    value: config.value || '',
    operator: config.operator
  };
}
