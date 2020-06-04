import React from 'react';

import { iconColumn, labelColumn, roleColumn } from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import AddUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/AddUserButton';
import { getEntityIdView, teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { ListInsideACardRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import UserList from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import { light } from 'in-themes/themes';

export default function Users({ userIds, addUsers, removeUser }) {
  return (
    <LocallyChangedTheme theme={light}>
      <UserList
        renderer={ListInsideACardRenderer}
        filterFunction={user => userIds.indexOf(user.id) >= 0}
        renderAdditionalHeaderContent={renderAdditionalHeaderContent}
        getUserLink={user => getEntityIdView(teamSettingsAccessControlUsers, user.id)}
        columnDefinitions={[
          iconColumn,
          labelColumn,
          roleColumn,
          {
            width: '2rem',
            getContent({ user }) {
              return <Delete skipDialog doDelete={() => removeUser(user.id)} />;
            }
          }
        ]}
        addUsers={addUsers}
        userIds={userIds}
        pageSize={10}
      />
    </LocallyChangedTheme>
  );
}

function renderAdditionalHeaderContent({ addUsers, userIds }) {
  return <AddUserButton addUsers={addUsers} userIds={userIds} />;
}
