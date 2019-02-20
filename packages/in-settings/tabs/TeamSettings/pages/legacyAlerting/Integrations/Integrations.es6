import { get } from 'lodash';
import React from 'react';

import NewIntegrationButton from 'in-settings/tabs/TeamSettings/pages/legacyAlerting/Integrations/components/NewIntegrationButton';
import { getEntityHref, getEntityIdView, teamSettingsAlertingIntegrations } from 'in-settings/navigation/paths';
import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/legacyAlerting/Integrations/configs';
import { deleteIntegration, getIntegrationsMutable } from 'in-api/integrations';
import List from 'in-settings/components/List';
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
    ellipsis: '35vw',
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

function getHeader(totalHits) {
  return totalHits ? `Integrations (${totalHits})` : 'Integrations';
}

function getEntityName(entity) {
  return `integration "${entity.name}"`;
}
