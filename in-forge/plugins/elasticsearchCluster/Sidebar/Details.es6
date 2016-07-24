import irpt from 'react-immutable-proptypes';
import React from 'react';

import {withSiPrefixTwoDecimalPlaces, bytesTwoDecimalPlaces} from 'in-services/formatters/number';
import SparkChartsSection from 'in-components/sidebars/components/SparkChartsSection';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';

import ClusterStatusLabel from '../ClusterStatusLabel';


export default function ElasticsearchClusterSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        {item('Health', <AnnotatedHealthBar snapshotId={snapshotId}/>)}
        {item('Name', data.get('groupId'))}
        {item('Status', <ClusterStatusLabel status={data.get('clusterState')} />)}
      </DescriptionList>

      <SparkChartsSection snapshot={snapshot}
                          metrics={[
                            {
                              metric: 'node_count',
                              label: 'Nodes',
                              formatter: withSiPrefixTwoDecimalPlaces
                            }, {
                              metric: 'indices_count',
                              label: 'Indices',
                              formatter: withSiPrefixTwoDecimalPlaces
                            }, {
                              metric: 'active_shards_count',
                              label: 'Active Shards',
                              formatter: withSiPrefixTwoDecimalPlaces
                            }, {
                              metric: 'document_count',
                              label: 'Documents',
                              formatter: withSiPrefixTwoDecimalPlaces
                            }, {
                              metric: 'store_size',
                              label: 'Size of store',
                              formatter: bytesTwoDecimalPlaces
                            }
                          ]} />

      <ClusterMemberList snapshotId={snapshotId} />
    </div>
  );
}

function item(header, content) {
  return (
    <DescriptionItem title={header}>
    {content}
    </DescriptionItem>
  );
}

ElasticsearchClusterSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
