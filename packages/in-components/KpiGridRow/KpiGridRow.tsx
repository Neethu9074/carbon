/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Row, Col } from 'in-components/layout/Grid';

// @ts-expect-error
import locals from './KpiGridRow.mless';

interface KpiGridRowProps {
  children: React.ReactNode;
  sizes: number[] | boolean[];
}

export default function KpiGridRow({ children, sizes }: KpiGridRowProps) {
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
