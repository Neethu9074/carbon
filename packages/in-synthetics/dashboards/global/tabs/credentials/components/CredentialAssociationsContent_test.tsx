/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import CredentialAssociationsContent from 'in-synthetics/dashboards/global/tabs/credentials/components/CredentialAssociationsContent';

describe(CredentialAssociationsContent, () => {
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

  const credentialDataWithAssociations = {
    credentialName: 'credTest',
    credentialValue: '',
    applicationLabels: ['app1', 'app2'],
    applications: ['f4KX5zd8RW2pERKKFUCZgQ', 'j5SX5zd8RW2pERKKFUCZgQ'],
    websiteLabels: ['web1', 'web2'],
    websites: ['j5SX5zd8MK2pERKKFUCZgQ', 'p4KX5zd8RW2pERKKFUCZgQ'],
    mobileAppLabels: ['mobApp1', 'mobApp2'],
    mobileApps: ['s7SX5zd8MK2pERKKFUCZgQ', 'g4KX5zd8RW2pERKKFUCZgQ'],
    createdAt: 1717620972843,
    modifiedAt: 1717620972843
  };

  it('should render without crashing', () => {
    render(<CredentialAssociationsContent item={dummyCredentialData} />);
  });

  it('Should not render an overlay if there are no associations', () => {
    const { getByTestId } = render(<CredentialAssociationsContent item={dummyCredentialData} />);
    expect(getByTestId('noAssociations')).not.toBeNull();
  });

  it('Should render an overlay with 6 Associations', () => {
    const { getByText } = render(<CredentialAssociationsContent item={credentialDataWithAssociations} />);
    expect(getByText('6 Associations')).toBeTruthy();
  });
});
