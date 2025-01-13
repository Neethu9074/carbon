/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { useObservable } from '@instana/hooks';

// eslint-disable-next-line no-restricted-imports
import RetentionPeriod from '../RetentionPeriod';
import { user } from 'in-stores/user';

jest.mock('in-logging/dashboard/Configuration/Breadcrumbs', () => () => <div>Mocked Breadcrumbs</div>);

jest.mock('in-settings/tabs/GlobalSettings/pages/logManagement/RententionPeriod/RetentionPeriod', () => () => (
  <div>Mocked Retention Period Content</div>
));

jest.mock('in-components/rbac', () => () => <div>Restricted Access</div>);

jest.mock('in-logging/api/licence', () => ({
  isAddonUserCached: jest.fn()
}));

jest.mock('in-stores/user', () => ({
  user: { role: {} }
}));

jest.mock('in-logging/dashboard/Configuration/Configuration.mless', () => ({
  content: 'mocked-content-class'
}));

jest.mock('@instana/hooks', () => ({
  useObservable: jest.fn()
}));

describe('RetentionPeriod Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Restricted Access when the user does not have permission', () => {
    (user as any).role = {};
    (useObservable as jest.Mock).mockReturnValue(false);

    render(<RetentionPeriod />);

    expect(screen.getByText('Restricted Access')).toBeInTheDocument();

    expect(screen.queryByText('Mocked Breadcrumbs')).not.toBeInTheDocument();
    expect(screen.queryByText('Mocked Retention Period Content')).not.toBeInTheDocument();
  });

  test('renders Restricted Access when the user is not an addon user', () => {
    (user as any).role = { canConfigureLogRetentionPeriod: true };
    (useObservable as jest.Mock).mockReturnValue(false);

    render(<RetentionPeriod />);

    expect(screen.getByText('Restricted Access')).toBeInTheDocument();

    expect(screen.queryByText('Mocked Breadcrumbs')).not.toBeInTheDocument();
    expect(screen.queryByText('Mocked Retention Period Content')).not.toBeInTheDocument();
  });

  test('renders Retention Period content when the user has permission and is an addon user', () => {
    (user as any).role = { canConfigureLogRetentionPeriod: true };
    (useObservable as jest.Mock).mockReturnValue(true);

    render(<RetentionPeriod />);

    expect(screen.queryByText('Restricted Access')).not.toBeInTheDocument();

    expect(screen.getByText('Mocked Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Mocked Retention Period Content')).toBeInTheDocument();

    expect(screen.getByText('Mocked Retention Period Content').parentElement).toHaveClass('mocked-content-class');
  });
});
