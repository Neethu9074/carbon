import React from 'react';

import MaintenanceConfigurationsDetails from 'in-views/configurationView/subview/MaintenanceConfigurations/components/MaintenanceConfigurationsDetails';
import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import { maintenanceConfigurationPath, getEntityIdPath } from 'in-stores/navigation/paths/settingPaths';
import { getMaintenanceConfigs, deleteMaintenanceConfig } from 'in-api/maintenanceConfiguration';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';
import { goToPath } from 'in-stores/navigation';

export default function MaintenanceConfigurations() {
  const cols = [
    getLinkColumn(getEntityIdPath.bind(null, maintenanceConfigurationPath), 'name'),
    {
      title: 'Status',
      type: 'string',
      width: 100,
      typeArgs: {
        getValue(row) {
          const status = row.entity.get('status');
          return status.toLowerCase();
        }
      }
    },
    getDeleteButtonColumn()
  ];

  return (
    <BasicEntitiesOverview
      title="Maintenance Windows"
      getEntities={getMaintenanceConfigs}
      deleteEntity={deleteMaintenanceConfig}
      openEntityConfiguration={() => goToPath(maintenanceConfigurationPath)}
      cols={cols}
      getRowDetails={getRowDetails}
      maxItemsPerPage={20}
    />
  );
}

function getRowDetails(row) {
  return <MaintenanceConfigurationsDetails config={row.entity} />;
}
