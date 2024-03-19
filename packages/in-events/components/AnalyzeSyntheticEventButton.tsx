/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/legacy';

import { urlWithoutQueryParameter } from 'in-events/components/urlWithoutQueryParameter';
import { useSyntheticTestResultDashboard } from 'in-synthetics/navigation/paths';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface Props {
  testId: string;
  locationLabel: string;
  timeConfig: TimeConfig;
}

export default function AnalyzeSyntheticEventButton({ testId, locationLabel, timeConfig }: Props) {
  const getSyntheticTestResultDashboard = useSyntheticTestResultDashboard();

  const linkToUA = urlWithoutQueryParameter(getSyntheticTestResultDashboard(testId, timeConfig, true, [locationLabel]));

  return (
    <Button kind="primary" icon="lib_synthetic" href={linkToUA}>
      {t('in-events:titleViewRelatedTestResults')}
    </Button>
  );
}
