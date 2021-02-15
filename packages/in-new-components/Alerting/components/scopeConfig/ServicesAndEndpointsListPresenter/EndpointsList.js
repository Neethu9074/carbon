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
import { isLoading } from 'in-services/util/result';

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
      isLoading={isLoading(tableProps)}
      listData={listData}
      stateProcessors={{
        entityType: 'ENDPOINT',
        getTooltipSettings() {
          return { name: 'Endpoint', iconType: 'lib_application_endpoint' };
        },
        enhanceParentIdsWithChildId(id) {
          return { ...parentIds, endpointId: id };
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
          return Boolean(selectEndpoint(state, itemTreeIds));
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
        numSkeletonRows: 1,
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
