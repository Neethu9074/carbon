/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import ResourceType from 'in-forge/plugins/azureCosmosDb/Dashboard/ResourceType';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import StatusCode from 'in-forge/plugins/azureCosmosDb/Dashboard/StatusCode';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { t } from 'in-i18n';

export default function Collection({ snapshot, timeConfig, collection, statusCodes, resourceTypes }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.collections.' + collection + '.tr'],
          labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelTr')],
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.collections.' + collection + '.mr'],
          labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelMr')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.collections.' + collection + '.dc'],
          labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelDc')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: [
            'metrics.collections.' + collection + '.du',
            'metrics.collections.' + collection + '.iu',
            'metrics.collections.' + collection + '.as',
            'metrics.collections.' + collection + '.dq'
          ],
          labels: [
            t('in-forge:plugins.azureCosmosDB.dashboard.labelDu'),
            t('in-forge:plugins.azureCosmosDB.dashboard.labelIu'),
            t('in-forge:plugins.azureCosmosDB.dashboard.labelAs'),
            t('in-forge:plugins.azureCosmosDB.dashboard.labelDq')
          ],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <StatusCode snapshot={snapshot} timeConfig={timeConfig} collection={collection} statusCodes={statusCodes} />
      <ResourceType snapshot={snapshot} timeConfig={timeConfig} collection={collection} resourceTypes={resourceTypes} />
    </>
  );
}
