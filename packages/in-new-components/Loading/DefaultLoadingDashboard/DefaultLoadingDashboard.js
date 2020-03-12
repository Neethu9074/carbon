import React from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { Row, Col } from 'in-new-components/layout/Grid';

import locals from './DefaultLoadingDashboard.mless';

export default function DefaultLoadingDashboard({ lightMode }) {
  return (
    <LeftRightPadding>
      <Row className={locals.firstRow}>
        <Col lg={4}>
          <Skeleton lightMode={lightMode} className={locals.skeletonKpi} />
        </Col>
        <Col lg={4}>
          <Skeleton lightMode={lightMode} className={locals.skeletonKpi} />
        </Col>
        <Col lg={4}>
          <Skeleton lightMode={lightMode} className={locals.skeletonKpi} />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Skeleton lightMode={lightMode} className={locals.skeletonChart} />
        </Col>
        <Col lg={6}>
          <Skeleton lightMode={lightMode} className={locals.skeletonChart} />
        </Col>
      </Row>
    </LeftRightPadding>
  );
}
