/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import AddUserToGroupDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/AddUserToGroupDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { saveGroups } from 'in-settings/tabs/TeamSettings/api/groups';
import Button from 'in-new-components/Button';

export default function AddUserToGroupButton({ userId, refresh, setErrorMessage }) {
  return (
    <Button
      kind="action"
      onClick={() => {
        addActiveDialog(
          <AddUserToGroupDialog
            userId={userId}
            onSubmit={newGroupsToAdd => addUserToGroup(userId, refresh, newGroupsToAdd, setErrorMessage)}
          />
        );
      }}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-settings:tabs.addToAGroup')}
    </Button>
  );
}

function addUserToGroup(userId, refresh, newGroupsToAdd, setErrorMessage) {
  const groupsWithUser = newGroupsToAdd.slice().map(group => {
    return {
      ...group,
      members: [...group.members, { userId }],
      permissions: [{ id: group.permissionSet.id, scope: 'TU' }]
    };
  });

  const result$ = saveGroups(groupsWithUser);
  result$.once(
    () => {
      if (refresh) {
        refresh();
      }
      close();
    },
    error => {
      setErrorMessage(t('in-settings:tabs.failedToAddUserToGroups', { err: error.message }));
    }
  );
}
