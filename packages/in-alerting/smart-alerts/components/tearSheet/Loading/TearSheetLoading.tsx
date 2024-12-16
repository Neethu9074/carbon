/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { LoadingSkeleton, Spacer } from '@instana/components';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { Row, Col } from 'in-components/layout/Grid';

import locals from './TearSheetLoading.mless';

export default function TearSheetLoading() {
  const sectionName = classNames({
    [locals.sectionName]: true
  });

  const headerClassName = classNames({
    [locals.header]: true
  });

  const titleClassName = classNames({
    [locals.title]: true
  });

  const sectionTitleClassName = classNames({
    [locals.sectionTitle]: true
  });

  const leftSectionClassName = classNames({
    [locals.leftSection]: true
  });

  return (
    <>
      <Spacer vertical="large" />
      <LeftRightPadding>
        <Row className={locals.firstRow}>
          <Col lg={12}>
            <LoadingSkeleton className={headerClassName} />
          </Col>
        </Row>

        <Row className={locals.firstRow}>
          <Col lg={4}>
            <LoadingSkeleton className={leftSectionClassName} />
          </Col>

          <Col lg={8}>
            <Row>
              <LoadingSkeleton className={sectionTitleClassName} />
            </Row>
            <Row>
              <LoadingSkeleton className={titleClassName} />
            </Row>
            <Row>
              <LoadingSkeleton className={sectionName} />
            </Row>
          </Col>
        </Row>
      </LeftRightPadding>
    </>
  );
}
