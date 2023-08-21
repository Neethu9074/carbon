/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  disableAlertConfig,
  enableAlertConfig,
  deleteAlertConfig
} from 'in-alerting/smart-alerts/infrastructure/api/infrastructureAlertConfig';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
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

export const actionHandlers = {
  handleDelete: (id: string, setIsSaving: (saving: boolean) => void, configName: string) =>
    handleDelete(id, setIsSaving, configName),
  handleToggleEnabled: (enabled: boolean, id: string, setIsSaving: (arg: boolean) => void) =>
    handleToggleEnabled(enabled, id, setIsSaving)
};
