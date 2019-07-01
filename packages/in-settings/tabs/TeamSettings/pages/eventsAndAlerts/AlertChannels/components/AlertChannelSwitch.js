import React from 'react';

import configs from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { Row, Col } from 'in-components/Grid/Grid';
import Button from 'in-components/Button';

import locals from './AlertChannelSwitch.mless';

export default function AlertChannelSwitch({ onClick, selectedType }) {
  return (
    <div className={locals.switch}>
      <Row>
        <AlertChannelButton type="email" selectedType={selectedType} onClick={onClick} />
        <AlertChannelButton type="slack" selectedType={selectedType} onClick={onClick} />
        <AlertChannelButton type="opsgenie" selectedType={selectedType} onClick={onClick} />
      </Row>
      <Row>
        <AlertChannelButton type="pagerduty" selectedType={selectedType} onClick={onClick} />
        <AlertChannelButton type="office365" selectedType={selectedType} onClick={onClick} />
        <AlertChannelButton type="webhook" selectedType={selectedType} onClick={onClick} />
      </Row>
      <Row>
        <AlertChannelButton type="splunk" selectedType={selectedType} onClick={onClick} />
        <AlertChannelButton type="googleChat" selectedType={selectedType} onClick={onClick} />
        <AlertChannelButton type="victorOps" selectedType={selectedType} onClick={onClick} />
      </Row>
    </div>
  );
}

function AlertChannelButton({ type, selectedType, onClick }) {
  return (
    <Col cols={4}>
      <Button className={locals.button} disabled={selectedType === type} kind="info" onClick={() => onClick(type)}>
        {configs[type].label}
      </Button>
    </Col>
  );
}
