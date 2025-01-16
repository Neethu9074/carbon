/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import Management from '../Management';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { user } from 'in-stores/user';

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

jest.mock('in-stores/navigation/hooks/useNavigation', () => ({
  useNavigation: jest.fn()
}));

jest.mock('in-stores/user', () => ({
  user: { role: {} }
}));

jest.mock('in-i18n', () => ({
  t: jest.fn(key => {
    const mockTranslations = {
      'in-logging:dashboard.managementPage.retentionPeriod': 'Retention Period',
      'in-logging:dashboard.managementPage.retentionPeriodDescription': 'Manage the retention period for logs.',
      'in-logging:dashboard.managementPage.logVolume': 'Log Volume',
      'in-logging:dashboard.managementPage.logVolumeDescription': 'View log volume details.',
      'in-logging:dashboard.managementPage.logIntegrations': 'Log Integrations',
      'in-logging:dashboard.managementPage.logIntegrationsDescription': 'Manage log integrations.'
    } as any;
    return mockTranslations[key] || key;
  })
}));

jest.mock('in-components/rbac', () => () => <div>Restricted Access</div>);
jest.mock('in-logging/dashboard/LoggingDashboardWrapper', () => (props: any) => (
  <div data-testid="dashboard-wrapper">{props.children}</div>
));

describe('Management Component', () => {
  const mockGoToPath = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigation as jest.Mock).mockReturnValue({
      goToPath: mockGoToPath
    });

    (useObservable as jest.Mock).mockReturnValue(true);
  });

  test('renders Restricted Access when no permissions are granted', () => {
    (user as any).role = {};

    render(<Management />);

    expect(screen.getByText('Restricted Access')).toBeInTheDocument();
  });

  test('renders Retention Period card when permission is granted', () => {
    (user as any).role = { canConfigureLogRetentionPeriod: true };

    render(<Management />);

    expect(screen.getByText('Retention Period')).toBeInTheDocument();
    expect(screen.getByText('Manage the retention period for logs.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(mockGoToPath).toHaveBeenCalledWith('/logging/manage/retention');
  });

  test('renders Log Volume card when permission is granted', () => {
    (user as any).role = { canViewLogVolume: true };

    render(<Management />);

    expect(screen.getByText('Log Volume')).toBeInTheDocument();
    expect(screen.getByText('View log volume details.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(mockGoToPath).toHaveBeenCalledWith('/logging/manage/logVolume');
  });

  test('renders Log Integrations card when permission is granted', () => {
    (user as any).role = { canConfigureLogManagement: true };

    render(<Management />);

    expect(screen.getByText('Log Integrations')).toBeInTheDocument();
    expect(screen.getByText('Manage log integrations.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(mockGoToPath).toHaveBeenCalledWith('/logging/manage/integrations');
  });

  test('renders all cards when all permissions are granted', () => {
    (user as any).role = {
      canConfigureLogRetentionPeriod: true,
      canViewLogVolume: true,
      canConfigureLogManagement: true
    };

    render(<Management />);

    expect(screen.getByText('Retention Period')).toBeInTheDocument();
    expect(screen.getByText('Manage the retention period for logs.')).toBeInTheDocument();
    expect(screen.getByText('Log Integrations')).toBeInTheDocument();
    expect(screen.getByText('Log Volume')).toBeInTheDocument();
    expect(screen.getByText('View log volume details.')).toBeInTheDocument();
    expect(screen.getByText('Manage log integrations.')).toBeInTheDocument();
  });
});
