/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Application, Endpoint, Result, ServiceLabel } from '@instana/types';

export interface UrlMatrixParamConfig {
  path: string;
  paramTab: string;
  paramMetric: string;
}

export type WithLabel = Result<Application | Endpoint | ServiceLabel>;
