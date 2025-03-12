/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';

describe('Synthetic Home ViewSwitcher', () => {
  it('Renders the Tests page title and tabs with the correct icons and names', () => {
    render(<ViewSwitcher />);
    expect(screen.getByText('Synthetic monitoring')).toBeInTheDocument();
  });

  it('Switches tabs checking tab icon plus label', () => {
    render(<ViewSwitcher />);
    screen.getByText(/Tests/).click();
    screen.getByText(/Locations/).click();
    screen.getByText(/Smart Alerts/).click();
  });
});
