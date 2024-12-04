/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import {
  dashboardConfigurationPath,
  dashboardDeletePath,
  dashboardSmartAlertsPath,
  loggingDashboardPath
} from 'in-logging/navigation/paths';
import { isAddonUserCached } from 'in-logging/api/licence';
import { role } from 'in-stores/user';

export function generateQueryWithWinSize(windowSize: number): any {
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
          windowSize: windowSize + 30 * 86400000,
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
      path: dashboardConfigurationPath,
      label: t('in-logging:dashboard.configuration'),
      currentTab: path => path === dashboardConfigurationPath,
      isTabAllowed: Boolean(
        (isLoggingAddonUser && role?.canConfigureLogRetentionPeriod) ||
          (isLoggingAddonUser && role?.canViewLogVolume) ||
          role?.canConfigureLogManagement
      )
    }
  ];
};
