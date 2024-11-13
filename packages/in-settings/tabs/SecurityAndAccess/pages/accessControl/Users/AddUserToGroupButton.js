/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import AddUserToGroupDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Users/AddUserToGroupDialog';
import { SETTINGS_USER_ADD_USER_TO_GROUP } from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { saveGroups } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { t } from 'in-i18n';

export default function AddUserToGroupButton({ userId, refresh }) {
  const { trackCta } = useSegmentTracking();

  return (
    <Button
      kind="action"
      onClick={() => {
        addActiveDialog(
          <AddUserToGroupDialog
            userId={userId}
            onSubmit={(newGroupsToAdd, setIsSaving, setErrors) =>
              addUserToGroup(userId, refresh, newGroupsToAdd, setIsSaving, setErrors, trackCta)
            }
          />
        );
      }}
      icon="lib_openclose_add_circle_outline"
    >
      {t('in-settings:tabs.addToAGroup')}
    </Button>
  );
}

function addUserToGroup(userId, refresh, newGroupsToAdd, setIsSaving, setErrors, trackCta) {
  const groupsWithUser = newGroupsToAdd.slice().map(group => {
    return {
      ...group,
      members: [...group.members, { userId }],
      permissions: [{ id: group.permissionSet.id, scope: 'TU' }]
    };
  });
  setIsSaving(true);

  const result$ = saveGroups(groupsWithUser);
  result$.once(
    () => {
      setIsSaving(false);
      trackCta(SETTINGS_USER_ADD_USER_TO_GROUP, { userId: userId, groupIds: newGroupsToAdd?.map(group => group.id) });
      if (refresh) {
        refresh();
      }
      close();
    },
    error => {
      setIsSaving(false);
      setErrors([{ code: 'server', message: t('in-settings:tabs.failedToAddUserToGroups', { err: error.message }) }]);
    }
  );
}
