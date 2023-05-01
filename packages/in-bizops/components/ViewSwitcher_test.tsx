/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ViewSwitcher from 'in-bizops/components/ViewSwitcher';

describe('packages/in-bizops/components/ViewSwitcher', () => {
  it('Renders the BizOps page title and processes tab with the correct icon and name', () => {
    render(<ViewSwitcher />);
    expect(screen.getByText('Business Processes')).toBeInTheDocument();
  });

  it('Switches tabs checking tab icon plus label', () => {
    render(<ViewSwitcher />);
    screen.getByRole('link', { name: 'lib_bizops Processes' }).click();
    screen.getByRole('link', { name: 'lib_application_service Activities' }).click();
    //screen.getByRole('link', { name: 'lib_alerts_alert Smart Alerts' }).click();
  });
});
