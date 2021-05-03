/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import MetricValue from 'in-components/MetricValue';

import locals from './KpiChart.mless';

export default function KpiChart({ snapshotId, label, metric, formatter }) {
  return (
    <KeyValue
      className={locals.chart}
      label={label}
      value={<MetricValue className={locals.value} snapshotId={snapshotId} metric={metric} formatter={formatter} />}
      accentuated
    />
  );
}
