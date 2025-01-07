/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { StackTraceItem } from '@instana/types';
import { Button } from '@instana/components';

import { determineCombineMethod } from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/utils';
import ShowCodeButton from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/ShowCodeButton';
import { SnapshotData } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './StackTracePresentation.mless';

export interface StackTracePresentationProps {
  noPadding: boolean;
  snapshot?: SnapshotData | null;
  isOnline: boolean;
  stackTrace: StackTraceItem[];
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
        <Tooltip content={noCodeLinkMessage} align="auto">
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

function ListContent({ stackTrace, isOnline, snapshot, noPadding }: StackTracePresentationProps) {
  const [isCopied, setIsCopied] = useState(false);
  const combineLanguage = determineCombineMethod(stackTrace);

  function copyToClipboard(stackTrace: StackTraceItem[]) {
    const formattedStackTrace = stackTrace.map(combineLanguage);
    navigator.clipboard
      .writeText(formattedStackTrace.join('\n'))
      .then(() => setIsCopied(true))
      .then(() => setTimeout(() => setIsCopied(false), 2000));
  }

  return (
    <div className={locals.stackTrace}>
      <Button kind="action" onClick={() => copyToClipboard(stackTrace)} className={locals.copyButton} noAutoMargin>
        {isCopied ? t('in-components:copyToClipboardCopied', 'Copied!') : t('in-automation:copy', 'Copy')}
      </Button>
      <ol className={classNames({ [locals.list]: true, [locals.noPadding]: noPadding })}>
        {stackTrace.map((stackTraceItem, i) => {
          const { file, line } = stackTraceItem;
          const canShowCodeView = isOnline && snapshot && file && line;

          return (
            <li key={i}>
              <span>
                {canShowCodeView ? (
                  <ShowCodeButton snapshot={snapshot} file={file} line={line}>
                    {combineLanguage(stackTraceItem)}
                  </ShowCodeButton>
                ) : (
                  combineLanguage(stackTraceItem)
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
