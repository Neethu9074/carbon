import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  timeByMillisTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import createPodsForDeploymentSubscription from 'in-subscription/podsForDeployment';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import MetricValue from 'in-components/MetricValue';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

const msFormatter = d => (d < 0 ? 'No activity' : timeByMillisTwoDecimalPlaces(d));

const podCols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Namespace',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.namespace;
      }
    }
  }
];

export default function KubernetesDeploymentDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Pods">
          <MetricValue snapshotId={snapshotId} metric="pods.count" formatter={zeroDecimalPlaces} initialValue="0" />
        </KpiKeyValue>
        <KpiKeyValue label="Available">
          <MetricValue
            snapshotId={snapshotId}
            metric="availableReplicas"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Desired">
          <MetricValue
            snapshotId={snapshotId}
            metric="desiredReplicas"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Pending">
          <MetricValue
            snapshotId={snapshotId}
            metric="phase.Pending.count"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Unscheduled">
          <MetricValue
            snapshotId={snapshotId}
            metric="conditions.PodScheduled.False"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Unready">
          <MetricValue
            snapshotId={snapshotId}
            metric="conditions.Ready.False"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Last Rollout">
          <MetricValue snapshotId={snapshotId} metric="duration" formatter={msFormatter} initialValue="0" />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="Required vs Limit CPU Shares">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              formatter: twoDecimalPlaces,
              metrics: ['pods.required_cpu', 'pods.limit_cpu'],
              labels: ['Required', 'Limit'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Required vs Limit Memory">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['pods.required_mem', 'pods.limit_mem'],
              labels: ['Required', 'Limit'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Pods">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              formatter: zeroDecimalPlaces,
              metrics: ['pods.count'],
              labels: ['Pods'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Available vs Desired">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              formatter: zeroDecimalPlaces,
              metrics: ['availableReplicas', 'desiredReplicas'],
              labels: ['Available', 'Desired'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Pending vs Unscheduled vs Unready">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              min: 0,
              formatter: zeroDecimalPlaces,
              metrics: ['phase.Pending.count', 'conditions.PodScheduled.False', 'conditions.Ready.False'],
              labels: ['Pending', 'Unscheduled', 'Unready'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Rollout duration">
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            y1={{
              formatter: msFormatter,
              metrics: ['duration'],
              labels: ['Duration'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <PodsTable snapshotId={snapshotId} />
    </div>
  );
}

const PodsTable = connectTo(
  props => ({
    containerSnapshots: focusedMoment$
      .flatMap(time => createPodsForDeploymentSubscription({ snapshotId: props.snapshotId, time }))
      .flatMap(getSnapshots)
  }),
  function PodsTable({ containerSnapshots }) {
    let rows = [];
    if (containerSnapshots) {
      rows = containerSnapshots.map(containerSnapshot => ({
        key: containerSnapshot.get('id'),
        namespace: containerSnapshot.getIn(['data', 'namespace'])
      }));
    }

    return (
      <DashboardSection title={`Pods (${rows.length})`}>
        <Table cols={podCols} rows={rows} />
      </DashboardSection>
    );
  }
);
