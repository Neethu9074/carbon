import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsKnowledgeManagementBuiltInRules
} from 'in-settings/navigation/paths';
import { getBuiltInRulesMutable, setBuiltInRuleEnabledMutable } from 'in-api/rules';
import WithSubscript from 'in-settings/components/WithSubscript';
import WithIcon from 'in-new-components/WithIcon';
import { getSingular } from 'in-sdk/pluginName';
import List from 'in-settings/components/List';
import Link from 'in-components/Link';

export default function BuiltInRules() {
  return (
    <List
      title="Built-in Rules"
      getHeader={getHeader}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getBuiltInRulesMutable}
      initialOrderBy="name"
      searchAttributes={['name', getEntityType]}
      getDetailsHref={entity => getEntityHref(teamSettingsKnowledgeManagementBuiltInRules, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    width: 60,
    getContent(entity) {
      return (
        <WithSubscript subscript={entity.enabled ? null : 'disabled'}>
          <Link href$={getEntityIdView(teamSettingsKnowledgeManagementBuiltInRules, entity.id)} ellipsis>
            {entity.name}
          </Link>
        </WithSubscript>
      );
    }
  },
  {
    id: 'entityType',
    label: 'Entity Type',
    width: 40,
    ellipsis: true,
    getContent(entity) {
      return <WithIcon plugin={entity.shortPluginId}>{getSingular(entity.shortPluginId)}</WithIcon>;
    },
    getValue: getEntityType
  }
];

const tableActions = {
  toggleEnabled: {
    key: 'enabled',
    toggle: entity => {
      return setBuiltInRuleEnabledMutable(entity.id, !entity.enabled);
    }
  }
};

function getHeader(totalHits) {
  return totalHits ? `Built-in Rules (${totalHits})` : 'Built-in Rules';
}

function getEntityType(entity) {
  return getSingular(entity.shortPluginId);
}
