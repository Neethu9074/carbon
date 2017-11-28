import React from 'react';

import {
  getLinkColumn,
  getEnableToggleColumn,
  getDeleteButtonColumn
} from 'in-views/configurationView/components/tableColumnPresets';
import AlertingConfigurationDetails from 'in-views/configurationView/subview/AlertingConfigurations/components/AlertingConfigurationDetails';
import { getAlertingConfigs, deleteAlertingConfig, setEnabled } from 'in-services/api/alertingConfiguration';
import { getAlertingConfigLink, openAlertingConfiguration } from 'in-stores/navigation/configuration';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';

export default function AlertingConfigurations() {
  const cols = [
    getLinkColumn(getAlertingConfigLink, 'alertName'),
    getEnableToggleColumn(entity => entity.get('muteUntil') === 0),
    getDeleteButtonColumn()
  ];

  // will be reduced to 10 after test phase
  const maxNumOfAlertingConfigurations = 100000;

  return (
    <BasicEntitiesOverview
      title="Alerting Configurations"
      getEntities={getAlertingConfigs}
      deleteEntity={deleteAlertingConfig}
      setEnabled={setEnabled}
      openEntityConfiguration={openAlertingConfiguration}
      getEnabledState={entity => entity.get('muteUntil') === 0}
      setEnabledState={(entity, enabled) => entity.set('muteUntil', enabled ? 0 : Number.MAX_SAFE_INTEGER)}
      getRowDetails={getRowDetails}
      getAddNewButtonDisabledMessage={rows =>
        rows.length >= maxNumOfAlertingConfigurations
          ? `Number of configurations is restricted to ${maxNumOfAlertingConfigurations}.`
          : null}
      cols={cols}
    />
  );
}

function getRowDetails(row) {
  return <AlertingConfigurationDetails config={row.entity} />;
}
