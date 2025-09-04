/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Typography } from '@instana/components';
import { Stack } from '@instana/carbon';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { t } from 'in-i18n';

export default function ControllerManager() {
  return (
    <Stack gap={5}>
      <Typography variant="heading-02" noMargin>
        {t('in-kubernetes:controlPlane.controllerManager')}
      </Typography>
      <NoDataAvailable height={160} />
    </Stack>
  );
}
