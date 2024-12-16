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

    expect(screen.getByText('Operation')).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Add Header')).toBeInTheDocument();
    expect(screen.getByText('Validation String')).toBeInTheDocument();
    expect(screen.getByTitle('Expect Status')).toBeInTheDocument();
    expect(screen.getByText('Add Validation')).toBeInTheDocument();
    expect(screen.getByText('Timeout')).toBeInTheDocument();
    expect(screen.getByText('Retry Strategy')).toBeInTheDocument();
    expect(screen.getByText('Follow Redirect')).toBeInTheDocument();
    expect(screen.getByText('Allow Insecure')).toBeInTheDocument();
    expect(screen.getByText('Mark Synthetic Call')).toBeInTheDocument();
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
        name: 'Add Header'
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: 'Add Header'
      })
    ).not.toBeDisabled();

    // Validation String
    expect(inputElements[3]).toHaveValue('');

    // Expect Status/ Expect JSON/ Expect Match
    expect(selectElements[1]).toHaveValue('Expect Status');
    expect(inputElements[4]).toHaveValue('200');

    await userEvent.click(selectElements[1]);
    await userEvent.click(screen.getByRole('option', { name: 'Expect JSON' }));
    expect(selectElements[1]).toHaveValue('Expect JSON');

    await userEvent.click(selectElements[1]);
    await userEvent.click(screen.getByRole('option', { name: 'Expect Match' }));
    expect(selectElements[1]).toHaveValue('Expect Match');
    expect(
      screen.getByRole('button', {
        name: 'Add Validation'
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: 'Add Validation'
      })
    ).not.toBeDisabled();

    // Timeout
    expect((screen.getByLabelText('minutes (m)') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('seconds (s)') as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText('milliseconds (ms)') as HTMLInputElement).checked).toBe(false);

    // Retry strategy
    expect((screen.getByLabelText('None') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Retry once') as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText('Retry twice') as HTMLInputElement).checked).toBe(false);

    // Follow Redirect
    expect((screen.getByLabelText('Follow Redirect') as HTMLInputElement).checked).toBe(true);

    // Allow Insecure
    expect((screen.getByLabelText('Allow Insecure') as HTMLInputElement).checked).toBe(true);

    // Mark Synthetic Call
    expect((screen.getByLabelText('Mark Synthetic Call') as HTMLInputElement).checked).toBe(true);
  });
});
