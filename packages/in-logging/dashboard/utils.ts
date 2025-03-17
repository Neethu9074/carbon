/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import {
  dashboardDeletePath,
  dashboardManagementPath,
  dashboardSmartAlertsPath,
  loggingDashboardPath
} from 'in-logging/navigation/paths';
import { Config } from 'in-custom-dashboards/widgets/Chart/types';
import { isAddonUserCached } from 'in-logging/api/licence';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export function generateQueryWithWinSize(windowSize: number): any {
  const currentTimestamp = Date.now();
  const currentDate = new Date(currentTimestamp);
  const currentMonth = currentDate.getMonth() + 1;
  let currentYear = currentDate.getFullYear();

  const finalWinSize = millisecondsInMonth(currentYear as number)[currentMonth as Month];

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
          windowSize: windowSize + finalWinSize,
          focusedMoment: currentTimestamp,
          autoRefresh: false
        }
      }
    }
  };
  return query;
}

// logging dashboard navigation items

interface LoggingNavigationItem {
  path: string;
  label: string;
  currentTab: string | ((path: string) => boolean);
  isTabAllowed?: Boolean;
}

export const useLoggingNavigationItems = (): LoggingNavigationItem[] => {
  const isLoggingAddonUser = useObservable(isAddonUserCached, []);

  return [
    {
      path: loggingDashboardPath,
      label: t('in-logging:dashboard.summary'),
      currentTab: path => path === loggingDashboardPath
    },
    {
      path: dashboardSmartAlertsPath,
      label: t('in-logging:dashboard.smartAlerts'),
      currentTab: dashboardSmartAlertsPath
    },
    {
      path: dashboardDeletePath,
      label: t('in-logging:dashboard.deleteLogs'),
      currentTab: path => path === dashboardDeletePath,
      isTabAllowed: Boolean(role?.canDeleteLogs)
    },
    {
      path: dashboardManagementPath,
      label: t('in-logging:dashboard.management'),
      currentTab: path => path === dashboardManagementPath,
      isTabAllowed: Boolean(
        (isLoggingAddonUser && role?.canConfigureLogRetentionPeriod) ||
          (isLoggingAddonUser && role?.canViewLogVolume) ||
          role?.canConfigureLogManagement
      )
    }
  ];
};

export enum Month {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export const millisecondsInMonth = (year: number) => ({
  [Month.January]: 31 * 86400000,
  [Month.February]: (isLeapYear(year) ? 29 : 28) * 86400000,
  [Month.March]: 31 * 86400000,
  [Month.April]: 30 * 86400000,
  [Month.May]: 31 * 86400000,
  [Month.June]: 30 * 86400000,
  [Month.July]: 31 * 86400000,
  [Month.August]: 31 * 86400000,
  [Month.September]: 30 * 86400000,
  [Month.October]: 31 * 86400000,
  [Month.November]: 30 * 86400000,
  [Month.December]: 31 * 86400000
});

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export const getLogVolumeConfig = (): Config => {
  return {
    y1: {
      formatter: 'bytes.compact',
      renderer: 'stackedBar',
      metrics: [
        {
          metric: 'log_volume',
          aggregation: 'SUM',
          label: t('in-logging:dashboard.managementPage.logVolume'),
          source: 'LOG',
          resultType: 'TIME_SERIES',
          timeShift: {
            offset: 0
          }
        }
      ]
    },
    type: 'TIME_SERIES'
  };
};

export function getLogDistributionConfig() {
  return {
    y1: {
      outlineForColor: {
        '#ff832b': '#ba4e00',
        '#f1c21b': '#8e6a00'
      },
      metrics: [
        {
          metric: 'logs_distribution',
          aggregation: 'SUM',
          label: 'Error',
          source: 'LOG',
          metricTagFilterExpression: {
            type: 'TAG_FILTER',
            operator: 'EQUALS',
            name: 'log.level',
            value: 'ERROR',
            entity: 'NOT_APPLICABLE'
          },
          tagFilterExpression: {
            type: 'EXPRESSION',
            logicalOperator: 'AND',
            elements: []
          }
        },
        {
          metric: 'logs_distribution',
          aggregation: 'SUM',
          label: 'Warn',
          source: 'LOG',
          metricTagFilterExpression: {
            type: 'TAG_FILTER',
            operator: 'EQUALS',
            name: 'log.level',
            value: 'WARN',
            entity: 'NOT_APPLICABLE'
          }
        },
        {
          metric: 'logs_distribution',
          aggregation: 'SUM',
          label: 'Info',
          source: 'LOG',
          metricTagFilterExpression: {
            type: 'TAG_FILTER',
            operator: 'EQUALS',
            name: 'log.level',
            value: 'INFO',
            entity: 'NOT_APPLICABLE'
          }
        },
        {
          metric: 'logs_distribution',
          aggregation: 'SUM',
          label: 'Fatal',
          source: 'LOG',
          metricTagFilterExpression: {
            type: 'TAG_FILTER',
            operator: 'EQUALS',
            name: 'log.level',
            value: 'FATAL',
            entity: 'NOT_APPLICABLE'
          }
        }
      ],
      colors: ['#fa4d56', '#b28600', '#1192e8', '#a56eff', '#009d9a'],
      formatter: 'number.compact',
      renderer: 'stackedBar'
    },
    y2: {
      metrics: []
    },
    type: 'TIME_SERIES'
  };
}
