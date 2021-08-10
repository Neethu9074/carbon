/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';

import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import IconButton from 'in-components/IconButton/IconButton';
import useResizeObserver from 'in-hooks/useResizeObserver';

import locals from './LogMessageColumn.mless';

export default function LogMessageColumn(props) {
  const { tags, message, getHrefToGroupedView, getHrefWithAdditionalTagFilter } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const messageRef = useRef();

  const { ref, width: wrapperWidth } = useResizeObserver();

  useLayoutEffect(() => {
    const messageDOMElement = messageRef.current;
    setIsOverflowing(messageDOMElement.offsetWidth < messageDOMElement.scrollWidth);
    setIsExpanded(false);
  }, [wrapperWidth]);

  return (
    <div className={locals.messageWrapper} ref={ref}>
      <span
        className={classNames({
          [locals.message]: true,
          [locals.collapsedMessage]: !isExpanded,
          [locals.messageExpanded]: isExpanded
        })}
        ref={messageRef}
      >
        <LogMessage
          tags={tags}
          message={message}
          getHrefWithAdditionalTagFilter={getHrefWithAdditionalTagFilter}
          getHrefToGroupedView={getHrefToGroupedView}
          isOverflowing={isOverflowing}
          setIsExpanded={setIsExpanded}
        />
      </span>

      <IconButton
        className={locals.expandButton}
        type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
        onClick={() => setIsExpanded(!isExpanded)}
      />
    </div>
  );
}
