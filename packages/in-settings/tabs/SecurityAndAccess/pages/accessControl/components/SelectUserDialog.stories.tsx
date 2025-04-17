/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import SelectUserDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/components/SelectUserDialog';
import { UserResult } from 'in-types';

export default {
  component: SelectUserDialog
};

export function DemoStory() {
  const amountUser = 100;
  const userList: Array<UserResult> = new Array(amountUser)
    .fill({
      id: '',
      email: '',
      fullName: '',
      lastLoggedIn: Date.now(),
      groupCount: 0,
      tfaEnabled: false
    })
    .map((user, index) => ({
      ...user,
      id: `${index}`,
      email: `foo.bar-${index}@example.com`,
      fullName: `Foo Bar ${index}`
    }));
  const preselectedUserIds = ['2', '3', '6'];
  return (
    <SelectUserDialog
      users={userList}
      // eslint-disable-next-line no-console
      onCancel={() => console.log('Dialog canceled')}
      // eslint-disable-next-line no-console
      onConfirm={selectedUserIds => console.log(`The following user IDs were selected:`, selectedUserIds)}
      preselectedIds={preselectedUserIds}
      modalHeading="Select users"
    />
  );
}
