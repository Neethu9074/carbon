/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Typography } from '@instana/components';

import { deleteSloConfiguration } from 'in-service-levels/api/configuration';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t, Trans } from 'in-i18n';

type CompletionCallback = (success: boolean) => void;
type DoFunction = () => void;

export default function useDoDeleteSloConfiguration(
  configuration: ServiceLevelObjectiveConfiguration,
  onComplete?: CompletionCallback
): DoFunction {
  return () => {
    showConfirmationDialog(configuration, onComplete);
  };
}

function showConfirmationDialog(
  configuration: ServiceLevelObjectiveConfiguration,
  onComplete?: CompletionCallback
): void {
  const { id, name } = configuration;
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-service-levels:general.deleteDialog.pleaseConfirm')}
      description={
        <Typography variant="body-regular">
          <Trans
            i18nKey="in-service-levels:general.deleteDialog.pleaseConfirmMsg"
            values={{ name }}
            components={{ italic: <i />, bold: <strong /> }}
          />
        </Typography>
      }
      confirmButtonLabel={t('in-service-levels:general.deleteDialog.delete')}
      onSubmit={() => {
        close();
        onDelete(id!, onComplete);
      }}
    />
  );
}

function onDelete(id: string, onComplete?: CompletionCallback): void {
  deleteSloConfiguration(id).once(
    () => {
      onDeleteSuccess();
      onComplete?.(true);
    },
    () => {
      onDeleteFailed();
      onComplete?.(false);
    }
  );
}

function onDeleteSuccess(): void {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-service-levels:hooks.useDoDeleteSloConfiguration.success')
    },
    'slo-delete-info'
  );
}

function onDeleteFailed(): void {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-service-levels:hooks.useDoDeleteSloConfiguration.failure')
    },
    'slo-delete-error'
  );
}
