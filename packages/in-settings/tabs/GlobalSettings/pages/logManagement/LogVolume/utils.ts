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
export const generateQuery = (
  monthsBack: number,
  groupingTag?: TagNames | null
): { fromTs: number; toTs: number; groupingTag?: TagNames | null } => {
  const now = new Date();

  const to = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59);
  const from = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (monthsBack - 1), 1, 0, 0, 0);

  return {
    fromTs: Math.floor(from / 1000),
    toTs: Math.floor(to / 1000),
    groupingTag
  };
};

export function getLabelByName(name: string) {
  const tag = groupTags.tags.find(tag => tag.name === name);
  return tag ? tag.label : null;
}

export const sortMonths = (arr: LogVolumeUsageItem[] = []): LogVolumeUsageItem[] => {
  const currentMonth = new Date().getMonth() + 1;
  return [...arr].sort((a, b) => {
    const adjustedA = (currentMonth - a.numberOfMonth + 12) % 12;
    const adjustedB = (currentMonth - b.numberOfMonth + 12) % 12;
    return adjustedA - adjustedB;
  });
};

export const refineRetentionPeriodData = (retentionPeriods: RetentionPeriod[] = []) => {
  const sorted = [...retentionPeriods].sort(({ retentionDays: periodLengthA }, { retentionDays: periodLengthB }) =>
    periodLengthA > periodLengthB ? 1 : -1
  );

  return sorted;
};
