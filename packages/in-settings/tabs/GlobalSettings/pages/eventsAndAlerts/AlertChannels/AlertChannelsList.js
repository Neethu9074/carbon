/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Link } from '@instana/components';

import { getEntityHref, getEntityIdView, globalSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { clickAlertChannelTracker, alertChannelCTATrackerSegment } from 'in-settings/tracker';
import PropertyInTable from 'in-settings/tabs/GlobalSettings/components/PropertyInTable';
import { SETTINGS_ALERT_CHANNEL_CLICK } from 'in-services/tracking/eventNames';
import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import WithSubscript from 'in-settings/components/WithSubscript';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './AlertChannelsList.mless';

/**
 * A searchable list of all configured alert channels that does not reveal confidential or pure configuration related
 * properties, but only information that helps to better understand what this alert channel is about.
 */
export default function AlertChannelsList({
  setTitle = true,
  tableActions = {},
  loadEntities,
  noDataMessage,
  renderNoDataAvailable,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true,
  inSelectListDialog = false,
  getHeader = defaultGetHeader(inSelectListDialog, tableActions)
}) {
  const { location } = useNavigation();

  return (
    <List
      title={setTitle ? t('in-settings:tabs.alertChannels') : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
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
              clickAlertChannelTracker({
                alertChannelName: entity.name ?? '',
                alertChannelId: entity.id ?? '',
                alertChannelKind: entity.kind ?? ''
              });
              alertChannelCTATrackerSegment({
                EVENT_NAME: SETTINGS_ALERT_CHANNEL_CLICK,
                channel: entity.kind ?? '',
                path: location.pathname,
                additionalLabel: entity.id ?? ''
              });
              return getEntityHref(globalSettingsAlertingAlertChannels, entity.id);
            }
      }
    />
  );
}

export function columnDefinitions(hasRowNavigation) {
  return [
    {
      id: 'name',
      label: t('in-settings:tabs.name'),
      width: 50,
      getContent(entity) {
        return (
          <Tooltip content={entity.name} align="auto" delay={500}>
            <WithSubscript subscript={getKind(entity)}>
              {hasRowNavigation ? (
                <Link href={getEntityIdView(globalSettingsAlertingAlertChannels, entity.id)} ellipsis>
                  {entity.name}
                </Link>
              ) : (
                <span className={locals.ellipsis}>{entity.name}</span>
              )}
            </WithSubscript>
          </Tooltip>
        );
      },
      getValue(entity) {
        return entity.name;
      }
    },
    {
      id: 'properties',
      label: t('in-settings:tabs.properties'),
      sortable: false,
      width: 50,
      getContent(entity) {
        if (!entity.properties) {
          return null;
        }
        return (
          <div className={locals.allProperties}>
            {Object.keys(entity.properties).map((property, index) => (
              <Tooltip key={property} content={`${property}: ${entity.properties[property]}`} delay={500}>
                <PropertyInTable label={property} value={entity.properties[property]} key={index} />
              </Tooltip>
            ))}
          </div>
        );
      }
    }
  ];
}

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll(t('in-settings:tabs.alertChannels'), inSelectListDialog, tableActions);
}

export function getEntityName(entity) {
  return t('in-settings:tabs.alertChannelEntityName', { entityName: entity.name });
}

function getConfig(entity) {
  return fullyQualified[entity.kind];
}

export function getKind(entity) {
  return get(getConfig(entity), ['label'], entity.kind);
}

function getParameters(entity) {
  const config = getConfig(entity);
  if (!config || !config.getParameters) {
    return null;
  }
  return config.getParameters();
}

export function getStringifiedParameters(entity) {
  const parameters = getParameters(entity);
  if (!parameters) {
    return null;
  }
  return parameters.reduce((acc, { key }) => {
    if (entity[key]) {
      return (acc += `,${entity[key]}`);
    }
    return acc;
  }, '');
}

export function noRightHeader() {
  // Used to explicitly disable that default right header (create new alert channel button) when this is used in a
  // dialog to select alert channels in the alert details form. Reason: The create-new button would navigate away from
  // the edit form in which's context the dialog is shown, thus the user would lose all their unsaved edits on that
  // form.
  return null;
}

export function createFilters(hiddenIds) {
  const filters = [];
  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }

  return filters;
}
