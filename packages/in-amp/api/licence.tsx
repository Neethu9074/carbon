/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LoggingLicenseDetailsProp } from 'in-amp/components/RetentionAddonChart';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

export function loggingLicenseDetails() {
  return http<LoggingLicenseDetailsProp>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/logging/licensed'
  }).map(res => res.body);
}

const memoizedLoggingLicenseDetails = memoize(
  loggingLicenseDetails,
  () => 'loggingLicenseDetails',
  minutes.toMillis(1)
);
export const loggingLicenseDetailsCached = () => memoizedLoggingLicenseDetails(0 /*feat*/);
