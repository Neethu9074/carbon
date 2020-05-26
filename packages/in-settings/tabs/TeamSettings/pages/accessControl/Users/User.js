import { createField } from 'formalistic';
import React from 'react';

import RolesDropDown from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/RolesDropDown';
import Permissions from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Permissions';
import { success as successResult, error as errorResult } from 'in-services/util/result';
import Groups from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Groups';
import Areas from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Areas';
import { teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { getUsersAsResultObservable, setRole } from 'in-api/users';
import { isLoading, hasError } from 'in-services/util/result';
import ApiItemView from 'in-settings/components/ApiItemView';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getRolesAsResultObservable } from 'in-api/roles';
import { isRbacEnabled } from 'in-services/featureFlags';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Gravatar from 'in-components/Gravatar';
import Label from 'in-components/form/Label';

import locals from './User.mless';

export default function User({ match }) {
  const userId = match.params.id;
  return (
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

      {isRbacEnabled && (
        <>
          <Row>
            <Col lg={6}>
              <Groups userId={userId} />
            </Col>
            <Col lg={6}>
              <Areas userId={userId} />
            </Col>
          </Row>
        </>
      )}

      <Row>
        <Col lg>
          <h2 className={locals.title}>Permissions</h2>
          <FormGroup className={locals.roles}>
            <Label>Role</Label>
            <RolesDropDown {...props} user={user} />
          </FormGroup>
          <Permissions roles={roles} roleId={form.get('roleId').value} />
        </Col>
      </Row>
    </>
  );
}

function saveItem(userId, form) {
  const roleId = form.get('roleId').value;
  return setRole(userId, roleId);
}

function enrichForm(form, { result: { user } }) {
  return form.put(
    'roleId',
    createField({
      value: user.roleId
    })
  );
}
