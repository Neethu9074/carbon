/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { LoadingSkeleton } from '@instana/components';

import RoleAndAccessScopeColumns from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/RoleAndAccessScopeColumns';
import { success as successResult, error as errorResult, isLoading, hasError } from 'in-services/util/result';
import InlineEditorRow from 'in-settings/tabs/SecurityAndAccess/components/InlineEditorRow';
import Groups from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/Groups';
import { securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { refresh } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { updateUser } from 'in-settings/tabs/UserSettings/api/user';
import { notBlankValidator } from 'in-services/validators/string';
import ApiItemView from 'in-settings/components/ApiItemView';
import { getUsersAsResultObservable } from 'in-api/users';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { Row, Col } from 'in-components/layout/Grid';
import { removeUserFromTenant } from 'in-api/users';
import Title from 'in-components/Title/Title';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './User.mless';

export default function User({ match }) {
  const userId = match.params.id;
  return (
    <>
      <Title title={t('in-settings:tabs.user')} />
      <ApiItemView
        parentViewName={t('in-settings:tabs.users')}
        parentPath={securityAndAccessAccessControlUsers}
        getObservables={() => ({
          user: getUsersAsResultObservable().map(usersResult => {
            if (hasError(usersResult) || isLoading(usersResult)) {
              return usersResult;
            }
            const userId = match.params.id;
            const user = usersResult.data.filter(user => user.id === userId)[0];
            if (!user) {
              return errorResult([{ message: t('in-settings:tabs.unableToFindUserUserId', { userId: userId }) }]);
            }

            return successResult(user);
          })
        })}
        enrichForm={enrichForm}
        render={UserRenderer}
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
      <UserIcon className={locals.avatar} size="xl" />
      <LoadingSkeleton className={locals.nameSkeleton} />
      <LoadingSkeleton className={locals.nameSkeleton} />
    </div>
  );
}

const UserRenderer = props => {
  const { userId, setMessage } = props;
  const [user, setUser] = useState({ ...props.user });
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState(() => createUserNameForm(user.fullName));
  const [refreshPermissions, setRefreshPermissions] = useState(false);
  const { goToPath } = useNavigation();

  const refreshGroupsAndPermissions = () => {
    // Reset
    setRefreshPermissions(false);

    // Refresh groups
    refresh();

    // Refresh permissions set
    setRefreshPermissions(true);
  };

  const changeUserName = (userMail, form, updateForm, setMessage) => {
    if (!form.hierarchyValid) {
      return updateForm(form.setTouched(true, { recurse: true }));
    }

    saveItem(userMail, form, setMessage);
  };

  const setUserNameLocally = nextName => {
    // @ts-expect-error global access (window)
    window.instana.user.preferredName = nextName;
    // @ts-expect-error global access (window)
    window.instana.user.fullName = nextName;
  };

  const saveItem = (userMail, form, setMessage) => {
    setMessage({
      message: t('in-settings:tabs.savingNewName'),
      type: 'neutral',
      isSaving: true
    });
    const userData = form.toJS(); // Namely fullName
    const updateUserResult$ = updateUser(userMail, userData);
    updateUserResult$.once(
      () => {
        setMessage({ text: t('in-settings:tabs.nameChanged'), type: 'success' });
        // Saving successful, update user (fullName)
        setUser({ ...user, userData });
      },
      error => setMessage({ text: t('in-settings:tabs.failedToChangeName', { err: error.message }), type: 'error' })
    );

    setUserNameLocally(form.get('fullName').value);
  };

  const handleDeleteUser = (fullName, userId) => {
    // Mark delete in progress
    setIsDeleting(true);

    // Delete user
    const deletion$ = removeUserFromTenant(userId);
    deletion$.once(
      () => {
        setIsDeleting(false);
        // Deletion successful, goto users page
        goToPath(securityAndAccessAccessControlUsers);
      },
      () => {
        setIsDeleting(false);
        setMessage({ text: t('in-settings:components.failedToRemoveItemName', { itemName: fullName }), type: 'error' });
      }
    );
  };

  return (
    <>
      <InlineEditorRow
        canEdit={role.canConfigureUsers}
        canDelete={role.canConfigureUsers}
        label={user.fullName}
        extra={user.email}
        avatar={<UserIcon className={locals.avatar} size="xl" />}
        inputValue={form.get('fullName').value}
        onInputChange={value => setForm(form.updateIn(['fullName'], field => field.setValue(value).setTouched(true)))}
        hasError={!form.get('fullName').valid && form.get('fullName').touched}
        onClickSave={() => changeUserName(user.email, form, setForm, setMessage)}
        onClickCancel={() =>
          setForm(form.updateIn(['fullName'], field => field.setValue(user.fullName).setTouched(false)))
        }
        onClickDelete={() => handleDeleteUser(user.fullName, user.id)}
        deleteLabel={t('in-settings:tabs.deleteUser')}
        isDeleting={isDeleting}
      />

      <Row>
        <Col lg={6}>
          <Groups userId={userId} refresh={refreshGroupsAndPermissions} />
        </Col>
        <Col lg={6}>
          <RoleAndAccessScopeColumns email={user.email} refresh={refreshPermissions} />
        </Col>
      </Row>
    </>
  );
};

function enrichForm(form, { result: { user } }) {
  return form.put(
    'roleId',
    createField({
      value: user.roleId
    })
  );
}

function createUserNameForm(fullName) {
  return createMapForm().put(
    'fullName',
    createField({
      value: fullName,
      validator: notBlankValidator
    })
  );
}
