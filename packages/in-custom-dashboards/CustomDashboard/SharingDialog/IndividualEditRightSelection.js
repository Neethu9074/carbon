/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { Ul, Li, ColumnizedContent } from 'in-new-components/lists/List';
import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import KeyValue from 'in-new-components/lists/KeyValue';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Gravatar from 'in-components/Gravatar';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './IndividualEditRightSelection.mless';

const columnDefinitions = [
  {
    width: '3rem',
    getContent({ user }) {
      return <Gravatar email={user.email} />;
    }
  },
  {
    getContent({ user }) {
      return <KeyValue value={user.fullName} label={user.email} inverted accentuated />;
    }
  },
  {
    width: '2rem',
    getContent({ user, removeEditor }) {
      return (
        <Tooltip
          content={t(
            'in-custom-dashboards:customDashboard.sharingDialog.individualEditRightSelect.removeEditRightUserName',
            { fullName: user.fullName }
          )}
        >
          <SvgIcon className={locals.delete} type="lib_actions_delete" onClick={() => removeEditor(user.id)} />
        </Tooltip>
      );
    }
  }
];

export default function IndividualEditRightSelection({
  isPrivate,
  usersResult,
  selectedUserId,
  setSelectedUserId,
  addEditor,
  removeEditor,
  accessRules
}) {
  if (isPrivate) {
    return null;
  }

  if (usersResult == null || usersResult.progress.loading) {
    return (
      <div className={locals.loading}>
        <LoadingIndicator size="xxxl" />
      </div>
    );
  }

  const otherUsersWithAccess = accessRules
    .filter(({ relationType, relatedId }) => relationType === 'USER' && relatedId !== user.id)
    .map(({ relatedId }) => getUser(usersResult.data, relatedId))
    .filter(Boolean);

  return (
    <div className={locals.wrapper}>
      <div className={locals.addWrapper}>
        <FormGroup withoutBottomMargin className={locals.addInput}>
          <Label htmlFor="dashboard-edit-right-selection">
            {t('in-custom-dashboards:customDashboard.sharingDialog.individualEditRightSelect.addEditors')}
          </Label>
          <Select
            id="dashboard-edit-right-selection"
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
          >
            <option value="">
              {t('in-custom-dashboards:customDashboard.sharingDialog.individualEditRightSelect.pleaseSelect')}
            </option>

            {usersResult.data
              .filter(({ id }) => id !== user.id)
              .sort(compareUser)
              .map(user => (
                <option key={user.id} value={user.id} disabled={getUser(otherUsersWithAccess, user.id)}>
                  {user.fullName} ({user.email})
                </option>
              ))}
          </Select>
        </FormGroup>
        <Button kind="primary" disabled={isBlank(selectedUserId)} className={locals.addButton} onClick={addEditor}>
          {t('in-custom-dashboards:customDashboard.sharingDialog.individualEditRightSelect.add')}
        </Button>
      </div>

      {otherUsersWithAccess.length > 0 && (
        <Ul>
          {otherUsersWithAccess.sort(compareUser).map(user => (
            <Li key={user.id}>
              <ColumnizedContent columnDefinitions={columnDefinitions} user={user} removeEditor={removeEditor} />
            </Li>
          ))}
        </Ul>
      )}
    </div>
  );
}

function compareUser(a, b) {
  return compareIgnoreCase(a.fullName || a.email, b.fullName || b.email);
}

function getUser(users, userId) {
  return users.find(({ id }) => id === userId);
}
