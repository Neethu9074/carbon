/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Help } from '@carbon/icons-react';
import React from 'react';

import { Tooltip } from '@instana/components';
import { Stack } from '@instana/carbon';

import { t } from 'in-i18n';

export default function StateHeaderContent() {
  return (
    <Stack gap="0.25rem" orientation="horizontal">
      <span>{t('in-service-levels:correctionWindowsList.columnLabels.state')}</span>
      <Tooltip content={t('in-service-levels:correctionWindowsList.columnLabels.stateTooltip')}>
        <Help />
      </Tooltip>
    </Stack>
  );
}
