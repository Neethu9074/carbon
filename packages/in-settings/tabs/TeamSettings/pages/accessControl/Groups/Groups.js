import React from 'react';

import {
  getEntityIdView,
  teamSettingsAccessControlGroups,
  teamSettingsAccessControlGroupNew
} from 'in-settings/navigation/paths';
import { getGroupsAsResultObservable, deleteGroup } from 'in-settings/tabs/TeamSettings/api/groups';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import WithSubscript from 'in-settings/components/WithSubscript';
import { ownerRoleId, defaultRoleId } from 'in-stores/user';
import createApiList from 'in-settings/components/ApiList';
import { getView } from 'in-stores/navigation/navigation';
import { RESTRICTED_ACCESS } from 'in-stores/permission';
import KeyValue from 'in-new-components/lists/KeyValue';
import Button from 'in-new-components/Button';
import Title from 'in-components/Title/Title';

const GroupsList = createApiList({
  ListRenderer,
  getItems: getGroupsAsResultObservable,
  deleteItem: deleteGroup,
  itemName: 'group',
  searchFields: ['name'],
  orderBy: 'name',
  renderAdditionalHeaderContent,
  boundedPath: '/groups'
});

export default function Groups() {
  return (
    <>
      <Title title="Groups" />
      <GroupsList />
    </>
  );
}

function ListRenderer({ items, deleteItem, currentDeletingItemIds }) {
  return (
    <Ul>
      {items.map(group => (
        <Li key={group.id} href$={getEntityIdView(teamSettingsAccessControlGroups, group.id)}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            group={group}
            currentDeletingItemIds={currentDeletingItemIds}
            deleteItem={deleteItem}
            isDisabled={group.id === ownerRoleId || group.id === defaultRoleId}
          />
        </Li>
      ))}
    </Ul>
  );
}

function renderAdditionalHeaderContent() {
  return (
    <Button kind="action" href$={getView(teamSettingsAccessControlGroupNew)} icon="lib_openclose_add_circle_outline">
      Add Group
    </Button>
  );
}

const columnDefinitions = [
  {
    getContent({ group }) {
      return (
        <WithSubscript
          subscript={group.permissionSet.permissions?.includes(RESTRICTED_ACCESS) ? 'Limited Access' : null}
        >
          {group.name}
        </WithSubscript>
      );
    }
  },
  {
    width: '8rem',
    getContent({ group }) {
      return <KeyValue value={group.members.length} label="Users" accentuated />;
    }
  },
  {
    width: '2rem',
    getContent({ group, deleteItem, currentDeletingItemIds, isDisabled }) {
      return (
        <Delete
          disabled={isDisabled}
          itemName={group.name}
          doDelete={() => deleteItem(group.id)}
          isDeleting={currentDeletingItemIds.has(group.id)}
        />
      );
    }
  }
];
