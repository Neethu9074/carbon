/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  applicationsAlertingAlertEdit,
  applicationsAlertingListAlertDeleted,
  applicationsAlertingListAlertPaused,
  applicationsAlertingListAlertResumed
} from '../tracker';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig
} from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { MoreMenu, MoreMenuButton } from 'in-new-components/MoreMenu';
import { stopPropagation } from 'in-services/util/function';
import { reload } from 'in-settings/components/List';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ListActionsColumn.mless';

export default function ListActionsColumn({ config }) {
  const { enabled, id } = config;
  return (
    <StopPropagationOfClickEvent>
      <HorizontalFlexWrapper className={locals.actions}>
        <Button
          icon={enabled ? 'lib_actions_pause' : 'lib_actions_play'}
          kind="secondary"
          onClick={() => handleToggleEnabled(enabled, id)}
        />

        <MoreMenu kind="secondaryDarker">
          <MoreMenuButton icon="lib_actions_edit" onClick={() => handleEdit(config)}>
            {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit')}
          </MoreMenuButton>
          <MoreMenuButton icon="lib_actions_copy" onClick={() => {}}>
            {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate')}
          </MoreMenuButton>
          <MoreMenuButton icon="lib_actions_delete" onClick={() => handleDelete(id)}>
            {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDelete')}
          </MoreMenuButton>
        </MoreMenu>
      </HorizontalFlexWrapper>
    </StopPropagationOfClickEvent>
  );
}

/**
 * Catch click evens and perent trigger action in <List /> compoment.
 * If we use the stopPropagation(e) in the onClick prop in teh <MoreMenuButton/>
 * we prevent the autovlose behaviour of the Menu. Thus the click catcher
 */
function StopPropagationOfClickEvent({ children }) {
  return <div onClick={e => stopPropagation(e)}>{children}</div>;
}

function handleDelete(id) {
  if (role.canConfigureCustomAlerts) {
    const delete$ = deleteAlertConfig(id);

    delete$.once(() => {
      applicationsAlertingListAlertDeleted({
        alertConfigId: id
      });
      reload();
    });

    // delete$.errors().once(error => {
    //   const errorMessage = `Failed to remove entity with ID ${id}: ${error.message}`;
    //   // logger.error(errorMessage, error);
    //   // reloadEntitiesSignal$.emit(true);
    //   // setErrorMessage(errorMessage);
    // });
  }
}

function handleToggleEnabled(enabled, id) {
  if (enabled) {
    const disable$ = disableAlertConfig(id);
    disable$.once(() => {
      applicationsAlertingListAlertPaused({
        alertConfigId: id
      });
      reload();
    });
  } else {
    const enable$ = enableAlertConfig(id);
    enable$.once(() => {
      applicationsAlertingListAlertResumed({
        alertConfigId: id
      });
      reload();
    });
  }
}

function handleEdit(config) {
  addActiveDialog(
    // TODO: in global alerts there is no name. We need to handle that when global dialog is implemented
    <SmartAlertConfigDialogWrapper applicationLabel={config.name} formData={config} onClose={close} editMode />
  );
  applicationsAlertingAlertEdit({ alertConfigId: config.id });
}
