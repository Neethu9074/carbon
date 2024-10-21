/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import {
  dashboardConfigurationPath,
  dashboardDeletePath,
  dashboardSmartAlertsPath,
  loggingDashboardPath
} from 'in-logging/navigation/paths';
// eslint-disable-next-line no-restricted-imports
import { generateQueryWithWinSize, loggingNavigationItem } from '../utils';
import { t } from 'in-i18n';

describe('generateQueryWithWinSize', () => {
  it('should generate query with correct window size', () => {
    const windowSize = 7 * 86400000;
    const query = generateQueryWithWinSize(windowSize);

    const currentTimestamp = Date.now();
    const tolerance = 5000; // With exact time I'm having troubles, lets put 5 second of tolerance
    const isCloseTo = (received: number, expected: number, tolerance: number): boolean => {
      return Math.abs(received - expected) <= tolerance;
    };

    expect(query).toEqual(
      expect.objectContaining({
        subscriptionId: 44,
        metrics: {
          'y1-0': {
            source: 'LOG',
            metric: 'log_volume',
            aggregation: 'SUM',
            timeShift: { offset: 0 },
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
            timeConfig: expect.objectContaining({
              to: expect.any(Number),
              focusedMoment: expect.any(Number),
              windowSize: windowSize + 30 * 86400000,
              autoRefresh: false
            })
          }
        }
      })
    );

    expect(isCloseTo(query.metrics['y1-0'].timeConfig.to, currentTimestamp, tolerance)).toBe(true);
    expect(isCloseTo(query.metrics['y1-0'].timeConfig.focusedMoment, currentTimestamp, tolerance)).toBe(true);
  });
});

describe('loggingNavigationItem', () => {
  it('should generate correct navigation items', () => {
    const expectedItems = [
      {
        path: loggingDashboardPath,
        label: t('in-logging:dashboard.summary'),
        currentTab: expect.any(Function)
      },
      {
        path: dashboardSmartAlertsPath,
        label: t('in-logging:dashboard.smartAlerts'),
        currentTab: dashboardSmartAlertsPath
      },
      {
        path: dashboardDeletePath,
        label: t('in-logging:dashboard.deleteLogs'),
        currentTab: expect.any(Function)
      },
      {
        path: dashboardConfigurationPath,
        label: t('in-logging:dashboard.configuration'),
        currentTab: expect.any(Function)
      }
    ];

    expect(loggingNavigationItem).toEqual(expectedItems);
  });

  it('should correctly evaluate currentTab functions', () => {
    const summaryTab = loggingNavigationItem.find(item => item.path === loggingDashboardPath);

    if (typeof summaryTab?.currentTab === 'function') {
      expect(summaryTab.currentTab(loggingDashboardPath)).toBe(true);
      expect(summaryTab.currentTab(dashboardSmartAlertsPath)).toBe(false);
    }
  });

  it('should correctly evaluate currentTab for dashboardDeletePath', () => {
    const deleteTab = loggingNavigationItem.find(item => item.path === dashboardDeletePath);

    if (typeof deleteTab?.currentTab === 'function') {
      expect(deleteTab.currentTab(dashboardDeletePath)).toBe(true);
      expect(deleteTab.currentTab(loggingDashboardPath)).toBe(false);
    }
  });

  it('should correctly evaluate currentTab for dashboardConfigurationPath', () => {
    const configTab = loggingNavigationItem.find(item => item.path === dashboardConfigurationPath);

    if (typeof configTab?.currentTab === 'function') {
      expect(configTab.currentTab(dashboardConfigurationPath)).toBe(true);
      expect(configTab.currentTab(dashboardSmartAlertsPath)).toBe(false);
    }
  });
});
