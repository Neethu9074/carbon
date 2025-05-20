/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getApplicationAlertConfigStats,
  getInfraAlertConfigStats,
  getSyntheticAlertConfigStats,
  getLogAlertConfigStats
} from 'in-events/components/SmartAlerts/api/api';
import { ConfigStats } from 'in-events/components/SmartAlerts/constants';

export function getCountLabel(id: string, allConfigStats?: ConfigStats): string | undefined {
  return allConfigStats?.[id]?.toString();
}

export function useAllConfigStats() {
  const firstStatsGroup$ = combineLatest([
    getApplicationAlertConfigStats({}),
    getInfraAlertConfigStats({}),
    getSyntheticAlertConfigStats({})
  ]);

  const secondStatsGroup$ = combineLatest([getLogAlertConfigStats({})]);

  const allConfigStats = useObservable(combineLatest([firstStatsGroup$, secondStatsGroup$]), [])?.reduce(
    (acc: ConfigStats, group: Array<any>) => {
      return group?.reduce((innerAcc, next) => {
        return { ...innerAcc, ...next.data };
      }, acc);
    },
    {}
  );

  return allConfigStats;
}
