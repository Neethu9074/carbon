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
import { twoZeroModeEnabled, ruleDeprecationValidationChecksEnabled } from 'in-services/featureFlags';
import WithSubscript from 'in-settings/components/WithSubscript';
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
      title="Alerts"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={loadEntities}
      initialOrderBy="alertName"
      labelNew="New Alert"
      pathNew={teamSettingsAlertingEventFilterNew}
      newButtonDisabledTooltipMessage={entities =>
        entities && entities.length >= maxNumOfAlertingEventFilters
          ? `The number of alerts is restricted to ${maxNumOfAlertingEventFilters}.`
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
        <WithSubscript subscript={isEnabled(entity) ? null : 'disabled'}>
          <Link href$={getEntityIdView(teamSettingsAlertingEventFilters, entity.id)} className={locals.ellipsis50vw}>
            {entity.alertName} {!entity.valid && <Badge size="sm">Deprecated Dynamic Focus Query</Badge>}
          </Link>
        </WithSubscript>
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
  return totalHits ? `Alerts (${totalHits})` : 'Alerts';
}

function getEntityName(entity) {
  return `alert "${entity.alertName}"`;
}

function loadEntities() {
  const validationAction = ruleDeprecationValidationChecksEnabled ? validateConfig : assumeConfigIsValid;
  return getAlertingConfigsMutable().flatMap(configs => combineLatest(configs.map(validationAction)));
}

function validateConfig(alertEntity) {
  if (twoZeroModeEnabled && alertEntity.eventFilteringConfiguration && alertEntity.eventFilteringConfiguration.query) {
    return validate({
      query: alertEntity.eventFilteringConfiguration.query,
      newApplicationModelEnabled: true
    }).map(response => {
      alertEntity.valid = response.body.valid;
      return alertEntity;
    });
  } else {
    return assumeConfigIsValid(alertEntity);
  }
}

function assumeConfigIsValid(alertEntity) {
  alertEntity.valid = true;
  return just(alertEntity);
}
