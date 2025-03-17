/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create } from '@instana/observables';

import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { errorWithData } from 'in-services/util/result';
import http from 'in-services/http';

export interface TeamResult {
  readonly id: string;
  readonly tag: string;
  readonly info: object;
  readonly scope: object;
  readonly members: object[];
}

export const refreshSignalTeams = create<boolean>().emit(true);

export const getTeamsAsResultObservable = memoize(getTeamsAsResultObservableInternal, () => 'Teams', 60000);
function getTeamsAsResultObservableInternal() {
  return refreshSignalTeams.flatMap(() => createObservable(getTeamsInternal()));
}
export const getTeamsResult = memoize(
  () => refreshSignalTeams.flatMap(() => getTeamsDataAndErrorResult()),
  () => 'TeamsResult',
  60000
);

export function getTeams() {
  return getTeamsInternal().map(response => response.body);
}
const emptyTeamsOnError$ = create().emit(undefined);

export function getTeamsDataAndErrorResult() {
  return refreshSignalTeams.flatMap(() => {
    const TeamsRequest = getTeamsInternal();
    const success$ = TeamsRequest.map(response => response.body);
    TeamsRequest.errors().subscribe(err => {
      emptyTeamsOnError$.emit(errorWithData([err], []));
    });
    return success$.merge(emptyTeamsOnError$);
  });
}

function getTeamsInternal() {
  return http<TeamResult[]>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/rbac/teams`
  });
}
