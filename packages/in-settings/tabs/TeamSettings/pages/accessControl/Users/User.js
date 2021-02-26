/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField } from 'formalistic';
import { t } from 'in-i18n';
import React from 'react';

import UserPermissions from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserPermissions';
import { success as successResult, error as errorResult } from 'in-services/util/result';
import Groups from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Groups';
import Areas from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/Areas';
import { teamSettingsAccessControlUsers } from 'in-settings/navigation/paths';
import { refresh } from 'in-settings/tabs/TeamSettings/api/groups';
import { isLoading, hasError } from 'in-services/util/result';
import ApiItemView from 'in-settings/components/ApiItemView';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { getUsersAsResultObservable } from 'in-api/users';
import { Row, Col } from 'in-new-components/layout/Grid';
import Title from 'in-components/Title/Title';
import Gravatar from 'in-components/Gravatar';

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
  const { user, userId } = props;

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
