import React from 'react';

import {Row, Col} from 'in-components/Grid';

import './TabHeader.less';

const block = 'in-trace-tab-header';

export default function TabHeader({left, right}) {
  return (
    <Row className={block}>
      <Col cols={right ? 6 : 12}
           className={block + '__title'}>
        {left}
      </Col>
      {right ?
        <Col cols={6}
             className={block + '__controls'}>
          {right}
        </Col>
      : null}
    </Row>
  );
}
