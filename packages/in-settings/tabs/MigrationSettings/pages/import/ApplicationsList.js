/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { useObservable } from '@instana/hooks';

import {
  createNoMatchingEntityText,
  sortListBySelectionState,
  enrichListWithStaleSelectionData
} from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/utils';
import { stateManagementPropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import { selectApplication } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/selectors';
import ServicesList from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/ServicesList';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { noop } from 'in-services/util/function';
import SharedList from './SharedList';

export default function ApplicationsList({ searchQuery, ...props }) {
  const trimmedSearchQuery = searchQuery?.trim();
  const getStaleEntity = props.getApplication;
  return (
    <ApplicationListSingleApplication {...props} searchQuery={trimmedSearchQuery} getStaleEntity={getStaleEntity} />
  );
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

  const initiallyOpen = Boolean(props.searchQuery) && applicationResult.items.length > 0;

  return (
    <ApplicationBaseList
      {...props}
      key={initiallyOpen} //force rerender to show/render expanded list
      items={applicationResult.items}
      isLoading={isLoading(applicationResult)}
      loadMore={noop}
      initiallyOpen={initiallyOpen}
    />
  );
}

function ApplicationBaseList({ items = [], isLoading, getStaleEntity, initiallyOpen, icon, ...props }) {
  const {
    stateManagement: { state },
    searchQuery,
    readOnly,
    showInteractedItemsOnly
  } = props;

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
      isLoading={isLoading}
      listData={
        showInteractedItemsOnly
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
          return { name: 'Application', iconType: icon };
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
          return props.checked ? props.checked : false;
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

ApplicationsList.propTypes = {
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
