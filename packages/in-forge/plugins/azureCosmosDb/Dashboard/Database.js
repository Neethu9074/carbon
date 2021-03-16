/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CollectionsTable from 'in-forge/plugins/azureCosmosDb/Dashboard/CollectionsTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function Database({ snapshot, timeConfig, region, database, collections, statusCodes, resourceTypes }) {
  const snapshotId = snapshot.get('id');

  return (
    <>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.databases.' + database + '.tr'],
          labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelTr')],
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.databases.' + database + '.mr'],
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
          metrics: ['metrics.databases.' + database + '.dc'],
          labels: [t('in-forge:plugins.azureCosmosDB.dashboard.labelDc')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <CollectionsTable
        snapshot={snapshot}
        timeConfig={timeConfig}
        region={region}
        database={database}
        collections={collections}
        statusCodes={statusCodes}
        resourceTypes={resourceTypes}
      />
    </>
  );
}
