/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Progress } from 'in-types';

interface LogVolumeDataWithSums {
  month: string;
  year: number;
  totalVolumeGB: number;
  retentionPeriods: {
    [key: string]: { label: string; volumeGB: number }[];
  };
  partialSums: {
    days30: number;
    days60: number;
    days90: number;
  };
}

interface LogVolumeDataWithoutSums {
  month: string;
  year: number;
  totalVolumeGB: number;
  retentionPeriods: {
    days30: number;
    days60: number;
    days90: number;
  };
}

export type LogVolumeData = LogVolumeDataWithSums | LogVolumeDataWithoutSums;

export interface LogVolumeDetailsProps {
  data: LogVolumeData[] | null | undefined;
  progress: Progress;
  timePeriod: number;
}
