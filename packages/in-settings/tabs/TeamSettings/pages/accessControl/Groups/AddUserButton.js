import React from 'react';

import { iconColumn, labelColumn, roleColumn } from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import UserList from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import withSelectableItems from 'in-settings/components/withSelectableItems';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Dialog from 'in-new-components/Dialog/Dialog';
import { find } from 'in-services/arrayUtils';
import Button from 'in-new-components/Button';

import locals from './AddUserButton.mless';

export default function AddUserButton({ members, addUsers }) {
  return (
    <Button
      kind="action"
      onClick={() => {
        addActiveDialog(
          <AddUserDialog
            members={members}
            onSubmit={users => {
              addUsers(users);
              close();
            }}
          />
        );
      }}
      icon="lib_openclose_add_circle_outline"
    >
      Add User
    </Button>
  );
}

const AddUserDialog = withSelectableItems(function AddUserDialog({
  onSubmit,
  members,
  selectedEntities,
  checkIfSelected,
  toggleItem
}) {
  return (
    <Dialog className={locals.dialog} title="Invite user to group" onClose={close}>
      <form onSubmit={() => onSubmit(Array.from(selectedEntities.values()))}>
        <UserList
          pageSize={10}
          filterFunction={user => !find(members, member => member.userId === user.id)}
          onUserClick={user => toggleItem(user.id, user)}
          columnDefinitions={[
            {
              width: '2rem',
              getContent({ user }) {
                const isSelected = checkIfSelected(user.id);
                return <CheckboxFancy checked={isSelected} onChange={() => toggleItem(user.id, user)} />;
              }
            },
            iconColumn,
            labelColumn,
            roleColumn
          ]}
        />
        <Button className={locals.button} kind="primary" type="submit" disabled={selectedEntities.size === 0}>
          Add user to group
        </Button>
      </form>
    </Dialog>
  );
});
