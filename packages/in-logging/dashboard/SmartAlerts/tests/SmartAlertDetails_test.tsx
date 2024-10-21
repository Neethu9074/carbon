/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import SmartAlertDetails from 'in-logging/dashboard/SmartAlerts/SmartAlertDetails';

jest.mock('in-alerting/smart-alerts/logs/LogsAlertsTabHeader', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="logs-alerts-tab-header">Logs Alerts Tab Header</div>
  };
});

jest.mock('in-logging/dashboard/LoggingDashboardWrapper', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="logging-dashboard-wrapper">{children}</div>
    )
  };
});

jest.mock('in-alerting/smart-alerts/logs/details/AlertDetails', () => {
  return {
    __esModule: true,
    default: ({ isLogsDashboardHeader }: { isLogsDashboardHeader?: boolean }) => {
      const Header = isLogsDashboardHeader
        ? require('in-logging/dashboard/LoggingDashboardWrapper').default
        : require('in-alerting/smart-alerts/logs/LogsAlertsTabHeader').default;
      return (
        <Header>
          <div data-testid="alert-details">Alert Details Component</div>
        </Header>
      );
    }
  };
});

describe('SmartAlertDetails', () => {
  test('renders Smart Alerts detail component', () => {
    const { getByTestId } = render(<SmartAlertDetails />);
    expect(getByTestId('alert-details')).toBeInTheDocument();
    expect(getByTestId('alert-details')).toHaveTextContent('Alert Details Component');
  });
});
