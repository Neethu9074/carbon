/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
// eslint-disable-next-line no-restricted-imports
import { groupTags } from './workspaces/LogVolumeGroupingConfigurator';
// eslint-disable-next-line no-restricted-imports
import { TagNames } from './types';
import { LogVolumeUsageItem, RetentionPeriod } from 'in-logging/api/logVolume';

export const NDash = '-';
export const DISPLAYED_RETENTION_DAYS = [30, 60, 90];

export const generateQuery = (
  monthsBack: number,
  groupingTag?: TagNames
): { fromTs: number; toTs: number; groupingTag?: TagNames } => {
  const now = new Date();

  const fromDate = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1, 0, 0, 0);
  const fromTs = Math.floor(fromDate.getTime() / 1000);

  const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const toTs = Math.floor(toDate.getTime() / 1000);

  return { fromTs, toTs, groupingTag };
};

export function getLabelByName(name: string) {
  const tag = groupTags.tags.find(tag => tag.name === name);
  return tag ? tag.label : null;
}

export const sortMonths = (arr: LogVolumeUsageItem[]): LogVolumeUsageItem[] => {
  const currentMonth = new Date().getMonth() + 1;
  return structuredClone(arr).sort((a, b) => {
    const adjustedA = (currentMonth - a.numberOfMonth + 12) % 12;
    const adjustedB = (currentMonth - b.numberOfMonth + 12) % 12;
    return adjustedA - adjustedB;
  });
};

export const refineRetentionPeriodData = (retentionPeriods: RetentionPeriod[]) => {
  const sorted = retentionPeriods.sort(({ retentionDays: periodLengthA }, { retentionDays: periodLengthB }) =>
    periodLengthA > periodLengthB ? 1 : -1
  );

  const sortedAndFiltered = sorted.filter(({ retentionDays }) => {
    return DISPLAYED_RETENTION_DAYS.includes(retentionDays);
  });

  return sortedAndFiltered;
};
