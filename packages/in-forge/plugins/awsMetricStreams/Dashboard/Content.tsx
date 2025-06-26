/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Map } from 'immutable';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { TimeConfig } from '@instana/types';

import { withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

const summary = {
  prefix: 'metrics.summary.',
  type: 'summary',
  color: themes.default.ids.color.option.orange['500'],
  metrics: [
    {
      label: t('in-sdk:dashboard.customMetricsV2.customMetricsLabelValue'),
      formatter: withSiMultiplyPrefixThreeDecimalPlaces
    }
  ],
  discrete: false
};

export default function AwsMetricStreamsDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return <CustomMetricsV2 snapshot={Map({ id: snapshotId })} timeConfig={timeConfig} specs={SPECS} />;
}

export const SPECS = [summary];
