/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, TeamOverview, TeamTag } from '@instana/types';
import { Observable, create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

export const refreshSignal = create<string | string[]>().emit('');

const teamFocusUrl = 'api/settings/rbac/teams/focus';

function getTeamsOverviewInternal(): Observable<Result<TeamOverview[]>> {
  return http<TeamOverview[]>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/rbac/teams/overview`,
    mapToResultObject: true,
    treat400AsError: true
  });
}

export const getTeamsOverview = memoize(
  () => refreshSignal.flatMap(() => getTeamsOverviewInternal()),
  () => 'Teams',
  60000
);

export function getTeamsByUserId(): Observable<Result<TeamTag[]>> {
  return http<TeamTag[]>({
    method: 'GET',
    maxRetries: 3,
    url: teamFocusUrl,
    mapToResultObject: true,
    treat400AsError: true
  });
}

export function updateTeamFocus(teamId: string) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `${teamFocusUrl}/${teamId}`,
    headers: getCsrfHeader()
  });
}

export function deleteTeamFocus() {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: teamFocusUrl,
    headers: getCsrfHeader()
  });
}
