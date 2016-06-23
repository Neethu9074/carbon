import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import ClusterMembersList from 'in-components/ClusterMembersList';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';


export default function CassandraClusterSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Health'>
          <AnnotatedHealthBar snapshotId={snapshotId}/>
        </DescriptionItem>
        <DescriptionItem title='Name'>
          {data.get('groupId')}
        </DescriptionItem>
      </DescriptionList>

      <ClusterMembersList snapshotId={snapshotId} />
    </div>
  );
}
