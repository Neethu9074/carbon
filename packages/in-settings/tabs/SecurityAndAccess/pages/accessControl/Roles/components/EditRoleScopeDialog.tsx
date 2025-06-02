/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';
import { MapForm } from 'formalistic';

import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import {
  createGroupForm,
  createGroupFormFromApiResult,
  formToApiGroup,
  GroupFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group.form';
import EditGroupDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/components/EditGroupDialog';
import { getGroup, refresh, saveGroupAsResultObservable } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { refreshOnSuccess } from 'in-settings/tabs/SecurityAndAccess/api/roles';
import { SETTINGS_ROLE_SCOPE_SUBMIT } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { close } from 'in-components/DialogPresenter/store';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { pendingResult } from 'in-services/fixedObjects';
import useDerivedState from 'in-hooks/useDerivedState';
import { seconds } from 'in-services/time/time';
import { ApiGroup } from 'in-types';
import { t } from 'in-i18n';

interface EditRoleScopeDialogProps {
  roleId: string;
}

export default function EditRoleScopeDialog({ roleId }: EditRoleScopeDialogProps) {
  const { unstable_trackEvent } = useSegmentTracking();
  const { data: group } = useObservable(() => getGroup(roleId), [roleId]) ?? pendingResult;
  const [form, setForm] = useDerivedState(createGroupForm());
  const [status, submitForm] = useFormSubmission<ApiGroup, ApiGroup>(payload =>
    saveGroupAsResultObservable(payload).map(result => {
      // Send refrehs signal to teams in order to refresh access scope list
      refresh();
      // Send refrehs signal to roles in order to refresh all other components
      // on role details
      return refreshOnSuccess(result);
    })
  );

  useEffect(() => {
    if (status !== 'resolved' && !group) return;

    const updatedForm = createGroupFormFromApiResult({ form, group });
    setForm(updatedForm);

    // We only need to update the form when group data was loaded successfully
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, generateStableHash(group)]);

  if (status === 'pending') return <></>;

  return (
    <EditGroupDialog
      editMode
      form={form}
      onCancel={close}
      onSave={function (form: MapForm<GroupFormFields>): void {
        const payload = formToApiGroup(form);
        const { permissionSet, ...trackEventPayload } = payload;
        submitForm({
          payload,
          onError: () => {
            addMessage({
              content: t('in-components:error.serverErrorInfo'),
              timeout: seconds.toMillis(6),
              type: 'danger'
            });
          },
          onSuccess: () => {
            addMessage({
              content: t('in-settings:dialogs.role.roleSuccessfullySaved'),
              timeout: seconds.toMillis(4),
              type: 'success'
            });
            unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_ROLE_SCOPE_SUBMIT }, trackEventPayload);
            close();
          }
        });
      }}
    />
  );
}
