/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, bytes, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function AwsEcRedisDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.awsEc.titleBytesUsed')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['bytes_used_for_cache'],
            labels: [t('in-forge:plugins.awsEc.labelBytesUsedLow')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.awsEc.titleCache')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['cache_hits', 'cache_misses'],
            labels: [t('in-forge:plugins.awsEc.labelHits'), t('in-forge:plugins.awsEc.labelMisses')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.titleReplication')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['replication_bytes'],
            labels: [t('in-forge:plugins.awsEc.labelReplicationBytes')],
            type: 'line',
            formatter: bytes.compact
          }}
          y2={{
            min: 0,
            metrics: ['replication_lag'],
            labels: [t('in-forge:plugins.awsEc.labelReplicationLag')],
            type: 'line',
            formatter: seconds.fixedCompact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsEc.titleCommands')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['get_type_cmds', 'hash_based_cmds', 'key_based_cmds', 'list_based_cmds'],
              labels: [
                t('in-forge:plugins.labelGet'),
                t('in-forge:plugins.awsEc.labelHash'),
                t('in-forge:plugins.awsEc.labelKey'),
                t('in-forge:plugins.awsEc.labelList')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.awsEc.titleCommands')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['set_based_cmds', 'sorted_set_based_cmds', 'string_based_cmds', 'hyper_log_log_based_cmds'],
              labels: [
                t('in-forge:plugins.awsEc.labelSet'),
                t('in-forge:plugins.awsEc.labelSortedSet'),
                t('in-forge:plugins.awsEc.labelStrings'),
                t('in-forge:plugins.awsEc.labelHyperLog')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
