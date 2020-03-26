import { createField } from 'formalistic';
import React from 'react';

import { teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable, setRole } from 'in-api/users';
import ApiItemView from 'in-settings/components/ApiItemView';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getRolesAsResultObservable } from 'in-api/roles';
import FormGroup from 'in-components/form/FormGroup';
import { fallbackRoleId } from 'in-stores/user';
import Gravatar from 'in-components/Gravatar';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';

import locals from './User.mless';

export default function User({ match }) {
  const userId = match.params.id;
  return (
    <ApiItemView
      parentViewName="Users"
      parentPath={teamSettingsAccessControlUsers}
      getObservables={() => ({
        users: getUsersAsResultObservable(),
        roles: getRolesAsResultObservable()
      })}
      enrichForm={enrichForm}
      saveItem={form => saveItem(userId, form)}
      render={renderUser}
      renderLoadingState={renderLoadingState}
      // additional props which are passed down
      userId={userId}
    />
  );
}

function renderLoadingState() {
  return (
    <div className={locals.headline}>
      <Gravatar className={locals.avatar} size="l" />
      <Skeleton className={locals.nameSkeleton} />
      <Skeleton className={locals.nameSkeleton} />
    </div>
  );
}

function renderUser(props) {
  const { users, userId } = props;
  const user = users.filter(user => user.id === userId)[0];

  return (
    <>
      <div className={locals.headline}>
        <Gravatar className={locals.avatar} email={user.email} size="l" />
        <span className={locals.name}>
          {user.fullName}
          <span className={locals.email}>{user.email}</span>
        </span>
      </div>

      <div className={locals.rolesWrapper}>
        <FormGroup>
          <Label>Role</Label>
          <RoleComboBox {...props} user={user} />
        </FormGroup>
      </div>
    </>
  );
}

function RoleComboBox({ user, roles, form, setForm }) {
  if (!user || !roles) {
    return null;
  }

  const options = roles
    .filter(role => role.id !== fallbackRoleId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(role => ({
      value: role.id,
      label: role.name
    }));

  return (
    <ComboBox
      name="user-management-roles"
      value={form.get('roleId').value}
      options={options}
      onChange={e => {
        setForm(form.updateIn(['roleId'], f => f.setValue(e.value).setTouched(true)));
      }}
      clearable={false}
    />
  );
}

function saveItem(userId, form) {
  const roleId = form.get('roleId').value;
  return setRole(userId, roleId);
}

function enrichForm(form, { result: { users }, userId }) {
  const user = users.filter(user => user.id === userId)[0];
  if (!user) {
    return form;
  }

  return form.put(
    'roleId',
    createField({
      value: user.roleId
    })
  );
}
