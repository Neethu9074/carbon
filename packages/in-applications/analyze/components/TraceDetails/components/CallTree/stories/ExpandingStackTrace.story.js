/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ExpandableStackTrace from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/ExpandableStackTrace/ExpandableStackTrace';
import { callExample } from 'in-applications/analyze/components/TraceDetails/components/CallTree/stories/StackTrace.story.js';

export default {
  component: ExpandableStackTrace
};
export function ExpandingStackTrace() {
  const logs = callExample.logs;

  return (
    <>
      {logs.map((log, i) => (
        <ExpandableStackTrace key={i} log={log} call={callExample} />
      ))}
    </>
  );
}
