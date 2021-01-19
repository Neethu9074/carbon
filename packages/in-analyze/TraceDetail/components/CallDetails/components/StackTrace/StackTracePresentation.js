/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import ShowCodeButton from 'in-analyze/TraceDetail/components/CallDetails/components/StackTrace/ShowCodeButton';

import locals from './StackTracePresentation.mless';

const STRIP_QUOTES_REGEX = /`|'/g;

export default function StackTracePresentation({ stackTrace, isOnline, snapshot, noPadding }) {
  if (!stackTrace) {
    return null;
  }

  let noCodeLinkMessage;
  if (isOnline === false) {
    noCodeLinkMessage =
      'Please note: Source code can only be retrieved for processes that are still under monitoring by Instana.';
  } else if (!snapshot) {
    noCodeLinkMessage =
      'Please note: Source code can only be retrieved for processes where Instana could successfully link the corresponding infrastructure.';
  }

  return (
    <div className={locals.stackTrace}>
      <p className={locals.title}>StackTrace</p>
      <ol
        className={classNames({
          [locals.list]: true,
          [locals.noPadding]: noPadding
        })}
      >
        {stackTrace.map((st, i) => {
          const fileLine = combine(st.file, st.line);
          return (
            <li key={i}>
              {st.method && <span className={locals.method}>{stripQuotes(st.method)} </span>}
              <span className={locals.in}>in </span>
              <span>
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
