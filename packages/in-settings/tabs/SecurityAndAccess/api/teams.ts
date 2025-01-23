/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable, create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { Response } from 'in-services/http/types';
import http from 'in-services/http';
import { User } from 'in-types';

const basePath = '/api/settings/rbac/teams';

const refreshSignal = create().emit(true);

/**
 * Model for a Team until type from backend is available
 * @property id unique team id
 * @property tag name of the team
 * @property info additional information like description
 * @property scope scope of the team
 * @property members users that are members of the team
 */
export interface ApiTeam {
  readonly id: string;
  readonly tag: string;
  readonly info: {
    readonly description: string;
  };
  readonly scope: object;
  readonly members: Array<object>;
}

function getTeamsInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http<ApiTeam[]>({
        method: 'GET',
        maxRetries: 3,
        url: basePath
      })
    )
  );
}

const getTeamsAsResultObservableMemoized = memoize(getTeamsInternal, () => 'Teams', 60000);
export const getTeamsAsResultObservable = () => getTeamsAsResultObservableMemoized([]);

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

// TODO not impelemented yet on backend
export function deleteTeams(ids: string[]) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: basePath,
    data: ids
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

export function saveTeam(team: ApiTeam): Observable<Response<ApiTeam>> {
  const method = team?.id ? 'PUT' : 'POST';
  const url = team?.id ? `${basePath}/${encodeURIComponent(team.id)}` : basePath;
  return http<ApiTeam>({
    method: method,
    url: url,
    headers: getCsrfHeader(),
    data: team
  }).map(v => {
    refreshSignal.emit(team);
    return v;
  });
}
