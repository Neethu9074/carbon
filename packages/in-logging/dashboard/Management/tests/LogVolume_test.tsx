/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

import LogVolume from 'in-logging/dashboard/Management/LogVolume';
import { user } from 'in-stores/user';

jest.mock('in-logging/dashboard/Management/Breadcrumbs', () => () => <div>Mocked Breadcrumbs</div>);

jest.mock('in-settings/tabs/GlobalSettings/pages/logManagement/LogVolume/LogVolume', () => ({
  LogVolume: () => <div>Mocked Log Volume Content</div>
}));

jest.mock('in-logging/dashboard/LoggingDashboardWrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('in-components/rbac', () => () => <div>Restricted Access</div>);

jest.mock('in-logging/api/licence', () => ({
  isAddonUserCached: jest.fn()
}));

jest.mock('in-stores/user', () => ({
  user: { role: {} }
}));

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('LogVolume Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Restricted Access when the user does not have permission', () => {
    (user as any).role = {};
    (useObservable as jest.Mock).mockReturnValue(false);

    render(<LogVolume />);

    expect(screen.getByText('Restricted Access')).toBeInTheDocument();

    expect(screen.queryByText('Mocked Breadcrumbs')).not.toBeInTheDocument();
    expect(screen.queryByText('Mocked Log Volume Content')).not.toBeInTheDocument();
  });

  test('renders Restricted Access when the user is not an addon user', () => {
    (user as any).role = { canViewLogVolume: true };
    (useObservable as jest.Mock).mockReturnValue(false);

    render(<LogVolume />);

    expect(screen.getByText('Restricted Access')).toBeInTheDocument();

    expect(screen.queryByText('Mocked Breadcrumbs')).not.toBeInTheDocument();
    expect(screen.queryByText('Mocked Log Volume Content')).not.toBeInTheDocument();
  });

  test('renders Log Volume content when the user has permission and is an addon user', () => {
    (user as any).role = { canViewLogVolume: true };
    (useObservable as jest.Mock).mockReturnValue(true);

    render(<LogVolume />);

    expect(screen.queryByText('Restricted Access')).not.toBeInTheDocument();

    expect(screen.getByText('Mocked Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Mocked Log Volume Content')).toBeInTheDocument();
  });
});
