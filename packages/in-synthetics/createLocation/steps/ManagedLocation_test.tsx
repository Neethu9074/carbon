/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { mount } from 'enzyme';
import React from 'react';

import { just } from '@instana/observables';

import createNewLocationForm from 'in-synthetics/createLocation/createNewLocationForm';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import ManagedLocation from 'in-synthetics/createLocation/steps/ManagedLocation';
import { t } from 'in-i18n';

describe('ManagedLocation', () => {
  const updateForm = jest.fn();

  it('Renders ManagedLocation component correctly', () => {
    const { container } = render(
      <ManagedLocation form={createNewLocationForm('managed')} datacenters={just([])} updateForm={updateForm} />
    );

    expect(screen.getByText('Datacenters')).toBeInTheDocument();

    const linkElement = screen.getByText('Using an Instana-hosted PoP');
    expect(linkElement.getAttribute('href')).toBe('https://ibm.biz/Instana-hosted_PoP');

    expect(container.getElementsByTagName('th').length).toBe(5);
    expect(container.getElementsByTagName('th')[0]).toHaveTextContent('Datacenter code');
    expect(container.getElementsByTagName('th')[1]).toHaveTextContent('Datacenter name');
    expect(container.getElementsByTagName('th')[2]).toHaveTextContent('Provider');
    expect(container.getElementsByTagName('th')[3]).toHaveTextContent('Location name');
    expect(container.getElementsByTagName('th')[4]).toHaveTextContent('Activation status');
  });

  test('renders NoDataAvailable component if no datacenters are present', () => {
    const wrapper = mount(
      <ManagedLocation form={createNewLocationForm('managed')} datacenters={just([])} updateForm={updateForm} />
    );

    expect(
      wrapper.containsMatchingElement(
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.locationList.noDataAvailable.message', { component: 'Datacenters' })}
        />
      )
    ).toBeTruthy();
  });

  test('renders the content component if no datacenters are present', () => {
    const { container } = render(
      <ManagedLocation
        form={createNewLocationForm('managed')}
        datacenters={just([
          // {
          //   code: 'us-west-1',
          //   label: 'us-west-1(NCalifornia)',
          //   provider: 'aws',
          //   countryName: 'USA',
          //   cityName: 'NCalifornia',
          //   latitude: 50.11,
          //   longitude: 8.68,
          //   status: 'Active',
          //   datacenterId: 'aws-us-west-1-NCalifornia',
          //   locationLabel: 'us-west-1(NCalifornia)',
          //   customProperties: 'typeFlag=INSTANA_HOSTED_SYNTHETIC_POP;datacenterFlag=aws-us-west-1-NCalifornia',
          //   modifiedAt: 1708491964280
          // }
        ])}
        updateForm={updateForm}
      />
    );

    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
    const trElements = container.querySelector('tr');
    expect(trElements).toBeInTheDocument();
  });

  test('checkbox should be enabled for datacenters with status as Inactive', () => {
    render(
      <ManagedLocation
        form={createNewLocationForm('managed')}
        datacenters={just([
          {
            code: 'us-west-1',
            label: 'us-west-1(NCalifornia)',
            provider: 'aws',
            countryName: 'USA',
            cityName: 'NCalifornia',
            latitude: 50.11,
            longitude: 8.68,
            status: 'Inactive',
            datacenterId: 'aws-us-west-1-NCalifornia',
            locationLabel: 'us-west-1(NCalifornia)',
            customProperties: 'typeFlag=INSTANA_HOSTED_SYNTHETIC_POP;datacenterFlag=aws-us-west-1-NCalifornia',
            modifiedAt: 1708491964280
          }
        ])}
        updateForm={updateForm}
      />
    );

    const checkboxElement = screen.getByLabelText('us-west-1') as HTMLInputElement;

    expect(checkboxElement.checked).toBe(false);
    fireEvent.change(checkboxElement);
    expect(checkboxElement).not.toBeDisabled();
  });

  test('checkbox should be disabled for datacenters with status as Active', () => {
    render(
      <ManagedLocation
        form={createNewLocationForm('managed')}
        datacenters={just([
          {
            code: 'us-west-1',
            label: 'us-west-1(NCalifornia)',
            provider: 'aws',
            countryName: 'USA',
            cityName: 'NCalifornia',
            latitude: 50.11,
            longitude: 8.68,
            status: 'Active',
            datacenterId: 'aws-us-west-1-NCalifornia',
            locationLabel: 'us-west-1(NCalifornia)',
            customProperties: 'typeFlag=INSTANA_HOSTED_SYNTHETIC_POP;datacenterFlag=aws-us-west-1-NCalifornia',
            modifiedAt: 1708491964280
          }
        ])}
        updateForm={updateForm}
      />
    );

    const checkboxElement = screen.getByLabelText('us-west-1') as HTMLInputElement;
    expect(checkboxElement.checked).toBe(false);
    expect(checkboxElement).toBeDisabled();
  });
});
