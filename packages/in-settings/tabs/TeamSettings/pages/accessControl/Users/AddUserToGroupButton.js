import React from 'react';

import AddUserToGroupDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/AddUserToGroupDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { saveGroups } from 'in-settings/tabs/TeamSettings/api/groups';
import Button from 'in-new-components/Button';

export default function AddUserToGroupButton({ userId, setErrorMessage }) {
  return (
    <Button
      kind="action"
      onClick={() => {
        addActiveDialog(
          <AddUserToGroupDialog
            userId={userId}
            onSubmit={newGroupsToAdd => addUserToGroup(userId, newGroupsToAdd, setErrorMessage)}
          />
        );
      }}
      icon="lib_openclose_add_circle_outline"
    >
      Add to a group
    </Button>
  );
}

function addUserToGroup(userId, newGroupsToAdd, setErrorMessage) {
  const groupsWithUser = newGroupsToAdd.slice().map(group => {
    return {
      ...group,
      members: [...group.members, { userId }]
    };
  });

  const result$ = saveGroups(groupsWithUser);
  result$.once(
    () => {
      close();
    },
    error => {
      setErrorMessage(`Failed to add user to groups: ${error.message}`);
    }
  );
}
