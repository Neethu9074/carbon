import React from 'react';

import IntegrationsDetails from 'in-views/configurationView/subview/Integrations/components/IntegrationsDetails';
import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';
import { openIntegration, getIntegrationLink } from 'in-stores/navigation/configuration';
import { getIntegrations, deleteIntegration } from 'in-services/api/integrations';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog';
import Button from 'in-components/Button';

import './Integrations.less';

const block = 'in-integrations-config-dialog';

export default function AlertingConfigurations() {
  const cols = [getLinkColumn(getIntegrationLink, 'name'), getDeleteButtonColumn()];

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
    <Dialog header="About" onClose={() => setActiveDialog(null)}>
      <div className={block}>
        <IntegrationButton type="email" />
        <IntegrationButton type="office365" />
      </div>
    </Dialog>
  );
}

function IntegrationButton({ type }) {
  return (
    <Button
      onClick={() => {
        close();
        openIntegration(type);
      }}
    >
      {type}
    </Button>
  );
}
