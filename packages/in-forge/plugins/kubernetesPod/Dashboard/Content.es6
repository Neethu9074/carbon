import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import createContainersForPodSubscription from 'in-services/subscription/containersForPod';
import { focusedMoment$ } from 'in-stores/timeline';
import { getSnapshots } from 'in-stores/snapshot';

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
    title: 'Image',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.image;
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
        <KpiKeyValue label="Namespace">
          <MetricValue snapshotId={snapshotId} initialValue={snapshot.getIn(['data', 'namespace'], null)} />
        </KpiKeyValue>
        <KpiKeyValue label="Host IP">
          <MetricValue snapshotId={snapshotId} initialValue={snapshot.getIn(['data', 'hostIp'], null)} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Containers">
        <ContainerTable snapshot={snapshot} />
      </DashboardSection>
    </div>
  );
}

const ContainerTable = connectTo(
  props => ({
    containerSnapshots: focusedMoment$
      .flatMap(time => createContainersForPodSubscription({ snapshotId: props.snapshot.get('id'), time }))
      .flatMap(getSnapshots)
  }),
  function ContainerTable({ snapshot, containerSnapshots }) {
    let rows = [];
    if (containerSnapshots) {
      rows = containerSnapshots.map(containerSnapshot => ({
        key: containerSnapshot.get('id'),
        image: containerSnapshot.getIn(['data', 'sheduling', `image`], ''),
        state: containerSnapshot.getIn(['data', 'sheduling', `state`], ''),
        snapshotId: snapshot.get('id'),
        uid: containerSnapshot.getIn(['data', 'sheduling', 'uid'])
      }));
    }

    return <Table cols={containerCols} rows={rows} />;
  }
);
