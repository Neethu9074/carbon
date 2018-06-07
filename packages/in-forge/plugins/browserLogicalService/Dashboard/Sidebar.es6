import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import { getTraceViewLinkWithQuery } from 'in-stores/navigation/paths/tracePaths';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { getTraceCount } from 'in-stores/traces';

export default function ServiceDashboardSidebar({ snapshot }) {
  const snapshotId = snapshot.get('id');
  const query = `trace.touching:"${snapshotId}" AND trace.type:web AND trace.errorCount:>0`;

  return (
    <div>
      {!twoZeroModeEnabled && (
        <TracesButtonWrapper>
          <JumpToTracesTouchingServiceButton snapshotId={snapshotId} />
          <CountBasedJumpToButton
            href$={getTraceViewLinkWithQuery(query)}
            count$={getTraceCount(query)}
            title="Errors"
            tooltip="View traces for errors"
          />
        </TracesButtonWrapper>
      )}

      <ClusterMemberList snapshotId={snapshotId} />

      <ConnectionList snapshotId={snapshotId} />
    </div>
  );
}
