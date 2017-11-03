import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
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

export default function KubernetesNodeDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const pods = snapshot.getIn(['data', 'pods'], emptyList);

  const rows = pods
    .map(pod => {
      return {
        key: pod.get('name'),
        uid: pod.get('uid'),
        namespace: pod.get('namespace'),
        timeframe
      };
    })
    .valueSeq()
    .toArray();

  const ready = snapshot
    .getIn(['data', 'conditions'], emptyList)
    .filter(cond => cond.get('type') === 'Ready')
    .first()
    .get('status');
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
