/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MobileAppAlertConfigWithMetadata } from '@instana/types';

import { handleDelete, handleToggleEnabled } from 'in-alerting/smart-alerts/components/list/ListActionHandlers';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';

function handleEdit(config: MobileAppAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
}

function openSmartAlertDialog(config: MobileAppAlertConfigWithMetadata, isCopy = false) {
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
  handleClone: (config: MobileAppAlertConfigWithMetadata) => handleClone(config),
  handleDelete: (
    id: string,
    setIsSaving: (saving: boolean) => void,
    configName: string,
    trackCta: CtaTrackingFunction
  ) => handleDelete(id, setIsSaving, configName, baseUrl.MOBILEAPP, trackCta),
  handleEdit: (config: MobileAppAlertConfigWithMetadata) => handleEdit(config),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving, baseUrl.MOBILEAPP)
};

function handleClone(config: MobileAppAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}
