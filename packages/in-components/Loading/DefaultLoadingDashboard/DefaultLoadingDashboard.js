/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { LoadingSkeleton } from '@instana/components';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { Row, Col } from 'in-components/layout/Grid';

import locals from './DefaultLoadingDashboard.mless';

export default function DefaultLoadingDashboard({ lightMode }) {
  const kpiClassName = classNames({
    [locals.skeletonKpi]: true,
    [locals.lightMode]: lightMode
  });

  const chartClassName = classNames({
    [locals.skeletonChart]: true,
    [locals.lightMode]: lightMode
  });

  return (
    <LeftRightPadding>
      <Row className={locals.firstRow}>
        <Col lg={4}>
          <LoadingSkeleton lightMode={lightMode} className={kpiClassName} />
        </Col>
        <Col lg={4}>
          <LoadingSkeleton lightMode={lightMode} className={kpiClassName} />
        </Col>
        <Col lg={4}>
          <LoadingSkeleton lightMode={lightMode} className={kpiClassName} />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <LoadingSkeleton lightMode={lightMode} className={chartClassName} />
        </Col>
        <Col lg={6}>
          <LoadingSkeleton lightMode={lightMode} className={chartClassName} />
        </Col>
      </Row>
    </LeftRightPadding>
  );
}
