/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

import locals from './RootCauseMap.mless';

export default function RootCauseLegend() {
  return (
    <div className={locals.legend}>
      <Stack direction="horizontal">
        <Stack direction="horizontal" align="center">
          <div className={locals.legendRCA} />
          <Typography variant="body-regular">{t('in-events:RCA.topology.legendRCA')}</Typography>
        </Stack>
        <Stack direction="horizontal" align="center">
          <div className={locals.legendTrigger} />
          <Typography variant="body-regular">{t('in-events:RCA.topology.legendTrigger')}</Typography>
        </Stack>
        <Stack direction="horizontal" align="center">
          <div className={locals.legendOther} />
          <Typography variant="body-regular">{t('in-events:RCA.topology.legendOther')}</Typography>
        </Stack>
      </Stack>
    </div>
  );
}
