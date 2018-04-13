import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
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

    return (
      <div>
        <KpiSection>
          <KpiHeading>{getLabel(snapshot)}</KpiHeading>
          <KpiKeyValue label="Hostname">{snapshot.getIn(['data', 'hostname'], null)}</KpiKeyValue>
          <KpiKeyValue label="Internal IP">{snapshot.getIn(['data', 'internalIp'], null)}</KpiKeyValue>
          <KpiKeyValue label="Ready">{ready}</KpiKeyValue>
        </KpiSection>

        <Columize>
          <DashboardSection title="Required vs Limit vs Capacity CPU Shares">
            <Chart
              snapshotId={snapshot.get('id')}
              timeframe={timeframe}
              y1={{
                formatter: twoDecimalPlaces,
                metrics: ['required_cpu', 'limit_cpu', 'cap_cpu'],
                labels: ['Required', 'Limit', 'Capacity'],
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Required vs Limit vs Capacity Memory">
            <Chart
              snapshotId={snapshot.get('id')}
              timeframe={timeframe}
              y1={{
                formatter: bytesTwoDecimalPlaces,
                metrics: ['required_mem', 'limit_mem', 'cap_mem'],
                labels: ['Required', 'Limit', 'Capacity'],
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <DashboardSection title="Allocatable vs Capacity Pods">
          <Chart
            snapshotId={snapshot.get('id')}
            timeframe={timeframe}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['alloc_pods', 'cap_pods'],
              labels: ['Allocatable', 'Capacity'],
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
