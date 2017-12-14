import React from 'react';

import { getTraceViewFilteredByServiceStartingAtLink } from 'in-stores/navigation/paths/tracePaths';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import { getNumberOfTracesStartingAtService } from 'in-stores/traces';

export default function JumpToTracesOfServiceButton({ snapshotId }) {
  return (
    <CountBasedJumpToButton
      href$={getTraceViewFilteredByServiceStartingAtLink(snapshotId)}
      count$={getNumberOfTracesStartingAtService(snapshotId)}
      title="Traces Starting"
      tooltip="Jump to traces starting at this service"
    />
  );
}
