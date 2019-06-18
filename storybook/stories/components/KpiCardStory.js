import { storiesOf } from '@storybook/react';
import React from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard';
import Section from '../_helpers/Section';
import Root from '../_helpers/Root';
import theme from 'in-themes';

storiesOf('Components/Kpi Card', module)
  .add('default', () => <Default />)
  .add('With color', () => <WithColor />);

function Default() {
  return (
    <Root>
      <Section title={'Default'}>
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
      </Section>
    </Root>
  );
}

function WithColor() {
  return (
    <Root>
      <Section title={'With Color'}>
        <Row>
          <Col lg={4}>
            <KpiCard title="Error Logs" value="3" color={theme.lib.colors.failure} />
          </Col>
          <Col lg={4}>
            <KpiCard title="Warn Logs" value="2" color={theme.lib.colors.warning} />
          </Col>
        </Row>
      </Section>
    </Root>
  );
}
