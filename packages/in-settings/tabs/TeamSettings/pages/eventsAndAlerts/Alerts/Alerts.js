/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState } from 'recompose';
import { Link } from '@instana/components';
import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingAlertNew,
  teamSettingsAlertingAlerts
} from 'in-settings/navigation/paths';
import { parseQuery, scopeApplication, scopeDfq } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { deleteAlertingConfig, getAlertingConfigsMutable, setEnabled } from 'in-api/alertingConfiguration';
import List, { createNewEntityButton, defaultHeaderWithCount } from 'in-settings/components/List';
import PropertyInTable from 'in-settings/tabs/TeamSettings/components/PropertyInTable';
import { toggleAlertTracker, openAlertSubmitFormTracker } from 'in-settings/tracker';
import WithSubscript from 'in-settings/components/WithSubscript';
import { intersperse } from 'in-services/arrayUtils';
import ComboBox from 'in-components/ComboBox';
import Tooltip from 'in-components/Tooltip';
import config from 'in-services/config';
import { t } from 'in-i18n';

import locals from './Alerts.mless';

const maxNumOfAlertingAlerts = get(config, ['configuration', 'maxAllowedAlertingConfigurations'], 200);

const enabledOptions = Object.freeze([
  { value: true, label: t('in-settings:tabs.enabled') },
  { value: false, label: t('in-settings:tabs.disabled') }
]);

export default compose(withState('enabled', 'setEnabled', null))(Alerts);

function Alerts({ enabled, setEnabled }) {
  return (
    <List
      title={t('in-settings:tabs.alerts')}
      getHeader={defaultHeaderWithCount('Alerts')}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getAlertingConfigsMutable}
      initialOrderBy="alertName"
      newButtonDisabledTooltipMessage={entities =>
        entities && entities.length >= maxNumOfAlertingAlerts
          ? t('in-settings:tabs.theNumberOfAlertsIsRestrictedToMaxNumOfAlertingAlerts', {
              maxNumOfAlertingAlerts: maxNumOfAlertingAlerts
            })
          : null
      }
      rightHeader={defaultRightHeader(enabled, setEnabled)}
      searchAttributes={['alertName', renderTypesOrNumberOfEvents, scopeToString, concatChannelNames]}
      extraFilters={createFilters(enabled)}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingAlerts, entity.id)}
      trackEvent={openAlertSubmitFormTracker}
      noDataMessage={t('in-settings:tabs.noAlertConfigured')}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-settings:tabs.name'),
    width: 40,
    getContent(entity) {
      return (
        <Tooltip content={entity.alertName} align="topLeft" delay={500}>
          <WithSubscript subscript={getSubscript(entity)}>
            <Link href$={getEntityIdView(teamSettingsAlertingAlerts, entity.id)} ellipsis>
              {entity.alertName}
            </Link>
          </WithSubscript>
        </Tooltip>
      );
    }
  },
  {
    id: 'scope',
    label: t('in-settings:tabs.additionalScope'),
    ellipsis: true,
    getContent: renderScope,
    getValue: scopeToString
  },
  {
    id: 'channels',
    label: t('in-settings:tabs.alertChannels'),
    ellipsis: true,
    getContent(entity) {
      const allChannels = concatChannelNames(entity);
      return (
        <Tooltip content={allChannels} delay={500}>
          <span>{allChannels}</span>
        </Tooltip>
      );
    },
    getValue: concatChannelNames
  }
];

const tableActions = {
  delete: {
    deleteEntity: entity => deleteAlertingConfig(entity.id)
  },
  toggleEnabled: {
    get: isEnabled,
    toggle: entity => {
      toggleAlertTracker({
        alertName: entity.alertName,
        alertChannelNames: entity.alertChannelNames,
        numOfSelectedEvents: entity.eventFilteringConfiguration.ruleIds
          ? entity.eventFilteringConfiguration.ruleIds.length
          : 0
      });
      return setEnabled(entity, !isEnabled(entity));
    }
  }
};

function defaultRightHeader(enabled, setEnabled) {
  return (
    <Fragment>
      {createNewEntityButton({
        labelNew: t('in-settings:tabs.newAlert'),
        pathNew: teamSettingsAlertingAlertNew,
        trackEvent: openAlertSubmitFormTracker
      })}
      <ComboBox
        name="filter-state"
        value={enabled}
        options={enabledOptions}
        onChange={e => (e ? setEnabled(e.value) : setEnabled(null))}
        placeholder={t('in-settings:tabs.state')}
        className={locals.stateDropdown}
      />
    </Fragment>
  );
}

