/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer } from '@instana/components';
import { Action } from '@instana/types';

import { MetadataActionContent } from 'in-automation/RunActionDialog/RunActionDialogContent';
import { t } from 'in-i18n';

export default function ViewActionStep({ action }: { action: Action }) {
  return (
    <>
      <Spacer vertical="normal" />
      <Typography variant="body-regular">{t('in-automation:CreatePolicyDialog.Step1Headline')}</Typography>
      <Spacer vertical="normal" />
      <Typography variant="heading-02">{t('in-automation:CreatePolicyDialog.actionDetails')}</Typography>
      <MetadataActionContent action={action} viewRecommendedAction />
    </>
  );
}
