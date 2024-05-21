/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Map } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import GPUUtilTable from 'in-forge/plugins/oTelDcgm/Dashboard/GPUUtilTable';
import { number, percentage, bytes } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

// Utility function to filter metric IDs
function filterMetrics(metricIds: any, filterString: string) {
  return metricIds.filter((metric: string) => metric.includes(filterString)).toArray();
}

// Utility function to generate labels
function generateLabels(metrics: string[], defaultLabel: string) {
  return metrics.map((metric: string) => {
    if (metric.split('.').length > 1) {
      return 'GPU ' + metric.split('.')[1];
    }
    return defaultLabel;
  });
}

export default function oTelDcgmDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  const metricIds = snapshot.get('metricIds');

  const metricsConfig = [
    {
      key: 'DCGM_FI_DEV_GPU_TEMP',
      label: t('in-forge:plugins.oTelDcgm.dashboard.gpuTemp'),
      formatter: number.detailed
    },
    {
      key: 'DCGM_FI_DEV_POWER_USAGE',
      label: t('in-forge:plugins.oTelDcgm.dashboard.powerUsage'),
      formatter: number.detailed
    },
    {
      key: 'DCGM_FI_DEV_SM_CLOCK',
      label: t('in-forge:plugins.oTelDcgm.dashboard.smClocks'),
      formatter: number.compact
    },
    {
      key: 'DCGM_FI_DEV_MEM_CLOCK',
      label: t('in-forge:plugins.oTelDcgm.dashboard.memoryClocks'),
      formatter: number.compact
    },
    {
      key: 'DCGM_FI_DEV_GPU_UTIL',
      label: t('in-forge:plugins.oTelDcgm.dashboard.gpuUtil'),
      formatter: percentage.detailed
    },
    {
      key: 'DCGM_FI_DEV_MEM_COPY_UTIL',
      label: t('in-forge:plugins.oTelDcgm.dashboard.memoryCpyUtil'),
      formatter: percentage.detailed
    },
    {
      key: 'DCGM_FI_DEV_FB_USED',
      label: t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemUsed'),
      formatter: bytes.detailed
    },
    {
      key: 'DCGM_FI_DEV_FB_FREE',
      label: t('in-forge:plugins.oTelDcgm.dashboard.frambufferMemFree'),
      formatter: bytes.detailed
    }
  ];

  const groupedMetricsConfig = [
    ['DCGM_FI_DEV_GPU_TEMP'],
    ['DCGM_FI_DEV_POWER_USAGE'],
    ['DCGM_FI_DEV_SM_CLOCK', 'DCGM_FI_DEV_MEM_CLOCK'],
    ['DCGM_FI_DEV_GPU_UTIL', 'DCGM_FI_DEV_MEM_COPY_UTIL']
  ];

  const groupedFBMetricsConfig = [['DCGM_FI_DEV_FB_USED', 'DCGM_FI_DEV_FB_FREE']];

  const commonProps = {
    type: 'area',
    aggregation: 'MEAN',
    min: 0
  };

  return (
    <>
      {groupedMetricsConfig.map((group, index) => (
        <Columize key={index}>
          {group.map(metricKey => {
            const metricConfig = metricsConfig.find(config => config.key === metricKey);
            if (!metricConfig) return null;

            const metrics = filterMetrics(metricIds, metricConfig.key);
            const labels = generateLabels(metrics, metricConfig.label);

            return (
              <DashboardSection title={metricConfig.label} key={metricConfig.key}>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    formatter: metricConfig.formatter,
                    metrics: metrics.length > 0 ? metrics : [],
                    labels,
                    ...commonProps
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </DashboardSection>
            );
          })}
        </Columize>
      ))}

      <GPUUtilTable
        snapshot={snapshot}
        timeConfig={timeConfig}
        metric={filterMetrics(metricIds, 'DCGM_FI_DEV_GPU_UTIL')}
        keyName="DCGM_FI_DEV_GPU_UTIL"
      />

      <GPUUtilTable
        snapshot={snapshot}
        timeConfig={timeConfig}
        metric={filterMetrics(metricIds, 'DCGM_FI_DEV_MEM_COPY_UTIL')}
        keyName="DCGM_FI_DEV_MEM_COPY_UTIL"
      />

      {groupedFBMetricsConfig.map((group, index) => (
        <Columize key={index}>
          {group.map(metricKey => {
            const metricConfig = metricsConfig.find(config => config.key === metricKey);
            if (!metricConfig) return null;

            const metrics = filterMetrics(metricIds, metricConfig.key);
            const labels = generateLabels(metrics, metricConfig.label);

            return (
              <DashboardSection title={metricConfig.label} key={metricConfig.key}>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    formatter: metricConfig.formatter,
                    metrics: metrics.length > 0 ? metrics : [],
                    labels,
                    ...commonProps
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </DashboardSection>
            );
          })}
        </Columize>
      ))}

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
