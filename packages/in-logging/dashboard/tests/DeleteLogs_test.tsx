/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { LoggingPermissionWrapperProps } from 'in-logging/navigation/LoggingPermissionWrapper';
import DeleteLogs from 'in-logging/dashboard/DeleteLogs';

type MockRole = {
  [key: string]: boolean;
};

let mockRole: MockRole = {
  canDeleteLogs: true
};

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

jest.mock('in-logging/dashboard/LoggingDashboardWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

jest.mock('in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogs', () => ({
  __esModule: true,
  default: () => <div data-testid="deleteLogsMockContainer">DeleteLogsPage</div>
}));

jest.mock('in-components/rbac/RestrictedAccessMessage', () => ({
  __esModule: true,
  default: ({ permission }: any) => <div>Access Denied: {permission}</div>
}));

describe('DeleteLogs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render DeleteLogsPage when user has canDeleteLogs permission', () => {
    mockRole = { canDeleteLogs: true };
    const { getByTestId } = render(<DeleteLogs />);
    expect(getByTestId('deleteLogsMockContainer')).toBeInTheDocument();
    expect(screen.getByText('DeleteLogsPage')).toBeInTheDocument();
  });

  it('should render RestrictedAccessMessage when user does not have canDeleteLogs permission', () => {
    mockRole = { canViewLogs: false };
    const { getByTestId } = render(<DeleteLogs />);
    expect(getByTestId('restricted-message')).toBeInTheDocument();
    expect(getByTestId('restricted-message')).toHaveTextContent('Access Restricted');
  });
});
