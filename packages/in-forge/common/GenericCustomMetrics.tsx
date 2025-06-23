/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Map } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error this was not migrated yet, because underlying types are not clear defined:
import * as GENERIC_COLS from 'in-forge/common/GenericCustomColumns';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

type GenericCustomMetricsProps = { snapshot: Map<string, any>; timeConfig: TimeConfig; titlePrefix?: string };

export default function GenericCustomMetrics({ snapshot, timeConfig, titlePrefix }: GenericCustomMetricsProps) {
  const metricIds = snapshot.get('metricIds');
  if (metricIds?.size > 0) {
    return (
      <CustomMetricsV2
        snapshot={snapshot}
        timeConfig={timeConfig}
        titlePrefix={titlePrefix}
        specs={SPECS}
        customColumns={GENERIC_COLS.VALUE}
      />
    );
  }
  return null;
}

export const SPECS = [
  {
    prefix: 'customMetrics.',
    type: 'unknown-type',
    color: '#00CC66',
    metrics: [
      {
        label: t('in-sdk:dashboard.customMetricsV2.customMetricsLabelValue'),
        formatter: number.detailed
      }
    ],
    discrete: false
  }
];
