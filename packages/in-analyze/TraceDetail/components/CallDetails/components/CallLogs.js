/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import ExpandableStackTrace from 'in-analyze/TraceDetail/components/CallDetails/components/ExpandableStackTrace/ExpandableStackTrace';

export default function CallLogs({ call }) {
  const logs = call.logs;

  if (logs.length > 0) {
    return (
      <Fragment>
        {logs
          .slice()
          .sort(sortLogs)
          .map((log, i) => (
            <ExpandableStackTrace key={i} call={call} log={log} />
          ))}
      </Fragment>
    );
  }
  return null;
}

function sortLogs(a, b) {
  // first sort by log level (errors before warnings)
  // then sort by timestamp asc
  if (a.errorCount === b.errorCount) {
    return a.start - b.start;
  } else {
    return b.errorCount - a.errorCount;
  }
}
