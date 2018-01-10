import React from 'react';

import {
  getLinkColumn,
  getEnableToggleColumn,
  getDeleteButtonColumn
} from 'in-views/configurationView/components/tableColumnPresets';
import AlertingConfigurationDetails from 'in-views/configurationView/subview/AlertingConfigurations/components/AlertingConfigurationDetails';
import { alertingConfigurationPath, getEntityIdPath } from 'in-stores/navigation/paths/settingPaths';
import { getAlertingConfigs, deleteAlertingConfig, setEnabled } from 'in-api/alertingConfiguration';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';
import { goToPath } from 'in-stores/navigation';

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
      getEntities={getAlertingConfigs}
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

function getRowDetails(row) {
  return <AlertingConfigurationDetails config={row.entity} />;
}
