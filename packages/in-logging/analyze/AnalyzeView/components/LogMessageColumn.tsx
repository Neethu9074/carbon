/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { ColumnContentProps } from 'in-logging/analyze/AnalyzeView/components/Logs/Logs';
import LogException from 'in-logging/analyze/AnalyzeView/components/LogException';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';

import locals from './LogMessageColumn.mless';

export default function LogMessageColumn(props: ColumnContentProps) {
  const { tags, message, timestamp, itemId, isToggled } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={locals.messageWrapper}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <span
        className={classNames({
          [locals.collapsedMessage]: isToggled !== undefined ? !isToggled : !isExpanded,
          [locals.messageExpanded]: isToggled !== undefined ? isToggled : isExpanded
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
