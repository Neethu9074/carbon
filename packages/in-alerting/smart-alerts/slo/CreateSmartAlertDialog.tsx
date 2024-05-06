/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { createNewAlertConfig } from 'in-alerting/smart-alerts/slo/data/sloAlertConfig';
import AlertConfigDialog from 'in-alerting/smart-alerts/slo/dialog/AlertConfigDialog';
import { serviceLevelsObjectiveAlerts } from 'in-service-levels/navigation/path';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { close } from 'in-components/DialogPresenter/store';

export default function CreateSmartAlertDialog() {
  const location = useLocation();
  const alertConfig = createNewAlertConfig();

  return (
    <AlertConfigDialog
      onClose={() => {
        close();
        if (location.pathname.includes(serviceLevelsObjectiveAlerts)) {
          refreshSmartAlertConfigsList();
        }
      }}
      editMode={false}
      alertConfig={alertConfig}
    />
  );
}
