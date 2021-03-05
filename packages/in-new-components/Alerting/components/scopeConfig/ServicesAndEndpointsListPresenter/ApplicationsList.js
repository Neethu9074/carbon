/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  DEFAULT_PAGE_SIZE,
  enrichListWithStaleSelectionData,
  createNoMatchingEntityText,
  sortListBySelectionState
} from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import { stateManagementPropType } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import { selectApplication } from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import ServicesList from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/ServicesList';
import SharedList from 'in-new-components/Alerting/components/scopeConfig/ServicesAndEndpointsListPresenter/SharedList';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { isLoading } from 'in-services/util/result';

export default function ApplicationsList({
  getApplicationsCursorPaginated,
  getApplication,
  isGlobalSmartAlert,
  alertApplicationId,
  ...props
}) {
  const searchQuery = props.searchQuery?.trim();
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
              timeConfig: props.timeConfig
            }
            // tagFilterExpression: searchQuery ? [] : [] // TODO: not usable yet since EP doesn't support tagFilterExpression.
          })
        : getApplication({ id: alertApplicationId }).map(result => {
            return { ...result, data: { items: result?.data ? [{ application: result.data }] : [] } };
          }),
    [searchQuery, isGlobalSmartAlert]
  );

  const { state } = props.stateManagement;

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
        shouldAdd() {
          return true;
        },
        getBadgeElement() {
          return null;
        },
        getLabel$: getApplication
      }}
      initiallyOpen={Boolean(searchQuery) && items.length > 0}
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

ApplicationsList.propTypes = {
  alertApplicationId: PropTypes.string,
  isGlobalSmartAlert: PropTypes.bool,
  getApplication: PropTypes.func.isRequired,
  getApplicationsCursorPaginated: PropTypes.func.isRequired,
  stateManagement: stateManagementPropType.isRequired,
  timeConfig: propTypeTimeConfig.isRequired,
  searchQuery: PropTypes.string,
  boundaryScope: PropTypes.string.isRequired,
  showInteractedItemsOnly: PropTypes.bool,
  editMode: PropTypes.bool
};
