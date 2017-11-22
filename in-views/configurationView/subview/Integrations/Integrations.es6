import React from 'react';

import IntegrationsDetails from 'in-views/configurationView/subview/Integrations/components/IntegrationsDetails';
import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import BasicEntitiesOverview from 'in-views/configurationView/subview/BasicEntitiesOverview';
import { openIntegration, getIntegrationLink } from 'in-stores/navigation/configuration';
import { getIntegrations, deleteIntegration } from 'in-services/api/integrations';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { Row, Col } from 'in-components/Grid/Grid';
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
    <Dialog header="Supported Integrations" onClose={() => setActiveDialog(null)}>
      <div className={block}>
        <Row>
          <IntegrationButton type="email" />
          <IntegrationButton type="slack" />
          <IntegrationButton type="opsgenie" />
        </Row>
        <Row>
          <IntegrationButton type="pagerduty" />
          <IntegrationButton type="office365" />
          <IntegrationButton type="webhook" />
        </Row>
      </div>
    </Dialog>
  );
}

function IntegrationButton({ type }) {
  return (
    <Col cols={4}>
      <Button
        className={`${block}__button`}
        onClick={() => {
          close();
          openIntegration(type);
        }}
      >
        {type}
      </Button>
    </Col>
  );
}
