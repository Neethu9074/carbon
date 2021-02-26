/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { iconColumn, labelColumn } from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import AddUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/AddUserButton';
import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import UserList from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import { find } from 'in-services/arrayUtils';
import { light } from 'in-themes/themes';

const columnDefinition = [iconColumn, labelColumn];

export default function Users({ members, addUsers, removeUser, noDelete = false }) {
  const columnDefinitionWithDelete = [
    ...columnDefinition,
    {
      width: '2rem',
      getContent({ userId }) {
        return <Delete skipDialog doDelete={() => removeUser(userId)} />;
      }
    }
  ];

  return (
    <LocallyChangedTheme theme={light}>
      <UserList
        renderer={ListInsideACardRenderer}
        filterFunction={user => find(members, member => member.userId === user.id)}
        renderAdditionalHeaderContent={renderAdditionalHeaderContent}
        getUserLink={user => getEntityIdView(teamSettingsAccessControlUsers, user.id)}
        columnDefinitions={noDelete ? columnDefinition : columnDefinitionWithDelete}
        itemName="User"
        members={members}
        addUsers={addUsers}
        pageSize={10}
      />
    </LocallyChangedTheme>
  );
}

function renderAdditionalHeaderContent({ addUsers, members }) {
  return <AddUserButton addUsers={addUsers} members={members} />;
}
