import React, { Fragment } from 'react';

import ExpandableStackTrace from 'in-analyze/TraceDetail/components/CallDetails/components/ExpandableStackTrace/ExpandableStackTrace';

export default function CallLogs({ call }) {
  const logs = call.logs;

  if (logs.length > 0) {
    return (
      <Fragment>
        {logs
          .slice()
          .sort((a, b) => b.start - a.start)
          .map((log, i) => (
            <ExpandableStackTrace key={i} call={call} log={log} />
          ))}
      </Fragment>
    );
  }
  return null;
}
