/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action } from '@storybook/addon-actions';
import React from 'react';

import SharingDialogPresenter from 'in-custom-dashboards/CustomDashboard/SharingDialog/SharingDialogPresenter';
import { finishedProgress } from 'in-services/fixedObjects';

export default {
  component: SharingDialogPresenter
};

export const Default = {
  render: () => <SharingDialogPresenter isPrivate setPrivate={action('setPrivate')} />,
  name: 'default'
};

export const PublicModeLoading = {
  render: () => <SharingDialogPresenter isPrivate={false} setPrivate={action('setPrivate')} />,
  name: 'public mode – loading'
};

export const PublicModeWithUsers = {
  render: () => (
    <SharingDialogPresenter
      accessRules={[]}
      isPrivate={false}
      setPrivate={action('setPrivate')}
      setSelectedUserId={action('setSelectedUserId')}
      addEditor={action('addEditor')}
      usersResult={{
        progress: finishedProgress,
        errors: [],

        data: [
          {
            id: '5e3d3905e6f8790001a55c58',
            email: 'mikel@4rtstudio.com',
            fullName: 'Mikel Pascual',
            roleId: '-1'
          },
          {
            id: '5e5788a950c353000131ae0c',
            email: 'stepan.herold@gmail.com',
            fullName: 'Stepan Herold',
            roleId: '-1'
          },
          {
            id: '5e610e9d18c22a00019f6d75',
            email: 'doerte+edgetest@instana.com',
            fullName: 'Stefan Staudenmeyer',
            roleId: '-3'
          },
          {
            id: '5e64b64eb40479000135ad2b',
            email: 'fabian.lange@instana.com',
            fullName: 'Fabian Lange',
            roleId: '-3'
          },
          {
            id: '5e6615b1b40479000135ad2d',
            email: 'ben@instana.com',
            fullName: 'Benjamin Blackmore',
            roleId: '-1'
          },
          {
            id: '5e6b7f0ec193450001c22256',
            email: 'bripkens@gmail.com',
            fullName: 'Ben Blackmore',
            roleId: '-1'
          }
        ]
      }}
    />
  ),

  name: 'public mode – with users'
};
