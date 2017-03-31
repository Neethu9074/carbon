import React from 'react';

import { getTraceViewFilteredByServiceInstanceStartingAtLink } from 'in-stores/navigation/search';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import { getNumberOfTracesStartingAtServiceInstance } from 'in-stores/traces';

export default function JumpToTracesOfServiceInstanceButton({ snapshotId }) {
  return (
    <CountBasedJumpToButton
      href$={getTraceViewFilteredByServiceInstanceStartingAtLink(snapshotId)}
      count$={getNumberOfTracesStartingAtServiceInstance(snapshotId)}
      title="Traces Starting"
      tooltip="Jump to traces starting at this service instance"
    />
  );
}
