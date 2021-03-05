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
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import {
  createApplicationIdTagFilter,
  createEndpointNameTagFilter,
  createServiceNameTagFilter
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import {
  selectApplication,
  selectService
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import { stateManagementPropType } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import EndpointsList from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/EndpointsList';
import SharedList from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import { and, or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import getService from 'in-subscription/application/getService';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { isLoading } from 'in-services/util/result';

export default function ServicesList({ getServicesCursorPaginated, parentIds, ...props }) {
  const { boundaryScope } = props;
  const searchQuery = props.searchQuery?.trim();
  const applicationIdTagFilter = createApplicationIdTagFilter(parentIds.applicationId, props.boundaryScope);

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
          timeConfig: props.timeConfig
        },
        tagFilterExpression: toBackendQueryModel(
          searchQuery
            ? joinExpressions({
                logicalOperator: and,
                expressions: [
                  applicationIdTagFilter,
                  joinExpressions({
                    logicalOperator: or,
                    expressions: [createServiceNameTagFilter(searchQuery), createEndpointNameTagFilter(searchQuery)]
                  })
                ]
              })
            : [applicationIdTagFilter]
        )
      }),
    [searchQuery, boundaryScope]
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
      renderSubList={({ applicationId, serviceId }) => () => (
        <EndpointsList {...props} parentIds={{ applicationId, serviceId }} />
      )}
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
        getBadgeElement({ types }) {
          return <EndpointTypeBadgeList types={types} />;
        },
        getStaleEntity$: getService
      }}
      initiallyOpen={Boolean(searchQuery) && items.length > 0}
    />
  );
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
  showInteractedItemsOnly: PropTypes.bool,
  editMode: PropTypes.bool
};
