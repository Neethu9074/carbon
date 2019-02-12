import { combineLatest, just } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingEventFilterNew,
  teamSettingsAlertingEventFilters
} from 'in-settings/navigation/paths';
import { deleteAlertingConfig, getAlertingConfigsMutable, setEnabled } from 'in-api/alertingConfiguration';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import List from 'in-settings/components/List';
import { validate } from 'in-api/search';
import Badge from 'in-components/Badge';
import config from 'in-services/config';
import Link from 'in-components/Link';

import locals from './EventFilters.mless';

const maxNumOfAlertingEventFilters = get(config, ['configuration', 'maxAllowedAlertingConfigurations'], 50);

export default function EventFilters() {
  return (
    <List
      title="Event Filters"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={() => getAlertingConfigsMutable().flatMap(configs => combineLatest(configs.map(validateConfig)))}
      initialOrderBy="alertName"
      labelNew="New Event Filter"
      pathNew={teamSettingsAlertingEventFilterNew}
      newButtonDisabledTooltipMessage={entities =>
        entities && entities.length >= maxNumOfAlertingEventFilters
          ? `The number of event filters is restricted to ${maxNumOfAlertingEventFilters}.`
          : null
      }
      searchAttributes={['alertName']}
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
        <div className={locals.nameWithTextBelow}>
          <Link href$={getEntityIdView(teamSettingsAlertingEventFilters, entity.id)} className={locals.shorten}>
            {entity.alertName} {!entity.valid && <Badge size="sm">Deprecated Dynamic Focus Query</Badge>}
          </Link>
          {!isEnabled(entity) && <span className={locals.textBelowName}>disabled</span>}
        </div>
      );
    }
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
  return totalHits ? `Event Filters (${totalHits})` : 'Event Filters';
}

function getEntityName(entity) {
  return `event filter "${entity.alertName}"`;
}

function validateConfig(config) {
  if (twoZeroModeEnabled && config.eventFilteringConfiguration && config.eventFilteringConfiguration.query) {
    return validate({
      query: config.eventFilteringConfiguration.query,
      newApplicationModelEnabled: true
    }).map(response => {
      config.valid = response.body.valid;
      return config;
    });
  } else {
    config.valid = true;
    return just(config);
  }
}
