import { fromJS } from 'immutable';

import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getObjectives() {
  return http({
    method: 'GET',
    url: `/api/objectives`
  }).map(response => fromJS(response.body));
}

export function getObjective(id) {
  return http({
    method: 'GET',
    url: `/api/objectives/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function setEnabled(objective, enabled) {
  return saveObjective(objective.setIn(['enabled'], enabled));
}

export function saveObjective(objective) {
  return http({
    method: 'PUT',
    url: `/api/objectives/${encodeURIComponent(objective.get('id'))}`,
    data: objective.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteObjective(id) {
  return http({
    method: 'DELETE',
    url: `/api/objectives/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createObjective(
  id,
  name = 'New Objective',
  enabled = false,
  filteringQuery = '',
  timePattern = '',
  timeZoneId = 'UTC+00:00',
  reductionOperation = '',
  thresholds = []
) {
  return {
    id: id || generateUniqueShortId(),
    enabled,
    name,
    match: {
      filteringQuery,
      timePattern,
      timeZoneId
    },
    rule: {
      reductionOperation,
      thresholds
    }
  };
}
