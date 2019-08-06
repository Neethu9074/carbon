import { withState, compose } from 'recompose';
import React, { Fragment } from 'react';
import { createLogger } from 'instalog';

import InviteUserButton from 'in-settings/tabs/TeamSettings/pages/accessControl/Invites/InviteUserButton';
import { getUsers, setRole, removeUserFromTenant } from 'in-api/users';
import WithSubscript from 'in-settings/components/WithSubscript';
import TemporaryMessage from 'in-components/TemporaryMessage';
import { fallbackRoleId } from 'in-stores/user';
import List from 'in-settings/components/List';
import { getRolesMutable } from 'in-api/roles';
import Gravatar from 'in-components/Gravatar';
import ComboBox from 'in-components/ComboBox';
import connectTo from 'in-hoc/connectTo';

import locals from './Users.mless';

const logger = createLogger('Users');

export default compose(
  withState('message', 'setMessage', null),
  connectTo({
    roles: getRolesMutable()
  })
)(Users);

function Users({ roles, message, setMessage }) {
  let sortedRoles = roles
    ? roles.filter(role => role.id !== fallbackRoleId).sort((a, b) => a.name.localeCompare(b.name))
    : null;

  return (
    <Fragment>
      {message && <TemporaryMessage type={message.type} message={message.message} duration={5000} />}
      <List
        title="Users"
        getHeader={getHeader}
        getEntityName={getEntityName}
        columnDefinitions={columnDefinitions(sortedRoles, setMessage)}
        tableActions={tableActions}
        initialOrderBy="fullName"
        loadEntities={getUsers}
        pageSize={15}
        rightHeader={<InviteUserButton setMessage={setMessage} />}
        searchAttributes={['fullName', 'email', getRoleName(sortedRoles)]}
      />
    </Fragment>
  );
}

function columnDefinitions(sortedRoles, setMessage) {
  return [
    {
      id: 'gravatar',
      sortable: false,
      width: '4rem',
      widthInAbsoluteUnit: true,
      getContent(user) {
        return <Gravatar email={user.email} className={locals.avatar} />;
      }
    },
    {
      id: 'fullName',
      label: 'Name',
      width: 50,
      ellipsis: true,
      getContent(user) {
        return (
          <WithSubscript subscript={user.email}>
            <span className={locals.ellipsis}>{user.fullName}</span>
          </WithSubscript>
        );
      }
    },
    {
      id: 'role',
      label: 'Role',
      getContent(user) {
        return <RoleComboBox user={user} roles={sortedRoles} setMessage={setMessage} />;
      }
    }
  ];
}

const tableActions = {
  delete: {
    deleteEntity: entity => removeUserFromTenant(entity.id)
  }
};

function getHeader(totalHits) {
  return totalHits ? `Users (${totalHits})` : 'Users';
}

function getEntityName(entity) {
  return `user ${entity.fullName}`;
}

function RoleComboBox({ user, roles, setMessage }) {
  if (!user || !roles) {
    return null;
  }

  const options = roles.map(role => ({
    value: role.id,
    label: role.name
  }));
  return (
    <ComboBox
      name="user-management-roles"
      value={user.roleId}
      options={options}
      onChange={e => changeRoleTo(setMessage, user, e.value)}
      clearable={false}
    />
  );
}

function changeRoleTo(setMessage, user, newRoleId) {
  setMessage({ message: 'Saving role change…', type: 'success' });
  const setRoleResult$ = setRole(user.id, newRoleId);
  setRoleResult$.once(() => {
    setMessage({ message: 'Role change successfully saved.', type: 'success' });
  });
  setRoleResult$.errors().once(error => {
    const message = `Failed to set user role: ${error.message}`;
    setMessage({ message, type: 'error' });
    logger.warn(message, error);
  });
}

function getRoleName(roles) {
  return function(user) {
    if (!roles) {
      return null;
    }
    const role = roles.find(role => role.id === user.roleId);
    return role ? role.name : null;
  };
}
