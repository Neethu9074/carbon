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
        'Please note: Code can only be retrieved for entities which are still under monitoring by Instana.';
    } else if (!snapshot) {
      noCodeLinkMessage =
        'Please note: Code can only be retrieved for entities where Instana could successfully link the corresponding infrastucture.';
    }

    return (
      <div>
        {noCodeLinkMessage && (
          <div className={locals.noCodeLinkMessage}>
            <span>{noCodeLinkMessage}</span>
          </div>
        )}
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
        </div>
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
