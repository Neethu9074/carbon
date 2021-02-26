/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import semver from 'semver';
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import AwsEcNewMemcachedDashboard from './AwsEcNewMemcachedDashboard';
import { number, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';

export default function AwsEcMemcachedDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const v = snapshot.getIn(['data', 'cache_engine_version']);
  const newVersion = semver.satisfies(v, '>=1.4.14');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.awsEc.titleBytesUsedLow')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['bytes_read_into_memcached', 'bytes_written_out_from_memcached', 'bytes_used_for_cache_items'],
            labels: [
              t('in-forge:plugins.awsEc.labelBytesRead'),
              t('in-forge:plugins.awsEc.labelBytesWritten'),
              t('in-forge:plugins.awsEc.labelBytesUsed')
            ],
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
            metrics: ['cas_hits', 'cas_misses', 'cas_badval'],
            labels: [
              t('in-forge:plugins.awsEc.labelHits'),
              t('in-forge:plugins.awsEc.labelMisses'),
              t('in-forge:plugins.awsEc.labelBadValue')
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
            metrics: ['cmd_flush', 'cmd_get', 'cmd_set'],
            labels: [t('in-forge:plugins.labelFlush'), t('in-forge:plugins.labelGet'), t('in-forge:plugins.labelSet')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.titleOperations')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['get_hits', 'get_misses', 'delete_hits', 'delete_misses'],
              labels: [
                t('in-forge:plugins.awsEc.labelGetHits'),
                t('in-forge:plugins.awsEc.labelGetMisses'),
                t('in-forge:plugins.awsEc.labelDeleteHits'),
                t('in-forge:plugins.awsEc.labelDeleteMisses')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.titleOperations')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['incr_hits', 'incr_misses', 'decr_hits', 'decr_misses'],
              labels: [
                t('in-forge:plugins.awsEc.labelIncrHits'),
                t('in-forge:plugins.awsEc.labelIncrMisses'),
                t('in-forge:plugins.awsEc.labelDecrHits'),
                t('in-forge:plugins.awsEc.labelDecrMisses')
              ],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.awsEc.titleUnusedMemory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['unused_memory'],
            labels: [t('in-forge:plugins.awsEc.labelUnusedMemory')],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {newVersion ? <AwsEcNewMemcachedDashboard snapshot={snapshot} timeConfig={timeConfig} /> : null}
    </div>
  );
}
