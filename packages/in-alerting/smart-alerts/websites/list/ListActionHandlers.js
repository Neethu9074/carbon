/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  websitesAlertingAlertEdit,
  websitesAlertingListAlertDeleted,
  websitesAlertingListAlertPaused,
  websitesAlertingListAlertResumed
} from 'in-alerting/smart-alerts/websites/tracker';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig
} from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';

function handleDelete(id, setIsSaving, configName) {
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
            websitesAlertingListAlertDeleted({
              alertConfigId: id
            });
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

function handleToggleEnabled(enabled, id, setIsSaving) {
  setIsSaving(true);

  (enabled ? disableAlertConfig(id) : enableAlertConfig(id)).once(
    () => {
      (enabled ? websitesAlertingListAlertPaused : websitesAlertingListAlertResumed)({
        alertConfigId: id
      });
      refreshSmartAlertConfigsList();
    },
    () => {
      setIsSaving(false);
    }
  );
}

function handleClone(config) {
  openSmartAlertDialog(config, true);
  websitesAlertingAlertEdit({ alertConfigId: config.id });
}

function handleEdit(config) {
  openSmartAlertDialog(config);
  websitesAlertingAlertEdit({ alertConfigId: config.id });
}

function openSmartAlertDialog(config, isCopy = false) {
  addActiveDialog(
    <SmartAlertConfigDialogWrapper
      applicationLabel={config.name}
      alertConfig={isCopy ? duplicateAlertConfig(config) : config}
      onClose={() => {
        close();
        refreshSmartAlertConfigsList();
      }}
      editMode={!isCopy}
    />
  );
}

export const actionHandlers = () => ({
  handleClone: config => handleClone(config),
  handleDelete: (id, setIsSaving, configName) => handleDelete(id, setIsSaving, configName),
  handleEdit: config => handleEdit(config),
  handleToggleEnabled: (enabled, id, setIsSaving) => handleToggleEnabled(enabled, id, setIsSaving)
});
