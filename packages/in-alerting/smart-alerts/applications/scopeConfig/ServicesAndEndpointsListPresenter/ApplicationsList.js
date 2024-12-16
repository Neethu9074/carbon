/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { useObservable } from '@instana/hooks';

import {
  createNoMatchingEntityText,
  DEFAULT_PAGE_SIZE,
  enrichListWithStaleSelectionData,
  sortListBySelectionState
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import {
  createEndpointNameTagFilter,
  createServiceNameTagFilter
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import { stateManagementPropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import { selectApplication } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import ServicesList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesList';
import SharedList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { hasError, isLoading } from 'in-services/util/result';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { pendingResult } from 'in-services/fixedObjects';
import { isNotBlank } from 'in-services/util/string';
import { noop } from 'in-services/util/function';

export default function ApplicationsList({ isGlobalSmartAlert, searchQuery, ...props }) {
  const trimmedSearchQuery = searchQuery?.trim();
  const { getApplication: getStaleEntity, readOnly, stateManagement } = props;
  const zeroAPsSelected = Object.keys(stateManagement.state).length === 0;
  const staticEmptyAPList = readOnly && zeroAPsSelected;

  return isGlobalSmartAlert ? (
    staticEmptyAPList ? (
      <ApplicationBaseList
        {...props}
        items={[]}
        loadMore={noop}
        getStaleEntity={getStaleEntity}
        shouldShowPlaceholderForEmptySelection
      />
    ) : (
      <ApplicationListMultipleApplications
        key={trimmedSearchQuery}
        {...props}
        searchQuery={trimmedSearchQuery}
        getStaleEntity={getStaleEntity}
      />
    )
  ) : (
    <ApplicationListSingleApplication {...props} searchQuery={trimmedSearchQuery} getStaleEntity={getStaleEntity} />
  );
}

function ApplicationListMultipleApplications({ getApplicationsCursorPaginated, ...props }) {
  const {
    includeSynthetic,
    includeInternal,
    timeConfig,
    searchQuery,
    searchType,
    retrievalSize = DEFAULT_PAGE_SIZE,
    boundaryScope
  } = props;

  const searchResult = useFilteredCursorPagination(
    getApplicationsCursorPaginated,
    item => item.metrics.callsAgg[0][1] > 0,
    retrievalSize,
    searchType,
    searchQuery,
    boundaryScope,
    includeSynthetic,
    includeInternal,
    timeConfig
  );

  return (
    <ApplicationBaseList
      {...props}
      {...searchResult}
      isLoading={isLoading(searchResult)}
      initiallyOpen={Boolean(searchQuery) && searchType !== 'APPLICATION'}
    />
  );
}

/**
 * Custom cursor pagination hook, which filters the results based on a filter function.
 * However, in order to fulfill {@link retrievalSize}, it uses an incremental loading mechanism with over-fetching.
 */
function useFilteredCursorPagination(
  getApplicationsCursorPaginated,
  itemFilter,
  retrievalSize,
  searchType,
  searchQuery,
  boundaryScope,
  includeSynthetic,
  includeInternal,
  timeConfig
) {
  const { items = [], ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      getApplicationsCursorPaginated({
        pagination: {
          cursor,
          retrievalSize: retrievalSize * 3 // over-fetching reduces the chance of having to repeat queries to complete the list when items are filtered
        },
        order: {
          by: 'applicationLabel',
          direction: 'ASC'
        },
        metrics: {
          callsAgg: {
            metric: 'calls',
            aggregation: 'SUM'
          }
        },
        filter: {
          label: searchType === 'APPLICATION' && isNotBlank(searchQuery) ? searchQuery : undefined,
          applicationBoundaryScope: boundaryScope,
          timeConfig,
          includeSyntheticCalls: includeSynthetic,
          includeInternalCalls: includeInternal
        },
        tagFilterExpression:
          searchType !== 'APPLICATION' && isNotBlank(searchQuery)
            ? buildTagFilterExpression(searchType, searchQuery)
            : undefined
      }),
    [searchType, searchQuery, includeSynthetic, includeInternal, timeConfig]
  );

  const { loadMore, canLoadMore } = tableProps;
  const [maxVisibleItems, setMaxVisibleItems] = useState(retrievalSize);

  // To really exclude calls that respect all filters, such as boundary scope,
  // we need to check whether there are no matching calls on the client side as a workaround.
  // More details: https://github.ibm.com/instana/ui-client/pull/18168#discussion_r9667739
  const filteredAppItemsAll = items.filter(itemFilter);
  const filteredAppItems = filteredAppItemsAll.slice(0, maxVisibleItems);

  const isLoaded = !isLoading(tableProps) && !hasError(tableProps);

  const incrementalLoadMore = useCallback(() => {
    if (!isLoaded) {
      return;
    }
    if (maxVisibleItems + retrievalSize + 1 > filteredAppItemsAll.length && canLoadMore) {
      loadMore();
    }
    setMaxVisibleItems(maxVisibleItems => maxVisibleItems + retrievalSize);
  }, [maxVisibleItems, retrievalSize, filteredAppItemsAll, canLoadMore, setMaxVisibleItems, loadMore, isLoaded]);

  const incrementalCanLoadMore = isLoaded && (canLoadMore || filteredAppItemsAll.length > filteredAppItems.length);

  useEffect(() => {
    const tooSmallAfterFiltering = isLoaded && canLoadMore && retrievalSize > filteredAppItems.length;
    if (tooSmallAfterFiltering) {
      loadMore();
    }
  }, [loadMore, canLoadMore, retrievalSize, filteredAppItems.length, tableProps, isLoaded]);

  return {
    ...tableProps,
    items: filteredAppItems,
    loadMore: incrementalLoadMore,
    canLoadMore: incrementalCanLoadMore
  };
}

function ApplicationListSingleApplication({ appIdForIndividualSmartAlert, getApplication, ...props }) {
  const applicationResult =
    useObservable(
      () =>
        getApplication({ id: appIdForIndividualSmartAlert }).map(result => {
          return { ...result, items: result?.data ? [{ application: result.data }] : [] };
        }),
      []
    ) ?? pendingResult;

  const initiallyOpen = Boolean(props.searchQuery) && props.searchType !== 'APPLICATION';

  return (
    <ApplicationBaseList
      {...props}
      key={initiallyOpen} // force rerender to show/render expanded list
      items={applicationResult.items}
      isLoading={isLoading(applicationResult)}
      loadMore={noop}
      initiallyOpen={initiallyOpen}
    />
  );
}

function ApplicationBaseList({ items = [], isLoading, getStaleEntity, initiallyOpen, validationError, ...props }) {
  const {
    stateManagement: { state },
    searchQuery,
    readOnly,
    showInteractedItemsOnly
  } = props;

  const listData = useMemo(() => {
    const restructuredItems = items.map(({ application, ...rest }) => ({ ...rest, item: application }));
    return searchQuery ? restructuredItems : enrichListWithStaleSelectionData(Object.entries(state), restructuredItems);
    // only ever recalculate if items array changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <SharedList
      {...props}
      isLoading={isLoading}
      listData={
        showInteractedItemsOnly
          ? sortListBySelectionState(listData, enhanceParentIdsWithChildId, hasUserInteractedWithItem(state))
          : listData
      }
      validationError={validationError}
      /* eslint-disable-next-line react/display-name */
      renderSubList={({ applicationId }) =>
        () => {
          return <ServicesList {...props} parentIds={{ applicationId }} />;
        }}
      stateProcessors={{
        entityType: 'APPLICATION',
        getTooltipSettings() {
          return { name: 'Application', iconType: 'lib_application' };
        },
        enhanceParentIdsWithChildId,
        isIndeterminate(itemTreeIds) {
          const application = selectApplication(state, itemTreeIds);
          return !isEmpty(application?.services) && application?.inclusive !== undefined;
        },
        isChecked(itemTreeIds) {
          return Boolean(selectApplication(state, itemTreeIds)?.inclusive);
        },
        isExplicitlyExcluded(itemTreeIds) {
          return selectApplication(state, itemTreeIds)?.inclusive === false;
        },
        hasUserInteractedWithItem(itemTreeIds) {
          return hasUserInteractedWithItem(state)(itemTreeIds);
        },
        isImplicitlyChecked() {
          return false;
        },
        getNoDataCustomText() {
          return searchQuery ? createNoMatchingEntityText('Application') : undefined;
        },
        shouldAdd(itemTreeIds) {
          return selectApplication(state, itemTreeIds)?.inclusive === undefined;
        },
        getBadgeElement() {
          return null;
        },
        getStaleEntity$: getStaleEntity
      }}
      initiallyOpen={initiallyOpen}
      viewOnly={readOnly}
      isFramed={false}
    />
  );
}

function enhanceParentIdsWithChildId(id) {
  return { applicationId: id };
}

function hasUserInteractedWithItem(state) {
  return itemTreeIds => Boolean(selectApplication(state, itemTreeIds));
}

function buildTagFilterExpression(searchType, searchQuery) {
  let tfe = [];

  // FIXME When boundary scope "Inbound call" option is used, we should actually only return APs where there is a matching
  //       service or endpoint for calls that are inbound. Currently, we also return APs, which in the nested ServicesList
  //       have no services listed.
  if (isNotBlank(searchQuery)) {
    if (searchType === 'SERVICE') {
      tfe = joinExpressions({
        logicalOperator: or,
        expressions: [createServiceNameTagFilter(searchQuery)]
      });
    }
    if (searchType === 'ENDPOINT') {
      tfe = joinExpressions({
        logicalOperator: or,
        expressions: [createEndpointNameTagFilter(searchQuery)]
      });
    }
  }

  return toBackendQueryModel(tfe);
}

ApplicationsList.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  getApplication: PropTypes.func.isRequired,
  getApplicationsCursorPaginated: PropTypes.func.isRequired,
  stateManagement: stateManagementPropType.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  searchQuery: PropTypes.string,
  boundaryScope: PropTypes.string.isRequired,
  showInteractedItemsOnly: PropTypes.bool,
  validationError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  editMode: PropTypes.bool,
  readOnly: PropTypes.bool,
  appIdForIndividualSmartAlert: PropTypes.string,
  includeSynthetic: PropTypes.bool.isRequired
};
