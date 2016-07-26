import React from 'react';

import {withSiPrefixThreeDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import SparkChartsSection from 'in-sdk/components/sidebar/SparkChartsSection';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import ClusterStatusLabel from '../ClusterStatusLabel';


export default function ElasticsearchClusterSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Elasticsearch Cluster</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title='Name'>
              {data.get('groupId')}
            </DescriptionItem>
            <DescriptionItem title='Status'>
              <ClusterStatusLabel status={data.get('clusterState')} />
            </DescriptionItem>
          </DescriptionList>
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

      <Separator />

      <ClusterMemberList snapshotId={snapshotId} />
    </div>
  );
}
