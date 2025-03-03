/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  TearSheetEditActionHandler,
  TearSheetCloneActionHandler
} from 'in-alerting/smart-alerts/logs/lists/TearSheetActionHandlers';
import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { logSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

function handleEdit(config: LogSmartAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

function HandleEditNew(config: LogSmartAlertConfigWithMetadata) {
  return <TearSheetEditActionHandler id={config.id} created={config.created} />;
}

function HandleCloneNew(config: LogSmartAlertConfigWithMetadata) {
  return <TearSheetCloneActionHandler id={config.id} created={config.created} />;
}

function openSmartAlertDialog(config: LogSmartAlertConfigWithMetadata, isCopy = false) {
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

function handleClone(config: LogSmartAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}

export const actionHandlers = {
  handleEdit: (config: LogSmartAlertConfigWithMetadata) => handleEdit(config),
  ...(logSmartAlertFullScreenDesignEnabled && {
    handleEditNew: (config: LogSmartAlertConfigWithMetadata) => HandleEditNew(config)
  }),
  handleClone: (config: LogSmartAlertConfigWithMetadata) => handleClone(config),
  ...(logSmartAlertFullScreenDesignEnabled && {
    handleCloneNew: (config: LogSmartAlertConfigWithMetadata) => HandleCloneNew(config)
  }),
  handleDelete: (
    id: string,
    setIsSaving: (saving: boolean) => void,
    configName: string,
    trackCta: CtaTrackingFunction
  ) => handleDelete(id, setIsSaving, configName, baseUrl.LOGS, trackCta),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving, baseUrl.LOGS)
};
