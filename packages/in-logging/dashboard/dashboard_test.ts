/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderHook } from '@testing-library/react-hooks';

import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

// eslint-disable-next-line no-restricted-imports
import { useLoggingNavigationItems } from './utils';
import { loggingDashboardPath } from 'in-logging/navigation/paths';
import { role } from 'in-stores/user';

jest.mock('in-stores/user', () => ({
  role: {
    canConfigureLogRetentionPeriod: true,
    canViewLogVolume: true,
    canConfigureIntegrations: true
  }
}));

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

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
    role!.canConfigureIntegrations = false;

    rerender();

    expect(result.current[3].isTabAllowed).toBe(false);
  });

  test('should translate labels correctly', () => {
    const { result } = renderHook(() => useLoggingNavigationItems());
    expect(result.current[1].label).toBe(t('in-logging:dashboard.smartAlerts'));
  });
});
