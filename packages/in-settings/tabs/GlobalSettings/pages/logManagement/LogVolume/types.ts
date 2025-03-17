/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { LogVolumeUsageItem, RetentionPeriod } from 'in-logging/api/logVolume';
import { Progress, TagType } from 'in-types';

export type GroupingTag = string | undefined;

export interface TagObject {
  groupbyTag: TagNames;
  tagType: TagType;
  tagDefinition?: string;
}

export type TagNames =
  | ''
  | 'zone'
  | 'host_name'
  | 'kubernetes_namespace_name'
  | 'kubernetes_cluster_name'
  | 'kubernetes_daemonset_name'
  | 'kubernetes_deployment_name';

export interface LogVolumeDetailsProps {
  data?: LogVolumeUsageItem[];
  progress: Progress;
  timePeriod: number;
  groupingTag: GroupingTag;
}

export interface ExpandedState {
  handleToggle(key: string): void;
  expanded: Record<string, boolean>;
}

export interface MonthReportProps {
  numberOfMonth: number;
  logVolume: number;
  retentionPeriods: RetentionPeriod[];
  expandedState: ExpandedState;
  groupingTag: GroupingTag;
}

export interface RetentionPeriodsProps {
  retentionPeriods: RetentionPeriod[];
  isExpanded?: boolean;
  expandedState: ExpandedState;
  groupingTag: GroupingTag;
  numberOfMonth: number;
}

export interface GroupProps {
  label: string;
  logVolume: number;
  groupingTag: GroupingTag;
  numberOfMonth: number;
}
