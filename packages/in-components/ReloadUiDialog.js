/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-new-components/Dialog/Dialog';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function ReloadUiDialog({ onClose = close }) {
  return (
    <Dialog title={t('in-components:reloadUiDialogTitle')} onClose={onClose}>
      <p>{t('in-components:reloadUiDialogP1')}</p>
      <p>{t('in-components:reloadUiDialogP2')}</p>
      <Button
        kind="primaryv2"
        onClick={() => {
          window.location.reload();
        }}
        autoFocus
      >
        {t('in-components:reloadUiDialogReloadBtn')}
      </Button>
    </Dialog>
  );
}
