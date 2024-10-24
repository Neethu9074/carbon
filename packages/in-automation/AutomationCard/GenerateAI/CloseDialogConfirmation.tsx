/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer, Typography } from '@instana/components';

import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { close } from 'in-components/DialogPresenter/store';
import { useSegmentTracker } from 'in-automation/tracker';
import { t } from 'in-i18n';

interface CloseDialogConfirmationProps {
  step: number;
  onClose: () => void;
  dialogHeader: string;
}

export function CloseDialogConfirmation({ step, onClose, dialogHeader }: CloseDialogConfirmationProps) {
  const { AIActionLeaveGenerateDialogTrackerSegment } = useSegmentTracker();

  const handleSubmit = () => {
    close();
    AIActionLeaveGenerateDialogTrackerSegment({ step, dialog: { dialogHeader } });
    onClose(); // This closes parent dialog
  };

  return (
    <ConfirmationDialog
      header={
        <Typography variant="body-regular" noWrap noMargin>
          {dialogHeader}
        </Typography>
      }
      description={
        <>
          <Typography variant="heading-200" noWrap noMargin>
            {t('in-automation:GenerateAIActionDialog.closeDialogDescription')}
          </Typography>
          <Spacer vertical="medium" />
          <Typography variant="body-regular" noWrap noMargin>
            {t('in-automation:GenerateAIActionDialog.closeDialogSubDescription')}
          </Typography>
        </>
      }
      confirmButtonLabel={t('in-automation:GenerateAIActionDialog.confirmButtonLabel')}
      secondaryButtonLabel={t('in-automation:GenerateAIActionDialog.cancelButtonLabel')}
      onSubmit={handleSubmit}
    />
  );
}
