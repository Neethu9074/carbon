/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import DeleteSelectedCredential from 'in-synthetics/dashboards/global/tabs/credentials/components/DeleteSelectedCredential';

describe(DeleteSelectedCredential, () => {
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
    render(<DeleteSelectedCredential item={dummyCredentialData} />);
  });

  it('Should render the Delete Credential dialog correctly', () => {
    const { getByText } = render(<DeleteSelectedCredential item={dummyCredentialData} />);
    expect(getByText('Delete synthetic credential credTest')).toBeVisible();
    expect(
      getByText('Enter the credentials full name to confirm deletion. This action cannot be undone.')
    ).toBeVisible();

    expect(getByText('Cancel')).toBeVisible();
    expect(getByText('Delete credential')).toBeVisible();
  });

  it('Should enable Delete Credential button only if correct Credential Name is entered', () => {
    const { getByText } = render(<DeleteSelectedCredential item={dummyCredentialData} />);
    expect(getByText('Delete synthetic credential credTest')).toBeVisible();
    expect(
      getByText('Enter the credentials full name to confirm deletion. This action cannot be undone.')
    ).toBeVisible();

    expect(getByText('Cancel')).toBeVisible();
    expect(screen.getByText('Delete credential')).toBeDisabled();

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');

    fireEvent.change(input, { target: { value: 'credTest' } });
    expect(screen.getByText('Delete credential')).not.toBeDisabled();

    fireEvent.change(input, { target: { value: 'credTest123' } });
    expect(screen.getByText('Delete credential')).toBeDisabled();
  });
});
