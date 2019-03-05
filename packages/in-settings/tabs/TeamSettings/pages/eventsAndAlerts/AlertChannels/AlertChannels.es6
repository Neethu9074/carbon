import { get } from 'lodash';
import React from 'react';

import NewChannelButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/NewChannelButton';
import { getEntityHref, getEntityIdView, teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import PropertyInTable from 'in-settings/tabs/TeamSettings/components/PropertyInTable';
import { deleteIntegration, getIntegrationsMutable } from 'in-api/integrations';
import WithSubscript from 'in-settings/components/WithSubscript';
import List from 'in-settings/components/List';
import Link from 'in-components/Link';

import locals from './AlertChannels.mless';

export default function AlertChannels({
  setTitle = true,
  getHeader = defaultGetHeader,
  tableClassName,
  tableStyle,
  tableActions = defaultTableActions,
  loadEntities,
  noDataMessage,
  pageSize = 20,
  rightHeader = <NewChannelButton />,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = true
}) {
  return (
    <List
      title={setTitle ? 'Alert Channels' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      tableClassName={tableClassName}
      tableStyle={tableStyle}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getIntegrationsMutable}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['name', getKind, getStringifiedParameters]}
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
          <WithSubscript subscript={getKind(entity)}>
            {hasRowNavigation ? (
              <Link href$={getEntityIdView(teamSettingsAlertingAlertChannels, entity.id)} ellipsis>
                {entity.name}
              </Link>
            ) : (
              <span className={locals.ellipsis}>{entity.name}</span>
            )}
          </WithSubscript>
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
            {parameters.filter(({ key }) => key !== 'name' && key !== 'kind').map(({ key, label }) => (
              <Property key={key} attribute={key} label={label} entity={entity} />
            ))}
          </div>
        );
      }
    }
  ];
}

const defaultTableActions = {
  delete: {
    deleteEntity: entity => deleteIntegration(entity.id)
  }
};

function defaultGetHeader(totalHits) {
  return totalHits ? `Alert Channels (${totalHits})` : 'Alert Channels';
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

function Property({ attribute, label, entity }) {
  return <PropertyInTable label={label} value={entity[attribute]} />;
}

export function noRightHeader() {
  // Used to explicitly disable that default right header (create new alert channel button) when this is used in a
  // dialog to select alert channels in the alert details form. Reason: The create-new button would navigate away from
  // the edit form in which's context the dialog is shown, thus the user would lose all their unsaved edits on that
  // form.
  return null;
}
