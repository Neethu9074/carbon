/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
import { getView } from 'in-stores/navigation/navigation';
import { RESTRICTED_ACCESS } from 'in-stores/permission';
import KeyValue from 'in-new-components/lists/KeyValue';
import ApiList from 'in-settings/components/ApiList';
import Button from 'in-new-components/Button';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

export default function Groups() {
  return (
    <>
      <Title title={t('in-settings:tabs.groups')} />
      <ApiList
        ListRenderer={ListRenderer}
        getItems={getGroupsAsResultObservable}
        deleteItem={deleteGroup}
        itemName={t('in-settings:teamSettings.accessControl.groups.itemName')}
        searchFields={['name']}
        orderBy="name"
        renderAdditionalHeaderContent={renderAdditionalHeaderContent}
        boundedPath="/groups"
      />
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
      {t('in-settings:tabs.addGroup')}
    </Button>
  );
}

const columnDefinitions = [
  {
    getContent({ group }) {
      return (
        <WithSubscript
          subscript={
            group.permissionSet.permissions?.includes(RESTRICTED_ACCESS) ? t('in-settings:tabs.limitedAccess') : null
          }
        >
          {group.name}
        </WithSubscript>
      );
    }
  },
  {
    width: '8rem',
    getContent({ group }) {
      return <KeyValue value={group.members.length} label={t('in-settings:tabs.users')} accentuated />;
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
