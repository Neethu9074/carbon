import { get } from 'lodash';
import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingIntegrations
} from 'in-views/configurationView/navigation/paths';
import NewIntegrationButton from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/components/NewIntegrationButton';
import { fullyQualified } from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/configs';
import { deleteIntegration, getIntegrationsMutable } from 'in-api/integrations';
import List from 'in-views/configurationView/components/List';
import Link from 'in-components/Link';

export default function Integrations() {
  return (
    <List
      title="Integrations"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getIntegrationsMutable}
      initialOrderBy="name"
      rightHeader={<NewIntegrationButton />}
      searchAttributes={['name', 'kind']}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingIntegrations, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(entity) {
      return <Link href$={getEntityIdView(teamSettingsAlertingIntegrations, entity.id)}>{entity.name}</Link>;
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

function getHeader(entities) {
  return entities ? `Existing Integrations (${entities.length})` : 'Existing Integrations';
}

function getEntityName(entity) {
  return `integration "${entity.name}"`;
}
