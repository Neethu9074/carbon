/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';

import locals from './KpiGridRow.mless';

export default function KpiGridRow({ children, sizes }) {
  return (
    <Row className={locals.row}>
      {React.Children.map(children, (child, i) => (
        <Col className={locals.col} lg={sizes[i]}>
          {child}
        </Col>
      ))}
    </Row>
  );
}
