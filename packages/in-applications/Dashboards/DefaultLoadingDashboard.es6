import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { Row, Col } from 'in-new-components/layout/Grid';
import Skeleton from 'in-components/Progress/Skeleton';

import locals from './DefaultLoadingDashboard.mless';

export default function DefaultLoadingDashboard() {
  return (
    <MaxWidthFullscreenContainer>
      <Row className={locals.firstRow}>
        <Col lg={4}>
          <Skeleton className={locals.skeletonKpi} />
        </Col>
        <Col lg={4}>
          <Skeleton className={locals.skeletonKpi} />
        </Col>
        <Col lg={4}>
          <Skeleton className={locals.skeletonKpi} />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Skeleton className={locals.skeletonChart} />
        </Col>
        <Col lg={6}>
          <Skeleton className={locals.skeletonChart} />
        </Col>
      </Row>
    </MaxWidthFullscreenContainer>
  );
}
