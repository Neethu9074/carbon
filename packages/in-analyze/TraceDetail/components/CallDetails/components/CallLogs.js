import React from 'react';

import ExpandableStackTrace from 'in-analyze/TraceDetail/components/CallDetails/components/ExpandableStackTrace/ExpandableStackTrace';
import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';

export default function CallLogs({ call }) {
  const logs = call.logs;

  if (logs.length > 0) {
    return (
      <Group title="Logs">
        {logs.map((log, i) => (
          <ExpandableStackTrace key={i} call={call} log={log} />
        ))}
      </Group>
    );
  }
  return null;
}
