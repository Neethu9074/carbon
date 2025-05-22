/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import { createMapForm } from 'formalistic';
import React from 'react';

import { createAdvancedWebpageActionConfigurationForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import BrowserSimpleConfiguration from 'in-synthetics/createTests/advanced/BrowserSimpleConfiguration';
import { t } from 'in-i18n';

describe('BrowserSimpleConfiguration', () => {
  const form = createMapForm().put('configuration', createAdvancedWebpageActionConfigurationForm());
  const invalidTimeout = { invalid: false, message: '' };
  const updateForm = jest.fn();
  const setInvalidTimeout = jest.fn();

  it('Renders the Browser Simple configuration section correctly', () => {
    render(
      <BrowserSimpleConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    );
    expect(
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.webpageUrl'))
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
      screen.getByText(t('in-synthetics:dialog.createTest.advancedMode.configStep.markSyntheticCall'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-synthetics:dashboard.configuration.recordVideo'))).toBeInTheDocument();
  });

  it('Renders all new fields with their default values', () => {
    const { container } = render(
      <BrowserSimpleConfiguration
        form={form}
        updateForm={updateForm}
        invalidTimeout={invalidTimeout}
        setInvalidTimeout={setInvalidTimeout}
      />
    );

    const inputElements = container.getElementsByTagName('input');

    expect(inputElements.length).toBe(10);

    // Webpage URL
    expect(inputElements[0]).toHaveValue('');

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

    // Mark Synthetic Call
    expect(
      screen.getByLabelText(t('in-synthetics:dialog.createTest.advancedMode.configStep.markSyntheticCall'))
    ).toBeChecked();

    // Record video of user actions
    expect(screen.getByLabelText(t('in-synthetics:dashboard.configuration.recordVideo'))).not.toBeChecked();
  });
});
