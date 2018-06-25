import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { generateUniqueShortId } from 'in-services/util/id';

export function getApplicationFilter(urlTagFilter) {
  try {
    urlTagFilter = JSON.parse(urlTagFilter);
  } catch (error) {
    urlTagFilter = [];
  }

  const applicationFilter = {};
  for (let i = 0; i < urlTagFilter.length; i++) {
    const urlTag = urlTagFilter[i];
    if (urlTag.name === APPLICATION.name) {
      applicationFilter[APPLICATION.id] = createFilter({
        id: APPLICATION.id,
        name: APPLICATION.name,
        value: urlTag.value
      });
    } else if (urlTag.name === SERVICE.name) {
      applicationFilter[SERVICE.id] = createFilter({
        id: SERVICE.id,
        name: SERVICE.name,
        value: urlTag.value
      });
    } else if (urlTag.name === ENDPOINT.name) {
      applicationFilter[ENDPOINT.id] = createFilter({
        id: ENDPOINT.id,
        name: ENDPOINT.name,
        value: urlTag.value
      });
    }
  }

  return applicationFilter;
}

export function getTagFilter(urlTagFilter) {
  try {
    urlTagFilter = JSON.parse(urlTagFilter);
  } catch (error) {
    urlTagFilter = [];
  }

  const tagFilter = [];
  for (let i = 0; i < urlTagFilter.length; i++) {
    tagFilter.push(createFilter(urlTagFilter[i]));
  }

  return tagFilter;
}

export function getTagFilterToURLString(tagFilter) {
  let urlReadyTagFilter = tagFilter.map(tag => ({ name: tag.name, value: tag.value }));
  if (urlReadyTagFilter.length === 0) {
    urlReadyTagFilter = null;
  } else {
    urlReadyTagFilter = JSON.stringify(urlReadyTagFilter);
  }
  return urlReadyTagFilter;
}

export function getApplicationFilterToURLString(applicationFilter) {
  const keys = Object.keys(applicationFilter);
  let urlReadyTagFilter = keys
    .map(key => applicationFilter[key])
    .filter(tag => tag)
    .map(tag => ({ name: tag.name, value: tag.value }));
  if (urlReadyTagFilter.length === 0) {
    urlReadyTagFilter = null;
  } else {
    urlReadyTagFilter = JSON.stringify(urlReadyTagFilter);
  }
  return urlReadyTagFilter;
}

export function createFilter(config = {}) {
  const id = config.id || generateUniqueShortId();
  return {
    id,
    name: config.name || '',
    value: config.value || '',
    icon: config.icon || 'lib_views_tag'
  };
}
