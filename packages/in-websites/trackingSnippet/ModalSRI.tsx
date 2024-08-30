/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';
import { Button } from '@instana/components';

import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './TrackingSnippetPresenter.mless';

interface DialogProps {
  modalTitle: string;
  modalFirstLine: string;
  modalBody: string;
  buttonText: string;
  onButtonClick: () => void;
}
export default function ModalSRI({ modalTitle, modalBody, buttonText, modalFirstLine, onButtonClick }: DialogProps) {
  const ConfirmationButtons = (
    <>
      <Button
        onClick={() => {
          close();
        }}
        kind="secondary"
      >
        {t('in-websites:trackingSnippet.trackingSnippetPresenterCancelModal')}
      </Button>
      <Button
        onClick={() => {
          onButtonClick();
          close();
        }}
        kind="primary"
      >
        {buttonText}
      </Button>
    </>
  );

  return (
    <Dialog title={modalTitle} onClose={close} className={locals.dialog} doNotCloseOnOutsideClick>
      <section className={locals.dialogContent}>
        {buttonText == t('in-websites:trackingSnippet.trackingSnippetPresenterDisableModal') && (
          <Typography variant="body-regular">{modalFirstLine}</Typography>
        )}
        <Typography variant="body-regular">{modalBody}</Typography>
      </section>
      <section className={locals.confButton}>{ConfirmationButtons}</section>
    </Dialog>
  );
}
