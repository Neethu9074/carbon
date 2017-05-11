import React from 'react';

import { Row, Col } from 'in-components/Grid/Grid';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

export default function Helpify({ children, helpText }) {
  return (
    <Row>
      <Col cols={11}>
        {children}
      </Col>
      <Col cols={1}>
        <Tooltip content={helpText} align="leftMiddle">
          <SvgIcon type="info" width={16} height={16} color="#2D4048" style={{ marginTop: '.25rem' }} />
        </Tooltip>
      </Col>
    </Row>
  );
}
