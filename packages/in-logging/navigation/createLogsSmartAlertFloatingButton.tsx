/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import CreateSmartAlert from 'in-alerting/smart-alerts/logs/CreateSmartAlert';
import { role } from 'in-stores/user';

export function CreateLogsSmartAlertFloatingButton() {
  return (
    (role?.canConfigureGlobalLogSmartAlerts && (
      <FloatingActionButtons>
        <CreateSmartAlert />
      </FloatingActionButtons>
    )) ||
    null
  );
}
