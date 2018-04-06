import React, { Fragment } from 'react';

import EntryOrExitWrapper from 'in-analyze/TraceDetail/components/CallDetails/components/EntryOrExitWrapper';
import { find } from 'in-services/arrayUtils';

import locals from './StackTrace.mless';

const STRIP_QUOTES_REGEX = /`|'/g;

export default function StackTraceWrapper({ call }) {
  return (
    <Fragment>
      <StackTrace call={call} />
      <StackTrace call={call} isEntry />
    </Fragment>
  );
}

function StackTrace({ call, isEntry }) {
  const kind = isEntry ? 'ENTRY' : 'EXIT';
  let entrySpan = find(call.spans, _span => _span.kind === kind);
  const stackTrace = entrySpan && entrySpan.stackTrace && entrySpan.stackTrace.length > 0 ? entrySpan.stackTrace : null;

  if (!stackTrace) {
    return null;
  }

  return (
    <EntryOrExitWrapper isEntry={isEntry}>
      <div className={locals.stackTrace}>
        <ol className={locals.list}>
          {stackTrace.map((st, i) => (
            <li key={i}>
              <span className={locals.method}> {stripQuotes(st.get('m'))} </span>
              <span className={locals.in}>in</span>
              <span>
                {' '}
                {st.get('c', st.get('f'))}
                {st.get('n') ? `:${st.get('n')}` : ''}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </EntryOrExitWrapper>
  );
}

// Some trace agents will record quotes in method names. We don't want to present these
// as it looks ugly.
// Ruby example: `<main>'
function stripQuotes(s) {
  return s.replace(STRIP_QUOTES_REGEX, '');
}
