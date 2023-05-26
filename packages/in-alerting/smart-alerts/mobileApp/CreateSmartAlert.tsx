/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import AlertConfigDialog from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { t } from 'in-i18n';

export default function CreateSmartAlert() {
  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        addActiveDialog(
          <AlertConfigDialog
            onClose={() => {
              close();
            }}
            startWithSimpleMode
          />
        );
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}
