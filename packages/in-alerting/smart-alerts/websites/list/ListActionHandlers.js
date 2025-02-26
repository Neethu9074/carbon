/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  TearSheetEditActionHandler,
  TearSheetCloneActionHandler
} from 'in-alerting/smart-alerts/websites/list/TearSheetActionHandlers';
import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/websites/details/AlertDetails';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

function handleClone(config) {
  openSmartAlertDialog(config, true);
}

function handleEdit(config) {
  openSmartAlertDialog(config);
}

function HandleEditNew(config) {
  return <TearSheetEditActionHandler id={config.id} created={config.created} websiteId={config.websiteId} />;
}

function HandleCloneNew(config) {
  return <TearSheetCloneActionHandler id={config.id} created={config.created} websiteId={config.websiteId} />;
}

function openSmartAlertDialog(config, isCopy = false) {
  addActiveDialog(
    <SmartAlertConfigDialogWrapper
      applicationLabel={config.name}
      alertConfig={isCopy ? duplicateAlertConfig(config) : config}
      onClose={() => {
        close();
        refreshSmartAlertConfigsList();
      }}
      editMode={!isCopy}
    />
  );
}

export const actionHandlers = {
  handleClone: config => handleClone(config),
  handleCloneNew: config => HandleCloneNew(config),
  handleDelete: (id, setIsSaving, configName, trackCta) =>
    handleDelete(id, setIsSaving, configName, baseUrl.WEBSITE, trackCta),
  handleEdit: config => handleEdit(config),
  handleEditNew: config => HandleEditNew(config),
  handleToggleEnabled: (enabled, id, setIsSaving) => handleToggleEnabled(enabled, id, setIsSaving, baseUrl.WEBSITE)
};
