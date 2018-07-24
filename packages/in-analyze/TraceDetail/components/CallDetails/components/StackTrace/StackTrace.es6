import React from 'react';

import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import { find } from 'in-services/arrayUtils';

import locals from './StackTrace.mless';

const STRIP_QUOTES_REGEX = /`|'/g;

export default function StackTraceWrapper({ call }) {
  const entrySpan = find(call.spans, _span => _span.kind === 'ENTRY');
  const entryStackTrace =
    entrySpan && entrySpan.stackTrace && entrySpan.stackTrace.length > 0 ? entrySpan.stackTrace : null;

  const exitSpan = find(call.spans, _span => _span.kind === 'EXIT');
  const exitStackTrace = exitSpan && exitSpan.stackTrace && exitSpan.stackTrace.length > 0 ? exitSpan.stackTrace : null;

  if (!entryStackTrace && !exitStackTrace) {
    return null;
  }

  return (
    <Group title="Stack Trace">
      <StackTrace stackTrace={entryStackTrace} />
      <StackTrace stackTrace={exitStackTrace} />
    </Group>
  );
}

function StackTrace({ stackTrace }) {
  if (!stackTrace) {
    return null;
  }

  return (
    <div className={locals.stackTrace}>
      <ol className={locals.list}>
        {stackTrace.map((st, i) => (
          <li key={i}>
            <span className={locals.method}> {stripQuotes(st.method)} </span>
            <span className={locals.in}>in</span>
            <span>
              {' '}
              {st.file}
              {st.line ? `:${st.line}` : ''}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Some trace agents will record quotes in method names. We don't want to present these
// as it looks ugly.
// Ruby example: `<main>'
function stripQuotes(s) {
  return s.replace(STRIP_QUOTES_REGEX, '');
}
