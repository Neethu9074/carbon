/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from './StickySidebarContainer.mless';

export interface StickySidebarContainerProps {
  sidebar: React.ReactChild;
  children: React.ReactChildren;
  sidebarWidth?: number;
  topOffset?: string;
}

export default function StickySidebarContainer(props: StickySidebarContainerProps) {
  const { sidebar, children, sidebarWidth = 2, topOffset = '11rem' } = props;

  return (
    <Row>
      <Col
        as="section"
        lg={sidebarWidth}
        md={sidebarWidth + 1}
        xs={sidebarWidth + 1}
        className={locals.sideBarSticky}
        style={{ '--topOffset': topOffset }}
        ariaLabel={t('in-components:pageStructure.pageSubMenu')}
      >
        {sidebar}
      </Col>
      <Col
        as="section"
        lg={12 - sidebarWidth}
        md={11 - sidebarWidth}
        xs={11 - sidebarWidth}
        className={locals.rightColumn}
        ariaLabel={t('in-components:pageStructure.contentAriaLabel')}
      >
        {children}
      </Col>
    </Row>
  );
}
