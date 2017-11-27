import React from 'react';

import configs from 'in-views/configurationView/subview/Integration/configs';
import { evaluateClassNames } from 'in-services/util/classnames';
import { Row, Col } from 'in-components/Grid/Grid';

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
    </div>
  );
}

function IntegrationButton({ type, selectedType, onClick }) {
  return (
    <Col cols={4}>
      <div
        className={evaluateClassNames({
          [`${block}__button`]: true,
          [`${block}__button--selected`]: selectedType === type
        })}
        onClick={() => onClick(type)}
      >
        {configs[type].label}
      </div>
    </Col>
  );
}
