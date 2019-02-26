import { get } from 'lodash';
import React from 'react';

import NewChannelButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/NewChannelButton';
import { getEntityHref, getEntityIdView, teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { deleteIntegration, getIntegrationsMutable } from 'in-api/integrations';
import WithSubscript from 'in-settings/components/WithSubscript';
import List from 'in-settings/components/List';
import Link from 'in-components/Link';

import locals from './AlertChannels.mless';

export default function AlertChannels() {
  return (
    <List
      title="Alert Channels"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getIntegrationsMutable}
      initialOrderBy="name"
      rightHeader={<NewChannelButton />}
      searchAttributes={['name', getKind, getStringifiedParameters]}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingAlertChannels, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    ellipsis: '20vw',
    getContent(entity) {
      return (
        <WithSubscript subscript={getKind(entity)}>
          <Link href$={getEntityIdView(teamSettingsAlertingAlertChannels, entity.id)}>{entity.name}</Link>
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
    ellipsis: '40vw',
    getContent(entity) {
      const parameters = getParameters(entity);
      if (!parameters) {
        return null;
      }
      return (
        <div className={locals.allProperties}>
          {parameters.filter(({ key }) => key !== 'name' && key !== 'kind').map(({ key, label }) => (
            <Property attribute={key} label={label} entity={entity} />
          ))}
        </div>
      );
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteIntegration(entity.id)
  }
};

function getHeader(totalHits) {
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
  if (entity[attribute]) {
    return (
      <div className={locals.propertyContainer}>
        <span className={locals.propertyLabel}>{label}</span>
        <span className={locals.propertyValue}>{entity[attribute]}</span>
      </div>
    );
  }
  return null;
}
