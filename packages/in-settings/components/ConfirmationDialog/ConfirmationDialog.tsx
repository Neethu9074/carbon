/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactElement, ReactNode } from 'react';

import { Typography } from '@instana/components';
import { Modal } from '@instana/carbon';

import { close as closeModal } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

interface ConfirmationDialogProps {
  danger?: boolean;
  description?: string | ReactElement;
  onClose?: () => void;
  onSecondarySubmit?: () => void;
  onSubmit: () => void;
  primaryButtonText: ReactNode;
  secondaryButtonText?: ReactNode;
  title: ReactNode;
}

const ConfirmationDialog = ({
  description,
  onSubmit,
  primaryButtonText,
  title,
  danger = false,
  onSecondarySubmit = closeModal,
  onClose = closeModal,
  secondaryButtonText = t('in-settings:tabs.cancel')
}: ConfirmationDialogProps) => {
  return (
    <Modal
      danger={danger}
      modalHeading={title}
      onRequestClose={onClose}
      onRequestSubmit={onSubmit}
      onSecondarySubmit={onSecondarySubmit}
      open
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      size="sm"
    >
      {description && <Typography variant="body-regular">{description}</Typography>}
    </Modal>
  );
};

export default ConfirmationDialog;
