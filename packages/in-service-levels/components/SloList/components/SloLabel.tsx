/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Typography } from '@instana/components';

import { t } from 'in-i18n';

interface SloLabelProps {
  label?: string;
}
export default function SloLabel({ label }: SloLabelProps) {
  return (
    <Typography variant="heading-100" component="h3">
      {t('in-service-levels:general.selectLabel')}
      {label ?? t('in-service-levels:general.noSelection')}
    </Typography>
  );
}
