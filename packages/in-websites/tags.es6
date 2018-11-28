import { get } from 'lodash';

import { compareIgnoreCase } from 'in-services/util/string';

export const tagDefinitions = get(window, ['instana', 'tags'], [])
  .filter(t => t.category === 'WEBSITE_MONITORING')
  .sort((a, b) => compareIgnoreCase(a.name, b.name));

export const tagKeys = tagDefinitions.map(t => t.name);

export const defaultGroupings = {
  pageLoad: {
    groupbyTag: 'beacon.page.name'
  },
  resourceLoad: {
    groupbyTag: 'beacon.http.origin'
  },
  httpRequest: {
    groupbyTag: 'beacon.http.origin'
  },
  error: {
    groupbyTag: 'beacon.error.message'
  }
};
