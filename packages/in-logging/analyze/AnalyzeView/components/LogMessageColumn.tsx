/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ColumnContentProps } from 'in-logging/analyze/AnalyzeView/components/Logs/Logs';
import LogException from 'in-logging/analyze/AnalyzeView/components/LogException';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';

import locals from './LogMessageColumn.mless';

export default function LogMessageColumn(props: ColumnContentProps) {
  const { tags, message, timestamp, itemId, isToggled } = props;

  return (
    <div className={locals.messageWrapper}>
      <span
        className={classNames({
          [locals.collapsedMessage]: !isToggled,
          [locals.messageExpanded]: isToggled
        })}
      >
        <LogMessage tags={tags} message={message} />
      </span>
      <LogException
        item={{
          tags,
          timestamp,
          message,
          itemId
        }}
      />
    </div>
  );
}
