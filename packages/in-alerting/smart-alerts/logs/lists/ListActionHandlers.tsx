/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { LogAlertConfigWithMetadata } from 'in-types';

function handleEdit(config: LogAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

function openSmartAlertDialog(config: LogAlertConfigWithMetadata, isCopy = false) {
  addActiveDialog(
    <SmartAlertConfigDialogWrapper
      alertConfig={isCopy ? duplicateAlertConfig(config) : config}
      onClose={() => {
        close();
        refreshSmartAlertConfigsList();
      }}
      editMode={!isCopy}
      startWithSimpleMode={false}
    />
  );
}

function handleClone(config: LogAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}

export const actionHandlers = {
  handleEdit: (config: LogAlertConfigWithMetadata) => handleEdit(config),
  handleClone: (config: LogAlertConfigWithMetadata) => handleClone(config),
  handleDelete: (
    id: string,
    setIsSaving: (saving: boolean) => void,
    configName: string,
    trackCta: CtaTrackingFunction
  ) => handleDelete(id, setIsSaving, configName, baseUrl.LOGS, trackCta),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving, baseUrl.LOGS)
};
