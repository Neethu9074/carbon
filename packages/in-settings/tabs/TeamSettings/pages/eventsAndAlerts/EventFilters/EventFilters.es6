import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingEventFilterNew,
  teamSettingsAlertingEventFilters
} from 'in-settings/navigation/paths';
import { parseQuery, scopeApplication, scopeDfq } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { deleteAlertingConfig, getAlertingConfigsMutable, setEnabled } from 'in-api/alertingConfiguration';
import PropertyInTable from 'in-settings/tabs/TeamSettings/components/PropertyInTable';
import WithSubscript from 'in-settings/components/WithSubscript';
import { intersperse } from 'in-services/arrayUtils';
import List from 'in-settings/components/List';
import config from 'in-services/config';
import Link from 'in-components/Link';

import locals from './EventFilters.mless';

const maxNumOfAlertingEventFilters = get(config, ['configuration', 'maxAllowedAlertingConfigurations'], 50);

export default function EventFilters() {
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
      pathNew={teamSettingsAlertingEventFilterNew}
      newButtonDisabledTooltipMessage={entities =>
        entities && entities.length >= maxNumOfAlertingEventFilters
          ? `The number of alerts is restricted to ${maxNumOfAlertingEventFilters}.`
          : null
      }
      searchAttributes={['alertName', renderTypesOrNumberOfEvents, scopeToString, concatChannelNames]}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingEventFilters, entity.id)}
    />
  );
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(entity) {
      return (
        <WithSubscript subscript={getSubscript(entity)}>
          <Link href$={getEntityIdView(teamSettingsAlertingEventFilters, entity.id)} className={locals.ellipsis20vw}>
            {entity.alertName}
          </Link>
        </WithSubscript>
      );
    }
  },
  {
    id: 'scope',
    label: 'Additional Scope',
    ellipsis: '10vw',
    getContent: renderScope,
    getValue: scopeToString
  },
  {
    id: 'channels',
    label: 'Alert Channels',
    ellipsis: '15vw',
    getContent: concatChannelNames,
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
            <span key="invalid" className={locals.invalidOrDeprecated}>
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
    return <PropertyInTable label="Filter Query" value={entity.eventFilteringConfiguration.query} />;
  } else if (applyOn === scopeApplication && applicationName) {
    return <PropertyInTable label="Application" value={applicationName} />;
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
