/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, ColumnizedContent, KeyValue, Ul, Li } from '@instana/components';

import {
  getEntityIdView,
  teamSettingsAccessControlGroups,
  teamSettingsAccessControlGroupNew
} from 'in-settings/navigation/paths';
import { ProductAreaPermissionMap } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/constants';
import { getGroupsAsResultObservable, deleteGroup } from 'in-settings/tabs/TeamSettings/api/groups';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import WithSubscript from 'in-settings/components/WithSubscript';
import { ownerRoleId, defaultRoleId } from 'in-stores/user';
import ApiList from 'in-settings/components/ApiList';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

export const groupNameDefault = 'Default';
export const groupNameOwner = 'Owner';

export default function Groups() {
  return (
    <>
      <Title title={t('in-settings:tabs.groups')} />
      <ApiList
        ListRenderer={ListRenderer}
        getItems={getGroupsAsResultObservable}
        deleteItem={deleteGroup}
        itemName="Group"
        searchFields={['name']}
        orderBy="name"
        renderAdditionalHeaderContent={AdditionalHeaderContent}
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

function AdditionalHeaderContent() {
  const { createHrefToPath } = useNavigation();
  return (
    <Button
      kind="action"
      href={createHrefToPath(teamSettingsAccessControlGroupNew)}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-settings:tabs.addGroup')}
    </Button>
  );
}

const columnDefinitions = [
  {
    getContent({ group }) {
      const isLimitedAccessGroup = () => {
        for (const [, { limitation }] of Object.entries(ProductAreaPermissionMap)) {
          if (limitation && group.permissionSet.permissions?.includes(limitation)) return true;
        }
        return false;
      };
      return (
        <WithSubscript subscript={isLimitedAccessGroup() ? t('in-settings:tabs.limitedAccess') : null}>
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
      const isDefaultOrOwnerGroup = group.name === groupNameDefault || group.name === groupNameOwner;
      const tooltipContent = isDefaultOrOwnerGroup
        ? t('in-settings:tabs.groupDeleteTooltip', { context: group.name })
        : undefined;

      return (
        <Delete
          disabled={isDisabled}
          itemName={group.name}
          tooltipContent={tooltipContent}
          doDelete={() => deleteItem(group.id)}
          isDeleting={currentDeletingItemIds.has(group.id)}
        />
      );
    }
  }
];
