import React from 'react';

import { Row, Col } from 'in-components/Grid/Grid';

import './IntegrationSwitch.less';

const block = 'in-integrations-config-switch';

export default function IntegrationSwitch({ onClick }) {
  return (
    <div className={block}>
      <Row>
        <IntegrationButton type="email" onClick={onClick} />
        <IntegrationButton type="slack" onClick={onClick} />
        <IntegrationButton type="opsgenie" onClick={onClick} />
      </Row>
      <Row>
        <IntegrationButton type="pagerduty" onClick={onClick} />
        <IntegrationButton type="office365" onClick={onClick} />
        <IntegrationButton type="webhook" onClick={onClick} />
      </Row>
    </div>
  );
}

function IntegrationButton({ type, onClick }) {
  return (
    <Col cols={4}>
      <div className={`${block}__button`} onClick={() => onClick(type)}>
        {type}
      </div>
    </Col>
  );
}
