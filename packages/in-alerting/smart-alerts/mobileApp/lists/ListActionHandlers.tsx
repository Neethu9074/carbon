/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MobileAppAlertConfigWithMetadata } from '@instana/types';

import {
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { trackAlertDeleteConfirm } from 'in-alerting/smart-alerts/components/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';

function handleDelete(id: string, setIsSaving: (saving: boolean) => void, configName: string) {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-alerting:smartAlerts.inventory.labelConfirm')}
      description={
        <span>
          <Trans i18nKey="in-alerting:smartAlerts.inventory.labelConfirmRemoveConfig" values={{ configName }} />
        </span>
      }
      confirmButtonLabel={t('in-alerting:smartAlerts.inventory.labelRemove')}
      onSubmit={() => {
        setIsSaving(true);
        close();
        deleteAlertConfig(id).once(
          () => {
            trackAlertDeleteConfirm(id);
            refreshSmartAlertConfigsList();
          },
          () => {
            setIsSaving(false);
          }
        );
      }}
    />
  );
}

function handleToggleEnabled(enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) {
  setIsSaving(true);

  (enabled ? disableAlertConfig(id) : enableAlertConfig(id)).once(
    () => {
      refreshSmartAlertConfigsList();
    },
    () => {
      setIsSaving(false);
    }
  );
}

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
  handleDelete: (id: string, setIsSaving: (saving: boolean) => void, configName: string) =>
    handleDelete(id, setIsSaving, configName),
  handleEdit: (config: MobileAppAlertConfigWithMetadata) => handleEdit(config),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving)
};

function handleClone(config: MobileAppAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}
