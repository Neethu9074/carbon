/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Checkbox, Button } from '@instana/components';

import UserList, {
  iconColumn,
  labelColumn
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/UserList';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { setUsersToGroup } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import withSelectableItems from 'in-settings/components/withSelectableItems';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { SETTINGS_GROUP_USER_ADDED } from 'in-services/tracking/tracking';
import ActionBar from 'in-settings/components/Dialog/ActionBar';
import Dialog from 'in-components/Dialog/Dialog';
import { find } from 'in-services/arrayUtils';
import { t } from 'in-i18n';

import locals from './AddUserButton.mless';

export default function AddUserButton({ members, addUsers, groupId }) {
  const { trackCta } = useSegmentTracking();

  const onSubmit = (users, setIsSaving, setErrors) => {
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
    setIsSaving(true);
    const userIds = users.map(user => user.id);
    setUsersToGroup(groupId, userIds).once(
      data => {
        if (Number.isInteger(data.status) && data.status > 199 && data.status < 300) {
          setIsSaving(false);
          trackCta(SETTINGS_GROUP_USER_ADDED, { groupId: groupId, userIds: userIds });
          addUsers(users);
          close();
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
                return <Checkbox checked={isSelected} onChange={() => toggleItem(user.id, user)} />;
              }
            },
            iconColumn,
            labelColumn
          ]}
        />
        <ActionBar isSaving={isSaving} disabled={disabled} />
      </form>
    </Dialog>
  );
});
