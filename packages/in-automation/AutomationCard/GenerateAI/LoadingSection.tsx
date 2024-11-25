/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog.mless';
export default function LoadingSection({ title }: { title: string }) {
  return (
    <>
      <div className={locals.header}>
        <Typography variant="heading-200" component="h2">
          {title}
        </Typography>
      </div>
      <div className={locals.loadingContent}>
        <LoadingIndicator text={t('in-automation:GenerateAIActionDialog.watsonxLoadingContent')} />
      </div>
    </>
  );
}
