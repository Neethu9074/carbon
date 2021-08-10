/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';

import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import IconButton from 'in-components/IconButton/IconButton';
import useResizeObserver from 'in-hooks/useResizeObserver';
import { LOG_TRACE_ID } from 'in-logging/queryBuilder';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

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
    <div className={locals.wrapper}>
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
          />
        </span>

        <div>
          {isOverflowing && (
            <IconButton
              type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          )}

          <TraceIcon tags={tags} />
        </div>
      </div>
    </div>
  );
}

function TraceIcon({ tags }) {
  const traceId = tags.filter(({ name }) => name === LOG_TRACE_ID)[0]?.stringValue;
  return traceId ? (
    <Tooltip content={t('in-logging:goToTrace')}>
      <IconButton type="lib_application_trace" href$={getLinkToTraceDetail(traceId)} />
    </Tooltip>
  ) : null;
}