function createFilters(enabled) {
  const filters = [];
  if (enabled != null) {
    if (enabled) {
      filters.push(entity => entity.muteUntil == null || entity.muteUntil < Date.now());
    } else {
      filters.push(entity => entity.muteUntil > Date.now());
    }
  }
  return filters;
}

function isEnabled(entity) {
  return entity.muteUntil == null || entity.muteUntil < Date.now();
}

function getEntityName(entity) {
  return `alert "${entity.alertName}"`;
}

function getSubscript(entity) {
  const typesOrNumberOfEvents = renderTypesOrNumberOfEvents(entity);
  return (
    <Fragment>
      {intersperse(
        [
          !isEnabled(entity) ? <span key="disabled">{t('in-settings:tabs.disabled')}</span> : null,
          typesOrNumberOfEvents ? <span key="events">{renderTypesOrNumberOfEvents(entity)}</span> : null,
          entity.invalid ? (
            <span key="invalid" className={locals.invalid}>
              {t('in-settings:tabs.invalidQuery')}
            </span>
          ) : null
        ].filter(elem => elem),
        i => (
          <span key={`comma-${i}`}>, </span>
        )
      )}
    </Fragment>
  );
}

function renderTypesOrNumberOfEvents(entity) {
  if (
    entity.eventFilteringConfiguration &&
    entity.eventFilteringConfiguration.eventTypes &&
    entity.eventFilteringConfiguration.eventTypes.length > 0
  ) {
    return renderTypes(entity.eventFilteringConfiguration.eventTypes);
  } else if (
    entity.eventFilteringConfiguration &&
    entity.eventFilteringConfiguration.ruleIds &&
    entity.eventFilteringConfiguration.ruleIds.length > 0
  ) {
    return renderNumberOfSelectedEvents(entity.eventFilteringConfiguration.ruleIds);
  }
  return '';
}

function renderTypes(eventTypes) {
  if (eventTypes.length === 1 && eventTypes[0]) {
    return t('in-settings:tabs.allEventType', { eventType: renderType(eventTypes[0]) });
  }
  if (eventTypes.length >= 4) {
    return t('in-settings:tabs.variousEventTypes');
  } else {
    return eventTypes.map(renderType).join(', ');
  }
}

function renderType(type) {
  switch (type) {
    case 'incident':
      return t('in-settings:tabs.incidents');
    case 'critical':
      return t('in-settings:tabs.criticalEvents');
    case 'warning':
      return t('in-settings:tabs.warnings');
    case 'change':
      return t('in-settings:tabs.changes');
    case 'online':
      return t('in-settings:tabs.onlineEvents');
    case 'offline':
      return t('in-settings:tabs.offlineEvents');
    case 'agent_monitoring_issue':
      return t('in-settings:tabs.monitoringIssues');
    default:
      return '?';
  }
}

function renderNumberOfSelectedEvents(eventIds) {
  return eventIds.length === 1 ? 'One Selected Event' : `Selected Events (${eventIds.length})`;
}

function renderScope(entity) {
  if (!entity.eventFilteringConfiguration || !entity.eventFilteringConfiguration.query) {
    return '';
  }
  const { applyOn } = parseQuery(entity.eventFilteringConfiguration.query);
  if (applyOn === scopeDfq) {
    return (
      <Tooltip content={entity.eventFilteringConfiguration.query} delay={500}>
        <PropertyInTable label={t('in-settings:tabs.filterQuery')} value={entity.eventFilteringConfiguration.query} />
      </Tooltip>
    );
  } else if (applyOn === scopeApplication) {
    const applications = concatApplicationNames(entity);
    return (
      <Tooltip content={applications} delay={500}>
        <PropertyInTable label={getApplicationLabel(entity)} value={applications} />
      </Tooltip>
    );
  } else {
    return '';
  }
}

function scopeToString(entity) {
  if (!entity.eventFilteringConfiguration || !entity.eventFilteringConfiguration.query) {
    return '';
  }
  const { applyOn } = parseQuery(entity.eventFilteringConfiguration.query);
  if (applyOn === scopeDfq) {
    return entity.eventFilteringConfiguration.query;
  } else if (applyOn === scopeApplication) {
    return entity.eventFilteringConfiguration.query;
  } else {
    return '';
  }
}

function getApplicationLabel(entity) {
  return entity.applicationNames.length === 1 ? 'APPLICATION' : `APPLICATIONS (${entity.applicationNames.length})`;
}

function concatChannelNames(entity) {
  return entity.alertChannelNames ? entity.alertChannelNames.join(', ') : '';
}

function concatApplicationNames(entity) {
  return entity.applicationNames ? entity.applicationNames.join(', ') : '';
}
