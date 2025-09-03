/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Loading } from '@instana/carbon';

import { useGlobalLoadingIndicator } from 'in-hooks/useGlobalLoadingIndicator';
import { t } from 'in-i18n';

export default function GlobalLoadingIndicator() {
  const [isLoading] = useGlobalLoadingIndicator();

  return <Loading active={isLoading} description={t('in-client:carbonUiShell.globalLoadingIndicatorDescription')} />;
}
