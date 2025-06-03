/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { just, create } from '@instana/observables';
import { Button } from '@instana/components';

import {
  columnDefinitions,
  getEntityName,
  getKind,
  getStringifiedParameters,
  createFilters
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import List, { defaultHeaderWithCount, areAllRowsOnAllPagesSelected } from 'in-settings/components/List';
import { getEntityHref, globalSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { pageSizes } from 'in-alerting/smart-alerts/data/constants';
import { clickAlertChannelTracker } from 'in-settings/tracker';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelsList.mless';

export const channelListLoading$ = create().emit(undefined);

/**
 * A searchable list of all configured alert channels that does not reveal confidential or pure configuration related
 * properties, but only information that helps to better understand what this alert channel is about.
 */
export default function AlertChannelsList({
  setTitle = true,
  numberOfChannels,
  preSelectedChannels,
  tableActions = {},
  noDataMessage,
  renderNoDataAvailable,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true,
  getHeader = leftHeaderWithSelectAll(tableActions, numberOfChannels),
  entityResult
}) {
  const [channelsPreSelected] = useState(preSelectedChannels);

  return (
    <List
      title={setTitle ? t('in-settings:tabs.alertChannels') : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      tableActions={tableActions}
      loadEntities={() => just(entityResult)}
      noDataMessage={noDataMessage}
      renderNoDataAvailable={renderNoDataAvailable}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['name', getKind, getStringifiedParameters]}
      searchWidth={'100%'}
      searchMaxWidth={240}
      extraFilters={createFilters(hiddenIds)}
      customSortEntities={sortSelecteditems(channelsPreSelected)}
      searchPlaceholder={t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.searchPlaceholder')}
      onRowClick={onRowClick}
      getDetailsHref={
        onRowClick || !hasRowNavigation
          ? null
          : entity => {
              clickAlertChannelTracker({
                alertChannelName: entity.name ?? '',
                alertChannelId: entity.id ?? '',
                alertChannelKind: entity.kind ?? ''
              });
              return getEntityHref(globalSettingsAlertingAlertChannels, entity.id);
            }
      }
      pageSizes={pageSizes}
    />
  );
}

function sortSelecteditems(selectedIds) {
  return ({ entities }) => {
    return entities.sort((a, b) => selectedIds.indexOf(b.id) - selectedIds.indexOf(a.id));
  };
}

function getAlertChannelTitle(channelCount) {
  return channelCount > 0
    ? t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.title', { channelCount })
    : t('in-settings:tabs.alertChannels');
}

function leftHeaderWithSelectAll(tableActions, numberOfChannels) {
  const entityName = getAlertChannelTitle(numberOfChannels);
  return function LeftHeaderWithSelectAll(totalHits, filteredHits, entitiesBeforePagination) {
    const allSelected = areAllRowsOnAllPagesSelected(entitiesBeforePagination, tableActions);
    if (
      entitiesBeforePagination &&
      entitiesBeforePagination.length > 0 &&
      tableActions.selectCheckbox &&
      tableActions.selectCheckbox.setAllOnAllPages
    ) {
      return (
        <>
          <div
            className={classNames({
              [locals.grid3]: true,
              [locals.grid2]: !numberOfChannels
            })}
          >
            <span className={locals.channelTitle}>{entityName}</span>
            <Button
              kind="action"
              onClick={() => tableActions.selectCheckbox.setAllOnAllPages(entitiesBeforePagination, !allSelected)}
              disabled={allSelected ? true : false}
            >
              {t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.selectAll', {
                len: entitiesBeforePagination.length
              })}
            </Button>
            {numberOfChannels > 0 && (
              <Button
                kind="action"
                className={locals.colorDanger}
                onClick={() => tableActions.selectCheckbox.setAllOnAllPages(entitiesBeforePagination, false)}
              >
                {t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.clearAll')}
              </Button>
            )}
          </div>
          <div className={locals.scopeMargin} />
        </>
      );
    } else {
      const getHeaderFunction = defaultHeaderWithCount(entityName);
      return <span className={locals.channelTitle}>{getHeaderFunction(totalHits, filteredHits)}</span>;
    }
  };
}
