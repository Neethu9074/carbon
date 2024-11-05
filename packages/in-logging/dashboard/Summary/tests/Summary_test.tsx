/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import Summary from '../Summary';
import { role } from 'in-stores/user';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('../RetentionPeriod/RetentionPeriodDashboard', () => () => (
  <div data-testid="retentionPeriodDashboard">Retention Period Dashboard</div>
));
jest.mock('../LogVolume/LogVolumeDashboard', () => () => (
  <div data-testid="logVolumeDashboard">Log Volume Dashboard</div>
));
jest.mock('in-logging/analyze/AnalyzeView/components/Charts/LogsDistributionChartSection', () => () => (
  <div data-testid="logsDistributionChart">Logs Distribution Chart</div>
));

jest.mock('in-logging/dashboard/LoggingDashboardWrapper', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="loggingDashboardWrapper">{children}</div>
    )
  };
});

describe('Summary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with appropriate child components when user has all permissions', () => {
    (useObservable as jest.Mock).mockReturnValueOnce(true);
    (role as any).canViewLogs = true;
    (role as any).canViewLogVolume = true;

    render(<Summary />);

    expect(screen.getByTestId('loggingDashboardWrapper')).toBeInTheDocument();
    expect(screen.getByTestId('retentionPeriodDashboard')).toBeInTheDocument();
    expect(screen.getByTestId('logVolumeDashboard')).toBeInTheDocument();
    expect(screen.getByTestId('logsDistributionChart')).toBeInTheDocument();
  });

  it('does not render LogVolumeDashboard if user does not have log volume permission', () => {
    (useObservable as jest.Mock).mockReturnValueOnce(true);
    (role as any).canViewLogs = true;
    (role as any).canViewLogVolume = false;

    render(<Summary />);

    expect(screen.queryByTestId('logVolumeDashboard')).not.toBeInTheDocument();
  });
});
