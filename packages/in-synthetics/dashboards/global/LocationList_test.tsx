/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import LocationList from 'in-synthetics/dashboards/global/LocationList';

describe('LocationList', () => {
  it('should render a Synthetic location table', () => {
    render(<LocationList />);

    //Tabs
    expect(screen.getByText('Tests')).toBeVisible();
    expect(screen.getByText('Smart Alerts')).toBeVisible();

    // Columns
    expect(screen.getByText('Location name')).toBeVisible();
    expect(screen.getByText('Display name')).toBeVisible();
    expect(screen.getByText('Status')).toBeVisible();
    expect(screen.getAllByText('Type')[1]).toBeVisible();
    expect(screen.getByText('No. of tests linked')).toBeVisible();
    expect(screen.getByText('Last test run on')).toBeVisible();
    expect(screen.getByText('Namespace')).toBeVisible();
    expect(screen.getByText('IP Address')).toBeVisible();
    expect(screen.getByText('Version')).toBeVisible();
    expect(screen.getByText('Health')).toBeVisible();
  });
});
