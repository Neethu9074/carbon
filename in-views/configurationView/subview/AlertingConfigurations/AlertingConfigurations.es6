import React from 'react';

import AlertingConfigurationDetails from 'in-views/configurationView/subview/AlertingConfigurations/components/AlertingConfigurationDetails';
import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import { getAlertingConfigLink, openAlertingConfiguration } from 'in-stores/navigation/configuration';
import { getAlertingConfigs, deleteAlertingConfig } from 'in-services/api/alertingConfiguration';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';

export default function AlertingConfigurations() {
  const cols = [getLinkColumn(getAlertingConfigLink, 'alertName'), getDeleteButtonColumn()];

  return (
    <BasicEntitiesOverview
      title="Alerting Configurations"
      getEntities={getAlertingConfigs}
      deleteEntity={deleteAlertingConfig}
      openEntityConfiguration={openAlertingConfiguration}
      getRowDetails={getRowDetails}
      cols={cols}
    />
  );
}

function getRowDetails(row) {
  return <AlertingConfigurationDetails config={row.entity} />;
}
