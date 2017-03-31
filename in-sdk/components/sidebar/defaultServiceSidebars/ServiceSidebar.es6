import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import ServiceKpiSparkCharts from 'in-sdk/components/sidebar/defaultServiceSidebars/ServiceKpiSparkCharts';
import JumpToTracesOfServiceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceButton';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';

export default function ServiceSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <TracesButtonWrapper>
        <JumpToTracesOfServiceButton snapshotId={snapshotId} />
        <JumpToTracesTouchingServiceButton snapshotId={snapshotId} />
      </TracesButtonWrapper>

      <ServiceKpiSparkCharts snapshot={snapshot} />

      <ClusterMemberList snapshotId={snapshot.get('id')} />

      <ConnectionList snapshotId={snapshot.get('id')} />
    </div>
  );
}
