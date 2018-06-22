import { APPLICATION, SERVICE, ENDPOINT } from 'in-analyze/applicationFilter';
import { generateUniqueShortId } from 'in-services/util/id';

export function getApplicationFilter(application, service, endpoint) {
  const applicationFilter = {};

  if (application) {
    applicationFilter[APPLICATION.id] = createFilter({
      id: APPLICATION.id,
      name: APPLICATION.name,
      value: application
    });
  }
  if (service) {
    applicationFilter[SERVICE.id] = createFilter({
      id: SERVICE.id,
      name: SERVICE.name,
      value: service
    });
  }
  if (endpoint) {
    applicationFilter[ENDPOINT.id] = createFilter({
      id: ENDPOINT.id,
      name: ENDPOINT.name,
      value: endpoint
    });
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

export function createFilter(config = {}) {
  const id = config.id || generateUniqueShortId();
  return {
    id,
    name: config.name || '',
    value: config.value || '',
    icon: config.icon || 'lib_views_tag'
  };
}
