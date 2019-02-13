import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import createPodsForDeploymentSubscription from 'in-subscription/podsForDeployment';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getDeploymentDashboard } from 'in-kubernetes/navigation/paths';
import { kubernetesEnabled } from 'in-services/featureFlags';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import MetricValue from 'in-components/MetricValue';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';
import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces,
  timeByMillisTwoDecimalPlaces
} from 'in-services/formatters/number';

const noActivity = 'No activity';
const msFormatter = d => (d < 0 ? noActivity : timeByMillisTwoDecimalPlaces(d));

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
        return row.data.get('namespace');
      }
    }
  },
  {
    title: 'Status',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('phase');
      }
    }
  },
  {
    title: 'Restarts',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'restartCount';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Host IP',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('hostIp');
      }
    }
  }
];

export default function KubernetesDeploymentDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  if (kubernetesEnabled) {
    return <RedirectWithHash to$={getDeploymentDashboard(snapshotId)} />;
  }

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Pods">
          <MetricValue snapshotId={snapshotId} metric="pods.count" formatter={zeroDecimalPlaces} initialValue="0" />
        </KpiKeyValue>
        <KpiKeyValue label="Available Replicas">
          <MetricValue
            snapshotId={snapshotId}
            metric="availableReplicas"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Desired Replicas">
          <MetricValue
            snapshotId={snapshotId}
            metric="desiredReplicas"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Pending Pods">
          <MetricValue
            snapshotId={snapshotId}
            metric="phase.Pending.count"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Unscheduled Pods">
          <MetricValue
            snapshotId={snapshotId}
            metric="conditions.PodScheduled.False"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Unready Pods">
          <MetricValue
            snapshotId={snapshotId}
            metric="conditions.Ready.False"
            formatter={zeroDecimalPlaces}
            initialValue="0"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Last pending phase duration">
          <MetricValue
            snapshotId={snapshotId}
            metric="lastDuration"
            formatter={msFormatter}
            initialValue={noActivity}
          />
        </KpiKeyValue>
      </KpiSection>

      <Columize>
        <DashboardSection title="CPU Resources">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: twoDecimalPlaces,
              metrics: ['pods.required_cpu', 'pods.limit_cpu'],
              labels: ['CPU Requests', 'CPU Limits'],
              type: 'line'
            }}
          />
        </DashboardSection>
        <DashboardSection title="Memory Resources">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesTwoDecimalPlaces,
              metrics: ['pods.required_mem', 'pods.limit_mem'],
              labels: ['Memory Requests', 'Memory Limits'],
              type: 'line'
            }}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Pods">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: zeroDecimalPlaces,
              metrics: ['pods.count'],
              labels: ['Pods'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Replicas">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
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
        <DashboardSection title="Pods Pending vs Unscheduled vs Unready">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: zeroDecimalPlaces,
              metrics: ['phase.Pending.count', 'conditions.PodScheduled.False', 'conditions.Ready.False'],
              labels: ['Pending', 'Unscheduled', 'Unready'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Pending phase duration">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: msFormatter,
              metrics: ['duration'],
              labels: ['Pending phase duration'],
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
    pods: timeConfig$
      .flatMap(timeConfig => createPodsForDeploymentSubscription({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
  }),
  function PodsTable({ pods }) {
    let rows = [];
    if (pods) {
      rows = pods.map(pod => ({
        key: pod.get('id'),
        data: pod.get('data')
      }));
    }

    return (
      <DashboardSection title={`Pods (${rows.length})`}>
        <Table cols={podCols} rows={rows} />
      </DashboardSection>
    );
  }
);
