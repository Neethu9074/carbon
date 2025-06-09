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
} from 'in-alerting/smart-alerts/components/api/smartAlertConfig';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { ALERTING_DELETE_CONFIRM } from 'in-services/tracking/eventNames';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';

export function handleDelete(
  id: string,
  setIsSaving: (saving: boolean) => void,
  configName: string,
  baseUrl: string,
  trackCta?: CtaTrackingFunction
) {
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
        deleteAlertConfig(id, baseUrl).once(
          () => {
            trackCta?.(ALERTING_DELETE_CONFIRM, { id });
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

export function handleToggleEnabled(
  enabled: boolean,
  id: string,
  setIsSaving: (arg: boolean) => void,
  baseUrl: string
) {
  setIsSaving(true);

  (enabled ? disableAlertConfig(id, baseUrl) : enableAlertConfig(id, baseUrl)).once(
    () => {
      refreshSmartAlertConfigsList();
    },
    () => {
      setIsSaving(false);
    }
  );
}
