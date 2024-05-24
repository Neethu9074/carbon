/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm } from 'formalistic';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { createAdvancedSSLCertificateConfigurationForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import { checkForInvalidHost, checkForInvalidPort } from 'in-synthetics/createTests/validators/urlValidator';
import SSLCertificateConfiguration from 'in-synthetics/createTests/advanced/SSLCertificateConfiguration';

describe('SSLCertificateConfiguration', () => {
  const updateForm = jest.fn();
  const setInvalidTimeout = jest.fn();
  const invalidTimeout = { invalid: false, message: '' };

  it('Renders the SSL Certificate configuration section correctly', () => {
    const form = createMapForm().put('configuration', createAdvancedSSLCertificateConfigurationForm());

    render(
      <SSLCertificateConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    );
    expect(screen.getByText('Host Name')).toBeInTheDocument();
    expect(screen.getByText('Port')).toBeInTheDocument();
    expect(screen.getByText('Failure Configuration')).toBeInTheDocument();
    expect(screen.getByText('Timeout')).toBeInTheDocument();
    expect(screen.getByText('Retry Strategy')).toBeInTheDocument();
  });

  it('Renders all new fields with their default values', () => {
    const form = createMapForm().put('configuration', createAdvancedSSLCertificateConfigurationForm());

    const { container } = render(
      <SSLCertificateConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    );
    expect(container.getElementsByTagName('input').length).toBe(10);
    // Host Name
    expect(screen.getByTestId('host-name')).toHaveValue('');
    // Port
    expect(screen.getByTestId('port-number')).toHaveValue('443');

    // Days Remaining
    expect(screen.getByTestId('days-remaining')).toHaveValue('');

    // Timeout
    expect((screen.getByLabelText('minutes (m)') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('seconds (s)') as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText('milliseconds (ms)') as HTMLInputElement).checked).toBe(false);

    // Retry strategy
    expect((screen.getByLabelText('None') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Retry once') as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText('Retry twice') as HTMLInputElement).checked).toBe(false);
  });

  it('Displays validation error for invalid host name', () => {
    const form = createMapForm().put(
      'configuration',
      createMapForm()
        .put(
          'syntheticType',
          createField({
            value: 'SSLCertificate'
          })
        )
        .put(
          'hostname',
          createField({
            value: 'https://www.ibm.com',
            validator: checkForInvalidHost,
            touched: true
          })
        )
        .put(
          'port',
          createField({
            value: 443
          })
        )
        .put(
          'daysRemainingCheck',
          createField({
            value: ''
          })
        )
        .put(
          'timeout',
          createField({
            value: '0m'
          })
        )
        .put(
          'retries',
          createField({
            value: 0
          })
        )
        .put(
          'markSyntheticCall',
          createField({
            value: true
          })
        )
    );

    render(
      <SSLCertificateConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    );

    expect(screen.getByText('Host format not valid')).toBeInTheDocument();
  });

  it('Displays validation error for invalid port', () => {
    const form = createMapForm().put(
      'configuration',
      createMapForm()
        .put(
          'syntheticType',
          createField({
            value: 'SSLCertificate'
          })
        )
        .put(
          'hostname',
          createField({
            value: ''
          })
        )
        .put(
          'port',
          createField({
            value: 44311111,
            validator: checkForInvalidPort,
            touched: true
          })
        )
        .put(
          'daysRemainingCheck',
          createField({
            value: ''
          })
        )
        .put(
          'timeout',
          createField({
            value: '0m'
          })
        )
        .put(
          'retries',
          createField({
            value: 0
          })
        )
        .put(
          'markSyntheticCall',
          createField({
            value: true
          })
        )
    );

    render(
      <SSLCertificateConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    );
    expect(screen.getByText('Port value not valid')).toBeInTheDocument();
  });
});
