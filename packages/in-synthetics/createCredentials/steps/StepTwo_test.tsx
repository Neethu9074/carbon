/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import createCredentialForm from 'in-synthetics/createCredentials/createCredentialForm';
import StepTwo from 'in-synthetics/createCredentials/steps/StepTwo';

describe(StepTwo, () => {
  const updateForm = jest.fn();
  const setSliderState = jest.fn();

  it('should render without crashing', () => {
    render(<StepTwo form={createCredentialForm([])} updateForm={updateForm} setSliderState={setSliderState} />);
  });

  it('should display Associations section correctly', () => {
    render(<StepTwo form={createCredentialForm([])} updateForm={updateForm} setSliderState={setSliderState} />);

    expect(
      screen.getByText(
        'Associating a credential with an application, website or mobile app grants access rights to all users who have access to those entities.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Application(s)')).toBeTruthy();
    expect(screen.getByText('Website(s)')).toBeTruthy();
    expect(screen.getByText('Mobile App(s)')).toBeTruthy();

    expect(screen.getByRole('button', { name: 'Select Applications' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select Applications' })).not.toBeDisabled();

    expect(screen.getByRole('button', { name: 'Select Websites' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select Websites' })).not.toBeDisabled();

    expect(screen.getByRole('button', { name: 'Select Mobile Apps' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select Mobile Apps' })).not.toBeDisabled();
  });
});
