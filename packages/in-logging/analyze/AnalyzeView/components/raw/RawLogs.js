/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';

// import getLogsForConsole from 'in-logging/subscriptions/getLogsForConsole';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/raw/QueryBuilderWorkspace';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import LogDetail from 'in-logging/analyze/AnalyzeView/LogDetail/LogDetail';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { formatDateTime } from 'in-services/formatters/date';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { rawLogsPath } from 'in-logging/navigation/paths';
import getLogs from 'in-logging/subscriptions/getLogs';
import { urlQueryKeys } from 'in-stores/time/config';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './RawLogs.mless';

const MAX_ALLOWED_ITEMS_TO_RENDER = 10000;

const columnDefinitions = [
  {
    id: 'timestamp',
    label: t('in-logging:time'),
    width: '7.75rem',
    getContent({ log }) {
      return <span className={locals.time}>{formatDateTime(log.timestamp)}</span>;
    }
  },
  {
    id: 'log',
    label: t('in-logging:log'),
    getContent({ log, groupLabel, getHrefToDetailId, selectedTags }) {
      const tags = log.tags.filter(({ tag }) => selectedTags.indexOf(tag.label) >= 0);

      return (
        <>
          {tags.map(({ tag, value }, i) => (
            <Tag key={tag.label} name={tag.label} value={value} index={i} />
          ))}
          <Link className={locals.message} href={getHrefToDetailId(log.id, groupLabel)}>
            {log.content}
          </Link>
        </>
      );
    }
  }
];

export default function RawLogs(props) {
  const { detailId, orderBy, SplitScreenListItemContent } = props;

  const scrollContainerRef = useRef();
  const backendQueryModel = useStableObjectInstance(props.backendQueryModel);
  const timeConfig = useTimeConfig();
  const cursorPaginationState = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, backendQueryModel, orderBy, cursor }),
    [timeConfig, backendQueryModel]
  );
  const { items, errors, progress, canLoadMore, loadMore, result } = cursorPaginationState;

  const isLoading = props.isLoading || progress?.loading;
  // We deliberately use props.isLoading, because we do not want to remove all loaded entries
  // from the list when clicking "load more".
  const hasErrors = !props.isLoading && errors?.length > 0;
  // We deliberately use props.isLoading, because we do not want to remove all loaded entries
  // from the list when clicking "load more".
  const hasItems = !props.isLoading && items.length > 0;

  const [containerHeight, setContainerHeight] = useState(0);
  useLayoutEffect(() => {
    const shouldScrollToBottom = scrollContainerRef.current && timeConfig.autoRefresh;
    if (shouldScrollToBottom) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      return;
    }

    // add the difference from the previous and the new container height to the scroll position.
    // this results in a stable view, when appending new data on non live mode
    const diffHeight = scrollContainerRef.current.scrollHeight - containerHeight;
    const shouldStickWithScrollPosition = diffHeight !== 0;
    if (shouldStickWithScrollPosition) {
      setContainerHeight(scrollContainerRef.current.scrollHeight);
      scrollContainerRef.current.scrollTop =
        containerHeight === 0
          ? scrollContainerRef.current.scrollHeight // on first data load, just scroll to bottom
          : scrollContainerRef.current.scrollTop + diffHeight;
    }
  });

  if (detailId) {
    return (
      <LogDetail
        {...props}
        {...cursorPaginationState}
        path={rawLogsPath}
        getId={item => item.log.id}
        itemName="Log"
        isLoading={isLoading}
        hasErrors={hasErrors}
        hasItems={hasItems}
        ListItemContent={SplitScreenListItemContent}
      />
    );
  }

  return (
    <QueryBuilderWorkspace {...props}>
      <div className={locals.wrapper} ref={scrollContainerRef} onScroll={e => onScroll(e, timeConfig)}>
        <Ul className={locals.list} framed={false} space="disabled">
          <LoadMoreButton
            loadMore={loadMore}
            canLoadMore={canLoadMore}
            isLoading={isLoading}
            numItems={hasItems ? items.length : 0}
          />
          {hasErrors && <ErrorListItems errors={result.errors} />}
          {hasItems && <>{getSortedItems(items, props)}</>}
        </Ul>
        {!isLoading && !hasItems && <NoDataAvailable height={240} />}
      </div>
    </QueryBuilderWorkspace>
  );
}

function ErrorListItems({ errors }) {
  errors = getUniqueErrors(errors);
  return (
    <>
      {errors.map(error => (
        <Li key={error} className={locals.errorListItem} size="compact">
          {error}
        </Li>
      ))}
    </>
  );
}

function Tag({ name, value, index }) {
  if ('log.level' === name) {
    return (
      <span
        className={classNames({
          [locals.logLevel]: true,
          [locals[value.toLowerCase()]]: true
        })}
      >
        {value}
      </span>
    );
  }

  return (
    <span
      className={classNames({
        [locals.tag]: true,
        [locals[`tag_${index % 2}`]]: true
      })}
    >
      {value}
    </span>
  );
}

function LoadMoreButton({ loadMore, isLoading, canLoadMore, numItems }) {
  const disabled = numItems >= MAX_ALLOWED_ITEMS_TO_RENDER || isLoading || !canLoadMore;
  let tooltip;
  if (isLoading) {
    tooltip = 'Is currently loading data';
  } else if (!canLoadMore) {
    tooltip = 'There is no more data to load';
  } else if (numItems >= MAX_ALLOWED_ITEMS_TO_RENDER) {
    tooltip = 'The limit of logs is reached';
  }

  let button = (
    <Button
      className={classNames({
        [locals.loadMoreButton]: true,
        [locals.disabledLoadMoreButton]: disabled
      })}
      kind="action"
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        loadMore();
      }}
      disabled={disabled}
    >
      Load more
    </Button>
  );

  if (tooltip) {
    button = (
      <Tooltip content={tooltip} align="bottomMiddle">
        {button}
      </Tooltip>
    );
  }

  return <Li className={locals.loadMoreListItem}>{button}</Li>;
}

function getSortedItems(items, props) {
  const itemsToRender = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    itemsToRender[items.length - (i + 1)] = (
      <Li key={item.log.id} className={locals.listItem} size="compact">
        <ColumnizedContent {...item} {...props} columnDefinitions={columnDefinitions} />
      </Li>
    );
  }
  return itemsToRender;
}

function onScroll(e, timeConfig) {
  const { scrollTop, clientHeight, scrollHeight } = e.target;
  // on live mode, the view always scrolls to the bottom. If the user scrolls away from the bottom,
  // live mode should be deactivated
  if (timeConfig.autoRefresh && scrollTop < scrollHeight - clientHeight) {
    mutateUrl(navParams => {
      delete navParams.query.fm;
      navParams.query[urlQueryKeys.autoRefresh] = 'false';
    });
  }
}

function getTableData({ timeConfig, orderBy, backendQueryModel, cursor }) {
  return getLogs({
    pagination: {
      cursor,
      retrievalSize: 50
    },
    order: orderBy,
    timeConfig,
    tagFilterExpression: backendQueryModel
  });
}
