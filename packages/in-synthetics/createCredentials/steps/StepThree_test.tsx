/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import createCredentialForm from 'in-synthetics/createCredentials/createCredentialForm';
import StepThree from 'in-synthetics/createCredentials/steps/StepThree';
import { t } from 'in-i18n';

describe(StepThree, () => {
  const updateForm = jest.fn();

  it('should render without crashing', () => {
    render(<StepThree form={createCredentialForm([])} updateForm={updateForm} />);
  });

  it('should display Associations section correctly', () => {
    render(<StepThree form={createCredentialForm([])} updateForm={updateForm} />);

    expect(screen.getByText(t('in-synthetics:dialog.createCredential.steps.teamsStepDescription'))).toBeInTheDocument();

    expect(screen.getByText('Choose Teams')).toBeTruthy();

    expect(screen.getByRole('combobox', { name: 'Teams' })).toBeInTheDocument();
  });
});
