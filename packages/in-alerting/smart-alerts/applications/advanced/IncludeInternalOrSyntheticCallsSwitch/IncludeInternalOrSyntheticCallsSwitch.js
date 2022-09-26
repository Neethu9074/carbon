/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  hasSubEntitySelection,
  resetEntitySelection
} from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/InboundOrAllCallsSwitch.mless';

export default function IncludeInternalOrSyntheticCallsSwitch({ form, updateForm, isGlobalSmartAlert }) {
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const applications = form.get('applications').value;

  return (
    <div className={locals.container}>
      <Row>
        <Col lg={6} className={locals.column}>
          <CheckboxFancy
            label={callLabels['includeInternal']}
            checked={includeInternal}
            onChange={() => handleChange('includeInternal', includeInternal)}
          />
        </Col>
        <Col lg={6} className={locals.column}>
          <CheckboxFancy
            label={callLabels['includeSynthetic']}
            checked={includeSynthetic}
            onChange={() => handleChange('includeSynthetic', includeSynthetic)}
          />
        </Col>
      </Row>
    </div>
  );

  function handleChange(fieldName, currentValue) {
    const applications = form.get('applications').value;
    const shouldPromptConfirmDialog = hasSubEntitySelection(applications);

    if (currentValue === true && shouldPromptConfirmDialog) {
      addActiveDialog(
        <ConfirmationDialog
          header={t(
            'in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCalls.confirmationDialog.pleaseConfirm'
          )}
          description={t(
            'in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCalls.confirmationDialog.description',
            {
              callType: callLabels[fieldName]
            }
          )}
          confirmButtonLabel={t(
            'in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCalls.confirmationDialog.confirmButtonLabel'
          )}
          confirmButtonKind="primary"
          onSubmit={() => {
            updateFieldAndResetSelection(fieldName, !currentValue);
            close();
          }}
        />
      );
    } else {
      updateField(fieldName, !currentValue);
    }
  }

  function updateField(fieldName, newValue) {
    updateForm(form.updateIn([fieldName], f => f.setValue(newValue).setTouched(true)));
  }

  function updateFieldAndResetSelection(fieldName, newValue) {
    const updatedApplications = resetEntitySelection(isGlobalSmartAlert, applications);
    let updatedForm = form
      .updateIn([fieldName], f => f.setValue(newValue).setTouched(true))
      .updateIn(['applications'], f => f.setValue(updatedApplications).setTouched(true));
    updateForm(updatedForm);
  }
}

const callLabels = Object.freeze({
  includeInternal: t(
    'in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCalls.includeInternalCalls'
  ),
  includeSynthetic: t(
    'in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCalls.includeSyntheticCalls'
  )
});
