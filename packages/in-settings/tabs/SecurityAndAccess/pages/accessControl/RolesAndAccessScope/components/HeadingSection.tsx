/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';
import { Link } from '@instana/components';

import { t } from 'in-i18n';

export default function HeadingSection() {
  return (
    <Stack direction="vertical" gap="disabled">
      <Typography variant="heading-300">{t('in-settings:headingSection.title')}</Typography>
      <Typography variant="body-regular">
        {t('in-settings:headingSection.description')}&nbsp;
        <Link
          external
          href="https://www.ibm.com/docs/en/instana-observability/current?topic=instana-managing-user-access#add-areas-to-a-group"
        >
          {t('in-settings:headingSection.link')}
        </Link>
      </Typography>
    </Stack>
  );
}
