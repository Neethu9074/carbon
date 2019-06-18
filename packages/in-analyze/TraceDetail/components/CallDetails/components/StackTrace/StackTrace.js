import React, { Fragment } from 'react';

import StackTraceBehavior from 'in-analyze/TraceDetail/components/CallDetails/components/StackTrace/StackTraceBehavior';
import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import { find } from 'in-services/arrayUtils';

export default function StackTraceWrapper({ call }) {
  const entrySpan = find(call.spans, _span => _span.kind === 'ENTRY');
  const entryStackTrace =
    entrySpan && entrySpan.stackTrace && entrySpan.stackTrace.length > 0 ? entrySpan.stackTrace : null;

  const intermediateSpan = find(call.spans, _span => _span.kind === 'INTERMEDIATE' || _span.kind == null);
  const intermediateStackTrace =
    intermediateSpan && intermediateSpan.stackTrace && intermediateSpan.stackTrace.length > 0
      ? intermediateSpan.stackTrace
      : null;

  const exitSpan = find(call.spans, _span => _span.kind === 'EXIT');
  const exitStackTrace = exitSpan && exitSpan.stackTrace && exitSpan.stackTrace.length > 0 ? exitSpan.stackTrace : null;

  return (
    <Fragment>
      {exitStackTrace && (
        <Group title="Caller Stack Trace">
          <StackTraceBehavior relation={call.source} stackTrace={exitStackTrace} />
        </Group>
      )}
      {intermediateStackTrace && (
        <Group title="Stack Trace">
          <StackTraceBehavior relation={call.source} stackTrace={intermediateStackTrace} />
        </Group>
      )}
      {entryStackTrace && (
        <Group title="Callee Stack Trace">
          <StackTraceBehavior relation={call.destination} stackTrace={entryStackTrace} />
        </Group>
      )}
    </Fragment>
  );
}
