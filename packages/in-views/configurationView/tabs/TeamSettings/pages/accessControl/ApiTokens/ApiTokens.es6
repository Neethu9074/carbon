import { createLogger } from 'instalog';
import { Map } from 'immutable';
import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAccessControlApiTokens
} from 'in-views/configurationView/navigation/paths';
import { getApiTokensMutable, deleteApiToken, saveApiToken } from 'in-api/apiTokens';
import List from 'in-views/configurationView/components/List';
import { generateUniqueShortId } from 'in-services/util/id';
import { goToPath } from 'in-stores/navigation';
import Link from 'in-components/Link';

const logger = createLogger('ApiTokens');

export default function ApiTokens() {
  return (
    <List
      title="API Tokens"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getApiTokensMutable}
      initialOrderBy="name"
      onCreateNew={onCreateNew}
      labelNew="Add API Token"
      searchAttributes={['name', 'id']}
      getDetailsHref={entity => getEntityHref(teamSettingsAccessControlApiTokens, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(entity) {
      return <Link href$={getEntityIdView(teamSettingsAccessControlApiTokens, entity.id)}>{entity.name}</Link>;
    }
  },
  {
    id: 'id',
    label: 'Token',
    getContent(entity) {
      return <em>{entity.id}</em>;
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteApiToken(entity.id)
  }
};

function getHeader(entities) {
  return entities ? `Existing API Tokens (${entities.length})` : 'Existing API Tokens';
}

function getEntityName(entity) {
  return `API token "${entity.name}"`;
}

function onCreateNew() {
  const newId = generateUniqueShortId();
  const newApiToken = Map({
    id: newId,
    name: 'New API Token'
  });

  const saveResult$ = saveApiToken(newApiToken);
  saveResult$.once(() => goToPath(getEntityHref(teamSettingsAccessControlApiTokens, newId)));
  saveResult$.errors().once(error => {
    logger.error(`Failed to save new API token: ${error.message}`, error);
  });
}
