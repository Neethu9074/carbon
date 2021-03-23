/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  deleteAlertConfig as deleteGlobalAlertConfig,
  disableAlertConfig as disableGlobalAlertConfig,
  enableAlertConfig as enableGlobalAlertConfig
} from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import {
  applicationsAlertingAlertEdit,
  applicationsAlertingListAlertDeleted,
  applicationsAlertingListAlertPaused,
  applicationsAlertingListAlertResumed
} from 'in-alerting/smart-alerts/applications/tracker';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig
} from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { MoreMenu, MoreMenuButton } from 'in-new-components/MoreMenu';
import { refreshSmartAlertConfigsList } from './SmartAlertsBaseList';
import { stopPropagation } from 'in-services/util/function';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ListActionsColumn.mless';

export default function ListActionsColumn({ config, isLoading, isGlobalSmartAlertConfig }) {
  const { enabled, id } = config;
  const [isSaving, setIsSaving] = useState(false);
  const [isMoreMenuSaving, setIsMoreMenuSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && (isSaving || isMoreMenuSaving)) {
      setIsSaving(false);
      setIsMoreMenuSaving(false);
    }
    // We only want to fire the hook when is loading changes to ensure that we
    // reset the loading spinner when the new entities are loaded from backend
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <HorizontalFlexWrapper className={locals.actions}>
      <Button
        icon={isSaving ? 'lib_actions_loading' : enabled ? 'lib_actions_pause' : 'lib_actions_play'}
        kind="secondary"
        iconSpinning={isSaving}
        onClick={e => {
          stopPropagation(e);
          handleToggleEnabled(enabled, id, setIsSaving, isGlobalSmartAlertConfig);
        }}
      />

      <MoreMenu kind="secondaryDarker" isSaving={isMoreMenuSaving}>
        <MoreMenuButton
          icon={isSaving ? 'lib_actions_loading' : 'lib_actions_edit'}
          iconSpinning={isMoreMenuSaving}
          onClick={() => handleEdit(config, isGlobalSmartAlertConfig)}
        >
          {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit')}
        </MoreMenuButton>
        <MoreMenuButton
          icon="lib_actions_copy"
          onClick={() => {
            /* TODO: */
          }}
        >
          {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate')}
        </MoreMenuButton>
        <MoreMenuButton
          icon="lib_actions_delete"
          onClick={() => handleDelete(id, setIsMoreMenuSaving, isGlobalSmartAlertConfig)}
        >
          {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDelete')}
        </MoreMenuButton>
      </MoreMenu>
    </HorizontalFlexWrapper>
  );
}

function handleDelete(id, setIsSaving, isGlobalSmartAlertConfig) {
  if (role.canConfigureCustomAlerts) {
    const deleteConfig = isGlobalSmartAlertConfig ? deleteGlobalAlertConfig : deleteAlertConfig;
    setIsSaving(true);

    deleteConfig(id).once(
      () => {
        applicationsAlertingListAlertDeleted({
          alertConfigId: id
        });
        refreshSmartAlertConfigsList();
      },
      () => {
        setIsSaving(false);
      }
    );
  }
}

function handleToggleEnabled(enabled, id, setIsSaving, isGlobalSmartAlertConfig) {
  const disableConfig = isGlobalSmartAlertConfig ? disableGlobalAlertConfig : disableAlertConfig;
  const enableConfig = isGlobalSmartAlertConfig ? enableGlobalAlertConfig : enableAlertConfig;

  setIsSaving(true);

  (enabled ? disableConfig(id) : enableConfig(id)).once(
    () => {
      (enabled ? applicationsAlertingListAlertPaused : applicationsAlertingListAlertResumed)({
        alertConfigId: id
      });
      refreshSmartAlertConfigsList();
    },
    () => {
      setIsSaving(false);
    }
  );
}

function handleEdit(config) {
  addActiveDialog(
    // TODO: in global alerts there is no name. We need to handle that when global dialog is implemented
    <SmartAlertConfigDialogWrapper applicationLabel={config.name} formData={config} onClose={close} editMode />
  );
  applicationsAlertingAlertEdit({ alertConfigId: config.id });
}

ListActionsColumn.propTypes = {
  config: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  isGlobalSmartAlertConfig: PropTypes.bool,
  isLoading: PropTypes.bool
};
