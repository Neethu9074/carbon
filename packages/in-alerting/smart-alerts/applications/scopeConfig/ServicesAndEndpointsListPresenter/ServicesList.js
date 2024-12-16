/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  createNoMatchingEntityText,
  DEFAULT_PAGE_SIZE,
  enrichListWithStaleSelectionData,
  sortListBySelectionState
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import {
  createApplicationIdTagFilter,
  createServiceNameTagFilter,
  createEndpointNameTagFilter
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import {
  selectApplication,
  selectService
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import { stateManagementPropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import EndpointsList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/EndpointsList';
import SharedList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getService from 'in-applications/subscriptions/getService';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { isLoading } from 'in-services/util/result';
import { isBlank } from 'in-services/util/string';

export default function ServicesList({ getServicesCursorPaginated, parentIds, ...props }) {
  const { boundaryScope, timeConfig, includeSynthetic, includeInternal, readOnly, searchType } = props;
  const searchQuery = props.searchQuery?.trim();

  const { items, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      getServicesCursorPaginated({
        pagination: {
          cursor,
          retrievalSize: DEFAULT_PAGE_SIZE
        },
        order: {
          by: 'serviceLabel',
          direction: 'ASC'
        },
        metrics: {},
        filter: {
          timeConfig,
          includeSyntheticCalls: includeSynthetic,
          includeInternalCalls: includeInternal
        },
        tagFilterExpression: toTagFilterExpression(searchType, searchQuery, parentIds.applicationId, boundaryScope)
      }),
    [searchType, searchQuery, boundaryScope, includeSynthetic, includeInternal, timeConfig]
  );

  const { state } = props.stateManagement;

  const listData = useMemo(() => {
    if (items.length === 0) return [];
    const restructuredItems = items.map(({ service, ...rest }) => ({ ...rest, item: service }));
    const application = selectApplication(state, parentIds);
    return searchQuery
      ? restructuredItems
      : enrichListWithStaleSelectionData(Object.entries(application?.services ?? {}), restructuredItems);
    // only ever recalculate if items array changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
  return (
    <SharedList
      {...props}
      {...tableProps}
      isLoading={isLoading(tableProps)}
      listData={
        props.showInteractedItemsOnly
          ? sortListBySelectionState(listData, enhanceParentIdsWithChildId(parentIds), hasUserInteractedWithItem(state))
          : listData
      }
      /* eslint-disable-next-line react/display-name */
      renderSubList={({ applicationId, serviceId }) =>
        () =>
          <EndpointsList {...props} parentIds={{ applicationId, serviceId }} />}
      stateProcessors={{
        entityType: 'SERVICE',
        getTooltipSettings() {
          return { name: 'Service', iconType: 'lib_application_service' };
        },
        enhanceParentIdsWithChildId(id) {
          return enhanceParentIdsWithChildId(parentIds)(id);
        },
        isIndeterminate(itemTreeIds) {
          const service = selectService(state, itemTreeIds);
          return !isEmpty(service?.endpoints) && service?.inclusive !== undefined;
        },
        isChecked(itemTreeIds) {
          return Boolean(selectService(state, itemTreeIds)?.inclusive);
        },
        isExplicitlyExcluded(itemTreeIds) {
          return selectService(state, itemTreeIds)?.inclusive === false;
        },
        hasUserInteractedWithItem(itemTreeIds) {
          return Boolean(selectService(state, itemTreeIds));
        },
        isImplicitlyChecked(itemTreeIds) {
          const application = selectApplication(state, itemTreeIds);
          const service = selectService(state, itemTreeIds);
          return application?.inclusive === true && service?.inclusive === undefined;
        },
        getNoDataCustomText() {
          return searchQuery ? createNoMatchingEntityText('Service') : undefined;
        },
        shouldAdd(itemTreeIds) {
          return selectService(state, itemTreeIds)?.inclusive === undefined;
        },
        getBadgeElement({ types = [] }) {
          return <EndpointTypeBadgeList types={types} />;
        },
        getStaleEntity$: getService
      }}
      initiallyOpen={Boolean(searchQuery) && searchType === 'ENDPOINT'}
      viewOnly={readOnly}
    />
  );
}

function toTagFilterExpression(searchType, searchQuery, applicationId, boundaryScope) {
  const applicationIdTagFilter = createApplicationIdTagFilter(applicationId, boundaryScope);

  if (searchType === 'APPLICATION' || isBlank(searchQuery)) {
    return toBackendQueryModel(
      joinExpressions({
        logicalOperator: and,
        expressions: [applicationIdTagFilter]
      })
    );
  } else if (searchType === 'SERVICE') {
    return toBackendQueryModel(
      joinExpressions({
        logicalOperator: and,
        expressions: [applicationIdTagFilter, createServiceNameTagFilter(searchQuery)]
      })
    );
  } else if (searchType === 'ENDPOINT') {
    return toBackendQueryModel(
      joinExpressions({
        logicalOperator: and,
        expressions: [applicationIdTagFilter, createEndpointNameTagFilter(searchQuery)]
      })
    );
  }

  return null;
}

function enhanceParentIdsWithChildId(parentIds) {
  return id => ({ ...parentIds, serviceId: id });
}

function hasUserInteractedWithItem(state) {
  return itemTreeIds => Boolean(selectService(state, itemTreeIds));
}

ServicesList.propTypes = {
  getServicesCursorPaginated: PropTypes.func.isRequired,
  parentIds: PropTypes.shape({
    applicationId: PropTypes.string.isRequired
  }).isRequired,
  boundaryScope: PropTypes.string.isRequired,
  stateManagement: stateManagementPropType.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  searchQuery: PropTypes.string,
  searchType: PropTypes.string,
  showInteractedItemsOnly: PropTypes.bool,
  editMode: PropTypes.bool,
  readOnly: PropTypes.bool,
  includeSynthetic: PropTypes.bool.isRequired,
  includeInternal: PropTypes.bool.isRequired
};
