/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

//// @ts-expect-error Module needs to be translated to TS
//import MetricValue from 'in-components/MetricValue';
import { number, percentage, bytes } from 'in-services/formatters/number';
//import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import GPUUtilTable from 'in-forge/plugins/oTelDcgm/Dashboard/GPUUtilTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function oTelDcgmDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  const metricIds = snapshot.get('metricIds');

  const DCGM_FI_DEV_GPU_TEMP = metricIds.filter((metric: string) => metric.includes('DCGM_FI_DEV_GPU_TEMP')).toArray();
  const DCGM_FI_DEV_POWER_USAGE = metricIds
    .filter((metric: string) => metric.includes('DCGM_FI_DEV_POWER_USAGE'))
    .toArray();
  const DCGM_FI_DEV_SM_CLOCK = metricIds.filter((metric: string) => metric.includes('DCGM_FI_DEV_SM_CLOCK')).toArray();
  const DCGM_FI_DEV_MEM_CLOCK = metricIds
    .filter((metric: string) => metric.includes('DCGM_FI_DEV_MEM_CLOCK'))
    .toArray();
  const DCGM_FI_DEV_GPU_UTIL = metricIds.filter((metric: string) => metric.includes('DCGM_FI_DEV_GPU_UTIL')).toArray();
  const DCGM_FI_DEV_MEM_COPY_UTIL = metricIds
    .filter((metric: string) => metric.includes('DCGM_FI_DEV_MEM_COPY_UTIL'))
    .toArray();
  const DCGM_FI_DEV_FB_USED = metricIds.filter((metric: string) => metric.includes('DCGM_FI_DEV_FB_USED')).toArray();
  const DCGM_FI_DEV_FB_FREE = metricIds.filter((metric: string) => metric.includes('DCGM_FI_DEV_FB_FREE')).toArray();

  return (
    <>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.gpuTemp')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: DCGM_FI_DEV_GPU_TEMP.length > 0 ? DCGM_FI_DEV_GPU_TEMP : [],
              labels: DCGM_FI_DEV_GPU_TEMP.map((metric: string) => {
                if (metric.split('.').length > 1) {
                  return 'GPU ' + metric.split('.')[1];
                }
                return t('in-forge:plugins.oTelDcgm.dashboard.gpuTemp');
              }),
              type: 'area',
              aggregation: 'MEAN',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.powerUsage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.detailed,
              metrics: DCGM_FI_DEV_POWER_USAGE.length > 0 ? DCGM_FI_DEV_POWER_USAGE : [],
              labels: DCGM_FI_DEV_POWER_USAGE.map((metric: string) => {
                if (metric.split('.').length > 1) {
                  return 'GPU ' + metric.split('.')[1];
                }
                return t('in-forge:plugins.oTelDcgm.dashboard.powerUsage');
              }),
              type: 'area',
              aggregation: 'MEAN',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.smClocks')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: DCGM_FI_DEV_SM_CLOCK.length > 0 ? DCGM_FI_DEV_SM_CLOCK : [],
                labels: DCGM_FI_DEV_SM_CLOCK.map((metric: string) => {
                  if (metric.split('.').length > 1) {
                    return 'GPU ' + metric.split('.')[1];
                  }
                  return t('in-forge:plugins.oTelDcgm.dashboard.smClocks');
                }),
                type: 'area',
                aggregation: 'MEAN',
                min: 0
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.memoryClocks')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: DCGM_FI_DEV_MEM_CLOCK.length > 0 ? DCGM_FI_DEV_MEM_CLOCK : [],
                labels: DCGM_FI_DEV_MEM_CLOCK.map((metric: string) => {
                  if (metric.split('.').length > 1) {
                    return 'GPU ' + metric.split('.')[1];
                  }
                  return t('in-forge:plugins.oTelDcgm.dashboard.memoryClocks');
                }),
                type: 'area',
                aggregation: 'MEAN',
                min: 0
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      </Columize>
      <Columize>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.gpuUtil')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: DCGM_FI_DEV_GPU_UTIL.length > 0 ? DCGM_FI_DEV_GPU_UTIL : [],
                labels: DCGM_FI_DEV_GPU_UTIL.map((metric: string) => {
                  if (metric.split('.').length > 1) {
                    return 'GPU ' + metric.split('.')[1];
                  }
                  return t('in-forge:plugins.oTelDcgm.dashboard.gpuUtil');
                }),
                type: 'area',
                aggregation: 'MEAN',
                min: 0
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.memoryCpyUtil')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: percentage.detailed,
                metrics: DCGM_FI_DEV_MEM_COPY_UTIL.length > 0 ? DCGM_FI_DEV_MEM_COPY_UTIL : [],
                labels: DCGM_FI_DEV_MEM_COPY_UTIL.map((metric: string) => {
                  if (metric.split('.').length > 1) {
                    return 'GPU ' + metric.split('.')[1];
                  }
                  return t('in-forge:plugins.oTelDcgm.dashboard.memoryCpyUtil');
                }),
                type: 'area',
                aggregation: 'MEAN'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      </Columize>

      <GPUUtilTable
        snapshot={snapshot}
        timeConfig={timeConfig}
        metric={DCGM_FI_DEV_GPU_UTIL}
        keyName="DCGM_FI_DEV_GPU_UTIL"
      />

      <GPUUtilTable
        snapshot={snapshot}
        timeConfig={timeConfig}
        metric={DCGM_FI_DEV_MEM_COPY_UTIL}
        keyName="DCGM_FI_DEV_MEM_COPY_UTIL"
      />

      <Columize>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemUsed')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytes.detailed,
                metrics: DCGM_FI_DEV_FB_USED.length > 0 ? DCGM_FI_DEV_FB_USED : [],
                labels: DCGM_FI_DEV_FB_USED.map((metric: string) => {
                  if (metric.split('.').length > 1) {
                    return 'GPU ' + metric.split('.')[1];
                  }
                  return t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemUsed');
                }),
                type: 'area',
                min: 0
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemFree')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytes.detailed,
                metrics: DCGM_FI_DEV_FB_FREE.length > 0 ? DCGM_FI_DEV_FB_FREE : [],
                labels: DCGM_FI_DEV_FB_FREE.map((metric: string) => {
                  if (metric.split('.').length > 1) {
                    return 'GPU ' + metric.split('.')[1];
                  }
                  return t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemFree');
                }),
                type: 'area',
                min: 0
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      </Columize>

      <CustomMetricsV2
        snapshot={Map({ id: snapshotId })}
        timeConfig={timeConfig}
        titlePrefix={t('in-forge:plugins.oTelDcgm.oTelDcgm')}
        specs={SPECS}
      />
    </>
  );
}

export const SPECS = [AVAILABLE_SPECS.GAUGE, AVAILABLE_SPECS.HISTOGRAM, AVAILABLE_SPECS.SUM, AVAILABLE_SPECS.SUMMARY];
