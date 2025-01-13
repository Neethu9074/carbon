/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import LogIntegrations from '../LogIntegrations';
import { user } from 'in-stores/user';

jest.mock('in-logging/dashboard/Configuration/Breadcrumbs', () => () => <div>Mocked Breadcrumbs</div>);

jest.mock('in-settings/tabs/GlobalSettings/pages/integrations/logging/Integrations/Integrations', () => () => (
  <div>Mocked Log Integrations Content</div>
));

jest.mock('in-components/rbac', () => () => <div>Restricted Access</div>);

jest.mock('in-stores/user', () => ({
  user: { role: {} }
}));

jest.mock('in-logging/dashboard/Configuration/Configuration.mless', () => ({
  content: 'mocked-content-class'
}));

describe('LogIntegrations Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Restricted Access when the user does not have permission', () => {
    (user as any).role = {};

    render(<LogIntegrations />);

    expect(screen.getByText('Restricted Access')).toBeInTheDocument();
    expect(screen.queryByText('Mocked Breadcrumbs')).not.toBeInTheDocument();
    expect(screen.queryByText('Mocked Log Integrations Content')).not.toBeInTheDocument();
  });

  test('renders Log Integrations content when the user has permission', () => {
    (user as any).role = { canConfigureLogManagement: true };

    render(<LogIntegrations />);

    expect(screen.queryByText('Restricted Access')).not.toBeInTheDocument();

    expect(screen.getByText('Mocked Breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Mocked Log Integrations Content')).toBeInTheDocument();

    expect(screen.getByText('Mocked Log Integrations Content').parentElement).toHaveClass('mocked-content-class');
  });
});
