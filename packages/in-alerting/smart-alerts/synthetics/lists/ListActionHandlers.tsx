/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// import {
//   TearSheetEditActionHandler,
//   TearSheetCloneActionHandler
// } from 'in-alerting/smart-alerts/synthetics/lists/TearSheetActionHandlers';
import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { SyntheticAlertConfig, SyntheticAlertConfigWithMetadata, VersionedConfig } from 'in-types';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { ActionHandlers } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { syntheticSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

function handleClone(config: SyntheticAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}

function handleEdit(config: SyntheticAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

// function HandleEditNew(config: SyntheticAlertConfigWithMetadata) {
//   return <TearSheetEditActionHandler id={config.id} created={config.created} alertConfig={config} />;
// }

// function HandleCloneNew(config: SyntheticAlertConfigWithMetadata) {
//   return <TearSheetCloneActionHandler id={config.id} created={config.created} alertConfig={config} />;
// }

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
  ...(!syntheticSmartAlertFullScreenDesignEnabled && { handleClone: config => handleClone(config) }),
  ...(syntheticSmartAlertFullScreenDesignEnabled && {
    handleEditSelector: (config: SyntheticAlertConfigWithMetadata) => handleEdit(config)
  }),
  // ...(syntheticSmartAlertFullScreenDesignEnabled && {
  //   handleCloneNew: (config: SyntheticAlertConfigWithMetadata) => HandleCloneNew(config)
  // }),
  handleDelete: (id, setIsSaving, configName, trackCta) =>
    handleDelete(id, setIsSaving, configName, baseUrl.SYNTHETICS, trackCta),
  ...(!syntheticSmartAlertFullScreenDesignEnabled && { handleEdit: config => handleEdit(config) }),
  // ...(syntheticSmartAlertFullScreenDesignEnabled && {
  //   handleEditNew: (config: SyntheticAlertConfigWithMetadata) => HandleEditNew(config)
  // }),
  ...(syntheticSmartAlertFullScreenDesignEnabled && {
    handleCloneSelector: (config: SyntheticAlertConfigWithMetadata) => handleClone(config)
  }),
  handleToggleEnabled: (enabled, id, setIsSaving) => handleToggleEnabled(enabled, id, setIsSaving, baseUrl.SYNTHETICS)
};
