import rpt from 'prop-types';
import React from 'react';

import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import SortingConfigurator from 'in-new-components/SortingConfigurator/SortingConfigurator';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Header from 'in-new-components/QueryBuilder/components/Header';
import useStableObjectIntance from 'in-hooks/useStableObjectIntance';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { generateStableHash } from 'in-services/util/id';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function UngroupedAnalyzeView(props) {
  const backendQueryModel = useStableObjectIntance(props.backendQueryModel);

  const {
    getData,
    orderBy,
    onOrderByChange,
    getHrefToDetailId,
    columnDefinitions,
    classNames,
    withoutListItemLinkToDetails,
    getId,
    withoutHeader,
    groupLabel,
    detailId,
    SplitScreenListItemContent,
    DetailView
  } = props;

  const timeConfig = useTimeConfig();
  const cursorPaginationState = useCursorPagination(
    ({ cursor }) => getData({ timeConfig, orderBy, backendQueryModel, cursor }),
    [timeConfig, backendQueryModel, orderBy]
  );
  const { items, errors, progress, canLoadMore, result, loadMore, totalHits } = cursorPaginationState;

  const isLoading = props.isLoading || progress?.loading;
  // We deliberately use props.isLoading, because we do not want to remove all loaded entries
  // from the list when clicking "load more".
  const hasErrors = !props.isLoading && errors?.length > 0;
  // We deliberately use props.isLoading, because we do not want to remove all loaded entries
  // from the list when clicking "load more".
  const hasItems = !props.isLoading && items.length > 0;

  if (detailId) {
    return (
      <DetailView
        {...props}
        {...cursorPaginationState}
        isLoading={isLoading}
        hasErrors={hasErrors}
        hasItems={hasItems}
        ListItemContent={SplitScreenListItemContent}
      />
    );
  }

  return (
    <>
      {!withoutHeader && (
        <Header
          {...props}
          order={orderBy}
          topText="no grouping"
          totalRepresentedItemCount={totalHits ?? 0}
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
                key={generateStableHash(id)}
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
  getDetailData: rpt.func.isRequired,
  getId: rpt.func.isRequired,
  columnDefinitions: rpt.array.isRequired,
  withoutListItemLinkToDetails: rpt.bool,
  classNames: rpt.shape({
    listItem: rpt.string
  }),
  DetailView: rpt.elementType.isRequired,
  CustomHeaderActions: rpt.elementType,

  // Will be auto-provided by GroupedView in the relevant scenarios.
  groupLabel: rpt.string
};

export const detailViewProps = {
  ...childrenArgsAsPropTypes,
  getId: rpt.func.isRequired,
  itemName: rpt.string.isRequired,

  isLoading: rpt.bool,
  hasErrors: rpt.bool,
  hasItems: rpt.bool,

  items: rpt.array,
  errors: rpt.array,
  progress: rpt.object,
  canLoadMore: rpt.bool,
  loadMore: rpt.func,
  totalHits: rpt.number
};
