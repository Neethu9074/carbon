import { combineLatest, just } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import {
  getEntityHref,
  getEntityIdView,
  teamSettingsAlertingConfigurationNew,
  teamSettingsAlertingConfigurations
} from 'in-settings/navigation/paths';
import { deleteAlertingConfig, getAlertingConfigsMutable, setEnabled } from 'in-api/alertingConfiguration';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import List from 'in-settings/components/List';
import { validate } from 'in-api/search';
import Badge from 'in-components/Badge';
import config from 'in-services/config';
import Link from 'in-components/Link';

import locals from './Configurations.mless';

const maxNumOfAlertingConfigurations = get(config, ['configuration', 'maxAllowedAlertingConfigurations'], 50);

export default function Configurations() {
  return (
    <List
      title="Alerting Configurations"
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions}
      tableActions={tableActions}
      loadEntities={() => getAlertingConfigsMutable().flatMap(configs => combineLatest(configs.map(validateConfig)))}
      initialOrderBy="alertName"
      labelNew="New Configuration"
      pathNew={teamSettingsAlertingConfigurationNew}
      newButtonDisabledTooltipMessage={entities =>
        entities && entities.length >= maxNumOfAlertingConfigurations
          ? `The number of alerting configurations is restricted to ${maxNumOfAlertingConfigurations}.`
          : null
      }
      searchAttributes={['alertName']}
      getDetailsHref={entity => getEntityHref(teamSettingsAlertingConfigurations, entity.id)}
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
          <Link href$={getEntityIdView(teamSettingsAlertingConfigurations, entity.id)} className={locals.shorten}>
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
  return totalHits ? `Existing Configurations (${totalHits})` : 'Existing Configurations';
}

function getEntityName(entity) {
  return `alerting configuration "${entity.alertName}"`;
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
