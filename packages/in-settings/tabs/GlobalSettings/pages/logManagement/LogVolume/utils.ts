/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LabeledMetricResult, Result, TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

// eslint-disable-next-line no-restricted-imports
import { LogVolumeData, MonthlyRetentionData, RetentionPeriodData, TagNames } from './types';
// eslint-disable-next-line no-restricted-imports
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
// eslint-disable-next-line no-restricted-imports
import { groupTags } from './workspaces/LogVolumeGroupingConfigurator';
import { millisecondsInMonth, Month } from 'in-logging/dashboard/utils';

export const DEFAULT_NO_GROUPING_VALUE = 'NO_GROUPING';
const UNCATEGORIZED_LABEL = 'UNCATEGORIZED';
export const NDash = '-';

export function transformData(dataResult: UnifiedMetricsResult[]): LogVolumeData[] | null {
  const dataMap: Record<string, Record<string, RetentionPeriodData>> = {};
  if (!dataResult || dataResult.length === 0) return null;
  for (const point of dataResult) {
    if (!point.values) continue;

    const hasLabel = 'label' in point;
    const label = hasLabel ? (point as LabeledMetricResult).label : DEFAULT_NO_GROUPING_VALUE;

    for (const value of point.values) {
      const retentionDays = value[0];
      const timestamp = value[1];
      const volumeGB = value[2];

      const date = new Date(timestamp * 1000);
      const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
      const yearValue = date.getFullYear();
      const monthYearKey = `${month}-${yearValue}`;

      if (!dataMap[label]) {
        dataMap[label] = {};
      }

      if (!dataMap[label][monthYearKey]) {
        dataMap[label][monthYearKey] = { days90: { gb: 0 }, days60: { gb: 0 }, days30: { gb: 0 } };
      }

      if (retentionDays === 30) {
        dataMap[label][monthYearKey].days30.gb += +volumeGB.toFixed(2);
      } else if (retentionDays === 60) {
        dataMap[label][monthYearKey].days60.gb += +volumeGB.toFixed(2);
      } else if (retentionDays === 90) {
        dataMap[label][monthYearKey].days90.gb += +volumeGB.toFixed(2);
      }
    }
  }

  const data: MonthlyRetentionData[] = [];

  for (const [label, months] of Object.entries(dataMap)) {
    for (const [monthYearKey, retentionData] of Object.entries(months)) {
      const [month, yearValue] = monthYearKey.split('-');
      const totalGB = retentionData.days30.gb + retentionData.days60.gb + retentionData.days90.gb;

      data.push({
        label,
        month,
        year: parseInt(yearValue, 10),
        totalVolume: { gb: +totalGB.toFixed(2) },
        retentionPeriods: retentionData
      });
    }
  }
  const dataSorted = data
    .sort((a, b) => +new Date(`${a.year}-${a.month}-01`) - +new Date(`${b.year}-${b.month}-01`))
    .reverse();
  const allHaveValidLabel = dataSorted.every(
    item => item.label !== undefined && item.label !== DEFAULT_NO_GROUPING_VALUE
  );
  return allHaveValidLabel ? transformLabeledData(data) : dataSorted;
}

function getMonthMilliseconds(month: Month, year: number): number {
  return millisecondsInMonth(year)[month];
}

export function generateQuery(numMonths: number, groupingTag?: TagNames): any {
  const currentTimestamp = Date.now();
  const currentDate = new Date(currentTimestamp);
  const currentMonth = currentDate.getMonth() + 1;

  let currentYear = currentDate.getFullYear();

  let totalMilliseconds = 0;

  for (let i = 0; i < numMonths; i++) {
    let month = currentMonth - i;

    if (month <= 0) {
      month += 12;
      currentYear -= 1;
    }

    totalMilliseconds += getMonthMilliseconds(month as Month, currentYear);
  }

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
              groupbyTagSecondLevelKey: groupingTag
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
          windowSize: totalMilliseconds,
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
      totalVolume: { gb: 1 },
      retentionPeriods: {
        days90: { gb: 1 },
        days60: { gb: 1 },
        days30: { gb: 1 }
      },
      year: 2024
    });
  }
  return data;
};

export function transformLabeledData(data: any[]) {
  const finalResult = data.reduce((result, current) => {
    const { month, year, retentionPeriods, label } = current;

    let monthYear = result.find((item: any) => item.month === month && item.year === year);

    if (!monthYear) {
      monthYear = {
        month,
        year,
        totalVolume: { gb: 0 },
        retentionPeriods: {
          days90: [],
          days60: [],
          days30: []
        },
        partialSums: {
          days90: { gb: 0 },
          days60: { gb: 0 },
          days30: { gb: 0 }
        }
      };
      result.push(monthYear);
    }

    monthYear.totalVolume.gb += current.totalVolume.gb;

    Object.keys(retentionPeriods).forEach(period => {
      const periodData = monthYear.retentionPeriods[period].find((p: any) => p.label === label);
      const volumeGB = retentionPeriods[period].gb;

      if (periodData) {
        periodData.volumeGB += +volumeGB.toFixed(2);
      } else {
        monthYear.retentionPeriods[period].push({
          label: label === UNCATEGORIZED_LABEL ? NDash : label,
          volumeGB
        });
      }

      monthYear.partialSums[period].gb += +volumeGB.toFixed(2);
    });

    return result;
  }, []);
  return roundDataValues(finalResult);
}

function roundDataValues(data: any): any[] {
  return data.map((item: any) => {
    const roundedPartialSums = Object.fromEntries(
      Object.entries(item.partialSums).map(([key, value]: [string, any]) => [
        key,
        {
          gb: Math.round(value.gb * 100) / 100
        }
      ])
    );

    const roundedTotalVolume = {
      gb: Math.round(item.totalVolume.gb * 100) / 100
    };

    return {
      ...item,
      totalVolume: roundedTotalVolume,
      partialSums: roundedPartialSums
    };
  });
}

export function getLabelByName(name: string) {
  const tag = groupTags.tags.find(tag => tag.name === name);
  return tag ? tag.label : null;
}
