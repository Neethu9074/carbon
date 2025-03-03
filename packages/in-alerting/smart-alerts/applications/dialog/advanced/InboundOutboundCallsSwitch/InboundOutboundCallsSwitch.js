/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import InboundOrAllCallsOption from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import {
  hasSubEntitySelection,
  resetEntitySelection
} from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { boundaryScopes } from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/config';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsSwitch.mless';

export default function InboundOutboundCallsSwitch({ form, updateForm, isGlobalSmartAlert, tearSheetView }) {
  const boundaryScope = form.get('boundaryScope').value;
  const applications = form.get('applications').value;

  return (
    <div className={classNames({ [locals.inboundOutboundCallsSwitchContainer]: !tearSheetView })}>
      <Row>
        <Col lg={6} md={6} className={classNames({ [locals.gap]: tearSheetView })}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() => handleChangeToInboundCalls()}
            scope={boundaryScopes.inbound}
            tearSheetView={tearSheetView}
          />
        </Col>
        <Col lg={6} md={6} className={classNames({ [locals.gap]: tearSheetView })}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.all)}
            scope={boundaryScopes.all}
            tearSheetView={tearSheetView}
          />
        </Col>
      </Row>
    </div>
  );

  function updateBoundaryScope(boundaryScope) {
    updateForm(form.updateIn(['boundaryScope'], f => f.setValue(boundaryScope).setTouched(true)));
  }

  function updateBoundaryScopeAndResetSelection(boundaryScope) {
    const updatedApplications = resetEntitySelection(isGlobalSmartAlert, applications);
    let updatedForm = form
      .updateIn(['boundaryScope'], f => f.setValue(boundaryScope).setTouched(true))
      .updateIn(['applications'], f => f.setValue(updatedApplications).setTouched(true));
    updateForm(updatedForm);
  }

  function handleChangeToInboundCalls() {
    const applications = form.get('applications').value;
    const shouldPromptConfirmDialog = hasSubEntitySelection(applications);

    if (shouldPromptConfirmDialog) {
      addActiveDialog(
        <ConfirmationDialog
          header={t(
            'in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.confirmationDialog.confirmRemove'
          )}
          description={t(
            'in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.confirmationDialog.description'
          )}
          confirmButtonLabel={t(
            'in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.confirmationDialog.confirmButtonLabel'
          )}
          confirmButtonKind="primary"
          onSubmit={() => {
            updateBoundaryScopeAndResetSelection(boundaryScopes.inbound);
            close();
          }}
        />
      );
    } else {
      updateBoundaryScope(boundaryScopes.inbound);
    }
  }
}
