/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { success, hasError, isLoading } from 'in-services/util/result';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignalTeams = create().emit(true);
export function refresh() {
  refreshSignalTeams.emit(true);
}

// observables

export const getWebsitesAsResultObservable = memoize(getWebsitesAsResultObservableInternal, () => '', 60000);
function getWebsitesAsResultObservableInternal() {
  return refreshSignalTeams
    .flatMap(() =>
      createObservable(
        http({
          method: 'GET',
          maxRetries: 3,
          url: `/api/website-monitoring/config`
        })
      )
    )
    .map(result =>
      hasError(result) || isLoading(result) ? result : success(result.data.map(({ id, name }) => ({ id, label: name })))
    );
}
