/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, Team, TeamMember, TeamRole } from '@instana/types';
import { Observable } from '@instana/observables';

import { refresh as refreshTags } from 'in-settings/tabs/SecurityAndAccess/api/tags';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { Response } from 'in-services/http/types';
import { refreshSignal } from 'in-api/teams';
import http from 'in-services/http';
import { User } from 'in-types';

const basePath = '/api/settings/rbac/teams';

export interface TeamTagUsed {
  websites?: number;
  applications?: number;
  syntheticTests?: number;
  syntheticCredentials?: number;
  alertChannels: number;
  customDashboards: number;
  mobileApps?: number;
}

/**
 * Model for selectable team scope entities like websites, mobile apps etc.
 * @property {string} id - unique id of the entity
 * @property {string} name - name of the entity
 */
export interface TeamScopeEntity {
  readonly id: string;
  readonly name: string;
}

/**
 * Extended model for a Team role until type from backend has roleName
 * @property {string} roleName - name of the role
 */
export interface ApiTeamRole extends TeamRole {
  readonly roleName?: string;
}

/**
 * Extended model for a Team member until type from backend has fullName
 * @property {string} fullName - array of role ids for the team member
 */
export interface ApiTeamMember extends Omit<TeamMember, 'roleIds'> {
  readonly fullName?: string;
  readonly roleIds?: ApiTeamRole[];
}

/**
 * Extended model for a Team until type from backend has roleName and fullName for members
 * @property {Array<ApiTeamMember>} members - users that are members of the team
 */
export interface ApiTeam extends Omit<Team, 'members'> {
  readonly members: Array<ApiTeamMember>;
  readonly teamTagUsed: TeamTagUsed;
}

export function getTeam(id: string): Observable<ApiTeam> {
  return getTeamInternal(id).map(response => response.body);
}

function getTeamInternal(id: string): Observable<Response<ApiTeam>> {
  return http<ApiTeam>({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(id)}`
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

export function saveTeam(team: ApiTeam): Observable<Result<ApiTeam>> {
  const method = team?.id ? 'PUT' : 'POST';
  const url = team?.id ? `${basePath}/${encodeURIComponent(team.id)}` : basePath;
  return http<ApiTeam>({
    method: method,
    url: url,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    treat400AsError: true,
    data: team
  }).map(res => {
    if (res?.data?.id) refreshSignal.emit(res?.data?.id);

    // Team name is saved as tag, therefore also refresh tags
    refreshTags();

    return res;
  });
}
