/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import AlertConfigDialog from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/AlertConfigDialog';
import generateAlertConfig from 'in-alerting/smart-alerts/infrastructure/data/generateAlertConfig';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { infraSmartAlerts } from 'in-stores/navigation/paths/mainPaths';
import { close } from 'in-components/DialogPresenter/store';
import { events } from 'in-settings/navigation/paths';

export default function CreateSmartAlertDialog() {
  const alertConfig = generateAlertConfig();
  const location = useLocation();
  return (
    <AlertConfigDialog
      onClose={() => {
        close();
        if (location.pathname.includes(infraSmartAlerts) || location.pathname.includes(events)) {
          refreshSmartAlertConfigsList();
        }
      }}
      editMode={false}
      alertConfig={alertConfig}
      startWithSimpleMode={false}
    />
  );
}
