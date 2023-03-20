/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { syntheticAlertListPath, syntheticSmartAlertsPath } from 'in-synthetics/navigation/paths';
import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';
import AlertConfigDialog from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { CreateSmartAlertProps } from 'in-alerting/smart-alerts/synthetics/CreateSmartAlert';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { close } from 'in-components/DialogPresenter/store';
import { reload } from 'in-settings/components/List';

export default function CreateSmartAlertDialog({ testId }: CreateSmartAlertProps) {
  const alertConfig = generateAlertConfig(testId ? [testId] : []);
  const location = useLocation();
  return (
    <AlertConfigDialog
      onClose={() => {
        close();
        if (
          location.pathname.includes(syntheticAlertListPath) ||
          location.pathname.includes(syntheticSmartAlertsPath)
        ) {
          reload();
        }
      }}
      editMode={false}
      alertConfig={alertConfig}
      startWithSimpleMode
    />
  );
}
