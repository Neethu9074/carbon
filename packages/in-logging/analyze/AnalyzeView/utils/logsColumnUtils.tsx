/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { formatDateTime } from '@instana/format-date';

import { LinkButton, LinkButtonProps } from 'in-logging/analyze/AnalyzeView/components/LinkButton';
import { CopyButton, CopyColumnProps } from 'in-logging/analyze/AnalyzeView/components/CopyButton';
import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
import { LogTag } from 'in-types';

import locals from 'in-logging/analyze/AnalyzeView/components/Logs.mless';

interface LogLevelColumnProps {
  tags: LogTag[];
  onSelectTagHref: (tag: LogTag) => string;
}

export const logLevelColumn = {
  id: 'logLevel',
  width: '6rem',
  widthInAbsoluteUnit: true,
  getContent({ tags, onSelectTagHref }: LogLevelColumnProps) {
    return (
      <div data-testid="log-level-pill" className={locals.healthColumn}>
        <LogHealthColumn tags={tags} onSelectTagHref={onSelectTagHref} />
      </div>
    );
  }
};

interface TimestampColumnProps {
  timestamp: number;
}

export const timestampColumn = {
  id: 'timestamp',
  width: '10rem',
  useMaxHeight: true,
  widthInAbsoluteUnit: true,
  getContent({ timestamp }: TimestampColumnProps) {
    return (
      <div className={locals.dateTime} data-testid={`log-timestamp-${timestamp}`}>
        {formatDateTime(timestamp)}
      </div>
    );
  }
};

export const centerAlignedLinkColumn = {
  id: 'linkIcon',
  width: '2.5rem',
  getContent({ itemId, time, initialLogLines, groupKey }: LinkButtonProps) {
    return (
      <div id="log-link-button" className={locals.centeredCopyButtonWrapper}>
        <LinkButton
          className={locals.squareHover}
          itemId={itemId}
          time={time}
          initialLogLines={initialLogLines}
          groupKey={groupKey}
        />
      </div>
    );
  }
};

export const copyColumn = {
  id: 'copyIcon',
  width: '2.5rem',
  getContent({ message }: CopyColumnProps) {
    return (
      <div id="log-copy-button" className={locals.copyButtonWrapper}>
        <CopyButton className={locals.squareHover} message={message} />
      </div>
    );
  }
};

export const centerAlignedCopyColumn = {
  id: 'copyIcon',
  width: '2.5rem',
  getContent({ message }: CopyColumnProps) {
    return (
      <div id="log-copy-button" className={locals.centeredCopyButtonWrapper}>
        <CopyButton className={locals.squareHover} message={message} />
      </div>
    );
  }
};
