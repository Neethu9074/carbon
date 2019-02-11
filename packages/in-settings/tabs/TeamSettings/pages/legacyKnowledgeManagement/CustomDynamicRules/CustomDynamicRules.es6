import React, { Fragment } from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsKnowledgeManagementCustomDynamicRuleNew,
  teamSettingsKnowledgeManagementCustomDynamicRules
} from 'in-settings/navigation/paths';
import { findMetricName } from 'in-settings/tabs/TeamSettings/pages/legacyKnowledgeManagement/metricNameUtil';
import { getDynamicRulesMutable, deleteDynamicRule } from 'in-api/dynamicRules';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';
import List from 'in-settings/components/List';
import { getCategories } from 'in-sdk/metrics';
import Link from 'in-components/Link';

export default function CustomDynamicRules() {
  return (
    <List
      title="Custom Dynamic Rules"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getDynamicRulesMutable}
      initialOrderBy="name"
      labelNew="Create Custom Dynamic Rules"
      pathNew={teamSettingsKnowledgeManagementCustomDynamicRuleNew}
      searchAttributes={['name', getEntityType, getMetric]}
      getDetailsHref={entity => getEntityHref(teamSettingsKnowledgeManagementCustomDynamicRules, entity.id)}
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
        <Link href$={getEntityIdView(teamSettingsKnowledgeManagementCustomDynamicRules, entity.id)}>{entity.name}</Link>
      );
    }
  },
  {
    id: 'entityType',
    label: 'Entity Type',
    getContent(entity) {
      if (!entity.match || !entity.match.entityType) {
        return null;
      }
      const entityType = entity.match.entityType;
      return (
        <Fragment>
          <PluginIcon dimension={16} color="#000" plugin={entityType} />
          &nbsp;&nbsp;
          {getSingular(entityType)}
        </Fragment>
      );
    },
    getValue: getEntityType
  },
  {
    id: 'metric',
    label: 'Metric',
    getContent: getMetric,
    getValue: getMetric
  },
  {
    id: 'triggering',
    label: 'Triggering Events',
    getContent: isTriggering,
    getValue: isTriggering
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteDynamicRule(entity.id)
  }
};

function getHeader(totalHits) {
  return totalHits ? `Custom Dynamic Rules (${totalHits})` : 'Custom Dynamic Rules';
}

function getEntityName(entity) {
  return `custom dynamic rule ${entity.text}`;
}

function getEntityType(entity) {
  if (!entity.match || !entity.match.entityType) {
    return null;
  }
  return getSingular(entity.match.entityType);
}

function getMetric(entity) {
  if (!entity.match || !entity.match.metricName) {
    return null;
  }
  const entityType = entity.match.entityType;
  const metric = entity.match.metricName;
  return findMetricName(metric, getCategories(entityType)) || metric;
}

function isTriggering(entity) {
  if (!entity.event) {
    return null;
  }
  return entity.event.triggering ? 'Yes' : 'No';
}
