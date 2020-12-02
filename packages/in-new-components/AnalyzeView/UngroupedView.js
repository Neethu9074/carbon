import rpt from 'prop-types';
import React from 'react';

import {
  childrenArgsAsPropTypes,
  useSameObjectInstanceWhenDeepEquals
} from 'in-new-components/AnalyzeView/StateManagement';
import SortingConfigurator from 'in-new-components/SortingConfigurator/SortingConfigurator';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Header from 'in-new-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function UngroupedAnalyzeView(props) {
  const backendQueryModel = useSameObjectInstanceWhenDeepEquals(props.backendQueryModel);

  const {
    getData,
    orderBy,
    onOrderByChange,
    getHrefToDetailId,
    columnDefinitions,
    classNames,
    withoutListItemLinkToDetails,
    getId,
    itemName,
    withoutHeader,
    groupLabel,
    sortOptions
  } = props;

  const timeConfig = useTimeConfig();
  const { items, errors, progress, canLoadMore, result, loadMore, totalHits } = useCursorPagination(
    ({ cursor }) => getData({ timeConfig, orderBy, backendQueryModel, cursor }),
    [timeConfig, backendQueryModel, orderBy]
  );

  const isLoading = props.isLoading || progress?.loading || props.isLoading;
  const hasErrors = !isLoading && errors?.length > 0;
  const hasItems = !isLoading && items.length > 0;

  return (
    <>
      {!withoutHeader && (
        <Header
          sortOptions={sortOptions}
          topText="no grouping"
          itemName={itemName}
          totalRepresentedItemCount={totalHits ?? 0}
          order={orderBy}
          setOrder={onOrderByChange}
        />
      )}

      {hasErrors && <ErrorList errors={result.errors} />}
      {hasItems && (
        <Ul space="disabled">
          {items.map(item => {
            const id = getId(item);
            return (
              <Li
                key={id}
                className={classNames?.listItem}
                size="compact"
                href={withoutListItemLinkToDetails ? undefined : getHrefToDetailId(id, groupLabel)}
              >
                <ColumnizedContent columnDefinitions={columnDefinitions} {...item} {...props} />
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

UngroupedAnalyzeView.propTypes = {
  ...childrenArgsAsPropTypes,

  itemName: rpt.string.isRequired,
  withoutHeader: rpt.bool,
  sortOptions: SortingConfigurator.propTypes.options,
  getData: rpt.func.isRequired,
  getId: rpt.func.isRequired,
  columnDefinitions: rpt.array.isRequired,
  withoutListItemLinkToDetails: rpt.bool,
  classNames: rpt.shape({
    listItem: rpt.string
  }),

  // Will be auto-provided by GroupedView in the relevant scenarios.
  groupLabel: rpt.string
};
