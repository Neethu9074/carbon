/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, SvgIcon, Tooltip, Typography } from '@instana/components';
import { SloEntityType } from '@instana/types';

import { t } from 'in-i18n';

interface SloEntityInfoProps {
  sloName: string;
  entityType: SloEntityType;
}

export default function SloEntityInfo({ entityType, sloName }: SloEntityInfoProps) {
  const tooltipText = t('in-service-levels:sloList.components.sloEntityInfo.tooltip', {
    context: entityType
  });

  return (
    <Stack direction="horizontal" align="center" gap="xsmall">
      <Tooltip content={tooltipText}>
        <SvgIcon type={`lib_${entityType}`} aria-label={tooltipText} />
      </Tooltip>
      <Typography variant="body-regular" noMargin>
        {sloName}
      </Typography>
    </Stack>
  );
}
