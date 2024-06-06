/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer } from '@instana/components';

import { MetadataActionContent } from 'in-automation/RunActionDialog/RunActionDialogContent';
import { ScoredAction } from 'in-automation/api';
import { t } from 'in-i18n';

import locals from './CreatePolicyDialogPresenter.mless';

export default function ViewActionStep({ selectedAction }: { selectedAction: ScoredAction }) {
  return (
    <div>
      <div className={locals.actionModalPadding}>
        <Spacer vertical="normal" />
        <Typography variant="body-regular">{t('in-automation:SimpleCreatePolicyDialog.Step1Headline')}</Typography>
        <Spacer vertical="normal" />
        <MetadataActionContent action={selectedAction} viewRecommendedAction />
      </div>
    </div>
  );
}
