/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm } from 'formalistic';
import { screen, render } from '@testing-library/react';
import { mount } from 'enzyme';
import React from 'react';

import { SyntheticDatacenter } from '@instana/types';
import { just } from '@instana/observables';

import ConfirmationDialog, { columnDefinitions } from 'in-synthetics/createLocation/steps/ConfirmationDialog';
// eslint-disable-next-line no-restricted-imports
import List from 'in-settings/components/List';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';

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
            locationLabel: 'us-west-1(NCalifornia)',
            status: 'Inactive'
          }
        ]
      })
    );

  it('Confirmation dialog button get rendered correctly', () => {
    render(
      <ConfirmationDialog
        header={'New Location'}
        headerIcon="lib_synthetic_location"
        buttonLabel={'Done'}
        buttonKind="primary"
        onSubmit={() => onClose()}
        form={form}
      />
    );

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

  it('Confirmation dialog > List gets rendered with correct data', () => {
    const { container } = render(
      <List<SyntheticDatacenter>
        getHeader={() => null}
        columnDefinitions={columnDefinitions}
        loadEntities={() =>
          just([
            {
              cityName: 'NVirginia',
              code: 'us-east-1',
              countryName: 'USA',
              label: 'us-east-1(NVirginia)',
              latitude: 70.11,
              longitude: 5.68,
              provider: 'aws',
              locationLabel: 'us-east-1(NVirginia)',
              status: 'Inactive',
              datacenterId: 'aws-us-east-1-NVirginia'
            }
          ])
        }
        renderNoDataAvailable={() => <NoDataAvailable />}
        isSearchable={false}
        pageSize={20}
        initialOrderBy="datacenter_code"
      />
    );
    expect(container.getElementsByTagName('th')[0]).toHaveTextContent('Datacenter code');
    expect(container.getElementsByTagName('th')[1]).toHaveTextContent('Datacenter name');
    expect(container.getElementsByTagName('th')[2]).toHaveTextContent('Location name');
    expect(container.getElementsByTagName('th')[3]).toHaveTextContent('Activation status');

    const confirmationColumns = container.getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0].children;

    expect(confirmationColumns.length).toBe(4);
    expect(confirmationColumns[0].textContent).toBe('us-east-1');
    expect(confirmationColumns[1].textContent).toBe('us-east-1(NVirginia)');
    expect(confirmationColumns[2].textContent).toBe('us-east-1(NVirginia)');
    expect(confirmationColumns[3].textContent).toBe('Pending');
  });

  it('Confirmation dialog > List renders NoDataAvailable component if no data is present', () => {
    const wrapper = mount(
      <List<SyntheticDatacenter>
        getHeader={() => null}
        columnDefinitions={columnDefinitions}
        loadEntities={() => just([])}
        renderNoDataAvailable={() => <NoDataAvailable />}
        isSearchable={false}
        pageSize={20}
        initialOrderBy="datacenter_code"
      />
    );

    expect(wrapper.containsMatchingElement(<NoDataAvailable />)).toBeTruthy();
  });
});
