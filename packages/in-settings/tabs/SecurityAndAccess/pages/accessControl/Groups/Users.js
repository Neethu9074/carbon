/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import UserList, {
  iconColumn,
  labelColumn,
  idpGroupColumn
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/UserList';
import AddUserButton from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/AddUserButton';
import { getEntityIdView, securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { find } from 'in-services/arrayUtils';

const columnDefinition = [iconColumn, labelColumn, idpGroupColumn];

export default function Users({ members, addUsers, removeUser, groupId, noDelete = false }) {
  const { createHrefToPath } = useNavigation();
  function renderAdditionalHeaderContent({ addUsers, members }) {
    return <AddUserButton addUsers={addUsers} members={members} groupId={groupId} />;
  }
  const columnDefinitionWithDelete = [
    ...columnDefinition,
    {
      width: '2rem',
      getContent({ user: { id: userId, fullName } }) {
        return <Delete skipDialog doDelete={() => removeUser(userId, fullName)} />;
      }
    }
  ];

  return (
    <UserList
      renderer={ListInsideACardRenderer}
      filterFunction={user => find(members, member => member.userId === user.id)}
      renderAdditionalHeaderContent={renderAdditionalHeaderContent}
      getUserLink={user => getEntityIdView(securityAndAccessAccessControlUsers, user.id, createHrefToPath)}
      columnDefinitions={noDelete ? columnDefinition : columnDefinitionWithDelete}
      itemName="User"
      members={members}
      addUsers={addUsers}
      pageSize={10}
    />
  );
}
