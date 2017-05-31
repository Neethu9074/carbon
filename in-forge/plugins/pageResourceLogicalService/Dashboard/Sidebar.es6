import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import JumpToTracesOfServiceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceButton';
import PageAssetList from 'in-forge/plugins/pageResourceLogicalService/Dashboard/PageAssetList';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';

export default function PageResourceLogicalServiceSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <TracesButtonWrapper>
        <JumpToTracesOfServiceButton snapshotId={snapshotId} />
        <JumpToTracesTouchingServiceButton snapshotId={snapshotId} />
      </TracesButtonWrapper>

      <PageAssetList snapshot={snapshot} />

      <ConnectionList snapshotId={snapshotId} />
    </div>
  );
}
