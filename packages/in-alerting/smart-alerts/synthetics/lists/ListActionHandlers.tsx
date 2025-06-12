/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  TearSheetEditActionHandler,
  TearSheetCloneActionHandler
} from 'in-alerting/smart-alerts/synthetics/lists/TearSheetActionHandlers';
import {
  syntheticSmartAlertFullScreenDesignEnabled,
  syntheticSmartAlertDialogViewEnabled
} from 'in-services/featureFlags';
import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { SyntheticAlertConfig, SyntheticAlertConfigWithMetadata, VersionedConfig } from 'in-types';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { DIALOG, FULLSCREEN, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import { ActionHandlers } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

const alertDisplayMode = getSmartAlertDisplayMode(
  syntheticSmartAlertDialogViewEnabled,
  syntheticSmartAlertFullScreenDesignEnabled
);

function handleClone(config: SyntheticAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}

function handleEdit(config: SyntheticAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

function HandleEditNew(config: SyntheticAlertConfigWithMetadata) {
  return <TearSheetEditActionHandler id={config.id} created={config.created} alertConfig={config} />;
}

function HandleCloneNew(config: SyntheticAlertConfigWithMetadata) {
  return <TearSheetCloneActionHandler id={config.id} created={config.created} alertConfig={config} />;
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
  ...(alertDisplayMode === DIALOG && { handleClone: config => handleClone(config) }),
  ...(alertDisplayMode === CHOICE_DIALOG && {
    handleEditSelector: (config: SyntheticAlertConfigWithMetadata) => handleEdit(config)
  }),
  ...(alertDisplayMode === FULLSCREEN && {
    handleCloneNew: (config: SyntheticAlertConfigWithMetadata) => HandleCloneNew(config)
  }),
  handleDelete: (id, setIsSaving, configName, trackCta) =>
    handleDelete(id, setIsSaving, configName, baseUrl.SYNTHETICS, trackCta),
  ...(alertDisplayMode === DIALOG && { handleEdit: config => handleEdit(config) }),
  ...(alertDisplayMode === FULLSCREEN && {
    handleEditNew: (config: SyntheticAlertConfigWithMetadata) => HandleEditNew(config)
  }),
  ...(alertDisplayMode === CHOICE_DIALOG && {
    handleCloneSelector: (config: SyntheticAlertConfigWithMetadata) => handleClone(config)
  }),
  handleToggleEnabled: (enabled, id, setIsSaving) => handleToggleEnabled(enabled, id, setIsSaving, baseUrl.SYNTHETICS)
};
