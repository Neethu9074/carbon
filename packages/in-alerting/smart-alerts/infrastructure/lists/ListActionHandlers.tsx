/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InfraAlertConfigWithMetadata } from '@instana/types';

import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/AlertConfigDialog';
import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

function handleEdit(config: InfraAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

function openSmartAlertDialog(config: InfraAlertConfigWithMetadata, isCopy = false) {
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

export const actionHandlers = {
  handleEdit: (config: InfraAlertConfigWithMetadata) => handleEdit(config),
  handleClone: (config: InfraAlertConfigWithMetadata) => handleClone(config),
  handleDelete: (id: string, setIsSaving: (saving: boolean) => void, configName: string) =>
    handleDelete(id, setIsSaving, configName, baseUrl.INFRA),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving, baseUrl.INFRA)
};

function handleClone(config: InfraAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}
