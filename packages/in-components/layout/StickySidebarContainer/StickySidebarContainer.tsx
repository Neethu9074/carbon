/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Col, Row } from 'in-components/layout/Grid';

import locals from './StickySidebarContainer.mless';

export default function StickySidebarContainer(props) {
  const { sidebar, children, sidebarWidth = 2, topOffset = '11rem' } = props;

  return (
    <Row>
      <Col
        lg={sidebarWidth}
        md={sidebarWidth + 1}
        xs={sidebarWidth + 1}
        className={locals.sideBarSticky}
        style={{ '--topOffset': topOffset }}
      >
        {sidebar}
      </Col>
      <Col lg={12 - sidebarWidth} md={11 - sidebarWidth} xs={11 - sidebarWidth} className={locals.rightColumn}>
        {children}
      </Col>
    </Row>
  );
}
