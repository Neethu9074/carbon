/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable, create } from '@instana/observables';
import { Result, TeamTag } from '@instana/types';

import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const basePath = '/api/settings/tags';

const refreshSignal = create().emit(true);

export function refresh() {
  refreshSignal.emit(true);
}

function getTagsInternal(): Observable<Result<TeamTag[]>> {
  return http<TeamTag[]>({
    method: 'GET',
    maxRetries: 3,
    url: basePath,
    mapToResultObject: true,
    treat400AsError: true
  });
}

export const getTagsResult = memoize(
  () => refreshSignal.flatMap(() => getTagsInternal()),
  () => 'Tags',
  60000
);
