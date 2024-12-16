/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, zeroDecimalPlaces } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function awsAutoScalingDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  const mixedInstancesPolicyEnabled = snapshot.getIn(['data', 'mixed_instances_policy_enabled']);

  return (
    <>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.awsAutoScaling.labelGroupInServiceInstancesKpi')}>
          <MetricValue snapshotId={snapshotId} metric="group_in_service_instances" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.awsAutoScaling.labelGroupTotalInstancesKpi')}>
          <MetricValue snapshotId={snapshotId} metric="group_total_instances" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      {/* Auto Scaling group */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsAutoScaling.dashboard.titleGroupInstances')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: [
                'group_in_service_instances',
                'group_pending_instances',
                'group_standby_instances',
                'group_terminating_instances',
                'group_total_instances'
              ],
              labels: [
                t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupInServiceInstances'),
                t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupPendingInstances'),
                t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupStandbyInstances'),
                t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupTerminatingInstances'),
                t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupTotalInstances')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {mixedInstancesPolicyEnabled && (
        <Columize>
          <DashboardSection title={t('in-forge:plugins.awsAutoScaling.dashboard.titleGroupCapacity')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                metrics: [
                  'group_in_service_capacity',
                  'group_pending_capacity',
                  'group_standby_capacity',
                  'group_terminating_capacity',
                  'group_total_capacity'
                ],
                labels: [
                  t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupInServiceCapacity'),
                  t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupPendingCapacity'),
                  t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupStandbyCapacity'),
                  t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupTerminatingCapacity'),
                  t('in-forge:plugins.awsAutoScaling.dashboard.labelGroupTotalCapacity')
                ],
                type: 'line',
                min: 0
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      )}

      {/* Predictive Scaling */}
      <Columize>
        <DashboardSection title={t('in-forge:plugins.awsAutoScaling.dashboard.titlePredictiveScalingForecast')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['predictive_scaling_load_forecast', 'predictive_scaling_capacity_forecast'],
              labels: [
                t('in-forge:plugins.awsAutoScaling.dashboard.labelPredictiveScalingLoadForecast'),
                t('in-forge:plugins.awsAutoScaling.dashboard.labelPredictiveScalingCapacityForecast')
              ],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.awsAutoScaling.dashboard.titlePredictiveScaling')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: ['predictive_scaling_metric_pair_correlation'],
              labels: [t('in-forge:plugins.awsAutoScaling.dashboard.labelPredictiveScalingMetricPairCorrelation')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </>
  );
}
