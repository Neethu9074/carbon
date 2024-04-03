/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import KpiCard from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/KpiCardSap';
import MetricValue from 'in-components/MetricValue';
export default function InfraMetricKpiCard({ title, iconAction, snapshotId, metric, formatter }) {
  return (
    <KpiCard title={title} iconAction={iconAction}>
      <MetricValue snapshotId={snapshotId} metric={metric} formatter={formatter} />
    </KpiCard>
  );
}
