/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http/http';

interface ReportingDatasource {
  hasEntities: boolean;
  hostCount: number;
  serverlessCount: number;
}

export function getReportingDatasource(): Observable<Result<ReportingDatasource>> {
  return createObservable(
    http<ReportingDatasource>({
      method: 'GET',
      maxRetries: 3,
      url: `/api/infrastructure-monitoring/monitoring-state`
    })
  );
}
