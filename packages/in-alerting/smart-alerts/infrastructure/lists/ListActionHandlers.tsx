/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

// import {
//   TearSheetEditActionHandler,
//   TearSheetCloneActionHandler
// } from 'in-alerting/smart-alerts/infrastructure/lists/TearSheetActionHandlers';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/AlertConfigDialog';
import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { infraSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

function handleEdit(config: InfraSmartAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

// function HandleEditNew(config: InfraSmartAlertConfigWithMetadata) {
//   return <TearSheetEditActionHandler id={config.id} created={config.created} alertConfig={config} />;
// }

// function HandleCloneNew(config: InfraSmartAlertConfigWithMetadata) {
//   return <TearSheetCloneActionHandler id={config.id} created={config.created} alertConfig={config} />;
// }

function openSmartAlertDialog(config: InfraSmartAlertConfigWithMetadata, isCopy = false) {
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
  ...(!infraSmartAlertFullScreenDesignEnabled && {
    handleEdit: (config: InfraSmartAlertConfigWithMetadata) => handleEdit(config)
  }),
  // ...(infraSmartAlertFullScreenDesignEnabled && {
  //   handleEditNew: (config: InfraSmartAlertConfigWithMetadata) => HandleEditNew(config)
  // }),
  ...(infraSmartAlertFullScreenDesignEnabled && {
    handleEditSelector: (config: InfraSmartAlertConfigWithMetadata) => handleEdit(config)
  }),
  ...(!infraSmartAlertFullScreenDesignEnabled && {
    handleClone: (config: InfraSmartAlertConfigWithMetadata) => handleClone(config)
  }),
  // ...(infraSmartAlertFullScreenDesignEnabled && {
  //   handleCloneNew: (config: InfraSmartAlertConfigWithMetadata) => HandleCloneNew(config)
  // }),
  ...(infraSmartAlertFullScreenDesignEnabled && {
    handleCloneSelector: (config: InfraSmartAlertConfigWithMetadata) => handleClone(config)
  }),
  handleDelete: (
    id: string,
    setIsSaving: (saving: boolean) => void,
    configName: string,
    trackCta: CtaTrackingFunction
  ) => handleDelete(id, setIsSaving, configName, baseUrl.INFRA, trackCta),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving, baseUrl.INFRA)
};

function handleClone(config: InfraSmartAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}
