import React, { Fragment } from 'react';

import DatabaseStatementTopList from './DatabaseStatementTopList';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { Row, Col } from 'in-new-components/layout/Grid';
import { millis } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';
import Card from 'in-new-components/Card';

export default function DatabaseSections(props) {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <Card key={0} title="Reads versus Writes">
            <Chart
              timeframe={props.timeframe}
              y1={{
                renderer: Renderer.stackedArea,
                labels: ['Reads', 'Writes'],
                formatter: millis,
                metrics: [generateMetrics(props.timeframe), generateMetrics(props.timeframe)]
              }}
            />
          </Card>
        </Col>
        <Col lg={6}>
          <DatabaseStatementTopList key={1} {...props} />
        </Col>
      </Row>
    </Fragment>
  );
}

function generateMetrics(timeframe, maxValue = 100, numMetrics) {
  const metrics = [];
  numMetrics = numMetrics || timeframe.windowSize / 5000;
  for (let i = numMetrics; i >= 0; i--) {
    metrics[i] = [timeframe.to - i * (timeframe.windowSize / numMetrics), ((Math.random() * maxValue * 100) | 0) / 100];
  }
  metrics.sort((a, b) => compare(a[0], b[0]));
  return metrics;
}
