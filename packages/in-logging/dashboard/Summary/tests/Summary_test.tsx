/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { useObservable } from '@instana/hooks';

import Summary from 'in-logging/dashboard/Summary/Summary';
import { role } from 'in-stores/user';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('../RetentionPeriod/RetentionPeriodDashboard', () => () => (
  <div data-testid="retentionPeriodKPI">Retention Period KPI Card</div>
));
jest.mock('../LogVolume/LogVolumeDashboard', () => () => <div data-testid="logVolumeKPI">Log Volume KPI Card</div>);
jest.mock('in-custom-dashboards/widgets/Chart/UnifiedMetricsChart', () => () => (
  <div data-testid="logsChart">Logs Charts</div>
));

describe('Summary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with appropriate child components when user has all permissions', () => {
    (useObservable as jest.Mock).mockReturnValueOnce(true);
    (role as any).canViewLogs = true;
    (role as any).canViewLogVolume = true;

    const { container } = render(<Summary />);

    const stickyWrapperElement = container.querySelector('[class*="sticky-wrapper"]');
    expect(stickyWrapperElement).toBeInTheDocument();
    expect(screen.getByTestId('retentionPeriodKPI')).toBeInTheDocument();
    expect(screen.getByTestId('logVolumeKPI')).toBeInTheDocument();
    expect(screen.getAllByText('Logs Charts').length).toBe(2);
  });

  it('does not render LogVolumeDashboard if user does not have log volume permission', () => {
    (useObservable as jest.Mock).mockReturnValueOnce(true);
    (role as any).canViewLogs = true;
    (role as any).canViewLogVolume = false;

    render(<Summary />);

    expect(screen.queryByTestId('logVolumeDashboard')).not.toBeInTheDocument();
  });
});
