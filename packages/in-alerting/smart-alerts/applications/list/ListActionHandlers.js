/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  trackAlertEdit,
  trackAlertPaused,
  trackAlertResumed,
  trackAlertDeleteConfirm,
  trackAlertCloneTrigger
} from 'in-alerting/smart-alerts/components/tracker';
import {
  deleteGlobalAlertConfig,
  disableGlobalAlertConfig,
  enableGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig
} from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';

function handleDelete(id, setIsSaving, configName, isGlobalSmartAlertConfig) {
  const deleteConfig = isGlobalSmartAlertConfig ? deleteGlobalAlertConfig : deleteAlertConfig;

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
        deleteConfig(id).once(
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

function handleToggleEnabled(enabled, id, setIsSaving, isGlobalSmartAlertConfig) {
  const disableConfig = isGlobalSmartAlertConfig ? disableGlobalAlertConfig : disableAlertConfig;
  const enableConfig = isGlobalSmartAlertConfig ? enableGlobalAlertConfig : enableAlertConfig;

  setIsSaving(true);

  (enabled ? disableConfig(id) : enableConfig(id)).once(
    () => {
      (enabled ? trackAlertPaused : trackAlertResumed)({
        alertConfigId: id
      });
      refreshSmartAlertConfigsList();
    },
    () => {
      setIsSaving(false);
    }
  );
}

function handleClone(config, isGlobalSmartAlertConfig) {
  openSmartAlertDialog(config, isGlobalSmartAlertConfig, true);
  trackAlertCloneTrigger(config);
}

function handleEdit(config, isGlobalSmartAlertConfig) {
  openSmartAlertDialog(config, isGlobalSmartAlertConfig);
  trackAlertEdit(config);
}

function openSmartAlertDialog(config, isGlobalSmartAlertConfig, isCopy = false) {
  addActiveDialog(
    <AlertConfigDialog
      applicationLabel={config.name}
      alertConfig={isCopy ? duplicateAlertConfig(config) : config}
      onClose={() => {
        close();
        refreshSmartAlertConfigsList();
      }}
      isGlobalSmartAlert={isGlobalSmartAlertConfig}
      editMode={!isCopy}
    />
  );
}

export function actionHandlers(isGlobalSmartAlertConfig) {
  return {
    handleClone: function (config) {
      handleClone(config, isGlobalSmartAlertConfig);
    },
    handleDelete: function (id, setIsSaving, configName) {
      handleDelete(id, setIsSaving, configName, isGlobalSmartAlertConfig);
    },
    handleEdit: function (config) {
      handleEdit(config, isGlobalSmartAlertConfig);
    },
    handleToggleEnabled: function (enabled, id, setIsSaving) {
      handleToggleEnabled(enabled, id, setIsSaving, isGlobalSmartAlertConfig);
    }
  };
}
