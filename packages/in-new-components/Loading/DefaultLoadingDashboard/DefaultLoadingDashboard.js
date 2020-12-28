import classNames from 'classnames';
import React from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { Row, Col } from 'in-new-components/layout/Grid';

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
          <Skeleton lightMode={lightMode} className={kpiClassName} />
        </Col>
        <Col lg={4}>
          <Skeleton lightMode={lightMode} className={kpiClassName} />
        </Col>
        <Col lg={4}>
          <Skeleton lightMode={lightMode} className={kpiClassName} />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <Skeleton lightMode={lightMode} className={chartClassName} />
        </Col>
        <Col lg={6}>
          <Skeleton lightMode={lightMode} className={chartClassName} />
        </Col>
      </Row>
    </LeftRightPadding>
  );
}
