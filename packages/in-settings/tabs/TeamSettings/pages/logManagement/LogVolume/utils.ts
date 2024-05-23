/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LabeledMetricResult, Result, TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

interface RetentionPeriodData {
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

export function transformData(dataResult: LabeledMetricResult[]): MonthlyRetentionData[] | null {
  const dataMap: Record<string, RetentionPeriodData> = {};

  if (!dataResult || dataResult?.length === 0) return null;

  const data: MonthlyRetentionData[] = [];

  for (const point of dataResult) {
    if (!point.values) continue;
    const date = new Date(point.values[0][0]);
    const month = date.toLocaleString('default', { month: 'long' });
    const yearValue = date.getFullYear();
    const monthYearKey = `${month}-${yearValue}`;
    const volumeGB = point.values[0][1] / 1024 ** 3;

    if (!dataMap[monthYearKey]) {
      dataMap[monthYearKey] = { days30: 0, days20: 0, days7: 0 };
    }

    if (point.label === '7 days') {
      dataMap[monthYearKey].days7 = volumeGB;
    } else if (point.label === '20 days') {
      dataMap[monthYearKey].days20 = volumeGB;
    } else if (point.label === '30 days') {
      dataMap[monthYearKey].days30 = volumeGB;
    }
  }

  for (const [monthYearKey, retentionData] of Object.entries(dataMap)) {
    const [month, yearValue] = monthYearKey.split('-');
    data.push({
      month,
      year: parseInt(yearValue, 10),
      totalVolumeGB: retentionData.days7 + retentionData.days20 + retentionData.days30,
      retentionPeriods: retentionData
    });
  }

  return data.sort((a, b) => +new Date(`${a.year}-${a.month}-01`) - +new Date(`${b.year}-${b.month}-01`)).reverse();
}

export function generateQueries(numMonths: number): any[] {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  function getEndOfMonthTimestamp(year: number, month: number): number {
    const date = new Date(year, month + 1, 0, 23, 59, 59);
    return date.getTime();
  }

  const queries = [];
  for (let i = 0; i < numMonths; i++) {
    let monthToQuery = currentMonth - i;
    let yearToQuery = currentYear;

    if (monthToQuery < 0) {
      monthToQuery += 12;
      yearToQuery -= 1;
    }

    const endTimestamp = getEndOfMonthTimestamp(yearToQuery, monthToQuery);

    //TODO: Change this once backend is done, getUnifiedMetrics parameters look a bit different
    const query = {
      subscriptionId: 1,
      metrics: {
        'y1-0': {
          source: 'LOG',
          metric: 'log_volume',
          aggregation: 'SUM',
          timeShift: {
            offset: 0
          },
          compareToTimeShifted: false,
          label: 'Log Volume',
          metricLabel: 'Log Volume',
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
                groupbyTag: 'log.retention.days'
              }
            }
          ],
          resultType: 'SINGLE_NUMBER',
          timeConfig: {
            to: endTimestamp,
            windowSize: 2592000000,
            focusedMoment: endTimestamp,
            autoRefresh: false
          }
        }
      }
    };

    queries.push(query);
  }

  return queries;
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
