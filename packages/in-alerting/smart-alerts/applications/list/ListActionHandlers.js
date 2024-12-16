/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

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
import {
  applicationSmartAlertFullScreenDesignEnabled,
  applicationSmartAlertDialogView
} from 'in-services/featureFlags';
import TearSheetButtonWithLink from 'in-alerting/smart-alerts/applications/components/TearSheetButtonWithLink';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { ALERTING_DELETE_CONFIRM } from 'in-services/tracking/eventNames';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';

function handleDelete(id, setIsSaving, configName, isGlobalSmartAlertConfig, trackCta) {
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
            trackCta(ALERTING_DELETE_CONFIRM, { id });
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
      refreshSmartAlertConfigsList();
    },
    () => {
      setIsSaving(false);
    }
  );
}

function handleClone(config, isGlobalSmartAlertConfig) {
  openSmartAlertDialog(config, isGlobalSmartAlertConfig, true);
}

function handleEdit(config, isGlobalSmartAlertConfig) {
  openSmartAlertDialog(config, isGlobalSmartAlertConfig);
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

export function actionHandlers(isGlobalSmartAlertConfig, trackCta) {
  const editAction = {
    ...(applicationSmartAlertFullScreenDesignEnabled && {
      handleEditNew: function (config) {
        const { created, id } = config;
        return (
          <TearSheetButtonWithLink
            buttonIcon="lib_actions_edit"
            buttonName={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit'))}
            isGlobal={isGlobalSmartAlertConfig}
            alertId={id}
            alertConfigCreated={created}
            editMode
            alertConfig={config}
          />
        );
      }
    }),
    ...(applicationSmartAlertDialogView && {
      handleEdit: function (config) {
        handleEdit(config, isGlobalSmartAlertConfig);
      }
    })
  };

  const duplicateAction = {
    ...(applicationSmartAlertFullScreenDesignEnabled && {
      handleCloneNew: function (config) {
        const { created, id } = config;
        return (
          <TearSheetButtonWithLink
            buttonIcon="lib_actions_copy"
            buttonName={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate'))}
            isGlobal={isGlobalSmartAlertConfig}
            alertId={id}
            alertConfigCreated={created}
            duplicateMode
            alertConfig={config}
          />
        );
      }
    }),
    ...(applicationSmartAlertDialogView && {
      handleClone: function (config) {
        handleClone(config, isGlobalSmartAlertConfig);
      }
    })
  };

  return {
    ...editAction,
    ...duplicateAction,
    handleDelete: function (id, setIsSaving, configName) {
      handleDelete(id, setIsSaving, configName, isGlobalSmartAlertConfig, trackCta);
    },
    handleToggleEnabled: function (enabled, id, setIsSaving) {
      handleToggleEnabled(enabled, id, setIsSaving, isGlobalSmartAlertConfig);
    }
  };
}
