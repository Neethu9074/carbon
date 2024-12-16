/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Row, Col } from 'in-components/layout/Grid';

export default {
  title: 'Grid'
};

export function MixedGrid() {
  return (
    <div>
      <Row>
        <ExampleCol xs={12} />
      </Row>
      <Row>
        <ExampleCol xs={6} />
        <ExampleCol xs={6} />
      </Row>
      <Row>
        <ExampleCol xs={4} />
        <ExampleCol xs={4} />
        <ExampleCol xs={4} />
      </Row>
      <Row>
        <ExampleCol xs={3} />
        <ExampleCol xs={3} />
        <ExampleCol xs={3} />
        <ExampleCol xs={3} />
      </Row>
      <Row>
        <ExampleCol xs />
        <ExampleCol xs={6} />
        <ExampleCol xs />
      </Row>
      <Row>
        <ExampleCol xs={6} xsOffset={3} />
      </Row>
      <Row>
        <ExampleCol xs={1} />
        <ExampleCol xs={3} xsOffset={2} />
      </Row>
    </div>
  );
}

export function ResponsiveGrid() {
  return (
    <div>
      <Row>
        <ExampleCol lg={12} />
      </Row>
      <Row>
        <ExampleCol lg={6} />
        <ExampleCol lg={6} />
      </Row>
      <Row>
        <ExampleCol lg={4} />
        <ExampleCol lg={4} />
        <ExampleCol lg={4} />
      </Row>
      <Row>
        <ExampleCol lg={3} />
        <ExampleCol lg={3} />
        <ExampleCol lg={3} />
        <ExampleCol lg={3} />
      </Row>
      <Row>
        <ExampleCol lg />
        <ExampleCol lg={6} />
        <ExampleCol lg />
      </Row>
      <Row>
        <ExampleCol lg={6} lgOffset={3} />
      </Row>
      <Row>
        <ExampleCol lg={1} />
        <ExampleCol lg={3} lgOffset={2} />
      </Row>
    </div>
  );
}

function ExampleCol(props) {
  const { lg, lgOffset, xs, xsOffset } = props;
  const label = Object.keys(props)
    .filter(k => props[k] != null)
    .sort()
    .map(k => `${k}=${props[k]}`)
    .join(' ');
  return (
    <Col lg={lg} lgOffset={lgOffset} xs={xs} xsOffset={xsOffset}>
      <div
        style={{
          background: '#a8ecff',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '10px'
        }}
      >
        {label}
      </div>
    </Col>
  );
}
