/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { combineLatest } from '@instana/observables';

import {
  getApplicationAlertConfigStats,
  getInfraAlertConfigStats,
  getSyntheticAlertConfigStats,
  getLogAlertConfigStats,
  getMobileAppAlertConfigStats,
  getWebsiteAlertConfigStats
} from 'in-events/components/SmartAlerts/api/api';
import { ConfigStats } from 'in-events/components/SmartAlerts/constants';

export function getCountLabel(id: string, allConfigStats?: ConfigStats): string | undefined {
  return allConfigStats?.[id]?.toString();
}

export function getAllConfigStats() {
  const firstStatsGroup$ = combineLatest([
    getApplicationAlertConfigStats({}),
    getInfraAlertConfigStats({}),
    getSyntheticAlertConfigStats({})
  ]);

  const secondStatsGroup$ = combineLatest([
    getLogAlertConfigStats({}),
    getWebsiteAlertConfigStats({}),
    getMobileAppAlertConfigStats({})
  ]);

  const allConfigStats = () =>
    combineLatest([firstStatsGroup$, secondStatsGroup$]).map(([firstStatsGroup, secondStatsGroup]) => {
      return [...firstStatsGroup, ...secondStatsGroup];
    });

  return allConfigStats;
}
