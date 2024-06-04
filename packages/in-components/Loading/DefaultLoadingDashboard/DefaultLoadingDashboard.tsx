/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { LoadingSkeleton, Message } from '@instana/components';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { Row, Col } from 'in-components/layout/Grid';

import locals from './DefaultLoadingDashboard.mless';

type CustomLoadingMessage = {
  title: string;
  description?: string;
};

interface DefaultLoadingDashboardProps {
  customLoadingMessage?: CustomLoadingMessage;
  fullInlineWidth?: boolean;
}

export default function DefaultLoadingDashboard({
  customLoadingMessage,
  fullInlineWidth
}: DefaultLoadingDashboardProps) {
  const kpiClassName = classNames({
    [locals.skeletonKpi]: true
  });

  const chartClassName = classNames({
    [locals.skeletonChart]: true
  });

  return (
    <LeftRightPadding>
      {customLoadingMessage && (
        <Row className={locals.firstRow}>
          <Col lg={12}>
            <Message type="neutral" title={customLoadingMessage.title} bold fullInlineWidth={fullInlineWidth}>
              {customLoadingMessage.description && <span>{customLoadingMessage.description}</span>}
            </Message>
          </Col>
        </Row>
      )}

      <Row className={locals.firstRow}>
        <Col lg={4}>
          <LoadingSkeleton className={kpiClassName} />
        </Col>
        <Col lg={4}>
          <LoadingSkeleton className={kpiClassName} />
        </Col>
        <Col lg={4}>
          <LoadingSkeleton className={kpiClassName} />
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          <LoadingSkeleton className={chartClassName} />
        </Col>
        <Col lg={6}>
          <LoadingSkeleton className={chartClassName} />
        </Col>
      </Row>
    </LeftRightPadding>
  );
}
