/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { millis, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function VaultDashboard({ snapshot, timeConfig }) {
  const sealed = snapshot.getIn(['data', 'sealed'], false);
  if (sealed) {
    return <DashboardNotification type="info">Vault is sealed.</DashboardNotification>;
  }

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Secrets Created">
          <MetricValue snapshotId={snapshotId} metric="secret.create.count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Secrets Read">
          <MetricValue snapshotId={snapshotId} metric="secret.read.count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Tokens Lookup">
          <MetricValue snapshotId={snapshotId} metric="token.lookup.count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Secrets Created">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['secret.create.count'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['secret.create.duration'],
              labels: ['Duration'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Secrets Read">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['secret.read.count'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['secret.read.duration'],
              labels: ['Duration'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Secrets Updated">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['secret.update.count'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['secret.update.duration'],
              labels: ['Duration'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Secrets Deleted">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['secret.delete.count'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['secret.delete.duration'],
              labels: ['Duration'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Tokens Created">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['token.create.count'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['token.create.duration'],
              labels: ['Duration'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Tokens Lookup">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['token.lookup.count'],
              labels: ['Count'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['token.lookup.duration'],
              labels: ['Duration'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Leader Failure">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.compact,
            metrics: ['core.leadershipLost.duration', 'core.leadershipSetupFailed.duration'],
            labels: ['Lost', 'Setup Failed'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title="Audit Log Requests">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['audit.logRequest.count', 'audit.logRequest.failure.count'],
              labels: ['Count', 'Failure'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['audit.logRequest.duration'],
              labels: ['Count Duration'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Audit Log Responses">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['audit.logResponse.count', 'audit.logResponse.failure.count'],
              labels: ['Count', 'Failure'],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['audit.logResponse.duration'],
              labels: ['Count Duration'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Barrier Operations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['barrier.put.count', 'barrier.get.count', 'barrier.delete.count', 'barrier.list.count'],
            labels: ['Put', 'Get', 'Delete', 'List'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Secret Engine Errors">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [
              'database.initialize.error.count',
              'database.close.error.count',
              'database.createUser.error.count',
              'database.renewUser.error.count',
              'database.revokeUser.error.count'
            ],
            labels: ['Initialize', 'Close', 'Create User', 'Renew User', 'Revoke User'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
