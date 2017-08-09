import React from 'react';

import { Row, Col } from 'in-components/Grid';

import './Kpis.less';

const block = 'in-dash-sum-kpis';

export default function Kpis({ children }) {
  return (
    <Row className={block}>
      {React.Children.map(children, (child, i) => <Col cols={2} key={i}>{child}</Col>)}
    </Row>
  );
}
