import { get } from 'lodash';
import React from 'react';

import NewChannelButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/components/NewChannelButton';
import { getEntityHref, getEntityIdView, teamSettingsAlertingAlertChannels } from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { deleteIntegration, getIntegrationsMutable } from 'in-api/integrations';
import List from 'in-settings/components/List';
import Link from 'in-components/Link';

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
      searchAttributes={['name', 'kind']}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingAlertChannels, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    ellipsis: '35vw',
    getContent(entity) {
      return <Link href$={getEntityIdView(teamSettingsAlertingAlertChannels, entity.id)}>{entity.name}</Link>;
    }
  },
  {
    id: 'kind',
    label: 'Type',
    getContent(entity) {
      return get(fullyQualified[entity.kind], ['label'], entity.kind);
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
