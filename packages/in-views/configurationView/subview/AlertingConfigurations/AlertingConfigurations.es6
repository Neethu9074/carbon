import { fromJS } from 'immutable';
import React from 'react';

import {
  getEnableToggleColumn,
  getDeleteButtonColumn,
  getLinkColumnWithBadge
} from 'in-views/configurationView/components/tableColumnPresets';
import AlertingConfigurationDetails from 'in-views/configurationView/subview/AlertingConfigurations/components/AlertingConfigurationDetails';
import { alertingConfigurationPath, getEntityIdPath } from 'in-stores/navigation/paths/settingPaths';
import { getAlertingConfigs, deleteAlertingConfig, setEnabled } from 'in-api/alertingConfiguration';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { combineLatest, just } from 'reactive-observables';
import { goToPath } from 'in-stores/navigation';
import { validate } from 'in-api/search';

export default function AlertingConfigurations() {
  const cols = [
    getLinkColumnWithBadge(
      getEntityIdPath.bind(null, alertingConfigurationPath),
      entity => !entity.get('valid'),
      () => 'Deprecated Dynamic Focus query',
      'alertName'
    ),
    getEnableToggleColumn(entity => entity.get('muteUntil') === 0),
    getDeleteButtonColumn()
  ];

  const maxNumOfAlertingConfigurations = 50;

  return (
    <BasicEntitiesOverview
      title="Alerting Configurations"
      getEntities={() =>
        getAlertingConfigs()
          .flatMap(configs => combineLatest(configs.toArray().map(validateConfig)))
          .map(fromJS)
      }
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
  if (twoZeroModeEnabled && config.getIn(['eventFilteringConfiguration', 'query'])) {
    return validate({
      query: config.getIn(['eventFilteringConfiguration', 'query']),
      newApplicationModelEnabled: true
    }).map(response => config.set('valid', response.body.valid));
  } else {
    return just(config.set('valid', true));
  }
}

function getRowDetails(row) {
  return <AlertingConfigurationDetails config={row.entity} />;
}
