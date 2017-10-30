import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';

import MetricValue from 'in-components/MetricValue';
import Chart from 'in-components/Chart';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';
import Columize from 'in-sdk/components/dashboard/Columize';

import { emptyList, emptyMap } from 'in-services/fixedImmutables';

import { getLabel } from 'in-sdk/snapshot';

const nodeCols = [
  {
    title: 'Node',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hostname;
      }
    }
  },
  {
    title: 'CPU Shares Allocated',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.data.${row.key}.percent_cpu_allocated`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Memory Allocated',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.data.${row.key}.percent_mem_allocated`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Pods Allocated',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `nodes.data.${row.key}.percent_pods_allocated`;
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Internal IP',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.internalIp;
      }
    }
  },
  {
    title: 'Labels',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return (row.labels || []).join(', ');
      }
    }
  }
];

export default function KubernetesClusterDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const nodeIds = snapshot.getIn(['data', 'nodes.itemIds'], emptyList);
  const nodeRows = nodeIds
    .map(uid => {
      return {
        key: uid,
        name: snapshot.getIn(['data', `nodes.data.${uid}.name`], null),
        hostname: snapshot.getIn(['data', `nodes.data.${uid}.hostname`], null),
        internalIp: snapshot.getIn(['data', `nodes.data.${uid}.internalIp`], null),
        labels: snapshot.getIn(['data', `nodes.data.${uid}.labels`], emptyMap).map((v, k) => k + '=' + v),
        snapshotId: snapshotId
      };
    })
    .valueSeq()
    .toArray();

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Node Count">
          <MetricValue snapshotId={snapshotId} initialValue={nodeIds.length} formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="CPU Shares">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: twoDecimalPlaces,
              metrics: ['nodes.allocatable_cpu', 'nodes.capacity_cpu'],
              labels: ['Allocatable', 'Limit'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Memory">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['nodes.allocatable_mem', 'nodes.capacity_mem'],
              labels: ['Allocatable', 'Limit'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Pod Count">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['pods.count'],
              labels: ['Pods'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Pods">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['nodes.allocatable_pods', 'nodes.capacity_pods'],
              labels: ['Allocatable', 'Limit'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title="Replicas">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['availableReplicas', 'desiredReplicas'],
            labels: ['Availabe', 'Desired'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Nodes">
        <Table cols={nodeCols} rows={nodeRows} getRowDetails={getNodeRowDetails} />
      </DashboardSection>
    </div>
  );
}

function getNodeRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 60
        }}
        y1={{
          formatter: twoDecimalPlaces,
          metrics: [`nodes.data.${row.key}.alloc_cpu`, `nodes.data.${row.key}.cap_cpu`],
          labels: ['CPU Allocatable', 'CPU Limit'],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeframe={row.timeframe}
        margins={{
          left: 60
        }}
        y1={{
          formatter: bytesTwoDecimalPlaces,
          metrics: [`nodes.data.${row.key}.alloc_mem`, `nodes.data.${row.key}.cap_mem`],
          labels: ['Memory Allocatable', 'Memory Limit'],
          type: 'line'
        }}
      />
    </div>
  );
}
