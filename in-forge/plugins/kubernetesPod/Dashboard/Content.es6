import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

import MetricValue from 'in-components/MetricValue';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sdk/components/dashboard/Table';

import { emptyList } from 'in-services/fixedImmutables';

import { getLabel } from 'in-sdk/snapshot';

const containerCols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
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
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `containers.data.${row.key}.restartCount`;
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
  const containerIds = snapshot.getIn(['data', 'containers.itemIds'], emptyList);
  const containerRows = containerIds
    .map(uid => {
      return {
        key: uid,
        name: snapshot.getIn(['data', `containers.data.${uid}.name`], null),
        state: snapshot.getIn(['data', `containers.data.${uid}.state`], null),
        image: snapshot.getIn(['data', `containers.data.${uid}.image`], null),
        snapshotId: snapshotId
      };
    })
    .valueSeq()
    .toArray();

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
        <Table cols={containerCols} rows={containerRows} />
      </DashboardSection>
    </div>
  );
}
