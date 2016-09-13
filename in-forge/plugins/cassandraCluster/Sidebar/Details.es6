import React from 'react';

import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import Separator from 'in-sdk/components/sidebar/Separator';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import {bytesTwoDecimalPlaces, withSiPrefixZeroDecimalPlaces} from 'in-services/formatters/number';

import Info from '../Info';


export default function CassandraClusterSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Cassandra Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection snapshot={snapshot}
                          metrics={[
                            {
                              metric: 'nodeCount',
                              label: 'Nodes',
                              formatter: withSiPrefixZeroDecimalPlaces
                            }, {
                              metric: 'keyspaceCount',
                              label: 'Keyspaces',
                              formatter: withSiPrefixZeroDecimalPlaces
                            }, {
                              metric: 'overallDiskSize',
                              label: 'Overall Size of Store',
                              formatter: bytesTwoDecimalPlaces
                            }
                          ]} />

      <Separator />
      <ClusterMemberList snapshotId={snapshotId} />
    </div>
  );
}
