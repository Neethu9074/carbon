/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import { get } from 'lodash';

import NewChannelButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/NewChannelButton';
import { getEntityHref, getEntityIdView, teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import PropertyInTable from 'in-settings/tabs/TeamSettings/components/PropertyInTable';
import { deleteAlertChannel, getAlertChannelsMutable } from 'in-api/alertChannels';
import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import WithSubscript from 'in-settings/components/WithSubscript';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

import locals from './AlertChannels.mless';

export default function AlertChannels({
  setTitle = true,
  scrollWrapperClassName,
  tableActions = defaultTableActions,
  loadEntities,
  noDataMessage,
  renderNoDataAvailable,
  hiddenIds,
  pageSize = 20,
  rightHeader = <NewChannelButton />,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true,
  inSelectListDialog = false,
  getHeader = defaultGetHeader(inSelectListDialog, tableActions)
}) {
  return (
    <List
      title={setTitle ? 'Alert Channels' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      scrollWrapperClassName={scrollWrapperClassName}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getAlertChannelsMutable}
      noDataMessage={noDataMessage}
      renderNoDataAvailable={renderNoDataAvailable}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['name', getKind, getStringifiedParameters]}
      extraFilters={createFilters(hiddenIds)}
      searchPlaceholder="Filter…"
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
      label: 'Name',
      width: 35,
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
      label: 'Properties',
      sortable: false,
      width: 65,
      getContent(entity) {
        const parameters = getParameters(entity);
        if (!parameters) {
          return null;
        }
        return (
          <div className={locals.allProperties}>
            {parameters
              .filter(({ key }) => key !== 'name' && key !== 'kind')
              .map(({ key, label }) => (
                <Tooltip key={key} content={`${label}: ${entity[key]}`} delay={500}>
                  <Property attribute={key} label={label} entity={entity} />
                </Tooltip>
              ))}
          </div>
        );
      }
    }
  ];
}

const defaultTableActions = {
  delete: {
    deleteEntity: entity => deleteAlertChannel(entity.id)
  }
};

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll('Alert Channels', inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `alert channel "${entity.name}"`;
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

const Property = forwardRef(function Property({ attribute, label, entity }, ref) {
  return <PropertyInTable label={label} value={entity[attribute]} ref={ref} />;
});

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
