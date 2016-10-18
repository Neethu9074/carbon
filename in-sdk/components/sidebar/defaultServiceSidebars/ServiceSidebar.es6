import React from 'react';

import ServiceKpiSparkCharts from 'in-sdk/components/sidebar/defaultServiceSidebars/ServiceKpiSparkCharts';
import JumpToTracesButton from 'in-sdk/components/sidebar/JumpToTracesButton';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import Separator from 'in-sdk/components/sidebar/Separator';


export default function ServiceSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <JumpToTracesButton snapshotId={snapshotId}/>

      <ServiceKpiSparkCharts snapshot={snapshot} />

      <ClusterMemberList snapshotId={snapshot.get('id')} />

      <Separator />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
