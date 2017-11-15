import React from 'react';

// import IntegrationsDetails from 'in-views/configurationView/subview/Integrations/components/IntegrationsDetails';
import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';
import { openIntegration, getIntegrationLink } from 'in-stores/navigation/configuration';
import { getIntegrations, deleteIntegration } from 'in-services/api/integrations';

export default function AlertingConfigurations() {
  const cols = [getLinkColumn(getIntegrationLink, 'kind'), getDeleteButtonColumn()];

  return (
    <BasicEntitiesOverview
      title="Integrations"
      getEntities={getIntegrations}
      deleteEntity={deleteIntegration}
      openEntityConfiguration={openIntegration}
      cols={cols}
    />
  );
}

// function getRowDetails(row) {
//   return <IntegrationsDetails config={row.entity} />;
// }
