/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import ShowCodeButton from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/ShowCodeButton';
import { t } from 'in-i18n';

import locals from './StackTracePresentation.mless';

const STRIP_QUOTES_REGEX = /`|'/g;

export default function StackTracePresentation({ stackTrace, isOnline, snapshot, noPadding }) {
  let noCodeLinkMessage;
  if (isOnline === false) {
    noCodeLinkMessage = t(
      'in-analyze:traceDetail.components.callDetails.pleaseNoteSourceCodeCanOnlyBeRetrievedForProcessesThatAreStillUnderMonitoringByInstana'
    );
  } else if (!snapshot) {
    noCodeLinkMessage = t(
      'in-analyze:traceDetail.components.callDetails.pleaseNoteSourceCodeCanOnlyBeRetrievedForProcessesWhereInstanaCouldSuccessfullyLinkTheCorrespondingInfrastructure'
    );
  }

  return (
    <>
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
              <span className={locals.in}>{t('in-analyze:traceDetail.components.callDetails.in')}</span>
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
    </>
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
