import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsKnowledgeManagementBuiltInRules
} from 'in-views/configurationView/navigation/paths';
import { getBuiltInRulesMutable, setBuiltInRuleEnabledMutable } from 'in-api/rules';
import List from 'in-views/configurationView/components/List';
import WithIcon from 'in-new-components/WithIcon';
import { getSingular } from 'in-sdk/pluginName';
import Link from 'in-components/Link';

export default function BuiltInRule() {
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
    getContent(entity) {
      return <Link href$={getEntityIdView(teamSettingsKnowledgeManagementBuiltInRules, entity.id)}>{entity.name}</Link>;
    }
  },
  {
    id: 'entityType',
    label: 'Entity Type',
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
