/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link, Stack, SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

export default function RestartConnectionErrorMessage() {
  return (
    <div>
      <p>{t('in-infrastructure:collectorView.errors.failedRestartConnectionError')}</p>
      <Stack direction="vertical">
        <Link
          href="https://www.ibm.com/docs/en/instana-observability/latest?topic=collectors-instana-distribution-opentelemetry-collector#managing-the-instana-collector-service"
          external
        >
          {t('in-infrastructure:collectorView.errors.manualRestartLink')}
          <SvgIcon type="lib_views_external_link" size="xs" />
        </Link>
        <p>{new Date().toLocaleTimeString()}</p>
      </Stack>
    </div>
  );
}

export function FetchConfigConnectionErrorMsg() {
  return (
    <div>
      <p>{t('in-infrastructure:collectorView.errors.failedConfigFetchConnectionError')}</p>
      <Stack direction="vertical">
        <Link
          href="https://www.ibm.com/docs/en/instana-observability/latest?topic=collectors-instana-distribution-opentelemetry-collector#managing-the-instana-collector-service"
          external
        >
          {t('in-infrastructure:collectorView.errors.manualRestartLink')}
          <SvgIcon type="lib_views_external_link" size="xs" />
        </Link>
        <p>{new Date().toLocaleTimeString()}</p>
      </Stack>
    </div>
  );
}
