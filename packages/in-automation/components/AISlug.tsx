/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonSlug, CarbonSlugContent } from '@instana/components';
import { t } from '@instana/i18n-react';

export default function AISlug() {
  return (
    <CarbonSlug>
      <CarbonSlugContent>{t('in-automation:AISlugContent')}</CarbonSlugContent>
    </CarbonSlug>
  );
}
