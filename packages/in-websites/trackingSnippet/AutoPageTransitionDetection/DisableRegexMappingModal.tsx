/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonModal, Typography } from '@instana/components';

import type { DisableRegexMappingModalProps } from 'in-websites/trackingSnippet/AutoPageTransitionDetection/types';
import { close } from 'in-components/DialogPresenter/store';

const DisableRegexMappingModal: React.FC<DisableRegexMappingModalProps> = ({
  modalTitle,
  modalBody,
  modalBodyLastLine,
  primaryButtonText,
  secondaryButtonText,
  onSubmit
}) => {
  const handleClose = () => close();

  const handleSubmit = () => {
    onSubmit();
    close();
  };

  return (
    <CarbonModal
      id="disableRegexMappingModal"
      danger
      open
      modalHeading={modalTitle}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={secondaryButtonText}
      onRequestSubmit={handleSubmit}
      onRequestClose={handleClose}
    >
      <Typography variant="body-regular">{modalBody}</Typography>
      <br />
      <br />
      <Typography variant="body-regular">{modalBodyLastLine}</Typography>
    </CarbonModal>
  );
};

export default DisableRegexMappingModal;
