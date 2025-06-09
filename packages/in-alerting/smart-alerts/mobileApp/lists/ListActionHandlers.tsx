/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  TearSheetEditActionHandler,
  TearSheetCloneActionHandler
} from 'in-alerting/smart-alerts/eum/components/TearSheet/TearSheetActionHandlers';
import {
  mobileAppSmartAlertFullScreenDesignEnabled,
  mobileAppSmartAlertDialogViewEnabled
} from 'in-services/featureFlags';
import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { DIALOG, FULLSCREEN, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { eumType } from 'in-alerting/smart-alerts/mobileApp/constants';

const alertDisplayMode = getSmartAlertDisplayMode(
  mobileAppSmartAlertDialogViewEnabled,
  mobileAppSmartAlertFullScreenDesignEnabled
);

function handleEdit(config: MobileAppSmartAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

function openSmartAlertDialog(config: MobileAppSmartAlertConfigWithMetadata, isCopy = false) {
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

function HandleEditNew(config: MobileAppSmartAlertConfigWithMetadata) {
  return (
    <TearSheetEditActionHandler
      id={config.id}
      created={config.created}
      eumId={config.mobileAppId}
      eumType={eumType}
      alertConfig={config}
    />
  );
}

function HandleCloneNew(config: MobileAppSmartAlertConfigWithMetadata) {
  return (
    <TearSheetCloneActionHandler
      id={config.id}
      created={config.created}
      eumId={config.mobileAppId}
      eumType={eumType}
      alertConfig={config}
    />
  );
}

export const actionHandlers = {
  ...(alertDisplayMode === DIALOG && {
    handleClone: (config: MobileAppSmartAlertConfigWithMetadata) => handleClone(config)
  }),
  ...(alertDisplayMode === CHOICE_DIALOG && {
    handleCloneSelector: (config: MobileAppSmartAlertConfigWithMetadata) => handleClone(config)
  }),
  ...(alertDisplayMode === FULLSCREEN && {
    handleCloneNew: (config: MobileAppSmartAlertConfigWithMetadata) => HandleCloneNew(config)
  }),
  handleDelete: (
    id: string,
    setIsSaving: (saving: boolean) => void,
    configName: string,
    trackCta: CtaTrackingFunction
  ) => handleDelete(id, setIsSaving, configName, baseUrl.MOBILEAPP, trackCta),
  ...(alertDisplayMode === DIALOG && {
    handleEdit: (config: MobileAppSmartAlertConfigWithMetadata) => handleEdit(config)
  }),
  ...(alertDisplayMode === CHOICE_DIALOG && {
    handleEditSelector: (config: MobileAppSmartAlertConfigWithMetadata) => handleEdit(config)
  }),
  ...(alertDisplayMode === FULLSCREEN && {
    handleEditNew: (config: MobileAppSmartAlertConfigWithMetadata) => HandleEditNew(config)
  }),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving, baseUrl.MOBILEAPP)
};

function handleClone(config: MobileAppSmartAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}
