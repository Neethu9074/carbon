/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import ActivitiesTable from 'in-forge/plugins/tibcoBWProcess/Dashboard/ActivitiesTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { millis, number } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function TibcoBWAppProcessDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWProcess.created')}>
          <MetricValue snapshotId={snapshotId} metric="created" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWProcess.completed')}>
          <MetricValue snapshotId={snapshotId} metric="completed" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWProcess.suspended')}>
          <MetricValue snapshotId={snapshotId} metric="suspended" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWProcess.failed')}>
          <MetricValue snapshotId={snapshotId} metric="failed" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.tibcoBWProcess.executionTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['totExec', 'avgExec', 'recntExec', 'minExec', 'maxExec'],
            labels: [
              t('in-forge:plugins.tibcoBWProcess.total'),
              t('in-forge:plugins.tibcoBWProcess.average'),
              t('in-forge:plugins.tibcoBWProcess.recent'),
              t('in-forge:plugins.tibcoBWProcess.min'),
              t('in-forge:plugins.tibcoBWProcess.max')
            ],
            type: 'line',
            formatter: millis.fixedCompact
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoBWProcess.elapsedTime')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['totElap', 'avgElap', 'recntElap', 'minElap', 'maxElap'],
            labels: [
              t('in-forge:plugins.tibcoBWProcess.total'),
              t('in-forge:plugins.tibcoBWProcess.average'),
              t('in-forge:plugins.tibcoBWProcess.recent'),
              t('in-forge:plugins.tibcoBWProcess.min'),
              t('in-forge:plugins.tibcoBWProcess.max')
            ],
            type: 'line',
            formatter: millis.fixedCompact
          }}
        />
      </DashboardSection>
      <ActivitiesTable snapshot={snapshot} />
    </div>
  );
}
