/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { millis, millisPerSecondZeroDecimalPlaces, number, percentage } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardRuntimeList from './DashboardRuntimeList';
import MetricValue from 'in-components/MetricValue';
import Link from 'in-components/Link';
import { Trans, t } from 'in-i18n';

export default function GoogleCloudRunServiceRevisionDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  const hasDataFromGcpAgent = !!snapshot.getIn(['data', 'labels']);

  const setUpGcpAgentWarning = !hasDataFromGcpAgent ? (
    <DashboardNotification type="warning">
      <Trans
        i18nKey="in-forge:plugins.googleCloudRunServiceRevision.dashboard.itSeemsThereIsNoInstanaAgentSetUpToMonitorTheGcpAccountOfThisGoogleCloudRunServiceRevision"
        components={{
          linkToDocs: <Link external href="https://www.instana.com/docs/ecosystem/google-cloud-run/#gcp-agent-setup" />
        }}
      />
    </DashboardNotification>
  ) : null;

  return (
    <>
      {setUpGcpAgentWarning}

      {hasDataFromGcpAgent && (
        <>
          <KpiSection>
            <KpiKeyValue label={t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.requestCount')}>
              <MetricValue snapshotId={snapshotId} metric="request_count" formatter={number.compact} />
            </KpiKeyValue>
            <KpiKeyValue label={t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.requestLatencyP99')}>
              <MetricValue snapshotId={snapshotId} metric="request_latencies_p99" formatter={millis.compact} />
            </KpiKeyValue>
          </KpiSection>

          <Columize>
            <DashboardSection title={t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.requestCount')}>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: number.compact,
                  tooltipFormatter: number.compact,
                  metrics: [`request_count`],
                  labels: [t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.requests')],
                  type: 'line'
                }}
              />
            </DashboardSection>
            <DashboardSection title={t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.requestLatency')}>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: millis.compact,
                  tooltipFormatter: millis.compact,
                  metrics: ['request_latencies_p99', 'request_latencies_p95', 'request_latencies_p50'],
                  labels: [
                    t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.99thPercentile'),
                    t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.95thPercentile'),
                    t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.50thPercentile')
                  ],
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Columize>

          <Columize>
            <DashboardSection
              title={t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.containerMemoryUtilization')}
            >
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: percentage.compact,
                  tooltipFormatter: percentage.compact,
                  metrics: [
                    'container_memory_utilizations_p99',
                    'container_memory_utilizations_p95',
                    'container_memory_utilizations_p50'
                  ],
                  labels: [
                    t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.99thPercentile'),
                    t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.95thPercentile'),
                    t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.50thPercentile')
                  ],
                  type: 'line'
                }}
              />
            </DashboardSection>
            <DashboardSection
              title={t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.billableInstanceTime')}
            >
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: millisPerSecondZeroDecimalPlaces,
                  tooltipFormatter: millisPerSecondZeroDecimalPlaces,
                  metrics: ['container_billable_instance_time'],
                  labels: [t('in-forge:plugins.googleCloudRunServiceRevision.dashboard.instanceTime')],
                  type: 'line'
                }}
              />
            </DashboardSection>
          </Columize>
        </>
      )}

      <DashboardRuntimeList snapshotId={snapshotId} />
    </>
  );
}
