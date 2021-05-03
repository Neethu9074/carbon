/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';

import {
  applicationsAlertingAlertEdit,
  applicationsAlertingListAlertDeleted,
  applicationsAlertingListAlertPaused,
  applicationsAlertingListAlertResumed
} from 'in-alerting/smart-alerts/applications/tracker';
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
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsBaseList';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-new-components/Dialog/ConfirmationDialog';
import { MoreMenu, MoreMenuButton } from 'in-new-components/MoreMenu';
import { stopPropagation } from 'in-services/util/function';
import { t, Trans } from 'in-i18n';

import locals from './ListActionsColumn.mless';

export default function ListActionsColumn({ config, isLoading, isGlobalSmartAlertConfig }) {
  const { enabled, id, name } = config;
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
        kind="subtle"
        iconSpinning={isSaving}
        onClick={e => {
          stopPropagation(e);
          handleToggleEnabled(enabled, id, setIsSaving, isGlobalSmartAlertConfig);
        }}
      />

      <MoreMenu
        renderInteractiveElement={({ ref, toggle }) => (
          <Button
            kind="subtle"
            icon={isMoreMenuSaving ? 'lib_actions_loading' : 'lib_menu_more_horizontal'}
            onClick={e => {
              stopPropagation(e);
              toggle();
            }}
            ref={ref}
            iconSpinning={isMoreMenuSaving}
          />
        )}
      >
        <MoreMenuButton
          icon={isSaving ? 'lib_actions_loading' : 'lib_actions_edit'}
          iconSpinning={isMoreMenuSaving}
          onClick={() => handleEdit(config, isGlobalSmartAlertConfig)}
        >
          {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit')}
        </MoreMenuButton>
        <MoreMenuButton icon="lib_actions_copy" onClick={() => handleClone(config, isGlobalSmartAlertConfig)}>
          {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate')}
        </MoreMenuButton>
        <MoreMenuButton
          icon="lib_actions_delete"
          onClick={() => handleDelete(id, setIsMoreMenuSaving, isGlobalSmartAlertConfig, name)}
        >
          {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDelete')}
        </MoreMenuButton>
      </MoreMenu>
    </HorizontalFlexWrapper>
  );
}

function handleDelete(id, setIsSaving, isGlobalSmartAlertConfig, configName) {
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
            applicationsAlertingListAlertDeleted({
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

function handleClone(config, isGlobalSmartAlertConfig) {
  openSmartAlertDialog(config, isGlobalSmartAlertConfig, true);
  applicationsAlertingAlertEdit({ alertConfigId: config.id });
}

function handleEdit(config, isGlobalSmartAlertConfig) {
  openSmartAlertDialog(config, isGlobalSmartAlertConfig);
  applicationsAlertingAlertEdit({ alertConfigId: config.id });
}

function openSmartAlertDialog(config, isGlobalSmartAlertConfig, isCopy = false) {
  addActiveDialog(
    <SmartAlertConfigDialogWrapper
      applicationLabel={config.name}
      formData={config}
      onClose={() => {
        close();
        refreshSmartAlertConfigsList();
      }}
      isGlobalSmartAlert={isGlobalSmartAlertConfig}
      isCopy={isCopy}
      editMode
    />
  );
}

ListActionsColumn.propTypes = {
  config: PropTypes.shape({
    enabled: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  isGlobalSmartAlertConfig: PropTypes.bool,
  isLoading: PropTypes.bool
};
