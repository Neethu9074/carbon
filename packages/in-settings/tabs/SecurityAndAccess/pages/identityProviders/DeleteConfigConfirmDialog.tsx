/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonModal } from '@instana/components';

import { close } from 'in-components/DialogPresenter/store';
import { t, Trans } from 'in-i18n';

interface DeleteConfigConfirmDialogProps {
  onRequestSubmit: VoidFunction;
}

export function DeleteConfigConfirmDialog({ onRequestSubmit }: DeleteConfigConfirmDialogProps) {
  return (
    <CarbonModal
      id="deleteIdpDialog"
      open
      onRequestClose={close}
      size="sm"
      danger
      modalHeading={t('in-settings:components.confirmRemove')}
      primaryButtonText={t('in-settings:components.removeBtn')}
      secondaryButtonText={t('in-settings:tabs.cancel')}
      onRequestSubmit={onRequestSubmit}
    >
      <span>
        <Trans i18nKey="in-settings:tabs.deleteIDPConfirmationDescription" />
      </span>
    </CarbonModal>
  );
}
