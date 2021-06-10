/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';

export default function InfraMetricKpiCard({ title, snapshotId, metric, formatter }) {
  return (
    <KpiCard
      title={title}
      renderValue={() => <MetricValue snapshotId={snapshotId} metric={metric} formatter={formatter} />}
    />
  );
}
