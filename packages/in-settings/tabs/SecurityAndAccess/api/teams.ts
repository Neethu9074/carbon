/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, Team, TeamDetails, TeamMember } from '@instana/types';
import { Observable } from '@instana/observables';

import { refresh as refreshTags } from 'in-settings/tabs/SecurityAndAccess/api/tags';
import { refreshRole } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { Response } from 'in-services/http/types';
import { refreshSignal } from 'in-api/teams';
import http from 'in-services/http';

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
    refreshTags();
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
    refreshTags();
    return v;
  });
}

interface RemoveUserFromTeamProps {
  teamId: string;
  userId: string;
}

export function removeUserFromTeam({ teamId, userId }: RemoveUserFromTeamProps) {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(teamId)}/user/${encodeURIComponent(userId)}`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(v => {
    refreshRole();
    refreshSignal.emit(teamId);
    return v;
  });
}

interface AddUsersToTeamProps {
  teamId: string;
  memberDetails: TeamMember[];
}

export function addUsersToTeam({ teamId, memberDetails }: AddUsersToTeamProps): Observable<Result<Team>> {
  return http<Team>({
    method: 'PUT',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(teamId)}/users`,
    headers: getCsrfHeader(),
    data: memberDetails,
    mapToResultObject: true
  }).map(v => {
    refreshRole();
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

    // refresh role details view, when roles are added to a team
    refreshRole();

    return v;
  });
}
