/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import CreateSmartAlertDialog from 'in-alerting/smart-alerts/synthetics/CreateSmartAlertDialog';
import { AlertsProps } from 'in-alerting/smart-alerts/synthetics/Alerts';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { t } from 'in-i18n';

export default function CreateSmartAlert({ testId }: AlertsProps) {
  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        addActiveDialog(<CreateSmartAlertDialog testId={testId} />);
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}
