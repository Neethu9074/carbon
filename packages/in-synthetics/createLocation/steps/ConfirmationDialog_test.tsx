/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm } from 'formalistic';
import { screen, render } from '@testing-library/react';
import React from 'react';

import ConfirmationDialog from 'in-synthetics/createLocation/steps/ConfirmationDialog';

describe('Confirmation Dialog', () => {
  const onClose = jest.fn();
  const form = createMapForm()
    .put(
      'id',
      createField({
        value: 'sample_id'
      })
    )
    .put(
      'syntheticDatacenters',
      createField({
        value: [
          {
            cityName: 'NCalifornia',
            code: 'us-west-1',
            countryName: 'USA',
            label: 'us-west-1(NCalifornia)',
            latitude: 50.11,
            longitude: 8.68,
            provider: 'aws',
            status: 'Inactive'
          }
        ]
      })
    );

  it('Confirmation dialog gets rendered with correct data', () => {
    const { container } = render(
      <ConfirmationDialog
        header={'New Location'}
        headerIcon="lib_synthetic_location"
        buttonLabel={'Done'}
        buttonKind="primary"
        onSubmit={() => onClose()}
        form={form}
      />
    );
    expect(container.getElementsByTagName('th')[0]).toHaveTextContent('Datacenter Code');
    expect(container.getElementsByTagName('th')[1]).toHaveTextContent('Datacenter Name');
    expect(container.getElementsByTagName('th')[2]).toHaveTextContent('Status');

    const confirmationColumns = container.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0].children;

    expect(confirmationColumns.length).toBe(3);
    expect(confirmationColumns[0].textContent).toBe('us-west-1');
    expect(confirmationColumns[1].textContent).toBe('us-west-1(NCalifornia)');
    expect(confirmationColumns[2].textContent).toBe('Pending');

    expect(
      screen.getByRole('button', {
        name: 'Done'
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: 'Done'
      })
    ).not.toBeDisabled();
  });
});
