/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Checkbox } from '@instana/components';

import LabelDescriptionWithIcon from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/LabelDescriptionWithIcon';
import {
  hasSubEntitySelection,
  resetEntitySelection
} from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/InboundOrAllCallsSwitch.mless';

export default function IncludeInternalOrSyntheticCallsSwitch({
  form,
  updateForm,
  isGlobalSmartAlert,
  tearSheetView = false
}) {
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const applications = form.get('applications').value;

  const includeInternalLabelContent = (
    <LabelDescriptionWithIcon
      icon={'lib_application_call'}
      label={callLabels['includeInternal']}
      description={t('in-alerting:smartAlerts.applications.tearSheet.hiddenCalls.config.includeInternal.text')}
    />
  );

  const includeSyntheticLabelContent = (
    <LabelDescriptionWithIcon
      icon={'lib_synthetic'}
      label={callLabels['includeSynthetic']}
      description={t('in-alerting:smartAlerts.applications.tearSheet.hiddenCalls.config.includeSynthetic.text')}
    />
  );

  return (
    <div
      className={classNames({
        [locals.container]: !tearSheetView
      })}
    >
      <Row>
        <Col lg={6} md={6} className={classNames({ [locals.column]: !tearSheetView, [locals.gap]: tearSheetView })}>
          <Checkbox
            label={tearSheetView ? includeInternalLabelContent : callLabels['includeInternal']}
            checked={includeInternal}
            onChange={() => handleChange('includeInternal', includeInternal)}
          />
        </Col>
        <Col lg={6} md={6} className={classNames({ [locals.column]: !tearSheetView, [locals.gap]: tearSheetView })}>
          <Checkbox
            label={tearSheetView ? includeSyntheticLabelContent : callLabels['includeSynthetic']}
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
            'in-alerting:smartAlerts.applications.advanced.includeInternalOrSyntheticCalls.confirmationDialog.confirmRemove'
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
