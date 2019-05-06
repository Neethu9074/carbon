import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAccessControlTeamNew,
  teamSettingsAccessControlTeams
} from 'in-settings/navigation/paths';
import { getTeams, deleteTeam } from 'in-api/teams';
import List from 'in-settings/components/List';
import Link from 'in-components/Link';

export default function Teams() {
  return (
    <List
      title="Teams"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getTeams}
      initialOrderBy="name"
      labelNew="New Team"
      pathNew={teamSettingsAccessControlTeamNew}
      searchAttributes={['name']}
      getDetailsHref={entity => getEntityHref(teamSettingsAccessControlTeams, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    width: 70,
    getContent(entity) {
      return (
        <Link href$={getEntityIdView(teamSettingsAccessControlTeams, entity.id)} ellipsis>
          <span>{entity.name}</span>
        </Link>
      );
    }
  },
  {
    id: 'scopeCount',
    width: 30,
    getContent(entity) {
      return <span>{entity.permissions.length} Access Scopes</span>;
    }
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteTeam(entity.id)
  }
};

function getHeader(totalHits) {
  return totalHits ? `Teams (${totalHits})` : 'Teams';
}

function getEntityName(entity) {
  return `team "${entity.name}"`;
}
