/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import React from 'react';

import { addGroupingCriteriaToTagFilterExpression } from 'in-new-components/AnalyzeView/StateManagement';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Header from 'in-new-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { emptyObject } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function GroupedAnalyzeView(props) {
  const {
    getData,
    groupBy,
    orderBy,
    onOrderByChange,
    backendQueryModel,
    tagFilterExpression,
    getHrefToUngroupedView,
    columnDefinitions,
    UngroupedView,
    getLabel
  } = props;

  const timeConfig = useTimeConfig();
  const {
    items,
    errors,
    progress,
    canLoadMore,
    result,
    loadMore,
    totalHits,
    totalRepresentedItemCount
  } = useCursorPagination(({ cursor }) => getData({ timeConfig, orderBy, backendQueryModel, groupBy, cursor }), [
    timeConfig,
    groupBy,
    backendQueryModel,
    orderBy
  ]);

  const isLoading = props.isLoading || progress?.loading || props.isLoading;
  const hasErrors = !isLoading && errors?.length > 0;
  const hasItems = !isLoading && items.length > 0;

  return (
    <>
      <Header
        {...props}
        hitName="Group"
        totalHits={totalHits}
        totalRepresentedItemCount={totalRepresentedItemCount}
        order={orderBy}
        setOrder={onOrderByChange}
      />
      {hasErrors && <ErrorList errors={result.errors} />}
      {hasItems && (
        <Ul space="xsmall">
          {items.map(item => {
            const label = getLabel(item);
            return (
              <Li
                key={label}
                toggleContentOnRowClick
                renderNestedContent={() => {
                  const tagFilterExpressionForUnGroupedView = addGroupingCriteriaToTagFilterExpression(
                    groupBy,
                    label,
                    tagFilterExpression
                  );
                  return (
                    // tagFilterExpression / backendQueryModel must be separately memoized based on hash
                    // within the ungrouped view.
                    <UngroupedView
                      {...props}
                      withoutHeader
                      groupLabel={label}
                      groupBy={emptyObject}
                      backendQueryModel={toBackendQueryModel(tagFilterExpressionForUnGroupedView)}
                      tagFilterExpression={tagFilterExpressionForUnGroupedView}
                    />
                  );
                }}
              >
                <ColumnizedContent
                  columnDefinitions={columnDefinitions}
                  href={getHrefToUngroupedView(label)}
                  {...item}
                  {...props}
                />
              </Li>
            );
          })}
          {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
        </Ul>
      )}
      {isLoading && <LoadingList numSkeletonRows={3} />}
      {!isLoading && !hasItems && <NoDataAvailable height={240} />}
    </>
  );
}

GroupedAnalyzeView.propTypes = {
  ...childrenArgsAsPropTypes,

  getData: rpt.func.isRequired,
  getLabel: rpt.func.isRequired,
  itemName: rpt.string.isRequired,
  CustomHeaderActions: rpt.elementType,
  columnDefinitions: rpt.array.isRequired,
  UngroupedView: rpt.elementType.isRequired
};
