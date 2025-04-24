/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Progress } from '@instana/types';
export interface KubeCostProps {
  id: string;
  currencyCode: string;
  url: string;
  tier: string;
}

export interface KubeCostDataProps {
  data: KubeCostProps;
  progress: Progress;
}
