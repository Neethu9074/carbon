import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getTeams() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/teams`
  }).map(response => response.body);
}

export function getTeam(teamId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/teams/${encodeURIComponent(teamId)}`
  }).map(response => fromJS(response.body));
}
export function saveTeam(team) {
  let teamId = team.get('id');
  return http({
    method: teamId ? 'PUT' : 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: teamId ? `/api/settings/teams/${encodeURIComponent(teamId)}` : '/api/settings/teams',
    data: team.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteTeam(teamId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/teams/${encodeURIComponent(teamId)}`
  }).map(response => fromJS(response.body));
}

export function createTeam(name = 'New Team', permissions = [], members = []) {
  return {
    id: null,
    name,
    permissions,
    members
  };
}
