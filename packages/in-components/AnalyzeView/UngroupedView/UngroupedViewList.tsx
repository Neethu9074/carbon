/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { LiLoadMore, Ul } from '@instana/components';
import { generateStableHash } from '@instana/utils';

//@ts-expect-error needs ts migration
import UngroupedView, { retrievalSize } from 'in-components/AnalyzeView/UngroupedView/UngroupedView';
//@ts-expect-error needs ts migration
import QueryProgressIndicator from 'in-components/AnalyzeView/QueryProgressIndicator';
import { ListProps, UngroupedViewProps } from 'in-components/AnalyzeView/UngroupedView/types';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { ListItem } from 'in-components/AnalyzeView/UngroupedView/ListItem';
import { ua2LoadMoreClicked } from 'in-components/tracker';

export default function UngroupedAnalyzeViewList(props: UngroupedViewProps) {
  return <UngroupedView {...props} Presenter={props.Presenter ?? List} />;
}

function List(props: ListProps) {
  const {
    getHrefToDetailId,
    result,
    hasItems,
    items,
    getId,
    classNames,
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
    time
  } = props;

  const itemProps = {
    className: classNames.listItem,
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

  const numSkeletonRows = items.length === 0 ? props.initialLines : retrievalSize;

  const MappedListItems = items.map(item => {
    const id = getId(item);
    const key = generateStableHash(id);
    const isInitiallyToggled = initiallyOpenedItemIds.includes(id);
    const extendedItem = { ...item, groupKey };
    const href = withoutListItemLinkToDetails ? undefined : getHrefToDetailId(id, groupLabel);

    return (
      <ListItem
        {...itemProps}
        href={href}
        renderNestedContent={() => renderNestedContent?.(id, extendedItem)}
        isInitiallyToggled={isInitiallyToggled}
        item={extendedItem}
        key={key}
      />
    );
  });

  return (
    <>
      {hasItems && (
        <Ul space="disabled">
          {MappedListItems}
          {canLoadMore && (
            <LiLoadMore
              //@ts-expect-error bad typing in foundation component
              loadMore={() => {
                loadMore();
                ua2LoadMoreClicked({ dataSource });
              }}
            />
          )}
        </Ul>
      )}
      {withEmbeddedLoadingIndicator && isLoading ? (
        <LoadingList numSkeletonRows={numSkeletonRows} />
      ) : (
        <QueryProgressIndicator progress={{ ...progress, loading: isLoading }} errors={result?.errors} items={items} />
      )}
    </>
  );
}
