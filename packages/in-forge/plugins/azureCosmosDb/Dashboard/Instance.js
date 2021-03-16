/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, millis, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function Instance({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureCosmosDB.dashboard.labelDc')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.instance.dc" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label={t('in-forge:plugins.azureCosmosDB.dashboard.labelSa')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.instance.sa"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.azureCosmosDB.dashboard.titleInstanceMetrics')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.instance.tr'],
            labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelTr')],
            type: 'line'
          }}
          y2={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.instance.mr'],
            labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelMr')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />

        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.detaileds,
            metrics: ['metrics.instance.rl'],
            labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelRl')],
            type: 'line'
          }}
          y2={{
            formatter: millis.detailed,
            metrics: ['metrics.instance.wl'],
            labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelWl')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
