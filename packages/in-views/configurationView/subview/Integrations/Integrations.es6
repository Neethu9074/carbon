import React from 'react';

import {
  getLinkColumn,
  getKindColumn,
  getDeleteButtonColumn
} from 'in-views/configurationView/components/tableColumnPresets';
import IntegrationsDetails from 'in-views/configurationView/subview/Integrations/components/IntegrationsDetails';
import { goToIntegrationView, integrationPath, getEntityIdPath } from 'in-stores/navigation/paths/settingPaths';
import IntegrationSwitch from 'in-views/configurationView/subview/Integrations/components/IntegrationSwitch';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getIntegrations, deleteIntegration } from 'in-api/integrations';
import Dialog from 'in-components/Dialog';

export default function AlertingConfigurations() {
  const cols = [
    getLinkColumn(getEntityIdPath.bind(null, integrationPath), 'name'),
    getKindColumn(),
    getDeleteButtonColumn()
  ];

  return (
    <BasicEntitiesOverview
      title="Integrations"
      getEntities={getIntegrations}
      deleteEntity={deleteIntegration}
      openEntityConfiguration={() => setActiveDialog(<NewIntegrationDialog />)}
      cols={cols}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return <IntegrationsDetails integration={row.entity} />;
}

function NewIntegrationDialog() {
  return (
    <Dialog header="Choose Integration" onClose={() => setActiveDialog(null)}>
      <IntegrationSwitch
        onClick={type => {
          close();
          goToIntegrationView(type);
        }}
      />
    </Dialog>
  );
}
