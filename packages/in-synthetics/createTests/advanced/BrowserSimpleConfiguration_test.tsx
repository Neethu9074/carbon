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
    expect(screen.getByText('Webpage URL')).toBeInTheDocument();
    expect(screen.getByText('Timeout')).toBeInTheDocument();
    expect(screen.getByText('Retry Strategy')).toBeInTheDocument();
    expect(screen.getByText('Mark Synthetic Call')).toBeInTheDocument();
    expect(screen.getByText('Record video of user actions')).toBeInTheDocument();
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
    expect((screen.getByLabelText('minutes (m)') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('seconds (s)') as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText('milliseconds (ms)') as HTMLInputElement).checked).toBe(false);

    // Retry strategy
    expect((screen.getByLabelText('None') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Retry once') as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText('Retry twice') as HTMLInputElement).checked).toBe(false);

    // Mark Synthetic Call
    expect((screen.getByLabelText('Mark Synthetic Call') as HTMLInputElement).checked).toBe(true);

    // Record video of user actions
    expect((screen.getByLabelText('Record video of user actions') as HTMLInputElement).checked).toBe(false);
  });
});
