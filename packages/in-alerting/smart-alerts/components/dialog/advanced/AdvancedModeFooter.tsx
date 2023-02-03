/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import React from 'react';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { t } from 'in-i18n';

interface AdvancedModeFooterProps {
  onClose: () => void;
  onCreate: () => void;
  /**
   * When user wants to submit, and the whole form is valid then this will be triggered
   * and only when it returns true then the onCreate() will be called.
   */
  additionalValidationCheck: () => boolean;
  /**
   * gets triggered after pressing submit, if there was an error while validating the form
   */
  scrollToFirstFormError: () => void;
  form: MapForm;
  setForm: (updatedForm: MapForm) => void;
  isSaving?: boolean;
  editMode?: boolean;
  migrationMode?: boolean;
}

export function AdvancedModeFooter({
  onClose,
  onCreate,
  isSaving,
  form,
  setForm,
  scrollToFirstFormError,
  additionalValidationCheck,
  editMode,
  migrationMode
}: AdvancedModeFooterProps) {
  return (
    <FormFooter>
      <CancelButton onClick={() => onClose()} />

      <SaveButton
        onClick={() => {
          if (form && !form.hierarchyValid) {
            setForm?.(form.setTouched(true, { recurse: true }));
            scrollToFirstFormError?.();
            return;
          }
          if (additionalValidationCheck()) {
            onCreate();
          }
        }}
        isSaving={isSaving}
        disabled={isSaving}
      >
        {getSaveButtonLabel({ editMode, migrationMode })}
      </SaveButton>
    </FormFooter>
  );
}

function getSaveButtonLabel({ editMode, migrationMode }: { editMode?: boolean; migrationMode?: boolean }) {
  if (migrationMode) return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonMigrate');
  if (editMode) return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}
