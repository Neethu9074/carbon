/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CloudfoundryApplicationLink } from '@instana/types';

import { InstanaServiceToCloudfoundryApplicationButtonPresenter } from 'in-cloudfoundry/commonComponents/InstanaServiceToCloudfoundryApplicationButton';

export default {
  component: InstanaServiceToCloudfoundryApplicationButtonPresenter
};
export const Empty = () => {
  return <InstanaServiceToCloudfoundryApplicationButtonPresenter pcfApplications={[]} />;
};
export const Default = () => {
  const pcfApplications: CloudfoundryApplicationLink[] = [
    {
      // Empty name and guid filtered out
      name: '',
      guid: '',
      organization: '',
      space: 'space1',
      snapshotId: 'snap1',
      entityHealthInfo: { maxSeverity: 0, openIssues: [] }
    },
    {
      name: 'TestName1',
      guid: 'guid1',
      organization: 'Org1',
      space: 'space1',
      snapshotId: 'snap1',
      entityHealthInfo: { maxSeverity: 0, openIssues: [] }
    },
    {
      name: 'TestName2',
      guid: 'guid2',
      organization: 'Org2',
      space: 'space2',
      snapshotId: 'snap2',
      entityHealthInfo: { maxSeverity: 3, openIssues: [] }
    },
    {
      //Identical one should be filtered out by set
      name: 'TestName2',
      guid: 'guid2',
      organization: 'Org2',
      space: 'space2',
      snapshotId: 'snap2',
      entityHealthInfo: { maxSeverity: 3, openIssues: [] }
    }
  ];
  return <InstanaServiceToCloudfoundryApplicationButtonPresenter pcfApplications={pcfApplications} />;
};
