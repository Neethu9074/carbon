/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import rpt from 'prop-types';

import { LiLoadMore, ColumnizedContent, Ul, Li } from '@instana/components';
import { generateStableHash } from '@instana/utils';

import QueryProgressIndicator from 'in-components/AnalyzeView/QueryProgressIndicator';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { retrievalSize } from 'in-components/AnalyzeView/UngroupedView';
import UngroupedView from 'in-components/AnalyzeView/UngroupedView';
import { ua2LoadMoreClicked } from 'in-components/tracker';

export { detailViewProps, retrievalSize } from 'in-components/AnalyzeView/UngroupedView';

export default function UngroupedAnalyzeViewList(props) {
  return <UngroupedView {...props} Presenter={props.Presenter ?? List} />;
}

UngroupedAnalyzeViewList.propTypes = {
  ...UngroupedView.propTypes,
  withoutListItemLinkToDetails: rpt.bool,
  classNames: rpt.shape({
    listItem: rpt.string
  }),
  renderNestedContent: rpt.func
};

const ListItem = props => {
  const {
    id,
    item,
    getHrefToDetailId,
    classNames,
    groupLabel,
    columnDefinitions,
    renderNestedContent,
    withoutListItemLinkToDetails,
    initiallyOpenedItemIds,
    groupKey,
    onToggleContentRow // (toogled: boolean, item: any) => void
  } = props;

  const [isToggled, setIsToggled] = useState(initiallyOpenedItemIds.includes(id));

  const extendedItem = { ...item, groupKey };
  return (
    <Li
      className={classNames?.listItem}
      size="compact"
      href={withoutListItemLinkToDetails ? undefined : getHrefToDetailId(id, groupLabel)}
      renderNestedContent={renderNestedContent ? () => renderNestedContent(id, extendedItem) : undefined}
      initiallyOpen={initiallyOpenedItemIds.includes(id)}
      tracking={{
        onToggleContentRow: toggled => {
          onToggleContentRow(toggled, extendedItem);
          setIsToggled(toggled);
        }
      }}
      toggleContentOnRowClick
    >
      <ColumnizedContent columnDefinitions={columnDefinitions} isToggled={isToggled} {...extendedItem} {...props} />
    </Li>
  );
};

function List(props) {
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
    onToggleContentRow // (toogled: boolean, item: any) => void
  } = props;

  const numSkeletonRows = items.length === 0 ? props.initialLines : retrievalSize;

  const itemProps = {
    getHrefToDetailId,
    getId,
    classNames,
    groupLabel,
    columnDefinitions,
    renderNestedContent,
    withoutListItemLinkToDetails,
    initiallyOpenedItemIds,
    groupKey,
    onToggleContentRow // (toogled: boolean, item: any) => void
  };

  return (
    <>
      {hasItems && (
        <Ul space="disabled">
          {items.map(item => {
            const id = getId(item);
            return <ListItem {...props} {...itemProps} item={item} key={generateStableHash(id)} id={id} />;
          })}
          {canLoadMore && (
            <LiLoadMore
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
