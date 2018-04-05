import React, { Fragment } from 'react';

import { find } from 'in-services/arrayUtils';

import locals from './StackTrace.mless';

const STRIP_QUOTES_REGEX = /`|'/g;

export default function StackTraceWrapper({ call }) {
  let entrySpan = find(call.spans, _span => _span.kind === 'ENTRY');
  let exitSpan = find(call.spans, _span => _span.kind === 'EXIT');

  const entryStackTrace =
    entrySpan && entrySpan.stackTrace && entrySpan.stackTrace.length > 0 ? entrySpan.stackTrace : null;
  const exitStackTrace = exitSpan && exitSpan.stackTrace && exitSpan.stackTrace.length > 0 ? exitSpan.stackTrace : null;

  return (
    <Fragment>
      {entryStackTrace && <h3>From</h3>}
      {entryStackTrace && <StackTrace stackTrace={entryStackTrace} />}
      <br />
      {exitStackTrace && <h3>To</h3>}
      {exitStackTrace && <StackTrace stackTrace={exitStackTrace} />}
    </Fragment>
  );
}

function StackTrace({ stackTrace }) {
  return (
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
  );
}

// Some trace agents will record quotes in method names. We don't want to present these
// as it looks ugly.
// Ruby example: `<main>'
function stripQuotes(s) {
  return s.replace(STRIP_QUOTES_REGEX, '');
}
