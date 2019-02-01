import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsKnowledgeManagementCustomRules,
  teamSettingsKnowledgeManagementCustomRuleNew
} from 'in-views/configurationView/navigation/paths';
import { findMetricName } from 'in-views/configurationView/tabs/TeamSettings/pages/knowledgeManagement/metricNameUtil';
import { deleteRule, getRulesMutable } from 'in-api/rules';
import List from 'in-views/configurationView/components/List';
import WithIcon from 'in-new-components/WithIcon';
import { getSingular } from 'in-sdk/pluginName';
import { getCategories } from 'in-sdk/metrics';
import Badge from 'in-components/Badge';
import Link from 'in-components/Link';

export default function CustomRule() {
  return (
    <List
      title="Custom Rules"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getRulesMutable}
      initialOrderBy="name"
      labelNew="Create Custom Rule"
      pathNew={teamSettingsKnowledgeManagementCustomRuleNew}
      searchAttributes={['name', getEntityType, getMetric]}
      getDetailsHref={entity => getEntityHref(teamSettingsKnowledgeManagementCustomRules, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(entity) {
      return (
        <Link href$={getEntityIdView(teamSettingsKnowledgeManagementCustomRules, entity.id)}>
          {entity.name} {entity.deprecated && <Badge size="sm">Deprecated Rule</Badge>}
        </Link>
      );
    }
  },
  {
    id: 'entityType',
    label: 'Entity Type',
    getContent(entity) {
      return <WithIcon plugin={entity.entityType}>{getSingular(entity.entityType)}</WithIcon>;
    },
    getValue: getEntityType
  },
  {
    id: 'metric',
    label: 'Metric',
    getContent: getMetric,
    getValue: getMetric
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteRule(entity.id)
  }
};

function getHeader(entities) {
  return entities ? `Custom Rules (${entities.length})` : 'Custom Rules';
}

function getEntityName(entity) {
  return `custom rule ${entity.name}`;
}

function getEntityType(entity) {
  return getSingular(entity.entityType);
}

function getMetric(entity) {
  if (!entity.metricName) {
    return null;
  }
  const entityType = entity.entityType;
  const metric = entity.metricName;
  return findMetricName(metric, getCategories(entityType)) || metric;
}
