/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import CredentialListActionsColumn from 'in-synthetics/dashboards/global/tabs/credentials/components/CredentialListActionsColumn';

describe(CredentialListActionsColumn, () => {
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
    render(<CredentialListActionsColumn item={dummyCredentialData} />);
  });

  it('Should render actions column correctly', () => {
    render(<CredentialListActionsColumn item={dummyCredentialData} />);

    expect(screen.getByRole('button')).toBeTruthy();
    fireEvent.click(screen.getByRole('button'));
  });
});
