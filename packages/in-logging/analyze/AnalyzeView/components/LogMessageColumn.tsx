/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { GetHrefToGroupedView, GetHrefWithAdditionalTagFilter } from 'in-components/AnalyzeView/StateManagement';
import { ColumnContentProps } from 'in-logging/analyze/AnalyzeView/components/Logs/Logs';
import LogException from 'in-logging/analyze/AnalyzeView/components/LogException';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';

import locals from './LogMessageColumn.mless';

interface LogMessageColumnProps extends ColumnContentProps {
  getHrefToGroupedView: GetHrefToGroupedView;
  getHrefWithAdditionalTagFilter: GetHrefWithAdditionalTagFilter;
}

export default function LogMessageColumn(props: LogMessageColumnProps) {
  const { tags, message, timestamp, itemId, getHrefToGroupedView, getHrefWithAdditionalTagFilter, isToggled } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsExpanded?.(isToggled);
  }, [isToggled]);

  return (
    <div className={locals.messageWrapper}>
      <span
        className={classNames({
          [locals.collapsedMessage]: !isExpanded,
          [locals.messageExpanded]: isExpanded
        })}
      >
        <LogMessage
          tags={tags}
          message={message}
          getHrefWithAdditionalTagFilter={getHrefWithAdditionalTagFilter}
          getHrefToGroupedView={getHrefToGroupedView}
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          setIsHovered={setIsHovered}
          isHovered={isHovered}
        />
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
