/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import CreateSmartAlertDialog from 'in-alerting/smart-alerts/logs/CreateSmartAlertDialog';
import { trackStartCreate } from 'in-alerting/smart-alerts/components/tracker';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export default function CreateSmartAlert() {
  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        trackStartCreate();
        addActiveDialog(<CreateSmartAlertDialog />);
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}
