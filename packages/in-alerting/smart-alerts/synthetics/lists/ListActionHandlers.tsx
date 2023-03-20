/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig
} from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { SyntheticAlertConfig, SyntheticAlertConfigWithMetadata, VersionedConfig } from 'in-types';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { ActionHandlers } from 'in-alerting/smart-alerts/components/AlertsBaseList';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';

function handleDelete(id: string, setIsSaving: (saving: boolean) => void, configName: string) {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-alerting:smartAlerts.applications.inventory.labelConfirm')}
      description={
        <span>
          <Trans
            i18nKey="in-alerting:smartAlerts.applications.inventory.labelConfirmRemoveConfig"
            values={{ configName }}
          />
        </span>
      }
      confirmButtonLabel={t('in-alerting:smartAlerts.applications.inventory.labelRemove')}
      onSubmit={() => {
        setIsSaving(true);
        close();
        deleteAlertConfig(id).once(
          () => {
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

function handleToggleEnabled(enabled: boolean, id: string, setIsSaving: (saving: boolean) => void) {
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

function handleClone(config: SyntheticAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}

function handleEdit(config: SyntheticAlertConfigWithMetadata) {
  openSmartAlertDialog(config);
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
  handleClone: config => handleClone(config),
  handleDelete: (id, setIsSaving, configName) => handleDelete(id, setIsSaving, configName),
  handleEdit: config => handleEdit(config),
  handleToggleEnabled: (enabled, id, setIsSaving) => handleToggleEnabled(enabled, id, setIsSaving)
};
