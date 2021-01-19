/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ExpandableStackTrace from 'in-analyze/TraceDetail/components/CallDetails/components/ExpandableStackTrace/ExpandableStackTrace';
import { callExample } from './StackTrace.story.js';

export default {
  title: 'Templates|analyze/ExpandableStackTrace',
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
