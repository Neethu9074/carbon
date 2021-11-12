/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { t } from 'in-i18n';

export function AdvancedModeFooter({
  onClose,
  onCreate,
  isSaving,
  form,
  additionalValidationCheck,
  editMode,
  migrationMode
}) {
  return (
    <FormFooter>
      <CancelButton onClick={() => onClose()} />

      <SaveButton
        onClick={() => onCreate()}
        isSaving={isSaving}
        form={form}
        disabled={!form.hierarchyValid || !additionalValidationCheck()}
      >
        {getSaveButtonLabel({ editMode, migrationMode })}
      </SaveButton>
    </FormFooter>
  );
}

function getSaveButtonLabel({ editMode, migrationMode }) {
  if (migrationMode) return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonMigrate');
  if (editMode) return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}

AdvancedModeFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  additionalValidationCheck: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  isSaving: PropTypes.bool,
  editMode: PropTypes.bool,
  migrationMode: PropTypes.bool
};
