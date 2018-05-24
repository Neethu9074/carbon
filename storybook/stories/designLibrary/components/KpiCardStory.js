import { storiesOf } from '@storybook/react';
import React from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/KpiCard', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <Row>
        <Col lg={4}>
          <KpiCard title="Calls" value="2,359" />
        </Col>
        <Col lg={4}>
          <KpiCard title="Latency" value="7.6ms" />
        </Col>
        <Col lg={4}>
          <KpiCard title="Error Rate" value="2.0%" />
        </Col>
      </Row>
    </Root>
  );
}
