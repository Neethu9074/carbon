/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { MutableRefObject, useCallback, useEffect } from 'react';
import _classNames from 'classnames';

import { LiLoadMore, Ul } from '@instana/components';
import { generateStableHash } from '@instana/utils';

import {
  Presenter,
  UngroupedViewListPresenterProps,
  UngroupedViewListProps
} from 'in-components/AnalyzeView/UngroupedView/types';
//@ts-expect-error needs ts migration
import QueryProgressIndicator from 'in-components/AnalyzeView/QueryProgressIndicator';
import UngroupedView, { retrievalSize } from 'in-components/AnalyzeView/UngroupedView/UngroupedView';
import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { ListItem } from 'in-components/AnalyzeView/UngroupedView/ListItem';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import useInfiniteScroll from 'in-hooks/useInfiniteScroll';

import locals from './UngroupedView.mless';

export default function UngroupedViewList<Item>(props: UngroupedViewListProps<Item>) {
  return <UngroupedView {...props} Presenter={List as Presenter} />;
}

function List(props: UngroupedViewListPresenterProps) {
  const {
    getHrefToDetailId,
    errors,
    hasItems,
    items,
    getId,
    classNames,
    wrapperClassNames,
    isLoading,
    dataSource,
    groupLabel,
    canLoadMore,
    columnDefinitions,
    renderNestedContent,
    loadMore,
    withoutListItemLinkToDetails,
    progress,
    withEmbeddedLoadingIndicator = false,
    initiallyOpenedItemIds,
    groupKey,
    onToggleContentRow,
    selectedId,
    initialLogLines,
    time,
    infiniteScroll,
    initialLines
  } = props;

  const itemProps = {
    className: classNames?.listItem,
    columnDefinitions,
    renderNestedContent,
    withoutListItemLinkToDetails,
    initiallyOpenedItemIds,
    groupKey,
    onToggleContentRow,
    selectedId,
    initialLogLines,
    time
  };
  const { trackUa2LoadMore } = useAnalyzeTracker();
  const infiniteScrollCallback = useCallback(
    ([element]: IntersectionObserverEntry[]) => {
      if (element.isIntersecting && !isLoading && canLoadMore) {
        loadMore?.();
        trackUa2LoadMore({ dataSource });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canLoadMore, isLoading, loadMore]
  );

  const [loadMoreContainerRef] = useInfiniteScroll(infiniteScrollCallback, [infiniteScrollCallback]);

  //Everytime you change filters, we have to make sure to erase the message from the previous filter.
  //That's why props.backendQueryModel is a dependency here.
  useEffect(() => {
    removeMessage('loadingComplete');
  }, [props.backendQueryModel]);

  useEffect(() => {
    if (!canLoadMore && !isLoading && items.length > 0 && typeof infiniteScroll === 'object')
      addMessage(
        {
          type: 'info',
          icon: 'lib_help_error_info_circle',
          content: <span className={locals.logsLoadedToast}>{infiniteScroll.loadingCompleteMessage}</span>,
          timeout: 0
        },
        'loadingComplete'
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canLoadMore, isLoading]);

  const MappedListItems = items.map(item => {
    const id = getId(item);
    const key = generateStableHash(id);
    const isInitiallyToggled = initiallyOpenedItemIds?.includes(id);
    let extendedItem = item;
    if (typeof item === 'object') {
      extendedItem = { ...item, groupKey };
    }
    const href = withoutListItemLinkToDetails ? undefined : getHrefToDetailId(id, groupLabel);

    return (
      <ListItem
        {...itemProps}
        href={href}
        renderNestedContent={renderNestedContent && (() => renderNestedContent(id, extendedItem))}
        isInitiallyToggled={isInitiallyToggled}
        item={extendedItem}
        key={key}
      />
    );
  });

  const showLoadMoreButton = canLoadMore && !infiniteScroll;
  const showSkeleton = withEmbeddedLoadingIndicator && (progress.loading || isLoading);
  const numSkeletonRows = items.length === 0 ? initialLines : retrievalSize;

  return (
    <>
      {hasItems && (
        <Ul className={_classNames(locals.displayBlock, wrapperClassNames)} space="disabled">
          {MappedListItems}
          {showLoadMoreButton && (
            <LiLoadMore
              //@ts-expect-error bad typing in foundation component
              loadMore={() => {
                loadMore?.();
                trackUa2LoadMore({ dataSource });
              }}
            />
          )}
        </Ul>
      )}
      {showSkeleton ? (
        <LoadingList numSkeletonRows={numSkeletonRows} />
      ) : (
        <QueryProgressIndicator progress={{ ...progress, loading: isLoading }} errors={errors} items={items} />
      )}
      {infiniteScroll && (
        <div
          ref={loadMoreContainerRef as MutableRefObject<HTMLDivElement>}
          className={locals.infiniteScrollContainer}
        />
      )}
    </>
  );
}
