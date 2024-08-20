/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LabeledMetricResult, Result, TagType, TimeConfig } from '@instana/types';
import { just } from '@instana/observables';

// eslint-disable-next-line no-restricted-imports
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';

interface RetentionPeriodData {
  days90: number;
  days60: number;
  days30: number;
}

interface MonthlyRetentionData {
  month: string;
  year: number;
  totalVolumeGB: number;
  retentionPeriods: RetentionPeriodData;
  label?: string;
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

export const DEFAULT_NO_GROUPING_VALUE = 'NO_GROUPING';

export function transformData(dataResult: UnifiedMetricsResult[]): MonthlyRetentionData[] | null {
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
      const month = date.toLocaleString('en-US', { month: 'long' });
      const yearValue = date.getFullYear();
      const monthYearKey = `${month}-${yearValue}`;

      if (!dataMap[label]) {
        dataMap[label] = {};
      }

      if (!dataMap[label][monthYearKey]) {
        dataMap[label][monthYearKey] = { days90: 0, days60: 0, days30: 0 };
      }

      if (retentionDays === 30) {
        dataMap[label][monthYearKey].days30 += +volumeGB.toFixed(2);
      } else if (retentionDays === 60) {
        dataMap[label][monthYearKey].days60 += +volumeGB.toFixed(2);
      } else if (retentionDays === 90) {
        dataMap[label][monthYearKey].days90 += +volumeGB.toFixed(2);
      }
    }
  }

  const data: MonthlyRetentionData[] = [];

  for (const [label, months] of Object.entries(dataMap)) {
    for (const [monthYearKey, retentionData] of Object.entries(months)) {
      const [month, yearValue] = monthYearKey.split('-');
      const totalGB = retentionData.days30 + retentionData.days60 + retentionData.days90;
      data.push({
        label,
        month,
        year: parseInt(yearValue, 10),
        totalVolumeGB: +totalGB.toFixed(2),
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

export function generateQuery(numMonths: number, groupingTag?: TagNames): any {
  const currentTimestamp = Date.now();
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
      totalVolumeGB: 1,
      retentionPeriods: {
        days90: 0,
        days60: 0,
        days30: 0
      },
      year: 2024
    });
  }
  return data;
};

export function transformLabeledData(data: any) {
  const finalResult = data.reduce((result: any, current: any) => {
    const { month, year, retentionPeriods, label } = current;

    let monthYear = result.find((item: any) => item.month === month && item.year === year);

    if (!monthYear) {
      monthYear = {
        month,
        year,
        totalVolumeGB: 0,
        retentionPeriods: {
          days90: [],
          days60: [],
          days30: []
        },
        partialSums: {
          days90: 0,
          days60: 0,
          days30: 0
        }
      };
      result.push(monthYear);
    }

    monthYear.totalVolumeGB += current.totalVolumeGB;

    Object.keys(retentionPeriods).forEach(period => {
      const periodData = monthYear.retentionPeriods[period].find((p: any) => p.label === label);
      const volumeGB = retentionPeriods[period];

      if (periodData) {
        periodData.volumeGB += +volumeGB.toFixed(2);
      } else {
        monthYear.retentionPeriods[period].push({
          label,
          volumeGB
        });
      }

      monthYear.partialSums[period] += +volumeGB.toFixed(2);
    });

    return result;
  }, []);

  return roundDataValues(finalResult);
}

function roundDataValues(data: any) {
  return data.map((item: any) => {
    const roundedPartialSums = Object.fromEntries(
      Object.entries(item.partialSums).map(([key, value]: [any, any]) => [key, Math.round(value * 100) / 100])
    );

    const roundedTotalVolumeGB = Math.round(item.totalVolumeGB * 100) / 100;

    return {
      ...item,
      totalVolumeGB: roundedTotalVolumeGB,
      partialSums: roundedPartialSums
    };
  });
}
