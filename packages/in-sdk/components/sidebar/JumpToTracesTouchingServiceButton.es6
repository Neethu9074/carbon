import React from 'react';

import { getTraceViewFilteredByTouchingLink } from 'in-stores/navigation/paths/tracePaths';
import CountBasedJumpToButton from 'in-sdk/components/sidebar/CountBasedJumpToButton';
import { getNumberOfTracesTouchingService } from 'in-stores/traces';

export default function JumpToTracesTouchingServiceButton({ snapshotId }) {
  return (
    <CountBasedJumpToButton
      href$={getTraceViewFilteredByTouchingLink(snapshotId)}
      count$={getNumberOfTracesTouchingService(snapshotId)}
      title="Traces Touching"
      tooltip="Jump to traces touching this service"
    />
  );
}
