import { createField } from 'formalistic';
import React from 'react';

import UserPermissions from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserPermissions';
import RolesDropDown from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/RolesDropDown';
import Permissions from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Permissions';
import { success as successResult, error as errorResult } from 'in-services/util/result';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import Groups from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Groups';
import Areas from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Areas';
import { isLoading, hasError, successObservable } from 'in-services/util/result';
import { teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable, setRole } from 'in-api/users';
import { groupPermissionsEnabled } from 'in-services/featureFlags';
import ApiItemView from 'in-settings/components/ApiItemView';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getRolesAsResultObservable, refresh } from 'in-api/roles';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Title from 'in-components/Title/Title';
import Gravatar from 'in-components/Gravatar';
import Label from 'in-components/form/Label';

import locals from './User.mless';

export default function User({ match }) {
  const userId = match.params.id;
  return (
    <>
      <Title title="User" />
      <ApiItemView
        parentViewName="Users"
        parentPath={teamSettingsAccessControlUsers}
        getObservables={() => ({
          user: getUsersAsResultObservable().map(usersResult => {
            if (hasError(usersResult) || isLoading(usersResult)) {
              return usersResult;
            }
            const userId = match.params.id;
            const user = usersResult.data.filter(user => user.id === userId)[0];
            if (!user) {
              return errorResult([{ message: `Unable to find user: ${userId}` }]);
            }

            return successResult(user);
          }),
          roles: groupPermissionsEnabled ? successObservable([]) : getRolesAsResultObservable()
        })}
        enrichForm={enrichForm}
        saveItem={saveItem}
        render={renderUser}
        renderLoadingState={renderLoadingState}
        // additional props which are passed down
        userId={userId}
        hideFooter
      />
    </>
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
  const { user, roles, form, userId } = props;

  return (
    <>
      <Row>
        <Col lg>
          <div className={locals.headline}>
            <Gravatar className={locals.avatar} email={user.email} size="l" />
            <span className={locals.name}>
              {user.fullName}
              <span className={locals.email}>{user.email}</span>
            </span>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Groups userId={userId} refresh={refresh} />
        </Col>
        <Col lg={6}>
          <Areas userId={userId} />
        </Col>
      </Row>

      <Row>
        <Col lg>
          <h2 className={locals.title}>Permissions</h2>
          {!groupPermissionsEnabled && (
            <div>
              <FormGroup className={locals.roles}>
                <Label>Role</Label>
                <RolesDropDown {...props} user={user} />
              </FormGroup>
              <Permissions roles={roles} roleId={form.get('roleId').value} />
            </div>
          )}
          {groupPermissionsEnabled && <UserPermissions userId={user.id} />}
        </Col>
      </Row>
    </>
  );
}

function saveItem({ form, userId, setMessage }) {
  const roleId = form.get('roleId').value;

  setMessage({ message: 'Saving user', type: neutral, isSaving: true });
  const setRoleResult$ = setRole(userId, roleId);
  setRoleResult$.once(
    () => setMessage({ text: 'Role change successfully saved.', type: success }),
    error => setMessage({ text: `Failed to set user role: ${error.message}`, type: errorType })
  );
}

function enrichForm(form, { result: { user } }) {
  return form.put(
    'roleId',
    createField({
      value: user.roleId
    })
  );
}
