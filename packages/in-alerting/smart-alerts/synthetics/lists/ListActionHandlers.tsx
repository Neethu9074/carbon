/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { SyntheticAlertConfig, SyntheticAlertConfigWithMetadata, VersionedConfig } from 'in-types';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { ActionHandlers } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

function handleClone(config: SyntheticAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}

function handleEdit(config: SyntheticAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

function openSmartAlertDialog(config: SyntheticAlertConfig & VersionedConfig, isCopy = false) {
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

export const actionHandlers: ActionHandlers<SyntheticAlertConfigWithMetadata> = {
  handleClone: config => handleClone(config),
  handleDelete: (id, setIsSaving, configName, trackCta) =>
    handleDelete(id, setIsSaving, configName, baseUrl.SYNTHETICS, trackCta),
  handleEdit: config => handleEdit(config),
  handleToggleEnabled: (enabled, id, setIsSaving) => handleToggleEnabled(enabled, id, setIsSaving, baseUrl.SYNTHETICS)
};
