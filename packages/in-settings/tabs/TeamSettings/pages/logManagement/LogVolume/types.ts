/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Progress, TagType } from 'in-types';

interface LogVolumeDataWithSums {
  month: string;
  year: number;
  totalVolume: VolumeUnits;
  retentionPeriods: {
    [key: string]: { label: string; volumeGB: number }[];
  };
  partialSums: {
    days30: VolumeUnits;
    days60: VolumeUnits;
    days90: VolumeUnits;
  };
}

interface LogVolumeDataWithoutSums {
  month: string;
  year: number;
  totalVolume: VolumeUnits;
  retentionPeriods: {
    days30: VolumeUnits;
    days60: VolumeUnits;
    days90: VolumeUnits;
  };
}

export interface VolumeUnits {
  gb: number;
}

export type LogVolumeData = LogVolumeDataWithSums | LogVolumeDataWithoutSums;

export interface LogVolumeDetailsProps {
  data: LogVolumeData[] | null | undefined;
  progress: Progress;
  timePeriod: number;
  expandedRetention: any;
  handleUpdateExpandedRetention: Function;
  groupingTag: string | null;
}

export interface RetentionPeriodData {
  days90: VolumeUnits;
  days60: VolumeUnits;
  days30: VolumeUnits;
}

export interface MonthlyRetentionData {
  month: string;
  year: number;
  totalVolume: VolumeUnits;
  retentionPeriods: RetentionPeriodData;
  label: string;
}

export type TagNames =
  | ''
  | 'zone'
  | 'host_name'
  | 'kubernetes_namespace_name'
  | 'kubernetes_cluster_name'
  | 'kubernetes_daemonset_name'
  | 'kubernetes_deployment_name';

export interface TagObject {
  groupbyTag: TagNames;
  tagType: TagType;
  tagDefinition?: string;
}
