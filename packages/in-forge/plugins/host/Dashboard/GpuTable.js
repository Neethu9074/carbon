/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Range } from 'immutable';
import React from 'react';

import { percentage, bytesPerSecondTwoDecimalPlaces, bytes, temperature } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    id: 'GPU',
    title: 'GPU',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.gpuNumber;
      },
      getContent(gpuNumber) {
        return `GPU ${gpuNumber}`;
      }
    }
  },
  {
    id: 'GPU Usage',
    title: 'GPU Usage',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `gpus.${row.gpuNumber}.gpuUtilization`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getFallbackContent() {
        return 'N/A';
      }
    }
  },
  {
    id: 'Memory',
    title: 'Memory',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `gpus.${row.gpuNumber}.memoryUtilization`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getFallbackContent() {
        return 'N/A';
      }
    }
  },
  {
    id: 'Encoder',
    title: 'Encoder',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `gpus.${row.gpuNumber}.encoderUtilization`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getFallbackContent() {
        return 'N/A';
      }
    }
  },
  {
    id: 'Decoder',
    title: 'Decoder',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `gpus.${row.gpuNumber}.decoderUtilization`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getFallbackContent() {
        return 'N/A';
      }
    }
  },
  {
    id: 'Temperature',
    title: 'Temperature',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `gpus.${row.gpuNumber}.temperature`;
      },
      getContent: temperature.compact,
      getTimeWindowAggregation() {
        return 'mean';
      },
      getFallbackContent() {
        return 'N/A';
      }
    }
  }
];

export default function GpuTable({ snapshot, timeConfig }) {
  const gpuCount = snapshot.getIn(['data', 'gpu.count'], 0);
  if (gpuCount < 1) {
    return null;
  }

  const rows = Range(1, gpuCount + 1)
    .toArray()
    .map(gpuNumber => {
      return {
        key: String(gpuNumber),
        gpuNumber: gpuNumber,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    });

  return (
    <Table
      cardTitle="Individual GPU Usage"
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      maxItemsPerPage={8}
    />
  );
}

function getDetails(row) {
  return (
    <div>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.compact,
            metrics: ['gpus.' + row.gpuNumber + '.gpuUtilization'],
            labels: ['Usage'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: temperature.compact,
            metrics: ['gpus.' + row.gpuNumber + '.temperature'],
            labels: ['Temperature'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.compact,
            metrics: ['gpus.' + row.gpuNumber + '.encoderUtilization', 'gpus.' + row.gpuNumber + '.decoderUtilization'],
            labels: ['Encoder', 'Decoder'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.compact,
            metrics: ['gpus.' + row.gpuNumber + '.memoryUtilization'],
            labels: ['Memory Used'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: bytes.detailed,
            metrics: ['gpus.' + row.gpuNumber + '.memoryTotal'],
            labels: ['Memory Total'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: bytesPerSecondTwoDecimalPlaces,
            metrics: ['gpus.' + row.gpuNumber + '.transmitted', 'gpus.' + row.gpuNumber + '.received'],
            labels: ['Transmitted/s', 'Received/s'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
