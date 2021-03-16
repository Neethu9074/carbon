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
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import {
  createApplicationIdTagFilter,
  createEndpointNameTagFilter,
  createServiceIdTagFilter
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import {
  selectApplication,
  selectEndpoint,
  selectService
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import { stateManagementPropType } from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import SharedList from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import { and, or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import getEndpoint from 'in-subscription/application/getEndpoint';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { isNotBlank } from 'in-services/util/string';
import { isLoading } from 'in-services/util/result';

export default function EndpointsList({ getEndpointsCursorPaginated, parentIds, ...props }) {
  const { boundaryScope, timeConfig, includeSynthetic } = props;
  const searchQuery = props.searchQuery?.trim();
  const applicationIdTagFilter = createApplicationIdTagFilter(parentIds.applicationId, boundaryScope);
  const serviceIdTagFilter = createServiceIdTagFilter(parentIds.serviceId);

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
          applicationBoundaryScope: boundaryScope,
          application: parentIds.applicationId,
          service: parentIds.serviceId,
          // FIXME at the moment, we don't support includeSyntheticCalls filter when a searchQuery is used
          includeSyntheticCalls: includeSynthetic
        },
        metrics: {},
        tagFilterExpression: isNotBlank(searchQuery)
          ? toBackendQueryModel(
              joinExpressions({
                logicalOperator: and,
                expressions: [
                  applicationIdTagFilter,
                  serviceIdTagFilter,
                  joinExpressions({
                    logicalOperator: or,
                    expressions: [createEndpointNameTagFilter(searchQuery)]
                  })
                ]
              })
            )
          : undefined
      }),
    [searchQuery, boundaryScope, includeSynthetic]
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
          return <EndpointTypeBadgeList types={[type]} />;
        },
        getStaleEntity$: getEndpoint
      }}
      initiallyOpen={Boolean(searchQuery) && items.length > 0}
    />
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
  showInteractedItemsOnly: PropTypes.bool,
  editMode: PropTypes.bool,
  includeSynthetic: PropTypes.bool.isRequired
};
