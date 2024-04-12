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
import { number } from 'in-services/formatters/number';
//import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CustomMetricsV2, { AVAILABLE_SPECS } from 'in-sdk/components/dashboard/CustomMetricsV2';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
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

  return (
    <>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.oTelDcgm.dashboard.gpuTemp')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: DCGM_FI_DEV_GPU_TEMP.length > 0 ? DCGM_FI_DEV_GPU_TEMP : [],
              labels: DCGM_FI_DEV_GPU_TEMP.map((metric: string) => {
                if (metric.split('.').length > 1) {
                  return 'GPU ' + metric.split('.')[1];
                }
                return t('in-forge:plugins.oTelDcgm.dashboard.gpuTemp');
              }),
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
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
