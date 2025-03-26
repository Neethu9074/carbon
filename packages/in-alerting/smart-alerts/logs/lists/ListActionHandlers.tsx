/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { logSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

// TODO revert this back
// import {
//   TearSheetEditActionHandler,
//   TearSheetCloneActionHandler
// } from 'in-alerting/smart-alerts/logs/lists/TearSheetActionHandlers';

function handleEdit(config: LogSmartAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

// TODO add it back when FF checking is done
// function HandleEditNew(config: LogSmartAlertConfigWithMetadata) {
//   return <TearSheetEditActionHandler id={config.id} created={config.created} alertConfig={config} />;
// }

// function HandleCloneNew(config: LogSmartAlertConfigWithMetadata) {
//   return <TearSheetCloneActionHandler id={config.id} created={config.created} alertConfig={config} />;
// }

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
  // TODO chnage when FF for edit
  ...(!logSmartAlertFullScreenDesignEnabled && {
    handleEdit: (config: LogSmartAlertConfigWithMetadata) => handleEdit(config)
  }),
  ...(logSmartAlertFullScreenDesignEnabled && {
    handleEditSelector: (config: LogSmartAlertConfigWithMetadata) => handleEdit(config)
  }),
  // handleEditNew: (config: LogSmartAlertConfigWithMetadata) => HandleEditNew(config),
  // TODO chnage when FF for clone
  ...(!logSmartAlertFullScreenDesignEnabled && {
    handleClone: (config: LogSmartAlertConfigWithMetadata) => handleClone(config)
  }),
  ...(logSmartAlertFullScreenDesignEnabled && {
    handleCloneSelector: (config: LogSmartAlertConfigWithMetadata) => handleClone(config)
  }),
  // handleCloneNew: (config: LogSmartAlertConfigWithMetadata) => HandleCloneNew(config)
  handleDelete: (
    id: string,
    setIsSaving: (saving: boolean) => void,
    configName: string,
    trackCta: CtaTrackingFunction
  ) => handleDelete(id, setIsSaving, configName, baseUrl.LOGS, trackCta),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving, baseUrl.LOGS)
};
