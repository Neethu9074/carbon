/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig
} from 'in-alerting/smart-alerts/components/api/smartAlertConfig';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { ActionHandlers } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { trackAlertDeleteConfirm } from 'in-alerting/smart-alerts/components/tracker';
import AlertConfigDialog from 'in-alerting/smart-alerts/slo/dialog/AlertConfigDialog';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';

function openSmartAlertDialog(config: ServiceLevelsAlertConfigWithMetadata, isCopy: boolean) {
  addActiveDialog(
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(config) : config}
      onClose={() => {
        close();
        refreshSmartAlertConfigsList();
      }}
      editMode={!isCopy}
    />
  );
}

const handleToggleEnabled: ActionHandlers<ServiceLevelsAlertConfigWithMetadata>['handleToggleEnabled'] = (
  enabled,
  id,
  setIsSaving
) => {
  setIsSaving(true);

  (enabled ? disableAlertConfig(id, baseUrl.SLO) : enableAlertConfig(id, baseUrl.SLO)).once(
    () => {
      refreshSmartAlertConfigsList();
    },
    () => {
      setIsSaving(false);
    }
  );
};

const handleDelete: ActionHandlers<ServiceLevelsAlertConfigWithMetadata>['handleDelete'] = (
  id,
  setIsSaving,
  configName
) => {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-alerting:smartAlerts.components.list.labelConfirm')}
      description={
        <span>
          <Trans i18nKey="in-alerting:smartAlerts.components.list.labelConfirmRemoveConfig" values={{ configName }} />
        </span>
      }
      confirmButtonLabel={t('in-alerting:smartAlerts.components.list.labelRemove')}
      onSubmit={() => {
        setIsSaving(true);
        close();
        deleteAlertConfig(id, baseUrl.SLO).once(
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
};

function handleClone(config: ServiceLevelsAlertConfigWithMetadata) {
  openSmartAlertDialog(config, true);
}

function handleEdit(config: ServiceLevelsAlertConfigWithMetadata) {
  openSmartAlertDialog(config, false);
}

export function getActionHandlers(
  config: ServiceLevelsAlertConfigWithMetadata
): ActionHandlers<ServiceLevelsAlertConfigWithMetadata> {
  return {
    ...(config?.rule?.metric !== 'BURN_RATE' && {
      handleEdit: (config: ServiceLevelsAlertConfigWithMetadata) => handleEdit(config)
    }),
    ...(config?.rule?.metric !== 'BURN_RATE' && {
      handleClone: (config: ServiceLevelsAlertConfigWithMetadata) => handleClone(config)
    }),
    handleToggleEnabled,
    handleDelete
  };
}
