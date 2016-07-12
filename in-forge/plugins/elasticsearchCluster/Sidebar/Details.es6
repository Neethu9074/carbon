import irpt from 'react-immutable-proptypes';
import React from 'react';

import SparkChartsSection from 'in-components/sidebars/components/SparkChartsSection';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ClusterMembersList from 'in-components/ClusterMembersList';
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

      <SparkChartsSection snapshot={snapshot} />

      <ClusterMembersList snapshotId={snapshotId} />
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
