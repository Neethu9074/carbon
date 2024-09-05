/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

export function isAddonUser() {
  return http<{ licensed: boolean }>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/logging/licensed'
  }).map(res => res.body.licensed);
}

const memoizedIsAddonUser = memoize(isAddonUser, () => 'IsLoggingAddonUser', minutes.toMillis(1));
export const isAddonUserCached = () => memoizedIsAddonUser(0 /*feat*/);
