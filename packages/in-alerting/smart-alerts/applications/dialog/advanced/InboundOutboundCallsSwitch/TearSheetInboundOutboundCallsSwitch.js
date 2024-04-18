/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { tearSheetBoundaryScopes as boundaryScopes } from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/config';
import InboundOrAllCallsOption from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import {
  hasSubEntitySelection,
  resetEntitySelection
} from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function TearSheetInboundOutboundCallsSwitch({ form, updateForm, isGlobalSmartAlert }) {
  const boundaryScope = form.get('boundaryScope').value;
  const applications = form.get('applications').value;

  return (
    <div>
      <Row>
        <Col lg={6}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() => handleChangeToInboundCalls()}
            scope={boundaryScopes.inbound}
            boundaryScopes={boundaryScopes}
          />
        </Col>
        <Col lg={6}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.all)}
            scope={boundaryScopes.all}
            boundaryScopes={boundaryScopes}
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
            'in-alerting:smartAlerts.applications.advanced.inboundOutboundCalls.confirmationDialog.pleaseConfirm'
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
