import React from 'react';

import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import createContainersForPodSubscription from 'in-subscription/containersForPod';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import Table from 'in-sdk/components/dashboard/Table';
import { focusedMoment$ } from 'in-stores/timeline';
import MetricValue from 'in-components/MetricValue';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

const containerCols = [
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
    title: 'State',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.state;
      }
    }
  },
  {
    title: 'Restarts',
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `containers.data.docker://${row.uid}.restartCount`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function KubernetesPodDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Phase">{snapshot.getIn(['data', 'phase'], null)}</KpiKeyValue>
        <KpiKeyValue label="Restarts">
          <MetricValue snapshotId={snapshotId} metric="restartCount" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="CPU Requests">
          <MetricValue snapshotId={snapshotId} metric="cpuRequests" formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="CPU Limits">
          <MetricValue snapshotId={snapshotId} metric="cpuLimits" formatter={twoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Requests">
          <MetricValue snapshotId={snapshotId} metric="memoryRequests" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label="Memory Limits">
          <MetricValue snapshotId={snapshotId} metric="memoryLimits" formatter={bytesTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Containers">
        <ContainerTable snapshotId={snapshotId} snapshot={snapshot} />
      </DashboardSection>
    </div>
  );
}

const ContainerTable = connectTo(
  props => ({
    containerSnapshots: focusedMoment$
      .flatMap(time => createContainersForPodSubscription({ snapshotId: props.snapshotId, time }))
      .flatMap(snapshots => (snapshots != null ? getSnapshots(snapshots) : alwaysEmptyArray))
  }),
  function ContainerTable({ snapshotId, snapshot, containerSnapshots }) {
    let rows = [];
    if (containerSnapshots) {
      rows = containerSnapshots.map(containerSnapshot => ({
        key: containerSnapshot.get('id'),
        uid: containerSnapshot.getIn(['data', 'Id']),
        state: snapshot.getIn(
          ['data', `containers.data.docker://${containerSnapshot.getIn(['data', 'Id'])}.state`],
          ''
        ),
        snapshotId
      }));
    }

    return <Table cols={containerCols} rows={rows} />;
  }
);
