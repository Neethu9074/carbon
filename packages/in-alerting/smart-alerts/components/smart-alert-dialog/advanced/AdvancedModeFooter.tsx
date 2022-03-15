/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';
import PropTypes from 'prop-types';
import React from 'react';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { t } from 'in-i18n';

interface AdvancedModeFooterProps {
  onClose: () => void;
  onCreate: () => void;
  additionalValidationCheck: () => boolean;
  form: MapForm;
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
  additionalValidationCheck,
  editMode,
  migrationMode
}: AdvancedModeFooterProps) {
  return (
    <FormFooter>
      <CancelButton onClick={() => onClose()} />

      <SaveButton
        onClick={() => {
          if (additionalValidationCheck()) {
            onCreate();
          } else {
            if (form && !form.hierarchyValid) {
              setForm?.(form.setTouched(true, { recurse: true }));
            }
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

AdvancedModeFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  additionalValidationCheck: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  editMode: PropTypes.bool,
  migrationMode: PropTypes.bool
};
