import React, { Fragment } from 'react';
import { get } from 'lodash';

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
          <StackTrace relation={call.source} stackTrace={exitStackTrace} />
        </Group>
      )}
      {intermediateStackTrace && (
        <Group title="Stack Trace">
          <StackTrace relation={call.source} stackTrace={intermediateStackTrace} />
        </Group>
      )}
      {entryStackTrace && (
        <Group title="Callee Stack Trace">
          <StackTrace relation={call.destination} stackTrace={entryStackTrace} />
        </Group>
      )}
    </Fragment>
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
      snapshot: getSnapshot(snapshotId, getTimeConfigAtMoment(null)) // passing NULL, to get the snapshot from cache.
    };
  },
  function StackTrace({ stackTrace, isOnline, snapshot }) {
    if (!stackTrace) {
      return null;
    }

    let noCodeLinkMessage;
    if (isOnline === false) {
      noCodeLinkMessage =
        'Please note: Source code can only be retrieved for processes which are still under monitoring by Instana.';
    } else if (!snapshot) {
      noCodeLinkMessage =
        'Please note: Source code can only be retrieved for processes where Instana could successfully link the corresponding infrastucture.';
    }

    return (
      <div className={locals.stackTrace}>
        <ol className={locals.list}>
          {stackTrace.map((st, i) => {
            const fileLine = combine(st.file, st.line);
            return (
              <li key={i}>
                <span className={locals.method}> {stripQuotes(st.method)} </span>
                <span className={locals.in}>in</span>
                <span>
                  {' '}
                  {isOnline && snapshot ? (
                    <ShowCodeButton snapshot={snapshot} file={st.file} line={st.line}>
                      {fileLine}
                    </ShowCodeButton>
                  ) : (
                    fileLine
                  )}
                </span>
              </li>
            );
          })}
        </ol>

        {noCodeLinkMessage && <p className={locals.noCodeLinkMessage}>{noCodeLinkMessage}</p>}
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
