/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { just, create } from '@instana/observables';
import { Stack, Button } from '@instana/components';

import {
  columnDefinitions,
  getEntityName,
  getKind,
  getStringifiedParameters,
  createFilters
} from 'in-alerting/smart-alerts/components/tearSheet/AlertChannelSelectionList';
import List, { defaultHeaderWithCount, areAllRowsOnAllPagesSelected } from 'in-settings/components/List';
import { getEntityHref, globalSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import useIsTeamsAvailable from 'in-settings/hooks/useIsTeamsAvailable';
import AlertTypography from 'in-alerting/components/AlertTypography';
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
  entityResult,
  createdChannelId
}) {
  const [isRbacTeamsAvailable] = useIsTeamsAvailable();
  const [channelsPreSelected, setChannelsPreSelected] = useState(preSelectedChannels);
  useEffect(() => {
    createdChannelId && setChannelsPreSelected([...preSelectedChannels, createdChannelId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdChannelId]);
  return (
    <List
      title={setTitle ? t('in-settings:tabs.alertChannels') : null}
      getCustomHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation, undefined, isRbacTeamsAvailable)}
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
      customSortEntities={
        channelsPreSelected && channelsPreSelected.length > 0 ? sortSelectedItems(channelsPreSelected) : undefined
      }
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

function sortSelectedItems(selectedIds) {
  return ({ entities = [], columnDefinitions, orderByState, orderDirectionState }) => {
    if (!entities.length || !orderByState) return entities;

    const { selectedEntities, nonSelectedEntities } = entities.reduce(
      (acc, entity) => {
        const key = selectedIds.includes(entity.id) ? 'selectedEntities' : 'nonSelectedEntities';
        acc[key].push(entity);
        return acc;
      },
      { selectedEntities: [], nonSelectedEntities: [] }
    );

    const sortFn = getSortFunction(columnDefinitions, orderByState, orderDirectionState);
    return [...selectedEntities.sort(sortFn), ...nonSelectedEntities.sort(sortFn)];
  };
}

function getSortFunction(columnDefinitions, orderBy, direction) {
  const columnDef = columnDefinitions.find(col => col.id === orderBy);

  return (a, b) => {
    const getValue = columnDef?.getValue ?? (row => row[orderBy]);
    let valueA = getValue(a) ?? '';
    let valueB = getValue(b) ?? '';

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA === valueB) return 0;
    const comparison = valueA < valueB ? -1 : 1;
    return direction === 'ASC' ? comparison : -comparison;
  };
}

function getAlertChannelTitle(channelCount) {
  return channelCount > 0
    ? t('in-alerting:smartAlerts.applications.tearSheet.alertChannelList.title', { channelCount })
    : t('in-settings:tabs.alertChannels');
}

function leftHeaderWithSelectAll(tableActions, numberOfChannels) {
  const tableTitle = getAlertChannelTitle(numberOfChannels);
  return function LeftHeaderWithSelectAll(totalHits, filteredHits, entitiesBeforePagination) {
    const allSelected = areAllRowsOnAllPagesSelected(entitiesBeforePagination, tableActions);
    if (
      entitiesBeforePagination &&
      entitiesBeforePagination.length > 0 &&
      tableActions.selectCheckbox &&
      tableActions.selectCheckbox.setAllOnAllPages
    ) {
      return (
        <Stack direction="horizontal" align="center">
          <AlertTypography variant="heading-200" noMargin content={tableTitle} />
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
        </Stack>
      );
    } else {
      const getHeaderFunction = defaultHeaderWithCount(tableTitle);
      return <AlertTypography variant="heading-200" noMargin content={getHeaderFunction(totalHits, filteredHits)} />;
    }
  };
}
