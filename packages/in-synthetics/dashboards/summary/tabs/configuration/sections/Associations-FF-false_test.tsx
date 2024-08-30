/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { SyntheticTest } from '@instana/types';

import Associations from 'in-synthetics/dashboards/summary/tabs/configuration/sections/Associations';

jest.mock('in-services/featureFlags', () => ({
  get syntheticRbacLimitedEnabled() {
    return false;
  }
}));

describe('Associations', () => {
  it('should render Associations section of configuration tab correctly for zero associated applications', () => {
    const dummyTestData = {
      active: true,
      configuration: {
        markSyntheticCall: true,
        retries: 0,
        retryInterval: 1,
        script: 'console.log("test")',
        scriptType: 'Basic',
        syntheticType: 'HTTPScript',
        timeout: ''
      },
      createdAt: 1709044605983,
      CustomProperties: {},
      id: 'DMUWQKzHVhHZeuCK3lr0',
      label: 'basic-auth-request',
      locationDisplayLabels: ['pop-pink-rel'],
      locationLabels: ['pop-pink-rel'],
      locations: ['LB1JQo6Mn4J6OttBa2Wj'],
      modifiedAt: 1721030178074,
      modifiedBy: 'Internal',
      playbackMode: 'Simultaneous',
      tenantId: 'saas_instana_test',
      testFrequency: 3
    } as unknown as SyntheticTest;
    render(<Associations test={dummyTestData} />);
    expect(screen.getByText('Associations')).toBeInTheDocument();
    expect(screen.getByText('Associated Applications')).toBeInTheDocument();
    expect(screen.getByText('No Applications associated')).toBeInTheDocument();
  });
  it('should render Associations section of configuration tab correctly for one or more associated applications', () => {
    const dummyTestData = {
      active: true,
      applicationId: 'oNh8Fi8gSTajU2z8_rmQBg',
      applicationLabel: 'testing - demofilter',
      applicationLabels: ['testing - demofilter'],
      applications: ['oNh8Fi8gSTajU2z8_rmQBg'],
      configuration: {
        markSyntheticCall: true,
        retries: 0,
        retryInterval: 1,
        script: 'console.log("test")',
        scriptType: 'Basic',
        syntheticType: 'HTTPScript',
        timeout: ''
      },
      createdAt: 1709044605983,
      CustomProperties: {},
      id: 'DMUWQKzHVhHZeuCK3lr0',
      label: 'basic-auth-request',
      locationDisplayLabels: ['pop-pink-rel'],
      locationLabels: ['pop-pink-rel'],
      locations: ['LB1JQo6Mn4J6OttBa2Wj'],
      modifiedAt: 1721030178074,
      modifiedBy: 'Internal',
      playbackMode: 'Simultaneous',
      tenantId: 'saas_instana_test',
      testFrequency: 3
    } as unknown as SyntheticTest;
    render(<Associations test={dummyTestData} />);
    expect(screen.getByText('Associations')).toBeInTheDocument();
    expect(screen.getByText('Associated Applications')).toBeInTheDocument();
    expect(screen.getByText('testing - demofilter')).toBeInTheDocument();
  });
});
