/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Progress } from 'in-types';

export interface LogVolumeData {
  month: string;
  totalVolumeGB: number;
  retentionPeriods: {
    days90: number;
    days60: number;
    days30: number;
    days20: number;
    days7: number;
  };
}

export interface LogVolumeDetailsProps {
  data: LogVolumeData[] | null | undefined;
  progress: Progress;
  timePeriod: number;
}
