/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable, create } from '@instana/observables';
import { Result, TeamOverview } from '@instana/types';

import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

export const refreshSignal = create<string | string[]>().emit('');

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
