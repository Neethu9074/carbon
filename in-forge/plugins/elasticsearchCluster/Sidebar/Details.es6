import React from 'react';

import {withSiPrefixThreeDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';


export default function ElasticsearchClusterSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Elasticsearch Cluster</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <SparkChartsSection snapshot={snapshot}
                          metrics={[
                            {
                              metric: 'node_count',
                              label: 'Nodes',
                              formatter: withSiPrefixThreeDecimalPlaces
                            }, {
                              metric: 'indices_count',
                              label: 'Indices',
                              formatter: withSiPrefixThreeDecimalPlaces
                            }, {
                              metric: 'active_shards_count',
                              label: 'Active Shards',
                              formatter: withSiPrefixThreeDecimalPlaces
                            }, {
                              metric: 'document_count',
                              label: 'Documents',
                              formatter: withSiPrefixThreeDecimalPlaces
                            }, {
                              metric: 'store_size',
                              label: 'Store Size',
                              formatter: bytesTwoDecimalPlaces
                            }
                          ]} />

      <ClusterMemberList snapshotId={snapshotId} />

      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
