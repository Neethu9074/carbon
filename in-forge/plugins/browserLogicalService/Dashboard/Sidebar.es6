import React from 'react';

import JumpToTracesTouchingServiceButton from 'in-sdk/components/sidebar/JumpToTracesTouchingServiceButton';
import JumpToTracesOfServiceButton from 'in-sdk/components/sidebar/JumpToTracesOfServiceButton';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import TracesButtonWrapper from 'in-sdk/components/sidebar/TracesButtonWrapper';
import ClusterMemberList from 'in-sdk/components/sidebar/ClusterMemberList';
import ConnectionList from 'in-sdk/components/sidebar/ConnectionList';
import {getTraceViewLinkWithQuery} from 'in-stores/navigation/view';
import {getTraceCount} from 'in-stores/traces';

export default function ServiceDashboardSidebar({snapshot}) {
  const snapshotId = snapshot.get('id');
  const query = `touching:"${snapshotId}" AND spanType:web AND errors:>0`;

  return (
    <div>
      <TracesButtonWrapper>
        <JumpToTracesOfServiceButton snapshotId={snapshotId} />
        <JumpToTracesTouchingServiceButton snapshotId={snapshotId} />
      </TracesButtonWrapper>

      <CountBasedJumpToButton href$={getTraceViewLinkWithQuery(query)}
                              count$={getTraceCount(query)}
                              title='Uncaught errors'
                              tooltip='View traces for uncaught errors' />

      <ClusterMemberList snapshotId={snapshotId} />

      <ConnectionList snapshotId={snapshotId} />
    </div>
  );
}
