/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  createApplicationIdTagFilter,
  createEndpointNameTagFilter,
  createServiceIdTagFilter
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import {
  DEFAULT_PAGE_SIZE,
  enrichListWithStaleSelectionData,
  createNoMatchingEntityText
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import {
  selectApplication,
  selectEndpoint,
  selectService
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import { stateManagementPropType } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import SharedList from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import { and, or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { propTypeTimeConfig } from 'in-stores/time/config';

export default function EndpointsList({ getEndpointsCursorPaginated, parentIds, ...props }) {
  const { boundaryScope } = props;
  const searchQuery = props.searchQuery?.trim();
  const applicationIdTagFilter = createApplicationIdTagFilter(parentIds.applicationId, props.boundaryScope);
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
          timeConfig: props.timeConfig
        },
        metrics: {},
        tagFilterExpression: toBackendQueryModel(
          searchQuery
            ? joinExpressions({
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
            : joinExpressions({
                logicalOperator: and,
                expressions: [applicationIdTagFilter, serviceIdTagFilter]
              })
        )
      }),
    [searchQuery, boundaryScope]
  );

  const { state } = props.stateManagement;

  const listData = useMemo(() => {
    const service = selectService(state, parentIds);
    const restructuredItems = items.map(({ endpoint, ...rest }) => ({ ...rest, item: endpoint }));
    return searchQuery
      ? restructuredItems
      : enrichListWithStaleSelectionData(Object.entries(service?.endpoints ?? {}), restructuredItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <SharedList
      {...props}
      {...tableProps}
      listData={listData}
      stateProcessors={{
        entityType: 'ENDPOINT',
        getTooltipSettings() {
          return { name: 'Endpoint', iconType: 'lib_application_endpoint' };
        },
        enhanceParentIdsWithChildId(id) {
          return { ...parentIds, endpointId: id };
        },
        hasChildren() {
          return false;
        },
        isChecked(itemTreeIds) {
          return Boolean(selectEndpoint(state, itemTreeIds)?.inclusive);
        },
        isExplicitlyExcluded(itemTreeIds) {
          return selectEndpoint(state, itemTreeIds)?.inclusive === false;
        },
        hasUserInteractedWithItem(itemTreeIds) {
          return Boolean(selectEndpoint(state, itemTreeIds));
        },
        isImplicitlyChecked(itemTreeIds) {
          const application = selectApplication(state, itemTreeIds);
          const service = selectService(state, itemTreeIds);
          const endpoint = selectEndpoint(state, itemTreeIds);

          const isApplicationDeselected = !application || application?.inclusive === false;
          if (isApplicationDeselected) {
            return false;
          }

          const isServiceDeselected = service && service?.inclusive === false;
          if (isServiceDeselected) {
            return false;
          }

          const isEndpointDeselected = endpoint && endpoint?.inclusive === false;
          if (isEndpointDeselected) {
            return false;
          }

          const inExplicitSelectionMode = state.inExplicitSelectionMode?.has(itemTreeIds.applicationId);
          if (inExplicitSelectionMode) {
            const parentServiceExplictlySelected = service?.inclusive === true;
            if (!parentServiceExplictlySelected) return false;
          }

          if (endpoint?.inclusive) {
            return false;
          }

          const serviceContainsExplictlySelectedEndpoints = Object.values(service?.endpoints ?? {}).some(
            ({ inclusive }) => inclusive === true
          );

          if (serviceContainsExplictlySelectedEndpoints) {
            return false;
          }

          return true;
        },
        getNoDataCustomText() {
          return searchQuery ? createNoMatchingEntityText('Endpoint') : undefined;
        },
        getLabel$: getEndpointInfo
      }}
      initiallyOpen={Boolean(searchQuery) && items.length > 0}
    />
  );
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
  searchQuery: PropTypes.string
};
