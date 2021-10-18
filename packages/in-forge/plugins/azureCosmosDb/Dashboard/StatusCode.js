/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';

export default function StatusCode({ snapshot, timeConfig, collection, statusCodes }) {
  const snapshotId = snapshot.get('id');

  var codeMetrics = emptyList;
  var codeLabels = emptyList;
  statusCodes.map(code => {
    if (code.startsWith(collection)) {
      codeMetrics = codeMetrics.push('metrics.statusCodes.' + code + '.tr');
      codeLabels = codeLabels.push(code.substring(code.lastIndexOf('.') + 1));
    }
  });

  if (codeMetrics.size == 0) return <div />;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: zeroDecimalPlaces,
          metrics: codeMetrics.toArray(),
          labels: codeLabels.toArray(),
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
