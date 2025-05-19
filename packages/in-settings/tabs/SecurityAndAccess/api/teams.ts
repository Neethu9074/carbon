/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable } from '@instana/observables';
import { TeamDetails } from '@instana/types';

import { refresh as refreshTags } from 'in-settings/tabs/SecurityAndAccess/api/tags';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { Response } from 'in-services/http/types';
import { refreshSignal } from 'in-api/teams';
import http from 'in-services/http';
import { User } from 'in-types';

const basePath = '/api/settings/rbac/teams';
/**
 * Model for selectable team scope entities like websites, mobile apps etc.
 * @property {string} id - unique id of the entity
 * @property {string} name - name of the entity
 */
export interface TeamScopeEntity {
  readonly id: string;
  readonly name: string;
}

export function getTeam(id: string, includeTeamUsage?: boolean): Observable<TeamDetails> {
  return getTeamInternal(id, includeTeamUsage).map(response => response.body);
}

function getTeamInternal(id: string, includeTeamUsage?: boolean): Observable<Response<TeamDetails>> {
  return http<TeamDetails>({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(id)}`,
    queryParams: {
      includeTeamUsage
    }
  });
}

export function deleteTeam(id: string) {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(v => {
    refreshSignal.emit(id);
    return v;
  });
}

export function deleteTeams(ids: string[]) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/delete`,
    data: ids,
    treat400AsError: true
  }).map(v => {
    refreshSignal.emit(ids);
    return v;
  });
}

export function removeUserFromTeam(teamId: string, userId: string) {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(teamId)}/user/${encodeURIComponent(userId)}`,
    headers: getCsrfHeader()
  }).map(v => {
    refreshSignal.emit(teamId);
    return v;
  });
}

export function addUsersToTeam(teamId: string, users: User[]) {
  return http<void>({
    method: 'PUT',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(teamId)}/users`,
    headers: getCsrfHeader(),
    data: users
  }).map(v => {
    refreshSignal.emit(teamId);
    return v;
  });
}

export function saveTeam(team: TeamDetails): Observable<Response<TeamDetails>> {
  const method = team?.id ? 'PUT' : 'POST';
  const url = team?.id ? `${basePath}/${encodeURIComponent(team.id)}` : basePath;
  return http<TeamDetails>({
    method: method,
    url: url,
    headers: getCsrfHeader(),
    data: team
  }).map(v => {
    if (v?.body?.id) refreshSignal.emit(v?.body?.id);

    // Team name is saved as tag, therefore also refresh tags
    refreshTags();

    return v;
  });
}
