import { createField } from 'formalistic';
import React from 'react';

import RolesDropDown from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/RolesDropDown';
import Permissions from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Permissions';
import AreasDialog from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/AreasDialog';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import Groups from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Groups';
import { teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getUsersAsResultObservable, setRole } from 'in-api/users';
import ApiItemView from 'in-settings/components/ApiItemView';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getRolesAsResultObservable } from 'in-api/roles';
import { isRbacEnabled } from 'in-services/featureFlags';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Button from 'in-new-components/Button';
import Gravatar from 'in-components/Gravatar';
import Label from 'in-components/form/Label';

import locals from './User.mless';

export default function User({ match }) {
  return (
    <ApiItemView
      parentViewName="Users"
      parentPath={teamSettingsAccessControlUsers}
      getObservables={() => ({
        users: getUsersAsResultObservable(),
        roles: getRolesAsResultObservable()
      })}
      enrichForm={enrichForm}
      saveItem={saveItem}
      render={renderUser}
      renderLoadingState={renderLoadingState}
      // additional props which are passed down
      userId={match.params.id}
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
  const { users, roles, form, userId } = props;
  const user = users.filter(user => user.id === userId)[0];

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
            <Col lg>
              <Groups userId={userId} />
            </Col>
          </Row>
          <Row>
            <Col lg>
              <h2 className={locals.title}>Areas</h2>
              <Button
                kind="action"
                onClick={() => {
                  addActiveDialog(<AreasDialog userId={userId} />);
                }}
              >
                Click to inspect areas
              </Button>
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

function saveItem({ form, userId, setMessage }) {
  const roleId = form.get('roleId').value;

  setMessage({ text: 'Saving role change…', type: neutral });
  const setRoleResult$ = setRole(userId, roleId);
  setRoleResult$.once(
    () => {
      setMessage({ text: 'Role change successfully saved.', type: success });
    },
    error => setMessage({ text: `Failed to set user role: ${error.message}`, type: errorType })
  );
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
