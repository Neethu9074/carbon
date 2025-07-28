/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import EditSelectedCredential from 'in-synthetics/dashboards/global/tabs/credentials/components/EditSelectedCredential';
import { getTagsResult } from 'in-settings/tabs/SecurityAndAccess/api/tags';
import { successObservable } from 'in-services/util/result';

jest.mock('in-services/featureFlags', () => ({
  rbacTeamsEnabled: true
}));

jest.mock('in-settings/tabs/SecurityAndAccess/api/tags', () => {
  return {
    getTagsResult: jest.fn()
  };
});

describe(EditSelectedCredential, () => {
  const rbacTags = [
    { id: 'iYtsNMPpShiyRkPF4trkUQ', displayName: 'Mate test' },
    { id: 'hSgNzPdzQn-kH16-U4trCw', displayName: 'Sample team' }
  ];
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
    modifiedAt: 1717620972843,
    rbacTags: []
  };

  it('should render without crashing', () => {
    render(<EditSelectedCredential item={dummyCredentialData} />);
  });

  it('Should render the Edit Credential dialog correctly', () => {
    (getTagsResult as jest.Mock).mockReturnValue(successObservable(rbacTags));

    const { getByText, getAllByText } = render(<EditSelectedCredential item={dummyCredentialData} />);
    expect(getByText('Edit synthetic credential credTest')).toBeVisible();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Value')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Associations' })).toBeInTheDocument();
    expect(getByText('Application(s)')).toBeTruthy();
    expect(getByText('Website(s)')).toBeTruthy();
    expect(getByText('Mobile App(s)')).toBeTruthy();
    expect(getAllByText('Teams')).toHaveLength(2);
    expect(getByText('Choose teams')).toBeTruthy();
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
