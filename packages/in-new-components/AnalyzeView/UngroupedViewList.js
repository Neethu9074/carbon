/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import QueryProgressIndicator from 'in-new-components/AnalyzeView/QueryProgressIndicator';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import UngroupedView from 'in-new-components/AnalyzeView/UngroupedView';
import { generateStableHash } from 'in-services/util/id';

export { detailViewProps, retrievalSize } from 'in-new-components/AnalyzeView/UngroupedView';

export default function UngroupedAnalyzeViewList(props) {
  return <UngroupedView {...props} Presenter={List} />;
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
    withEmbeddedLoadingIndicator = false
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
                renderNestedContent={renderNestedContent ? () => renderNestedContent(id) : undefined}
              >
                <ColumnizedContent columnDefinitions={columnDefinitions} {...item} {...props} />
              </Li>
            );
          })}
          {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
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
