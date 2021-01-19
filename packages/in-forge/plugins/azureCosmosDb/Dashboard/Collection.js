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
          labels: ['Total Requests'],
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: ['metrics.collections.' + collection + '.mr'],
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
          metrics: ['metrics.collections.' + collection + '.dc'],
          labels: ['Document Count'],
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
          labels: ['Data Usage', 'Index Usage', 'Available Storage', 'Document Quota'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />

      <StatusCode snapshot={snapshot} timeConfig={timeConfig} collection={collection} statusCodes={statusCodes} />
      <ResourceType snapshot={snapshot} timeConfig={timeConfig} collection={collection} resourceTypes={resourceTypes} />
    </>
  );
}
