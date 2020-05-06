import React from 'react';

import AddUserToGroupButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/AddUserToGroupButton';
import { getGroupsAsResultObservable, saveGroup } from 'in-settings/tabs/TeamSettings/api/groups';
import { getEntityIdView, teamSettingsAccessControlTeams } from 'in-settings/navigation/paths';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import createApiList from 'in-settings/components/ApiList';
import KeyValue from 'in-new-components/lists/KeyValue';

const GroupList = createApiList({
  ListRenderer,
  getItems: getGroupsAsResultObservable,
  itemName: 'group',
  orderBy: 'name',
  renderAdditionalHeaderContent
});

export default function Groups({ userId }) {
  return (
    <GroupList
      userId={userId}
      filterFunction={({ members }) => {
        for (let i = 0; i < members.length; i++) {
          if (userId === members[i].userId) {
            return true;
          }
        }
        return false;
      }}
    />
  );
}

const columnDefinitions = [
  {
    getContent({ group }) {
      return group.name;
    }
  },
  {
    width: '8rem',
    getContent({ group }) {
      return <KeyValue value={group.members.length} label="Members" accentuated />;
    }
  },
  {
    width: '8rem',
    getContent({ group }) {
      return <KeyValue value={group.permissions.length} label="Permissions" accentuated />;
    }
  },
  {
    width: '2rem',
    getContent({ group, deleteItem, currentDeletingItemIds }) {
      return <Delete itemName={group.name} doDelete={deleteItem} isDeleting={currentDeletingItemIds.has(group.id)} />;
    }
  }
];

function ListRenderer({ items, userId, setErrorMessage, currentDeletingItemIds }) {
  return (
    <Ul>
      {items.map(group => (
        <Li key={group.id} href$={getEntityIdView(teamSettingsAccessControlTeams, group.id)}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            group={group}
            deleteItem={() => removeUserFromGroup(userId, group, setErrorMessage)}
            currentDeletingItemIds={currentDeletingItemIds}
          />
        </Li>
      ))}
    </Ul>
  );
}

function removeUserFromGroup(_userId, group, setErrorMessage) {
  const groupWithoutUser = {
    ...group,
    members: group.members.filter(({ userId }) => userId !== _userId)
  };
  const result$ = saveGroup(groupWithoutUser);
  result$.once(
    () => {},
    error => {
      setErrorMessage(`Failed to remove user from group: ${error.message}`);
    }
  );
}

function renderAdditionalHeaderContent({ userId, setErrorMessage }) {
  return <AddUserToGroupButton userId={userId} setErrorMessage={setErrorMessage} />;
}
