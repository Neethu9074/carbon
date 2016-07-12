import irpt from 'react-immutable-proptypes';
import React from 'react';

import SparkChartsSection from 'in-components/sidebars/components/SparkChartsSection';
import ClusterMembersList from 'in-components/ClusterMembersList';


export default function LogicalWebAppSidebar({snapshot}) {
  return (
    <div>
      <SparkChartsSection snapshot={snapshot}/>
      <ClusterMembersList snapshotId={snapshot.get('id')} />
    </div>
  );
}

LogicalWebAppSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
