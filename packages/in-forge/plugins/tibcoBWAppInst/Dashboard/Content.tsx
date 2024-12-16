/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import ProcessesTable from 'in-forge/plugins/tibcoBWAppInst/Dashboard/ProcessesTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, zeroDecimalPlaces } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function TibcoBWAppInstDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWAppInst.created')}>
          <MetricValue snapshotId={snapshotId} metric="created" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWAppInst.running')}>
          <MetricValue snapshotId={snapshotId} metric="running" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWAppInst.faulted')}>
          <MetricValue snapshotId={snapshotId} metric="faulted" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWAppInst.cancelled')}>
          <MetricValue snapshotId={snapshotId} metric="cancelled" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWAppInst.scheduled')}>
          <MetricValue snapshotId={snapshotId} metric="scheduled" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWAppInst.pagedout')}>
          <MetricValue snapshotId={snapshotId} metric="pagedout" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.tibcoBWAppInst.jobs')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['created', 'running', 'faulted', 'cancelled', 'scheduled', 'pagedout'],
            labels: [
              t('in-forge:plugins.tibcoBWAppInst.created'),
              t('in-forge:plugins.tibcoBWAppInst.running'),
              t('in-forge:plugins.tibcoBWAppInst.faulted'),
              t('in-forge:plugins.tibcoBWAppInst.cancelled'),
              t('in-forge:plugins.tibcoBWAppInst.scheduled'),
              t('in-forge:plugins.tibcoBWAppInst.pagedout')
            ],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <ProcessesTable snapshot={snapshot} />
    </div>
  );
}
