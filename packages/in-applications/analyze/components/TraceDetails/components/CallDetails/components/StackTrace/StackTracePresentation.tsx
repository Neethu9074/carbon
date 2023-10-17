/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import ShowCodeButton from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/ShowCodeButton';
import { ParsedStackTrace } from 'in-components/Logging/TraceDetails/components/LogDetails/utils';
import { SnapshotData } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './StackTracePresentation.mless';

const STRIP_QUOTES_REGEX = /`|'/g;

export interface StackTracePresentationProps {
  noPadding: boolean;
  snapshot: SnapshotData | null;
  isOnline: boolean;
  stackTrace: ParsedStackTrace[] | null;
}

export default function StackTracePresentation({
  stackTrace,
  isOnline,
  snapshot,
  noPadding
}: StackTracePresentationProps) {
  let noCodeLinkMessage;

  if (isOnline === false) {
    noCodeLinkMessage = t(
      'in-analyze:traceDetail.components.callDetails.pleaseNoteSourceCodeCanOnlyBeRetrievedForProcessesThatAreStillUnderMonitoringByInstana'
    );
  } else if (!snapshot) {
    noCodeLinkMessage = t(
      'in-analyze:traceDetail.components.callDetails.pleaseNoteSourceIsCompiledAndThereforeWeCannotShowMoreDetails'
    );
  }

  return (
    <>
      {noCodeLinkMessage && (
        <Tooltip content={noCodeLinkMessage} align="topMiddle">
          <div>
            <ListContent isOnline={isOnline} snapshot={snapshot} stackTrace={stackTrace} noPadding={noPadding} />
          </div>
        </Tooltip>
      )}
      {!noCodeLinkMessage && (
        <ListContent isOnline={isOnline} snapshot={snapshot} stackTrace={stackTrace} noPadding={noPadding} />
      )}
    </>
  );
}

function combine(file: string, line: string) {
  if (line != null) {
    return `${file}:${line}`;
  }
  return file;
}

// Some trace agents will record quotes in method names. We don't want to present these
// as it looks ugly.
// Ruby example: `<main>'
function stripQuotes(s: string) {
  return s.replace(STRIP_QUOTES_REGEX, '');
}

function ListContent({ stackTrace, isOnline, snapshot, noPadding }: StackTracePresentationProps) {
  return (
    <ol
      className={classNames({
        [locals.list]: true,
        [locals.noPadding]: noPadding
      })}
    >
      {stackTrace?.map((st, i) => {
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
  );
}
