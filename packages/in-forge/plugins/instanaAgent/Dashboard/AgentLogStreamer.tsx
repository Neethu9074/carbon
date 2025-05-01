/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import LogStreamer, { AggregateOptions } from 'in-forge/plugins/instanaAgent/Dashboard/LogStreamer';
import { SnapshotData } from 'in-stores/snapshot';

export default function AgentLogStreamer({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <LogStreamer
      snapshot={snapshot}
      action="agent.log.start"
      stopAction="agent.log.stop"
      onAggregate={readLogs}
      throttle
      logStreamTargetId="agentLogStreamId"
    />
  );
}

function readLogs(data: any, agg: AggregateOptions) {
  if (!data) {
    return;
  }
  agg.log += data;
}
