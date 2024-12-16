/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';
import { Button } from '@instana/components';
import { t } from '@instana/i18n-react';

import Dialog from 'in-components/Dialog/Dialog';

import locals from './UnsavedIntegrationModal.mless';

interface IntegrationNotSavedModalProps {
  closeModal: (e?: React.MouseEvent<Element, MouseEvent>) => void;
  confirmNavigation: (e?: React.MouseEvent<Element, MouseEvent>) => void;
  cancelNavigation: (e?: React.MouseEvent<Element, MouseEvent>) => void;
}

export default function UnsavedIntegrationModal({
  closeModal,
  confirmNavigation,
  cancelNavigation
}: IntegrationNotSavedModalProps) {
  return (
    <>
      <Dialog title="Unsaved changes" className={locals.unsavedDialogContainer} onClose={closeModal}>
        <div className={locals.unsaveModalWrapper}>
          <div className={locals.unsaveModalContent}>
            <Typography variant="body-regular">{t('in-settings:tabs.integrations.unsavedModalContent')}</Typography>
          </div>
          <div className={locals.unsaveModalButtons}>
            <Button kind="secondary" onClick={cancelNavigation}>
              {t('in-settings:tabs.integrations.unsavedModalCancel')}
            </Button>
            <Button kind="danger" onClick={confirmNavigation}>
              {t('in-settings:tabs.integrations.unsavedModalDiscard')}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
