/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Typography } from '@instana/components';
import { SvgIcon } from '@instana/components';

import {
  hasSubEntitySelection,
  resetEntitySelection
} from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/IncludeInternalOrSyntheticCallsSwitch/InboundOrAllCallsSwitch.mless';

export default function IncludeInternalOrSyntheticCallsSwitch({
  form,
  updateForm,
  isGlobalSmartAlert,
  isTearsheet = false
}) {
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  const applications = form.get('applications').value;

  const includeInternalLabelContent = getLabelDescriptionWithIcon(
    'lib_application_call',
    callLabels['includeInternal'],
    t('in-alerting:smartAlerts.applications.tearSheet.hiddenCalls.config.includeInternal.text')
  );

  const includeSyntheticLabelContent = getLabelDescriptionWithIcon(
    'lib_synthetic',
    callLabels['includeSynthetic'],
    t('in-alerting:smartAlerts.applications.tearSheet.hiddenCalls.config.includeSynthetic.text')
  );

  return (
    <div
      className={classNames({
        [locals.container]: !isTearsheet
      })}
    >
      <Row>
        <Col lg={6} className={locals.column}>
          <CheckboxFancy
            label={isTearsheet ? includeInternalLabelContent : callLabels['includeInternal']}
            checked={includeInternal}
            onChange={() => handleChange('includeInternal', includeInternal)}
          />
        </Col>
        <Col lg={6} className={locals.column}>
          <CheckboxFancy
            label={isTearsheet ? includeSyntheticLabelContent : callLabels['includeSynthetic']}
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

function getLabelDescriptionWithIcon(icon, label, description) {
  return (
    <div className={locals.wrapper}>
      <SvgIcon type={icon} className={locals.icon} />
      <div className={locals.content}>
        <Typography variant="body-large">
          <div className={locals.title}>{label}</div>
        </Typography>
        <div className={locals.description}>
          <Typography variant="body-small">
            <p className={locals.description}>{description}</p>
          </Typography>
        </div>
      </div>
    </div>
  );
}
