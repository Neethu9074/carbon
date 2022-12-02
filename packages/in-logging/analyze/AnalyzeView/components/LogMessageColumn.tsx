/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useLayoutEffect, useEffect, MutableRefObject } from 'react';
import classNames from 'classnames';

import { GetHrefToGroupedView, GetHrefWithAdditionalTagFilter } from 'in-components/AnalyzeView/StateManagement';
import { ColumnContentProps } from 'in-logging/analyze/AnalyzeView/components/Logs/Logs';
import LogException from 'in-logging/analyze/AnalyzeView/components/LogException';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import useResizeObserver from 'in-hooks/useResizeObserver';

import locals from './LogMessageColumn.mless';

interface LogMessageColumnProps extends ColumnContentProps {
  getHrefToGroupedView: GetHrefToGroupedView;
  getHrefWithAdditionalTagFilter: GetHrefWithAdditionalTagFilter;
}

export default function LogMessageColumn(props: LogMessageColumnProps) {
  const { tags, message, timestamp, itemId, getHrefToGroupedView, getHrefWithAdditionalTagFilter, isToggled } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isToggled) {
      setIsExpanded?.(true);
    }
  }, [isToggled]);

  const messageRef = useRef<HTMLSpanElement>();

  const { ref, width: wrapperWidth } = useResizeObserver();

  useLayoutEffect(() => {
    const messageDOMElement = messageRef.current;
    if (messageDOMElement) {
      setIsOverflowing(messageDOMElement.offsetWidth < messageDOMElement.scrollWidth);
      setIsExpanded(false);
    }
  }, [wrapperWidth]);

  return (
    <div className={locals.messageWrapper} ref={ref as MutableRefObject<HTMLDivElement>}>
      <span
        className={classNames({
          [locals.collapsedMessage]: !isExpanded,
          [locals.messageExpanded]: isExpanded
        })}
        ref={messageRef as MutableRefObject<HTMLSpanElement>}
      >
        <LogMessage
          tags={tags}
          message={message}
          getHrefWithAdditionalTagFilter={getHrefWithAdditionalTagFilter}
          getHrefToGroupedView={getHrefToGroupedView}
          isOverflowing={isOverflowing}
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
