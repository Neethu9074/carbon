/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import CollectionsTable from 'in-forge/plugins/azureCosmosDb/Dashboard/CollectionsTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';

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
          labels: ['Total Requests'],
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.databases.' + database + '.mr'],
          labels: ['Metadata Requests'],
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
          labels: ['Document Count'],
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
