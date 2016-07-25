import React from 'react';

import ClusterStatusLabel from 'in-forge/plugins/elasticsearchCluster/ClusterStatusLabel';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function ElasticsearchClusterSidebar({snapshot}) {
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

      <Separator />

      <Collapsible>
        <Collapsible.Header>Nodes</Collapsible.Header>
        <Collapsible.Content>
          <DescriptionList>
            <DescriptionItem title='Nodes'>
              {data.get('nodeCount')}
            </DescriptionItem>
            <DescriptionItem title='Data Nodes'>
              {data.get('dataNodeCount')}
            </DescriptionItem>
            <DescriptionItem title='Master Nodes'>
              {data.get('masterNodeCount')}
            </DescriptionItem>
          </DescriptionList>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
