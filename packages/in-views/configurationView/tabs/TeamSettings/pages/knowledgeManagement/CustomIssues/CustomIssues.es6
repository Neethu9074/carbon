import { get } from 'lodash';
import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsKnowledgeManagementCustomIssues,
  teamSettingsKnowledgeManagementCustomIssueNew
} from 'in-views/configurationView/navigation/paths';
import { getRuleBindingsMutable, deleteRuleBinding, setEnabled } from 'in-api/ruleBindings';
import { getRuleMutable, isRuleDeprecatedMutable } from 'in-api/rules';
import List from 'in-views/configurationView/components/List';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { combineLatest, just } from 'reactive-observables';
import { toTitleCase } from 'in-services/util/string';
import { validate } from 'in-api/search';
import Badge from 'in-components/Badge';
import Link from 'in-components/Link';

import locals from './CustomIssues.mless';

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
    getContent(entity) {
      return (
        <div className={locals.nameWithTextBelow}>
          <Link href$={getEntityIdView(teamSettingsKnowledgeManagementCustomIssues, entity.id)}>
            {entity.text} {entity.badgeMessage && <Badge size="sm">{entity.badgeMessage}</Badge>}
          </Link>
          {!entity.enabled && <span className={locals.textBelowName}>disabled</span>}
        </div>
      );
    }
  },
  {
    id: 'severity',
    label: 'Severity',
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
  return getRuleBindingsMutable()
    .flatMap(customIssues => {
      return combineLatest(customIssues.map(customIssue => checkRuleDeprecation(customIssue)));
    })
    .flatMap(customIssues => {
      return combineLatest(customIssues.map(customIssue => validateDfq(customIssue)));
    });
}

function checkRuleDeprecation(customIssue) {
  return getRuleMutable(get(customIssue, ['ruleIds', 0], ''), false)
    .map(rule => getRuleDeprecationBadgeText(isRuleDeprecatedMutable(rule)))
    .map(deprecationText => extendBadgeMessage(customIssue, deprecationText));
}

function getRuleDeprecationBadgeText(ruleDeprecatedFlag) {
  if (twoZeroModeEnabled && ruleDeprecatedFlag) {
    return 'Rule is deprecated';
  } else {
    return '';
  }
}

function getDfqValidationBadgeText(dfqValidFlag) {
  if (twoZeroModeEnabled && !dfqValidFlag) {
    return 'Dynamic Focus query is deprecated';
  } else {
    return '';
  }
}

function validateDfq(customIssue) {
  if (twoZeroModeEnabled && customIssue.query) {
    return validate({
      query: customIssue.query,
      newApplicationModelEnabled: true
    }).map(response => extendBadgeMessage(customIssue, getDfqValidationBadgeText(response.body.valid)));
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
