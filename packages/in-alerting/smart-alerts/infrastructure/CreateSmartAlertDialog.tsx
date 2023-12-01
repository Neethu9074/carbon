/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import AlertConfigDialog from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/AlertConfigDialog';
import generateAlertConfig from 'in-alerting/smart-alerts/infrastructure/data/generateAlertConfig';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { infraSmartAlerts } from 'in-stores/navigation/paths/mainPaths';
import { close } from 'in-components/DialogPresenter/store';

export default function CreateSmartAlertDialog() {
  const alertConfig = generateAlertConfig();
  const location = useLocation();
  return (
    <AlertConfigDialog
      onClose={() => {
        close();
        if (location.pathname.includes(infraSmartAlerts)) {
          refreshSmartAlertConfigsList();
        }
      }}
      editMode={false}
      alertConfig={alertConfig}
      startWithSimpleMode={false}
    />
  );
}
