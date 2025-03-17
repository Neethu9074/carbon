/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { CreateLogsSmartAlertFloatingButton } from 'in-logging/navigation/createLogsSmartAlertFloatingButton';
import { role } from 'in-stores/user';

jest.mock('in-components/FloatingActionButton/FloatingActionButtons', () => ({ children }: any) => (
  <div>
    Floating Action Buttons
    {children}
  </div>
));

jest.mock('in-alerting/smart-alerts/logs/CreateSmartAlert', () => () => <div>Create Smart Alert</div>);
jest.mock('in-stores/user', () => ({
  role: { canConfigureGlobalLogSmartAlerts: true }
}));

describe('CreateLogsSmartAlertFloatingButton', () => {
  beforeEach(() => {
    (role as any).canConfigureGlobalLogSmartAlerts = true;
  });

  it('should render FloatingActionButtons and CreateSmartAlert if user has permissions', () => {
    render(<CreateLogsSmartAlertFloatingButton />);

    expect(screen.getByText('Floating Action Buttons')).toBeInTheDocument();
    expect(screen.getByText('Create Smart Alert')).toBeInTheDocument();
  });

  it('should not render FloatingActionButtons and CreateSmartAlert if user does not have permissions', () => {
    (role as any).canConfigureGlobalLogSmartAlerts = false;

    const { container } = render(<CreateLogsSmartAlertFloatingButton />);

    expect(container.firstChild).toBeNull();
  });

  it('should render null if role is undefined', () => {
    (role as any).canConfigureGlobalLogSmartAlerts = undefined;

    const { container } = render(<CreateLogsSmartAlertFloatingButton />);

    expect(container.firstChild).toBeNull();
  });
});
