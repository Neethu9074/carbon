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
  return refreshSignal.flatMap(() =>
    http<TeamTag[]>({
      method: 'GET',
      maxRetries: 3,
      url: teamFocusUrl,
      mapToResultObject: true,
      treat400AsError: true
    })
  );
}

export function updateTeamFocus(teamId: string): Observable<Result<void>> {
  return http({
    method: 'PUT',
    maxRetries: 3,
    mapToResultObject: true,
    url: `${teamFocusUrl}/${teamId}`,
    headers: getCsrfHeader()
  });
}

export function deleteTeamFocus(): Observable<Result<void>> {
  return http({
    headers: getCsrfHeader(),
    mapToResultObject: true,
    maxRetries: 3,
    method: 'DELETE',
    url: teamFocusUrl
  });
}

export function getTeamsAvailableProbeInternal(): Observable<Result<boolean>> {
  return http<TeamTag[]>({
    method: 'GET',
    maxRetries: 3,
    url: teamFocusUrl,
    mapToResultObject: true
  }).map<Result<boolean>>(res => {
    const hasErrors = res.errors.length > 0;
    const hasData = res.data != null;
    return {
      ...res,
      data: !hasErrors && hasData
    };
  });
}

export const getTeamsAvailableProbe = memoize<void, Result<boolean>>(
  () => getTeamsAvailableProbeInternal(),
  () => 'TeamsProbe',
  60000
);
