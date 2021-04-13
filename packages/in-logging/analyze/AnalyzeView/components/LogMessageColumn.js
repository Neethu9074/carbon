/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import TagList from 'in-logging/analyze/AnalyzeView/components/TagList';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import useResizeObserver from 'in-hooks/useResizeObserver';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './LogMessageColumn.mless';

export default function LogMessageColumn({ logTags, message, selectedTags, getHrefWithAdditionalTagFilter }) {
  const onSelectTagHref = tag => getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag));
  const tags = logTags.filter(({ name }) => selectedTags.indexOf(name) >= 0);

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
            [locals.collapsedMessage]: !isExpanded,
            [locals.messageExpanded]: isExpanded
          })}
          ref={messageRef}
        >
          <LogMessage
            logTags={logTags}
            message={message}
            getHrefWithAdditionalTagFilter={getHrefWithAdditionalTagFilter}
          />
        </span>

        {isOverflowing && (
          <SvgIcon
            className={locals.icon}
            type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        )}

        <TraceIcon logTags={logTags} />
      </div>

      {tags.length > 0 && (
        <HorizontalFlexWrapper className={locals.tagsWrapper}>
          <TagList tags={tags} onSelectTagHref={onSelectTagHref} />
        </HorizontalFlexWrapper>
      )}
    </div>
  );
}

function getTagExpressionWithTag(tag) {
  return {
    ...tag,
    type: TAG,
    operator: EQUALS
  };
}

function TraceIcon({ logTags }) {
  const traceId = logTags.filter(({ name }) => name === 'log.traceId')[0]?.stringValue;
  return traceId ? (
    <Link href$={getLinkToTraceDetail(traceId)}>
      <SvgIcon className={locals.icon} type="lib_application_trace" />
    </Link>
  ) : null;
}
