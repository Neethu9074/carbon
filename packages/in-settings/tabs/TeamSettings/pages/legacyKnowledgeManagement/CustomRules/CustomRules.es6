import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsKnowledgeManagementCustomRules,
  teamSettingsKnowledgeManagementCustomRuleNew
} from 'in-settings/navigation/paths';
import { findMetricName } from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/metricNameUtil';
import { deleteRule, getRulesMutable } from 'in-api/rules';
import WithIcon from 'in-new-components/WithIcon';
import { getSingular } from 'in-sdk/pluginName';
import { getCategories } from 'in-sdk/metrics';
import List from 'in-settings/components/List';
import Badge from 'in-components/Badge';
import Link from 'in-components/Link';

export default function CustomRules() {
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
    width: 40,
    getContent(entity) {
      return (
        <Link href$={getEntityIdView(teamSettingsKnowledgeManagementCustomRules, entity.id)} ellipsis>
          {entity.name} {entity.deprecated && <Badge size="sm">Deprecated Rule</Badge>}
        </Link>
      );
    }
  },
  {
    id: 'entityType',
    label: 'Entity Type',
    width: 30,
    getContent(entity) {
      return <WithIcon plugin={entity.entityType}>{getSingular(entity.entityType)}</WithIcon>;
    },
    getValue: getEntityType
  },
  {
    id: 'metric',
    label: 'Metric',
    width: 30,
    ellipsis: true,
    getContent: getMetric,
    getValue: getMetric
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteRule(entity.id)
  }
};

function getHeader(totalHits) {
  return totalHits ? `Custom Rules (${totalHits})` : 'Custom Rules';
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
