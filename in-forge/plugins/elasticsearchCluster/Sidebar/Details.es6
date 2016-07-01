import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ClusterMembersList from 'in-components/ClusterMembersList';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import * as timelineStore from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import SparkChartsSection from './SparkChartsSection';
import ClusterStatusLabel from '../ClusterStatusLabel';


export default connectTo({
    timeframe: timelineStore.timeframe
  },
  function ElasticsearchClusterSidebar({snapshot, timeframe}) {
    const snapshotId = snapshot.get('id');
    const data = snapshot.get('data');

    return (
      <div>
        <DescriptionList>
          {item('Health', <AnnotatedHealthBar snapshotId={snapshotId}/>)}
          {item('Name', data.get('groupId'))}
          {item('Status', <ClusterStatusLabel status={data.get('clusterState')} />)}
        </DescriptionList>

        <SparkChartsSection snapshotId={snapshotId}
                            timeframe={timeframe}/>

        <ClusterMembersList snapshotId={snapshotId} />
      </div>
    );
  }
);

function item(header, content) {
  return (
    <DescriptionItem title={header}>
    {content}
    </DescriptionItem>
  );
}
