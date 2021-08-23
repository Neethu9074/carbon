/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  createApplicationNameTagFilter,
  createServiceNameTagFilter,
  createEndpointNameTagFilter,
  createApplicationIdTagFilter
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/tagFilterCreators';
import {
  DEFAULT_PAGE_SIZE,
  enrichListWithStaleSelectionData,
  createNoMatchingEntityText,
  sortListBySelectionState
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import { stateManagementPropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import { selectApplication } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import ServicesList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesList';
import SharedList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import { or, and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { isNotBlank } from 'in-services/util/string';
import { isLoading } from 'in-services/util/result';

export default function ApplicationsList({
  getApplicationsCursorPaginated,
  getApplication,
  isGlobalSmartAlert,
  appIdForIndividualSmartAlert,
  ...props
}) {
  const { timeConfig, includeSynthetic, stateManagement, boundaryScope, readOnly } = props;
  const searchQuery = props.searchQuery?.trim();
  const { state } = stateManagement;
  const { items, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      isGlobalSmartAlert
        ? getApplicationsCursorPaginated({
            pagination: {
              cursor,
              retrievalSize: DEFAULT_PAGE_SIZE
            },
            order: {
              by: 'applicationLabel',
              direction: 'ASC'
            },
            metrics: {},
            filter: {
              timeConfig,
              includeSyntheticCalls: includeSynthetic
            },
            tagFilterExpression: buildTagFilterExpression(searchQuery, readOnly, state, boundaryScope)
          })
        : getApplication({ id: appIdForIndividualSmartAlert }).map(result => {
            return { ...result, data: { items: result?.data ? [{ application: result.data }] : [] } };
          }),
    [searchQuery, isGlobalSmartAlert, includeSynthetic, state, timeConfig]
  );

  const listData = useMemo(() => {
    if (items.length === 0) return [];
    const restructuredItems = items.map(({ application, ...rest }) => ({ ...rest, item: application }));
    return searchQuery ? restructuredItems : enrichListWithStaleSelectionData(Object.entries(state), restructuredItems);
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
          ? sortListBySelectionState(listData, enhanceParentIdsWithChildId, hasUserInteractedWithItem(state))
          : listData
      }
      /* eslint-disable-next-line react/display-name */
      renderSubList={({ applicationId }) => () => {
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
        getStaleEntity$: getApplication
      }}
      initiallyOpen={Boolean(searchQuery) && items.length > 0}
      isFramed={false}
      viewOnly={readOnly}
    />
  );
}

function enhanceParentIdsWithChildId(id) {
  return { applicationId: id };
}

function hasUserInteractedWithItem(state) {
  return itemTreeIds => Boolean(selectApplication(state, itemTreeIds));
}

function buildTagFilterExpression(searchQuery, readOnly, state, boundaryScope) {
  let tfe = [];

  if (isNotBlank(searchQuery)) {
    tfe = joinExpressions({
      logicalOperator: or,
      expressions: [
        createApplicationNameTagFilter(searchQuery),
        createServiceNameTagFilter(searchQuery),
        createEndpointNameTagFilter(searchQuery)
      ]
    });
  }

  if (readOnly) {
    tfe = joinExpressions({
      logicalOperator: and,
      expressions: [
        tfe,
        joinExpressions({
          logicalOperator: or,
          expressions: Object.keys(state).map(id => createApplicationIdTagFilter(id, boundaryScope))
        })
      ]
    });
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
  editMode: PropTypes.bool,
  readOnly: PropTypes.bool,
  appIdForIndividualSmartAlert: PropTypes.string,
  includeSynthetic: PropTypes.bool.isRequired
};
