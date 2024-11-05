/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import RetentionPeriodDashboard from '../RetentionPeriod/RetentionPeriodDashboard';
import { retentionLogsGET } from 'in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/RetentionPeriod';

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

  it('handles error state correctly', () => {
    (retentionLogsGET as jest.Mock).mockReturnValueOnce({
      once: jest.fn(),
      errors: jest.fn(() => ({ once: jest.fn(callback => callback()) }))
    });
    (useObservable as jest.Mock).mockReturnValueOnce(false);

    render(<RetentionPeriodDashboard />);
    const loadingIndicator = getLoadingIndicator();

    expect(loadingIndicator).not.toBeInTheDocument();
  });
});
