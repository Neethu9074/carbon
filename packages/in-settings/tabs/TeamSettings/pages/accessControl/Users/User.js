/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, notBlankValidator, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { SvgIcon } from '@instana/components';

import UserPermissions from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserPermissions';
import { success as successResult, error as errorResult } from 'in-services/util/result';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import Groups from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Groups';
import Areas from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Areas';
import { teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { updateUser } from 'in-settings/tabs/UserSettings/api/user';
import { refresh } from 'in-settings/tabs/TeamSettings/api/groups';
import { isLoading, hasError } from 'in-services/util/result';
import ApiItemView from 'in-settings/components/ApiItemView';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getUsersAsResultObservable } from 'in-api/users';
import { Row, Col } from 'in-new-components/layout/Grid';
import Title from 'in-components/Title/Title';
import Button from 'in-new-components/Button';
import Gravatar from 'in-components/Gravatar';
import Input from 'in-components/form/Input';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './User.mless';

export default function User({ match }) {
  const userId = match.params.id;
  return (
    <>
      <Title title={t('in-settings:tabs.user')} />
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
              return errorResult([{ message: t('in-settings:tabs.unableToFindUserUserId', { userId: userId }) }]);
            }

            return successResult(user);
          })
        })}
        enrichForm={enrichForm}
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
  const { user, userId, setMessage } = props;
  const [form, setForm] = useState(() => createUserNameForm(user.fullName));

  return (
    <>
      <Row>
        <Col lg>
          <div className={locals.headline}>
            <Gravatar className={locals.avatar} email={user.email} size="l" />
            <Headline user={user} form={form} updateForm={setForm} setMessage={setMessage} />
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Groups userId={userId} refresh={refresh} />
        </Col>
        <Col lg={6}>
          <Areas userEmail={user.email} refresh={refresh} />
        </Col>
      </Row>

      <Row>
        <Col lg>
          <UserPermissions userId={user.id} />
        </Col>
      </Row>
    </>
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

function Headline({ user, form, updateForm, setMessage }) {
  const [isEditMode, setEditMode] = useState(false);

  return role.canConfigureUsers ? (
    isEditMode ? (
      <>
        <Input
          type="text"
          value={form.get('fullName').value}
          className={locals.name}
          onChange={e =>
            updateForm(form.updateIn(['fullName'], field => field.setValue(e.target.value || '').setTouched(true)))
          }
          autoComplete="off"
          hasError={!form.get('fullName').valid && form.get('fullName').touched}
        />

        <Button
          kind="action"
          onClick={e => changeUserName(e, user.email, form, updateForm, setMessage)}
          className={locals.editUserSaveButton}
          noAutoMargin
        >
          {t('in-settings:tabs.save')}
        </Button>

        <Button kind="subtle" onClick={() => setEditMode(false)} className={locals.editUserCancelButton} noAutoMargin>
          {t('in-settings:tabs.cancel')}
        </Button>
      </>
    ) : (
      <>
        <span className={locals.name}>{user.fullName}</span>

        <SvgIcon type="lib_actions_edit" className={locals.editIcon} onClick={() => setEditMode(!isEditMode)} />

        <span className={locals.email}>{user.email}</span>
      </>
    )
  ) : (
    <>
      <span className={locals.name}>{user.fullName}</span>
      <span className={locals.email}>{user.email}</span>
    </>
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

function changeUserName(e, userMail, form, updateForm, setMessage) {
  e.preventDefault();

  if (!form.hierarchyValid) {
    return updateForm(form.setTouched(true, { recurse: true }));
  }

  saveItem(userMail, form, setMessage);
}

function saveItem(userMail, form, setMessage) {
  setMessage({
    message: t('in-settings:tabs.savingNewName'),
    type: neutral,
    isSaving: true
  });
  const updateUserResult$ = updateUser(userMail, form.toJS());
  updateUserResult$.once(
    () => {
      setMessage({ text: t('in-settings:tabs.nameChanged'), type: success });
      window.location.reload();
    },
    error => setMessage({ text: t('in-settings:tabs.failedToChangeName', { err: error.message }), type: errorType })
  );
}
