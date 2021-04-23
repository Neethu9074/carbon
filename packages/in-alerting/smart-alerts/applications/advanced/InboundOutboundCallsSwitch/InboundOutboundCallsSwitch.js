/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEmpty } from 'lodash';
import React from 'react';

import InboundOrAllCallsOption from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsOption';
import { boundaryScopes } from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/config';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-new-components/Dialog/ConfirmationDialog';
import { Col, Row } from 'in-new-components/layout/Grid';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/advanced/InboundOutboundCallsSwitch/InboundOrAllCallsSwitch.mless';

export default function InboundOutboundCallsSwitch({ form, updateForm }) {
  const boundaryScope = form.get('boundaryScope').value;

  return (
    <div className={locals.inboundOutboundCallsSwitchContainer}>
      <Row>
        <Col lg={6}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() => handleChangeToInboundCalls()}
            scope={boundaryScopes.inbound}
          />
        </Col>
        <Col lg={6}>
          <InboundOrAllCallsOption
            boundaryScope={boundaryScope}
            onBoundaryStateChange={() => updateBoundaryScope(boundaryScopes.all)}
            scope={boundaryScopes.all}
          />
        </Col>
      </Row>
    </div>
  );

  function updateBoundaryScope(boundaryScope) {
    updateForm(
      form
        .updateIn(['boundaryScope'], f => f.setValue(boundaryScope).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }

  function handleChangeToInboundCalls() {
    if (shouldPromptConfirmDialog()) {
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
          onSubmit={() => {
            updateBoundaryScope(boundaryScopes.inbound);
            close();
          }}
        />
      );
    } else {
      updateBoundaryScope(boundaryScopes.inbound);
    }
  }

  function shouldPromptConfirmDialog() {
    const applications = form.get('applications').value;

    return Object.values(applications ?? {}).some(({ services }) => !isEmpty(services));
  }
}
