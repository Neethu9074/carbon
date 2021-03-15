/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { millis, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function VaultDashboard({ snapshot, timeConfig }) {
  const sealed = snapshot.getIn(['data', 'sealed'], false);
  if (sealed) {
    return <DashboardNotification type="info">{t('in-forge:plugins.vault.infoVaultSealed')}</DashboardNotification>;
  }

  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.vault.titleSecretsCreated')}>
          <MetricValue snapshotId={snapshotId} metric="secret.create.count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.vault.titleSecretsRead')}>
          <MetricValue snapshotId={snapshotId} metric="secret.read.count" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.vault.titleTokensLookup')}>
          <MetricValue snapshotId={snapshotId} metric="token.lookup.count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.vault.titleSecretsCreated')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['secret.create.count'],
              labels: [t('in-forge:plugins.vault.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['secret.create.duration'],
              labels: [t('in-forge:plugins.vault.labelDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.vault.titleSecretsRead')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['secret.read.count'],
              labels: [t('in-forge:plugins.vault.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['secret.read.duration'],
              labels: [t('in-forge:plugins.vault.labelDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.vault.titleSecretsUpdated')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['secret.update.count'],
              labels: [t('in-forge:plugins.vault.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['secret.update.duration'],
              labels: [t('in-forge:plugins.vault.labelDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.vault.titleSecretsDeleted')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['secret.delete.count'],
              labels: [t('in-forge:plugins.vault.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['secret.delete.duration'],
              labels: [t('in-forge:plugins.vault.labelDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.vault.titleTokensCreated')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['token.create.count'],
              labels: [t('in-forge:plugins.vault.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['token.create.duration'],
              labels: [t('in-forge:plugins.vault.labelDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.vault.titleTokensLookup')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['token.lookup.count'],
              labels: [t('in-forge:plugins.vault.labelCount')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['token.lookup.duration'],
              labels: [t('in-forge:plugins.vault.labelDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.vault.titleLeaderFailure')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.compact,
            metrics: ['core.leadershipLost.duration', 'core.leadershipSetupFailed.duration'],
            labels: [t('in-forge:plugins.vault.labelLost'), t('in-forge:plugins.vault.labelFailure')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.vault.titleAuditLogRequests')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['audit.logRequest.count', 'audit.logRequest.failure.count'],
              labels: [t('in-forge:plugins.vault.labelCount'), t('in-forge:plugins.vault.labelFailure')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['audit.logRequest.duration'],
              labels: [t('in-forge:plugins.vault.labelCountDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.vault.titleAuditLogResponses')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['audit.logResponse.count', 'audit.logResponse.failure.count'],
              labels: [t('in-forge:plugins.vault.labelCount'), t('in-forge:plugins.vault.labelFailure')],
              type: 'line'
            }}
            y2={{
              formatter: millis.compact,
              metrics: ['audit.logResponse.duration'],
              labels: [t('in-forge:plugins.vault.labelCountDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.vault.titleBarrierOperations')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['barrier.put.count', 'barrier.get.count', 'barrier.delete.count', 'barrier.list.count'],
            labels: [
              t('in-forge:plugins.labelPut'),
              t('in-forge:plugins.labelGet'),
              t('in-forge:plugins.labelDelete'),
              t('in-forge:plugins.labelList')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.vault.titleSecretEngineErrors')}>
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
            labels: [
              t('in-forge:plugins.vault.labelInitialize'),
              t('in-forge:plugins.vault.labelClose'),
              t('in-forge:plugins.vault.labelCreateUser'),
              t('in-forge:plugins.vault.labelRenewUser'),
              t('in-forge:plugins.vault.labelRevokeUser')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
