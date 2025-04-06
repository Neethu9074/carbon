/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Map } from 'immutable';
import React from 'react';

import { TimeConfig } from '@instana/types';

import {
  groupedFBMetricsConfig,
  groupedMetricsConfig,
  Level,
  metricsConfig,
  workloadMetrics
} from 'in-forge/plugins/oTelDcgm/constants';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import GPUUtilTable from 'in-forge/plugins/oTelDcgm/Dashboard/GPUUtilTable';
import MetricTable from 'in-forge/plugins/oTelDcgm/Dashboard/MetricTable';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

function filterMetrics(metricIds: any, metricId: string, level: Level = 'gpu') {
  let pattern = RegExp(`^${metricId}\\.(\\d+)(_container=(.*)_pod=(.*)_namespace=(.*))?$`);
  if (level == 'instance') {
    pattern = RegExp(`^${metricId}\\.\\d+ \\(IID \\d+\\)(_container=(.*)_pod=(.*)_namespace=(.*))?$`);
  } else if (level == 'workload') {
    pattern = RegExp(`^${metricId}\\.\\d+( \\(IID \\d+\\))?_container=(.*)_pod=(.*)_namespace=(.*)$`);
  }
  return metricIds
    .filter((metric: string) => pattern.test(metric))
    .sort()
    .toArray();
}

function generateLabels(metrics: string[], defaultLabel: string) {
  return metrics.map((metric: string) => {
    const match = /^.*\.(\d+( \(?:IID \d+\))?)(_container=(.*)_pod=(.*)_namespace=(.*))?$/.exec(metric);
    return match ? 'GPU ' + match[1] : defaultLabel;
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

  const commonProps = {
    type: 'area',
    aggregation: 'MEAN',
    min: 0
  };

  return (
    <>
      {groupedMetricsConfig.map(group => (
        <Columize key={group.join()}>
          {group.map(metricKey => {
            const metricConfig = metricsConfig.find(config => config.key === metricKey);
            if (!metricConfig) return null;

            const metrics = filterMetrics(metricIds, metricConfig.key);
            const labels = generateLabels(metrics, metricConfig.label);

            return (
              <div key={metricKey}>
                {metrics.length > 0 && (
                  <DashboardSection title={metricConfig.label} key={metricConfig.key}>
                    <Chart
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      y1={{
                        formatter: metricConfig.formatter,
                        metrics: metrics || [],
                        labels,
                        ...commonProps
                      }}
                      renderPostChartContent={PluginDashboardsMarkerLanes}
                    />
                  </DashboardSection>
                )}

                <MetricTable
                  snapshot={snapshot}
                  timeConfig={timeConfig}
                  metric={filterMetrics(metricIds, metricKey, 'instance')}
                  keyName={metricKey}
                  formatter={metricConfig.formatter}
                  title={metricConfig.instanceLabel}
                  colHeader={metricConfig.label}
                />
              </div>
            );
          })}
        </Columize>
      ))}

      {workloadMetrics.map(metric => {
        const workload = metricsConfig.find(config => config.key === metric);
        if (workload == null) {
          return null;
        }
        return (
          <GPUUtilTable
            key={metric}
            snapshot={snapshot}
            timeConfig={timeConfig}
            metric={filterMetrics(metricIds, workload.key, 'workload')}
            keyName={workload.key}
            title={workload.label}
            formatter={workload.formatter}
          />
        );
      })}

      {groupedFBMetricsConfig.map(group => (
        <Columize key={group.join()}>
          {group.map(metricKey => {
            const metricConfig = metricsConfig.find(config => config.key === metricKey);
            if (!metricConfig) return null;

            const metrics = filterMetrics(metricIds, metricConfig.key);
            const labels = generateLabels(metrics, metricConfig.label);

            return (
              <div key={metricKey}>
                {metrics.length > 0 && (
                  <DashboardSection title={metricConfig.label} key={metricConfig.key}>
                    <Chart
                      key={metricConfig.key}
                      snapshotId={snapshotId}
                      timeConfig={timeConfig}
                      y1={{
                        formatter: metricConfig.formatter,
                        metrics: metrics || [],
                        labels,
                        ...commonProps
                      }}
                      renderPostChartContent={PluginDashboardsMarkerLanes}
                    />
                  </DashboardSection>
                )}
                <MetricTable
                  snapshot={snapshot}
                  timeConfig={timeConfig}
                  metric={filterMetrics(metricIds, metricKey, 'instance')}
                  keyName={metricKey}
                  formatter={metricConfig.formatter}
                  title={metricConfig.instanceLabel}
                  colHeader={metricConfig.label}
                />
              </div>
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
