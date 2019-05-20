import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { number, millis } from 'in-services/formatters/number';

import Info from '../Info';

export default function MongoDbRelicaSetSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>MongoDb Replica Set</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection
        snapshot={snapshot}
        metrics={[
          {
            metric: 'connections',
            label: 'Connections',
            formatter: number,
            aggregation: 'sum'
          },
          {
            metric: 'repl.replication_lag',
            label: 'Replication Lag',
            formatter: millis.compact,
            aggregation: 'mean'
          }
        ]}
      />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
