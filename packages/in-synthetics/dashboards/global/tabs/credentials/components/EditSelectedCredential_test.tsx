/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import EditSelectedCredential from 'in-synthetics/dashboards/global/tabs/credentials/components/EditSelectedCredential';

jest.mock('in-services/featureFlags', () => ({
  rbacTeamsEnabled: true
}));

describe(EditSelectedCredential, () => {
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

  it('should render without crashing', () => {
    render(<EditSelectedCredential item={dummyCredentialData} />);
  });

  it('Should render the Edit Credential dialog correctly', () => {
    const { getByText, getAllByText } = render(<EditSelectedCredential item={dummyCredentialData} />);
    expect(getByText('Edit synthetic credential credTest')).toBeVisible();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Value')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Associations' })).toBeInTheDocument();
    expect(getByText('Application(s)')).toBeTruthy();
    expect(getByText('Website(s)')).toBeTruthy();
    expect(getByText('Mobile App(s)')).toBeTruthy();
    expect(getAllByText('Teams')).toHaveLength(2);
    expect(getByText('Choose Teams')).toBeTruthy();

    expect(screen.getByRole('button', { name: 'Select Applications' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select Applications' })).not.toBeDisabled();

    expect(screen.getByRole('button', { name: 'Select Websites' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select Websites' })).not.toBeDisabled();

    expect(screen.getByRole('button', { name: 'Select Mobile Apps' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select Mobile Apps' })).not.toBeDisabled();

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).not.toBeDisabled();
  });
});
