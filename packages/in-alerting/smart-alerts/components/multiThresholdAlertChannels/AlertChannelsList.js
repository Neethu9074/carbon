/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, Toggle } from '@instana/components';

import {
  CRITICAL,
  WARNING,
  updateAllToggleAndFormForWarning,
  updateAllToggleAndFormForCritical,
  updateOnRowToggleAndFormForWarning,
  updateOnRowToggleAndFormForCritical,
  getAlertChannelTitle,
  getAlertChannelColumnTitle,
  getThresholdFieldStatus
} from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import {
  columnDefinitions,
  getEntityName,
  getKind,
  getStringifiedParameters,
  createFilters
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/AlertChannelsList';
import { getEntityHref, teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { SETTINGS_ALERT_CHANNEL_CLICK } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import List, { defaultHeaderWithCount } from 'in-settings/components/List';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import { t } from 'in-i18n';

import locals from './AlertChannelsList.mless';

/**
 * A searchable list of all configured alert channels that does not reveal confidential or pure configuration related
 * properties, but only information that helps to better understand what this alert channel is about.
 */
export default function AlertChannelsList({
  setTitle = true,
  form,
  onChange,
  tableActions = {},
  loadEntities,
  noDataMessage,
  renderNoDataAvailable,
  hiddenIds,
  pageSize = 20,
  simpleMode,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true,
  getHeader = leftHeaderWithSelectAll(form, onChange)
}) {
  const { trackCta } = useSegmentTracking();
  const selectedChannels = form.get('alertChannels').value;
  const { warningThresholdFieldDisabled, criticalThresholdFieldDisabled } = getThresholdFieldStatus(form);

  return (
    <List
      title={setTitle ? t('in-settings:tabs.alertChannels') : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={getColumnDefinitions(
        hasRowNavigation,
        warningThresholdFieldDisabled,
        criticalThresholdFieldDisabled,
        selectedChannels,
        onChange,
        simpleMode
      )}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getAlertChannelsInfosMutable}
      noDataMessage={noDataMessage}
      renderNoDataAvailable={renderNoDataAvailable}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['name', getKind, getStringifiedParameters]}
      extraFilters={createFilters(hiddenIds)}
      searchPlaceholder={t('in-settings:tabs.filter')}
      onRowClick={onRowClick}
      getDetailsHref={
        onRowClick || !hasRowNavigation
          ? null
          : entity => {
              trackCta(
                SETTINGS_ALERT_CHANNEL_CLICK,
                {
                  additionalLabel: entity.id ?? ''
                },
                entity.kind ?? ''
              );
              return getEntityHref(teamSettingsAlertingAlertChannels, entity.id);
            }
      }
    />
  );
}

function getColumnDefinitions(
  hasRowNavigation,
  warningThresholdFieldDisabled,
  criticalThresholdFieldDisabled,
  selectedChannels,
  onChange,
  simpleMode
) {
  return [
    ...columnDefinitions(hasRowNavigation),
    ...(!warningThresholdFieldDisabled || simpleMode
      ? [
          {
            id: 'selectWarningToggle',
            label: getAlertChannelColumnTitle(
              WARNING,
              warningThresholdFieldDisabled,
              criticalThresholdFieldDisabled,
              selectedChannels
            ),
            sortable: false,
            width: '7rem',
            widthInAbsoluteUnit: true,
            getContent(entity) {
              return !criticalThresholdFieldDisabled ? (
                <Toggle
                  checked={selectedChannels?.WARNING?.includes(entity.id) ?? false}
                  onToggle={updateOnRowToggleAndFormForWarning(selectedChannels, entity, onChange)}
                />
              ) : (
                t('in-alerting:smartAlerts.alertChannelList.warning')
              );
            }
          }
        ]
      : []),
    ...(!criticalThresholdFieldDisabled
      ? [
          {
            id: 'selectCriticalToggle',
            label: getAlertChannelColumnTitle(
              CRITICAL,
              warningThresholdFieldDisabled,
              criticalThresholdFieldDisabled,
              selectedChannels
            ),
            sortable: false,
            width: '7rem',
            widthInAbsoluteUnit: true,
            getContent(entity) {
              return !warningThresholdFieldDisabled ? (
                <Toggle
                  checked={selectedChannels?.CRITICAL?.includes(entity.id) ?? false}
                  onToggle={updateOnRowToggleAndFormForCritical(selectedChannels, entity, onChange)}
                />
              ) : (
                t('in-alerting:smartAlerts.alertChannelList.critical')
              );
            }
          }
        ]
      : [])
  ];
}

function leftHeaderWithSelectAll(form, onChange) {
  const entityName = getAlertChannelTitle();
  const selectedChannelList = form.get('hiddenFields').get('selectedChannelList').value;
  const numberOfChannels = selectedChannelList.length;
  const enabledChannels = form.get('alertChannels').value;
  const { warningThresholdFieldDisabled, criticalThresholdFieldDisabled } = getThresholdFieldStatus(form);

  return function LeftHeaderWithSelectAll(totalHits, filteredHits, entitiesBeforePagination) {
    const getHeaderFunction = defaultHeaderWithCount(entityName);

    const filteredWarningEnabled = entitiesBeforePagination?.filter(item =>
      enabledChannels?.WARNING?.includes(item.id)
    );
    const filteredCriticalEnabled = entitiesBeforePagination?.filter(item =>
      enabledChannels?.CRITICAL?.includes(item.id)
    );

    const ifAllSelectedChannelsEnabledForWarning = entitiesBeforePagination?.length == filteredWarningEnabled?.length;
    const ifAllSelectedChannelsEnabledForCritical = entitiesBeforePagination?.length == filteredCriticalEnabled?.length;

    if (entitiesBeforePagination && entitiesBeforePagination.length > 0) {
      return (
        <Stack>
          <span className={locals.channelTitle}>{getHeaderFunction(totalHits, filteredHits)}</span>
          {numberOfChannels > 0 && !warningThresholdFieldDisabled && !criticalThresholdFieldDisabled && (
            <div className={locals.leftHeader}>
              <Stack direction="horizontal" align="center">
                <AlertTypography
                  variant={'body-regular'}
                  color={'color900'}
                  content={t('in-alerting:smartAlerts.alertChannelList.selectAllWarning')}
                />
                <Toggle
                  disabled={warningThresholdFieldDisabled}
                  checked={ifAllSelectedChannelsEnabledForWarning}
                  onToggle={updateAllToggleAndFormForWarning(enabledChannels, entitiesBeforePagination, onChange)}
                />
                <AlertTypography
                  variant={'body-regular'}
                  color={'color900'}
                  content={t('in-alerting:smartAlerts.alertChannelList.selectAllCritical')}
                />
                <Toggle
                  disabled={criticalThresholdFieldDisabled}
                  checked={ifAllSelectedChannelsEnabledForCritical}
                  onToggle={updateAllToggleAndFormForCritical(enabledChannels, entitiesBeforePagination, onChange)}
                />
              </Stack>
            </div>
          )}
        </Stack>
      );
    } else {
      return <span className={locals.channelTitle}>{getHeaderFunction(totalHits, filteredHits)}</span>;
    }
  };
}
