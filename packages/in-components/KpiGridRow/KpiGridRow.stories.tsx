/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';

export default {
  component: KpiGridRow
};

export function Default() {
  return (
    <>
      <h2>Single Row</h2>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
      </KpiGridRow>

      <h2>Multi Row</h2>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
      </KpiGridRow>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
        <KpiCard title="Foo" value="bar" borderless raw />
      </KpiGridRow>
    </>
  );
}
export function WithoutKpiGrid() {
  return (
    <Fragment>
      <Row>
        <Col>
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
        </Col>
        <Col>
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
          <KpiCard title="Foo" value="bar" borderless raw />
        </Col>
      </Row>
    </Fragment>
  );
}
