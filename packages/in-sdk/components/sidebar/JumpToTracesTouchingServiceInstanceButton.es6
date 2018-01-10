import React from 'react';

import { getTraceViewFilteredByTouchingLink } from 'in-stores/navigation/paths/tracePaths';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import { getNumberOfTracesTouchingServiceInstance } from 'in-stores/traces';

export default function JumpToTracesTouchingServiceInstanceButton({ snapshotId }) {
  return (
    <CountBasedJumpToButton
      href$={getTraceViewFilteredByTouchingLink(snapshotId)}
      count$={getNumberOfTracesTouchingServiceInstance(snapshotId)}
      title="Traces Touching"
      tooltip="Jump to traces touching this service instance"
    />
  );
}
