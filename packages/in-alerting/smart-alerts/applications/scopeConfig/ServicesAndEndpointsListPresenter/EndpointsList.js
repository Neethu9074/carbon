/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  createNoMatchingEntityText,
  DEFAULT_PAGE_SIZE,
  enrichListWithStaleSelectionData,
  sortListBySelectionState
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import {
  createApplicationIdTagFilter,
  createEndpointNameTagFilter,
  createServiceIdTagFilter
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import {
  selectApplication,
  selectEndpoint,
  selectService
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import { stateManagementPropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import SharedList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import getEndpoint from 'in-applications/subscriptions/getEndpoint';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { isLoading } from 'in-services/util/result';
import { isBlank } from 'in-services/util/string';

export default function EndpointsList({ getEndpointsCursorPaginated, parentIds, ...props }) {
  const { boundaryScope, timeConfig, includeSynthetic, includeInternal, readOnly, searchType } = props;
  const searchQuery = props.searchQuery?.trim();

  const { items, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      getEndpointsCursorPaginated({
        pagination: {
          cursor,
          retrievalSize: DEFAULT_PAGE_SIZE
        },
        order: {
          by: 'endpointLabel',
          direction: 'ASC'
        },
        filter: {
          timeConfig,
          includeSyntheticCalls: includeSynthetic,
          includeInternalCalls: includeInternal
        },
        metrics: {},
        tagFilterExpression: toTagFilterExpression(
          searchType,
          searchQuery,
          parentIds.applicationId,
          boundaryScope,
          parentIds.serviceId
        )
      }),
    [searchType, searchQuery, boundaryScope, includeSynthetic, includeInternal, timeConfig]
  );

  const { state } = props.stateManagement;

  const listData = useMemo(() => {
    const service = selectService(state, parentIds);
    const restructuredItems = items.map(({ endpoint, ...rest }) => ({ ...rest, item: endpoint }));
    return searchQuery
      ? restructuredItems
      : enrichListWithStaleSelectionData(Object.entries(service?.endpoints ?? {}), restructuredItems);
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
      stateProcessors={{
        entityType: 'ENDPOINT',
        getTooltipSettings() {
          return { name: 'Endpoint', iconType: 'lib_application_endpoint' };
        },
        enhanceParentIdsWithChildId(id) {
          return enhanceParentIdsWithChildId(parentIds)(id);
        },
        isIndeterminate() {
          return false;
        },
        isChecked(itemTreeIds) {
          return Boolean(selectEndpoint(state, itemTreeIds)?.inclusive);
        },
        isExplicitlyExcluded(itemTreeIds) {
          return selectEndpoint(state, itemTreeIds)?.inclusive === false;
        },
        hasUserInteractedWithItem(itemTreeIds) {
          return hasUserInteractedWithItem(state)(itemTreeIds);
        },
        isImplicitlyChecked(itemTreeIds) {
          const application = selectApplication(state, itemTreeIds);
          const service = selectService(state, itemTreeIds);
          const endpoint = selectEndpoint(state, itemTreeIds);

          if (application?.inclusive === true) {
            if (service?.inclusive === undefined || service?.inclusive === true) {
              return endpoint?.inclusive === undefined;
            }
          }

          if (application?.inclusive === false) {
            if (service?.inclusive === true) {
              return endpoint?.inclusive === undefined;
            }
          }

          return false;
        },
        getNoDataCustomText() {
          return searchQuery ? createNoMatchingEntityText('Endpoint') : undefined;
        },
        shouldAdd(itemTreeIds) {
          return selectEndpoint(state, itemTreeIds)?.inclusive === undefined;
        },
        getBadgeElement({ type }) {
          if (!type) {
            return null;
          }

          return <EndpointTypeBadgeList types={[type]} />;
        },
        getStaleEntity$: getEndpoint
      }}
      initiallyOpen={Boolean(searchQuery) && items.length > 0}
      viewOnly={readOnly}
    />
  );
}

function toTagFilterExpression(searchType, searchQuery, applicationId, boundaryScope, serviceId) {
  const applicationIdTagFilter = createApplicationIdTagFilter(applicationId, boundaryScope);
  const serviceIdTagFilter = createServiceIdTagFilter(serviceId);

  if (searchType !== 'ENDPOINT' || isBlank(searchQuery)) {
    return toBackendQueryModel(
      joinExpressions({
        logicalOperator: and,
        expressions: [applicationIdTagFilter, serviceIdTagFilter]
      })
    );
  }

  return toBackendQueryModel(
    joinExpressions({
      logicalOperator: and,
      expressions: [applicationIdTagFilter, serviceIdTagFilter, createEndpointNameTagFilter(searchQuery)]
    })
  );
}

function enhanceParentIdsWithChildId(parentIds) {
  return id => ({ ...parentIds, endpointId: id });
}

function hasUserInteractedWithItem(state) {
  return itemTreeIds => Boolean(selectEndpoint(state, itemTreeIds));
}

EndpointsList.propTypes = {
  getEndpointsCursorPaginated: PropTypes.func.isRequired,
  parentIds: PropTypes.shape({
    applicationId: PropTypes.string.isRequired,
    serviceId: PropTypes.string.isRequired
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
