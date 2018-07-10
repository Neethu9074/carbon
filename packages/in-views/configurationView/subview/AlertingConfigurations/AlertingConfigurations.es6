import React from 'react';

import { getEnableToggleColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import AlertingConfigurationDetails from 'in-views/configurationView/subview/AlertingConfigurations/components/AlertingConfigurationDetails';
import { alertingConfigurationPath, getEntityIdPath } from 'in-stores/navigation/paths/settingPaths';
import { getAlertingConfigs, deleteAlertingConfig, setEnabled } from 'in-api/alertingConfiguration';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { compareIgnoreCase } from 'in-services/util/string';
import { combineLatest, just } from 'reactive-observables';
import { goToPath } from 'in-stores/navigation';
import { validate } from 'in-api/search';
import Link from 'in-components/Link';

export default function AlertingConfigurations() {
  const cols = [
    getLinkColumn(getEntityIdPath.bind(null, alertingConfigurationPath), 'alertName'),
    getEnableToggleColumn(entity => entity.get('muteUntil') === 0),
    getDeleteButtonColumn()
  ];

  const maxNumOfAlertingConfigurations = 50;

  return (
    <BasicEntitiesOverview
      title="Alerting Configurations"
      getEntities={() => getAlertingConfigs().flatMap(configs => combineLatest(configs.toArray().map(validateConfig)))}
      deleteEntity={deleteAlertingConfig}
      setEnabled={setEnabled}
      openEntityConfiguration={() => goToPath(alertingConfigurationPath)}
      getEnabledState={entity => entity.get('muteUntil') === 0}
      setEnabledState={(entity, enabled) => entity.set('muteUntil', enabled ? 0 : Number.MAX_SAFE_INTEGER)}
      getRowDetails={getRowDetails}
      getAddNewButtonDisabledMessage={rows =>
        rows.length >= maxNumOfAlertingConfigurations
          ? `Number of configurations is restricted to ${maxNumOfAlertingConfigurations}.`
          : null
      }
      cols={cols}
    />
  );
}

function validateConfig(config) {
  if (twoZeroModeEnabled && config.get('query')) {
    return validate(config.get('query'), true).map(response => config.set('valid', response.body.valid));
  } else {
    return just(config.set('valid', true));
  }
}

function getRowDetails(row) {
  return <AlertingConfigurationDetails config={row.entity} />;
}

function getLinkColumn(getLink, propertyName = 'name', linkParams) {
  return {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get$(row) {
        return getLink(row.key, linkParams).map(href => {
          return {
            value: row.entity.get(propertyName),
            content: (
              <Link href={href}>
                {row.entity.get(propertyName)} {row.entity.get('valid')}
              </Link>
            )
          };
        });
      }
    }
  };
}
