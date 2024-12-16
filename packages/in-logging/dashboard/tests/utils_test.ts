/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import { generateQueryWithWinSize, useLoggingNavigationItems } from '../utils';
// eslint-disable-next-line no-restricted-imports
import { loggingDashboardPath } from 'in-logging/navigation/paths';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

jest.mock('in-stores/user', () => ({
  role: {
    canConfigureLogRetentionPeriod: true,
    canViewLogVolume: true,
    canConfigureLogManagement: true
  }
}));

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

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

describe('useLoggingNavigationItems', () => {
  beforeEach(() => {
    (useObservable as jest.Mock).mockReturnValue({ licensed: true });
  });

  test('should return correct paths and labels', () => {
    const { result } = renderHook(() => useLoggingNavigationItems());
    expect(result.current).toHaveLength(4);
    expect(result.current[0].path).toBe(loggingDashboardPath);
    expect(result.current[0].label).toBe(t('in-logging:dashboard.summary'));
  });

  test('should correctly mark the current tab', () => {
    const { result } = renderHook(() => useLoggingNavigationItems());
    const isActive = (result.current[0].currentTab as (path: string) => boolean)(loggingDashboardPath);
    expect(isActive).toBe(true);
  });

  test('should allow or disallow tabs based on role permissions', () => {
    role!.canConfigureLogRetentionPeriod = true;
    const { result, rerender } = renderHook(() => useLoggingNavigationItems());

    expect(result.current[3].isTabAllowed).toBe(true);

    role!.canConfigureLogRetentionPeriod = false;
    rerender();

    expect(result.current[2].isTabAllowed).toBe(false);
  });

  test('should conditionally show configuration tab for addon users', () => {
    role!.canConfigureLogRetentionPeriod = true;
    const { result, rerender } = renderHook(() => useLoggingNavigationItems());

    expect(result.current[3].isTabAllowed).toBe(true);

    (useObservable as jest.Mock).mockReturnValue(undefined);
    role!.canConfigureLogManagement = false;

    rerender();

    expect(result.current[3].isTabAllowed).toBe(false);
  });

  test('should translate labels correctly', () => {
    const { result } = renderHook(() => useLoggingNavigationItems());
    expect(result.current[1].label).toBe(t('in-logging:dashboard.smartAlerts'));
  });
});
