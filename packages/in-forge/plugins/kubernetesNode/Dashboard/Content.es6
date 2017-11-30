import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

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
      pods: getClusterMembers(props.snapshot.get('id')).flatMap(podIds => getSnapshots(podIds.toArray()))
    };
  },
  function PodsTable({ snapshot, pods = [], timeframe }) {
    const ready = snapshot
      .getIn(['data', 'conditions'], emptyList)
      .filter(cond => cond.get('type') === 'Ready')
      .first()
      .get('status');

    const rows = pods.map(pod => {
      const data = pod.get('data');
      return {
        key: data.get('name'),
        snapshotId: pod.get('id'),
        namespace: data.get('namespace'),
        timeframe
      };
    });

    const snapshotId = snapshot.get('id');

    return (
      <div>
        <KpiSection>
          <KpiHeading>{getLabel(snapshot)}</KpiHeading>
          <KpiKeyValue label="Hostname">
            <MetricValue snapshotId={snapshotId} initialValue={snapshot.getIn(['data', 'hostname'], null)} />
          </KpiKeyValue>
          <KpiKeyValue label="Internal IP">
            <MetricValue snapshotId={snapshotId} initialValue={snapshot.getIn(['data', 'internalIp'], null)} />
          </KpiKeyValue>
          <KpiKeyValue label="Ready">
            <MetricValue snapshotId={snapshotId} initialValue={ready} />
          </KpiKeyValue>
        </KpiSection>

        <DashboardSection title={`Pods (${rows.length})`}>
          <Table cols={cols} rows={rows} />
        </DashboardSection>
      </div>
    );
  }
);
