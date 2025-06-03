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
import { syntheticSslImprovementEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

describe('SSLCertificateConfiguration', () => {
  const updateForm = jest.fn();
  const setInvalidTimeout = jest.fn();
  const invalidTimeout = { invalid: false, message: '' };
  const validationFilters = [
    {
      id: '123454',
      key: '',
      operator: '',
      value: '',
      error: {
        key: {
          invalid: false,
          message: ''
        },
        operator: {
          invalid: false,
          message: ''
        },
        value: {
          invalid: false,
          message: ''
        }
      },
      inValidResolutionRecord: false
    }
  ];
  const setValidationFilters = jest.fn();

  it('Renders the SSL Certificate configuration section correctly', () => {
    const form = createMapForm().put('configuration', createAdvancedSSLCertificateConfigurationForm());

    render(
      <SSLCertificateConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
        validationFilters={validationFilters}
        setValidationFilters={setValidationFilters}
      />
    );
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputHostName'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.inputPortNumber'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.certificateCheck.failureConfigLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.additionalOptionsSectionLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.acceptSelfSignedCertificate'))
    ).toBeInTheDocument();
  });

  it('Renders all new fields with their default values', () => {
    const form = createMapForm().put('configuration', createAdvancedSSLCertificateConfigurationForm());

    const { container } = render(
      <SSLCertificateConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
        validationFilters={validationFilters}
        setValidationFilters={setValidationFilters}
      />
    );
    expect(container.getElementsByTagName('input').length).toBe(syntheticSslImprovementEnabled ? 12 : 11);

    // Host Name
    expect(screen.getByTestId('host-name')).toHaveValue('');
    // Port
    expect(screen.getByTestId('port-number')).toHaveValue('443');

    // Days Remaining
    expect(screen.getByTestId('days-remaining')).toHaveValue('');

    // Timeout
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldOptionMinutes'))
    ).toBeChecked();
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldOptionSeconds'))
    ).not.toBeChecked();
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutFieldOptionMilliseconds'))
    ).not.toBeChecked();

    // Retry strategy
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldOptionNone'))
    ).toBeChecked();
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldOptionOnce'))
    ).not.toBeChecked();
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.retryFieldOptionTwice'))
    ).not.toBeChecked();
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
        .put(
          'acceptSelfSignedCertificate',
          createField({
            value: false
          })
        )
    );

    render(
      <SSLCertificateConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
        validationFilters={validationFilters}
        setValidationFilters={setValidationFilters}
      />
    );

    expect(screen.getByText(t('in-synthetics:dialog.createTest.validators.invalidHost'))).toBeInTheDocument();
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
        .put(
          'acceptSelfSignedCertificate',
          createField({
            value: false
          })
        )
    );

    render(
      <SSLCertificateConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
        validationFilters={validationFilters}
        setValidationFilters={setValidationFilters}
      />
    );
    expect(screen.getByText(t('in-synthetics:dialog.createTest.validators.invalidPortValue'))).toBeInTheDocument();
  });
});
