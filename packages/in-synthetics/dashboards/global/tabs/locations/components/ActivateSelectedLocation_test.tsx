/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

import { SyntheticDatacenter } from '@instana/types';

import ActivateSelectedLocation from 'in-synthetics/dashboards/global/tabs/locations/components/ActivateSelectedLocation';

const dummySyntheticDatacenter: SyntheticDatacenter = {
  cityName: 'Pereira',
  code: 'col-north-2',
  countryName: 'Colombia',
  label: 'col-north-2(Colombia)',
  locationLabel: '',
  provider: 'aws',
  status: 'Pending'
};

const onClose = jest.fn();

describe(ActivateSelectedLocation, () => {
  afterEach(() => {
    cleanup();
  });

  it('Render correct main dialog information.', () => {
    render(<ActivateSelectedLocation datacenter={[dummySyntheticDatacenter]} onClose={onClose} />);
    expect(screen.getByText('Activate Location')).toBeVisible();
    expect(screen.getByText('Datacenters')).toBeVisible();
    expect(screen.getByText('Using an Instana-hosted PoP')).toBeVisible();
  });

  it('Render correct column headers from table', () => {
    render(<ActivateSelectedLocation datacenter={[dummySyntheticDatacenter]} onClose={onClose} />);
    expect(screen.getByText('Datacenter Code')).toBeVisible();
    expect(screen.getByText('Datacenter Name')).toBeVisible();
    expect(screen.getByText('Location Name')).toBeVisible();
    expect(screen.getByText('Activation Status')).toBeVisible();
  });

  it('Render correct table data', () => {
    render(<ActivateSelectedLocation datacenter={[dummySyntheticDatacenter]} onClose={onClose} />);
    expect(screen.getByText('col-north-2')).toBeVisible();
    expect(screen.getByText('col-north-2(Colombia)')).toBeVisible();
    expect(screen.getByText('Pending')).toBeVisible();
  });

  it('Render text from the two custom buttons', () => {
    render(<ActivateSelectedLocation datacenter={[dummySyntheticDatacenter]} onClose={onClose} />);
    expect(screen.getByText('Cancel')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Activate' })).toBeDisabled();
  });
});
