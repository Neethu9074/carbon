/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t, Trans } from 'in-i18n';
import {
  GroupFormFields,
  hasContributorRoleChanged
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Groups/Group.form';
import EditAccessScopeDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/EditAccessScope';
import { FormControlProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/RoleAndAccessScopeColumns';
import React from 'react';

interface OpenContributorApplicationChangeConfirmationProps {
  onConfirm: VoidFunction;
  numContributorApplicationIds: number;
}

function openContributorApplicationChangeConfirmation({
  onConfirm,
  numContributorApplicationIds
}: OpenContributorApplicationChangeConfirmationProps) {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-settings:components.confirmRemove')}
      description={
        <Trans
          i18nKey="in-settings:components.confirmSaveGroup"
          values={{ numberOfContributorAPs: numContributorApplicationIds }}
        />
      }
      confirmButtonLabel={t('forms.actions.save')}
      onSubmit={() => {
        close();
        onConfirm();
      }}
    />
  );
}

function onSaveFormHandler(form: MapForm<GroupFormFields>, onSave: (form: EditGroupDialogProps['form']) => void) {
  const { contributorApplicationIds } = form.getIn(['initialRef']).value;
  const numContributorApplicationIds = contributorApplicationIds.length;
  const showContributorAppConfirmation = numContributorApplicationIds > 0 && hasContributorRoleChanged(form);

  const saveAndClose = () => {
    onSave(form);
    close();
  };

  if (showContributorAppConfirmation) {
    return openContributorApplicationChangeConfirmation({ numContributorApplicationIds, onConfirm: saveAndClose });
  }

  saveAndClose();
}

interface EditGroupDialogProps extends Omit<FormControlProps<GroupFormFields>, 'setForm'> {
  editMode?: boolean;
  onCancel: VoidFunction;
  onSave: (form: EditGroupDialogProps['form']) => void;
}

export default function EditGroupDialog({ editMode, form, onCancel, onSave }: EditGroupDialogProps) {
  return (
    <EditAccessScopeDialog
      form={form}
      onSave={form => onSaveFormHandler(form, onSave)}
      onCancel={onCancel}
      editMode={editMode}
    />
  );
}
