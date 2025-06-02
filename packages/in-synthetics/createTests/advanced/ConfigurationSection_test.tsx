/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createMapForm } from 'formalistic';
import React from 'react';

import { createAdvancedActionConfigurationForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import ConfigurationSection from 'in-synthetics/createTests/advanced/ConfigurationSection';
import { t } from 'in-i18n';

describe('ConfigurationSection', () => {
  const form = createMapForm().put('configuration', createAdvancedActionConfigurationForm());
  const headers = [
    {
      id: '12345',
      key: '',
      value: '',
      error: {
        name: { invalid: false, message: '' },
        value: { invalid: false, message: '' }
      }
    }
  ];
  const invalidHeader = { invalid: false, message: '' };
  const invalidTimeout = { invalid: false, message: '' };
  const invalidJSON = { invalid: false, message: '' };
  const isUpdateConfig = false;
  const updateForm = jest.fn();
  const setHeaders = jest.fn();
  const setInvalidHeader = jest.fn();
  const setInvalidTimeout = jest.fn();
  const setInvalidJSON = jest.fn();

  it('Renders the API Simple configuration section correctly', () => {
    render(
      <ConfigurationSection
        form={form}
        updateForm={updateForm}
        isUpdateConfig={isUpdateConfig}
        headers={headers}
        setHeaders={setHeaders}
        invalidHeader={invalidHeader}
        setInvalidHeader={setInvalidHeader}
        invalidJSON={invalidJSON}
        setInvalidJSON={setInvalidJSON}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    );

    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.operation'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-synthetics:dialog.createTest.requestStep.labelUrl'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.headerSectionLabel'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.header'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.addHeader'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.validationsSectionLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.validationString'))
    ).toBeInTheDocument();
    expect(
      screen.getByTitle(t('in-synthetics:dialog.createTest.advancedMode.configStep.expectStatusLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.addValidations'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.timeoutAndRetrySectionLabel'))
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
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.followRedirect'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.allowInsecure'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.markSyntheticCall'))
    ).toBeInTheDocument();
  });

  it('Renders all new fields with their default values', async () => {
    render(
      <ConfigurationSection
        form={form}
        updateForm={updateForm}
        isUpdateConfig={isUpdateConfig}
        headers={headers}
        setHeaders={setHeaders}
        invalidHeader={invalidHeader}
        setInvalidHeader={setInvalidHeader}
        invalidJSON={invalidJSON}
        setInvalidJSON={setInvalidJSON}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    );

    const inputElements = screen.getAllByRole('textbox');
    const selectElements = screen.getAllByRole('combobox');
    const radiobuttonElements = screen.getAllByRole('radio');
    const checkboxElements = screen.getAllByRole('checkbox');

    expect(inputElements.length).toBe(6);
    expect(selectElements.length).toBe(2);
    expect(radiobuttonElements.length).toBe(6);
    expect(checkboxElements.length).toBe(3);

    // Operation
    expect(selectElements[0]).toHaveValue('GET');

    // URL
    expect(inputElements[0]).toHaveValue('');

    // Header - Value
    expect(inputElements[1]).toHaveValue('');
    expect(inputElements[2]).toHaveValue('');
    expect(
      screen.getByRole('button', {
        name: t('in-synthetics:dialog.createTest.advancedMode.configStep.addHeader')
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: t('in-synthetics:dialog.createTest.advancedMode.configStep.addHeader')
      })
    ).not.toBeDisabled();

    // Validation String
    expect(inputElements[3]).toHaveValue('');

    // Expect Status/ Expect JSON/ Expect Match
    expect(selectElements[1]).toHaveValue('Expect status');
    expect(inputElements[4]).toHaveValue('200');

    await userEvent.click(selectElements[1]);
    await userEvent.click(
      screen.getByRole('option', { name: t('in-synthetics:dialog.createTest.advancedMode.configStep.expectJSONLabel') })
    );
    expect(selectElements[1]).toHaveValue('Expect JSON');

    await userEvent.click(selectElements[1]);
    await userEvent.click(
      screen.getByRole('option', {
        name: t('in-synthetics:dialog.createTest.advancedMode.configStep.expectMatchLabel')
      })
    );
    expect(selectElements[1]).toHaveValue('Expect match');
    expect(
      screen.getByRole('button', {
        name: t('in-synthetics:dialog.createTest.advancedMode.configStep.addValidations')
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: t('in-synthetics:dialog.createTest.advancedMode.configStep.addValidations')
      })
    ).not.toBeDisabled();

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

    // Follow Redirect
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.followRedirect'))
    ).toBeChecked();

    // Allow Insecure
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.allowInsecure'))
    ).toBeChecked();

    // Mark Synthetic Call
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.markSyntheticCall'))
    ).toBeChecked();
  });
});
