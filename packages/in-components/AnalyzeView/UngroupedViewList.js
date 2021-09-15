/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import { LiLoadMore, ColumnizedContent, Ul, Li } from '@instana/components';
import { generateStableHash } from '@instana/utils';

import QueryProgressIndicator from 'in-components/AnalyzeView/QueryProgressIndicator';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import UngroupedView from 'in-components/AnalyzeView/UngroupedView';

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

function List(props) {
  const {
    getHrefToDetailId,
    result,
    hasItems,
    items,
    getId,
    classNames,
    isLoading,
    groupLabel,
    canLoadMore,
    columnDefinitions,
    renderNestedContent,
    loadMore,
    withoutListItemLinkToDetails,
    progress,
    withEmbeddedLoadingIndicator = false,
    tracker
  } = props;
  return (
    <>
      {hasItems && (
        <Ul space="disabled">
          {items.map(item => {
            const id = getId(item);
            return (
              <Li
                key={generateStableHash(id)}
                className={classNames?.listItem}
                size="compact"
                href={withoutListItemLinkToDetails ? undefined : getHrefToDetailId(id, groupLabel)}
                renderNestedContent={renderNestedContent ? () => renderNestedContent(id, item) : undefined}
              >
                <ColumnizedContent columnDefinitions={columnDefinitions} {...item} {...props} />
              </Li>
            );
          })}
          {canLoadMore && (
            <LiLoadMore
              loadMore={() => {
                loadMore();
                tracker?.loadMoreClicked();
              }}
            />
          )}
        </Ul>
      )}
      {withEmbeddedLoadingIndicator && isLoading ? (
        <LoadingList numSkeletonRows={3} />
      ) : (
        <QueryProgressIndicator progress={{ ...progress, loading: isLoading }} errors={result?.errors} items={items} />
      )}
    </>
  );
}
