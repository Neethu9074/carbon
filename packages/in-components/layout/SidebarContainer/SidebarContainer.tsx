/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Col, Row } from 'in-components/layout/Grid';

import locals from 'in-components/layout/SidebarContainer/SidebarContainer.mless';

export interface SidebarContainerProps {
  sidebar: React.ReactChild;
  children: React.ReactChildren | React.ReactNode;
  sidebarWidth?: number;
}

export default function SidebarContainer(props: SidebarContainerProps) {
  const { sidebar, children, sidebarWidth = 2 } = props;

  return (
    <Row>
      <Col lg={sidebarWidth} md={sidebarWidth + 1} xs={sidebarWidth + 1}>
        {sidebar}
      </Col>
      <Col lg={12 - sidebarWidth} md={11 - sidebarWidth} xs={11 - sidebarWidth} className={locals.rightColumn}>
        {children}
      </Col>
    </Row>
  );
}
