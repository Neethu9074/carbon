/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import { LoggingPermissionWrapperProps } from 'in-logging/navigation/LoggingPermissionWrapper';
import SmartAlerts from 'in-logging/dashboard/SmartAlerts/SmartAlerts';

type MockRole = {
  [key: string]: boolean;
};

let mockRole: MockRole = {
  canViewLogs: true
};

// Mock LoggingPermissionWrapper
jest.mock('in-logging/navigation/LoggingPermissionWrapper', () => {
  return {
    __esModule: true,
    default: ({ requiredPermission, permissionLabel, children }: LoggingPermissionWrapperProps) => {
      if (!mockRole[requiredPermission]) {
        return (
          <div data-testid="restricted-message">
            <div className="restricted-wrapper">
              <span>Access Restricted</span>
              <span>
                {permissionLabel
                  ? `You do not have the required permission: ${permissionLabel}`
                  : 'You do not have the necessary permissions to access this content.'}
              </span>
            </div>
          </div>
        );
      }
      return <>{children}</>;
    }
  };
});

// Mock Alert Component
jest.mock('in-alerting/smart-alerts/logs/Alerts', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="alert">Alert Component</div>
  };
});

describe('SmartAlerts', () => {
  test('renders Alert component when permission is granted', () => {
    mockRole = { canViewLogs: true };
    const { getByTestId } = render(<SmartAlerts />);
    expect(getByTestId('alert')).toBeInTheDocument();
  });

  test('renders restricted access message when permission is denied', () => {
    mockRole = { canViewLogs: false };
    const { getByTestId } = render(<SmartAlerts />);
    expect(getByTestId('restricted-message')).toBeInTheDocument();
    expect(getByTestId('restricted-message')).toHaveTextContent('Access Restricted');
  });
});
