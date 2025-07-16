/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  muSecondsToMillisTwoDecimalPlaces,
  muSecondsToMillisZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  twoDecimalPlaces,
  number
} from 'in-services/formatters/number';
import TombstoneCountTable from 'in-forge/plugins/cassandraNode/Dashboard/TombstoneCountTable';
import KeyspacesTable from 'in-forge/plugins/cassandraNode/Dashboard/KeyspacesTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { capitalize } from 'in-services/formatters/string';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function CassandraDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.cassandraNode.dashboard.labelReadRequests')}>
          <MetricValue snapshotId={snapshotId} metric="clientrequests.read.count" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.cassandraNode.dashboard.labelReadLatency')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="clientrequests.read.mean"
            formatter={muSecondsToMillisZeroDecimalPlaces}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.cassandraNode.dashboard.labelWriteRequests')}>
          <MetricValue snapshotId={snapshotId} metric="clientrequests.write.count" />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.cassandraNode.dashboard.labelWriteLatency')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="clientrequests.write.mean"
            formatter={muSecondsToMillisZeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.cassandraNode.dashboard.titleRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['clientrequests.read.count'],
            labels: [t('in-forge:plugins.cassandraNode.dashboard.labelReads')],
            type: 'line',
            formatter: number.detailed
          }}
          y2={{
            min: 0,
            metrics: ['clientrequests.write.count'],
            labels: [t('in-forge:plugins.cassandraNode.dashboard.labelWrites')],
            type: 'line',
            formatter: number.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {['read', 'write'].map(op => (
        <DashboardSection
          title={t('in-forge:plugins.cassandraNode.dashboard.titleClientRequestCount', { clientCount: capitalize(op) })}
          key={op}
        >
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: muSecondsToMillisTwoDecimalPlaces,
              metrics: [
                'clientrequests.' + op + '.mean',
                'clientrequests.' + op + '.50',
                'clientrequests.' + op + '.95',
                'clientrequests.' + op + '.99'
              ],
              labels: [
                t('in-forge:plugins.cassandraNode.dashboard.labelMean'),
                t('in-forge:plugins.cassandraNode.dashboard.label50P'),
                t('in-forge:plugins.cassandraNode.dashboard.label95P'),
                t('in-forge:plugins.cassandraNode.dashboard.label99P')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ))}

      {['pending', 'blocked'].map(stage => (
        <DashboardSection
          title={t('in-forge:plugins.cassandraNode.dashboard.titleRequestsInThreadpool', {
            stageName: capitalize(stage)
          })}
          key={stage}
        >
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: [
                'stage.mutation.' + stage,
                'stage.read.' + stage,
                'stage.countermutation.' + stage,
                'stage.readrepair.' + stage,
                'stage.requestresponse.' + stage,
                'stage.memtableflushwriter.' + stage
              ],
              labels: [
                t('in-forge:plugins.cassandraNode.dashboard.labelWrite'),
                t('in-forge:plugins.cassandraNode.dashboard.labelRead'),
                t('in-forge:plugins.cassandraNode.dashboard.labelCounterMutation'),
                t('in-forge:plugins.cassandraNode.dashboard.labelReadRepair'),
                t('in-forge:plugins.cassandraNode.dashboard.labelRequest'),
                t('in-forge:plugins.cassandraNode.dashboard.labelMemtableFlushwriter')
              ],
              type: 'line',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ))}

      <DashboardSection title={t('in-forge:plugins.cassandraNode.dashboard.titleDroppedMessages')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'dropped.MUTATION',
              'dropped.READ',
              'dropped.COUNTER_MUTATION',
              'dropped.READ_REPAIR',
              'dropped.REQUEST_RESPONSE'
            ],
            labels: [
              t('in-forge:plugins.cassandraNode.dashboard.labelWrite'),
              t('in-forge:plugins.cassandraNode.dashboard.labelRead'),
              t('in-forge:plugins.cassandraNode.dashboard.labelCounterMutation'),
              t('in-forge:plugins.cassandraNode.dashboard.labelReadRepair'),
              t('in-forge:plugins.cassandraNode.dashboard.labelRequest')
            ],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <KeyspacesTable snapshot={snapshot} timeConfig={timeConfig} />
      <TombstoneCountTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.cassandraNode.dashboard.titlePendingCompactions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['compaction.pending'],
            labels: [t('in-forge:plugins.cassandraNode.dashboard.labelCompactions')],
            type: 'line',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.cassandraNode.dashboard.titleCacheHits')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['cache.counter.hit', 'cache.key.hit', 'cache.row.hit'],
            labels: [
              t('in-forge:plugins.cassandraNode.dashboard.labelCounter'),
              t('in-forge:plugins.cassandraNode.dashboard.labelKey'),
              t('in-forge:plugins.cassandraNode.dashboard.labelRow')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.cassandraNode.dashboard.titleBloomFilter')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageTwoDecimalPlaces,
            metrics: ['bloomFilterFalse'],
            labels: [t('in-forge:plugins.cassandraNode.dashboard.labelMissRate')],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
