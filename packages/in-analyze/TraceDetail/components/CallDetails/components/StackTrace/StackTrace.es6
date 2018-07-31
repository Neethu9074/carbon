import { get } from 'lodash';
import React from 'react';

import ShowCodeButton from 'in-analyze/TraceDetail/components/CallDetails/components/StackTrace/ShowCodeButton';
import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import { isEntityOnline, getSnapshot } from 'in-stores/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { find } from 'in-services/arrayUtils';
import connectTo from 'in-hoc/connectTo';

import locals from './StackTrace.mless';

const STRIP_QUOTES_REGEX = /`|'/g;

export default function StackTraceWrapper({ call }) {
  const entrySpan = find(call.spans, _span => _span.kind === 'ENTRY');
  const entryStackTrace =
    entrySpan && entrySpan.stackTrace && entrySpan.stackTrace.length > 0 ? entrySpan.stackTrace : null;

  const intermediateSpan = find(call.spans, _span => _span.kind === 'INTERMEDIATE');
  const intermediateStackTrace =
    intermediateSpan && intermediateSpan.stackTrace && intermediateSpan.stackTrace.length > 0
      ? intermediateSpan.stackTrace
      : null;

  const exitSpan = find(call.spans, _span => _span.kind === 'EXIT');
  const exitStackTrace = exitSpan && exitSpan.stackTrace && exitSpan.stackTrace.length > 0 ? exitSpan.stackTrace : null;

  if (!entryStackTrace && !exitStackTrace) {
    return null;
  }

  return (
    <Group title="Stack Trace">
      <StackTrace relation={call.source} stackTrace={exitStackTrace} />
      <StackTrace relation={call.source} stackTrace={intermediateStackTrace} />
      <StackTrace relation={call.destination} stackTrace={entryStackTrace} />
    </Group>
  );
}

const StackTrace = connectTo(
  ({ relation, stackTrace }) => {
    const snapshotId = get(relation, ['physicalContext', 'process', 'id']);
    if (stackTrace == null || snapshotId == null) {
      return {};
    }
    return {
      isOnline: isEntityOnline(snapshotId),
      snapshot: getSnapshot(snapshotId, getTimeConfigAtMoment(null))
    };
  },
  function StackTrace({ stackTrace, isOnline, snapshot }) {
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
                {isOnline && snapshot ? (
                  <ShowCodeButton snapshot={snapshot} file={st.file} line={st.line}>
                    {combine(st.file, st.line)}
                  </ShowCodeButton>
                ) : (
                  combine(st.file, st.line)
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
);

function combine(file, line) {
  if (line != null) {
    return `${file}:${line}`;
  }
  return file;
}

// Some trace agents will record quotes in method names. We don't want to present these
// as it looks ugly.
// Ruby example: `<main>'
function stripQuotes(s) {
  return s.replace(STRIP_QUOTES_REGEX, '');
}
