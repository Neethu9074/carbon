/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';

import UserList, { iconColumn, labelColumn } from 'in-settings/tabs/TeamSettings/pages/accessControl/Users/UserList';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import withSelectableItems from 'in-settings/components/withSelectableItems';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { rbacImprovementEnabled } from 'in-services/featureFlags';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import CancelButton from 'in-components/form/CancelButton';
import SaveButton from 'in-components/form/SaveButton';
import { setUsersToGroup } from '../../../api/groups';
import Dialog from 'in-components/Dialog/Dialog';
import { find } from 'in-services/arrayUtils';
import { t } from 'in-i18n';

import locals from './AddUserButton.mless';

export default function AddUserButton({ members, addUsers, groupId }) {
  const onSubmit = (users, setIsSaving, setErrors) => {
    const updateOldAndCloseDialog = () => {
      setIsSaving(false);
      addUsers(users);
      close();
    };
    const handleError = (message, code) => {
      if (!code) {
        code = 'server';
      }
      if (!message) {
        message = t('in-settings:tabs.failedToAddUsersToGroupWithoutDetails');
      }
      setIsSaving(false);
      setErrors([{ code: code, message }]);
    };
    if (rbacImprovementEnabled) {
      setIsSaving(true);
      const userIds = users.map(user => user.id);
      setUsersToGroup(groupId, userIds).once(
        data => {
          if (Number.isInteger(data.status) && data.status > 199 && data.status < 300) {
            updateOldAndCloseDialog();
          } else {
            handleError(null, null);
          }
        },
        errData => {
          let code = null;
          let message = null;
          if (errData?.response?.status === 404) {
            code = 'CLIENT';
            const err = t('in-settings:tabs.groupNotFound');
            message = t('in-settings:tabs.failedToAddUsersToGroup', { err });
          }
          handleError(message, code);
        }
      );
    } else {
      updateOldAndCloseDialog();
    }
  };
  return (
    <Button
      kind="action"
      onClick={() => {
        addActiveDialog(<AddUserDialog members={members} onSubmit={onSubmit} />);
      }}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-settings:tabs.addUser')}
    </Button>
  );
}
/**
 * Provides a button as done before the featureFlag was introduced
 * @param {isSaving: boolean, disabled: boolean} param0 props for component
 * @returns new Component instance
 */
function LegacyAddUserToGroupButton({ isSaving, disabled }) {
  return (
    <SaveButton isSaving={isSaving} className={locals.legacyButton} disabled={disabled} kind="primary">
      {t('in-settings:tabs.addUserToGroup')}
    </SaveButton>
  );
}

/**
 * Provides an action-bar providing a cancel and submit button
 * @param {isSaving: boolean, disabled: boolean} param0 props for component
 * @returns new Component instance
 */
function Actions({ isSaving, disabled }) {
  return (
    <div className={locals.actionsWrapper}>
      <CancelButton className={locals.button} onClick={close} isSaving={isSaving}>
        {t('in-settings:tabs.cancel')}
      </CancelButton>
      <SaveButton isSaving={isSaving} className={locals.button} disabled={disabled} kind="primary">
        {t('in-settings:termsDialog.save')}
      </SaveButton>
    </div>
  );
}

const AddUserDialog = withSelectableItems(function AddUserDialog({
  onSubmit,
  members,
  selectedEntities,
  checkIfSelected,
  toggleItem
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const disabled = selectedEntities.size === 0;

  return (
    <Dialog className={locals.dialog} title={t('in-settings:tabs.inviteUserToGroup')} onClose={close}>
      <ErroneousResultPresenter errors={errors} addBottomMargin />
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(Array.from(selectedEntities.values()), setIsSaving, setErrors);
        }}
      >
        <UserList
          pageSize={10}
          filterFunction={user => !find(members, member => member.userId === user.id)}
          onUserClick={user => toggleItem(user.id, user)}
          columnDefinitions={[
            {
              width: '2rem',
              getContent({ user }) {
                const isSelected = checkIfSelected(user.id);
                return <CheckboxFancy checked={isSelected} onChange={() => toggleItem(user.id, user)} />;
              }
            },
            iconColumn,
            labelColumn
          ]}
        />
        {rbacImprovementEnabled ? (
          <Actions isSaving={isSaving} disabled={disabled} />
        ) : (
          <LegacyAddUserToGroupButton isSaving={isSaving} disabled={disabled} />
        )}
      </form>
    </Dialog>
  );
});
