/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import EditCredentialInputs from 'in-synthetics/dashboards/global/tabs/credentials/components/EditCredentialInputs';
import editCredentialForm from 'in-synthetics/dashboards/global/tabs/credentials/components/editCredentialForm';

describe(EditCredentialInputs, () => {
  const dummyCredentialData = {
    credentialName: 'credTest',
    credentialValue: '',
    applicationLabels: [],
    applications: [],
    websiteLabels: [],
    websites: [],
    mobileAppLabels: [],
    mobileApps: [],
    createdAt: 1717620972843,
    modifiedAt: 1717620972843
  };
  const updateForm = jest.fn();

  it('should render without crashing', () => {
    render(<EditCredentialInputs form={editCredentialForm(dummyCredentialData)} updateForm={updateForm} />);
  });

  it('Should render EditCredentialInputs correctly', () => {
    render(<EditCredentialInputs form={editCredentialForm(dummyCredentialData)} updateForm={updateForm} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Value')).toBeInTheDocument();

    expect(screen.getByTitle('Credential name')).toBeInTheDocument();
    expect(screen.getByTitle('Credential name')).toHaveValue('credTest');
    expect(screen.getByTitle('Credential name')).toHaveAttribute('readonly');

    expect(screen.getByText('Credential name cannot be edited, is a readOnly field')).toBeTruthy();
    expect(screen.getByText('Type a new credential value if you want to update the current one.')).toBeTruthy();

    expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
    expect(document.querySelector('input[type="password"]')).toHaveValue('');
  });
});
