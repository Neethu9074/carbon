/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { create, Observable } from '@instana/observables';
import { AuthenticationOverview, Result } from '@instana/types';
import http from 'in-services/http/http';
import { minutes } from 'in-services/time/time';
import memoize from 'in-services/util/memoizingObservableGenerator';

const API_BASE_PATH_AUTH = '/api/settings/authentication';

const refreshSignal = create<number>().emit(0);

export function refreshAuthOverview() {
  refreshSignal.emit(refreshSignal._lastEmittedValue ?? 0 + 1);
}

function getAuthOverviewInternal(): Observable<Result<AuthenticationOverview>> {
  return refreshSignal.flatMap(() =>
    http<AuthenticationOverview>({
      mapToResultObject: true,
      maxRetries: 3,
      method: 'GET',
      url: `${API_BASE_PATH_AUTH}/overview`,
      treat400AsError: true
    })
  );
}

export const getAuthOverview = memoize<void, Result<AuthenticationOverview>>(
  getAuthOverviewInternal,
  () => `${refreshSignal._lastEmittedValue}`,
  minutes.toMillis(1)
);
