/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import AlertConfigDialog from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import generateAlertConfig from 'in-alerting/smart-alerts/logs/data/generateAlertConfig';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { close } from 'in-components/DialogPresenter/store';
import { alertsPath } from 'in-logging/navigation/paths';

export default function CreateSmartAlertDialog() {
  const alertConfig = generateAlertConfig();
  const location = useLocation();
  return (
    <AlertConfigDialog
      onClose={() => {
        close();
        if (location.pathname.includes(alertsPath)) {
          refreshSmartAlertConfigsList();
        }
      }}
      editMode={false}
      alertConfig={alertConfig}
      startWithSimpleMode={false}
    />
  );
}
