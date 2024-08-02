/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LabeledMetricResult, MetricResult, Result, TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

interface RetentionPeriodData {
  days90: number;
  days60: number;
  days30: number;
  days20: number;
  days7: number;
}

interface MonthlyRetentionData {
  month: string;
  year: number;
  totalVolumeGB: number;
  retentionPeriods: RetentionPeriodData;
}

export function transformData(dataResult: MetricResult[]): MonthlyRetentionData[] | null {
  const dataMap: Record<string, RetentionPeriodData> = {};

  if (!dataResult || dataResult?.length === 0) return null;

  const data: MonthlyRetentionData[] = [];

  for (const point of dataResult) {
    if (!point.values) continue;
    for (const value of point.values) {
      const label = value[0];
      const timestamp = value[1];
      const volumeGB = value[2];

      const date = new Date(timestamp * 1000);
      const month = date.toLocaleString('en-US', { month: 'long' });
      const yearValue = date.getFullYear();
      const monthYearKey = `${month}-${yearValue}`;

      if (!dataMap[monthYearKey]) {
        dataMap[monthYearKey] = { days90: 0, days60: 0, days30: 0, days20: 0, days7: 0 };
      }

      if (label === 7) {
        dataMap[monthYearKey].days7 += volumeGB;
      } else if (label === 20) {
        dataMap[monthYearKey].days20 += volumeGB;
      } else if (label === 30) {
        dataMap[monthYearKey].days30 += volumeGB;
      } else if (label === 60) {
        dataMap[monthYearKey].days60 += volumeGB;
      } else if (label === 90) {
        dataMap[monthYearKey].days90 += volumeGB;
      }
    }
  }

  for (const [monthYearKey, retentionData] of Object.entries(dataMap)) {
    const [month, yearValue] = monthYearKey.split('-');
    data.push({
      month,
      year: parseInt(yearValue, 10),
      totalVolumeGB:
        retentionData.days7 + retentionData.days20 + retentionData.days30 + retentionData.days60 + retentionData.days90,
      retentionPeriods: retentionData
    });
  }

  return data.sort((a, b) => +new Date(`${a.year}-${a.month}-01`) - +new Date(`${b.year}-${b.month}-01`)).reverse();
}

export function generateQuery(numMonths: number): any {
  // const currentDate = new Date();
  // const currentYear = currentDate.getFullYear();
  // const currentMonth = currentDate.getMonth();
  const currentTimestamp = Date.now();

  // const startOfCurrentMonth = new Date(currentYear, currentMonth, 1).getTime();

  // let windowSize;
  // let safeWindowsValue = 86400;
  // if (numMonths === 1) {
  //   windowSize = currentTimestamp - startOfCurrentMonth - safeWindowsValue; // 2 dias si estamos a 2 de agosto
  // } else {
  //   windowSize = currentTimestamp - startOfCurrentMonth + 2592000000 * (numMonths - 1); // 62 dias si estamos a 2 de agosto
  // }

  //TODO: Change this once backend is done, getUnifiedMetrics parameters look a bit different
  const query = {
    subscriptionId: 44,
    metrics: {
      'y1-0': {
        source: 'LOG',
        metric: 'log_volume',
        aggregation: 'SUM',
        timeShift: {
          offset: 0
        },
        compareToTimeShifted: false,
        label: '',
        metricLabel: 'Calls',
        color: '',
        tagFilterExpression: {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: []
        },
        includeInternal: false,
        includeSynthetic: false,
        grouping: [
          {
            by: {
              groupbyTag: 'retention_days',
              groupbyTagSecondLevelKey: ''
            },
            direction: 'DESC',
            includeOthers: false,
            maxResults: 5
          }
        ],
        granularity: 600000,
        resultType: 'SINGLE_NUMBER',
        timeConfig: {
          to: currentTimestamp,
          windowSize: 2592000000 * numMonths,
          focusedMoment: currentTimestamp,
          autoRefresh: false
        }
      }
    }
  };
  return query;
}

// Functions for mocking data

const getFirstDayOfMonthTimestamp = (timestamp: number) =>
  new Date(new Date(timestamp).setDate(1)).setHours(0, 0, 0, 0);

const getRandomGB = () => {
  return (Math.floor(Math.random() * 20) + 1) * 1024 ** 3;
};
export const getLogVolume = (timeConfig: TimeConfig) => {
  return just<Result<LabeledMetricResult[]>>({
    data: [
      {
        id: 'y1-0',
        values: [[getFirstDayOfMonthTimestamp(timeConfig.to!), getRandomGB()]],
        label: '7 days',
        resultPrecisionDetails: {
          resultPrecision: 'PRECISION_FULL'
        },
        adjustedTimeframe: {
          windowSize: 2592000000,
          to: timeConfig.to!
        }
      },
      {
        id: 'y1-1',
        values: [[getFirstDayOfMonthTimestamp(timeConfig.to!), getRandomGB()]],
        label: '20 days',
        resultPrecisionDetails: {
          resultPrecision: 'PRECISION_FULL'
        },
        adjustedTimeframe: {
          windowSize: 2592000000,
          to: timeConfig.to!
        }
      },
      {
        id: 'y1-2',
        values: [[getFirstDayOfMonthTimestamp(timeConfig.to!), getRandomGB()]],
        label: '30 days',
        resultPrecisionDetails: {
          resultPrecision: 'PRECISION_FULL'
        },
        adjustedTimeframe: {
          windowSize: 2592000000,
          to: timeConfig.to!
        }
      }
    ],
    time: 1715328000000,
    resultPrecisionDetails: {
      resultPrecision: 'PRECISION_UNKNOWN'
    },
    errors: [],
    progress: {
      loading: false
    },
    backendTraceId: '0000000000000'
  });
};

export const generateEmptyData = (numEntries: number) => {
  const data = [];
  for (let i = 0; i < numEntries; i++) {
    data.push({
      month: 'August',
      totalVolumeGB: 0,
      retentionPeriods: {
        days90: 0,
        days60: 0,
        days30: 0,
        days20: 0,
        days7: 0
      }
    });
  }
  return data;
};
