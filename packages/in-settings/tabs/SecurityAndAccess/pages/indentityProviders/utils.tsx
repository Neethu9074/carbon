/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Observable } from '@instana/observables';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { t, Trans } from 'in-i18n';
import { Error } from 'in-types';

interface MessageProps {
  message?: string;
  type?: string;
  isSaving?: boolean;
  text?: string;
}

export const deleteItem = ({
  setMessage,
  deleteConfig
}: {
  setMessage: React.Dispatch<React.SetStateAction<MessageProps | null>>;
  deleteConfig: () => Observable<any>;
}) => {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-settings:components.pleaseConfirm')}
      description={
        <span>
          <Trans i18nKey="in-settings:tabs.deleteIDPConfirmationDescription" />
        </span>
      }
      onSubmit={() => {
        setMessage({ message: t('in-settings:tabs.deletingConfig'), type: 'neutral', isSaving: true });
        const setConfigResult$ = deleteConfig();
        setConfigResult$.once(
          () => {
            setMessage({ text: t('in-settings:tabs.configSuccessfullyDeleted'), type: 'success' });
          },
          (error: Error) =>
            setMessage({ text: t('in-settings:tabs.failedToDeleteConfig', { err: error.message }), type: 'error' })
        );
        close();
      }}
      confirmButtonKind="danger"
      confirmButtonLabel={t('in-settings:components.removeBtn')}
    />
  );
};
