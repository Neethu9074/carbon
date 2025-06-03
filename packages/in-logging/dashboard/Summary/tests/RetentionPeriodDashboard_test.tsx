/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { retentionLogsGET } from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/RetentionPeriod';
import RetentionPeriodDashboard from 'in-logging/dashboard/Summary/RetentionPeriod/RetentionPeriodDashboard';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));
jest.mock('in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/RetentionPeriod', () => ({
  retentionLogsGET: jest.fn()
}));
jest.mock('in-stores/user', () => ({
  role: {
    canConfigureLogRetentionPeriod: true
  }
}));

describe('RetentionPeriodDashboard', () => {
  const getLoadingIndicator = () => {
    return (
      screen.queryByTestId('loadingIndicator') ||
      document.querySelector('.carbonSkeleton') ||
      document.querySelector('.local-css-loadingIndicator')
    );
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading indicators while loading', () => {
    (retentionLogsGET as jest.Mock).mockReturnValue({
      once: jest.fn(),
      errors: jest.fn(() => ({ once: jest.fn() }))
    });
    (useObservable as jest.Mock).mockReturnValueOnce(true);

    render(<RetentionPeriodDashboard />);
    const loadingIndicator = getLoadingIndicator();

    expect(loadingIndicator).toBeInTheDocument();
  });

  it('displays the retention value correctly when loading data', () => {
    (retentionLogsGET as jest.Mock).mockReturnValueOnce({
      once: jest.fn(callback => callback({ body: { retentionDays: 30 } })),
      errors: jest.fn(() => ({ once: jest.fn() }))
    });
    (useObservable as jest.Mock).mockReturnValueOnce(false);

    render(<RetentionPeriodDashboard />);

    expect(screen.getByTestId('retentionValue')).toHaveTextContent('30');
  });

  it('renders error state correctly when request fails', () => {
    (retentionLogsGET as jest.Mock).mockReturnValueOnce({
      once: jest.fn(),
      errors: jest.fn(() => ({
        once: jest.fn(callback => callback({ error: ['Something went wrong'] }))
      }))
    });

    (useObservable as jest.Mock).mockReturnValue(false);

    render(<RetentionPeriodDashboard />);

    const errorIcon = screen.getByTestId('kpi-error-icon');
    expect(errorIcon).toBeInTheDocument();

    expect(screen.queryByTestId('retentionValue')).not.toBeInTheDocument();

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
