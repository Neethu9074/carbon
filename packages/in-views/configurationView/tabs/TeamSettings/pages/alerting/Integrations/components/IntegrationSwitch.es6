import React from 'react';

import configs from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/configs';
import { Row, Col } from 'in-components/Grid/Grid';
import Button from 'in-components/Button';

import './IntegrationSwitch.less';

const block = 'in-integrations-config-switch';

export default function IntegrationSwitch({ onClick, selectedType }) {
  return (
    <div className={block}>
      <Row>
        <IntegrationButton type="email" selectedType={selectedType} onClick={onClick} />
        <IntegrationButton type="slack" selectedType={selectedType} onClick={onClick} />
        <IntegrationButton type="opsgenie" selectedType={selectedType} onClick={onClick} />
      </Row>
      <Row>
        <IntegrationButton type="pagerduty" selectedType={selectedType} onClick={onClick} />
        <IntegrationButton type="office365" selectedType={selectedType} onClick={onClick} />
        <IntegrationButton type="webhook" selectedType={selectedType} onClick={onClick} />
      </Row>
      <Row>
        <IntegrationButton type="splunk" selectedType={selectedType} onClick={onClick} />
        <IntegrationButton type="googleChat" selectedType={selectedType} onClick={onClick} />
      </Row>
    </div>
  );
}

function IntegrationButton({ type, selectedType, onClick }) {
  return (
    <Col cols={4}>
      <Button className={`${block}__button`} disabled={selectedType === type} kind="info" onClick={() => onClick(type)}>
        {configs[type].label}
      </Button>
    </Col>
  );
}
