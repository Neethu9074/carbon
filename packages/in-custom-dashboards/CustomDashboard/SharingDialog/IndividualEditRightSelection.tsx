/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Ul, Li, ColumnizedContent, KeyValue, IconButton, Button, Select } from '@instana/components';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { isBlank, compareIgnoreCase } from 'in-services/util/string';
import { AccessRule, Nullish, Result, UserResult } from 'in-types';
import UserIcon from 'in-components/UserIcon/UserIcon';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './IndividualEditRightSelection.mless';

const columnDefinitions = [
  {
    width: '3rem',
    getContent: () => {
      return <UserIcon size="l" />;
    }
  },
  {
    getContent({ user }: { user: UserResult }) {
      return <KeyValue value={user.fullName} label={user.email} inverted accentuated />;
    }
  },
  {
    width: '2rem',
    getContent({ user, removeEditor }: { user: UserResult; removeEditor: (id: string) => void }) {
      return (
        <Tooltip
          content={t(
            'in-custom-dashboards:customDashboard.sharingDialog.individualEditRightSelect.removeEditRightUserName',
            { fullName: user.fullName }
          )}
        >
          <IconButton
            kind="primary"
            className={locals.delete}
            type="lib_actions_delete"
            onClick={() => removeEditor(user.id)}
          />
        </Tooltip>
      );
    }
  }
];

interface IndividualEditRightSelectionProps {
  isPrivate: boolean;
  usersResult: Result<UserResult[]> | Nullish;
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  addEditor: () => void;
  removeEditor: (userId: string) => void;
  accessRules: AccessRule[];
}

export default function IndividualEditRightSelection({
  isPrivate,
  usersResult,
  selectedUserId,
  setSelectedUserId,
  addEditor,
  removeEditor,
  accessRules
}: IndividualEditRightSelectionProps) {
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
    //@ts-expect-error id is not defined in user interface but exists so we ignore it
    .filter(({ relationType, relatedId }) => relationType === 'USER' && relatedId !== user?.id)
    .map(({ relatedId }) => (relatedId ? getUser(usersResult.data, relatedId) : false))
    .filter(Boolean) as UserResult[];

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

            {usersResult?.data
              ? usersResult.data
                  //@ts-expect-error
                  .filter(({ id }) => id !== user?.id)
                  .sort(compareUser)
                  .map(user => (
                    <option key={user.id} value={user.id} disabled={!!getUser(otherUsersWithAccess, user.id)}>
                      {user.fullName} ({user.email})
                    </option>
                  ))
              : undefined}
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

function compareUser(a: UserResult, b: UserResult) {
  return compareIgnoreCase(a.fullName || a.email, b.fullName || b.email);
}

function getUser(users: UserResult[] | undefined, userId: string) {
  if (!users) return undefined;
  return users.find(({ id }) => id === userId);
}
