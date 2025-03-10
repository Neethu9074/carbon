/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import { basePath } from 'in-logging/api/index';
import http from 'in-services/http';

export interface GetLogVolumeReportParams {
  //Pass same value as toTs to get the current month
  fromTs: number;
  //Pass same value as fromTs to get the current month
  toTs: number;
  groupingTag?: string | null;
}

export interface RetentionPeriod {
  retentionDays: number;
  logVolume: number;
  logVolumeGroups?: {
    label: string;
    logVolume: number;
  }[];
}

export type LogVolumeUsageItem = {
  numberOfMonth: number;
  logVolume: number;
  retentionPeriods: RetentionPeriod[];
};

export interface GetVolumeReportData {
  logVolumeUsageItems: LogVolumeUsageItem[];
}

export function getLogVolumeReport(params: GetLogVolumeReportParams): Observable<Result<GetVolumeReportData>> {
  const request = http<GetVolumeReportData>({
    method: 'GET',
    maxRetries: 3,
    url: basePath + 'logs/getLogVolumeUsage',
    headers: getCsrfHeader(),
    queryParams: { ...params, responseType: 'json' }
  });

  return createObservable(request);
}
