/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { getEntityHref, getEntityIdView, teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import PropertyInTable from 'in-settings/tabs/TeamSettings/components/PropertyInTable';
import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import { getAlertChannelsInfosMutable } from 'in-api/alertChannels';
import WithSubscript from 'in-settings/components/WithSubscript';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
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
        onRowClick || !hasRowNavigation ? null : entity => getEntityHref(teamSettingsAlertingAlertChannels, entity.id)
      }
    />
  );
}

function columnDefinitions(hasRowNavigation) {
  return [
    {
      id: 'name',
      label: t('in-settings:tabs.name'),
      width: 50,
      getContent(entity) {
        return (
          <Tooltip content={entity.name} align="topLeft" delay={500}>
            <WithSubscript subscript={getKind(entity)}>
              {hasRowNavigation ? (
                <Link href$={getEntityIdView(teamSettingsAlertingAlertChannels, entity.id)} ellipsis>
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

function getEntityName(entity) {
  return t('in-settings:tabs.alertChannelEntityName', { entityName: entity.name });
}

function getConfig(entity) {
  return fullyQualified[entity.kind];
}

function getKind(entity) {
  return get(getConfig(entity), ['label'], entity.kind);
}

function getParameters(entity) {
  const config = getConfig(entity);
  if (!config || !config.getParameters) {
    return null;
  }
  return config.getParameters();
}

function getStringifiedParameters(entity) {
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

function createFilters(hiddenIds) {
  const filters = [];
  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }

  return filters;
}
