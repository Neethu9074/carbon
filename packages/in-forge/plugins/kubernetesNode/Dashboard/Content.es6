import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import createPodsForK8sNodeSubscription from 'in-subscription/podsForK8sNode';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';
import { getNodeDashboard } from 'in-kubernetes/navigation/paths';
import { kubernetesEnabled } from 'in-services/featureFlags';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import MetricValue from 'in-components/MetricValue';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
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

export default connectTo(
  props => {
    return {
      pods: timeConfig$
        .flatMap(timeConfig => createPodsForK8sNodeSubscription({ snapshotId: props.snapshot.get('id'), timeConfig }))
        .flatMap(getSnapshots)
    };
  },
  function KubernetesNodeDashboard({ snapshot, pods = [], timeConfig }) {
    const snapshotId = snapshot.get('id');
    if (kubernetesEnabled) {
      return <RedirectWithHash to$={getNodeDashboard(snapshotId)} />;
    }
    const rows = pods.map(pod => {
      const data = pod.get('data');
      return {
        key: data.get('name'),
        snapshotId: pod.get('id'),
        namespace: data.get('namespace'),
        timeConfig
      };
    });

    return (
      <div>
        <KpiSection>
          <KpiHeading>{getLabel(snapshot)}</KpiHeading>
          <KpiKeyValue label="Pods Allocation">
            <MetricValue snapshotId={snapshotId} metric="alloc_pods_percentage" formatter={percentage.detailed} />
          </KpiKeyValue>
          <KpiKeyValue label="CPU Requests Allocation">
            <MetricValue snapshotId={snapshotId} metric="required_cpu_percentage" formatter={percentage.detailed} />
          </KpiKeyValue>
          <KpiKeyValue label="CPU Limits Allocation">
            <MetricValue snapshotId={snapshotId} metric="limit_cpu_percentage" formatter={percentage.detailed} />
          </KpiKeyValue>
          <KpiKeyValue label="Memory Requests Allocation">
            <MetricValue snapshotId={snapshotId} metric="required_mem_percentage" formatter={percentage.detailed} />
          </KpiKeyValue>
          <KpiKeyValue label="Memory Limits Allocation">
            <MetricValue snapshotId={snapshotId} metric="limit_mem_percentage" formatter={percentage.detailed} />
          </KpiKeyValue>
        </KpiSection>

        <Columize>
          <DashboardSection title="CPU Resources">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['required_cpu', 'limit_cpu', 'cap_cpu'],
                labels: ['CPU Requests', 'CPU Limits', 'CPU Capacity'],
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Memory Resources">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['required_mem', 'limit_mem', 'cap_mem'],
                labels: ['Memory Requests', 'Memory Limits', 'Memory Capacity'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <DashboardSection title="Pods Allocation">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['allocatedPods', 'cap_pods'],
              labels: ['Allocated Pods', 'Pods Capacity'],
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Pods (${rows.length})`}>
          <Table cols={cols} rows={rows} />
        </DashboardSection>
      </div>
    );
  }
);
