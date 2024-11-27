/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import createCredentialForm from 'in-synthetics/createCredentials/createCredentialForm';
import StepOne from 'in-synthetics/createCredentials/steps/StepOne';

describe(StepOne, () => {
  const updateForm = jest.fn();

  it('should render without crashing', () => {
    render(<StepOne form={createCredentialForm([])} updateForm={updateForm} />);
  });

  it('should display Name and Value field correctly', () => {
    render(<StepOne form={createCredentialForm([])} updateForm={updateForm} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Value')).toBeInTheDocument();

    expect(screen.getByTitle('Credential name')).toBeInTheDocument();
    expect(screen.getByTitle('Credential name')).toHaveValue('');

    const valueField = document.querySelector('input[placeholder="Credential value"]');
    expect(valueField).toBeInTheDocument();
    expect(valueField).toHaveValue('');
  });

  it('should display tooltip messages for Value field', () => {
    render(<StepOne form={createCredentialForm([])} updateForm={updateForm} />);

    expect(screen.getByText('Hide credential value')).toBeVisible();
  });
});
