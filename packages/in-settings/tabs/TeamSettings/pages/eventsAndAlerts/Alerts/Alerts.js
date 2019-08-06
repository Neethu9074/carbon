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
import PropertyInTable from 'in-settings/tabs/TeamSettings/components/PropertyInTable';
import { toggleAlertTracker, openAlertSubmitFormTracker } from 'in-settings/tracker';
import WithSubscript from 'in-settings/components/WithSubscript';
import { intersperse } from 'in-services/arrayUtils';
import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import config from 'in-services/config';
import Link from 'in-components/Link';

import locals from './Alerts.mless';

const maxNumOfAlertingAlerts = get(config, ['configuration', 'maxAllowedAlertingConfigurations'], 50);

export default function Alerts() {
  return (
    <List
      title="Alerts"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={getAlertingConfigsMutable}
      initialOrderBy="alertName"
      labelNew="New Alert"
      pathNew={teamSettingsAlertingAlertNew}
      newButtonDisabledTooltipMessage={entities =>
        entities && entities.length >= maxNumOfAlertingAlerts
          ? `The number of alerts is restricted to ${maxNumOfAlertingAlerts}.`
          : null
      }
      searchAttributes={['alertName', renderTypesOrNumberOfEvents, scopeToString, concatChannelNames]}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingAlerts, entity.id)}
      trackEvent={openAlertSubmitFormTracker}
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
    label: 'Additional Scope',
    ellipsis: true,
    getContent: renderScope,
    getValue: scopeToString
  },
  {
    id: 'channels',
    label: 'Alert Channels',
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

function isEnabled(entity) {
  return entity.muteUntil == null || entity.muteUntil < Date.now();
}

function getHeader(totalHits) {
  return totalHits ? `Alerts (${totalHits})` : 'Alerts';
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
          !isEnabled(entity) ? <span key="disabled">Disabled</span> : null,
          typesOrNumberOfEvents ? <span key="events">{renderTypesOrNumberOfEvents(entity)}</span> : null,
          entity.invalid ? (
            <span key="invalid" className={locals.invalid}>
              Invalid Query
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
    return `All ${renderType(eventTypes[0])}`;
  }
  if (eventTypes.length >= 4) {
    return 'Various Event Types';
  } else {
    return eventTypes.map(renderType).join(', ');
  }
}

function renderType(t) {
  switch (t) {
    case 'incident':
      return 'Incidents';
    case 'critical':
      return 'Critical Events';
    case 'warning':
      return 'Warnings';
    case 'change':
      return 'Changes';
    case 'online':
      return 'Online Events';
    case 'offline':
      return 'Offline Events';
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
  const { applyOn, applicationName } = parseQuery(entity.eventFilteringConfiguration.query);
  if (applyOn === scopeDfq) {
    return (
      <Tooltip content={entity.eventFilteringConfiguration.query} delay={500}>
        <PropertyInTable label="Filter Query" value={entity.eventFilteringConfiguration.query} />
      </Tooltip>
    );
  } else if (applyOn === scopeApplication && applicationName) {
    return (
      <Tooltip content={applicationName} delay={500}>
        <PropertyInTable label="Application" value={applicationName} />
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
  const { applyOn, applicationName } = parseQuery(entity.eventFilteringConfiguration.query);
  if (applyOn === scopeDfq) {
    return entity.eventFilteringConfiguration.query;
  } else if (applyOn === scopeApplication && applicationName) {
    return applicationName;
  } else {
    return '';
  }
}

function concatChannelNames(entity) {
  return entity.alertChannelNames ? entity.alertChannelNames.join(', ') : '';
}
