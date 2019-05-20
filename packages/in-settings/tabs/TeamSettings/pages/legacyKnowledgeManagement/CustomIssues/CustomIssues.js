import { get } from 'lodash';
import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsKnowledgeManagementCustomIssues,
  teamSettingsKnowledgeManagementCustomIssueNew
} from 'in-settings/navigation/paths';
import { getRuleBindingsMutable, deleteRuleBinding, setEnabled } from 'in-api/ruleBindings';
import { ruleDeprecationValidationChecksEnabled } from 'in-services/featureFlags';
import { getRuleMutable, isRuleDeprecatedMutable } from 'in-api/rules';
import WithSubscript from 'in-settings/components/WithSubscript';
import { combineLatest, just } from 'reactive-observables';
import { toTitleCase } from 'in-services/util/string';
import List from 'in-settings/components/List';
import { validate } from 'in-api/search';
import Badge from 'in-components/Badge';
import Link from 'in-components/Link';

export default function CustomIssues() {
  return (
    <List
      title="Custom Issues"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getCustomIssuesWithDeprecationWarnings}
      initialOrderBy="text"
      labelNew="Create Custom Issue"
      pathNew={teamSettingsKnowledgeManagementCustomIssueNew}
      searchAttributes={['text', getSeverityLabel]}
      getDetailsHref={entity => getEntityHref(teamSettingsKnowledgeManagementCustomIssues, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'text',
    label: 'Name',
    width: 70,
    getContent(entity) {
      return (
        <WithSubscript subscript={entity.enabled ? null : 'disabled'}>
          <Link href$={getEntityIdView(teamSettingsKnowledgeManagementCustomIssues, entity.id)} ellipsis>
            {entity.text} {entity.badgeMessage && <Badge size="sm">{entity.badgeMessage}</Badge>}
          </Link>
        </WithSubscript>
      );
    }
  },
  {
    id: 'severity',
    label: 'Severity',
    width: 30,
    ellipsis: true,
    getContent(entity) {
      return toTitleCase(getSeverityLabel(entity));
    },
    getValue: getSeverityLabel
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteRuleBinding(entity.id)
  },
  toggleEnabled: {
    key: 'enabled',
    toggle: entity => {
      return setEnabled(entity, !entity.enabled);
    }
  }
};

function getHeader(totalHits) {
  return totalHits ? `Custom Issues (${totalHits})` : 'Custom Issues';
}

function getEntityName(entity) {
  return `custom issue ${entity.text}`;
}

function getSeverityLabel(entity) {
  return mapSeverityToLabel(entity.severity);
}

function mapSeverityToLabel(severity) {
  if (severity === 0) {
    return 'change';
  } else if (severity === 5) {
    return 'warning';
  } else {
    return 'critical';
  }
}

function getCustomIssuesWithDeprecationWarnings() {
  if (ruleDeprecationValidationChecksEnabled) {
    return getRuleBindingsMutable()
      .flatMap(customIssues => {
        return combineLatest(customIssues.map(customIssue => checkRuleDeprecation(customIssue)));
      })
      .flatMap(customIssues => {
        return combineLatest(customIssues.map(customIssue => validateDfq(customIssue)));
      });
  } else {
    return getRuleBindingsMutable();
  }
}

function checkRuleDeprecation(customIssue) {
  return getRuleMutable(get(customIssue, ['ruleIds', 0], ''), false)
    .map(rule => getRuleDeprecationBadgeText(isRuleDeprecatedMutable(rule)))
    .map(deprecationText => extendBadgeMessage(customIssue, deprecationText));
}

function getRuleDeprecationBadgeText(ruleDeprecatedFlag) {
  if (ruleDeprecatedFlag) {
    return 'Rule is deprecated';
  } else {
    return '';
  }
}

function getDfqValidationBadgeText(dfqValidFlag) {
  if (!dfqValidFlag) {
    return 'Dynamic Focus query is deprecated';
  } else {
    return '';
  }
}

function validateDfq(customIssue) {
  if (customIssue.query) {
    return validate(customIssue.query).map(response =>
      extendBadgeMessage(customIssue, getDfqValidationBadgeText(response.body.valid))
    );
  } else {
    return just(customIssue);
  }
}

function extendBadgeMessage(customIssue, text) {
  if (!text) {
    return customIssue;
  }
  if (!customIssue.badgeMessage) {
    customIssue.badgeMessage = text;
    return customIssue;
  }
  customIssue.badgeMessage = customIssue.badgeMessage + ', ' + text;
  return customIssue;
}
