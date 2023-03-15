/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, StackItem, Typography } from '@instana/components';

import { t } from 'in-i18n';

export interface NoAccessPanelProps {
  descriptionNLSContext?: string;
}

export default function NoAccessPanel({ descriptionNLSContext }: NoAccessPanelProps) {
  const description = descriptionNLSContext
    ? t('in-settings:permissionScope.description_no_access', { context: descriptionNLSContext })
    : t('in-settings:permissionScope.description_no_access');
  return (
    <Stack direction="vertical">
      <StackItem>
        <Typography variant="heading-200" component="div">
          {t('in-settings:permissionScope.selection_no_access')}
        </Typography>
        <Typography variant="body-regular" component="div">
          {description}
        </Typography>
      </StackItem>
    </Stack>
  );
}
